import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://128.199.126.171/~goldorg", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
