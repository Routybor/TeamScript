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

const getTasksDB = async (project_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM project${project_id}`, (err, result) => {
            if (!err) {
                resolve(result.rows);
            } else {
                reject(new Error('Error while getting tasks from the database'));
            }
        });
    });
};

const createTaskDB = async (newTaskName, newState, priority, project_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO project${project_id} (taskname, curstate, priority) VALUES ($1, $2, $3) RETURNING *`, [newTaskName, newState, priority], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                console.log(err)
                reject(new Error('Error while creating a new task in the database'));
            }
        });
    });
};

const setTaskStateDB = async (taskId, newState, project_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE project${project_id} SET curstate = $1 WHERE id = $2 RETURNING *`, [newState, taskId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while updating task state in the database'));
            }
        });
    });
};

const deleteTaskDB = async (taskId, project_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM project${project_id} WHERE id = $1 RETURNING *`, [taskId], (err, result) => {
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

const checkPasswordDB = async (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT passwd FROM users where username = $1 limit 1', [name], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while checking password'));
            }
        });
    });
};

const checkTokenDB = async (name) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT token FROM users where username = $1 limit 1', [name], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while checking token'));
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
        pool.query(`SELECT user_projects.project_id,  projects.project_name 
                    FROM user_projects, projects 
                    where user_projects.user_id = $1 and
                    user_projects.project_id = projects.project_id`, [userId], (err, result) => {
            if (!err) {
                resolve(result.rows);
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
        pool.query('INSERT INTO projects (project_name) VALUES ($1) returning project_id', [projectName], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while creating project'));
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
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(projectName)) {
        throw new Error('Invalid project name.');
    }
    return new Promise((resolve, reject) => {
        const tableName = String(projectName);
        const query = `
            CREATE TABLE ${tableName}
            (
                id    serial primary key,
                taskname  VARCHAR(40) not null,
                curstate VARCHAR(40) not null,
                description VARCHAR(255),
                person     int,
                priority int
            );
        `;
        pool.query(query, (err, result) => {
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

const getUserIdByTokenDB = async (token) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT mytable_key FROM users where token = $1 limit 1', [token], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while getting user id'));
            }
        });
    });
};

const checkUserPermissionDB = async (userId, projectId) => {
    // console.log(userId, projectId)
    return new Promise((resolve, reject) => {
        pool.query('SELECT exists(SELECT project_id from user_projects where project_id = $1 and user_id = $2) ', [projectId, userId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while check permission'));
            }
        });
    });
};

const getStatesByProjectId = async (projectId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT row_state from project_state where project_id = $1', [projectId], (err, result) => {
            if (!err) {
                resolve(result.rows);
            } else {
                reject(new Error('Error while getting project states'));
            }
        });
    });
};

const addStatesByProjectId = async (projectId, stateName) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO project_state (project_id, row_state) values($1, $2)', [projectId, stateName], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while add row project states'));
            }
        });
    });
};

const setTaskPriorityDB = async (taskId, priority, project_id) => {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE project${project_id} SET priority = $1 WHERE id = $2 RETURNING *`, [priority, taskId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while updating task priority in the database'));
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
    deleteTableProjectDB,
    checkPasswordDB,
    checkTokenDB,
    getUserIdByTokenDB,
    checkUserPermissionDB,
    getStatesByProjectId,
    addStatesByProjectId,
    setTaskPriorityDB,
};