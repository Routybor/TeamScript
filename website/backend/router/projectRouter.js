const express = require('express')
const router = express.Router()
const {getProjectsHandler, createProjectHandler, invitePersonHandler} = require('../service/projectService')

router.get('/getProjects', getProjectsController);
router.post('/createProject', createProjectController);
router.post('/invitePerson', invitePersonController);

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

// handler приглашения человека в проект
async function invitePersonController(req, res) {
    const curToken = req.headers.token;
    const projectId = req.body.ProjectId;
    const toInviteToken = req.body.newToken;
    const ans = await invitePersonHandler(curToken, projectId, toInviteToken);
    if (ans) {
        res.json(projectId);
    } else {
        res.status(500).json({ error: 'Something wrong while creating new project' });
    }
}

module.exports = router
