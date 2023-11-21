const express = require('express')
const router = express.Router()
const textController = require('../controllers/textController')

router.get('/getText', textController.getTextHandler);
router.post('/saveText', textController.saveTextHandler);

module.exports = router
