import { FilterQuery, PopulateOptions } from 'mongoose';
import _ from 'lodash';

import { Structure, StructureModel } from '@t3d/db-models';

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

// const addStructure = async () => {
//     let eventType = "Added";
//     let user: User = JSON.parse(JSON.stringify(req.headers.user));
//     const projectId = req.params.projectId;
//     const body = req.body;
//     body["project"] = projectId;
//     if (body.parent == null)
//       throw new ValidationError("parent property is missing");

//     let parentStructureDetail = await StructureModel.findOne({ _id: body.parent, isDeleted: false });
//     if (parentStructureDetail?.name === body.name) {
//       throw new ValidationError("parent and children structure name are same")
//     }
//     const siblingStructures = await StructureModel.find({
//       // name: { $regex: new RegExp('^' + body.name + '$', 'i') },
//       project: projectId,
//       parent: body.parent,
//       isDeleted: false
//     });
//     const regex = new RegExp('^' + body.name + '$', 'i');
//     const foundItem = _.find(siblingStructures, item => regex.test(item.name));
//     if (foundItem)
//       throw new ValidationError(`Structure with name ${body.name} already exists in ${parentStructureDetail?.name} structure`)

//     let model = new StructureModel(body);
//     let wbs = req.body.wbs;
//     let mStructure: Structure = await model.save();
//     if (wbs !== undefined && wbs > 0) {
//       const elderSiblingStructures = _.filter(siblingStructures, item => (item.wbs != undefined) && (item.wbs >= req.body.wbs))
//         .sort((a: any, b: any) => a.wbs - b.wbs);
//       for (let singleStructure of elderSiblingStructures) {
//         wbs = wbs + 1;
//         await StructureModel.findOneAndUpdate(
//           { _id: singleStructure._id },
//           { wbs: wbs }
//         );
//       }
//       // await rearrangeWbs(mStructure._id, req.body.wbs)
//     }
//     s3Controller.generateFolderStructure(
//       process.env.S3_PROJECTS_BUCKET!!,
//       `${projectId}/structures/${mStructure._id}/`
//     );
//     let mProject = await ProjectModel.findOne({ _id: projectId });
//     const contextList = {
//       projectName: mProject?.name,
//       projectId: mProject?._id,
//       structureId: mStructure._id,
//     };
//     notificationbuilderService.generateNotificationObj(
//       user,
//       eventType,
//       eventEmitter,
//       contextList
//     );
//     return; 
// }

const addMultipleStructures = async (projectId: string, parent: string, prefix: string, count: number, wbs: number, type: string, isExterior: boolean) => {
    const siblingStructures = await StructureModel.find({
      project: projectId,
      parent: parent,
      isDeleted: false
    });
    const result: Structure[] = [];
    for (let i = 1; i <= count; i++) {
        let name = prefix + ` ${i}`;
        let createStructure = false;
        while (!createStructure) {
            const foundItem = _.find(siblingStructures, item => name.toLowerCase() === item.name.toLowerCase());
            if (foundItem) {
                name = name + ' (1)';
            } else {
                createStructure = true;
            }
        }
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
    if (wbs > 0) {
        const elderSiblingStructures = _.filter(siblingStructures, item => (item.wbs != undefined) && (item.wbs >= wbs))
            .sort((a: any, b: any) => a.wbs - b.wbs);
        let currentWbs = wbs + count;
        for (let singleStructure of elderSiblingStructures) {
            await StructureModel.findOneAndUpdate(
                { _id: singleStructure._id },
                { wbs: currentWbs }
            );
            currentWbs += 1;
        }
    }
    return result;
}

const rearrangeWbsIds = async (newParent: string, structureId: string, wbsId: number) => {
    
}

export const structureV1Service = {
    getStructureHierarchy,
    // addStructure,
    addMultipleStructures,
    rearrangeWbsIds,
}