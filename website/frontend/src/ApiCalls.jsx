import config from './config';


const textAPI = {
    receiveTextDB: async () => {
        try {
            const response = await fetch(`${config.host}/text/getText`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('ERROR receiving data = ', error);
        }
    },

    sendUpdatedTextDB: async (newText) => {
        try {
            const response = await fetch(`${config.host}/text/saveText`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ textField: newText }),
            });
            const data = await response.json();
        } catch (error) {
            console.error('ERROR saving text = ', error);
        }
    },
};


const taskAPI = {
    getTasksDB: async (userToken, projectToken) => {
        try {
            const response = await fetch(`${config.host}/taskboard/getTasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ projectToken: projectToken }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('ERROR receiving data = ', error);
            throw error;
        }
    },

    changeTaskStateDB: async (userToken, taskID, newstate, projectToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/changeState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ taskID: taskID, newState: newstate, projectToken: projectToken }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('ERROR saving text = ', error);
            throw error;
        }
    },

    createTaskDB: async (name, newstate, priority, projectToken, userToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': userToken

                },
                body: JSON.stringify({ taskName: name, newState: newstate, priority: priority, projectToken: projectToken }),
            });
            const data = await response.json();
        } catch (error) {
            console.error('ERROR saving text = ', error);
            throw error;
        }
    },

    deleteTaskDB: async (taskId, projectToken, userToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/deleteTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ taskID: taskId, projectToken: projectToken }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    changePriorityTaskDB: async (taskId, priority, projectToken, userToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/changePriority`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ taskID: taskId, priority: priority, projectToken: projectToken }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

};

const stateAPI = {
    getStatesDB: async (projectToken) => {
        try {
            const response = await fetch(`${config.host}/row/getStates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ project_id: projectToken }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting states:', error);
            throw error;
        }
    },

    addStatesDB: async (userToken, projectToken, stateName) => {
        try {
            const response = await fetch(`${config.host}/row/addStates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ project_id: projectToken, state: stateName }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding states:', error);
            throw error;
        }
    },

    deleteStateDB: async (projectToken, stateName) => {
        try {
            const response = await fetch(`${config.host}/row/deleteStates`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId: projectToken, stateToDelete: stateName }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error delete state:', error);
            throw error;
        }
    },

    changeStateNameDB: async (projectToken, newName, oldName) => {
        try {
            const response = await fetch(`${config.host}/row/changeStateName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectId: projectToken, newStateName: newName, oldStateName: oldName }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error changing state name:', error);
            throw error;
        }
    },

}


const authAPI = {
    loginUser: async (credentials) => {
        try {
            const response = await fetch(`${config.host}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
};

const projAPI = {
    getProjs: async (userToken) => {
        try {
            const response = await fetch(`${config.host}/project/getProjects`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Token': userToken
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting projects:', error);
            throw error;
        }
    },

    createProj: async (userToken) => {
        try {
            const response = await fetch(`${config.host}/project/createProject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ projectName: 'Default' }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    deleteProj: async (userToken, projectId) => {
        try {
            const response = await fetch(`${config.host}/project/deleteProject`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ ProjectId: projectId }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw error;
        }
    },

    invitePers: async (userToken, projId, persToken) => {
        try {
            const response = await fetch(`${config.host}/project/invitePerson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ ProjectId: projId, newToken: persToken }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error inviting person:', error);
            throw error;
        }
    },

    changeProjectName: async (userToken, projId, newProjName) => {
        try {
            const response = await fetch(`${config.host}/project/changeName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': userToken
                },
                body: JSON.stringify({ projectId: projId, newName: newProjName }),
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error change name:', error);
            throw error;
        }
    },
}

export { textAPI, taskAPI, authAPI, projAPI, stateAPI };
