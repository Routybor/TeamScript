// вызываем если нужно инциализировать базу данных

// to do 
// Саша
// создание базы юзеров
const createUsersTable = (req, res) => {
    pool.query(`CREATE TABLE users
                (
                    mytable_key     serial primary key,
                    username        VARCHAR(40) not null,
                    passwd          VARCHAR(40) not null
                );`, 
    (err, result) => {
      if (!err) {
        res.json(result.rows);
      } else {
        console.error(err);
        res.status(500).json({ error: 'Error while getting data from database' });
      }
    });
  };

// to do 
// Саша
// создание базы всех проектов

// to do 
// Саша
// создание базы всех тасков
const createTaskTable = (req, res) => {
    pool.query(`CREATE TABLE alltasks
                (
                    mytable_key    serial primary key,
                    taskname        VARCHAR(40) not null,
                    curstate        VARCHAR(40) not null
                ); `, 
    (err, result) => {
      if (!err) {
        res.json(result.rows);
      } else {
        console.error(err);
        res.status(500).json({ error: 'Error while getting data from database' });
      }
    });
  };