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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export const fetchClient = createAsyncThunk<
  ApiResponse<any>,
  { code?: string; name?: string }
>("/client/getClient", async ({ code, name }) => {
  const endpoint = code
    ? `/client/getClient?code=${code}`
    : name
    ? `/client/getClient?name=${name}`
    : `/client/getClient`;
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
export const searchingHsn = createAsyncThunk<hsnPayload>(
  "backend/searchHsn",
  async (payload) => {
    try {
      const response = await spigenAxios.post<hsnPayload>(
        "backend/searchHsn",
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

interface ClientState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  data: [],
  loading: false,
  error: null,
  hsnlist: null,
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
        state.data = state.data.map((client) =>
          client.code === action.payload.data.code
            ? action.payload.data
            : client
        );
        state.loading = false;
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update client";
      }) ///search hsn
      .addCase(searchingHsn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchingHsn.fulfilled, (state, action) => {
        state.loading = false;
        state.hsnlist = action.payload;
      })
      .addCase(searchingHsn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch HSN";
      });
  },
});

export default clientSlice.reducer;
