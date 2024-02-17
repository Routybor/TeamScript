import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { taskAPI } from '../ApiCalls';
import TaskCardComponent from './TaskCardComponent';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';




const ColumnsComponent = () => {
    const statuses = ["no status", "todo", "done", "prog"];
    const projectToken = localStorage.getItem('project');
    const [tasks, setTasks] = useState([]);
    const [states, setStates] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [taskName, setTaskName] = useState("");


    const receiveTasks = async () => {
        try {
            const userToken = localStorage.getItem('token');
            return await taskAPI.getTasksDB(userToken, projectToken);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    const receiveStates = async () => {
        try {
            return await taskAPI.getStatesDB(projectToken);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };


    useEffect(() => {
        (async () => {
            dispatchEvent
            const tasks = await receiveTasks().then((val) => val);
            setTasks(tasks);
            setIsLoaded(true);
            console.log("effect");
            console.log(tasks);
            // config.socket.on('updateTask', (data) => {
            //     receiveTasks();
            // });
            // return () => {
            //     config.socket.off('updateTask');
            // };

        })();
    }, [isLoaded]);



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
        // console.log(tasks);
        // const taskname = "Default" + tasks.filter((task) => task.taskname.includes("Default")).length.toString();
        // const task = {
        //     id: taskname.length,
        //     taskname: taskname,
        //     curstate: state
        // }
        // tasks.push(task);
        taskAPI.createTaskDB("Default", state, projectToken);
        setIsLoaded(false);
    }

    const changeState = async (taskId, newState) => {
        const curTask = tasks.filter(task => task.id == taskId)[0];
        // console.log(tasks);
        taskAPI.updateTaskDB(curTask, newState, projectToken);
        setIsLoaded(false);
        // tasks.pop(curTask);
        // curTask.curstate = newState;
        // setTasks(tasks);
        // console.log(tasks);

    }

    const deleteTask = (taskId) => {
        // setTasks(tasks.filter(task => task.id != taskId));
        console.log("in delete");
        console.log(tasks);
        taskAPI.deleteTaskDB(taskId, projectToken);
        setIsLoaded(false);
    }

    const customList = (title, items) => (

        <Card className='card'>
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
                    height: 500,
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
                            key={value}
                            role="listitem"
                            button
                        >
                            <TaskCardComponent
                                taskName={value.taskname}
                                setTaskName={setTaskName}
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
            <Grid direction="column" alignItems="center">

                {/* <IconButton aria-label="settings" onClick={addTask}>
                    <AddIcon></AddIcon>
                </IconButton> */}

                <Grid sx={{ position: 'relative', zIndex: 1000 }} item> {
                    statuses.map(
                        (name) => customList(name, tasks.filter((task) => task.curstate == name))
                    )
                    // customList('todo', tasks.filter((task) => task.curstate === "todo"))
                }
                </Grid>
            </Grid>
            {/* <Grid item>
                <Grid container spacing={1} direction="column" alignItems="center">
                    {/* <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        // onClick={handleCheckedInProgress}
                        // disabled={toDoChecked.length === 0}
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
                        &lt; */}
            {/* </Button> */}
            {/* </Grid> */}
            {/* </Grid>  */}

        </Grid>
    );

}

export default ColumnsComponent;