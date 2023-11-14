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



// ------------------------------------------------
// возможно потом изменение пароля
// to do 
// Саша
// создание базы юзеров