import React, { useState, useEffect } from 'react';
import Loader from '../helper/Loader';
import TableComponent from '../components/TableComponent';
import config from '../config';
import RegularButton from "../components/CustomButtonComponent";
import { projAPI } from '../ApiCalls';

import _ from 'lodash';


const ProjectTable = () => {
  // const [state, setState] = useState({ isLoad: true, data: [], sort: "asc", sortField: 'id' });
  const token = localStorage.getItem('token');
  const [isLoaded, setIsLoaded] = useState(false);
  const [projs, setProjs] = useState([]);

  // async function componentDidMounth(Token) {
  //   const response = await fetch(`${config.host}/project/getProjects`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Token': Token
  //     }
  //   });
  //   const data = await response.json();
  //   // const strData = JSON.stringify(dataBD);
  //   // const data = JSON.parse(strData).Token;
  //   console.log(data);
  //   setState({
  //     isLoad: false,
  //     data: data
  //   })
  // }

  const receiveProjects = async () => {
    try {
      return await projAPI.getProjs(token);
    } catch (error) {
      console.log('Error in receive function:', error);
    }
  }

  const createProject = () => {
    projAPI.createProjDB(token);
    setIsLoaded(false);
  }

  const deleteProject = (projectId) => {
    console.log(projectId);
    console.log(projAPI.deleteProjDB(token, projectId));
    setIsLoaded(false);
  }

  // async function createProject() {
  //   const response = await fetch(`${config.host}/project/createProject`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userToken: token, projectName: 'Default' }),
  //   });

  //   const data = await response.json();
  //   data.push({ project_name: 'Default' });
  //   console.log(data);
  //   setState({
  //     isLoad: false,
  //     data: data
  //   })
  // }

  // useEffect(() => {
  //   componentDidMounth(token);
  //   config.socket.on('updateProject', (data) => {
  //     componentDidMounth(token);
  //   });

  //   return () => {
  //     config.socket.off('updateProject');
  //   };
  // }, []);
  // if (state.isLoad) {
  //   componentDidMounth(token);
  // }

  useEffect(() => {
    (async () => {
      const recProjs = await receiveProjects().then((val) => val);
      setProjs(recProjs);
      setIsLoaded(true);
      config.socket.on('updateProject', (data) => {
        receiveProjects();
      });
      return () => {
        config.socket.off('updateProject');
      };
    })();

  }, [isLoaded]);

  return (
    <div className="container">
      {
        !isLoaded
          ? <Loader />
          : <TableComponent
            data={projs}
            deleteProj={deleteProject}
          />
      }
      <form className="formm">
        <RegularButton onClick={createProject} color="google">
          Create
        </RegularButton>
      </form>
    </div>
  );
  
}

export default ProjectTable;