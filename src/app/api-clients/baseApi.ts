import axios, { AxiosError, CreateAxiosDefaults, ResponseType } from "axios";
import { toast } from "react-toastify";

const toastService = {
  success: (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },
  error: (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },
  info: (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3500,
    });
  },
  warning: (message: string) => {
    toast.warn(message, {
      position: "top-right",
      autoClose: 3500,
    });
  },
};

const createApiClient = ({
  baseURL,
  responseType = "json",
  options,
  headers,
  getToken,
  logout,
}: {
  baseURL: string;
  responseType?: ResponseType;
  getToken: () => string | null;
  logout: () => void;
  headers?: CreateAxiosDefaults["headers"];
  options?: Omit<
    CreateAxiosDefaults,
    "baseURL" | "method" | "responseType" | "headers"
  >;
}) => {
  const apiClient = axios.create({
    baseURL: baseURL,
    responseType: responseType,
    headers: headers ?? { "Content-Type": "application/json" },
    ...options,
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      if (status === 401) {
        logout();
        toastService.error("You have no access.");
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default createApiClient;
