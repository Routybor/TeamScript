const express = require('express')
const router = express.Router()
const { loginHandler, getLoginHandler } = require('../service/authService')

router.post('/login', loginController);
router.post('/getLogin', getLoginController);

/**
 * обработчик login запросов
 * @param {*} req 
 * @param {*} res 
 */
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

// router.get('/checkUser', checkUserController);
// async function checkUserController(req, res) {
//     const username = req.body.username;
//     const result = await checkUserHandler(username);

//     if (result) {
//         res.json(result);
//     } else {
//         res.status(500).json({ error: 'Error while getting data from database' });
//     }
// }

async function getLoginController(req, res) {
    const userId = req.body.userId;
    const result = await getLoginHandler(userId);
    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Something wrong while getting login' });
    }
}

module.exports = router
