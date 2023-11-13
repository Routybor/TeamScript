const pool = require("../dataBase");

const sendTextToClients = (newText, io) => {
  io.emit('updateText', { text_column: newText });
};

const getTextFromDatabase = (req, res) => {
  pool.query('select text_column from text_table', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    } else {
      res.json(result.rows[0]);
    }
  });
};

const saveTextToDatabase = (req, res, io) => {
  const newText = req.body.textField;
  pool.query(`UPDATE text_table SET text_column = '${newText}' WHERE id = 1 `, (err, result) => {
    if (!err) {
      sendTextToClients(newText, io);
      res.json({ text_column: newText });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
};

module.exports = {
  getTextFromDatabase,
  saveTextToDatabase,
};
