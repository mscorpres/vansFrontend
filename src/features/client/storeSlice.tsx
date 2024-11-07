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
interface ResponseData {
  // Define the structure of the expected response data
  status: string;
  message: string;
  data: [];
  // Other response fields
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
  data: any;
  loading: boolean;
  error: string | null;
  product: any;
  productData: any;
  minComponents: any;
  transactionApproval: any;
  transactionFromBoxList: any;
  transferBoxList: any;
  availableStockBoxes: any;
  minTransactiondata: any;
  markupNum: any;
  settleSave: any;
}

const initialState: StoreState = {
  data: [],
  loading: false,
  error: null,
  product: [],
  productData: [],
  transactionApproval: null,
  transactionFromBoxList: null,
  transferBoxList: [],
  availableStockBoxes: null,
  minTransactiondata: null,
  minComponents: [],
  markupNum: null,
  settleSave: null,
};
export const saveFGs = createAsyncThunk<any>(
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
export const fetchFGProduct = createAsyncThunk<any, { search: string }>(
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
export const fetchFGProductData = createAsyncThunk<any, { search: string }>(
  "/fgOUT/fetchProductData",
  async ({ search }) => {
    try {
      const response = await spigenAxios.post<any>("/fgOUT/fetchProductData", {
        search: search,
      });

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const createFgOut = createAsyncThunk<any>(
  "/fgout/createFgOut",
  async (payload) => {
    try {
      const response = await spigenAxios.post<any>(
        "/fgout/createFgOut",
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

export const fetchTransactionForApproval = createAsyncThunk<any>(
  "/storeApproval/fetchTransactionForApproval",
  async (payload) => {
    try {
      const response = await spigenAxios.post<any>(
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
  }
);
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
export const minTransaction = createAsyncThunk<settleTransferPayload>(
  "/transaction/min_transaction",
  async (payload) => {
    try {
      const response = await spigenAxios.post(
        "/transaction/min_transaction",
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
export const getComponentsFromTransaction =
  createAsyncThunk<settleTransferPayload>(
    "/minSettle/getComponents",
    async (payload) => {
      try {
        const response = await spigenAxios.post(
          "/minSettle/getComponents",
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
export const getMarkupID = createAsyncThunk<settleTransferPayload>(
  "/minSettle/getMarkupID",
  async (payload) => {
    try {
      const response = await spigenAxios.post("/minSettle/getMarkupID");

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const saveSettle = createAsyncThunk<settleTransferPayload>(
  "/minSettle/saveSattle",
  async (payload) => {
    try {
      const response = await spigenAxios.post("/minSettle/saveSattle", payload);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const getminBox = createAsyncThunk<ResponseData, FormData>(
  "/qrPrint/getminBox", // Action type
  async (payload: FormData) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post("/qrPrint/getminBox", payload, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for FormData
        },
      });

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const qrPrint = createAsyncThunk<ResponseData, FormData>(
  "/qrPrint", // Action type
  async (payload: FormData) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post("/qrPrint", payload);

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchPrintPickSetelement = createAsyncThunk<ResponseData>(
  "/minSettle/fetchPrintPickSetelement", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post(
        "/minSettle/fetchPrintPickSetelement",
        payload
      );

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const printPickSetelement = createAsyncThunk<ResponseData>(
  "/minSettle/printPickSetelement", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post(
        "/minSettle/printPickSetelement",
        payload
      );

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const getMinTransactionByDate = createAsyncThunk<ResponseData>(
  "/transaction/getMinTransactionByDate", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post(
        "/transaction/getMinTransactionByDate",
        payload
      );

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const printSingleMin = createAsyncThunk<ResponseData>(
  "/minPrint/printSingleMin", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post(
        "/minPrint/printSingleMin",
        payload
      );

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const cutomerLable = createAsyncThunk<ResponseData>(
  "/cutomerLable", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post("/cutomerLable", payload);

      return response.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
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
        state.transactionFromBoxList = action.payload?.boxes;
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
      })
      .addCase(minTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(minTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.minTransactiondata = action.payload;
      })
      .addCase(minTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getComponentsFromTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComponentsFromTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.minComponents = action.payload;
      })
      .addCase(getComponentsFromTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getMarkupID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMarkupID.fulfilled, (state, action) => {
        state.loading = false;
        state.markupNum = action.payload;
      })
      .addCase(getMarkupID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(saveSettle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveSettle.fulfilled, (state, action) => {
        state.loading = false;
        state.settleSave = action.payload;
      })
      .addCase(saveSettle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getminBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getminBox.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getminBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(fetchPrintPickSetelement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrintPickSetelement.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPrintPickSetelement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(printPickSetelement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(printPickSetelement.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(printPickSetelement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getMinTransactionByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMinTransactionByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMinTransactionByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      });
  },
});

export default storeSlice.reducer;
