import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";


interface SellRequestPayload {
  headers: {
    channel: string;
    customer: string;
    customer_branch: string;
    customer_address1: string;
    customer_address2: string;
    customer_gstin: string;
    bill_id: string;
    billing_address1: string;
    billing_address2: string;
    isSameClientAdd: string;
    shipping_id: string;
    shipping_address1: string;
    shipping_address2: string;
    shipping_pinCode: string;
    [key: string]: any; 
  };
  materials: {
    items: string[];
    qty: number[];
    price: number[];
    gst_rate: number[];
    so_type: string[];
    hsn: string[];
    cgst: number[];
    sgst: number[];
    igst: number[];
    gst_type: string[];
    currency: string[];
    exchange_rate: number[];
    due_date: string[];
    remark: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}


export const createSellRequest = createAsyncThunk<
  ApiResponse<any>,
  SellRequestPayload
>("/sellRequest/createSellRequest", async (payload) => {
  const response = await spigenAxios.post("/sellRequest/createSellRequest", payload);
  return response.data;
});

interface SellRequest {
  hasInvoice: boolean;
  req_id: string;
  channel: string;
  type: string;
  customer_code: string;
  client_addr_id: string;
  bill_id: string;
  ship_id: string;
  customer: string;
  project_id: string;
  cost_center: string;
  delivery_term: string;
  payment_term: string;
  create_by: string;
  create_dt: string;
  status: string;
}


interface SellRequestState {
  data: SellRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: SellRequestState = {
  data: [],
  loading: false,
  error: null,
};
interface FetchSellRequestPayload {
  wise: any;
  data: string;
}


export const fetchSellRequestList = createAsyncThunk<
  ApiResponse<SellRequest[]>,
  FetchSellRequestPayload
>("sellRequest/fetchSellRequestList", async (payload) => {
  const response = await spigenAxios.post("sellRequest/fetchSellRequestList", payload);
  return response.data;
});

export const fetchSalesOrderShipmentList = createAsyncThunk<
  ApiResponse<any>,
  { data: string; wise: any }
>("sellRequest/fetchSalesOrderShipmentList", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/fetchSalesOrderShipmentList", payload);
  return response.data;
});





const sellRequestSlice = createSlice({
  name: "sellRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSellRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSellRequest.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createSellRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sell request";
      })

      

      .addCase(fetchSellRequestList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellRequestList.fulfilled, (state, action) => {
        console.log("Data received in slice:", action.payload.data); 
        state.data = action.payload.data; 
        state.loading = false;
      })
      .addCase(fetchSellRequestList.rejected, (state, action) => {
        console.error("Fetch failed:", action.error);
        state.error = action.error?.message || null;
        state.loading = false;
      })
      
     
      .addCase(fetchSalesOrderShipmentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderShipmentList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to fetch sales order shipment list";
        }
        state.loading = false;
      })
      .addCase(fetchSalesOrderShipmentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch sales order shipment list";
      })


      
  
  },
});


export default sellRequestSlice.reducer;
