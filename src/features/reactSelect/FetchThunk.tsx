// src/features/reactSelect/FetchThunk.ts

import { spigenAxios } from "@/axiosIntercepter";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface FetchDataArgs {
  endpoint: string;
  query?: string; // Optional query parameter
  query2?: string; // Optional query parameter
  fetchData?: string; // Optional query parameter
  payload?: any; // Optional payload for POST requests
  querySearchTerm?: any; // Optional payload for POST requests
  search?: any; // Optional payload for POST requests
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
  "data/fetchData",
  async (
    { endpoint, query, query2, payload, querySearchTerm, search },
    { rejectWithValue }
  ) => {
    try {
      let response;
      if (query) {
        // Fetching customer data with query parameter
        response = await spigenAxios.get(`${endpoint}?name=${query}`);
        return response.data;
      } else if (query2) {
        // console.log("query2", query2);

        // Fetching option data with payload
        response = await spigenAxios.get(`${endpoint}/${query2}`);
        return response;
      } else if (payload) {
        // Fetching option data with payload
        response = await spigenAxios.post(endpoint, payload);
        return response.data;
      } else if (querySearchTerm) {
        // Fetching option data with payload
        response = await spigenAxios.get(
          `${endpoint}?searchTerm=${querySearchTerm}`
        );
        return response.data;
      } else if (search) {
        // Fetching option data with payload
        response = await spigenAxios.get(`${endpoint}?search=${search}`);
        return response.data;
      } else {
        // Default fetch (GET request without params)
        response = await spigenAxios.get(endpoint);
        if (response.status == 200) {
          return response.data;
        } else {
          return;
        }
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch data");
    }
  }
);
