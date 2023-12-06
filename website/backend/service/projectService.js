const {getUsersProjectsDB, getUserIdByTokenDB} = require('../database/dbQueries');

async function getProjectsHandler(token) {
    try {
        const userId = await getUserIdByTokenDB(token);
        const allProjects = await getUsersProjectsDB(userId);
        return allProjects;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getProjectsHandler,
};