const { sendUpdateToClients } = require("../socket");
const { getTasksDB, 
    createTaskDB, 
    setTaskStateDB, 
    deleteTaskDB, 
    getUserIdByTokenDB, 
    checkUserPermissionDB, 
    getStatesByProjectId, 
    addStatesByProjectId, 
    setTaskPriorityDB,
    changeStateNameInDB,
} = require('../database/dbQueries');

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

async function createTaskHandler(newTaskName, newState, priority, projectId) {
    try {
        const createdTask = await createTaskDB(newTaskName, newState, priority, projectId);
        sendUpdateToClients();
        return createdTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function setTaskStateHandler(taskId, newState, projectId) {
    try {
        // Получаем список всех состояний для проекта
        const allStates = await getStatesByProjectId(projectId);
        // Проверяем, существует ли newState в полученных состояниях
        const newStateExists = allStates.some(stateObj => stateObj.row_state === newState);
        if (!newStateExists) {
            console.log(`State '${newState}' does not exist.`);
            return null;
        }
        // Если состояние существует, меняем его
        const changedTask = await setTaskStateDB(taskId, newState, projectId);
        // sendUpdateToClients();
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

async function getStateHandler(projectId) {
    try {
        // const userId = await getUserIdByTokenDB(token);
        // const check = await checkUserPermissionDB(projectId, userId.mytable_key);
        // if(check.exist == "f"){
        //     return null;
        // }
        const allStates = await getStatesByProjectId(projectId);
        return allStates;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function addStateHandler(projectId, stateName) {
    try {
        // const userId = await getUserIdByTokenDB(token);
        // const check = await checkUserPermissionDB(projectId, userId.mytable_key);
        // if(check.exist == "f"){
        //     return null;
        // }
        const res = await addStatesByProjectId(projectId, stateName);
        // console.log(res);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteStateHandler(projectId, stateName) {
    try {
        // const userId = await getUserIdByTokenDB(token);
        // const check = await checkUserPermissionDB(projectId, userId.mytable_key);
        // if(check.exist == "f"){
        //     return null;
        // }
        const res = await deleteStatesByProjectId(projectId, stateName);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function setTaskPriorityHandler(taskId, priority, projectId) {
    try {
        const changedTask = await setTaskPriorityDB(taskId, priority, projectId);
        // sendUpdateToClients();
        return changedTask;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const changeStateNameHandler = async (projectId, newStateName, oldStateName) => {
    try {
        // Выполняем запрос к базе данных для изменения имени состояния проекта
        const success = await changeStateNameInDB(projectId, newStateName, oldStateName);
        return success;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = {
    getTasksHandler,
    createTaskHandler,
    setTaskStateHandler,
    deleteTaskHandler,
    getStateHandler,
    addStateHandler,
    deleteStateHandler,
    setTaskPriorityHandler,
    changeStateNameHandler,
};