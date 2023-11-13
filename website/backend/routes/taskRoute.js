const pool = require("../dataBase");

const sendStateToClients = (task_id, task_state, io) => {
  io.emit('updateTask', { taskID: task_id, CurState: task_state });
};

const getTasksFromDatabase = (req, res) => {
  pool.query('select * from user_tasks ', (err, result) => {
    if (!err) {
      res.json(result.rows);
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
};

const createTaskInDatabase = (req, res, io) => {
  const newTaskName = req.body.taskName;
  const newState = req.body.newState;
  pool.query(`INSERT INTO user_tasks(taskname, curstate) values($1, $2)`, [newTaskName, newState], (err, result) => {
    if (!err) {
      res.json({
        Taskname: newTaskName,
        CurState: newState
      });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
};

const changeStateInDatabase = (req, res, io) => {
  const taskId = req.body.taskID;
  const newState = req.body.newState;
  pool.query(`UPDATE user_tasks SET curstate = $1 WHERE id = $2`, [newState, taskId], (err, result) => {
    if (!err) {
      sendStateToClients(taskId, newState, io);
      res.json({
        taskID: taskId,
        CurState: newState
      });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
};

const deleteTaskFromDatabase = (req, res, io) => {
  const taskId = req.body.taskID;
  pool.query('DELETE FROM user_tasks WHERE id = $1', [taskId], (err, result) => {
    if (!err) {
      //TODO добавить синхронизацию
    } else {
      console.log(err);
      res.status(500).json({ error: 'Error while getting data from database' });
    }
  });
};

module.exports = {
  getTasksFromDatabase,
  createTaskInDatabase,
  changeStateInDatabase,
  deleteTaskFromDatabase,
};
