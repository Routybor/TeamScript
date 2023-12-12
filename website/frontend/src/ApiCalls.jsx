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
            const response = await fetch(`${config.host}/taskBoard/getTasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userToken: userToken, projectToken: projectToken }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('ERROR receiving data = ', error);
            throw error;
        }
    },

    updateTaskDB: async (task, newstate, projectToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/changeState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskID: task.id, newState: newstate, projectToken: projectToken }),
            });
            const data = await response.json();
        } catch (error) {
            console.error('ERROR saving text = ', error);
            throw error;
        }
    },

    createTaskDB: async (name, newstate, projectToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskName: name, newState: newstate, projectToken: projectToken }),
            });
            const data = await response.json();
        } catch (error) {
            console.error('ERROR saving text = ', error);
            throw error;
        }
    },

    deleteTaskDB: async (taskId, projectToken) => {
        try {
            const response = await fetch(`${config.host}/taskBoard/deleteTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
};


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

export { textAPI, taskAPI, authAPI };
