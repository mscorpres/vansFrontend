import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

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
  challanDetails: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  challanDetails: [],
  loading: false,
  error: null,
};
interface FetchSellInvoicePayload {
  type: any;
  data: string;
}

export const fetchSalesOrderInvoiceList = createAsyncThunk<
  ApiResponse<any>,
  FetchSellInvoicePayload
>("so_challan_shipment/fetchInvoiceList", async (payload) => {
  const response = await spigenAxios.post(
    "salesInvoice/fetchInvoiceList",
    payload
  );
  return response.data;
});

export const printSellInvoice = createAsyncThunk(
  "client/printSellInvoice",
  async ({ invoiceNo }: { invoiceNo: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>("/invoice/printInvoice", {
        invoiceNo: invoiceNo,
      });

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchInvoiceDetail = createAsyncThunk(
  "client/fetchInvoiceDetail",
  async ({ invoiceNo }: { invoiceNo: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>("/salesInvoice/fetchInvoiceDetail", {
        invoiceNo: invoiceNo,
      });

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const sellInvoiceSlice = createSlice({
  name: "sellInvoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(printSellInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(printSellInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printSellInvoice.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(fetchSalesOrderInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderInvoiceList.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.error =
          action.payload.message ||
          "Failed to fetch invoice order shipment list";
        state.loading = false;
      })
      .addCase(fetchSalesOrderInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch invoice order shipment list";
      })
      .addCase(fetchInvoiceDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceDetail.fulfilled, (state, action) => {
        state.challanDetails = action.payload.data;
        state.error =
          action.payload.message ||
          "Failed to fetch invoice challan details";
        state.loading = false;
      })
      .addCase(fetchInvoiceDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch invoice order shipment list";
      });
  },
});

export default sellInvoiceSlice.reducer;
