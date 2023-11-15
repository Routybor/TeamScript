import React, { useState } from "react";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PopupComponent from './PopupComponent';

import "./TaskCardComponent.css";


const TaskCardComponent = ({ taskName, taskDescr }) => {
    const [activePopup, setActivePopup] = useState(false);

    return (
        <Card>
            <CardContent>
                <p>{taskName}</p>
                <p>{taskDescr}</p>
            </CardContent>
            <CardActions>
                <Button onClick={activePopup ? undefined : () => setActivePopup(true)}>Смотреть задачу</Button>
                <PopupComponent active={activePopup} setActive={setActivePopup}>
                    <p>Text</p>
                </PopupComponent>
                {/* <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton> */}
            </CardActions>
        </Card>
    );
}

export default TaskCardComponent;