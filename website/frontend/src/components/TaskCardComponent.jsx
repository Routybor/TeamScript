import React, { useState } from "react";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import PopupComponent from './PopupComponent';
import { IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import CustomInputComponent from "./CustomInputComponent";
import "./TaskCardComponent.css";
import config from '../config';

const TaskCardComponent = (props) => {
    const {
        taskName,
        taskDescr,
        deleteTask
    } = props;
    const [activePopup, setActivePopup] = useState(false);



    return (
        <Card
            sx={{
                width: 200,
                height: 250,

            }}
        >

            <CardContent>
                <Grid container justifyContent="right" alignItems="right">
                    <IconButton aria-label="settings" onClick={deleteTask}>
                        <RemoveIcon />
                    </IconButton>
                </Grid>
                <div className="task-name">
                    <CustomInputComponent
                        defaultValue={taskName}
                        bigInput={true}
                    />
                </div>

                <CustomInputComponent
                    defaultValue={taskDescr}
                    bigInput={false}

                />
            </CardContent>
            <CardActions>

                <Button onClick={activePopup ? undefined : () => setActivePopup(true)}>Смотреть задачу</Button>
                <PopupComponent active={activePopup} setActive={setActivePopup}>
                    <CustomInputComponent
                        defaultValue={taskName}
                        bigInput={true}
                    />
                    <CustomInputComponent
                        defaultValue={taskDescr}
                    />

                </PopupComponent>

            </CardActions>
        </Card>
    );
}

export default TaskCardComponent;