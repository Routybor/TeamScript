import React, { useState, useEffect, memo, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { Button, IconButton, dialogTitleClasses } from '@mui/material';
import { taskAPI, stateAPI } from '../ApiCalls';
import TaskCardComponent from './TaskCardComponent';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';
import DragAndDrop from '../helper/DragAndDrop';
import PopupComponent from './PopupComponent';
import CustomInputComponent from './CustomInputComponent';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import './ColumnsComponent.css';

function stringToHash(string) {

    let hash = 0;

    if (string.length == 0) return hash;

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

function tasksEqual(prevTasks, nextTasks) {
    const res = prevTasks.tasks === nextTasks.tasks && prevTasks.states === nextTasks.states;
    console.log(res);
    return res;
}

const ColumnsComponent = (props) => {
    const {
        clicked,
        updClkd
    } = props;
    const projectToken = localStorage.getItem('project');
    const [tasks, setTasks] = useState([]);
    const [states, setStates] = useState([]);
    const [updateTasks, setUpdateTasks] = useState();
    const [updateStates, setUpdateStates] = useState();
    const userToken = localStorage.getItem('token');
    const [activePopup, setActivePopup] = useState(false);
    const [activePopup1, setActivePopup1] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [stateName, setStateName] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);


    const receiveTasks = async () => {
        try {
            // return await taskAPI.getTasksDB(userToken, projectToken);
            const recTasks = await taskAPI.getTasksDB(userToken, projectToken).then((val) => val);
            setTasks(recTasks.sort((a, b) => a.priority > b.priority ? 1 : -1));
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    const receiveStates = async () => {
        try {
            const recStates = await stateAPI.getStatesDB(projectToken).then((val) => val);
            let recStatesNames = [];
            recStates.forEach((element) => recStatesNames.push(element.row_state));
            setStates(recStatesNames);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    useEffect(() =>
        window.addEventListener("storage", e => {
            setUpdateTasks(false);
            setUpdateStates(false);
        }
        ));



    useEffect(() => {
        (async () => {
            if (updateTasks) { return; }
            receiveTasks();
            setUpdateTasks(true);
            updClkd(false);
            console.log("eff1");

            const receiveTasksMessage = () => {
                receiveTasks();
                setUpdateTasks(true);
            }

            config.socket.on("updateTask", receiveTasksMessage);

            return () => {
                config.socket.off("updateTask", receiveTasksMessage);
            };


        })();
    }, [updateTasks, clicked]);

    useEffect(() => {
        (async () => {
            if (updateStates) { return; }
            // const recStates = await receiveStates().then((val) => val);
            // let recStatesNames = [];
            // recStates.forEach((element) => recStatesNames.push(element.row_state));
            // setStates(recStatesNames);
            receiveStates();
            setUpdateStates(true);
            updClkd(false);
            console.log("eff2");

            const receiveStateMessage = () => {
                receiveStates();
                setUpdateStates(true);
            }

            config.socket.on('updateStates', receiveStateMessage);
            return () => {
                config.socket.off('updateStates', receiveStateMessage);
            };


        })();
    }, [updateStates, clicked]);


    const checkStateName = (statename) => {
        states.indexOf(statename) == -1 ? addNewState(statename) : setErrorName(true);
    }

    const addNewState = (statename) => {
        setErrorName(false);
        stateAPI.addStatesDB(userToken, projectToken, statename);
        setUpdateStates(false);
    }

    const newTask = (state) => {
        taskAPI.createTaskDB("Default", state, 1, projectToken, userToken);
        setUpdateTasks(false);
    }

    const changeState = async (taskId, newState) => {
        console.log("change state");
        const curTask = tasks.filter(task => task.id == taskId)[0];
        taskAPI.updateTaskDB(curTask, newState, projectToken);
        setUpdateTasks(false);
    }

    const deleteTask = (taskId) => {
        taskAPI.deleteTaskDB(taskId, projectToken);
        setUpdateTasks(false);
    }

    const changePriorityTask = (taskId, priority, projectToken) => {
        taskAPI.changePriorityTaskDB(taskId, priority, projectToken, userToken);
        // setUpdateTasks(false);
    }

    const handleStateName = (event) => {
        setStateName(event.target.value);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);

    };

    const open = Boolean(anchorEl);

    if (updateTasks) { DragAndDrop(tasks, changeState, changePriorityTask, setUpdateTasks); }

    console.log("!!!!!!!!!");


    const customList = (key, title, items) => (

        <Card className='column'
            key={key}>
            <CardHeader
                // title={title}
                title={<Typography sx={{
                    color: '#1C1D22',
                    opacity: 0.5
                }}>{<div><MoreVertIcon></MoreVertIcon>
                    {title}</div>}</Typography>}
                action={
                    <div>
                        <MenuList>
                            <MenuItem onClick={handleClose} disableRipple>
                                <ListItemIcon aria-label="settings" onClick={() => { newTask(title) }}>
                                    <AddIcon />
                                    Add task
                                </ListItemIcon>
                            </MenuItem>
                            {/* <MenuItem onClick={handleClose} disableRipple>
                                <ListItemIcon onClick={() => console.log(title)}>
                                    <RemoveIcon />
                                    Delete state
                                </ListItemIcon>

                            </MenuItem> */}
                            {/* <MenuItem onClick={handleClose} disableRipple>
                                <ListItemIcon onClick={activePopup1 ? undefined : () => setActivePopup1(true)}>
                                    <DriveFileRenameOutlineIcon />
                                    Rename state
                                </ListItemIcon>

                            </MenuItem> */}
                        </MenuList>

                    </div>
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
                                states={states}
                            ></TaskCardComponent>

                        </ListItem>
                    );
                })}
            </List>
        </Card >
    );

    return (
        <Grid container spacing={1} direction="column" justifyContent="center" alignItems="center" className='main'>
            <IconButton aria-label="settings" onClick={activePopup ? undefined : () => setActivePopup(true)}>
                <AddIcon></AddIcon>
                Add new state
            </IconButton>
            <PopupComponent active={activePopup} setActive={setActivePopup}>
                <CustomInputComponent
                    type="text"
                    id="statename"
                    labelText="Enter state name"
                    bigInput={true}
                    handleChange={handleStateName}
                    error={errorName}
                />
                <Button onClick={() => checkStateName(stateName)}>
                    Apply
                </Button>
            </PopupComponent>
            <Grid>
                <Grid className='tasklist' sx={{ position: 'relative', zIndex: 1000 }} item container
                    direction="row"
                > {
                        states.map(
                            (name) => customList(stringToHash(name), name, tasks.filter((task) => task.curstate == name).sort((a, b) => a.priority > b.priority ? 1 : -1))
                        )
                    }
                </Grid>
            </Grid>

        </Grid>
    );

};

export default ColumnsComponent;