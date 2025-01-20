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
interface uomPayload {
  id: string;
  value: string;
}
interface deletePart {
  pocode: string;
  partcode: string;
  updatecode: string;
}
interface shippingAddressPayload {
  // id: string;
  statecode: string;
  company: string;
  address: string;
  gstin: string;
  pan: string;
  pincode: string;
  data: string;
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
export const listOfVendorBranchList = createAsyncThunk<
  any,
  { vendorcode?: string }
>("/backend/vendorBranchList", async ({ vendorcode }) => {
  try {
    const response = await spigenAxios.get<any>(
      `/backend/vendorBranchList/${vendorcode}`
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const listOfCostCenter = createAsyncThunk<
  uomPayload,
  { search?: string }
>("/backend/costCenter", async ({ search }) => {
  try {
    const response = await spigenAxios.post<uomPayload>(
      `/backend/costCenter/${search}`
      //   , {
      //   search: search,
      // }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const listOfBillToList = createAsyncThunk<
  uomPayload,
  { cost_center?: string; search?: string }
>("/backend/billingAddressList", async ({ cost_center, search }) => {
  try {
    const response = await spigenAxios.get<uomPayload>(
      `/backend/billingAddressList/${cost_center}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchShippingAddressDetails = createAsyncThunk<
  shippingAddressPayload,
  { shipping_code?: string }
>("/backend/shippingAddress", async ({ shipping_code }) => {
  try {
    const response = await spigenAxios.get<shippingAddressPayload>(
      `/backend/shippingAddress/${shipping_code}`
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});

export const fetchBillingList = createAsyncThunk<
  shippingAddressPayload,
  { cost_center?: string }
>("/backend/billingAddressList", async ({ cost_center }) => {
  try {
    const response = await spigenAxios.get<shippingAddressPayload>(
      `/backend/billingAddressList/${cost_center}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchBillingListDetails = createAsyncThunk<
  shippingAddressPayload,
  { billing_code?: string }
>("/backend/billingAddress", async ({ billing_code }) => {
  try {
    const response = await spigenAxios.get<shippingAddressPayload>(
      `/backend/billingAddress/${billing_code}`
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchVendorAddressDetails = createAsyncThunk<
  shippingAddressPayload,
  { vendorcode?: string; branchcode?: string }
>("/backend/vendorAddress", async ({ vendorcode, branchcode }) => {
  try {
    const response = await spigenAxios.get<shippingAddressPayload>(
      `backend/vendorAddress?vendorcode=${vendorcode}&branchcode=${branchcode}`
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchComponentDetails = createAsyncThunk<
  shippingAddressPayload,
  { component_code?: string; vencode?: string }
>(
  "/purchaseOrder/getComponentDetailsByCode",
  async ({ component_code, vencode }) => {
    try {
      const response = await spigenAxios.get<shippingAddressPayload>(
        `/purchaseOrder/getComponentDetailsByCode?component_code=${component_code}&vencode=${vencode}`
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
      const response = await spigenAxios.get<hsnPayload>(
        `backend/searchHsn/${payload.searchTerm}`
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
export const listOfUoms = createAsyncThunk<uomPayload>("/uom", async () => {
  try {
    const response = await spigenAxios.get<uomPayload>("/uom", {
      _: 1717993845490,
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchShippingAddressForPO = createAsyncThunk<uomPayload>(
  "/backend/shipingAddressList",
  async () => {
    try {
      const response = await spigenAxios.get<uomPayload>(
        "/backend/shipingAddressList"
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchManagePOList = createAsyncThunk<
  uomPayload,
  { data: string; wise: string }
>("/purchaseOrder/fetchPendingData4PO", async ({ data, wise }) => {
  try {
    const response = await spigenAxios.get<uomPayload>(
      `purchaseOrder/fetchPendingData4PO?wise=${wise}&data=${data}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const poMIN = createAsyncThunk<uomPayload>(
  "/purchaseOrder/poMIN",
  async (payload) => {
    try {
      const response = await spigenAxios.post<uomPayload>(
        "/purchaseOrder/poMIN",
        payload
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const removePart = createAsyncThunk<deletePart>(
  "/purchaseOrder/removePart",
  async (payload) => {
    try {
      const response = await spigenAxios.delete<deletePart>(
        `/purchaseOrder/removePart?pocode=${payload.pocode}&partcode=${payload.partcode}&updatecode=${payload.updatecode}`
      );

      return response;
    } catch (error) {
      return response;
    }
  }
);
export const poApprove = createAsyncThunk<uomPayload>(
  "/purchaseOrder/po_approve",
  async (payload) => {
    try {
      const response = await spigenAxios.put<uomPayload>(
        "/purchaseOrder/po_approve",
        payload
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);

export const updateMapCustomer = createAsyncThunk<uomPayload>(
  "/component/updateMapCustomer",
  async (payload) => {
    try {
      const response = await spigenAxios.put<any>(
        "/component/updateMapCustomer",
        payload
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);

export const fetchManagePOVeiwComponentList = createAsyncThunk<
  uomPayload,
  { poid: string }
>("/purchaseOrder/fetchComponentList4PO", async ({ poid }) => {
  try {
    const response = await spigenAxios.get<uomPayload>(
      `/purchaseOrder/fetchComponentList4PO?poid=${payload}`
    );

    return response.data.response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const cancelFetchedPO = createAsyncThunk<
  uomPayload,
  { poid: string; remark: string }
>("/purchaseOrder/CancelPO", async ({ poid, remark }) => {
  try {
    const response = await spigenAxios.post<uomPayload>(
      "/purchaseOrder/CancelPO",
      { purchase_order: poid, remark: remark }
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
export const fetchDataPOforMIN = createAsyncThunk<uomPayload, { poid: string }>(
  "/purchaseOrder/fetchData4MIN",
  async ({ poid }) => {
    try {
      const response = await spigenAxios.get<uomPayload>(
        `/purchaseOrder/fetchData4MIN/?pono=${poid}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchDataPOEdit = createAsyncThunk<uomPayload, { pono: string }>(
  "/purchaseOrder/fetchData4Update",
  async ({ pono }) => {
    try {
      const response = await spigenAxios.get<uomPayload>(
        `/purchaseOrder/fetchData4Update?pono=${pono}`
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const printPO = createAsyncThunk<uomPayload, { poid: string }>(
  "/poPrint",
  async ({ poid }) => {
    try {
      const response = await spigenAxios.get<uomPayload>(
        `/poPrint?poid=${poid}`
        // {
        //   poid: poid,
        // }
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const fetchCurrency = createAsyncThunk<uomPayload>(
  "/backend/fetchAllCurrecy",
  async () => {
    try {
      const response = await spigenAxios.get<uomPayload>(
        "/backend/fetchAllCurrecy"
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
//fetch completed Po
export const fetchCompletedPo = createAsyncThunk<
  uomPayload,
  { data: string; wise: string }
>("/purchaseOrder/fetchCompletePO", async ({ data, wise }) => {
  try {
    const response = await spigenAxios.get<uomPayload>(
      `purchaseOrder/fetchCompletePO?wise=${wise}&data=${data}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
//fetch approval Po
export const fetchneededApprovalPO = createAsyncThunk<
  uomPayload,
  { data: string; wise: string }
>("purchaseOrder/fetchneededApprovalPO", async ({ data, wise }) => {
  try {
    const response = await spigenAxios.get<uomPayload>(
      `purchaseOrder/fetchneededApprovalPO?wise=${wise}&data=${data}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
//rejectpo
export const rejectPo = createAsyncThunk<
  uomPayload,
  { poid: string; remark: string }
>("/purchaseOrder/rejectPo", async ({ poid, remark }) => {
  try {
    const response = await spigenAxios.put<uomPayload>(
      "/purchaseOrder/rejectPo",
      {
        poid: poid,
        remark: remark,
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
});
//update Po
export const updatePo = createAsyncThunk<uomPayload, payload>(
  "/purchaseOrder/updateData4Update",
  async (payload) => {
    try {
      const response = await spigenAxios.put<uomPayload>(
        "/purchaseOrder/updateData4Update",
        payload
      );

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occurred");
    }
  }
);
export const getOtpForProfile = createAsyncThunk<any, payload>(
  "/profile/send-email-otp",
  async (payload) => {
    try {
      const response = await spigenAxios.post("/profile/send-email-otp", {
        newEmail: payload.email,
      });

      return response;
    } catch (error) {
      return error;
    }
  }
);
export const verifyOtpForProfileEmail = createAsyncThunk<any, payload>(
  "/profile/verify-email-otp",
  async (payload) => {
    try {
      const response = await spigenAxios.put("/profile/verify-email-otp", {
        otp: payload.otp,
        emailId: payload.emailId,
      });

      return response.data;
    } catch (error) {
      return error;
    }
  }
);
export const updateProfileName = createAsyncThunk<any, payload>(
  "/profile/userUpdate",
  async (payload) => {
    try {
      const response = await spigenAxios.post("/profile/userUpdate", {
        fullname: payload.fullname,
      });

      return response;
    } catch (error) {
      return error;
    }
  }
);
export const userDetailsForProfile = createAsyncThunk<any>(
  "/profile/userDetails",
  async () => {
    try {
      const response = await spigenAxios.get("/profile/userDetails");

      return response;
    } catch (error) {
      return error;
    }
  }
);

interface ClientState {
  data: any[];
  loading: boolean;
  error: string | null;
  creatematerial: null;
  vendorBranchlist: null;
  shippingPOList: null;
  shippingPODetails: null;
  vendorPODetails: null;
  vendorBillingList: null;
  vendorBillingDetails: null;
  uomlist: null;
  costCenterList: null;
  hsnlist: null;
}

const initialState: ClientState = {
  data: [],
  loading: false,
  error: null,
  hsnlist: null,
  uomlist: null,
  vendorBranchlist: null,
  costCenterList: null,
  shippingPOList: null,
  shippingPODetails: null,
  vendorPODetails: null,
  vendorBillingList: null,
  vendorBillingDetails: null,
  getComponentData: null,
  managePoList: null,
  minpoList: null,
  approvePoList: null,
  cpmPoList: null,
  managePoViewComponentList: null,
  cancelPO: null,
  poMinList: null,
  editPoDetails: null,
  editProfile: null,
  currencyList: null,
  creatematerial: null,
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
      })
      ///search hsn
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
      })

      ///search uom List
      .addCase(listOfUoms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOfUoms.fulfilled, (state, action) => {
        state.loading = false;
        state.uomlist = action.payload;
      })
      .addCase(listOfUoms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch UOM List";
      })
      ///search vendor  List accroding to branch
      .addCase(listOfVendorBranchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOfVendorBranchList.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorBranchlist = action.payload;
      })
      .addCase(listOfVendorBranchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch branch List";
      })
      ///search cost center List accroding to branch
      .addCase(listOfCostCenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listOfCostCenter.fulfilled, (state, action) => {
        state.loading = false;
        state.costCenterList = action.payload;
      })
      .addCase(listOfCostCenter.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      ///search cost center List accroding to branch
      .addCase(fetchShippingAddressForPO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingAddressForPO.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingPOList = action.payload;
      })
      .addCase(fetchShippingAddressForPO.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      ///search cost center List accroding to branch
      .addCase(fetchShippingAddressDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingAddressDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingPODetails = action.payload;
      })
      .addCase(fetchShippingAddressDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      //Get details of selected vendor
      .addCase(fetchVendorAddressDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorAddressDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorPODetails = action.payload;
      })
      .addCase(fetchVendorAddressDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      //Get details of selected vendor
      .addCase(fetchBillingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingList.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorBillingList = action.payload;
      })
      .addCase(fetchBillingList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      //Get details of selected vendor
      .addCase(fetchBillingListDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingListDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorBillingDetails = action.payload;
      })
      .addCase(fetchBillingListDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      //Get details of selected vendor
      .addCase(fetchComponentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComponentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.getComponentData = action.payload;
      })
      .addCase(fetchComponentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      //// manage po lsit
      .addCase(fetchManagePOList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagePOList.fulfilled, (state, action) => {
        state.loading = false;
        state.managePoList = action.payload;
      })
      .addCase(fetchManagePOList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(poMIN.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(poMIN.fulfilled, (state, action) => {
        state.loading = false;
        state.minpoList = action.payload;
      })
      .addCase(poMIN.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(poApprove.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(poApprove.fulfilled, (state, action) => {
        state.loading = false;
        state.approvePoList = action.payload;
      })
      .addCase(poApprove.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(updateMapCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMapCustomer.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateMapCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(fetchneededApprovalPO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchneededApprovalPO.fulfilled, (state, action) => {
        state.loading = false;
        state.approvePoList = action.payload;
      })
      .addCase(fetchneededApprovalPO.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(rejectPo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectPo.fulfilled, (state, action) => {
        state.loading = false;
        state.approvePoList = action.payload;
      })
      .addCase(rejectPo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(updatePo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePo.fulfilled, (state, action) => {
        state.loading = false;
        state.approvePoList = action.payload;
      })
      .addCase(updatePo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(fetchCompletedPo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedPo.fulfilled, (state, action) => {
        state.loading = false;
        state.cpmPoList = action.payload;
      })
      .addCase(fetchCompletedPo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(fetchDataPOforMIN.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataPOforMIN.fulfilled, (state, action) => {
        state.loading = false;
        state.poMinList = action.payload;
      })
      .addCase(fetchDataPOforMIN.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(cancelFetchedPO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFetchedPO.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
          state.error = null;
        } else {
          state.error =
            action.payload.message.msg ||
            "Failed to fetch sales order shipment list";
        }
        state.loading = false;
      })
      .addCase(cancelFetchedPO.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message.msg ||
          "Failed to fetch sales order shipment list";
      })
      .addCase(fetchDataPOEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDataPOEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.editPoDetails = action.payload;
      })
      .addCase(fetchDataPOEdit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(fetchCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyList = action.payload;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(printPO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(printPO.fulfilled, (state, action) => {
        state.loading = false;
        state.editPoDetails = action.payload;
      })
      .addCase(printPO.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(getOtpForProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOtpForProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.editProfile = action.payload;
      })
      .addCase(getOtpForProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(verifyOtpForProfileEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpForProfileEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.editProfile = action.payload;
      })
      .addCase(verifyOtpForProfileEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(updateProfileName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileName.fulfilled, (state, action) => {
        state.loading = false;
        state.editProfile = action.payload;
      })
      .addCase(updateProfileName.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      })
      .addCase(userDetailsForProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userDetailsForProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.editProfile = action.payload;
      })
      .addCase(userDetailsForProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch Cost Center List";
      });
    //// manage po lsit view
    // .addCase(fetchManagePOVeiwComponentList.pending, (state) => {
    //   // state.loading = true;
    //   state.error = null;
    // })
    // .addCase(fetchManagePOVeiwComponentList.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.managePoViewComponentList = action.payload;
    // })
    // .addCase(fetchManagePOVeiwComponentList.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error =
    //     action.error.message || "Failed to fetch Cost Center List";
    // });
  },
});

export default clientSlice.reducer;
