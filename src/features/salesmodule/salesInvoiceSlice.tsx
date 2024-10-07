import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}


;

interface SellInvoiceData {
  channel: string; 
  delivery_challan_dt: string;
  so_ship_invoice_id: string; 
  client: string;
  client_code: string;
  clientaddress1: string;
  clientaddress2: string;
  billingaddress1: string;
  billingaddress2: string;
  shippingaddress1: string;
  shippingaddress2: string;
}


interface SellShipmentState {
  data: SellInvoiceData[];
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  loading: false,
  error: null,
};
interface FetchSellInvoicePayload {
  wise: any;
  data: string;
}

export const fetchSalesOrderInvoiceList = createAsyncThunk<
  ApiResponse<any>,
  FetchSellInvoicePayload

>("so_challan_shipment/fetchDeliveryChallan", async (payload) => {
  const response = await spigenAxios.post("so_challan_shipment/fetchDeliveryChallan", payload);
  return response.data;
});



const sellInvoiceSlice = createSlice({
  name: "sellInvoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchSalesOrderInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderInvoiceList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to fetch invoice order shipment list";
        }
        state.loading = false;
      })
      .addCase(fetchSalesOrderInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch invoice order shipment list";
      });

      
      


  },
});


export default sellInvoiceSlice.reducer;
