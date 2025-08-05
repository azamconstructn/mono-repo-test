import { Request, Response, NextFunction } from "express";
import { ValidationError } from "@t3d/core-utils/errors";
import { DesignModel } from "@t3d/db-models";
import { NotesModel } from "@t3d/db-models/notes.model";
import { User, UserModel } from "@t3d/db-models/user.model";

import { AssetCategoryModel } from "@t3d/db-models/assetCategory.model";

import { ProjectConfigurationModel, ProjectConfigurationDocument } from "@t3d/db-models/project-configuration.model";
import { NotFoundError } from "@t3d/core-utils/errors";
import { error } from "console";
import { result } from "lodash";
import { StructureModel } from "@t3d/db-models";
import { UserEntityRoleModel } from "@t3d/db-models/userEntityRole.model";

const createNewConfig = async (
    req: Request
): Promise<ProjectConfigurationDocument> => {

    const project = req.params.projectId;
    let { name, color, type, entity } = req.body;
    name = name.trim();
    if (name === '') throw new ValidationError('empty option');
    // Check if a document with the same name, type, and project already exists
    const existingConfiguration = await ProjectConfigurationModel.findOne({
        name,
        type,
        entity,
        project,
    });
    if (existingConfiguration) {
        throw new ValidationError(`Same option exists. Please try again`);
    }
    const newProjectConfiguration = new ProjectConfigurationModel({
        name,
        project,
        color,
        type,
        entity,
    });
    try {
        const savedProjectConfiguration = await newProjectConfiguration.save();

        //   const allConfigurations = await ProjectConfigurationModel.find({
        //     project,
        //   });

        return savedProjectConfiguration;
    } catch (error: any) {
        throw new Error(`Failed to create new configuration: ${error.message}`);
    }
};
const updateConfig = async (
    req: Request
): Promise<ProjectConfigurationDocument> => {

    const { projectId, configId } = req.params;
    console.log(projectId, configId);
    const { name, color } = req.body;

    if (!name && !color) {
        throw new Error('At least one of name or color must be provided');
    }
    // Finding the existing configuration to be updated
    const existingConfiguration = await ProjectConfigurationModel.findById({
        _id: configId,
    });
    if (!existingConfiguration) {
        throw new ValidationError('Configuration not found');
    }

    // Checking if the new name already exists in same  project configuration  document
    if (name) {
        const duplicateConfiguration = await ProjectConfigurationModel.findOne({
            project: projectId,
            name: name,
            entity: req.body.entity,
            type: req.body.type,
        });
        if (duplicateConfiguration) {
            throw new ValidationError(`Configuration with name "${name}" already exists in this project.`);
        }
    }

    // Update the configuration
    if (name) existingConfiguration.name = name;
    if (color) existingConfiguration.color = color;

    try {
        const updatedConfiguration = await existingConfiguration.save();
        return updatedConfiguration;
    } catch (error: any) {
        throw new Error(`Failed to update configuration: ${error.message}`);
    }
};
const deleteConfig = async (
    req: Request
) => {

    try {
        const { projectId, configId } = req.params;
        const existingConfiguration = await ProjectConfigurationModel.findOne({
            _id: configId,
        });
        if (!existingConfiguration) {
            throw new NotFoundError('Configuration not found for the provided ID');
        }
        const entity = existingConfiguration.entity;
        const type: string = existingConfiguration.type;
        let entities: any[] = [];
        let categoryEntites: any[] = [];
        let query: any = { project: projectId };
        switch (entity) {
            case 'Tag':
                if (req.query.deleteTag == 'true') {
                    await NotesModel.updateMany(
                        { 'config.tags': configId }, // Match documents where config.tags contains the ID
                        { $pull: { 'config.tags': configId } } // Remove the ID from the array
                    );

                } else {
                    const notesWithTag = await NotesModel.find({
                        'config.tags': { $in: configId },
                        project: projectId,
                    }).select('_id');
                    entities = entities.concat(notesWithTag);
                }
                break;

            case 'BIM':
                const designsBim = await DesignModel.find({
                    'config.type': { $in: configId },
                    isDeleted: false,
                    project: projectId,
                }).select('_id');
                entities = entities.concat(designsBim);
                break;

            case 'Sheet':
                const designsSheet = await DesignModel.find({
                    'config.type': { $in: configId },
                    isDeleted: false,
                    project: projectId,
                }).select('_id');
                entities = entities.concat(designsSheet);
                const assetCategories = await AssetCategoryModel.find({
                    'config.type': { $in: configId },
                    project: projectId,
                }).select('_id');
                categoryEntites = categoryEntites.concat(assetCategories);
                break;
            case 'Note':
                if (type == 'Type') query['config.type'] = configId;
                if (type == 'Status') query['config.status'] = configId;
                if (type == 'Priority') query['config.priority'] = configId;
                const notes = await NotesModel.find(query).select('_id');
                entities = entities.concat(notes);
                break;
            default:
                throw new Error('Invalid entity type');
        }
        if (entities.length > 0) {
            return {
                success: true, message: 'Entities attached', result: {
                    designEntities: entities.map((entity) => entity._id),
                    categoryEntities: categoryEntites.map((entity) => entity._id),
                }
            };
            // res.status(200).json({
            //     success: true,
            //     message: 'Entities attached',
            //     // result: entities.map((entity) => entity._id),
            //     // categoryEntites: categoryEntites.map((entity) => entity._id),
            //     //combine both entities and categoryEntites into a field called combinedEntities with key as designEntities and categoryEntities
            //     result: {
            //         designEntities: entities.map((entity) => entity._id),
            //         categoryEntities: categoryEntites.map((entity) => entity._id),
            //     },
            // });
        } else {
            await ProjectConfigurationModel.deleteOne({ _id: configId });
            return { success: true, message: 'Configuration deleted as no entities are attached' }

        }
    } catch (err) {
        throw error(error);
    }
};
const forceDeleteConfig = async (
    req: Request
) => {
    const { projectId, configId } = req.params;
    console.log(req.body);
    const { entityIds, replaceId } = req.body;

    //  let existingConfiguration:any=ProjectConfigurationModel.findOne({_id:req.params.configId});
    let replacedConfiguration: ProjectConfigurationDocument | null =
        await ProjectConfigurationModel.findOne({ _id: replaceId });
    console.log('configurations', replacedConfiguration);
    if (!replacedConfiguration) {
        throw error(
            404,
            'Configuration not found for the provided ID provide valid replace id'
        );
    }
    if (replacedConfiguration.name === 'Architectural Sheet')
        throw new ValidationError('You cannot replace to Architectural Sheet ');
    let updateObj = {};
    if (replacedConfiguration.entity != 'Tag') {
        switch (replacedConfiguration.type) {
            case 'Type':
                if (replacedConfiguration.entity === 'BIM')
                    updateObj = { $set: { 'config.type': replacedConfiguration._id } };
                else
                    updateObj = {
                        $set: {
                            'config.type': replacedConfiguration._id,
                            type: replacedConfiguration.name,
                        },
                    };
                break;
            case 'Status':
                updateObj = {
                    $set: {
                        'config.status': replacedConfiguration._id,
                        status: replacedConfiguration.name,
                    },
                };
                break;
            case 'Priority':
                updateObj = {
                    $set: {
                        'config.priority': replacedConfiguration._id,
                        priority: replacedConfiguration.name,
                    },
                };
                break;
            default:
                throw new Error('Invalid configuration type');
        }
    } else if (replacedConfiguration.entity == 'Tag') {
        updateObj = {
            $push: {
                'config.tags': replacedConfiguration._id, // Push _id into config.tags array
                tags: replacedConfiguration.name, // Push name into tags array
            },
        };
    }
    if (replacedConfiguration.type === 'Type') {
        let replacedConfigurationDesigns = await DesignModel.find({
            'config.type': replacedConfiguration._id,
        });
        let structureArray = [];
        if (
            replacedConfigurationDesigns &&
            replacedConfigurationDesigns.length > 0
        ) {
            for (let design of replacedConfigurationDesigns) {
                if (design.status === 'active') {
                    structureArray.push(design.structure);
                }
            }
        }
        if (structureArray.length > 0) {
            let designs = await DesignModel.updateMany(
                {
                    _id: { $in: entityIds },
                    structure: { $in: structureArray },
                    status: 'active',
                },
                { $set: { status: 'inReview' } }, { new: true }
            );
        }
    }
    for (let entityId of entityIds) {
        if (entityId.startsWith('NTE')) {
            //checking if replaced tag id and exisiting tagid is same or not if same skipping it
            if (replacedConfiguration.entity == 'Tag') {
                let mNote = await NotesModel.findOne({
                    _id: entityId,
                    'config.tags': replacedConfiguration._id,
                });
                if (mNote) {
                    continue;
                }
            }
            const updatedNote = await NotesModel.findOneAndUpdate(
                { _id: entityId },
                updateObj
            );
        }

        if (entityId.startsWith('DSG')) {
            const updatedDesign = await DesignModel.findOneAndUpdate(
                { _id: entityId },
                updateObj
            );
            let mDesigns = await DesignModel.find({
                structure: updatedDesign?.structure,
                status: { $nin: 'inActive' },
            });
            let mStructure = await StructureModel.findOneAndUpdate(
                { _id: updatedDesign?.structure },
                { designs: mDesigns },
                { new: true }
            );
        }
    }
    await ProjectConfigurationModel.deleteOne({ _id: configId });
    return {
        success: true,
        message:
            'Configuration deleted and entities are replaced with provided Id',
    };
};
const getAllConfigs = async (req: Request) => {
    const { projectId } = req.params;
    let user: User = JSON.parse(JSON.stringify(req.headers.user));

    try {
        let myRole = await UserEntityRoleModel.aggregate([
            {
                '$match': {
                    'user': user._id,
                    'entityId': projectId
                }
            }, {
                '$lookup': {
                    'from': 'roles',
                    'localField': 'role',
                    'foreignField': '_id',
                    'as': 'role'
                }
            }, {
                '$unwind': {
                    'path': '$role'
                }
            }
        ])
        myRole = myRole[0].role.permissions;

        let query: any = { project: projectId };
        let entity = []
        if (myRole.includes('PEM-VIEW_NOTE_TYPE')) {
            entity.push("Note");
        }
        if (myRole.includes('PEM-VIEW_BIM_TYPE')) {
            entity.push("BIM");
        }
        if (myRole.includes('PEM-VIEW_SHEET_TYPE')) {
            entity.push("Sheet");
        }
        if (entity.length == 0) {
            return {
                success: true,
                message: "No data found",
            };
        }
        else {
            query.entity = { $in: entity }
        }

        const groupedData = await ProjectConfigurationModel.aggregate([
            { $match: query },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    color: 1,
                    entity: 1,
                    type: 1,
                    entityType: { $concat: ['$entity', '-', '$type'] },
                },
            },
            {
                $group: {
                    _id: '$entityType',
                    configurations: {
                        $push: {
                            _id: '$_id',
                            name: '$name',
                            color: '$color',
                            entity: '$entity',
                            type: '$type',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    entityType: '$_id',
                    configurations: 1,
                },
            },
        ]);
        interface Configuration {
            _id: string;
            name: string;
            color: string;
            entity: string;
            type: string;
        }
        interface GroupedByTypeResponse {
            success: boolean;
            result: {
                Project: string;
                [key: string]: Configuration[] | string;
            };
        }
        const response: GroupedByTypeResponse = {
            success: true,
            result: {
                Project: projectId,
            },
        };

        groupedData.forEach((group) => {
            if (!response.result[group.entityType]) {
                response.result[group.entityType] = [];
            }
            (response.result[group.entityType] as Configuration[]).push(
                ...group.configurations
            );
        });
        return response as any;
        // return res.status(200).json(response);

    } catch (error: any) {
        throw new Error(`Failed to get configurations: ${error.message}`);
        // return res.status(500).json({
        //     success: false,
        //     message: error.message,
        // });
    }
};
/**
 * Re-arrange the WBS of one ProjectConfiguration and
 * renumber the rest in that (project + entity + type) list.
 *
 * Works like the StructureModel helper you shared—no sessions,
 * no transactions—just plain queries and looped updates.
 */
