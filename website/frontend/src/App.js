import React, { useState, useEffect } from 'react';
// import { TextField } from "@mui/material";
import './App.css';
import io from 'socket.io-client';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const socket = io('/'); // С помощью io создаём сокет, когда указываем / метод сам ищет бек, с которого запущен сайт

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);


function App() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Для обработки загрузок по дефолту загрузка True

  useEffect(() => { // С помощью этого при первой отрисовки сайта данные с  базы данных сразу появляются на странице
    receiveData(); // Собственно получение данных с БД
    socket.on('updateText', (data) => { // Начинаем проверять(слушать) сокет на наличие данного сообщения и если оно получено, data из сообщения отправляется далее
      setTextFieldValue(data.text_column); // Заночим данные в поле
      setIsLoading(false); // Завершаем получение и объявляем о окончании загрузки
    });
    return () => {
      socket.off('updateText'); // Если страница закрыта во избежание утечек памяти и ненужных процессов завершаем проверять сокет
    };
  }, []); // Так как список зависимостей [] пустой => выполнится при загрузке

  const receiveData = () => { // Отправка на бек HTTP запроса и получение ответа(данных с БД)
    setIsLoading(true); // Пока выполняем объявляем загрузку
    fetch('/database/', { // URL
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json()) // Форматируем ответ в джсон
    .then((data) => {
      setTextFieldValue(data.text_column); // Данные в текстовое поле берем из бека
      setIsLoading(false);
      console.log('Data received =', data); // Посмотреть = Inspect element -> Console
    })
    .catch((error) => {
      console.error('ERROR receiving data = ', error); // Посмотреть = Inspect element -> Console
    });
  };

  const updateData = (event) => { // Отправка на бек HTTP запроса и данных для БД и получение ответа(вставленных в БД данных)
    if (!isLoading) {
      const newText = event.target.value;
      setIsLoading(true);
      fetch('/database/saveText', { // URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ textField: newText }),
      })
        .then((response) => response.json())
        .then((data) => {
          // setTextFieldValue(data.text_column);  // Вообще это уже делает сокет
          setIsLoading(false);
          console.log('Text saved = ', data); // Посмотреть = Inspect element -> Console
        })
        .catch((error) => {
          console.error('ERROR saving text = ', error); // Посмотреть = Inspect element -> Console
        });
    }
  };
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([0, 1, 2]);
  const [right, setRight] = React.useState([4, 5, 6]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      
      <List
        sx={{
          width: 300,
          height: 500,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              {/* <ListItemText id={labelId} primary={`List item ${value + 1}`} /> */}
              <Card sx={{ minWidth: 150 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Задача
                  </Typography>
                  <Typography variant="body2">
                    краткое описание задачи
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Открыть задачу</Button>
                </CardActions>
              </Card>

            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList('In progress', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Done', right)}</Grid>
    </Grid>
  );
  }
  // return (
  //   <div className="App">
  //     <TextField
  //       fullWidth
  //       value={textFieldValue}
  //       id="standard-basic"
  //       label="Enter your text here"
  //       multiline
  //       onChange={updateData}
  //     />
  //   </div>
  // );

  // }
export default App;
