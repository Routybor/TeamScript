//? DATA-ACCESS LAYER - операции с бд

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config({ path: "../../.env" });

const pgUser = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgHost = process.env.PGHOST;
const pgPort = process.env.PGPORT;
const pgDatabase = process.env.PGDATABASE;
const pgSsl = process.env.PGSSL === "true";

const pool = new Pool({
    user: pgUser,
    password: pgPassword,
    host: pgHost,
    port: pgPort,
    database: pgDatabase,
    ssl: pgSsl,
});

pool
    .connect()
    .then(() => {
        console.log("Connected to PostgreSQL db");
    })
    .catch((error) => {
        console.error("Error connecting to PostgreSQL db = ", error);
    });

module.exports = pool;