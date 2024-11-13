import { spigenAxios } from "@/axiosIntercepter";
import { updateBOM } from "../types/masterModule/masterModuleTypes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//update the bom component
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}
console.log("herer");

// Define the async thunk for fetching client address detail
export const updateBomComponent = createAsyncThunk<
  updateBOM,
  { addressID: string }
>("/bom/updateBomComponent", async (payload) => {
  try {
    const response = await spigenAxios.post<updateBOM>(
      "/bom/updateBomComponent",
      payload
    );
    console.log("response", response);

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
interface ClientState {
  data: any[];
  loading: boolean;
  error: string | null;
  updateBOMs: null;
}
const initialState: ClientState = {
  data: [],
  loading: false,
  error: null,
  updateBOMs: null,
};
// Create the slice
const productSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateBomComponent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBomComponent.fulfilled, (state, action) => {
        state.loading = false;
        state.updateBOMs = action.payload;
      })
      .addCase(updateBomComponent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch client details";
      });
  },
});

export default productSlice.reducer;
