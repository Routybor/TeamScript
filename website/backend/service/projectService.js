const { updateProjects } = require("../socket");
const { getUsersProjectsDB,
    getUserIdByTokenDB,
    createNewProjectDB,
    addRelationUserProjectDB,
    createTableProjectDB,
    addStatesByProjectId,
    deleteProjectFromDB,
    deleteProjectFromUserProjects,
    deleteProjectFromProjects,
    changeProjectNameInDB,
    deleteAllStateByProjectIdinDB,
} = require('../database/dbQueries');


async function getProjectsHandler(token) {
    try {
        const userId = await getUserIdByTokenDB(token);
        const allProjects = await getUsersProjectsDB(userId.mytable_key);
        return allProjects;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function createProjectHandler(token, projectName) {
    try {
        const userId = await getUserIdByTokenDB(token);
        const newProjectID = await createNewProjectDB(projectName);
        console.log(newProjectID);
        await addRelationUserProjectDB(userId.mytable_key, newProjectID.project_id);
        await createTableProjectDB("Project" + newProjectID.project_id);
        // console.log(newProjectID);
        await addStatesByProjectId(newProjectID.project_id, 'No state');
        updateProjects();
        return newProjectID;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function invitePersonHandler(token, projectId, toInviteToken) {
    try {
        const userId = await getUserIdByTokenDB(toInviteToken);
        await addRelationUserProjectDB(userId.mytable_key, projectId);
        // updateProjects();
        return true;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const deleteProjectHandler = async (projectId) => {
    try {
        // Выполняем запрос на удаление таблицы проекта
        await deleteProjectFromDB(projectId);
        
        // Удаляем все строки из таблицы user_projects, где project_id равен удаляемому projectId
        await deleteProjectFromUserProjects(projectId);

        // Удаляем проект из таблицы projects
        await deleteProjectFromProjects(projectId);

        // удаляем state 
        await deleteAllStateByProjectIdinDB(projectId);

        // Возвращаем true, если удаление прошло успешно
        return true;
    } catch (error) {
        // В случае ошибки выводим её в консоль и возвращаем false
        console.error(error);
        return false;
    }
};

const changeProjectNameHandler = async (projectId, newName) => {
    try {
        // Выполняем запрос к базе данных для изменения имени проекта
        const success = await changeProjectNameInDB(projectId, newName);
        return success;
    } catch (error) {
        console.error(error);
        return false;
    }
};


module.exports = {
    getProjectsHandler,
    createProjectHandler,
    invitePersonHandler,
    deleteProjectHandler,
    changeProjectNameHandler,
};