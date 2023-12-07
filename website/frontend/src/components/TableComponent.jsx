import React from 'react';

const TableComponent = (props) => {
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
                    <th>Name</th>


                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr

                    >
                        <td>{item.ProjectName}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableComponent;