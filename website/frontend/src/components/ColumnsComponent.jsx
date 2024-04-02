import React, { useState, useEffect } from 'react';
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



const ColumnsComponent = () => {
    const projectToken = localStorage.getItem('project');
    const [tasks, setTasks] = useState([]);
    const [states, setStates] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const userToken = localStorage.getItem('token');
    const [activePopup, setActivePopup] = useState(false);
    const [activePopup1, setActivePopup1] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [stateName, setStateName] = useState("");
    const [anchorEl, setAnchorEl] = React.useState(null);



    const receiveTasks = async () => {
        try {
            return await taskAPI.getTasksDB(userToken, projectToken);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };

    const receiveStates = async () => {
        try {
            return await stateAPI.getStatesDB(projectToken);
        } catch (error) {
            console.error('Error in receive function:', error);
        }
    };


    useEffect(() => {
        (async () => {
            const recTasks = await receiveTasks().then((val) => val);
            // console.log("effect");
            // console.log(recTasks);
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


    useEffect(() => {
        (async () => {
            const recStates = await receiveStates().then((val) => val);
            let recStatesNames = [];
            recStates.forEach((element) => recStatesNames.push(element.row_state));
            setStates(recStatesNames);
            setIsLoaded(true);
            config.socket.on('updateStates', (data) => {
                receiveStates();
            });
            return () => {
                config.socket.off('updateStates');
            };


        })();
    }, [isLoaded]);

    const checkStateName = (statename) => {
        states.indexOf(statename) == -1 ? addNewState(statename) : setErrorName(true);
    }

    const addNewState = (statename) => {
        setErrorName(false);
        stateAPI.addStatesDB(userToken, projectToken, statename);
        setIsLoaded(false);
    }

    const newTask = (state) => {
        taskAPI.createTaskDB("Default", state, projectToken, userToken);
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

    DragAndDrop(tasks, setTasks, isLoaded, setIsLoaded, changeState);

    const customList = (title, items) => (

        <Card className='column' >
            <CardHeader
                title={title}
                action={
                    <div>
                        <MenuList>
                            <MenuItem onClick={handleClose} disableRipple>
                                <ListItemIcon aria-label="settings" onClick={() => { newTask(title) }}>
                                    <AddIcon />
                                    Add task
                                </ListItemIcon>
                            </MenuItem>
                            <MenuItem onClick={handleClose} disableRipple>
                                <ListItemIcon onClick={() => console.log(title)}>
                                    <RemoveIcon />
                                    Delete state
                                </ListItemIcon>

                            </MenuItem>
                            <MenuItem onClick={handleClose} disableRipple>
                                <ListItemIcon onClick={activePopup1 ? undefined : () => setActivePopup1(true)}>
                                    <DriveFileRenameOutlineIcon />
                                    Rename state
                                </ListItemIcon>

                            </MenuItem>
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
        <Grid container spacing={1} direction="column" justifyContent="center" alignItems="center" >
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
                            (name) => customList(name, tasks.filter((task) => task.curstate == name))
                        )
                    }
                </Grid>
            </Grid>

        </Grid>
    );

}

export default ColumnsComponent;