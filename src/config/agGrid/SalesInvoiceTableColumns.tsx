import { RowData } from "@/types/SalesInvoiceTypes";
import { ColDef } from "ag-grid-community";

export const columnDefs: ColDef<RowData>[] = [
    { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter' },
    { headerName: 'Date', field: 'delivery_challan_dt', filter: 'agDateColumnFilter' },
    { headerName: 'Invoice Number', field: 'invoiceNumber', filter: 'agTextColumnFilter' },
    { headerName: 'Client Code', field: 'client_code', filter: 'agTextColumnFilter' },
    { headerName: 'Client', field: 'client', filter: 'agTextColumnFilter' },
    { headerName: 'Billing Address', field: 'billingaddress1', filter: 'agTextColumnFilter' },
    { headerName: 'Shipping Address', field: 'shippingaddress1', filter: 'agTextColumnFilter' }
  ];

