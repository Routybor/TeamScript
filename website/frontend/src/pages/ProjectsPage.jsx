import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom"
import "./ProjectsPage.css";
import DataGrid from "../components/DataGridComponent";

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
            
            <DataGrid container direction="row" justifyContent="center" alignItems="center">
                {inputList.map(project => {
                    return (
                        <div id={project.id}>
                            {project.body}
                        
                            
                        </div>
                    )
                    })
                }
            </DataGrid>
            <Button onClick={addProject}>
                    + New Project
            </Button>
            {/*<Button onClick={() => deleteProject(project.id)}>
                delete
            </Button>*/} 
        </div>
    );
}

export default ProjectsPage;