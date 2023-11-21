//? DATA-ACCESS LAYER - операции с бд

const pool = require("./dbConnect");

const getTextDB = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT text_column FROM text_table', (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while getting text from the database'));
            }
        });
    });
};

const saveTextDB = async (newText) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE text_table SET text_column = $1 WHERE id = 1 RETURNING *', [newText], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while saving text to the database'));
            }
        });
    });
};

const getTasksDB = async () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM user_tasks', (err, result) => {
            if (!err) {
                resolve(result.rows);
            } else {
                reject(new Error('Error while getting tasks from the database'));
            }
        });
    });
};

const createTaskDB = async (newTaskName, newState) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user_tasks (taskname, curstate) VALUES ($1, $2) RETURNING *', [newTaskName, newState], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while creating a new task in the database'));
            }
        });
    });
};

const setTaskStateDB = async (taskId, newState) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE user_tasks SET curstate = $1 WHERE id = $2 RETURNING *', [newState, taskId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while updating task state in the database'));
            }
        });
    });
};

const deleteTaskDB = async (taskId) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM user_tasks WHERE id = $1 RETURNING *', [taskId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while deleting task from the database'));
            }
        });
    });
};

const insertUserDB = async (name, paswd) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, passwd) values($1, $2)', [name, paswd], (err, result) => {
            if (!err) {
                resolve(result.rows);
            } else {
                console.error(err);
                reject(new Error('Error while getting data from database'));
            }
        });
    });
};

const userExistsDB = async (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT exists (SELECT FROM users where username = $1)', [name], (err, result) => {
            if (!err) {
                resolve(result.rows[0].exists);
            } else {
                reject(new Error('Error while checking user existence in the database'));
            }
        });
    });
};

module.exports = {
    getTextDB,
    saveTextDB,
    getTasksDB,
    createTaskDB,
    setTaskStateDB,
    deleteTaskDB,
    insertUserDB,
    userExistsDB,
};