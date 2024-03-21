import { Button } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import useSortableData from '../helper/useSortableData';
import "./TableComponent.css";

const TableComponent = (props) => {
    const handleLinkClick = (value) => {
        localStorage.setItem('project', JSON.stringify(value));
    };

    const {
        data,
        onSort,
        sort,
        sortField,
        onRowSelect,
        deleteProj
    } = props;

    const { items, requestSort, sortConfig } = useSortableData(data);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };


    return (
        <table className="table" style={{ cursor: "pointer" }}>
            <thead>
                <tr>
                    <th><button
                        type="button"
                        onClick={() => requestSort('project_id')}
                        className={getClassNamesFor('project_id')}

                    >
                        ID
                    </button></th>
                    <th><button
                        type="button"
                        onClick={() => requestSort('project_name')}
                        className={getClassNamesFor('project_name')}
                    >
                        Name
                    </button></th>
                    {/* <th>Date of creation</th> */}
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr>
                        <td>{item.project_id}</td>
                        <td><Link to="./taskboard" onClick={() => handleLinkClick(item.project_id)}>{item.project_name}</Link></td>
                        {/* <td>{new Date().toISOString().substring(0, 10)}</td> */}
                        <td><Button onClick={() => { deleteProj(item.project_id) }}>Delete</Button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableComponent;