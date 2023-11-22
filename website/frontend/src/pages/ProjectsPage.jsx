import React, { useState } from "react";

import { Button, Grid } from "@mui/material";

const ProjectsPage = () => {

    const [inputList, setInputList] = useState([]);

    const addProject = event => {
        setInputList(inputList.concat(<h3 key={inputList.length}>Project {inputList.length + 1}</h3>));
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