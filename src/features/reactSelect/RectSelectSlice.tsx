// src/features/data/dataSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { fetchData } from './FetchThunk';

interface DataState {
  [key: string]: {
    options: any[]; // Adjust to match your expected data structure
    loading: boolean;
    error: string | null;
  };
}

const initialState: DataState = {};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state, action) => {
        const key = action.meta.arg.endpoint;
        if (!state[key]) {
          state[key] = { options: [], loading: true, error: null };
        } else {
          state[key].loading = true;
          state[key].error = null;
        }
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const key = action.meta.arg.endpoint;
        state[key].loading = false;
        // Assuming your API response structure, adjust to access data field
        state[key].options = action.payload.data;
      })
      .addCase(fetchData.rejected, (state, action) => {
        const key = action.meta.arg.endpoint;
        state[key].loading = false;
        state[key].error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;
