import React, { useState } from "react";

import { Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";


const ProjectsPage = () => {

    const [inputList, setInputList] = useState([]);
    const [count, setCount] = useState(0);

    const deleteProject = id => {
        setInputList(oldValues => {
            return oldValues.filter(inputList => inputList.id !== id)
        })
    }

    const addProject = () => {
        setInputList(inputList.concat({
            id: count,
            body:
                <Link to={"./taskboard"}>
                    <h3>Project {count + 1}</h3>
                </Link>

        }
        ))
        setCount(count + 1);
    };

    return (
        <div>
            <h1>
                Projects
            </h1>
            <Button onClick={addProject}>
                + New Project
            </Button>
            {inputList.map(project => {
                return (
                    <div id={project.id}>
                        <Grid container direction="row" justifyContent="center" alignItems="center">
                            {project.body}
                            <Button onClick={() => deleteProject(project.id)}>
                                delete
                            </Button>
                        </Grid>
                    </div>
                )
            }

            )}
        </div>
    );
}

export default ProjectsPage;