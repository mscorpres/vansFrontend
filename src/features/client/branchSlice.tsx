import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";

interface BranchPayload {
    state:string,
    country:string,
    address:string,
    addressLine1:string,
    addressLine2:string,
    city:string,
    pinCode:string,
    phoneNo:string,
    gst:string,
    clientCode:string
   


}


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}





export const createBranch = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload:BranchPayload }
>("/client/addBranch", async ({ endpoint, payload }) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});


interface clientBranchState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: clientBranchState = {
  data: [],
  loading: false,
  error: null,
};

const BranchSlice = createSlice({
  name: "Branch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder


      // Handle createProduct action
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create Branch";
      })
     
  },
});

export default BranchSlice.reducer;
