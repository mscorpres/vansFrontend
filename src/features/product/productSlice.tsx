import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

interface ProductPayload {
  p_name?: string;
  p_sku?: string;
  units_id?: string;
  product_key?: string; 
  product_name?: string;
  hsn?: string;
  jobworkcost?: number;
  labourcost?: number;
  packingcost?: number;
  othercost?: number;
  minstock?: number;
  batchstock?: number;
  category?: string;
  mrp?: number;
  brand?: string;
  ean?: string;
  weight?: number;
  vweight?: number;
  height?: number;
  width?: number;
  minstockrm?: number;
  producttype?: string;
  isenabled?: boolean;
  gsttype?: string;
  gstrate?: number;
  location?: string;
  description?: string;
  uom?: string;
  p_asin?: string;
  p_fnsku?:string,
  p_item_code?:string,
  p_fsnid?:string,





  
}
interface ProductImage {
  image_name: string;
  image_url: string;
  image_id: string;
  uploaded_date: string;
  uploaded_by: string;
  product: any;
}
interface FetchImageProductResponse {
  data: ProductImage[];
}



export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const fetchImageProduct = createAsyncThunk<
  FetchImageProductResponse,
  string // Assuming `product_key` is a string
>("products/fetchImageProduct", async (product_key) => {
  const response = await spigenAxios.post("products/fetchImageProduct", { product: product_key });
  return response.data;
});


export const fetchProducts = createAsyncThunk<
  ApiResponse<any>,
  string
>("/products", async (endpoint) => {
  const response = await spigenAxios.get(endpoint);
  return response.data;
});


export const createProduct = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload: ProductPayload }
>("/products/insertProduct", async ({ endpoint, payload }) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});

export const getProductForUpdate = createAsyncThunk<
  ApiResponse<any>,
  {product_key: string }
>("/products/getProductForUpdate", async ({ product_key }) => {
  const response = await spigenAxios.post("/products/getProductForUpdate", { product_key });
  return response.data;
});


export const updateProduct = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload: ProductPayload }
>("/products/updateProduct", async ({ endpoint, payload }) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});
interface UploadImagePayload {
  files: File[]; 
  product: string;
  caption: string;
}

interface UploadImageResponse {
  code: number; 
  status: string; 
  message: string; 
}



interface ProductState {
  data: any[];
  loading: boolean;
  error: string | null;
  productForUpdate: any;
  images: any[];
  uploadLoading: boolean;
  uploadError: string | null;
  uploadSuccess: boolean;
  uploadMessage: string | null;
  uploadedImages: any[];
}

const initialState: ProductState = {
  data: [],
  loading: false,
  error: null,
  productForUpdate: null,
  images: [],
  uploadLoading: false,
  uploadError: null,
  uploadSuccess: false,
  uploadMessage: null,
  uploadedImages: [],
};

export const uploadProductImages = createAsyncThunk<UploadImageResponse, UploadImagePayload>(
  'products/upload_product_img',
  async ({ files, product, caption }) => {
    const formData = new FormData();
    files.forEach((file, index) => formData.append(`files[${index}]`, file));
    formData.append('product', product);
    formData.append('caption', caption);

    const response = await spigenAxios.post('products/upload_product_img', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    .addCase(fetchImageProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchImageProduct.fulfilled, (state, action) => {
      state.images = action.payload.data;
      state.loading = false;
    })
    .addCase(fetchImageProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch product images";
    })
      // Handle fetchProducts action
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Handle createProduct action
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
      })
      // Handle updateProduct action
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        // const updatedProduct = action.payload.data;
        state.data = state.data.map((product) =>
          product?.product_key === action.payload.data?.product_key ? action.payload.data  : product
        );
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      })

      // Handle fetchProductForUpdate action
      .addCase(getProductForUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductForUpdate.fulfilled, (state, action) => {
        // const fetchedProduct = action.payload.data;
        state.data = action.payload.data;
        state.loading = false;
      })
      .addCase(getProductForUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product details";
      })


      .addCase(uploadProductImages.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
        state.uploadMessage = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.uploadSuccess = true;
        state.uploadMessage = action.payload.message;
        state.uploadedImages.push(action.payload);
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.error.message || 'Failed to upload images';
        state.uploadSuccess = false;
      });

      
  },
});




export default productSlice.reducer;
