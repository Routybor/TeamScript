const express = require('express')
const router = express.Router()
const { getTasksHandler, createTaskHandler, setTaskStateHandler, deleteTaskHandler } = require('../service/taskService')

router.get('/tasks', getTasksController);
router.post('/createTask', createTaskController);
router.post('/changeState', setTaskStateController);
router.post('/deleteTask', deleteTaskController);

async function getTasksController(req, res) {
    const result = await getTasksHandler();

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function createTaskController(req, res) {
    const newTaskName = req.body.taskName;
    const newState = req.body.newState;
    const result = await createTaskHandler(newTaskName, newState);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function setTaskStateController(req, res) {
    const taskId = req.body.taskID;
    const newState = req.body.newState;
    const result = await setTaskStateHandler(taskId, newState);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function deleteTaskController(req, res) {
    const taskId = req.body.taskID;
    const result = await deleteTaskHandler(taskId);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

module.exports = router
