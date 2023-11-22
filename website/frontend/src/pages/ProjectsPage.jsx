import React, { useState } from "react";

import { Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";


const ProjectsPage = () => {

    const [inputList, setInputList] = useState([]);

    const addProject = () => {
        setInputList(inputList.concat(<Link key={inputList.length} to={"./taskboard"}><h3>Project {inputList.length + 1}</h3> </Link>));
    };

    return (
        <div id="projects-page">
            <h1>
                Projects
            </h1>
            <Button id="add-project" onClick={addProject}>
                + New Project
            </Button>
            <Grid id="grid-projects" container direction="column" justifyContent="start" alignItems="start">
                {inputList}
            </Grid>
        </div>
    );
}

export default ProjectsPage;