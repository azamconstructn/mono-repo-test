import { FilterQuery, PopulateOptions } from 'mongoose';
import _ from 'lodash';

import { Structure, StructureModel } from '@t3d/db-models';
import { NotFoundError, ValidationError } from '@t3d/core-utils';

const getStructureHierarchy = async (
    projectId: string,
//   structureId: string | null
) => {
    const query: FilterQuery<Structure> = {};
    query.project = projectId;
    //   if (!structureId) query.parent = null;
    //   else query.structure = structureId;
    query.parent = null;
    query.isDeleted = false;

    const buildPopulate = (depth: number): PopulateOptions[] => {
        const childrenPopulate: PopulateOptions = {
            path: 'children',
            select: '-__v -createdAt -updatedAt ',
            options: { sort: { wbs: 1, createdAt: 1 } },
        };
        if (depth > 0) childrenPopulate.populate = buildPopulate(depth - 1);
        return [
            childrenPopulate,
            {
                path: 'designs.config.type',
                select: '-__v -createdAt -updatedAt',
            },
        ];
    };

    const populate = buildPopulate(9);
    
    let mStructures: Structure[] = await StructureModel.find(
        query,
        '-__v -createdAt -updatedAt ',
        { populate }
    ).sort({ wbs: 1, createdAt: 1 });
    return mStructures;
};

const generateStructureName = (structureName: string, siblingNames: string[]) => {
    let name = structureName;
    let nameGenerated = false;
    while (!nameGenerated) {
        let regex = new RegExp('^' + name.replace(/\(/g, '\\(').replace(/\)/g, '\\)') + '$', 'i');          
        const found = _.find(siblingNames, item => regex.test(item));
        if (found) {
            name = name + ' (1)';
        } else {
            nameGenerated = true;
        }
    }
    return name;
}

const addMultipleStructures = async (projectId: string, parent: string, prefix: string, count: number, wbs: number, type: string, isExterior: boolean) => {
    const siblingStructures = await StructureModel.find({
      project: projectId,
      parent: parent,
      isDeleted: false
    });
    const result: Structure[] = [];
    for (let i = 1; i <= count; i++) {
        let name = prefix + ` ${i}`;
        name = generateStructureName(name, siblingStructures.map(item => item.name));
        const currentWbs = wbs + i - 1;
        let model = new StructureModel({
            name,
            parent,
            type,
            isExterior,
            project: projectId,
            wbs: currentWbs,
        });
        let mStructure: Structure = await model.save();
        result.push(mStructure);
    }
    let updates = [];
    if (wbs > 0) {
        const elderSiblingStructures = _.filter(siblingStructures, item => (item.wbs != undefined) && (item.wbs >= wbs))
            .sort((a: any, b: any) => a.wbs - b.wbs);
        let currentWbs = wbs + count;
        for (let singleStructure of elderSiblingStructures) {
            updates.push({
                _id: singleStructure._id,
                update: { wbs: currentWbs }
            });
            currentWbs += 1;
        }
    }
    await StructureModel.bulkWrite(updates.map(item => ({
        updateOne: {
            filter: { _id: item._id },
            update: item.update
        }
    })));
    return result;
}

const rearrangeWbsIds = async (newParent: string, structureId: string, newWbsId: number) => {
    const structure = await StructureModel.findById(structureId);
    if (!structure) {
        throw new NotFoundError(`Structure with ID ${structureId} not found`);
    }
    let currParent = structure.parent;
    let currWbsId = structure.wbs;
    if (currParent === newParent && currWbsId === newWbsId) {
        return {
            success: true,
            message: `No changes needed for structure ${structure.name}`
        }
    }
    let structureName = structure.name;
    let updates = [];
    if (currParent !== newParent) {
        let newSiblings = await StructureModel.find({
            parent: newParent,
            isDeleted: false
        });
        structureName = generateStructureName(structureName, newSiblings.map(item => item.name));

        await StructureModel.findOneAndUpdate(
            { _id: currParent },
            { $pull: { children: structureId } }
        );
        await StructureModel.findOneAndUpdate(
            { _id: newParent },
            { $addToSet: { children: structureId } }
        );
        let currSiblings = await StructureModel.find({
            _id: { $ne: structureId },
            parent: currParent,
            isDeleted: false,
            wbs: { $gte: currWbsId }
        }).sort({ wbs: 1 });
        let wbs = currWbsId;
        for (let sibling of currSiblings) {
            updates.push({
                _id: sibling._id,
                update: { wbs: wbs }
            });
            wbs += 1;
        }
        newSiblings = newSiblings
            .filter(sibling => sibling.parent === newParent && sibling.isDeleted === false && sibling.wbs >= newWbsId)
            .sort((a, b) => a.wbs - b.wbs);
        wbs = newWbsId;
        for (let sibling of newSiblings) {
            wbs += 1;
            updates.push({
                _id: sibling._id,
                update: { wbs: wbs }
            });
        }
    } else {
        let offset = 0;
        let upperLimit;
        let lowerLimit;
        if (currWbsId > newWbsId) {
            offset = 1;
            upperLimit = currWbsId;
            lowerLimit = newWbsId;
        } else {
            offset = -1;
            upperLimit = newWbsId;
            lowerLimit = currWbsId;
        }
        let currSiblings = await StructureModel.find({
            _id: { $ne: structureId },
            parent: newParent,
            isDeleted: false,
            wbs: { $gte: lowerLimit, $lte: upperLimit }
        }).sort({ wbs: 1 });
        for (let sibling of currSiblings) {
            updates.push({
                _id: sibling._id,
                update: { wbs: sibling.wbs + offset }
            });
        }
    }

    updates.push({
        _id: structureId,
        update: { name: structureName, parent: newParent, wbs: newWbsId }
    });

    await StructureModel.bulkWrite(
        updates.map(update => ({
            updateOne: {
                filter: { _id: update._id },
                update: { $set: update.update }
            }
        }))
    );

    return {
        success: true,
        message: `Successfully updated WBS for structure ${structureId}`
    }
}

export const structureV1Service = {
    getStructureHierarchy,
    // addStructure,
    addMultipleStructures,
    rearrangeWbsIds,
}