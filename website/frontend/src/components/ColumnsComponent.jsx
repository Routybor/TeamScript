import React, { useState, useEffect, memo, useRef } from 'react';
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
import useRunOnce from '../helper/useRunOnce';
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


function throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}


function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}
// let projectToken = localStorage.getItem('project');
// const userToken = localStorage.getItem('token');



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
    let currentCard;
    let currentColumn;
    let activeCard; //todo useRef
    let flCard = false;
    let flColumn = false;

    let s1;
    let s2;
    let isEnd;
    let crossedCeneter;
    let start = false;
    let dragging = false;
    let end = false;

    const tasksListElement = useRef();
    const blankCanvas = document.createElement('canvas');
    // const projectToken = localStorage.getItem('project');
    const changeCardPlace = async (isEnd, cardState) => {
        const activeElementId = activeCard.getAttribute('id');
        let activeTaskElem = tasks.filter(task => task.id == activeElementId)[0];
        let taskCopy = [...tasks.filter(task => task.curstate === cardState)];
        let taskCopyNew = [...taskCopy.filter(task => task.id != activeElementId)];
        if (isEnd) {
            if (updateTasks) {
                changePriorityTask(activeElementId, taskCopyNew[taskCopyNew.length - 1].priority + 1, projectToken);
            }
            taskCopyNew.push(activeTaskElem);
            return;

        }


        const currentElementId = currentCard.getAttribute('id');

        let currentTaskElemInd = taskCopyNew.indexOf(taskCopyNew.filter(task => task.id == currentElementId)[0]);

        currentTaskElemInd == 0 ? taskCopyNew.splice(0, 0, activeTaskElem) : taskCopyNew.splice(currentTaskElemInd, 0, activeTaskElem);
        if (updateTasks) {
            for (let i = 0; i < taskCopyNew.length; i++) {
                changePriorityFunc(taskCopyNew[i].id, i + 1, projectToken);
            }
        }

    }

    const handleDragStart = (evt) => {
        end = false;
        start = true;
        evt.target.classList.add(`selected`);
        evt.dataTransfer.setDragImage(blankCanvas, 0, 0);
    }

    const handleDragStop = async (evt) => {
        dragging = false;
        end = true;
        // console.log("drag stop");
        isEnd = false;
        crossedCeneter = false;



        if (!flCard && !flColumn) {
            return;
        }
        const activeState = activeCard.getAttribute('curstate');

        const currentState = currentColumn.childNodes[0].childNodes[0].childNodes[0].innerText;

        if (activeState === currentState) {
            if (!flCard) {
                const columnTop = currentColumn.getBoundingClientRect().top;
                if (Math.abs(columnTop - evt.clientY) <= 50) {
                    currentCard = firstCardInColumn(currentColumn);
                    changeCardPlace(false, currentState);
                }
                else {
                    currentCard = lastCardInColumn(currentColumn);
                    changeCardPlace(true, currentState);
                }
            }
            else {
                if (activeCard === currentCard) {
                    return;
                }
                crossedCeneter = crossedCenterFunc(evt.clientY);
                if (crossedCeneter) {
                    isEnd = defineCard();
                    changeCardPlace(isEnd, activeState);
                }
            }
        }
        else {
            // console.log("change column");
            // console.log(currentCard);
            const currentState = currentColumn.childNodes[0].childNodes[0].childNodes[0].innerText;
            const activeElementId = activeCard.getAttribute('id');
            if (!flCard) {
                // console.log("no cur card");
                if (!cardsInColumn(currentColumn)) {
                    // console.log("no cards in column");
                    if (updateTasks) {
                        changePriorityTask(activeElementId, 1, projectToken);
                        changeState(activeElementId, currentState);
                    }
                }
                else {
                    // console.log("cards in column");
                    const columnTop = currentColumn.getBoundingClientRect().top;
                    if (Math.abs(columnTop - evt.clientY) <= 50) {
                        // console.log("to begin");
                        currentCard = firstCardInColumn(currentColumn);
                        changeCardPlace(false, currentState);
                        if (updateTasks) {
                            changeState(activeElementId, currentState);
                        }
                    }
                    else {
                        // console.log("to end");
                        currentCard = lastCardInColumn(currentColumn);
                        changeCardPlace(true, currentState);
                        if (updateTasks) {
                            changeState(activeElementId, currentState);
                        }
                    }
                }
            }
            if (activeCard === currentCard) {
                return;
            }

        }

        evt.target.classList.remove(`selected`);
    }

    const handleDragOver = (evt) => {
        start = false;
        dragging = true;
        evt.preventDefault();
        const activeElement = document.querySelector(`.selected`);

        activeCard = activeElement;


        if (activeCard === undefined) {
            return;
        }

        let curEl = evt.target;
        // console.log(curEl);
        const ans1 = defineElemByName(curEl, 'card');
        const ans2 = defineElemByName(curEl, 'column');
        flCard = ans1[0];
        flColumn = ans2[0];
        const card = ans1[1];
        const column = ans2[1];
        currentCard = card;
        currentColumn = column;

    }

    useEffect(() => {
        tasksListElement.current.addEventListener(`dragstart`, handleDragStart);
        tasksListElement.current.addEventListener(`dragend`, handleDragStop);
        tasksListElement.current.addEventListener(`dragover`, handleDragOver);

        return () => {
            tasksListElement.current.removeEventListener(`dragstart`, handleDragStart);
            tasksListElement.current.removeEventListener(`dragend`, handleDragStop);
            tasksListElement.current.removeEventListener(`dragover`, handleDragOver);
        }
    }, [handleDragOver, handleDragStart, handleDragStop])

    const defineElemByName = (curEl, name) => {
        let fl = true;
        let k = 0;
        let tmpElement = curEl;
        let elem;
        while (tmpElement.classList) {
            if (tmpElement.classList.contains(name)) {
                elem = tmpElement;
                break;
            }
            tmpElement = tmpElement.parentNode;
            k++;
        }

        if (elem === undefined) {
            fl = false;
        }
        return [fl, elem];
    }

    const defineCard = () => {
        let nextElement;
        let isEnd = !currentCard.parentNode.nextElementSibling;
        if (isEnd || currentCard.parentNode.nextElementSibling.childNodes[0] === activeCard) {
            nextElement = currentCard;
        }
        else {
            nextElement = currentCard.parentNode.nextElementSibling.childNodes[0];
        }

        currentCard = nextElement;

        return isEnd;
    }

    const cardsInColumn = (column) => {
        const childsCards = column.childNodes[2].childNodes;
        return childsCards.length == 0 ? false : true;
    }

    const lastCardInColumn = (column) => {
        const tasksInColumn = column.childNodes[column.childNodes.length - 1].childNodes;
        return tasksInColumn[tasksInColumn.length - 1].childNodes[0];
    }

    const firstCardInColumn = (column) => {
        const tasksInColumn = column.childNodes[column.childNodes.length - 1].childNodes;
        return tasksInColumn[0].childNodes[0];
    }


    const crossedCenterFunc = (cursorPosition) => {

        const currentElementCoord = currentCard.getBoundingClientRect();
        const activeElementCoord = activeCard.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;


        if (activeElementCoord.y < currentElementCoord.y && cursorPosition >= currentElementCenter) {
            return true;
        }
        if (activeElementCoord.y >= currentElementCoord.y && cursorPosition <= currentElementCenter) {
            return true;
        }
        return false;
    }

    // if (!start && !dragging && !end) { throttle(setDDEvents(), 600); }


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
            for (let task of tasks) {
                // changeState(task.id, stateName);
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
        if (updateTasks) { return; }
        receiveTasks();
        setUpdateTasks(true);
        // updClkd(false);
        // console.log("eff1");

        const receiveTasksMessage = () => {
            receiveTasks();
            setUpdateTasks(true);
        }

        config.socket.on("updateTask", receiveTasksMessage);

        return () => {
            config.socket.off("updateTask", receiveTasksMessage);
        };
    }, [updateTasks]);

    useEffect(() => {
        if (updateStates) { return; }
        // const recStates = await receiveStates().then((val) => val);
        // let recStatesNames = [];
        // recStates.forEach((element) => recStatesNames.push(element.row_state));
        // setStates(recStatesNames);
        receiveStates();
        setUpdateStates(true);
        // updClkd(false);
        // console.log("eff2");

        const receiveStateMessage = () => {
            receiveStates();
            setUpdateStates(true);
        }

        config.socket.on('updateStates', receiveStateMessage);
        return () => {
            config.socket.off('updateStates', receiveStateMessage);
        };
    }, [updateStates]);


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
        setUpdateTasks(false);
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


    // DragAndDrop(tasks, changeState, changePriorityTask, updateTasks);

    console.log("!!!!!!!!!");
    // console.log(updateTasks);


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
                <Grid ref={tasksListElement} className='tasklist' sx={{ position: 'relative', zIndex: 1000 }} item container
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

export default memo(ColumnsComponent);