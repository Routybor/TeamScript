const express = require('express')
const router = express.Router()
const {getProjectsHandler, createProjectHandler} = require('../service/projectService')

router.get('/getProjects', getProjectsController);
router.post('/createProject', createProjectController);

async function getProjectsController(req, res) {
    const curToken = req.headers.token;
    if (curToken) {
        const allProjects = await getProjectsHandler(curToken);
        res.json(allProjects);
    } else {
        res.status(500).json({ error: 'Something wrong while getting task list' });
    }
}

async function createProjectController(req, res) {
    const curToken = req.headers.token;
    const projectName = req.body.ProjectName;
    console.log(curToken);
    console.log(projectName);
    if (curToken && projectName) {
        const projectId = await createProjectHandler(curToken, projectName);
        res.json(projectId);
    } else {
        res.status(500).json({ error: 'Something wrong while creating new project' });
    }
}

module.exports = router
