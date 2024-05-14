const express = require('express')
const router = express.Router()
const {getProjectsHandler, createProjectHandler, invitePersonHandler, deleteProjectHandler, changeProjectNameHandler} = require('../service/projectService')

router.get('/getProjects', getProjectsController);
router.post('/createProject', createProjectController);
router.post('/invitePerson', invitePersonController);
router.delete('/deleteProject', deleteProjectController);
router.post('/changeName', changeNameController);

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

// Обработчик для удаления проекта
async function deleteProjectController(req, res) {
    const curToken = req.headers.token;
    const projectId = req.body.ProjectId;
    const success = await deleteProjectHandler(projectId);
    if (success) {
        res.json({ message: 'Project deleted successfully' });
    } else {
        res.status(500).json({ error: 'Something wrong while deleting the project' });
    }
}

// обработчик для изменения имени проекта
async function changeNameController(req, res) {
    const projectId = req.body.projectId;
    const newName = req.body.newName;
    const success = await changeProjectNameHandler(projectId, newName);
    if (success) {
        res.json({ message: 'Project name changed successfully' });
    } else {
        res.status(500).json({ error: 'Something wrong while changing the project name' });
    }
}

module.exports = router
