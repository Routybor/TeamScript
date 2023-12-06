const {getUsersProjectsDB, getUserIdByTokenDB, createNewProjectDB, addRelationUserProjectDB} = require('../database/dbQueries');

async function getProjectsHandler(token) {
    try {
        const userId = await getUserIdByTokenDB(token);
        const allProjects = await getUsersProjectsDB(userId.mytable_key);
        return allProjects;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function createProjectHandler(token, projectName) {
    try {
        const userId = await getUserIdByTokenDB(token);
        const newProjectID = await createNewProjectDB(projectName);
        await addRelationUserProjectDB(userId.mytable_key, newProjectID.project_id);
        return newProjectID;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getProjectsHandler,
    createProjectHandler,
};