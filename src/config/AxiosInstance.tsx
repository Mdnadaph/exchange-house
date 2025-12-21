import axios from "axios";
// import BASE_URL from "./config";
import BASE_URL from "@/config/config";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;