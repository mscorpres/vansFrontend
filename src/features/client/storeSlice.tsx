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
  creatematerial: any;
  transactionFromBoxList: any;
  transferBoxList: any;
  availableStockBoxes: any;
  minTransactiondata: any;
  markupNum: any;
  settleSave: any;
  boxData: any;
  phyStockFromBoxData: any;
  closingStock: any;
  insertPhyStock: any;
  pendingStk: any;
  rejStk: any;
  allStock: any;
  rejectStock: any;
  aproveStock: any;
}

const initialState: StoreState = {
  data: [],
  loading: false,
  error: null,
  product: [],
  productData: [],
  transactionApproval: null,
  creatematerial: null,
  transactionFromBoxList: null,
  transferBoxList: [],
  availableStockBoxes: null,
  minTransactiondata: null,
  minComponents: [],
  markupNum: null,
  settleSave: null,
  boxData: null,
  phyStockFromBoxData: null,
  closingStock: null,
  insertPhyStock: null,
  pendingStk: null,
  rejStk: null,
  allStock: null,
  rejectStock: null,
  aproveStock: null,
};
export const addComponent = createAsyncThunk<any, payload>(
  "/component/addComponent",
  async (payload) => {
    try {
      const response = await spigenAxios.post<shippingAddressPayload>(
        "/component/addComponent",
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
      const response = await spigenAxios.get<any>(
        `/storeApproval/fetchTransactionForApproval`
        // payload
      );

      return response;
    } catch (error) {
      return error;
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
      if (payload?.component?.length > 3) {
        const response = await spigenAxios.get(
          `backend/fetchAvailableStockBoxes?component=${payload?.component}&costcenter=${payload.c_center}`
        );

        return response?.data;
      }
    } catch (error) {
      return error;
    }
  }
);
export const stockOut = createAsyncThunk<settleTransferPayload>(
  "/backend/stockOut",
  async (payload) => {
    try {
      const response = await spigenAxios.post("/backend/stockOut", payload);

      return response;
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

      return response.data;
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
        const response = await spigenAxios.get(
          `/minSettle/getComponents?transaction=${payload?.transaction}`
          // payload
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
      const response = await spigenAxios.get(`/minSettle/getMarkupID`);

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
      const response = await spigenAxios.post(
        `qrPrint/getminBox?type=MIN&min_no=MIN/24-25/0117`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for FormData
          },
        }
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
export const printsticker2 = createAsyncThunk<ResponseData, FormData>(
  "/qrPrint/printsticker", // Action type
  async (payload: FormData) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post("/qrPrint/printsticker", payload);

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
      const response = await spigenAxios.get(
        `/minSettle/fetchPrintPickSetelement?wise=${payload?.wise}&data=${payload?.data}`
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
      const response = await spigenAxios.get(
        `/transaction/getMinTransactionByDate?wise=${payload?.wise}&data=${payload?.data}`
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

///phyical Stock//////////
export const getAllBox = createAsyncThunk<ResponseData>(
  "/physicalStock/getAllBox", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get(
        `/physicalStock/getAllBox?search=${payload.search}`
        // payload
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
export const getPhysicalStockfromBox = createAsyncThunk<ResponseData>(
  "/physicalStock/getPhysical_stock", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get(
        `/physicalStock/getPhysical_stock?boxno=${payload?.boxno}`,
        payload
      );

      return response.data.data; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const closingStock = createAsyncThunk<ResponseData>(
  "/physicalStock/closingStock", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get(
        `/physicalStock/closingStock?boxno=${payload?.boxno}&partNo=${payload.partNo}`
        // payload
      );

      return response; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const insertPhysical = createAsyncThunk<ResponseData>(
  "physicalStock/insertphysical_data", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post(
        "physicalStock/insertphysical_data",
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
export const pendingPhysical = createAsyncThunk<ResponseData>(
  "/physicalStock/pendingphysical_stock", // Action type
  async () => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get(
        "/physicalStock/pendingphysical_stock"
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
export const rejectedPhysical = createAsyncThunk<ResponseData>(
  "/physicalStock/rejectphysical_stockList", // Action type
  async () => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get(
        "/physicalStock/rejectphysical_stockList"
      );

      return response; // Return the response data to Redux
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message); // Throw an error if any occurs
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const updateRejectphysical = createAsyncThunk<ResponseData>(
  "/physicalStock/updateRejectphysical_stock", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.put(
        "/physicalStock/updateRejectphysical_stock",
        payload
      );

      return response; // Return the response data to Redux
    } catch (error) {
      return error; // Return the response data to Redux
    }
  }
);
export const allphysical = createAsyncThunk<ResponseData>(
  "/physicalStock/allphysical_stock", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get(
        `/physicalStock/allphysical_stock?date=${payload.date}`
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
export const rejectStockItem = createAsyncThunk<ResponseData>(
  "/physicalStock/rejectphysical_stock", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.put(
        "/physicalStock/rejectphysical_stock",
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
export const approveStockItem = createAsyncThunk<ResponseData>(
  "/physicalStock/approvephysical_stock", // Action type
  async (payload) => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.post(
        "/physicalStock/approvephysical_stock",
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

export const getAllCustomerEnquiry = createAsyncThunk<ResponseData>(
  "/customer/getAllCustomerEnquiry", // Action type
  async () => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get("/customer/getAllCustomerEnquiry");

      return response; // Return the response data to Redux
    } catch (error) {
      return error;
    }
  }
);
export const getCustomerStock = createAsyncThunk<ResponseData>(
  "/customer/cust_stock", // Action type
  async () => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get("/customer/cust_stock");

      return response; // Return the response data to Redux
    } catch (error) {
      return error;
    }
  }
);
export const getallItemClosingStock = createAsyncThunk<ResponseData>(
  "/customer/allItemClosingStock", // Action type
  async () => {
    try {
      // Make sure your axios instance is correctly set up
      const response = await spigenAxios.get("/customer/allItemClosingStock");

      return response; // Return the response data to Redux
    } catch (error) {
      return error;
    }
  }
);
const storeSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder ///create material
      .addCase(addComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComponent.fulfilled, (state, action) => {
        state.loading = false;
        state.creatematerial = action.payload;
      })
      .addCase(addComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch HSN";
      })
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
      })
      .addCase(getAllBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBox.fulfilled, (state, action) => {
        state.loading = false;
        state.boxData = action.payload;
      })
      .addCase(getAllBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getPhysicalStockfromBox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPhysicalStockfromBox.fulfilled, (state, action) => {
        state.loading = false;
        state.phyStockFromBoxData = action.payload;
      })
      .addCase(getPhysicalStockfromBox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(closingStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closingStock.fulfilled, (state, action) => {
        state.loading = false;
        state.closingStock = action.payload;
      })
      .addCase(closingStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(insertPhysical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertPhysical.fulfilled, (state, action) => {
        state.loading = false;
        state.insertPhyStock = action.payload;
      })
      .addCase(insertPhysical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(pendingPhysical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pendingPhysical.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingStk = action.payload;
      })
      .addCase(pendingPhysical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(rejectedPhysical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectedPhysical.fulfilled, (state, action) => {
        state.loading = false;
        state.rejStk = action.payload;
      })
      .addCase(rejectedPhysical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(allphysical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allphysical.fulfilled, (state, action) => {
        state.loading = false;
        state.allStock = action.payload;
      })
      .addCase(allphysical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(updateRejectphysical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRejectphysical.fulfilled, (state, action) => {
        state.loading = false;
        state.allStock = action.payload;
      })
      .addCase(updateRejectphysical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(rejectStockItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectStockItem.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectStock = action.payload;
      })
      .addCase(rejectStockItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(approveStockItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveStockItem.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(approveStockItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(qrPrint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(qrPrint.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(qrPrint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(printsticker2.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(printsticker2.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(printsticker2.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(cutomerLable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cutomerLable.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(cutomerLable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(printSingleMin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(printSingleMin.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(printSingleMin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(stockOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(stockOut.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(stockOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getAllCustomerEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCustomerEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(getAllCustomerEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(getCustomerStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomerStock.fulfilled, (state, action) => {
        state.loading = false;
        state.aproveStock = action.payload;
      })
      .addCase(getCustomerStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      });
  },
});

export default storeSlice.reducer;
