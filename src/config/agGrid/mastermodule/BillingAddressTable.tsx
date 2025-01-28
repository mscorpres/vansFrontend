import CopyCellRenderer from "@/components/shared/CopyCellRenderer";
import { ColDef } from "@ag-grid-community/core";

export const columnDefs: ColDef[] = [
  {
    headerName: "Label",
    field: "label",
    flex: 1,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "Company",
    field: "company",
    flex: 1,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "State",
    field: "state",
    flex: 1,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "PAN No.",
    field: "pan",
    flex: 1,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "GST No",
    field: "gst",
    flex: 1,
    cellRenderer: CopyCellRenderer,
  },
  {
    headerName: "CIN No",
    field: "cin",
    flex: 1,
    cellRenderer: CopyCellRenderer,
  },
  // { headerName: "Register Date", field: "insert_dt", flex: 1 },
];
