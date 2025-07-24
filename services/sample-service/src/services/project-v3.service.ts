const deleteProject = async () => {
    console.log("Delete Project V3")
    return {
        version: "v3",
        action: "delete"
    }
}

export const projectV3Service = {
    deleteProject
};