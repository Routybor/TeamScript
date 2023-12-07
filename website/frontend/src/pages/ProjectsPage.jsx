import React, { useState } from "react";
import { Button } from "@mui/material";
import "./ProjectsPage.css";
import ProjectTable from "../components/ProjectTable";

const ProjectsPage = () => {

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div>
            <div className="log-out-button">
                <Button onClick={logOut}>
                    Log Out
                </Button>
            </div>
            <h1>
                Projects
            </h1>

            <ProjectTable></ProjectTable>

            {/*<Button onClick={() => deleteProject(project.id)}>
                delete
            </Button>*/}
        </div>
    );
}

export default ProjectsPage;