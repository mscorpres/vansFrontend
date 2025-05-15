import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { showToast } from "@/General";

// Define interfaces for API responses
interface TotalResponse {
  success: boolean;
  total: number;
  percentageIncrease?: number;
}

interface MonthlyResponse {
  success: boolean;
  data: { month: string; total: number }[];
}

interface ErrorResponse {
  message: string;
  error?: string;
}

// Define interface for the dashboard state
interface DashboardState {
  totalSalesOrders: number;
  salesPercentageIncrease: number;
  salesLoading: boolean;
  salesError: string | null;
  totalPurchaseOrders: number;
  purchasePercentageIncrease: number;
  purchaseLoading: boolean;
  purchaseError: string | null;
  totalClients: number;
  clientsLoading: boolean;
  clientsError: string | null;
  totalVendors: number;
  vendorsLoading: boolean;
  vendorsError: string | null;
  totalComponents: number;
  componentsLoading: boolean;
  componentsError: string | null;
  monthlySalesOrders: { month: string; total: number }[];
  monthlySalesLoading: boolean;
  monthlySalesError: string | null;
  monthlyPurchaseOrders: { month: string; total: number }[];
  monthlyPurchaseLoading: boolean;
  monthlyPurchaseError: string | null;
}

// Initial state with strict typing
const initialState: DashboardState = {
  totalSalesOrders: 0,
  salesPercentageIncrease: 0,
  salesLoading: false,
  salesError: null,
  totalPurchaseOrders: 0,
  purchasePercentageIncrease: 0,
  purchaseLoading: false,
  purchaseError: null,
  totalClients: 0,
  clientsLoading: false,
  clientsError: null,
  totalVendors: 0,
  vendorsLoading: false,
  vendorsError: null,
  totalComponents: 0,
  componentsLoading: false,
  componentsError: null,
  monthlySalesOrders: [],
  monthlySalesLoading: false,
  monthlySalesError: null,
  monthlyPurchaseOrders: [],
  monthlyPurchaseLoading: false,
  monthlyPurchaseError: null,
};

