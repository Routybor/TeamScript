const { sendUpdateToClients, updateStates } = require("../socket");
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
    deleteStateFromDB,
    deleteTasksWithStateFromProjectTable,
    renameTaskInDB,
    changeTaskDescriptionInDB,
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
        updateStates();
        // console.log(res);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteStateHandler = async (projectId, stateToDelete) => {
    try {
        // Удаляем состояние проекта из базы данных
        const success = await deleteStateFromDB(projectId, stateToDelete);
        
        // Удаляем все строки с указанным текущим состоянием из таблицы проекта
        const tasksDeleted = await deleteTasksWithStateFromProjectTable(projectId, stateToDelete);
        updateStates();
        // Возвращаем результат удаления состояния и задач
        return success && tasksDeleted;
    } catch (error) {
        console.error(error);
        return false;
    }
};



async function setTaskPriorityHandler(taskId, priority, projectId) {
    try {
        const changedTask = await setTaskPriorityDB(taskId, priority, projectId);
        sendUpdateToClients();
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
        updateStates();
        return success;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const renameTaskHandler = async (taskId, newName, projectId) => {
    try {
        const renamedTask = await renameTaskInDB(taskId, newName, projectId);
        sendUpdateToClients();
        return renamedTask;
    } catch (error) {
        console.error(error);
        return null;
    }
};


const changeTaskDescriptionHandler = async (taskId, newDescription, projectId) => {
    try {
        const updatedTask = await changeTaskDescriptionInDB(taskId, newDescription, projectId);
        sendUpdateToClients();
        return updatedTask;
    } catch (error) {
        console.error(error);
        return null;
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
    renameTaskHandler,
    changeTaskDescriptionHandler,
};