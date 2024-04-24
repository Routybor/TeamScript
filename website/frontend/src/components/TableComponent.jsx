import { Button } from '@material-ui/core';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';

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
    return (
        <table className="table" style={{ cursor: "pointer" }}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.project_id}>
                        <td>{item.project_id}</td>
                        <td><Link to="./taskboard" onClick={() => handleLinkClick(item.project_id)}>{item.project_name}</Link></td>
                        <td><Button onClick={() => { deleteProj(item.project_id) }}>Delete</Button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default memo(TableComponent);