const express = require('express')
const router = express.Router()
const { getTasksHandler, 
    createTaskHandler, 
    setTaskStateHandler, 
    deleteTaskHandler, 
    getStateHandler, 
    addStateHandler, 
    setTaskPriorityHandler,
    renameTaskHandler,
    changeTaskDescriptionHandler
} = require('../service/taskService')

router.post('/getTasks', getTasksController);
router.post('/createTask', createTaskController);
router.post('/changeState', setTaskStateController);
router.post('/deleteTask', deleteTaskController);
router.post('/changePriority', setTaskPriorityController);
router.post('/renameTask', renameTaskController);
router.post('/changeDescription', changeTaskDescriptionController);

async function getTasksController(req, res) {
    const curToken = req.headers.token;
    // const curToken = req.body.userToken;
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
    const curToken = req.headers.token;
    const newTaskName = req.body.taskName;
    const newState = req.body.newState;
    const projectId = req.body.projectToken;
    const priority = req.body.priority;
    const result = await createTaskHandler(newTaskName, newState, priority, projectId);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function setTaskStateController(req, res) {
    const curToken = req.headers.token;
    const taskId = req.body.taskID;
    const newState = req.body.newState;
    const projectId = req.body.projectToken;
    const result = await setTaskStateHandler(taskId, newState, projectId);
    // console.log(result);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while changing state of task' });
    }
}

async function deleteTaskController(req, res) {
    const curToken = req.headers.token;
    const taskId = req.body.taskID;
    const projectId = req.body.projectToken;
    // console.log(taskId);
    // console.log(projectId);
    const result = await deleteTaskHandler(taskId, projectId);
    // console.log(result);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function setTaskPriorityController(req, res) {
    const curToken = req.headers.token;
    const taskId = req.body.taskID;
    const priority = req.body.priority;
    const projectId = req.body.projectToken;
    const result = await setTaskPriorityHandler(taskId, priority, projectId);
    console.log(result);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while changing priority of task' });
    }
}

async function renameTaskController(req, res) {
    const curToken = req.headers.token;
    const taskId = req.body.taskID;
    const newName = req.body.newName;
    const projectId = req.body.projectToken;
    const result = await renameTaskHandler(taskId, newName, projectId);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while renaming the task' });
    }
}

async function changeTaskDescriptionController(req, res) {
    const curToken = req.headers.token;
    const taskId = req.body.taskID;
    const newDescription = req.body.newDescription;
    const projectId = req.body.projectToken;
    const result = await changeTaskDescriptionHandler(taskId, newDescription, projectId);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while changing task description' });
    }
}

module.exports = router
