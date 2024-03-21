import React, { useState } from "react";
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import PopupComponent from './PopupComponent';
import { IconButton } from '@mui/material';
import CustomInputComponent from "./CustomInputComponent";
import "./TaskCardComponent.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuComonent from "./MenuComponent";
import { taskAPI } from '../ApiCalls';




// const projectToken = localStorage.getItem('project');

// const deleteTask = (id) => {
//     fetch(`${config.host}/taskBoard/deleteTask`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ taskID: id, projectToken: projectToken }),
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log('Task saved = ', data);
//         })
//         .catch((error) => {
//             console.error('ERROR saving text = ', error);
//         });

// };


const TaskCardComponent = (props) => {
    const {
        taskName,
        taskId,
        taskState,
        changeState,
        deleteTask,
        statuses,
    } = props;

    // const changeTaskName = async (taskId, event) => {
    //     const curTaskName = event.target.value;
    //     taskAPI.updateTaskDB(taskId, curTaskName);
    //     setIsLoaded(false);
    // }

    // useEffect(() => {
    //     (async () => {
    //         changeTaskName(taskId);
    //         setUpdated(true);
    //         return () => {
    //             config.socket.off('updateTaskName');
    //         };
    //     })();
    // }, [updated]);

    const [activePopup, setActivePopup] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    // const [taskname, setTaskname] = useState(taskName);
    // const [updated, setUpdated] = useState(false);

    const handleInputChange = (event) => {

    }

    // const changeTaskName = async (taskId, taskname) => {

    // }

    // const handleInputChange = (event) => {
    //     const tasks = getTaskNameDB();
    //     tasks.then((value) => {
    //         setTaskName(event.target.value);
    //         value.find(x => x.id == event.target.id).taskname = event.target.value;
    //         sendTaskName(value.find(x => x.id == event.target.id));
    //     });

    // };

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const open2 = Boolean(anchorEl2);
    const handleClose2 = (event) => {
        const newState = event.target.innerHTML.split('<')[0];
        changeState(taskId, newState);
        setAnchorEl2(null);
        setAnchorEl(null);

    };

    const chooseState = (event) => {
        handleClick2(event);
    }

    const MyOptions = [
        <Button
            aria-haspopup="true"
            aria-controls="long-menu"
            onClick={chooseState}
            id="changeState"
        >Change state
        </Button>,
        <Button onClick={() => { deleteTask(taskId) }} id="delete">Delete</Button>,
    ];

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const open = Boolean(anchorEl);


    const handleClose = (event) => {
        if (event.target.id != "changeState") {
            setAnchorEl(null);
        }
    };


    return (
        <Card
            sx={{
                width: 200,
                height: 250,

            }}
            draggable="true"
            className="card"
            id={taskId}
        >

            <CardContent>
                <Grid container justifyContent="right" alignItems="right">
                    <IconButton aria-label="more"
                        onClick={handleClick}
                        aria-haspopup="true"
                        aria-controls="long-menu"
                        id={taskState}>
                        <MoreVertIcon></MoreVertIcon>
                    </IconButton>
                    <MenuComonent MyOptions={MyOptions}
                        handleClose={handleClose}
                        anchorEl={anchorEl}
                        open={open}
                    ></MenuComonent>
                    <MenuComonent MyOptions={statuses}
                        handleClose={handleClose2}
                        anchorEl={anchorEl2}
                        open={open2}
                    ></MenuComonent>
                </Grid>
                <div className="task-name">
                    <CustomInputComponent
                        defaultValue={taskName}
                        bigInput={true}
                        id={taskId}
                        handleChange={handleInputChange}
                    />
                </div>

                {/* <CustomInputComponent
                    defaultValue={taskDescr}
                    bigInput={false}

                /> */}


                <Button onClick={activePopup ? undefined : () => setActivePopup(true)}>Смотреть задачу</Button>
                <PopupComponent id={2} active={activePopup} setActive={setActivePopup}>
                    <CustomInputComponent id={2}
                        defaultValue={taskName}
                        bigInput={true}
                        handleChange={handleInputChange}
                    />
                    <CustomInputComponent
                        defaultValue="description"
                    />
                </PopupComponent>
            </CardContent>
        </Card>
    );
}

export default TaskCardComponent;