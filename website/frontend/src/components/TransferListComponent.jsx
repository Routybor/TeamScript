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
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TaskCardComponent from './TaskCardComponent';
import config from '../config';
import './TransferListComponent.css';
import { taskAPI } from '../ApiCalls';

function TransferListComponent() {
    const [checked, setChecked] = useState([]);
    const [toDo, setToDo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [done, setDone] = useState([]);
    const toDoChecked = intersection(checked, toDo)
    const inProgressChecked = intersection(checked, inProgress);
    const doneChecked = intersection(checked, done);
    const [activePopup, setActivePopup] = useState(false);
    const projectToken = localStorage.getItem('project');
    const [name, setName] = useState('');
    const userToken = localStorage.getItem('token');

    const receiveTasks = async () => {
        try {
            const data = await taskAPI.getTasksDB(userToken, projectToken);
            const todo_list = data.filter((item) => item.curstate === 'todo');
            const progress_list = data.filter((item) => item.curstate === 'prog');
            const done_list = data.filter((item) => item.curstate === 'done');
            setToDo(todo_list);
            setInProgress(progress_list);
            setDone(done_list);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };



    // useEffect(() => {
    //     receiveTasks();
    //     config.socket.on('updateTask', (data) => {
    //         receiveTasks();
    //     });
    //     return () => {
    //         config.socket.off('updateTask');
    //     };
    // }, []);

    function not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    };
    function not3(a, b,) {
        return a.filter((value) => b.indexOf(value) === -1 && c.indexOf(value));
    };
    function intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    };
    function union(a, b) {
        return [...a, ...not(b, a)];
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
        console.log(checked);
        if (numberOfChecked(items) === items.length) {
            console.log(items);
            setChecked(not(checked, items));
        } else {
            console.log(items);
            setChecked(union(checked, items));
        }
    };

    const handleCheckedInProgress = () => {
        setInProgress(inProgress.concat(toDoChecked, doneChecked));
        setToDo(not(toDo, toDoChecked));
        setDone(not(done, doneChecked));
        checked.forEach(task => taskAPI.updateTaskDB(task, 'prog', projectToken));
        setChecked(not3(checked, toDoChecked, doneChecked));
    };

    const handleCheckedToDo = () => {
        setToDo(toDo.concat(inProgressChecked, doneChecked));
        setInProgress(not(inProgress, inProgressChecked));
        setDone(not(done, doneChecked));
        checked.forEach(task => taskAPI.updateTaskDB(task, 'todo', projectToken));
        setChecked(not3(checked, inProgressChecked, doneChecked));
    };

    const handleCheckedDone = () => {
        setDone(done.concat(doneChecked));
        setInProgress(not(inProgress, inProgressChecked));
        setToDo(not(toDo, toDoChecked));
        checked.forEach(task => taskAPI.updateTaskDB(task, 'done', projectToken));
        setChecked(not3(checked, inProgressChecked, toDoChecked));
    };

    const addCardToDo = () => {
        taskAPI.createTaskDB('Default', 'todo', projectToken, userToken);
        toDo.push(toDo.length + 1);
        setToDo(toDo);
        handleCheckedToDo();
    };

    const addCardInProgress = () => {
        taskAPI.createTaskDB('Default', 'prog', projectToken, userToken);
        inProgress.push(inProgress.length + 100);
        setInProgress(inProgress);
        handleCheckedInProgress();
    };

    const addCardDone = () => {
        taskAPI.createTaskDB('Default', 'done', projectToken, userToken);
        done.push(done.length + 100);
        setInProgress(done);
        handleCheckedDone();
    };


    const customList = (title, items) => (
        <Card className='card'>
            <CardHeader

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

                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
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
                            <TaskCardComponent
                                taskId={value.id}
                            >

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
                <Grid sx={{ position: 'relative', zIndex: 1000 }} item>{customList('to do', toDo)}</Grid>
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
            <Grid item>
                <Grid container spacing={1} direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedDone}
                        disabled={inProgressChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedInProgress}
                        disabled={doneChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid direction="column" alignItems="center">

                <IconButton aria-label="settings" onClick={addCardDone}>
                    <AddIcon></AddIcon>
                </IconButton>
                <Grid item>{customList('done', done)}</Grid>
            </Grid>
        </Grid>
    );
};

export default TransferListComponent;