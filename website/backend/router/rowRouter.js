const express = require('express')
const router = express.Router()
const { getStateHandler, addStateHandler, changeStateNameHandler, deleteStateHandler} = require('../service/taskService')

router.post('/getStates', getStateController);
router.post('/addStates', addStateController);
router.delete('/deleteStates', deleteStateController);
router.post('/changeStateName', changeStateNameController);

// Обработчик запроса для изменения имени состояния проекта
async function changeStateNameController(req, res) {
    const projectId = req.body.projectId;
    const newStateName = req.body.newStateName;
    const oldStateName = req.body.oldStateName;
    const success = await changeStateNameHandler(projectId, newStateName, oldStateName);
    if (success) {
        res.json({ message: 'State name changed successfully' });
    } else {
        res.status(500).json({ error: 'Something went wrong while changing the state name' });
    }
}

async function getStateController(req, res) {
    const projectId = req.body.project_id;
    const result = await getStateHandler(projectId);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting states from db' });
    }
}

async function addStateController(req, res) {
    const projectId = req.body.project_id;
    const stateName = req.body.state;
    const result = await addStateHandler(projectId, stateName);
    if (result) {
        res.json(result);
    } else {
        console.log(result);
        res.status(500).json({ error: 'Error while adding state to taskboard' });
    }
}

// Обработчик запроса для удаления состояния проекта
async function deleteStateController(req, res) {
    const projectId = req.body.projectId;
    const stateName = req.body.stateToDelete;
    const success = await deleteStateHandler(projectId, stateName);
    if (success) {
        res.json({ message: 'Project state deleted successfully' });
    } else {
        res.status(500).json({ error: 'Something went wrong while deleting the project state' });
    }
}

module.exports = router