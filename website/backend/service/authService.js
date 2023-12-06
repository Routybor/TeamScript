const { insertUserDB, userExistsDB, checkPasswordDB, checkTokenDB } = require('../database/dbQueries');
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

async function checkUserHandler(username) {
    try {
        const exists = await userExistsDB(username);
        return exists;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function loginHandler(username, password) {
    try {
        const exists = await userExistsDB(username);
        if (exists) {
            const passwdDb = await checkPasswordDB(username);
            if (passwdDb.passwd == password) {
                const tokenDb = await checkTokenDB(username);
                return { Token: tokenDb.token };
            } else {
                return false;
            }
        } else {
            const userWithKey = username + secretKey;
            const token = crypto.createHash('sha256').update(userWithKey).digest('hex');
            await insertUserDB(username, password, token);
            return { Token: token };
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function registerHandler(username, password) {
    return null;
}

module.exports = {
    addUserHandler,
    checkUserHandler,
    loginHandler
};