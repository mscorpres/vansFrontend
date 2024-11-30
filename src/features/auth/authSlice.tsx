import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { spigenAxios } from "@/axiosIntercepter";
import { AxiosResponse } from "axios";

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
}

const initialState: AuthState = {
  user: null,
  authStatus: false,
  loading: "idle",
  token: null,
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
        const data = action.payload.data.data;

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
          session: "24-25",
        };

        localStorage.setItem("loggedInUser", JSON.stringify(userObj));

        state.user = data;
        state.authStatus = true;
        state.loading = "success";
        state.token = data.token;
      })
      .addCase(loginUserAsync.rejected, (state) => {
        state.loading = "failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