export const rearrangeProjectConfigWbs = async (
    configId: string,
    newWbs: number,
): Promise<boolean> => {
    const config = await ProjectConfigurationModel.findById(configId);
    if (!config) throw new Error("Configuration not found");

    const { project, entity, type } = config;
    const currentWbs = config.wbs ?? 1;
    if (currentWbs === newWbs) return true; // nothing to do

    // 1️⃣  Move config itself to its target slot
    await ProjectConfigurationModel.findOneAndUpdate(
        { _id: configId },
        { $set: { wbs: newWbs } },
    );

    // 2️⃣  Collect all *other* rows we need to shift
    if (currentWbs > newWbs) {
        // moving UP  (e.g. 6 ➜ 2)  👉 bump others DOWN (+1)
        const affected = await ProjectConfigurationModel.find({
            _id: { $ne: configId },
            project,
            entity,
            type,
            wbs: { $gte: newWbs },
        }).sort({ wbs: 1 }); // ascending

        for (const row of affected) {
            await ProjectConfigurationModel.findOneAndUpdate(
                { _id: row._id },
                { $inc: { wbs: 1 } },
            );
        }
    } else {
        // moving DOWN (e.g. 2 ➜ 6) 👉 pull others UP (-1)
        const affected = await ProjectConfigurationModel.find({
            _id: { $ne: configId },
            project,
            entity,
            type,
            wbs: { $lte: newWbs },
        }).sort({ wbs: -1 }); // descending

        for (const row of affected) {
            await ProjectConfigurationModel.findOneAndUpdate(
                { _id: row._id },
                { $inc: { wbs: -1 } },
            );
        }
    }
    return true;
};
export const projectConfigurationV1Service = {
    createNewConfig,
    rearrangeProjectConfigWbs,
    updateConfig,
    deleteConfig,
    forceDeleteConfig,
    getAllConfigs
};