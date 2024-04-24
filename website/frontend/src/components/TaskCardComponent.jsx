import React, { useState, memo } from "react";
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



const TaskCardComponent = (props) => {

    // useEffect(() => {
    //     const sendPendingTask = () => {
    //         if (sendTaskNameEnabled) {
    //             sendTaskName(pendingTaskName);
    //         }
    //     };
    //     const sendToBackendTimer = setTimeout(sendPendingTask, 200);
    //     return () => {
    //         clearTimeout(sendToBackendTimer);
    //     };
    // }, [pendingTaskName, sendTaskNameEnabled]);

    // const sendPendingTask = () => {
    //     if (sendTaskNameEnabled) {
    //         sendTaskName(pendingTaskName);
    //     }
    // };


    // const handleInputChange = (event) => {
    //     const tasks = receiveTask();
    //     tasks.then((value) => {
    //         setTaskName(event.target.value);
    //         value.find(x => x.id == event.target.id).taskname = event.target.value;
    //         sendTaskName(value.find(x => x.id == event.target.id));
    //     });


    //     // setPendingTaskName(event.target.value);
    //     // setSendTaskNameEnabled(true);


    // };
    const {
        taskName,
        taskId,
        taskState,
        changeState,
        deleteTask,
        states
    } = props;

    const [activePopup, setActivePopup] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const handleInputChange = (event) => {
        // setTaskName(event.target.value);
    }

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
                height: 220,
            }}
            draggable="true"
            className="card"
            id={taskId}
            curstate={taskState}
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
                    <MenuComonent MyOptions={states}
                        handleClose={handleClose2}
                        anchorEl={anchorEl2}
                        open={open2}
                    ></MenuComonent>
                </Grid>
                <div className="task-name">
                    <CustomInputComponent
                        defaultValue={taskName}
                        type="text"
                        id="taskname"
                        bigInput={true}
                        handleChange={handleInputChange}
                    />
                </div>

                {/* <CustomInputComponent
                    defaultValue={taskDescr}
                    bigInput={false}

                /> */}


                <Button onClick={activePopup ? undefined : () => setActivePopup(true)}>Смотреть задачу</Button>
                <PopupComponent active={activePopup} setActive={setActivePopup}>
                    <CustomInputComponent
                        defaultValue={taskName}
                        type="text"
                        id="taskname"
                        bigInput={true}
                        // id={taskId}
                        handleChange={handleInputChange}
                    />
                    {/* <CustomInputComponent
                        defaultValue="description"
                    /> */}

                </PopupComponent>

            </CardContent>
        </Card>
    );
}

export default memo(TaskCardComponent);