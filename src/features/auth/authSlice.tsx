import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { AxiosResponse } from "axios";
import { showToast } from "@/General";

interface LoginCredentials {
  username: string;
  password: string;
}

interface Settings {
  name: string;
  code: string;
  value: string;
}

interface Other {
  m_v: string;
  e_v: string;
  c_p: string;
}

interface LoginResponseData {
  token: string;
  department: string;
  crn_mobile: string;
  crn_email: string;
  crn_id: string;
  company_id: string;
  username: string;
  fav_pages: string;
  settings: Settings[];
  crn_type: string;
  successPath: string;
  validity: number;
  other: Other;
}

interface LoginResponse {
  data: LoginResponseData;
  message: string;
  status: string;
  success: boolean;
  code: number;
}

interface AuthState {
  user: LoginResponseData | null;
  authStatus: boolean;
  loading: "idle" | "loading" | "success" | "failed";
  token: string | null;
  qrCodeLoading: boolean;
  qrStatus: any;
  otpLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  authStatus: false,
  loading: "idle",
  token: null,
  qrCodeLoading: false,
  qrStatus: null,
  otpLoading: false,
};

export const loginUserAsync = createAsyncThunk<
  AxiosResponse<LoginResponse>,
  LoginCredentials
>("auth/loginUser", async (loginCredential) => {
  const response = await spigenAxios.post<LoginResponse>(
    "auth/signin",
    loginCredential
  );
  return response;
});

export const recoveryAccount = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { email: string }>("auth/verifyPasswordOtpAsync", async (paylaod) => {
  const response = await spigenAxios.get(`auth/reacative-login?email=${paylaod.email}`);
  return response;
});

export const getQRStatus = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string }>,
  { crnId: string }
>("auth/getQRStatus", async () => {
  const response = await spigenAxios.get(`auth/qrCode`);
  return response;
});

export const verifyOtpAsync = createAsyncThunk<
  AxiosResponse<{ success: boolean; message: string }>,
  { otp: string; secret: string }
>("auth/verifyOtpAsync", async (paylaod) => {
  const response = await spigenAxios.post("/auth/verify", paylaod);
  return response;
});

export const getPasswordOtp = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, { emailId: string }>(
  "auth/getPasswordOtp", 
  async (payload) => {
    const response = await spigenAxios.get("/user/get-password-otp/", {
      params: {
        emailId: payload.emailId, // Send emailId as a query param
      }
    });
    return response;
  }
);

export const updatePassword = createAsyncThunk<AxiosResponse<{ success: boolean; message: string }>, any>("auth/updatePassword", async (paylaod) => {
  const response = await spigenAxios.put("/user/update-password", paylaod);
  return response;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.authStatus = false;
      state.token = null;
      localStorage.clear();
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        const savedSession = JSON.parse(localStorage.getItem("loggedInUser") || '{}')?.session || "24-25";
        const data = action.payload.data.data;
        if (!data) {
          state.qrStatus = action.payload.data;
          localStorage.setItem("showOtpPage",action.payload.data?.isTwoStep);
          const userObj = {
            token: action.payload.data.token,
          };
          localStorage.setItem("loggedInUser", JSON.stringify(userObj));
          state.user = action.payload.data;
          state.authStatus = true;
          state.loading = "success";
          state.token = action.payload.data.token;
          return;
        }
        if (data) {
          const userObj = {
            email: data?.crn_email,
            phone: data?.crn_mobile,
            userName: data?.username,
            token: data?.token,
            // favPages: JSON.parse(data.fav_pages),
            type: data?.crn_type,
            // mobileConfirmed: data?.other.m_v,
            // emailConfirmed: data?.other.e_v,
            // passwordChanged: data?.other.c_p ?? "C",
            id: data?.crn_id,
            showLegal: data?.department === "legal",
            session: savedSession,
          };

          localStorage.setItem("loggedInUser", JSON.stringify(userObj));

          state.user = data;
          state.authStatus = true;
          state.loading = "success";
          state.token = data.token;
        }
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = "failed";
      })
      .addCase(verifyOtpAsync.pending, (state) => {
        state.qrCodeLoading = true;
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action: any) => {
        if(action.payload.data.success){
          showToast(action.payload.data.message, "success");
        }
        const data = action.payload.data.data;
        const savedSession = JSON.parse(localStorage.getItem("loggedInUser") || '{}')?.session || "24-25";

        const userObj = {
          email: data?.crn_email,
          phone: data?.crn_mobile,
          userName: data?.username,
          token: data?.token,
          // favPages: JSON.parse(data.fav_pages),
          type: data?.crn_type,
          // mobileConfirmed: data?.other.m_v,
          // emailConfirmed: data?.other.e_v,
          // passwordChanged: data?.other.c_p ?? "C",
          id: data?.crn_id,
          showLegal: data?.department === "legal",
          session: savedSession,
        };
        localStorage.setItem("showOtpPage", "");
        localStorage.setItem("loggedInUser", JSON.stringify(userObj));

        state.user = data;
        state.authStatus = true;
        state.loading = "success";
        state.token = data.token;
        state.qrCodeLoading = false;
      })
      .addCase(verifyOtpAsync.rejected, (state) => {
        state.qrCodeLoading = false;
      })
      .addCase(getPasswordOtp.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(getPasswordOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(getPasswordOtp.rejected, (state) => {
        state.otpLoading = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.otpLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.data.success) {
          showToast(action.payload.data.message, "success");
        }
      })
      .addCase(updatePassword.rejected, (state) => {
        state.otpLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
