const { sendTextToClients } = require("../socket");
const { getTextDB, saveTextDB } = require('../database/dbQueries');

async function getTextHandler() {
    try {
        const text = await getTextDB();
        return text;
    } catch (error) {
        console.error(error);
    }
}

async function saveTextHandler(newText) {
    try {
        const savedText = await saveTextDB(newText);
        sendTextToClients(newText);
        return savedText
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getTextHandler,
    saveTextHandler,
};