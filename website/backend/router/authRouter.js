const express = require('express')
const router = express.Router()
const { addUserHandler, checkUserHandler } = require('../service/authService')

router.post('/addNewUser', addUserController);
router.get('/checkUser', checkUserController);

async function addUserController(req, res) {
    const name = req.body.username;
    const password = req.body.password;
    const result = await addUserHandler(name, password);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting data from database' });
    }
}

async function checkUserController(req, res) {
    const username = req.body.username;
    const result = await checkUserHandler(username);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting data from database' });
    }
}

module.exports = router
