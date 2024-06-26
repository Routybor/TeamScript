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


// запрос на удаление таблицы для проекта
// вопросы безопастни как и функции выше

const deleteProjectFromDB = async (projectId) => {
    return new Promise((resolve, reject) => {
        // Проверяем, существует ли таблица для данного проекта
        pool.query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project${projectId}')`, (err, result) => {
            if (err) {
                reject(new Error('Error checking if table exists'));
                return;
            }

            const tableExists = result.rows[0].exists;

            if (!tableExists) {
                reject(new Error('Table for the project does not exist'));
                return;
            }

            // Удаляем таблицу проекта
            pool.query(`DROP TABLE project${projectId}`, (err, result) => {
                if (!err) {
                    resolve('Project deleted successfully');
                } else {
                    reject(new Error('Error while deleting table'));
                }
            });
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
                resolve(result.rows);
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

const deleteProjectFromUserProjects = async (projectId) => {
    try {
        await pool.query('DELETE FROM user_projects WHERE project_id = $1', [projectId]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteProjectFromProjects = async (projectId) => {
    try {
        await pool.query('DELETE FROM projects WHERE project_id = $1', [projectId]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const changeProjectNameInDB = async (projectId, newName) => {
    try {
        await pool.query('UPDATE projects SET project_name = $1 WHERE project_id = $2', [newName, projectId]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const changeStateNameInDB = async (projectId, newStateName, oldStateName) => {
    try {
        // Проверяем, существует ли состояние для данного проекта с таким же названием
        const stateExists = await pool.query('SELECT project_id FROM project_state WHERE project_id = $1 AND row_state = $2', [projectId, newStateName]);
        
        // Если состояние уже существует для данного проекта, возвращаем false
        if (stateExists.rows.length > 0) {
            console.error('State with the same name already exists for this project');
            return false;
        }

        // Если состояние с таким же названием не существует, продолжаем обновление или вставку записи
        await pool.query('UPDATE project_state SET row_state = $1 WHERE project_id = $2 AND row_state = $3', [newStateName, projectId, oldStateName]);

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteStateFromDB = async (projectId, stateToDelete) => {
    try {
        // Удаляем состояние проекта из таблицы project_state
        await pool.query('DELETE FROM project_state WHERE project_id = $1 AND row_state = $2', [projectId, stateToDelete]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteTasksWithStateFromProjectTable = async (projectId, stateToDelete) => {
    try {
        // Формируем имя таблицы
        const tableName = `project${projectId}`;
        
        // Удаляем строки с указанным состоянием из таблицы
        await pool.query(`DELETE FROM ${tableName} WHERE curstate = $1`, [stateToDelete]);
        
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const deleteAllStateByProjectIdinDB = async (projectId) => {
    try {
        // Удаляем состояние проекта из таблицы project_state
        await pool.query('DELETE FROM project_state WHERE project_id = $1', [projectId]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

async function renameTaskInDB(taskId, newName, projectId) {
    // Формируем имя таблицы
    const tableName = `project${projectId}`;

    const query = `UPDATE ${tableName} SET taskname = $1 WHERE id = $2 RETURNING *`;
    const values = [newName, taskId];
    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Возвращаем обновленную задачу
    } catch (error) {
        console.error('Error renaming task in database', error);
        throw error;
    }
}

async function changeTaskDescriptionInDB(taskId, newDescription, projectId) {
    // Формируем имя таблицы
    const tableName = `project${projectId}`;

    const query = `UPDATE ${tableName} SET description = $1 WHERE id = $2 RETURNING *`;
    const values = [newDescription, taskId];
    try {
        const res = await pool.query(query, values);
        return res.rows[0]; // Возвращаем обновленную задачу
    } catch (error) {
        console.error('Error changing task description in database', error);
        throw error;
    }
}

const getUserIdByProjectsDB = async (projectId) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT DISTINCT user_id 
                    FROM user_projects
                    where project_id = $1`, [projectId], (err, result) => {
            if (!err) {
                resolve(result.rows);
            } else {
                reject(new Error('Error while getting all users By project from database'));
            }
        });
    });
};

const getLoginByUserIdDB = async (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT username FROM users where mytable_key = $1 limit 1', [userId], (err, result) => {
            if (!err) {
                resolve(result.rows[0]);
            } else {
                reject(new Error('Error while getting login'));
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
    deleteProjectFromDB,
    checkPasswordDB,
    checkTokenDB,
    getUserIdByTokenDB,
    checkUserPermissionDB,
    getStatesByProjectId,
    addStatesByProjectId,
    setTaskPriorityDB,
    deleteProjectFromUserProjects,
    deleteProjectFromProjects,
    changeProjectNameInDB,
    changeStateNameInDB,
    deleteStateFromDB,
    deleteTasksWithStateFromProjectTable,
    deleteAllStateByProjectIdinDB,
    renameTaskInDB,
    changeTaskDescriptionInDB,
    getUserIdByProjectsDB,
    getLoginByUserIdDB,
};