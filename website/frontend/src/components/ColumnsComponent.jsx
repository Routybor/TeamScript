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
import './ColumnsComponent.css';



const ColumnsComponent = () => {
    const statuses = ["no status", "todo", "done", "prog"];
    const projectToken = localStorage.getItem('project');
    const [tasks, setTasks] = useState([]);
    // const [states, setStates] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentElement, setCurrentElement] = useState();
    const tasksListElement = document.querySelector('.tasklist');
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
            const tasksListElement = document.querySelector('.tasklist');

            console.log(tasksListElement);
            config.socket.on('updateTask', (data) => {
                receiveTasks();
            });
            return () => {
                config.socket.off('updateTask');
            };

        })();
    }, [isLoaded]);


    if (tasksListElement) {

        tasksListElement.addEventListener(`dragstart`, (evt) => {
            evt.target.classList.add(`selected`);
        })

        tasksListElement.addEventListener(`dragend`, (evt) => {
            evt.target.classList.remove(`selected`);
        });


        tasksListElement.addEventListener(`dragover`, (evt) => {
            evt.preventDefault();

            const activeElement = tasksListElement.querySelector(`.selected`);
            // setCurrentElement(activeElement)

            if (activeElement) {
                console.log(1);
                const tmpElement = evt.target;
                console.log(tmpElement);
                if (tmpElement.classList.contains('card')) {
                    console.log("I am card");
                    setCurrentElement(tmpElement);
                }
                console.log(activeElement);
                console.log(currentElement);
                const activeElementId = activeElement.querySelector('.input').getElementsByTagName('input')[0].id;
                const currentElementId = currentElement.querySelector('.input').getElementsByTagName('input')[0].id;

                const isMoveable = activeElement !== currentElement &&
                    currentElement.classList.contains(`card`);

                if (!isMoveable) {
                    return;
                }
                console.log(2);
                let activeTaskElemInd = tasks.indexOf(tasks.filter(task => task.id == activeElementId)[0]);
                let currentTaskElemInd = tasks.indexOf(tasks.filter(task => task.id == currentElementId)[0]);
                let taskCopy = [...tasks];
                [taskCopy[activeTaskElemInd], taskCopy[currentTaskElemInd]] = [taskCopy[currentTaskElemInd], taskCopy[activeTaskElemInd]];
                setTasks(taskCopy);
                console.log(tasks);


            }

        });

    }



    //     tasksListElement.insertBefore(activeElement, nextElement);
    // });



    //     // const getNextElement = (cursorPosition, currentElement) => {
    //     //     // Получаем объект с размерами и координатами
    //     //     const currentElementCoord = currentElement.getBoundingClientRect();
    //     //     // Находим вертикальную координату центра текущего элемента
    //     //     const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    //     //     // Если курсор выше центра элемента, возвращаем текущий элемент
    //     //     // В ином случае — следующий DOM-элемент
    //     //     const nextElement = (cursorPosition < currentElementCenter) ?
    //     //         currentElement :
    //     //         currentElement.nextElementSibling;

    //     //     return nextElement;
    //     // };


    // }


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

                {/* <IconButton aria-label="settings" onClick={addTask}>
                    <AddIcon></AddIcon>
                </IconButton> */}

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