const {getUsersProjectsDB, getUserIdByTokenDB} = require('../database/dbQueries');

async function getProjectsHandler(token) {
    try {
        const userId = await getUserIdByTokenDB(token);
        // console.log(userId);
        const allProjects = await getUsersProjectsDB(userId.mytable_key);
        return allProjects;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getProjectsHandler,
};