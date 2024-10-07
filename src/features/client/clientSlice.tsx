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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const fetchClient = createAsyncThunk<
  ApiResponse<any>,
  { code?: string; name?: string }
>("/client/getClient", async ({ code, name }) => {
  const endpoint = code ? `/client/getClient?code=${code}` : name ? `/client/getClient?name=${name}` : `/client/getClient`;
  const response = await spigenAxios.get(endpoint);
  return response.data;
});

export const createClient = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload: ClientPayload }
>("/client/add", async ({ endpoint, payload }) => {
  const response = await spigenAxios.post(endpoint, payload);
  return response.data;
});

export const updateClient = createAsyncThunk<
  ApiResponse<any>,
  { endpoint: string; payload: ClientUpdatePayload }
>("/client/update", async ({ endpoint, payload }) => {
  const response = await spigenAxios.put(endpoint, payload);
  return response.data;
});

interface ClientState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  data: [],
  loading: false,
  error: null,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.data = action.payload.data; 
        state.loading = false;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(createClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
        state.loading = false;
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create client";
      })
      .addCase(updateClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.data = state.data.map(client =>
          client.code === action.payload.data.code ? action.payload.data : client
        );
        state.loading = false;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update client";
      });
  },
});

export default clientSlice.reducer;
