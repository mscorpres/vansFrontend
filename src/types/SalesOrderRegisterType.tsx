export interface RowData {
    // id: number;
    req_id: string;
    customer_code: string;
    customer: string;
    cost_center: string;
    delivery_term: string;
    payment_term: string;
    status: string;
    create_by: string;
    create_dt:string;
  }
export type Payload = {
  wise: string;
  data: string;
}


