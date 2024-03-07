import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import { taskAPI } from '../ApiCalls';
import TaskCardComponent from './TaskCardComponent';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';
import DragAndDrop from '../helper/DragAndDrop';
import './ColumnsComponent.css';



const ColumnsComponent = () => {
    const statuses = ["no status", "todo", "done", "prog"];
    const projectToken = localStorage.getItem('project');
    const [tasks, setTasks] = useState([]);
    // const [states, setStates] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // const [taskName, setTaskName] = useState("");


    const receiveTasks = async () => {
        try {
            const userToken = localStorage.getItem('token');
            return await taskAPI.getTasksDB(userToken, projectToken);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    // const receiveStates = async () => {
    //     try {
    //         return await taskAPI.getStatesDB(projectToken);
    //     } catch (error) {
    //         console.error('Error in receive function:', error);
    //     }
    // };


    useEffect(() => {
        (async () => {
            const recTasks = await receiveTasks().then((val) => val);
            console.log("effect");
            console.log(recTasks);
            setTasks(recTasks);
            setIsLoaded(true);
            config.socket.on('updateTask', (data) => {
                receiveTasks();
            });
            return () => {
                config.socket.off('updateTask');
            };

        })();
    }, [isLoaded]);

    DragAndDrop(tasks, setTasks);

    // useEffect(() => {
    //     (async () => {
    //         const states = await receiveStates().then((val) => val);
    //         setStates(states);
    //         config.socket.on('updateStates', (data) => {
    //             receiveStates();
    //         });
    //         console.log(states);
    //         return () => {
    //             config.socket.off('updateStates');
    //         };


    //     })();
    // }, []);


    const addNewColumn = (newStateName) => {
        statuses.indexOf(newStateName) == -1 ? statuses.push(newStateName) : console.log(1);
    }

    const newTask = (state) => {
        taskAPI.createTaskDB("Default", state, projectToken);
        setIsLoaded(false);
    }

    const changeState = async (taskId, newState) => {
        const curTask = tasks.filter(task => task.id == taskId)[0];
        taskAPI.updateTaskDB(curTask, newState, projectToken);
        setIsLoaded(false);

    }

    const deleteTask = (taskId) => {
        taskAPI.deleteTaskDB(taskId, projectToken);
        setIsLoaded(false);
    }

    const customList = (title, items) => (

        <Card className='column'>
            <CardHeader
                title={title}
                action={

                    <IconButton aria-label="settings" onClick={() => { newTask(title) }}>
                        <AddIcon />
                    </IconButton>
                }
            />
            < Divider />

            <List
                sx={{
                    width: 400,

                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items != undefined ? null : items = []}
                {items.map((value) => {
                    const labelId = `${value}-label`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                        >
                            <TaskCardComponent
                                taskName={value.taskname}
                                // setTaskName={setTaskName}
                                taskId={value.id}
                                taskState={title}
                                changeState={changeState}
                                deleteTask={deleteTask}
                                statuses={statuses}
                            ></TaskCardComponent>

                        </ListItem>
                    );
                })}
            </List>
        </Card >
    );

    return (
        <Grid container spacing={1} direction="column" justifyContent="center" alignItems="center" >
            <IconButton aria-label="settings" onClick={() => { addNewColumn("Deff") }}>
                <AddIcon></AddIcon>
            </IconButton>
            <Grid >
                <Grid className='tasklist' sx={{ position: 'relative', zIndex: 1000 }} item container
                    direction="row"
                > {
                        statuses.map(
                            (name) => customList(name, tasks.filter((task) => task.curstate == name))
                        )
                    }
                </Grid>
            </Grid>

        </Grid>
    );

}

export default ColumnsComponent;