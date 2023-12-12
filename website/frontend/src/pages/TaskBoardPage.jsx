import React from "react";
import TransferListComponent from "../components/TransferListComponent";
import { Button } from "@mui/material";
import "./TaskBoardPage.css";


const TaskBoardPage = () => {

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div>
            <div className='log-out-button'>
                <Button onClick={logOut}>
                    Log Out
                </Button>
            </div>
            <TransferListComponent />
        </div>
    );
}

export default TaskBoardPage;