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
            console.log('Data received: ', data);
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
            console.log('Text saved = ', data);
        } catch (error) {
            console.error('ERROR saving text = ', error);
        }
    },
};


const taskAPI = {
    getTasksDB: async () => {
        try {
            const response = await fetch(`${config.host}/project/tasks`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log('Data received: ', data);
            return data;
        } catch (error) {
            console.error('ERROR receiving data = ', error);
            throw error;
        }
    },

    updateTaskDB: async (task, newstate) => {
        try {
            const response = await fetch(`${config.host}/project/changeState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskID: task.id, newState: newstate }),
            });
            const data = await response.json();
            console.log('Task saved = ', data);
        } catch (error) {
            console.error('ERROR saving text = ', error);
            throw error;
        }
    },

    createTaskDB: async (name, newstate) => {
        try {
            const response = await fetch(`${config.host}/project/createTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskName: name, newState: newstate }),
            });
            const data = await response.json();
            console.log('Task created = ', data);
        } catch (error) {
            console.error('ERROR saving text = ', error);
            throw error;
        }
    },

    deleteTaskDB: async (taskId) => {
        try {
            const response = await fetch(`${config.host}/project/deleteTask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskID: taskId }),
            });
            const data = await response.json();
            console.log('Task deleted:', data);
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
