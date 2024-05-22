import React, { useState, useEffect, useRef } from "react";
// import TransferListComponent from "../components/TransferListComponent";
import { Button } from "@mui/material";
import List from '@mui/material/List';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuComonent from "../components/MenuComponent";
import { IconButton } from '@mui/material';

import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import config from '../config';
import { projAPI } from '../ApiCalls';

import "./TaskBoardPage.css";
import projects from "../images/projs.svg";
import membs from "../images/members.svg";
import ColumnsComponent from "../components/ColumnsComponent";


const TaskBoardPage = () => {
    const [clicked, setClicked] = React.useState(false);
    const token = localStorage.getItem('token');
    const [isLoaded, setIsLoaded] = useState(false);
    const [projs, setProjs] = useState([]);
    const [name, setName] = useState();
    const projsRef = useRef(projs);

    // 

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const handleInputChange = (event) => {
        // setTaskName(event.target.value);
    }

    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const open2 = Boolean(anchorEl2);
    const handleClose2 = (event) => {
        if (event.target.id != "renameField") {
            changeName(token, name);
            setAnchorEl2(null);
            setAnchorEl(null);
        }

    };

    // const renameState = (event) => {
    //     handleClick2(event);
    // }

    const handleDeleteClick = () => {
        const projToken = window.localStorage.getItem('project');
        deleteProject(projToken);

    }

    const MyOptions = [
        <Button onClick={() => changeName(token, "Proj")} id="rename">Rename</Button>,
        <Button onClick={() => handleDeleteClick} id="delete">Delete</Button>,
    ];

    const changeNameHandle = (e) => {
        console.log("GHGHJHK");
        handleClick2(e);
    }

    const handleClick3 = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const open3 = Boolean(anchorEl);


    const handleClose = (event) => {
        if (event.target.id != "rename") {
            setAnchorEl(null);
        }
    };

    // 

    const updateClicked = (cld) => {
        setClicked(cld);
    }

    const logOut = () => {
        localStorage.clear();
        window.location.reload();
    }

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleLinkClick = (value) => {
        window.localStorage.setItem('project', JSON.stringify(value));
        window.dispatchEvent(new Event("storage"));
        updateClicked(true);
    };

    const receiveProjects = async () => {
        try {
            const recProjs = await projAPI.getProjs(token).then((val) => val);
            projsRef.current = recProjs;
            console.log(projsRef.current);
        } catch (error) {
            console.log('Error in receive function:', error);
        }
    }

    const createProject = async () => {
        await projAPI.createProj(token);
        setIsLoaded(false);
    }

    const deleteProject = async (projectId) => {
        console.log(projectId);
        await projAPI.deleteProj(token, projectId);
        if (projectId == window.localStorage.getItem('project')) {
            window.localStorage.removeItem('project');
            window.dispatchEvent(new Event("storage"));
        }
        setIsLoaded(false);
    }

    const changeName = async (userToken, newProjName) => {
        const projToken = window.localStorage.getItem('project');
        await projAPI.changeProjectName(userToken, projToken, newProjName);
        setIsLoaded(false);
    }

    useEffect(() => {
        (async () => {
            await receiveProjects();
            setIsLoaded(true);

            const receiveProjsMessage = () => {
                receiveProjects();
                setIsLoaded(true);
            }

            config.socket.on('updateProject', receiveProjsMessage);
            return () => {
                config.socket.off('updateProject', receiveProjsMessage);
            };
        })();

    }, [isLoaded]);

    return (
        <div>
            <div className="rectangle">
                <div className="rectangle-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="100" ><path d="M23,15h-.667c-.25,0-.498,.019-.745,.057l-7.046-5.284,1.688-1.616c.399-.382,.413-1.016,.031-1.414-.383-.399-1.017-.412-1.414-.031l-4.173,3.995c-.208,.208-.491,.315-.788,.29-.298-.024-.56-.175-.739-.425-.274-.38-.19-.975,.168-1.334l4.703-4.429c.891-.837,2.284-1.042,3.374-.495l2.316,1.158c.69,.345,1.464,.527,2.235,.527h1.056c.553,0,1-.447,1-1s-.447-1-1-1h-1.056c-.463,0-.928-.109-1.342-.316l-2.314-1.158c-1.824-.913-4.153-.574-5.641,.828l-.618,.582-.7-.638c-.919-.837-2.109-1.298-3.39-1.298-.771,0-1.54,.182-2.227,.525l-2.314,1.158c-.415,.207-.88,.316-1.343,.316H1c-.553,0-1,.447-1,1s.447,1,1,1h1.056c.771,0,1.545-.183,2.236-.527l2.316-1.158c1.022-.514,2.458-.375,3.374,.462l.587,.535-2.646,2.492c-1.073,1.072-1.244,2.767-.398,3.938,.52,.723,1.553,1.259,2.444,1.259,.793,0,1.554-.312,2.104-.863l1.006-.963,6.346,4.759c-.031,.022-6.198,4.646-6.198,4.646-.723,.562-1.732,.562-2.47-.011l-6.091-4.568c-.859-.645-1.925-1-3-1h-.667c-.553,0-1,.447-1,1s.447,1,1,1h.667c.645,0,1.284,.213,1.8,.6l6.077,4.558c.725,.564,1.594,.846,2.461,.846,.862,0,1.723-.279,2.437-.835l6.093-4.568c.515-.387,1.154-.6,1.799-.6h.667c.553,0,1-.447,1-1s-.447-1-1-1Z" /></svg>
                </div>
                <div className="rectangle-projs">
                    <img src={projects}></img>
                </div>
                <div className="rectangle-mems">
                    <img src={membs}></img>
                </div>
            </div>
            <div className="projects">
                <div className="projects-header">
                    <p style={{ fontFamily: "Exo 2" }}>Projects</p>
                </div>
                <div className="projects-list">
                    <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Projects" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>

                        <List>
                            {(projsRef.current).map((value) => {
                                const labelId = `${value.project_id}-label`;
                                return (
                                    <div>
                                        <ListItem
                                            sx={{ pl: 3 }}
                                            key={value.project_id}
                                            role="listitem"
                                            button
                                        >
                                            <p onClick={() => handleLinkClick(value.project_id)}>{value.project_name}</p>

                                            <IconButton aria-label="more"
                                                onClick={handleClick3}
                                                aria-haspopup="true"
                                                aria-controls="long-menu"
                                                id={value.project_id}>
                                                <MoreVertIcon id={value.project_id}
                                                    onClick={() => handleLinkClick(value.project_id)}></MoreVertIcon>

                                            </IconButton>
                                            <MenuComonent MyOptions={[<Button onClick={() => deleteProject(value.project_id)} id="delete">Delete</Button>,
                                            <Button
                                                aria-haspopup="true"
                                                aria-controls="long-menu"
                                                onClick={changeNameHandle}
                                                id="rename"
                                            >Rename</Button>]}
                                                handleClose={handleClose}
                                                anchorEl={anchorEl}
                                                open={open3}
                                            ></MenuComonent>
                                            <MenuComonent MyOptions={[
                                                <TextField
                                                    onChange={(event) => { setName(event.target.value); }}
                                                    id="renameField"
                                                    label="Standard"
                                                    variant="standard" />]}
                                                handleClose={handleClose2}
                                                anchorEl={anchorEl2}
                                                open={open2}
                                            ></MenuComonent>

                                        </ListItem>
                                    </div>
                                );
                            })}
                        </List>
                    </Collapse>
                    <Button onClick={createProject}>new project</Button>
                </div>
            </div>
            <div className='log-out-button'>
                <Button onClick={logOut}>
                    Log Out
                </Button>
            </div>
            <div className="mainsect">
                <div className="tasks">
                    <ColumnsComponent clicked={clicked} updClkd={() => updateClicked} />
                </div>
            </div>
        </div>
    );
}

export default TaskBoardPage;