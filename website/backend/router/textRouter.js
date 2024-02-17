const express = require('express')
const router = express.Router()
const { getTextHandler, saveTextHandler } = require('../service/textService')

router.get('/getText', getTextController);
router.post('/saveText', saveTextController);

async function getTextController(req, res) {
    const result = await getTextHandler();

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

async function saveTextController(req, res) {
    const newText = req.body.textField;
    const result = await saveTextHandler(newText);

    if (result) {
        res.json(result);
    } else {
        res.status(500).json({ error: 'Error while getting tasks from the database' });
    }
}

module.exports = router
