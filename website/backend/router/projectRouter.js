const express = require('express')
const router = express.Router()
const {getProjectsHandler, createProjectHandler} = require('../service/projectService')

router.get('/getProjects', getProjectsController);
router.post('/createProject', createProjectController);

async function getProjectsController(req, res) {
    const curToken = req.headers.token;
    const allProjects = await getProjectsHandler(curToken);
    if (curToken && allProjects) {
        res.json(allProjects);
    } else {
        res.status(500).json({ error: 'Something wrong while getting task list' });
    }
}

async function createProjectController(req, res) {
    // const curToken = req.body.userToken;
    const curToken = req.headers.token;
    const projectName = req.body.projectName;
    const projectId = await createProjectHandler(curToken, projectName);
    if (curToken && projectName && projectId) {
        res.json(projectId);
    } else {
        res.status(500).json({ error: 'Something wrong while creating new project' });
    }
}

module.exports = router
