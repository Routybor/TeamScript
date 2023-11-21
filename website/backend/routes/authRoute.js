const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/addNewUser', authController.addUserHandler);
router.get('/checkUser', authController.checkUserHandler);

module.exports = router
