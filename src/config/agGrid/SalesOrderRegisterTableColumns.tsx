import { RowData } from "@/types/SalesOrderRegisterType";
import { ColDef } from "ag-grid-community";

export const columnDefs: ColDef<RowData>[] = [
    // { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter'},
    { headerName: 'Order ID', field: 'req_id', filter: 'agTextColumnFilter'},
    { headerName: 'Customer Code', field: 'customer_code', filter: 'agTextColumnFilter' },
    { headerName: 'Customer Name', field: 'customer', filter: 'agTextColumnFilter' },
    { headerName: 'Cost Center', field: 'cost_center', filter: 'agTextColumnFilter' },
    { headerName: 'Delivery Terms', field: 'delivery_term', filter: 'agDateColumnFilter' },
    { headerName: 'Payment Terms', field: 'payment_term', filter: 'agTextColumnFilter' },
    { headerName: 'Status', field: 'status', filter: 'agTextColumnFilter' },
    { headerName: 'Created By', field: 'create_by', filter: 'agTextColumnFilter' },
    { headerName: 'Created At', field: 'create_dt', filter: 'agTextColumnFilter' }
  ];