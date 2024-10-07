// clientSlice.ts

import { spigenAxios } from "@/axiosIntercepter";
import { BillingAddress, BillingAddressListItem, BillingAddressListResponse, BillingAddressResponse, Client, ClientAddressDetail, ClientAddressDetailResponse, ClientResponse, ClientState, ComponentDetail, ComponentDetailResponse, Country2, CountryResponse, ProjectDescription, ProjectDescriptionResponse, State2, StateResponse } from "@/types/createSlaesOrderTypes";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: ClientState = {
  clientDetails: null,
  billingAddress: null,
  projectDescription: null,
  countries: null,
  states: null,
  billingAddressList: null,
  clientAddressDetail: null,
  componentDetails:null,
  loading: false,
  error: null,
};
// Define the async thunk for fetching client details
export const fetchClientDetails = createAsyncThunk<Client, string>("client/fetchClientDetails", async (clientCode: string) => {
  try {
    const response = await spigenAxios.get<ClientResponse>(`/client/branches?clientCode=${clientCode}`);
    if (response.data.status !== "success") {
      throw new Error("Failed to fetch client details");
    }
    // Assuming there is only one client in the data array
    return response.data.data[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});

// Define the async thunk for fetching project description
export const fetchProjectDescription = createAsyncThunk<ProjectDescription, { project_name: string }>("client/fetchProjectDescription", async ({ project_name }) => {
  try {
    const response = await spigenAxios.post<ProjectDescriptionResponse>("/backend/projectDescription", { project_name });
    if (response.data.status !== "success") {
      throw new Error("Failed to fetch project description");
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});

export const fetchBillingAddress = createAsyncThunk<BillingAddress, { billing_code: string }>("client/fetchBillingAddress", async ({ billing_code }) => {
  try {
    const response = await spigenAxios.post<BillingAddressResponse>("/backend/billingAddress", { billing_code });
    if (response.data.code !== 200) {
      throw new Error("Failed to fetch billing address");
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
// Define the async thunk for fetching countries
export const fetchCountries = createAsyncThunk<Country2[], void>("client/fetchCountries", async () => {
  try {
    const response = await spigenAxios.get<CountryResponse>("/tally/backend/countries");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});

// Define the async thunk for fetching states
export const fetchStates = createAsyncThunk<State2[], void>("client/fetchStates", async () => {
  try {
    const response = await spigenAxios.get<StateResponse>("/tally/backend/states");
    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});

// Define the async thunk for fetching billing address list
export const fetchBillingAddressList = createAsyncThunk<BillingAddressListItem[], { search: string }>("client/fetchBillingAddressList", async ({ search }) => {
  try {
    const response = await spigenAxios.post<BillingAddressListResponse>("/backend/billingAddressList", { search });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});


// Define the async thunk for fetching client address detail
export const fetchClientAddressDetail = createAsyncThunk<ClientAddressDetail, { addressID: string }>(
    'client/fetchClientAddressDetail',
    async ({ addressID }) => {
      try {
        const response = await spigenAxios.get<ClientAddressDetailResponse>(`/client/getClientDetail?addressID=${addressID}`);
        return response.data[0];
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error('An unknown error occurred');
      }
    }
  );
  // Define the async thunk for fetching component details
export const fetchComponentDetail = createAsyncThunk<ComponentDetail[], {search:string}>(
  'client/fetchComponentDetail',
  async ({ search }) => {
    const response = await spigenAxios.post<ComponentDetailResponse>(`/backend/getComponentByNameAndNo`, {
      params: { search }
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      // Redux Toolkit will automatically handle the error
      throw new Error(response.data.message || 'Failed to fetch component details');
    }
  }
);
// Create the slice
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.clientDetails = action.payload;
      })
      .addCase(fetchClientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch client details";
      })
      // Handling billing address actions
      .addCase(fetchBillingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.billingAddress = action.payload;
      })
      .addCase(fetchBillingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing address";
      })
      // Handling project description actions
      .addCase(fetchProjectDescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDescription.fulfilled, (state, action) => {
        state.loading = false;
        state.projectDescription = action.payload;
      })
      .addCase(fetchProjectDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch project description";
      })
      // Handling country actions
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch countries";
      })
      // Handling state actions
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch states";
      })
      // Handling billing address list actions
      .addCase(fetchBillingAddressList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingAddressList.fulfilled, (state, action) => {
        state.loading = false;
        state.billingAddressList = action.payload;
      })
      .addCase(fetchBillingAddressList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch billing address list";
      })
      // Handling client address detail actions
      .addCase(fetchClientAddressDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientAddressDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.clientAddressDetail = action.payload;
      })
      .addCase(fetchClientAddressDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch client address detail';
      })
       // Handling component detail actions
       .addCase(fetchComponentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComponentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.componentDetails = action.payload;
      })
      .addCase(fetchComponentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch component details';
      });
  },
});

export default clientSlice.reducer;
