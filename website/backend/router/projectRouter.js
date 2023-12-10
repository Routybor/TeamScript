const express = require('express')
const router = express.Router()
const {getProjectsHandler, createProjectHandler} = require('../service/projectService')

router.get('/getProjects', getProjectsController);
router.post('/createProject', createProjectController);

async function getProjectsController(req, res) {
    const curToken = req.headers.token;
    // console.log(curToken); 
    const allProjects = await getProjectsHandler(curToken);
    if (curToken && allProjects) {
        // const allProjects = await getProjectsHandler(curToken);
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
    const projectId = await createProjectHandler(curToken, projectName);
    if (curToken && projectName && projectId) {
        res.json(projectId);
    } else {
        res.status(500).json({ error: 'Something wrong while creating new project' });
    }
}

module.exports = router
