import React from 'react';
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
        onRowSelect
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
                    <tr>
                        <td>{item.project_id}</td>
                        <td><Link to="./taskboard" onClick={() => handleLinkClick(item.project_id)}>{item.project_name}</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableComponent;