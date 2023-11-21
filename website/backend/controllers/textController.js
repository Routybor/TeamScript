//? SERVICE LAYER - реализация логики и организация связи к бд

const { sendTextToClients } = require("../socket");
const { getTextDB, saveTextDB } = require('../database/dbQueries');

async function getTextHandler(req, res) {
    try {
        const text = await getTextDB();
        res.json(text);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while getting text from the database' });
    }
}

async function saveTextHandler(req, res) {
    const newText = req.body.textField;

    try {
        const savedText = await saveTextDB(newText);
        sendTextToClients(newText);
        res.json(savedText);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while saving text to the database' });
    }
}

module.exports = {
    getTextHandler,
    saveTextHandler,
};