import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";

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

interface materialListPayload {
  code: number;
  status: string;
  data: materialListItemData[];
}

interface materialListItemData {
  so_id: string;
  item: string;
  itemName: string;
  itemPartNo: string;
  itemSpecification: string;
  qty: string;
  rate: string;
  uom: string;
  gstRate: string;
  cgstRate: string;
  sgstRate: string;
  igstRate: string;
  dueDate: string; // Consider using Date type if you will parse it
  hsnCode: string;
  itemRemark: string;
}

export const createSellRequest = createAsyncThunk<
  ApiResponse<any>,
  SellRequestPayload
>("/sellRequest/createSellRequest", async (payload) => {
  const response = await spigenAxios.post("/purchaseOrder/createPO", payload);
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
  dateRange: string;
  sellRequestList: SellRequest[];
  loading: boolean;
  updateData: [];
   wise: any;
  error: string | null;
}

const initialState: SellRequestState = {
  data: [],
  dateRange: "",
  sellRequestList: [],
   updateData: [],
  loading: false,
   wise: null,
  error: null,
};
interface FetchSellRequestPayload {
  type: any;
  data: string;
}

interface CancelPayload {
  cancelReason: string;
  so_id: string;
}

export const fetchSellRequestList = createAsyncThunk<
  ApiResponse<SellRequest[]>,
  FetchSellRequestPayload
>("salesOrder/getSaleOrderList", async (payload) => {
  const response = await spigenAxios.get(
    `salesOrder/getSaleOrderList?data=${payload.data}&type=${payload.type}`,
    payload
  );
  return response.data;
});

export const approveSo = createAsyncThunk(
  "sellRequest/approveSo",
  async ({ so_id }: { so_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.put<any>("/salesOrder/approveSo", {
        so_id: so_id,
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

export const rejectSo = createAsyncThunk(
  "client/rejectSo",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.put<any>(
        "/salesOrder/rejectSo",
        payload
      )) as any;

      if (response?.data?.code == 200) {
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

export const cancelSalesOrder = createAsyncThunk(
  "client/cancelSalesOrder",
  async (payload: CancelPayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.put<any>(
        "/salesOrder/cancelSO",
        payload
      )) as any;

      if (response?.data?.code == 200) {
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

export const fetchMaterialList = createAsyncThunk(
  "client/soMaterialList",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.get<any>(
        `/salesOrder/soMaterialList?so_id=${payload.so_id}`,
        payload
      )) as any;

      if (response?.data?.code == 200) {
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

export const createShipment = createAsyncThunk(
  "client/createShipment",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/salesOrder/createShipment",
        payload
      )) as any;

      if (response?.data?.code == 200) {
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

export const createInvoice = createAsyncThunk(
  "client/createInvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/salesOrder/createInvoice",
        payload
      )) as any;

      if (response?.data?.code == 200) {
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
export const printSellOrder = createAsyncThunk(
  "client/printSellOrder",
  async ({ so_id }: { so_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/salesOrder/printSalesOrder",
        { so_id: so_id }
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

export const printShipment = createAsyncThunk(
  "client/printShipment",
  async ({ shipment_id }: { shipment_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>(
        "/salesOrder/printShipment",
        { shipment_id: shipment_id }
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

export const shortClose = createAsyncThunk(
  "client/shortClose",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/salesOrder/close",
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

const sellRequestSlice = createSlice({
  name: "sellRequest",
  initialState,
  reducers: {
    setDateRange(state, action: any) {
      state.dateRange = action.payload;
    },
     clearUpdatedData(state) {
      state.updateData = [];
    },
   setWise(state, action: any) {
      state.wise = action.payload;
    },
  },
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
      .addCase(approveSo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveSo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveSo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sell request";
      })
      .addCase(rejectSo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectSo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(rejectSo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sell request";
      })
      .addCase(cancelSalesOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSalesOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelSalesOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel sell request";
      })
      .addCase(fetchMaterialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialList.fulfilled, (state, action) => {
        state.sellRequestList = action.payload.data || [];
        state.loading = false;
      })
      .addCase(fetchMaterialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel sell request";
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create invoice";
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel sell request";
      })
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(printSellOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(printSellOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printSellOrder.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(printShipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(printShipment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(printShipment.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(shortClose.pending, (state) => {
        state.loading = true;
      })
      .addCase(shortClose.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(shortClose.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      })

      .addCase(fetchSellRequestList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellRequestList.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchSellRequestList.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.loading = false;
      });
  },
});

export const { setDateRange,setWise,clearUpdatedData } = sellRequestSlice.actions;
export default sellRequestSlice.reducer;
