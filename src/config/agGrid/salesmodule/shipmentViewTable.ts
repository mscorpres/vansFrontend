import { ColDef } from 'ag-grid-community';

const columnDefs: ColDef[] = [
  { headerName: '#', field: 'id',maxWidth:50 },
  { headerName: 'Part Code', field: 'partCode' },
  { headerName: 'Component', field: 'component' },
  { headerName: 'HSN Code', field: 'hsnCode' },
  { headerName: 'Qty', field: 'qty' },
  { headerName: 'Rate', field: 'rate' },
  { headerName: 'Pick Location', field: 'pickLocation' },
  { headerName: 'Remarks', field: 'remarks' },
];

interface RowData {
    id: number;
    partCode: string;
    component: string;
    hsnCode: string;
    qty: number;
    rate: number;
    pickLocation: string;
    remarks: string;
  }
  
 export  const dummyRowData: RowData[] = [
    {
      id: 1,
      partCode: '15705',
      component: 'Oak4GQ',
      hsnCode: '85182900',
      qty: 100,
      rate: 10,
      pickLocation: 'FG001',
      remarks: '--',
    },
    {
      id: 2,
      partCode: '15706',
      component: 'Pine3HJ',
      hsnCode: '85182901',
      qty: 150,
      rate: 12,
      pickLocation: 'FG002',
      remarks: '--',
    },
    {
      id: 3,
      partCode: '15707',
      component: 'Maple7LK',
      hsnCode: '85182902',
      qty: 200,
      rate: 15,
      pickLocation: 'FG003',
      remarks: '--',
    },
  ];
 
  
export default columnDefs;
