const { insertUserDB, userExistsDB } = require('../database/dbQueries');
const dotenv = require("dotenv");
const crypto = require('crypto');
dotenv.config({ path: "../../../.env" });
const secretKey = process.env.SECRETKEY;

async function addUserHandler(name, password) {
    try {
        const userWithKey = name + secretKey;
        const token = crypto.createHash('sha256').update(userWithKey).digest('hex');
        await insertUserDB(name, password, token);
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function checkUserHandler(username) { //! FIX
    try {
        const exists = await userExistsDB(username);
        return exists;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    addUserHandler,
    checkUserHandler,
};