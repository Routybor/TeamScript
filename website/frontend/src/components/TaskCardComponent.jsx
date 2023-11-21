import React, { useState } from "react";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Grid } from "@mui/material";
import PopupComponent from './PopupComponent';
import { IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import "./TaskCardComponent.css";
import config from '../config';

const TaskCardComponent = ({ taskName, taskDescr, taskId }) => {
    const [activePopup, setActivePopup] = useState(false);

    const deleteTask = () => {
        fetch(`${config.host}/project/deleteTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskID: taskId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Task saved = ', data);
            })
            .catch((error) => {
                console.error('ERROR saving text = ', error);
            });
    };

    return (
        <Card
            sx={{
                width: 350,
                height: 250
            }}
        >

            <CardContent>
                <Grid container justifyContent="right" alignItems="right">
                    <IconButton aria-label="settings" onClick={deleteTask}>
                        <RemoveIcon />
                    </IconButton>
                </Grid>
                <h3>{taskName}</h3>
                <p>{taskDescr}</p>
            </CardContent>
            <CardActions>

                <Button onClick={activePopup ? undefined : () => setActivePopup(true)}>Смотреть задачу</Button>
                <PopupComponent active={activePopup} setActive={setActivePopup}>
                    <p>Text</p>
                </PopupComponent>

            </CardActions>
        </Card>
    );
}

export default TaskCardComponent;