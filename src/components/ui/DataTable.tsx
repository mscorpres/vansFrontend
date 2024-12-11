import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import FullPageLoading from "../shared/FullPageLoading";
import SpeedDialActions from "./SpeedDialActions";

// const columns: GridColDef<(typeof rows)[number]>[] = [
//   { field: "id", headerName: "ID", width: 90 },
//   {
//     field: "firstName",
//     headerName: "First name",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "lastName",
//     headerName: "Last name",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "age",
//     headerName: "Age",
//     type: "number",
//     width: 110,
//     editable: true,
//   },
//   {
//     field: "fullName",
//     headerName: "Full name",
//     description: "This column has a value getter and is not sortable.",
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

export default function DataTable({
  columns,
  rows,
  checkboxSelection,
  loading,
}: any) {
  return (
    <Box
      className=" h-[calc(100vh-100px)] relative"
      sx={{ width: "100%", backgroundColor: "#fffefd" }}
    >
      {loading && <FullPageLoading />}
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#E0F2F1", // Set header background color here
            color: "black", // Set header text color here
            fontWeight: "bold", // Set font weight for the header text
          },
          //   "& .MuiDataGrid-columnHeaderTitle": {
          //     textTransform: "uppercase", // Optional: Convert header titles to uppercase
          //   },
        }}
        initialState={
          {
            //   pagination: {
            //     paginationModel: {
            //       pageSize: 5,
            //     },
            //   },
          }
        }
        // pageSizeOptions={[5]}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
