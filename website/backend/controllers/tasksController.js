//? SERVICE LAYER - реализация логики и организация связи к бд

const { sendUpdateToClients } = require("../socket");
const { getTasksDB, createTaskDB, setTaskStateDB, deleteTaskDB } = require('../database/dbQueries');

async function getTasksHandler(req, res) {
    try {
        const tasks = await getTasksDB();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function createTaskHandler(req, res) {
    const newTaskName = req.body.taskName;
    const newState = req.body.newState;

    try {
        const createdTask = await createTaskDB(newTaskName, newState);
        sendUpdateToClients();
        res.json(createdTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while creating a new task in the database' });
    }
}

async function setTaskStateHandler(req, res) {
    const taskId = req.body.taskID;
    const newState = req.body.newState;

    try {
        const updatedTask = await setTaskStateDB(taskId, newState);
        sendUpdateToClients();
        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while updating task state in the database' });
    }
}

async function deleteTaskHandler(req, res) {
    const taskId = req.body.taskID;

    try {
        const deletedTask = await deleteTaskDB(taskId);
        sendUpdateToClients();
        res.json(deletedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while deleting task from the database' });
    }
}

module.exports = {
    getTasksHandler,
    createTaskHandler,
    setTaskStateHandler,
    deleteTaskHandler,
};