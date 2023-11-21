//? SERVICE LAYER - реализация логики и организация связи к бд

const { insertUserDB, userExistsDB } = require('../database/dbQueries');
const crypto = require('crypto');

async function addUserHandler(req, res) {
    const name = req.body.username;
    const paswd = req.body.password;

    try {
        const result = await insertUserDB(name, paswd);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while getting data from database' });
    }
}

async function checkUserHandler(req, res) { //! FIX
    const username = req.body.username;

    try {
        const result = await userExistsDB(username);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error while getting data from database' });
    }
}

module.exports = {
    addUserHandler,
    checkUserHandler,
};