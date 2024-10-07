import { ColDef } from "@ag-grid-community/core";


export const columnDefs: ColDef[] = [
  {
    headerName: '#',
    field: 'actions',
    cellRenderer: 'actionsCellRenderer', // Custom cell renderer for actions
    sortable: false,
    filter: false,
    maxWidth:70
  },
  {
    headerName: 'Client ID',
    field: 'clientID',
    sortable: true,
    filter: true,
    width: 150,
  },
  {
    headerName: 'Name',
    field: 'name',
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    headerName: 'Email',
    field: 'email',
    sortable: true,
    filter: true,
    width: 200,
  },
  {
    headerName: 'Mobile',
    field: 'mobile',
    sortable: true,
    filter: true,
    width: 150,
  },
  {
    headerName: 'PAN',
    field: 'pan',
    sortable: true,
    filter: true,
    width: 150,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    filter: true,
    cellRenderer: 'statusCellRenderer', // Custom cell renderer for status
    width: 150,
  },
];

export const editViewColdef: ColDef[] = [
  { headerName: 'Address ID', field: 'addressId' },
  { headerName: 'City', field: 'city' },
  { headerName: 'Address', field: 'address',autoHeight:true,minWidth:300 },
  { headerName: 'GST', field: 'gst' },
  { headerName: 'Contact', field: 'contact' },
  { headerName: 'Pin Code', field: 'pinCode' },
  {
    headerName: 'Action',
    field: 'action',
    cellRenderer: 'editViewCellRenderer',
  },
];
export default columnDefs;
