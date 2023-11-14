// здесь будут функции для работы с базой пользователей

// to do 
// Саша
// запрос на то, есть ли такой пользователь в базе

const getUserFromTable = (req, res) => {
    const name = req.body.userName;
    pool.query('SELECT exists (SELECT FROM users where username = $1 ) ', [name],
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
// запрос на создание новой записи о пользователе

const addNewUser = (req, res) => {
    const name = req.body.userName;
    const paswd = req.body.password;
    pool.query('INSERT INTO users (username, passwd) values($1, $2)', [name, paswd],
    (err, result) => {
      if (!err) {
        res.json(result.rows);
      } else {
        console.error(err);
        res.status(500).json({ error: 'Error while getting data from database' });
      }
    });
  };

// ------------------------------------------------
// возможно потом изменение пароля
// to do 
// Саша
// создание базы юзеров