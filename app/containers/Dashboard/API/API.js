import axios from "axios";
import { fetchClient } from "./fetchconfig";
import axiosInstance from "./axiosconfig";

export const apifetchPositions = async (userId, authKey) => {
  try {
    const response = await axiosInstance.post("/datatables/position_book_list", {
      is_app: "1",
      login_user_id: userId,
      auth_key: authKey,
      sEcho: 1,
      iDisplayStart: 0,
      iDisplayLength: 1000000,
      sSearch: "",
    });

    if (response.data && response.data.aaData) {
      return response.data.aaData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching position data:", error);
    return [];
  }
};


export const fetchLoginDataAPI = async (userId, authKey) => {
  try {
    const res = await axiosInstance.post("/datatables/get_login_data_details", {
      is_app: 1,
      login_user_id: userId,
      auth_key: authKey,
    });

    if (res.data.status === "ok" && Array.isArray(res.data.data)) {
      return res.data.data.slice(0, 5); // return top 5 entries
    } else {
      return [];
    }
  } catch (error) {
    console.error("Login data fetch failed:", error);
    return [];
  }
};



// export const fetchOrdersAPI = async (userId, authKey, type = "today", searchValue = "") => {
//   const formData = {
//     sEcho: 1,
//     iDisplayStart: 0,
//     iDisplayLength: 10000,
//     sSearch: searchValue,
//     is_app: 1,
//     login_user_id: userId,
//     auth_key: authKey,
//     isTodayTrade: type === "today" ? "today" : "",
//   };

//   try {   // &&&&
//     const response = await fetchClient("/datatables/order_book_new", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     // Try both formats
//     const data = response.data || response;  // if using axios or custom client
//     return data.aaData || [];
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return [];
//   }
// };
export const fetchOrdersAPI = async (userId, authKey, type = "today", searchValue = "") => {
  const formData = {
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10000,
    sSearch: searchValue,
    is_app: 1,
    login_user_id: userId,
    auth_key: authKey,
    isTodayTrade: type === "today" ? "today" : "",
  };

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_new", formData);
    return data.aaData || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


export const fetchPendingOrdersAPI = async (userId, authKey) => {
  try {// &&&&
    const response = await axiosInstance.post("/datatables/order_book_new", {
      is_pending: "true",
      is_app: "1",
      login_user_id: userId,
      auth_key: authKey,
      sEcho: 1,
      iDisplayStart: 0,
      iDisplayLength: 10,
      sSearch: "",
    });

    if (response.data && response.data.aaData) {
      return response.data.aaData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    return [];
  }
};


export const fetchRejectionLogsAPI = async (userId, authKey, filterType = "", searchQuery = "") => {
  try {
    const response = await axiosInstance.post("/datatables/rejection_log_view", {
      is_app: "1",
      login_user_id: userId,
      auth_key: authKey,
      sEcho: 1,
      isTodayTrade: filterType,
      iDisplayStart: 0,
      iDisplayLength: 10000,
      sSearch: searchQuery || "",
    });

    return response.data.aaData || [];
  } catch (error) {
    console.error("Error fetching rejection logs:", error);
    return [];
  }
};


// export const fetchTradesDataAPI = async (userId, authKey, scriptId) => {
//   if (!scriptId) return [];

//   try {
//     const response = await fetchClient("/datatables/order_book_new", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         isTodayTrade: "today",
//         is_app: "1",
//         login_user_id: userId,
//         auth_key: authKey,
//         sEcho: 1,
//         iDisplayStart: 0,
//         iDisplayLength: 10,
//         script_id: scriptId,
//         sSearch: "",
//       }),
//     });

//     const result = await response.json();
//     return result?.aaData || [];
//   } catch (err) {
//     console.error("Error fetching trades", err);
//     return [];
//   }
// };


// export const fetchTrendStocksAPI = async (userId, authKey) => {
//   try {
//     const data = await fetchClient("/ajaxfiles/tranding_trades", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         is_app: "1",
//         login_user_id: userId,
//         auth_key: authKey,
//       }),
//     });

//     if (data && data.status === "ok" && data.data) {
//       return data.data.map((item) => ({
//         Id: item.script_id,
//         name: item.script_name || "N/A",
//         ltp: item.ltp,
//         per: item.per,
//         rateChange: item.rateChange,
//       }));
//     }
//     return [];
//   } catch (error) {
//     console.error("Failed to fetch Scripts in Trends:", error);
//     return [];
//   }
// };
export const fetchTradesDataAPI = async (userId, authKey, scriptId) => {
  if (!scriptId) return [];

  const formData = {
    isTodayTrade: "today",
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10,
    script_id: scriptId,
    sSearch: "",
  };

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_new", formData);
    return data?.aaData || [];
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return [];
  }
};

export const fetchTrendStocksAPI = async (userId, authKey) => {
  const formData = {
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
  };

  try {
    const { data } = await axiosInstance.post("/ajaxfiles/tranding_trades", formData);

    if (data?.status === "ok" && data?.data) {
      return data.data.map((item) => ({
        Id: item.script_id,
        name: item.script_name || "N/A",
        ltp: item.ltp,
        per: item.per,
        rateChange: item.rateChange,
      }));
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch Scripts in Trends:", error);
    return [];
  }
};

// export const fetchTradesAPI = async (userId, authKey, scriptId) => {
//   if (!scriptId) return [];

//   try {
//     const response = await fetchClient("/datatables/order_book_new", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         isTodayTrade: "today",
//         is_app: "1",
//         login_user_id: userId,
//         auth_key: authKey,
//         sEcho: 1,
//         iDisplayStart: 0,
//         iDisplayLength: 10,
//         script_id: scriptId,
//         sSearch: "",
//       }),
//     });

//     const data = await response.json();
//     return data?.aaData || [];
//   } catch (error) {
//     console.error("Failed to fetch trades:", error);
//     throw error; // rethrow so the component can handle it  
//   }
// };


// export const fetchStockPositionsAPI = async (userId, authKey, scriptId) => {
//   if (!scriptId) return [];

//   try {
//     const response = await fetchClient("/datatables/position_book_list", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         is_app: "1",
//         login_user_id: userId,
//         auth_key: authKey,
//         isActive: "active",
//         sEcho: 1,
//         iDisplayStart: 0,
//         iDisplayLength: 10,
//         script_id: scriptId,
//         sSearch: "",
//       }),
//     });

//     const data = await response.json();
//     return data?.aaData || [];
//   } catch (error) {
//     console.error("Error fetching position data:", error);
//     return [];
//   }
// };
export const fetchTradesAPI = async (userId, authKey, scriptId) => {
  if (!scriptId) return [];

  const formData = {
    isTodayTrade: "today",
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10,
    script_id: scriptId,
    sSearch: "",
  };

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_new", formData);
    return data?.aaData || [];
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return [];
  }
};

export const fetchStockPositionsAPI = async (userId, authKey, scriptId) => {
  if (!scriptId) return [];

  const formData = {
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
    isActive: "active",
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10,
    script_id: scriptId,
    sSearch: "",
  };

  try {
    const { data } = await axiosInstance.post("/datatables/position_book_list", formData);
    return data?.aaData || [];
  } catch (error) {
    console.error("Error fetching position data:", error);
    return [];
  }
};

export const fetchDashboardDataAPI = async (userId, authKey) => {
  try {
    const response = await axiosInstance.post("/ajaxfiles/dashboard_count_trade",
      {
        is_app: "1",
        login_user_id: userId,
        auth_key: authKey,
      }
    );

    if (response.data.status === "ok") {
      return {
        today_rejection: response.data.today_rejection,
        total_rejection: response.data.total_rejection,
        total_position: response.data.total_position,
        today_trades: response.data.today_trades,
        week_trades: response.data.week_trades,
        today_pending_trades: response.data.today_pending_trades,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return null;
  }
};

export const setScriptBlockSettingAPI = async (userId, authKey, market_type_id, script_ids) => {
  try {
    const response = await axios.post('ajaxfiles/setting/set_script_block_setting', {
      is_app: "1",
      userId,
      authKey,
      market_type_id,
      script_ids, // pass as array or comma-separated string as required by backend
    });
    return response.data;
  } catch (error) {
    console.error('Error setting script block:', error);
    throw error;
  }
};

export const removeBlockListAPI = async (userId, authKey, script_block_id) => {
  try {
    const response = await axios.post('ajaxfiles/setting/set_script_block_setting', {
      is_app: "1",
      userId,
      authKey,
      script_block_id,
    });
    return response.data;
  } catch (error) {
    console.error('Error setting script block:', error);
    throw error;
  }
};