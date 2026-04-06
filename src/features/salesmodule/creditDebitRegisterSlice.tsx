import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { toast } from "@/components/ui/use-toast";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | null;
}

interface CreditNote {
  invoice_id: string;
  other_ref: string;
  material: {};
}

interface SellShipmentState {
  data: CreditNote[];
  dataNotes: any[];
  materialListData: [];
  loading: boolean;
  error: string | null;
}

const initialState: SellShipmentState = {
  data: [],
  dataNotes: [],
  materialListData: [],
  loading: false,
  error: null,
};
interface SoNotePrintPayload {
  invoiceNo: string;
  printType: string; // Added to match printSellInvoice
}

interface FetchSellInvoicePayload {
  wise: string; // Specify type as string or a union of valid values
  data: string;
}

export const fetchCreditDebitRegisterList = createAsyncThunk<
  ApiResponse<CreditNote[]>,
  FetchSellInvoicePayload
>("soEnotes/getNoteList", async (payload) => {
  const response = await spigenAxios.get(`/enote/fetchCreditNoteList`, {
    params: {
      wise: payload.wise,
      data: payload.data,
    },
  });
  return response.data;
});

export const createCreditNote = createAsyncThunk(
  "client/createCreditNote",
  async (payload: CreditNote, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.post<any>("/enote/createCreditNote", payload);

      if (response?.data?.success) {
        toast({
          title: response?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
      } else {
        toast({
          title: response.data.message,
          className: "bg-red-600 text-white items-center",
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

export const fetchDataNotes = createAsyncThunk(
  "so/fetchDataNotes",
  async ({ shipment_id }: { shipment_id: string }, { rejectWithValue }) => {
    try {
      const response = await spigenAxios.get<any>(
        `/enote/fetchData4notes?shipment_id=${shipment_id}`
      );

      if (!response.data) {
        throw new Error("No data received");
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

export const getNoteMaterialList = createAsyncThunk<
  ApiResponse<any>,
  { note_no: string } // The argument type passed to the thunk
>("client/getNoteMaterialList", async ({ note_no }, { rejectWithValue }) => {
  try {
    const response = await spigenAxios.get<ApiResponse<any>>(
      `enote/fetchCreditNote?credit_note_id=${note_no}`,
    );

    if (!response.data) {
      throw new Error("No data received");
    }

    // Return the entire response as expected by the fulfilled case
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      // Handle error using rejectWithValue
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});
export const soNotePrint = createAsyncThunk<
  ApiResponse<null>, // Return type: null since no data is returned
  SoNotePrintPayload, // Payload type
  { rejectValue: string } // Reject value type
>(
  "client/soNotePrint",
  async ({ invoiceNo, printType }, { rejectWithValue }) => {
    try {
      // Replace / with _ in note_no
      const modifiedNoteNo = invoiceNo.replace(/\//g, "_");

      // Construct the URL with query parameters
      const url =
        spigenAxios.defaults.baseURL +
        `/enote/printCreditNoteEInvoice?invoiceNo=${encodeURIComponent(
          modifiedNoteNo
        )}&printType=${encodeURIComponent(printType)}`;

      // Open the URL in a new tab/window
      window.open(url, "_blank");

      // Return a response consistent with ApiResponse
      return { success: true, data: null };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const creditDebitRegister = createSlice({
  name: "creditDebitRegisterSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreditDebitRegisterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditDebitRegisterList.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = action.payload.data;
          state.error = null;
        } else {
          state.error =
            action.payload.message ||
            "Failed to fetch credit note list";
        }
        state.loading = false;
      })
      .addCase(fetchCreditDebitRegisterList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch credit note list";
      })
      .addCase(createCreditNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCreditNote.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.data = [...state.data, action.payload.data];
          state.error = null;
        } else {
          state.error = action.payload.message || "Failed to create credit note";
        }
        state.loading = false;
      })
      .addCase(createCreditNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create credit note";
      })
      .addCase(fetchDataNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataNotes.fulfilled, (state, action) => {
        state.dataNotes = action.payload.data;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDataNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data notes";
      })
      .addCase(getNoteMaterialList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoteMaterialList.fulfilled, (state, action) => {
        state.loading = false;
        state.materialListData = action.payload.data;
      })
      .addCase(getNoteMaterialList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default creditDebitRegister.reducer;