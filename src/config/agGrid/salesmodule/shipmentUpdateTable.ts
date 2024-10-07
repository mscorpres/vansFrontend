import { ColDef } from "ag-grid-community";

export const columnDefs: ColDef[] = [
  {
    headerName: "#",
    field: "id",
    valueGetter: "node.rowIndex + 1",
    sortable: true,
    filter: true,
    maxWidth: 100,
  },
  {
    headerName: "Material",
    field: "material",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "ASIN Number",
    field: "asinNumber",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "HSN Code",
    field: "hsnCode",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "Bill Qty",
    field: "billQty",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "Rate",
    field: "rate",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "Local Value",
    field: "localValue",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "Foreign Value",
    field: "foreignValue",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "Due Date",
    field: "dueDate",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "GST Type",
    field: "gstType",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "GST %",
    field: "gstPercentage",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "CGST",
    field: "cgst",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "SGST",
    field: "sgst",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "IGST",
    field: "igst",
    cellRenderer: "salesShipmentTextCellRender",
  },
  {
    headerName: "Pick Location",
    field: "pickLocation",
    cellRenderer: "salesShipmentTextCellRender",
  },
];
interface RowData {
    material: string;
    asinNumber: string;
    hsnCode: string;
    billQty: number;
    rate: number;
    localValue: number;
    foreignValue: number;
    dueDate: string;
    gstType: string;
    gstPercentage: number;
    cgst: number;
    sgst: number;
    igst: number;
    pickLocation: string;
    isNew?:boolean
  }
  
  export const dummyRowData: RowData[] = [
    {
      material: 'Oak5GQ',
      asinNumber: '--',
      hsnCode: '85182900',
      billQty: 100,
      rate: 10,
      localValue: 1000,
      foreignValue: 1000,
      dueDate: '2024-05-21',
      gstType: 'INTER STATE',
      gstPercentage: 18,
      cgst: 0,
      sgst: 0,
      igst: 180,
      pickLocation: 'Location1',
      isNew:true
    },
  ];
  
  
  
export default columnDefs;
