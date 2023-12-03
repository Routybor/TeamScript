const express = require('express')
const router = express.Router()
const {loginHandler} = require('../service/authService')

router.post('/login', loginController);
// router.get('/checkUser', checkUserController);

async function loginController(req, res) {
    const name = req.body.Username;
    const password = req.body.Password;
    const result = await loginHandler(name, password);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Something wrong with login or password' });
    }
}

// async function checkUserController(req, res) {
//     const username = req.body.username;
//     const result = await checkUserHandler(username);

//     if (result) {
//         res.json(result);
//     } else {
//         res.status(500).json({ error: 'Error while getting data from database' });
//     }
// }

module.exports = router
