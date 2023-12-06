const express = require('express')
const router = express.Router()
const {getProjectsHandler} = require('../service/projectService')

router.get('/getProjects', getProjectsController);

async function getProjectsController(req, res) {
    const result = req.headers.token;
    if (result) {
        // res.json(result);
        const allProjects = await getProjectsHandler(result);
        // console.log(result);
        // console.log(allProjects);
        res.json(allProjects);
    } else {
        res.status(500).json({ error: 'Something wrong while getting task list' });
    }
}



module.exports = router
