// src/features/reactSelect/FetchThunk.ts

import { spigenAxios } from '@/axiosIntercepter';
import { createAsyncThunk } from '@reduxjs/toolkit';


export interface FetchDataArgs {
  endpoint: string;
  query?: string; // Optional query parameter
  payload?: any; // Optional payload for POST requests
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

export interface Customer {
  code: string;
  name: string;
}

export interface Option {
  id: string;
  text: string;
}

export const fetchData = createAsyncThunk<ApiResponse<any[]>, FetchDataArgs>(
  'data/fetchData',
  async ({ endpoint, query, payload }, { rejectWithValue }) => {
    try {
      let response;
      if (query) {
        // Fetching customer data with query parameter
        response = await spigenAxios.get(`${endpoint}?name=${query}`);
      } else if (payload) {
        // Fetching option data with payload
        response = await spigenAxios.post(endpoint, payload);
      } else {
        // Default fetch (GET request without params)
        response = await spigenAxios.get(endpoint);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch data');
    }
  }
);
