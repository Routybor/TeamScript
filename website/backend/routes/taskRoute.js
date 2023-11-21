const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')

router.get('/tasks', tasksController.getTasksHandler);
router.post('/createTask', tasksController.createTaskHandler);
router.post('/changeState', tasksController.setTaskStateHandler);
router.post('/deleteTask', tasksController.deleteTaskHandler);

module.exports = router
