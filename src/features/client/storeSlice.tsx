import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

interface ClientPayload {
  clientName: string;
  panNo: string;
  mobileNo: string;
  email: string;
  website: string;
  salesPersonName: string;
}

interface ClientUpdatePayload {
  clientName: string;
  panNo: string;
  mobileNo: string;
  email: string;
  website: string;
  salesPersonName: string;
  code: string;
  status: string;
  tds?: string[];
  tcs?: string[];
}
interface hsnPayload {
  id: string;
  value: string;
}
interface settleTransferPayload {
  component: [];
  cost_center: [];
  frombox: [];
  qty: [];
  remark: [];
  tobox: [];
}
interface searchPayload {
  search: string;
}
interface uomPayload {
  id: string;
  value: string;
}
interface shippingAddressPayload {
  // id: string;
  statecode: string;
  company: string;
  address: string;
  gstin: string;
  pan: string;
  pincode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

interface StoreState {
  data: any[];
  loading: boolean;
  error: string | null;
  transferBoxList: any[];
}

const initialState: StoreState = {
  data: [],
  loading: false,
  error: null,
  product: null,
  productData: null,
  transactionApproval: null,
  transactionFromBoxList: null,
  transferBoxList: null,
  availableStockBoxes: null,
};
export const saveFGs = createAsyncThunk<uomPayload, payload>(
  "/fgIN/saveFGs",
  async (payload) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgIN/saveFGs",
        payload
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchFGProduct = createAsyncThunk<uomPayload, { search: string }>(
  "/fgOUT/fetchProduct",
  async ({ search }) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgOUT/fetchProduct",
        { searchTerm: search }
      );
    

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchFGProductData = createAsyncThunk<
  uomPayload,
  { search: string }
>("/fgOUT/fetchProductData", async ({ search }) => {
  try {
    const response = await spigenAxios.post<uomPayload>(
      "/fgOUT/fetchProductData",
      { search: search }
    );
  

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const createFgOut = createAsyncThunk<uomPayload, payload>(
  "/fgout/createFgOut",
  async (payload) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgout/createFgOut",
        payload
      );
     

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchTransactionForApproval = createAsyncThunk<
  uomPayload,
  payload
>("/storeApproval/fetchTransactionForApproval", async (payload) => {
  try {
    const response = await spigenAxios.post<uomPayload>(
      "/storeApproval/fetchTransactionForApproval",
      payload
    );
   
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchComponentBoxes = createAsyncThunk<searchPayload>(
  "/minSettle/fetchComponentBoxes",
  async (payload) => {
    try {
      const response = await spigenAxios.post(
        "/minSettle/fetchComponentBoxes",
        payload
      );
    
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchTransferLoc = createAsyncThunk<searchPayload>(
  "/backend/fetchTransferLoc",
  async (payload) => {
    try {
      const response = await spigenAxios.post(
        "/backend/fetchTransferLoc",
        payload
      );
     
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const settleTransfer = createAsyncThunk<settleTransferPayload>(
  "/minSettle/settleTransfer",
  async (payload) => {
    try {
      const response = await spigenAxios.post(
        "/minSettle/settleTransfer",
        payload
      );
      
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchAvailableStockBoxes = createAsyncThunk<settleTransferPayload>(
  "/backend/fetchAvailableStockBoxes",
  async (payload) => {
    try {
      const response = await spigenAxios.post(
        "/backend/fetchAvailableStockBoxes",
        payload
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const stockOut = createAsyncThunk<settleTransferPayload>(
  "/backend/stockOut",
  async (payload) => {
    try {
      const response = await spigenAxios.post("/backend/stockOut", payload);
     
      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
const storeSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveFGs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveFGs.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(saveFGs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchFGProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFGProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchFGProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchFGProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFGProductData.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload;
      })
      .addCase(fetchFGProductData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchTransactionForApproval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionForApproval.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionApproval = action.payload;
      })
      .addCase(fetchTransactionForApproval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchComponentBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComponentBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionFromBoxList = action.payload.boxes;
      })
      .addCase(fetchComponentBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchTransferLoc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransferLoc.fulfilled, (state, action) => {
        state.loading = false;
        state.transferBoxList = action.payload;
      })
      .addCase(fetchTransferLoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(settleTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settleTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(settleTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchAvailableStockBoxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableStockBoxes.fulfilled, (state, action) => {
        state.loading = false;
        state.availableStockBoxes = action.payload;
      })
      .addCase(fetchAvailableStockBoxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      });
  },
});

export default storeSlice.reducer;