// Async thunk for fetching total sales orders
export const fetchTotalSalesOrders = createAsyncThunk<TotalResponse, void, { rejectValue: string }>(
  "dashboard/fetchTotalSalesOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching total sales orders");
      const response = await spigenAxios.get<TotalResponse>("/dashboard/getTotalSalesOrders");
      console.log("API response (sales):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (sales):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching total sales orders: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching total purchase orders
export const fetchTotalPurchaseOrders = createAsyncThunk<TotalResponse, void, { rejectValue: string }>(
  "dashboard/fetchTotalPurchaseOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching total purchase orders");
      const response = await spigenAxios.get<TotalResponse>("/dashboard/getTotalPurchaseOrders");
      console.log("API response (purchase):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (purchase):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching total purchase orders: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching total clients
export const fetchTotalClients = createAsyncThunk<TotalResponse, void, { rejectValue: string }>(
  "dashboard/fetchTotalClients",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching total clients");
      const response = await spigenAxios.get<TotalResponse>("/dashboard/getTotalClients");
      console.log("API response (clients):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (clients):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching total clients: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching total vendors
export const fetchTotalVendors = createAsyncThunk<TotalResponse, void, { rejectValue: string }>(
  "dashboard/fetchTotalVendors",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching total vendors");
      const response = await spigenAxios.get<TotalResponse>("/dashboard/getTotalVendors");
      console.log("API response (vendors):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (vendors):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching total vendors: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching total components
export const fetchTotalComponents = createAsyncThunk<TotalResponse, void, { rejectValue: string }>(
  "dashboard/fetchTotalComponents",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching total components");
      const response = await spigenAxios.get<TotalResponse>("/dashboard/getTotalComponents");
      console.log("API response (components):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (components):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching total components: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching monthly sales orders
export const fetchMonthlySalesOrders = createAsyncThunk<MonthlyResponse, number | undefined, { rejectValue: string }>(
  "dashboard/fetchMonthlySalesOrders",
  async (year = new Date().getFullYear(), { rejectWithValue }) => {
    try {
      console.log("Fetching monthly sales orders for year:", year);
      const response = await spigenAxios.get<MonthlyResponse>("/dashboard/getMonthlySalesOrders", { params: { year } });
      console.log("API response (monthly sales):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (monthly sales):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching monthly sales orders: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching monthly purchase orders
export const fetchMonthlyPurchaseOrders = createAsyncThunk<MonthlyResponse, number | undefined, { rejectValue: string }>(
  "dashboard/fetchMonthlyPurchaseOrders",
  async (year = new Date().getFullYear(), { rejectWithValue }) => {
    try {
      console.log("Fetching monthly purchase orders for year:", year);
      const response = await spigenAxios.get<MonthlyResponse>("/dashboard/getMonthlyPurchaseOrders", { params: { year } });
      console.log("API response (monthly purchase):", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || "Unknown error";
      console.error("API error (monthly purchase):", errorMessage, error.response?.status, error.response?.data);
      showToast(`Error fetching monthly purchase orders: ${errorMessage}`, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Sales Orders
    builder
      .addCase(fetchTotalSalesOrders.pending, (state) => {
        state.salesLoading = true;
        state.salesError = null;
      })
      .addCase(fetchTotalSalesOrders.fulfilled, (state, action) => {
        state.salesLoading = false;
        state.totalSalesOrders = action.payload.success ? action.payload.total : 0;
        state.salesPercentageIncrease = action.payload.success && action.payload.percentageIncrease !== undefined ? action.payload.percentageIncrease : 0;
      })
      .addCase(fetchTotalSalesOrders.rejected, (state, action) => {
        state.salesLoading = false;
        state.salesError = action.payload || "Failed to fetch total sales orders";
      });

    // Purchase Orders
    builder
      .addCase(fetchTotalPurchaseOrders.pending, (state) => {
        state.purchaseLoading = true;
        state.purchaseError = null;
      })
      .addCase(fetchTotalPurchaseOrders.fulfilled, (state, action) => {
        state.purchaseLoading = false;
        state.totalPurchaseOrders = action.payload.success ? action.payload.total : 0;
        state.purchasePercentageIncrease = action.payload.success && action.payload.percentageIncrease !== undefined ? action.payload.percentageIncrease : 0;
      })
      .addCase(fetchTotalPurchaseOrders.rejected, (state, action) => {
        state.purchaseLoading = false;
        state.purchaseError = action.payload || "Failed to fetch total purchase orders";
      });

    // Clients
    builder
      .addCase(fetchTotalClients.pending, (state) => {
        state.clientsLoading = true;
        state.clientsError = null;
      })
      .addCase(fetchTotalClients.fulfilled, (state, action) => {
        state.clientsLoading = false;
        state.totalClients = action.payload.success ? action.payload.total : 0;
      })
      .addCase(fetchTotalClients.rejected, (state, action) => {
        state.clientsLoading = false;
        state.clientsError = action.payload || "Failed to fetch total clients";
      });

    // Vendors
    builder
      .addCase(fetchTotalVendors.pending, (state) => {
        state.vendorsLoading = true;
        state.vendorsError = null;
      })
      .addCase(fetchTotalVendors.fulfilled, (state, action) => {
        state.vendorsLoading = false;
        state.totalVendors = action.payload.success ? action.payload.total : 0;
      })
      .addCase(fetchTotalVendors.rejected, (state, action) => {
        state.vendorsLoading = false;
        state.vendorsError = action.payload || "Failed to fetch total vendors";
      });

    // Components
    builder
      .addCase(fetchTotalComponents.pending, (state) => {
        state.componentsLoading = true;
        state.componentsError = null;
      })
      .addCase(fetchTotalComponents.fulfilled, (state, action) => {
        state.componentsLoading = false;
        state.totalComponents = action.payload.success ? action.payload.total : 0;
      })
      .addCase(fetchTotalComponents.rejected, (state, action) => {
        state.componentsLoading = false;
        state.componentsError = action.payload || "Failed to fetch total components";
      });

    // Monthly Sales Orders
    builder
      .addCase(fetchMonthlySalesOrders.pending, (state) => {
        state.monthlySalesLoading = true;
        state.monthlySalesError = null;
      })
      .addCase(fetchMonthlySalesOrders.fulfilled, (state, action) => {
        state.monthlySalesLoading = false;
        state.monthlySalesOrders = action.payload.success ? action.payload.data : [];
      })
      .addCase(fetchMonthlySalesOrders.rejected, (state, action) => {
        state.monthlySalesLoading = false;
        state.monthlySalesError = action.payload || "Failed to fetch monthly sales orders";
      });

    // Monthly Purchase Orders
    builder
      .addCase(fetchMonthlyPurchaseOrders.pending, (state) => {
        state.monthlyPurchaseLoading = true;
        state.monthlyPurchaseError = null;
      })
      .addCase(fetchMonthlyPurchaseOrders.fulfilled, (state, action) => {
        state.monthlyPurchaseLoading = false;
        state.monthlyPurchaseOrders = action.payload.success ? action.payload.data : [];
      })
      .addCase(fetchMonthlyPurchaseOrders.rejected, (state, action) => {
        state.monthlyPurchaseLoading = false;
        state.monthlyPurchaseError = action.payload || "Failed to fetch monthly purchase orders";
      });
  },
});

export default dashboardSlice.reducer;