const express = require('express') // To create a server, we will use express
const app = express()
const { Client } = require('pg'); // to work with PostgreSQL db, we use pg
const port = 5000;
const bodyParser = require('body-parser');  // To get form data from a request
// , you need to use a special bodyparser package.

// connect to the database
let text = "text";
const client = new Client({
  user: 'teamscriptproj',
  host: 'ep-rapid-morning-14341499.eu-central-1.aws.neon.tech',
  database: 'Text_input',
  password: 'Sv6q0diQZxfP',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL db');
  })

// start runnig server
app.listen(port, () => {
  console.log(`Server is running on port = ${port}`);
});

/*
This code is a GET request handler for the '/database' route. 
It uses the client.query() method to execute a SELECT query on the database. 
In this case, the query selects the 'text_column' column from the 'text_table' table.
 */
app.get('/database', (req, res) => {
  client.query('select text_column from text_table', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    } else {
      res.json(result.rows[0]);
    }
  });
});

/*
This line of code is used to parse incoming JSON data in a Node.js application.
 */
app.use(bodyParser.json());

/**
This code is a POST request handler for the '/database/saveText' route. 
It expects an incoming request body with a 'textField' property, which contains the new text value to be saved in the database.

The code then uses the client.query() method to execute an SQL UPDATE query on the database. 
The query updates the 'text_column' column in the 'text_table' table with the new value of newText, but only for the row with 'id' equal to 1.

If the query is executed successfully, the code returns a JSON response with an object containing the new value of newText.
 */
app.post('/database/saveText', (req, res) => {
    const newText = req.body.textField;
    client.query(`UPDATE text_table 
                  SET text_column = '${newText}'
                  WHERE id = 1 `, (err, result) => {
      res.json({ text_column: newText });
    });
  });