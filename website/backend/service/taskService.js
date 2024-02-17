const { sendUpdateToClients } = require("../socket");
const { getTasksDB, createTaskDB, setTaskStateDB, deleteTaskDB, getUserIdByTokenDB, checkUserPermissionDB} = require('../database/dbQueries');

async function getTasksHandler(projectId, token) {
    try {
        const userId = await getUserIdByTokenDB(token);
        const check = await checkUserPermissionDB(projectId, userId.mytable_key);
        if(check.exist == "f"){
            return null;
        }
        const allTasks = await getTasksDB(projectId);
        return allTasks;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function createTaskHandler(newTaskName, newState, projectId) {
    try {
        const createdTask = await createTaskDB(newTaskName, newState, projectId);
        sendUpdateToClients();
        return createdTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function setTaskStateHandler(taskId, newState, projectId) {
    try {
        const changedTask = await setTaskStateDB(taskId, newState, projectId);
        sendUpdateToClients();
        return changedTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteTaskHandler(taskId, projectId) {
    try {
        const deletedTask = await deleteTaskDB(taskId, projectId);
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