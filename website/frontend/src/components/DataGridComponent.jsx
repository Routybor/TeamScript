import React, { useState } from "react";
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';

const columns = [
    { field: 'id',
      headerName: 'ID', 
      width: 90 
    },
    {
      field: 'name',
      headerName: "Project's name",
      width: 150,
      editable: true,
    },
    {
      field: 'creator',
      headerName: 'Creator',
      width: 150,
      editable: true,
    },
    {
      field: 'date',
      headerName: 'Date of creation',
      type: 'number',
      width: 150,
      editable: true,
    },
];
const rows = [
    { id: 1, name: 'Snow', creator: 'Jon', date: 35 },
    { id: 2, name: 'Lannister', creator: 'Cersei', date: 42 },
    { id: 3, name: 'Lannister', creator: 'Jaime', date: 45 },
    { id: 4, name: 'Stark', creator: 'Arya', date: 16 },
    { id: 5, name: 'Targaryen', creator: 'Daenerys', date: 100 },
];
  
export default function DataGridDemo() {
    return (
      <Box sx={{ height: 480, width: '45%', marginLeft:'auto', marginRight:'auto', marginTop:'1%'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 7,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    );
}