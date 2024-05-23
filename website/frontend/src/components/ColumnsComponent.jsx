import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
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
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import config from '../config';
import DragAndDrop from '../helper/DragAndDrop';
import PopupComponent from './PopupComponent';
import CustomInputComponent from './CustomInputComponent';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import MenuComonent from './MenuComponent';
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

function throttle(callee, timeout) {
    let timer = null
    return function perform(...args) {

        if (timer) return
        timer = setTimeout(() => {
            callee(...args)
            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}

function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}

const ColumnsComponent = (props) => {
    const {
        clicked,
        updClkd
    } = props;
    let projectToken = localStorage.getItem('project');
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
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const [taskName, setTaskName] = useState();

    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleClick3 = (event) => {
        setAnchorEl3(event.currentTarget);
    };

    const handleClose2 = (event) => {
        if (event.target.id != "renameState") {
            setAnchorEl2(null);
        }
    };

    const handleClose3 = async (event, oldName, tasks) => {
        if (event.target.id != "renameField") {
            await changeStateName(stateName, oldName);
            // timeout(2000);
            for (let task of tasks) {
                changeState(task.id, stateName);
            }
            setAnchorEl2(null);
            setAnchorEl3(null);
        }
    };

    const enterState = (event) => {
        handleClick3(event);
    }

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
            projectToken = window.localStorage.getItem('project');
        }
        ));



    useEffect(() => {
        (async () => {
            if (updateTasks && !clicked) { return; }
            await receiveTasks();
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
            if (updateStates && !clicked) { return; }
            // const recStates = await receiveStates().then((val) => val);
            // let recStatesNames = [];
            // recStates.forEach((element) => recStatesNames.push(element.row_state));
            // setStates(recStatesNames);
            await receiveStates();
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

    const addNewState = async (statename) => {
        setErrorName(false);
        await stateAPI.addStatesDB(userToken, projectToken, statename);
        setUpdateStates(false);
    }

    const newTask = async (state) => {
        await taskAPI.createTaskDB("Default", state, 1, projectToken, userToken);
        setUpdateTasks(false);
    }

    const changeState = async (taskId, newState) => {
        // console.log("change state");
        const curTask = tasks.filter(task => task.id == taskId)[0];
        // console.log(curTask);
        await taskAPI.changeTaskStateDB(userToken, taskId, newState, projectToken);
        setUpdateTasks(false);

    }

    const deleteTask = async (taskId) => {
        await taskAPI.deleteTaskDB(taskId, projectToken);
        setUpdateTasks(false);
    }

    const changePriorityTask = async (taskId, priority, projectToken) => {
        await taskAPI.changePriorityTaskDB(taskId, priority, projectToken, userToken);
        // setUpdateTasks(false);
    }

    const changeStateName = async (newName, oldName) => {
        await stateAPI.changeStateNameDB(projectToken, newName, oldName);
        setUpdateStates(false);
    }

    const deleteState = async (stateName) => {
        await stateAPI.deleteStateDB(projectToken, stateName);
        setUpdateStates(false);
    }

    const changeTaskName = async (taskId, newName) => {
        await taskAPI.changeTaskNameDB(taskId, newName, projectToken, userToken);
        setUpdateTasks(false);
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
                }}>{<div>
                    <IconButton aria-label="more"
                        onClick={handleClick2}
                        aria-haspopup="true"
                        aria-controls="long-menu"
                    >
                        <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                    <MenuComonent MyOptions={[<Button id="deleteState" onClick={() => deleteState(title)}>Delete</Button>,
                    <Button
                        onClick={enterState}
                        aria-haspopup="true"
                        aria-controls="long-menu"
                        id="renameState"
                    >Rename</Button>]}
                        handleClose={handleClose2}
                        anchorEl={anchorEl2}
                        open={open2}
                    >
                    </MenuComonent>
                    <MenuComonent MyOptions={[<TextField
                        onChange={handleStateName}
                        id="renameField"
                        label="Enter state name"
                        variant="standard" />]}
                        handleClose={(e) => handleClose3(e, title, items)}
                        anchorEl={anchorEl3}
                        open={open3}
                    >
                    </MenuComonent>
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
                                taskId={value.id}
                                taskState={title}
                                changeState={changeState}
                                deleteTask={deleteTask}
                                changeTaskName={changeTaskName}
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