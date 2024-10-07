import { RowData } from "@/types/SalesEtransactionTypes";
import { ColDef } from "ag-grid-community";


export const columnDefs: ColDef<RowData>[] = [
    { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter' },
    { headerName: 'Invoice Date', field: 'delivery_challan_dt', filter: 'agDateColumnFilter' },
    { headerName: 'Invoice Number', field: 'so_ship_invoice_id', filter: 'agTextColumnFilter' },
    { headerName: 'Client', field: 'client', filter: 'agTextColumnFilter' },
    { headerName: 'Client Code', field: 'client_code', filter: 'agTextColumnFilter' },
    { headerName: 'E-Invoice Number', field: 'invoiceNo', filter: 'agTextColumnFilter' },
    { headerName: 'E-Invoice Date', field: 'invoiceDate', filter: 'agDateColumnFilter' },
    { headerName: 'IRN Number', field: 'irnno', filter: 'agTextColumnFilter' },
    { headerName: 'Client Address', field: 'clientaddress1', filter: 'agTextColumnFilter' },
    { headerName: 'Billing Address', field: 'billingaddress1', filter: 'agTextColumnFilter' },
    { headerName: 'Shipping Address', field: 'shippingaddress1', filter: 'agTextColumnFilter' }
  ];