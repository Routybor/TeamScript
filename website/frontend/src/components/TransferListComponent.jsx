import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import { ToggleButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TaskCardComponent from './TaskCardComponent';

function TransferListComponent(props) {
    const [checked, setChecked] = useState([]);
    const [toDo, setToDo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const toDoChecked = intersection(checked, toDo);
    const inProgressChecked = intersection(checked, inProgress);
    const [activePopup, setActivePopup] = useState(false);


    useEffect(() => {
        receiveData();
        props.socket.on('updateTask', (data) => {
            //TODO = try to use data, change list of tasks instead of request
            receiveData();
        });
        return () => {
            props.socket.off('updateTask');
        };
    }, []);


    function not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    };
    function intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    };
    function union(a, b) {
        return [...a, ...not(b, a)];
    };


    const receiveData = () => {
        fetch(`${props.host}/project/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const todo_list = data
                    .filter(item => item.curstate === 'todo')
                const progress_list = data
                    .filter(item => item.curstate === 'prog')
                setToDo(todo_list)
                setInProgress(progress_list)
            })
            .catch((error) => {
                console.error('ERROR receiving data = ', error);
            });
    };

    const updateTask = (task, newstate) => {
        fetch(`${props.host}/project/changeState`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskID: task.id, newState: newstate }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Task saved = ', data);
            })
            .catch((error) => {
                console.error('ERROR saving text = ', error);
            });
    };

    const createTask = (name, newstate) => {
        fetch(`${props.host}/project/createTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskName: name, newState: newstate }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Task created = ', data);
            })
            .catch((error) => {
                console.error('ERROR saving text = ', error);
            });
    };


    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        for (const task of checked) {
            console.log(task)
        }
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedInProgress = () => {
        setInProgress(inProgress.concat(toDoChecked));
        setToDo(not(toDo, toDoChecked));
        checked.forEach(task => updateTask(task, 'prog'));
        setChecked(not(checked, toDoChecked));
    };

    const handleCheckedToDo = () => {
        setToDo(toDo.concat(inProgressChecked));
        setInProgress(not(inProgress, inProgressChecked));
        checked.forEach(task => updateTask(task, 'todo'));
        setChecked(not(checked, inProgressChecked));
    };

    const addCardToDo = () => {
        createTask('Default', 'todo');
        // toDo.push(toDo.at(toDo.length - 1) + 1);
        toDo.push(toDo.length + 1);
        setToDo(toDo);
        handleCheckedToDo();
    };

    const addCardInProgress = () => {
        // inProgress.push(inProgress.at(inProgress.length - 1) + 1);
        inProgress.push(inProgress.length + 100);
        setInProgress(inProgress);
        handleCheckedInProgress();
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
                action={
                    // <a href="" onclick="window.open(this.href,'_self','width=100,height=50,popup=yes')">
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                    // </a>
                }
            />
            < Divider />

            <List
                sx={{
                    width: 400,
                    height: 500,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button

                        >
                            <ListItemIcon>
                                <Checkbox
                                    onClick={handleToggle(value)}
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <TaskCardComponent taskName={"Имя задачи"} taskDescr={"Описание задачи"}>

                            </TaskCardComponent>
                        </ListItem>
                    );
                })}
            </List>
        </Card >
    );

    return (
        <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center" >
            <Grid direction="column" alignItems="center">

                <IconButton aria-label="settings" onClick={addCardToDo}>
                    <AddIcon></AddIcon>
                </IconButton>
                <Grid item>{customList('to do', toDo)}</Grid>
            </Grid>
            <Grid item>
                <Grid container spacing={1} direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedInProgress}
                        disabled={toDoChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedToDo}
                        disabled={inProgressChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid direction="column" alignItems="center">
                <IconButton aria-label="settings" onClick={addCardInProgress}>
                    <AddIcon></AddIcon>
                </IconButton>
                <Grid item>{customList('in progress', inProgress)}</Grid>
            </Grid>
        </Grid>
    );
};

export default TransferListComponent;