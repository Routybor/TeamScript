const express = require('express')
const router = express.Router()
const { getTasksHandler, createTaskHandler, setTaskStateHandler, deleteTaskHandler, getStateHandler} = require('../service/taskService')

router.post('/getTasks', getTasksController);
router.post('/createTask', createTaskController);
router.post('/changeState', setTaskStateController);
router.post('/deleteTask', deleteTaskController);
router.post('/getStates', getStateController);

async function getTasksController(req, res) {
    const curToken = req.body.userToken;
    const projectId = req.body.projectToken;
    const result = await getTasksHandler(projectId, curToken);
    // console.log(result);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function createTaskController(req, res) {
    const newTaskName = req.body.taskName;
    const newState = req.body.newState;
    const projectId = req.body.projectToken;
    const result = await createTaskHandler(newTaskName, newState, projectId);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function setTaskStateController(req, res) {
    const taskId = req.body.taskID;
    const newState = req.body.newState;
    const projectId = req.body.projectToken;
    const result = await setTaskStateHandler(taskId, newState, projectId);
    console.log(result);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function deleteTaskController(req, res) {
    const taskId = req.body.taskID;
    const projectId = req.body.projectToken;
    console.log(taskId);
    console.log(projectId);
    const result = await deleteTaskHandler(taskId, projectId);
    console.log(result);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function getStateController(req, res) {
    // const curToken = req..userToken;
    const projectId = req.body.projectToken;
    const result = await getStateHandler(projectId);
    console.log(result);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting states from db' });
    }
}

module.exports = router
