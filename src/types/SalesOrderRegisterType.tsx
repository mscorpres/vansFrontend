export interface RowData {
    // id: number;
    approveStatus: string;
    clintCode: string;
    clintname: string;
    createBy: string;
    createDate: string;
    soInvoiceStatus: string;
    soStatus: string;
    so_id: string;
    costcenter: string;
    supplierName:string;
    shipment_id:string
    material_status:string,
    approval_status:string
  }
export type Payload = {
  wise: string;
  data: string;
}


