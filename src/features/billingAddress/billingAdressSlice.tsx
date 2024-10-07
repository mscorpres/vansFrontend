import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

interface BillingAddressPayload {
  label: string;
  company?: string;
  pan?: string;
  gstin?: string; 
  state?: string;
  address?: string;
  addressLine1?:string,
  addressLine2:string,
  cin?:string,
  
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const fetchBillingAddress = createAsyncThunk<
  ApiResponse<any>,
  string
>("/billingAddress/getAll", async (endpoint) => {
  const response = await spigenAxios.get(endpoint);
  return response.data;
});

export const createBillingAddress = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload: BillingAddressPayload }
>("/billingAddress/saveBillingAddress", async ({ endpoint, payload }) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});


interface BillingAddressState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BillingAddressState = {
  data: [],
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: "billingAddress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    // Handle fetchProducts action
    .addCase(fetchBillingAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBillingAddress.fulfilled, (state, action) => {
      state.data = action.payload.data; 
      state.loading = false;
    })
    .addCase(fetchBillingAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch billing address list";
    })
     
      // Handle createProduct action
      .addCase(createBillingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBillingAddress.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createBillingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })
     
  },
});

export default billingSlice.reducer;
