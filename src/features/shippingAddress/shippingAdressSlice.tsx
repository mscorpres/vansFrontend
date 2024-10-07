import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

interface ShippingAddressPayload {
  label: string;
  company?: string;
  pan?: string;
  gstin?: string; 
  state?: string;
  address?: string;
  addressLine1?:string,
  addressLine2:string,
 
  
}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const fetchShippingAddress = createAsyncThunk<
  ApiResponse<any>,
  string
>("/shippingAddress/getAll", async (endpoint) => {
  const response = await spigenAxios.get(endpoint);
  return response.data;
});

export const createShippingAddress = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload: ShippingAddressPayload }
>("/shippingAddress/saveShippingAddress", async ({ endpoint, payload }) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});


interface ShippingAddressState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ShippingAddressState = {
  data: [],
  loading: false,
  error: null,
};

const shippingSlice = createSlice({
  name: "ShippingAddress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    // Handle fetchProducts action
    .addCase(fetchShippingAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchShippingAddress.fulfilled, (state, action) => {
      state.data = action.payload.data; 
      state.loading = false;
    })
    .addCase(fetchShippingAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch billing address list";
    })
     
      // Handle createProduct action
      .addCase(createShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShippingAddress.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })
     
  },
});

export default shippingSlice.reducer;
