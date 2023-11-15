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


const TaskCardComponent = ({ taskName, taskDescr }) => {
    const [activePopup, setActivePopup] = useState(false);

    return (
        <Card
            sx={{
                width: 350,
                height: 250
            }}
        >

            <CardContent>
                <Grid container justifyContent="right" alignItems="right">
                    <IconButton aria-label="settings">
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