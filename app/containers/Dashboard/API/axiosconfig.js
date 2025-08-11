// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://128.199.126.171/~goldorg",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://128.199.126.171/~goldorg",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => {
    // ✅ Check API-level "error" even for HTTP 200
    if (
      response?.data?.status === "error" &&
      response?.data?.message === "Unauthorised Access"
    ) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
      return Promise.reject(new Error("Unauthorised Access"));
    }

    return response;
  },
  error => {
    // ✅ Also handle actual HTTP errors like 401, 403
    if (
      error?.response?.data?.status === "error" &&
      error?.response?.data?.message === "Unauthorised Access"
    ) {
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
