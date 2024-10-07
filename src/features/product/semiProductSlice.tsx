import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

interface CreateProductPayload {
  p_name: string;
  p_sku: string;
  units_id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export interface CreateProductArgs {
  endpoint: string;
  payload: CreateProductPayload;
}

export const createProduct = createAsyncThunk<
  ApiResponse<any>, 
  CreateProductArgs
>("/products//insertSemi", async ({ endpoint, payload }: CreateProductArgs) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});


interface ProductState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  data: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.data.push(action.payload.data); 
        state.loading = false;
        
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      });
  },
});

export default productSlice.reducer;
