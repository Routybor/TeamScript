import React, { useState, useEffect } from 'react';
import Loader from '../helper/Loader';
import TableComponent from '../components/TableComponent';
import config from '../config';
import RegularButton from "../components/CustomButtonComponent";
import { projAPI } from '../ApiCalls';

import _ from 'lodash';


const ProjectTable = () => {
  const token = localStorage.getItem('token');
  const [isLoaded, setIsLoaded] = useState(false);
  const [projs, setProjs] = useState([]);

  const receiveProjects = async () => {
    try {
      return await projAPI.getProjs(token);
    } catch (error) {
      console.log('Error in receive function:', error);
    }
  }

  const createProject = () => {
    projAPI.createProj(token);
    setIsLoaded(false);
  }

  const deleteProject = (projectId) => {
    console.log(projectId);
    console.log(projAPI.deleteProj(token, projectId));
    setIsLoaded(false);
  }

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

  // const [state, setState] = useState({
  //   isModeSelected: false,
  //   isLoading: false,
  //   data: [],
  //   search: '',
  //   sort: 'asc',  // 'desc'
  //   sortField: 'id',
  //   row: null,
  //   currentPage: 0,
  // });

  // async function fetchData(url) {
  //   const response = await fetch(url);
  //   const data = await response.json();

  //   setState({
  //     isLoading: false,
  //     data: _.orderBy(data, state.sortField, state.sort),
  //     isModeSelected: false,
  //     search: state.search,
  //     sort: state.sort,  // 'desc'
  //     sortField: state.sortField,
  //     row: state.row,
  //     currentPage: state.currentPage,
  //   });

  // }
  // const onSort = sortField => {
  //   const cloneData = state.data.concat();
  //   const sort = state.sort === 'asc' ? 'desc' : 'asc';
  //   const data = _.orderBy(cloneData, sortField, sort);
  //   setState({ data, sort, sortField });
  // }

  // const modeSelectHandler = url => {
  //   console.log(url)
  //   setState({
  //     isModeSelected: true,
  //     isLoading: true,
  //     data: state.data,
  //     search: state.search,
  //     sort: state.sort,  // 'desc'
  //     sortField: state.sortField,
  //     row: state.row,
  //     currentPage: state.currentPage,
  //   });
  //   fetchData(url);
  // }


  // const onRowSelect = row => (
  //   setState({
  //     row: row,
  //     isModeSelected: state.isModeSelected,
  //     isLoading: state.isLoading,
  //     data: state.data,
  //     search: state.search,
  //     sort: state.sort,  // 'desc'
  //     sortField: state.sortField,
  //     currentPage: state.currentPage,

  //   })
  // )

  // const pageChangeHandler = ({ selected }) => (
  //   setState({
  //     currentPage: selected,
  //     row: state.row,
  //     isModeSelected: state.isModeSelected,
  //     isLoading: state.isLoading,
  //     data: state.data,
  //     search: state.search,
  //     sort: state.sort,  // 'desc'
  //     sortField: state.sortField,
  //   })
  // )

  // const searchHandler = search => {
  //   setState({
  //     search: search,
  //     currentPage: 0,
  //     row: state.row,
  //     isModeSelected: state.isModeSelected,
  //     isLoading: state.isLoading,
  //     data: state.data,
  //     sort: state.sort,  // 'desc'
  //     sortField: state.sortField,
  //   })
  // }

  // const getFilteredData = () => {
  //   if (!state.search) {
  //     return state.data;
  //   }
  //   var result = state.data.filter(item => {
  //     return (
  //       item["firstName"].toLowerCase().includes(search.toLowerCase()) ||
  //       item["lastName"].toLowerCase().includes(search.toLowerCase()) ||
  //       item["email"].toLowerCase().includes(search.toLowerCase())
  //     );
  //   });
  //   if (!result.length) {
  //     result = state.data;
  //   }
  //   return result;
  // }

  // const pageSize = 50;
  // if (!state.isModeSelected) {
  //   return (
  //     <div className="container">
  //       <ModeSelector onSelect={modeSelectHandler} />
  //     </div>
  //   )
  // };

  // const filteredData = getFilteredData();
  // // debugger
  // const pageCount = Math.ceil(filteredData.length / pageSize);
  // const displayData = _.chunk(filteredData, pageSize)[state.currentPage];
  // return (
  //   <div className="container">
  //     {
  //       state.isLoading
  //         ? <Loader />
  //         : <React.Fragment>
  //           <TableSearch onSearch={searchHandler} />
  //           <TableComponent
  //             data={displayData}
  //             onSort={onSort}
  //             sort={state.sort}
  //             sortField={state.sortField}
  //             onRowSelect={onRowSelect}
  //           />
  //         </React.Fragment>

  //     }

  //     {
  //       state.data.length > pageSize
  //         ? <ReactPaginate
  //           previousLabel={'<'}
  //           nextLabel={'>'}
  //           breakLabel={'...'}
  //           breakClassName={'break-me'}
  //           pageCount={pageCount}
  //           marginPagesDisplayed={2}
  //           pageRangeDisplayed={5}
  //           onPageChange={pageChangeHandler}
  //           containerClassName={'pagination'}
  //           activeClassName={'active'}
  //           pageClassName="page-item"
  //           pageLinkClassName="page-link"
  //           previousClassName="page-item"
  //           nextClassName="page-item"
  //           previousLinkClassName="page-link"
  //           nextLinkClassName="page-link"
  //           forcePage={state.currentPage}
  //         /> : null
  //     }

  //     {
  //       state.row ? <DetailRowView person={state.row} /> : null
  //     }
  //   </div>
  // );
}

export default ProjectTable;