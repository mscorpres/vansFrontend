// src/config/agGrid/tableColumns.tsx
import ActionCellRenderer from "./ActionCellRenderer";
export const tablecolumns = (
  viewRow: (data: any) => void,
  editRow: (data: any) => void,
  deleteRow: (data: any) => void,
  saveRows: (data: any) => void
) => [
  {
    field: "index",
    headerName: "INDEX",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "type",
    headerName: "TYPE",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "material",
    headerName: "MATERIAL",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "asinNumber",
    headerName: "ASIN NUMBER",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "ordQty",
    headerName: "ORD. QTY",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "rate",
    headerName: "RATE",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "gstRate",
    headerName: "GST RATE",
    editable: false,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    minWidth: 200,
  },
  {
    field: "action",
    headerName: "ACTION",
    editable: false,
    minWidth: 150,
    flex: 1,
    cellRenderer: (params: any) => (
      <ActionCellRenderer
        onView={viewRow}
        onEdit={editRow}
        onDelete={deleteRow}
        onSave={saveRows}
        data={params.data}
      />
    ),
  },
];
