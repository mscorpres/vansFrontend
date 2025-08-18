import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";
import { create } from "lodash";

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
  invoiceData: any[];
  ewayBillData: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  challanDetails: [],
  invoiceData: [],
  ewayBillData: [],
  loading: false,
  error: null,
};
interface FetchSellInvoicePayload {
  type: any;
  data: string;
}

interface CancelPayload {
  invoice_no: string;
  cancelReason: string;
}
interface DownloadEInvoicePayload {
  wise: string;
  data: string;
}
export const fetchSalesOrderInvoiceList = createAsyncThunk<
  ApiResponse<any>,
  FetchSellInvoicePayload
>("so_challan_shipment/fetchInvoiceList", async (payload) => {
  const response = await spigenAxios.get(
    `salesInvoice/fetchInvoiceList?data=${payload.data}&type=${payload.type}`
  );
  return response.data;
});

export const printSellInvoice = createAsyncThunk(
  "client/printSellInvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      // Replace / with _ in so_invoice
      const modifiedInvoice = payload.invoiceNo.replace(/\//g, "_");

      // Construct the URL with query parameters
      const url =
        spigenAxios.defaults.baseURL +
        `so_challan_shipment/printSellInvoice?so_invoice=${encodeURIComponent(
          modifiedInvoice
        )}&printType=${encodeURIComponent(payload.printType)}`;

      // Make the GET request
      window.open(url, "_blank");
      return;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const printSellInvoice2 = createAsyncThunk(
  "client/printSellInvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/salesInvoice/printEInvoice",
        payload
      );

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      console.log(response.data)
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
export const addfreight=createAsyncThunk(
  "client/addfreight",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/salesOrder/addFreightToInvoice",
        payload
      );

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
)
export const downloadEInvoiceList = createAsyncThunk<
  ApiResponse<{ filePath: string }>,
  DownloadEInvoicePayload
>("invoice/downloadEInvoiceList", async (payload, { rejectWithValue }) => {
  try {
    const response = await spigenAxios.post("/invoice/downloadEinvoicelist", payload);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to download E-Invoice list");
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const fetchDataForEwayBill = createAsyncThunk(
  "so_challan_shipment/fetchDataForEwayBill",
  async ({ shipment_id }: { shipment_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.get<any>(
        `invoice/fetchEWB?so_inv_id=${shipment_id}`
      );

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const fetchDataForInvoice = createAsyncThunk(
  "so_challan_shipment/fetchEinvoice",
  async ({ shipment_id }: { shipment_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.get<any>(
        `invoice/fetchEinvoice?so_inv_id=${shipment_id}`
        
      );

      if (!response.data) {
        throw new Error("No data received");
      }
      // Return the entire response as expected by the fulfilled case
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const cancelInvoice = createAsyncThunk(
  "client/cancelInvoice",
  async (payload: CancelPayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.put<any>(
        "/invoice/cancelInvoice",
        payload
      )) as any;

      if (response?.data?.success) {
        toast({
          title: response?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createEwayBill = createAsyncThunk(
  "client/createEwayBill",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post(
        "invoice/createEwaybill",
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const generateEInvoice = createAsyncThunk(
  "client/generateEInvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post(
        "invoice/createEinvoice",
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
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
      const response = await spigenAxios.get<any>(
        `salesInvoice/fetchInvoiceDetail?invoiceNo=${invoiceNo}`
        
      );

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
      .addCase(addfreight.pending, (state) => {
        state.loading = true;
      })
      .addCase(addfreight.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addfreight.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(createEwayBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEwayBill.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceData = action.payload.data;
      })
      .addCase(createEwayBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(generateEInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateEInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoiceData = action.payload.data;
      })
      .addCase(generateEInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
          action.payload.message || "Failed to fetch invoice challan details";
        state.loading = false;
      })
      .addCase(fetchInvoiceDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch invoice order shipment list";
      })
      .addCase(fetchDataForEwayBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataForEwayBill.fulfilled, (state, action) => {
        state.ewayBillData = action.payload.items;
        state.loading = false;
      })
      .addCase(fetchDataForEwayBill.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(fetchDataForInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDataForInvoice.fulfilled, (state, action) => {
        state.ewayBillData = action.payload.items;
        state.loading = false;
      })
      .addCase(fetchDataForInvoice.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })
      .addCase(downloadEInvoiceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadEInvoiceList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(downloadEInvoiceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sellInvoiceSlice.reducer;
