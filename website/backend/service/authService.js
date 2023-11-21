const { insertUserDB, userExistsDB } = require('../database/dbQueries');
const crypto = require('crypto');

async function addUserHandler(name, password) {
    try {
        const resultDB = await insertUserDB(name, password);
        return resultDB
    } catch (error) {
        console.error(error);
        return null
    }
}

async function checkUserHandler(username) { //! FIX
    try {
        const resultDB = await userExistsDB(username);
        return resultDB
    } catch (error) {
        console.error(error);
        return null
    }
}

module.exports = {
    addUserHandler,
    checkUserHandler,
};