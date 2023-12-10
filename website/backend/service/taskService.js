const { sendUpdateToClients } = require("../socket");
const { getTasksDB, createTaskDB, setTaskStateDB, deleteTaskDB, getUserIdByTokenDB, checkUserPermissionDB} = require('../database/dbQueries');

async function getTasksHandler(project_id, token) {
    try {
        const userid = await getUserIdByTokenDB(token);
        const check = await checkUserPermissionDB(project_id, userid);
        if(check.exist == "f"){
            return null;
        }
        const allTasks = await getTasksDB();
        return allTasks;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function createTaskHandler(newTaskName, newState) {
    try {
        const createdTask = await createTaskDB(newTaskName, newState);
        sendUpdateToClients();
        return createdTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function setTaskStateHandler(taskId, newState) {
    try {
        const changedTask = await setTaskStateDB(taskId, newState);
        sendUpdateToClients();
        return changedTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteTaskHandler(taskId) {
    try {
        const deletedTask = await deleteTaskDB(taskId);
        sendUpdateToClients();
        return deletedTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getTasksHandler,
    createTaskHandler,
    setTaskStateHandler,
    deleteTaskHandler,
};