
export interface RowData {
  type?: string;
  material?: string;
  asinNumber?: string;
  orderQty?: number;
  rate?: number;
  currency?: string;
  gstRate?: number;
  gstType?: string;
  localValue?: number;
  foreignValue?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  dueDate?: string;
  hsnCode?: string;
  isNew?: boolean;
}

export const columnDefs= [
  { headerName: "Index", valueGetter: "node.rowIndex + 1",maxWidth: 100 },
  { headerName: "Type", field: "type", cellEditor: "selectEditor", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Material", field: "material", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "ASIN Number", field: "asinNumber", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Order Qty", field: "orderQty", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Rate", field: "rate", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Currency", field: "currency", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 250 },
  { headerName: "GST Rate", field: "gstRate", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "GST Type", field: "gstType", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Local Value", field: "localValue", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Foreign Value", field: "foreignValue", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "CGST", field: "cgst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "SGST", field: "sgst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "IGST", field: "igst", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "Due Date", field: "dueDate", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
  { headerName: "HSN Code", field: "hsnCode", editable: false, flex: 1, cellRenderer: "textInputCellRenderer", minWidth: 200 },
];

export const dummyData: RowData[] = [
  {
    type: "products",
    material: "Steel",
    asinNumber: "B01N1SE4EP",
    orderQty: 100,
    rate: 50,
    currency: "USD",
    gstRate: 18,
    gstType: "local",
    localValue: 5000,
    foreignValue: 5000,
    cgst: 9,
    sgst: 9,
    igst: 0,
    dueDate: "2024-07-25",
    hsnCode: "123456",
  },
  {
    type: "components",
    material: "Plastic",
    asinNumber: "B01N2I3E4G",
    orderQty: 200,
    rate: 20,
    currency: "EUR",
    gstRate: 18,
    gstType: "inter state",
    localValue: 4000,
    foreignValue: 4000,
    cgst: 0,
    sgst: 0,
    igst: 18,
    dueDate: "2024-08-01",
    hsnCode: "654321",
  },
  {
    type: "products",
    material: "Aluminium",
    asinNumber: "B01N2D4J5H",
    orderQty: 150,
    rate: 30,
    currency: "INR",
    gstRate: 18,
    gstType: "local",
    localValue: 4500,
    foreignValue: 4500,
    cgst: 9,
    sgst: 9,
    igst: 0,
    dueDate: "2024-07-30",
    hsnCode: "987654",
  },
];

export default columnDefs;
