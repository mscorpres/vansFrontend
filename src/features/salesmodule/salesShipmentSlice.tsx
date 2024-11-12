import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}


interface Address {
  address1: string;
  address2: string;
  addressId: number;
  label?: string; 
}

interface Item {
  itemId: number;
  partNumber: string;
  name: string;
  quantity: number;
  rate: number;
  value: number; 
}


interface SellShipmentRequest {
    soId: string | number;
    shipmentId: string | number;
    client: string;
    clientCode: string | number;
    clientAddress: Address;
    billingAddress: Address;
    shippingAddress: Address;
    billingId: number;
    shippingId: number;
    delChallanStatus: string;
    shipmentStatus: string;
    items: Item[];
  
}


interface SellShipmentState {
  data: SellShipmentRequest[];
  successMessage?: string | null;
  shipmentMaterialList: any[]|null;
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  shipmentMaterialList:null,
  loading: false,
  error: null,
};
interface FetchSellShipmentPayload {
  type: any;
  data: string;
}

interface CancelPayload {
  cancelReason: string;
  shipment_id: string;
}


interface CreateDeliveryChallanPayload {
    shipment_id: string[];
    so_id: string[];
    nos_of_boxes: number;
    client_id?: number;
    client_addr_id?: number;
    bill_id?: number;
    remark?: string;
  }



  export const createDeliveryChallan = createAsyncThunk<
  ApiResponse<null>,
  CreateDeliveryChallanPayload
>("deliveryChallan/createDeliveryChallan", async (payload) => {
  const response = await spigenAxios.post("createDeliveryChallan", payload);
  return response.data;
});

export const fetchMaterialList = createAsyncThunk(
  "client/soMaterialList",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/salesOrder/shipmentMaterialList",
        payload
      )) as any;
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const cancelShipment = createAsyncThunk(
  "client/cancelShipment",
  async (payload: CancelPayload, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "salesOrder/cancelShipment",
        payload
      )) as any;

      if (response?.data?.code == 200) {
        toast({
          title: response?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const approveShipment = createAsyncThunk(
  "sellRequest/approveShipment",
  async ({ so_id }: { so_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>("/salesOrder/approveShipment", {
        shipment_id: so_id,
      });

      if (!response.data) {
        throw new Error("No data received");
      }
      if (response?.data?.code == 200) {
        toast({
          title: response?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle error using rejectWithValue
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);


export const createInvoice = createAsyncThunk(
  "client/createInvoice",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = (await spigenAxios.post<any>(
        "/salesOrder/createInvoice",
        payload
      )) as any;

      if (response?.data?.code == 200) {
        toast({
          title: response?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchSalesOrderShipmentList = createAsyncThunk<
  ApiResponse<SellShipmentRequest[]>,
  FetchSellShipmentPayload
>("sellRequest/fetchSalesOrderShipmentList", async (payload) => {
  const response = await spigenAxios.post("salesOrder/shipmentDetails", payload);
  return response.data;
});




export const updateSOshipment = createAsyncThunk<
  ApiResponse<null>,
  {
    headers: {
      so_id: string | number;
      so_shipment_id: string | number;
      ship_id: string | number;
      ship_addr1: string;
      ship_addr2: string;
      eway_no?: string;
      other_ref: string;
      vehicle_no: string;
    };
    materials: {
      updaterow: number[];
      item: string[];
      qty: number[];
      hsn: string[];
      rate: number[];
      gstType: string[];
      gstRate: number[];
      cgst: number[];
      sgst: number[];
      igst: number[];
      remark?: string[];
    };
  }
>("sellRequest/updateSOshipment", async (payload) => {
  const response = await spigenAxios.post("/updateSOshipment", payload);
  return response.data;
});




const sellShipmentSlice = createSlice({
    name: "shipment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder

      .addCase(createDeliveryChallan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createDeliveryChallan.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.successMessage = action.payload.message || "Delivery Challan created successfully.";
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to create delivery challan.";
          state.successMessage = null;
        }
        state.loading = false;
      })
      .addCase(createDeliveryChallan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create delivery challan.";
        state.successMessage = null;
      })
      
      .addCase(fetchSalesOrderShipmentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderShipmentList.fulfilled, (state, action) => {
        state.data = action.payload.data;

        state.loading = false;
      })
      .addCase(fetchSalesOrderShipmentList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch sales order shipment list";
      })
      .addCase(fetchMaterialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterialList.fulfilled, (state, action) => {
        state.shipmentMaterialList = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchMaterialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel sell request";
      })
      .addCase(cancelShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveShipment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(approveShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create sell request";
      })
      .addCase(cancelShipment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel sell request";
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create invoice";
      })
        .addCase(updateSOshipment.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateSOshipment.fulfilled, (state, action) => {
          if (action.payload.success) {
            state.error = null;
          } else {
            state.error = action.payload.message || "Failed to update sales order shipment";
          }
          state.loading = false;
        })
        .addCase(updateSOshipment.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || "Failed to update sales order shipment";
        });
    },
  });
  
 
  
export default sellShipmentSlice.reducer;
