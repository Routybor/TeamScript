import React, { useState } from 'react';
import Loader from '../helper/Loader';
import TableComponent from '../components/TableComponent';
import config from '../config';


import _ from 'lodash';


const ProjectTable = () => {
  const [state, setState] = useState({ isLoad: true, data: [], sort: "asc", sortField: 'id' });

  async function componentDidMounth(credential) {
    const response = await fetch(`${config.host}/projects/getProjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credential)
    });
    const data = await response.json()
    console.log(data)
    setState({
      isLoading: false,
      data: data
    })
  }
  const [token, setToken] = useState();
  setToken(localStorage.getItem("token"));
  componentDidMounth(token);
  return (
    <div className="container">
      {
        state.isLoad
          ? <Loader />
          : <TableComponent
            data={state.data}
          />
      }
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