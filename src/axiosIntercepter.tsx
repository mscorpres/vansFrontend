import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import { toast as toasts } from "@/components/ui/use-toast";

const socketLink: string = import.meta.env.VITE_REACT_APP_SOCKET_BASE_URL;
const imsLink: string = import.meta.env.VITE_REACT_APP_API_BASE_URL;

interface LoggedInUser {
  token: string;
}

interface ErrorResponse {
  success?: boolean;
  message?: string | { msg?: string };
  data?: {
    logout?: boolean;
  };
  status?: string;
}

interface OtherData {
  company_branch?: string;
  session?: string;
}

const loggedInUser: LoggedInUser | null = JSON.parse(
  localStorage.getItem("loggedInUser") as string
);
const otherData: OtherData | null = JSON.parse(
  localStorage.getItem("otherData") as string
);

const spigenAxios = axios.create({
  baseURL: imsLink,
  headers: {
    authorization: loggedInUser?.token,
  },
});

spigenAxios.interceptors.request.use(async (config) => {
  const loggedInUser: LoggedInUser | null = JSON.parse(
    localStorage.getItem("loggedInUser") as string
  );
  if (loggedInUser) {
    config.headers["authorization"] = loggedInUser.token;
    config.headers["x-windows-url"] = window.location.href;
  }
  return config;
});

spigenAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data?.success !== undefined) {
      return response;
    }
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      toast.error("Session expired. Logging out...");
      localStorage.clear();
      window.location.reload();
      return Promise.reject(error);
    }

    // Existing error handling
    if (error.response && typeof error.response.data === "object") {
      const errorData = error.response.data;

      // Handle specific error cases
      if (errorData?.data?.logout) {
        toast.error(errorData.message || "Logout error.");
        localStorage.clear();
        window.location.reload();
        return Promise.reject(error);
      }

      if (errorData.success === false || errorData?.status === "error") {
        if (errorData?.message?.msg) {
          toasts({
            title: errorData?.message?.msg,
            className: "bg-red-600 text-white items-center",
          });
          toast.error(errorData?.message?.msg || "Error occurred.");
          return Promise.reject(errorData);
        } else {
          toasts({
            title: errorData?.message,
            className: "bg-red-600 text-white items-center",
          });
          toast.error(errorData?.message || "Error occurred.");
          return Promise.reject(errorData);
        }
      }

      if (errorData.message) {
        toast.error(errorData.message);
      } else {
        toast.error("Error while connecting to backend.");
      }

      return Promise.reject(errorData);
    }

    toast.error("An unexpected error occurred.");
    return Promise.reject(error);
  }
);

const branch: string = otherData?.company_branch ?? "BRMSC012";
const session: string = otherData?.session ?? "25-26";
const savedSession = JSON.parse(localStorage.getItem("loggedInUser") || "{}")
  ?.session || "25-26";

spigenAxios.defaults.headers["Company-Branch"] = branch;
spigenAxios.defaults.headers["Session"] = savedSession;

export { spigenAxios, socketLink };