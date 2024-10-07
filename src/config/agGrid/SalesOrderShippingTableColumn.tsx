
import { ColDef } from "ag-grid-community";
export const columnDefs: ColDef[] = [
    { headerName: '', field: 'action',maxWidth:50 ,
      cellRenderer: 'shipmentsActionRenderer',
    },
    { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter', maxWidth:100 },
    { headerName: 'Shipment ID', field: 'shipment_id', filter: 'agTextColumnFilter' },
    { headerName: 'SO ID', field: 'so_id', filter: 'agTextColumnFilter' },
    { headerName: 'Item Part Code', field: 'item_part_no', filter: 'agTextColumnFilter' },
    { headerName: 'Item Part Name', field: 'item_name', filter: 'agTextColumnFilter' },
    { headerName: 'Item Qty', field: 'item_qty', filter: 'agNumberColumnFilter' },
    { headerName: 'Item Rate', field: ' item_rate', filter: 'agNumberColumnFilter' },
    { headerName: 'Shipment Date', field: 'shipment_dt', filter: 'agDateColumnFilter' },
    { headerName: 'Client Code', field: 'client_code', filter: 'agTextColumnFilter' },
    { headerName: 'Client', field: 'client', filter: 'agTextColumnFilter' },
    { headerName: 'Client Address', field: 'clientaddress', filter: 'agTextColumnFilter' },
    { headerName: 'Billing Name', field: 'billing_name', filter: 'agTextColumnFilter' },
    { headerName: 'Billing Address', field: 'billingaddress1', filter: 'agTextColumnFilter' },
    { headerName: 'Shipping Name', field: 'shipping_id', filter: 'agTextColumnFilter' },
    { headerName: 'Shipping Address', field: 'shippingaddress1', filter: 'agTextColumnFilter' },
    { headerName: 'Status', field: 'shipment_status', filter: 'agTextColumnFilter' }
  ];