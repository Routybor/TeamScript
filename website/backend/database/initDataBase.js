const pool = require("./dbConnect");

/**
 * Function to create the users table in the database
 * 
 * @param {*} pool - Database connection pool
 */
const createUsersTable = (pool) => {
    pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            mytable_key SERIAL PRIMARY KEY,
            username VARCHAR(40) NOT NULL,
            passwd VARCHAR(40) NOT NULL,
            token TEXT
        )`,
        (err, result) => {
            if (err) {
                console.error('Error creating users table:', err);
            } else {
                console.log('Users table created successfully');
            }
        }
    );
};

/**
 * Function to create the user_projects table in the database
 * 
 * @param {*} pool - Database connection pool
 */
const createUserProjects = (pool) => {
    pool.query(`
        CREATE TABLE IF NOT EXISTS user_projects (
            project_id  integer,
            user_id integer
        )`,
        (err, result) => {
            if (err) {
                console.error('Error creating UserProjects table:', err);
            } else {
                console.log('UserProjects table created successfully');
            }
        }
    );
};

/**
 * Function to create the projects table in the database
 * 
 * @param {*} pool - Database connection pool
 */
const createProjectsTable = (pool) => {
    pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
            project_id  SERIAL PRIMARY KEY,
            project_name varchar(40),
            creator varchar(40),
            date date
        )`,
        (err, result) => {
            if (err) {
                console.error('Error creating Projects table:', err);
            } else {
                console.log('Projects table created successfully');
            }
        }
    );
};

/**
 * Function to create the project_state table in the database
 * 
 * @param {*} pool - Database connection pool
 */ 
const createProjectsStateTable = (pool) => {
    pool.query(`
        CREATE TABLE IF NOT EXISTS project_state (
            project_id  integer,
            row_state varchar(40)
        )`,
        (err, result) => {
            if (err) {
                console.error('Error creating project_state table:', err);
            } else {
                console.log('project_state table created successfully');
            }
        }
    );
};

/**
 * Function to check if a table exists
 * 
 * @param {string} tableName - Name of the table to check
 * @returns {Promise<boolean>} - Promise resolving to true if the table exists, false otherwise
 */
async function tableExists(tableName) {
    try {
        const result = await pool.query(
            `SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables 
                WHERE table_name = $1
            );`,
            [tableName]
        );
        return result.rows[0].exists;
    } catch (error) {
        console.error('Error checking the existence of the table:', error);
        throw error;
    }
}

const tables = ['users', 'user_projects', 'projects', 'project_state'];
const functionsList = [createUsersTable, createUserProjects, createProjectsTable, createProjectsStateTable];

/**
 * Function to check the existence of tables and create them if they do not exist
 */
async function checkTablesExistence() {
    try {
        for (const [index, tableName] of tables.entries()) {
            if (!(await tableExists(tableName))) {
                if (functionsList[index]) {
                    console.log(`Table ${tableName} not exist. Calling function ${functionsList[index].name}...`);
                    await functionsList[index](pool); // Call function from functionsList
                } else {
                    console.log(`Table ${tableName} not exist and no corresponding function found.`);
                }
            } else {
                console.log(`Table ${tableName} exist.`);
            }
        }
    } catch (err) {
        console.log('Error checking tables:', err);
    }
}

module.exports = {
    checkTablesExistence
};

// Call the function to check tables existence
checkTablesExistence();