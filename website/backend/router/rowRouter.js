const express = require('express')
const router = express.Router()
const { getStateHandler, addStateHandler} = require('../service/taskService')

router.post('/getStates', getStateController);
router.post('/addStates', addStateController);
// router.post('/deleteStates', deletStateController);

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
        res.status(500).json({ error: 'Error while adding state to taskboard' });
    }
}

// async function deletStateController(req, res) {
//     const projectId = req.body.projectToken;
//     const stateName = req.body.state;
//     const result = await deleteStateHandler(projectId, stateName);
//     console.log(result);
//     if (result) {
//         res.json(result);
//     } else {
//         res.status(500).json({ error: 'Error while getting states from db' });
//     }
// }

module.exports = router