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

const insertUserDB = async (name, paswd, token) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, passwd, token) values($1, $2, $3) RETURNING *', [name, paswd, token], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
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

const getProjectNameDB = async (projectId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT project_name FROM projects where project_id = $1', [projectId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while getting project name from database'));
            }
        });
    });
};

const getUsersProjectsDB = async (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT project_id FROM user_projects where user_id = $1', [userId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while getting all users projects from database'));
            }
        });
    });
};

const addRelationUserProjectDB = async (userId, projectId) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO user_projects (project_id, user_id) values($1, $2)', [projectId, userId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while adding relation between user_id and project_id'));
            }
        });
    });
};

const createNewProjectDB = async (projectName) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO projects (project_name) VALUES ($1); SELECT LASTVAL() AS project_id', [projectName], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while adding relation between user_id and project_id'));
            }
        });
    });
};

// запрос на создание новой таблицы для проекта
// название будет формироваться как "Project + UniqueId"
// Пока не совсем ясен вопрос с безопастностью в данном моменте
// но скорее всего придется при каждом действии связанном с каким либо проекто
// проверять явлется ли user его участником, а в будущем также и роль - прописать в servise

const createTableProjectDB = async (projectName) => {
    return new Promise((resolve, reject) => {
        pool.query(`CREATE TABLE $1
        (
            task_id    serial primary key,
            task_name        VARCHAR(40) not null,
            task_state VARCHAR(40) not null,
            person    int
            
        );`, [projectName], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while creating new tasks table'));
            }
        });
    });
};

// запрос на удаление новой таблицы для проекта
// вопросы безопастни как и функции выше

const deleteTableProjectDB = async (projectName) => {
    return new Promise((resolve, reject) => {
        pool.query('drop TABLE $1', [projectName], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while deleting table'));
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
    getProjectNameDB,
    getUsersProjectsDB,
    addRelationUserProjectDB,
    createNewProjectDB,
    createTableProjectDB,
    deleteTableProjectDB
};