import { RowData } from "@/types/SalesOrderAllocatedInvoicesType";
import { ColDef } from "ag-grid-community";

export const columnDefs: ColDef<RowData>[] = [
    { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter' },
    { headerName: 'Courier Name', field: 'couriarName', filter: 'agTextColumnFilter' },
    { headerName: 'Invoice Date', field: 'invoiceDate', filter: 'agDateColumnFilter' },
    { headerName: 'CO Invoice ID', field: 'coInvoiceId', filter: 'agTextColumnFilter' },
    { headerName: 'Billing Address', field: 'billingAddress', filter: 'agTextColumnFilter' },
    { headerName: 'Client Address', field: 'clientAddress', filter: 'agTextColumnFilter' },
    { headerName: 'Shipping Address', field: 'shippingAddress', filter: 'agTextColumnFilter' }
  ];