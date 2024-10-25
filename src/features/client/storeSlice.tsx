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
}

const initialState: StoreState = {
  data: [],
  loading: false,
  error: null,
  product: null,
  productData: null,
};
export const saveFGs = createAsyncThunk<uomPayload, payload>(
  "/fgIN/saveFGs",
  async (payload) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgIN/saveFGs",
        payload
      );
      console.log("response", response.data);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchFGProduct = createAsyncThunk<uomPayload, { search }>(
  "/fgOUT/fetchProduct",
  async ({ search }) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgOUT/fetchProduct",
        { searchTerm: search }
      );
      console.log("response", response.data);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchFGProductData = createAsyncThunk<uomPayload, { search }>(
  "/fgOUT/fetchProductData",
  async ({ search }) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgOUT/fetchProductData",
        { search: search }
      );
      console.log("response", response.data);

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const createFgOut = createAsyncThunk<uomPayload, payload>(
  "/fgout/createFgOut",
  async (payload) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/fgout/createFgOut",
        payload
      );
      console.log("response", response.data);

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
      });
  },
});

export default storeSlice.reducer;
