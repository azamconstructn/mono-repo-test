const createProject = async () => {
    console.log("Create Project V2")
    return {
        version: "v2",
        action: "create"
    }
}

export const projectV2Service = {
    createProject
};