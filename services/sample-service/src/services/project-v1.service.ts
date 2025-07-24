const createProject = async () => {
    console.log("Create Project V1")
    return {
        version: "v1",
        action: "create"
    }
}

const editProject = async () => {
    console.log("Edit Project V1")
    return {
        version: "v1",
        action: "edit"
    }
}

const deleteProject = async () => {
    console.log("Delete Project V1")
    return {
        version: "v1",
        action: "delete"
    }
}

export const projectV1Service = {
    createProject,
    editProject,
    deleteProject
};