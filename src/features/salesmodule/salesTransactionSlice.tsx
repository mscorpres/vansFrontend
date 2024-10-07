import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";



export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}



interface eInvoice {
    delivery_challan_dt: string; 
    so_ship_invoice_id: string | number; 
    invoiceNo: string; 
    invoiceDate: string;
    irnno: string; 
    client: string; 
    client_code: string | number; 
    clientaddress1: string; 
    clientaddress2: string; 
    billingaddress1: string;
    billingaddress2: string; 
    shippingaddress1: string;
    shippingaddress2: string; 
  }


interface eInvoiceState {
  data: eInvoice[];
  loading: boolean;
  error: string | null;
}

const initialState: eInvoiceState = {
  data: [],
  loading: false,
  error: null,
};
interface FetchTransactionPayload {
  wise: any;
  data: string;
}


export const fetchInvoiceList = createAsyncThunk<
ApiResponse<eInvoice[]>,
FetchTransactionPayload
>("so_challan_shipment/getEinvoiceList", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/getEinvoiceList", payload);
  return response.data;
});

export const fetchEwayList = createAsyncThunk<
  ApiResponse<any>,
  FetchTransactionPayload
>("so_challan_shipment/getEwayBillList", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/getEwayBillList", payload);
  return response.data;
});




const eTranactionRegisterSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
     
      .addCase(fetchInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to fetch transaction list";
        }
        state.loading = false;
      })
      .addCase(fetchInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transcation list";
      })



  },
});


export default eTranactionRegisterSlice.reducer;
