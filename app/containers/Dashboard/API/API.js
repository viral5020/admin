import axios from "axios";
import { fetchClient } from "./fetchconfig";
import axiosInstance from "./axiosconfig";
import { constant } from "../Watchlist/constant";

function getDefaultParams() {
  const dataStored = JSON.parse(sessionStorage.getItem("data"));
  return {
    is_app: "1",
    login_user_id: dataStored.user_id,
    auth_key: dataStored.auth_key,
  }
}

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


export const fetchRejectionLogsAPI = async (
  userId,
  authKey,
  filterType = "",
  searchQuery = "",
  marketId,
  scriptId,
  clientId,
  masterId,
  end_date,
  start_date,
) => {
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

      market_type_id: marketId,
      script_id: scriptId,
      user_id: clientId,
      master_user_id: masterId,

      end_date: end_date,
      start_date: start_date,
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

export const fetchStrikeDataAPI = async ({ expiry, script, index = 0, term = 'CE' }) => {
  console.log('&&&&&& strike term', term);
  if (!term || !expiry?.expiry_date || !script?.script_id) {
    throw new Error('Missing term,expiry or script data');
  }

  const expiry_id = `${expiry.script_expiry_id}-${index}`;

  const response = await axiosInstance.post('ajaxfiles/get_option_strike_price', {
    ...getDefaultParams(),
    expiry_id,
    term,
  });

  // console.log('response.data', response.data);

  return response.data?.data || [];
};

export const addMarketScriptAPI = async ({
  market_type_id,
  script_id,
  script_expiry_id,
  expiryTerm,
  type,
  strickObj
}) => {
  const defaultParams = getDefaultParams();
  let payload;
  if (String(market_type_id) === constant) {
    payload = {
      market_type_id,
      script_id,
      script_expiry_id: `${script_expiry_id}-${expiryTerm}`,
      script_expiry_type: strickObj.check_script_name,
      script_expiry_orginal_formate: `${strickObj.rate} ${type}`
    }
  } else {
    let str = 'I'.repeat(expiryTerm + 1);  // 'I'.repeat(n) returns a string with 'I' repeated (expiryTerm + 1) times.
    console.log('expiryTerm', expiryTerm)
    console.log('str', str);
    payload = {
      market_type_id,
      script_id,
      script_expiry_id: script_expiry_id,
      script_expiry_type: str,
    }
  }

  try {
    const res = await axiosInstance.post('ajaxfiles/add_market_watch', { ...getDefaultParams(), ...payload });

    if (res.data.status === 'ok') {
      return res.data || {};
    } else {
      throw new Error(res.data.message || 'Unknown error occurred');
    }
  } catch (err) {
    console.error('Error in addMarketScript:', err.message || err);
    throw err;
  }
};

export async function getIP() {
  try {
    const res = await axios.get("https://api64.ipify.org?format=json");
    console.log('res.data.ip', res.data.ip);
    return res.data.ip;
  } catch (error) {
    console.error("Failed to get IP address:", error);
  }
};

export const closeAllPositions = async ({
  password,
  market,
  script,
  client,
  master,
  broker,
  exparyDate,
}) => {
  const defaultParams = getDefaultParams();

  const payload = {
    password,
    market_type_id: market,
    script_id: script,
    user_id: client,
    master_user_id: master,
    broker_id: broker,
    expiry_date: exparyDate,
    search_val: '',
    allow_close_all: true,
    ip_address: await getIP(),
    user_agent: '',
  };

  try {
    const res = await axiosInstance.post('ajaxfiles/trade_exit_all_position1', {
      ...defaultParams,
      ...payload,
    });

    if (res.data.success) {
      return res.data;
    } else {
      throw new Error(res.data.message || 'Failed to close positions');
    }
  } catch (err) {
    console.error('Error in closeAllPositions:', err.message || err);
    throw err;
  }
};

export const rolloverPositions = async ({
  password,
  market,
  script,
  client,
  master,
  broker,
  exparyDate,
}) => {
  const defaultParams = getDefaultParams();

  const payload = {
    password,
    market_type_id: market,
    script_id: script,
    user_id: client,
    master_user_id: master,
    broker_id: broker,
    expiry_date: exparyDate,
  };

  try {
    const res = await axiosInstance.post('ajaxfiles/trade_roll_over_all', {
      ...defaultParams,
      ...payload,
    });

    if (res.data.success) {
      return res.data;
    } else {
      throw new Error(res.data.message || 'Failed to roll over positions');
    }
  } catch (err) {
    console.error('Error in rolloverPositions:', err.message || err);
    throw err;
  }
};

export const checkLoginAPI = async () => {
  try {
    const response = await axiosInstance.post("/ajaxfiles/check_login", { ...getDefaultParams() });
    console.log('response.data', response.data);
    return response.data.status === 'ok';
  } catch (error) {
    console.error("Error in checkLogin:", error);
    throw error;  // ✅ throw if you want upstream to catch it
  }
};

export const fetchNotificationAPI = async () => {
  try {
    const response = await axiosInstance.post("/ajaxfiles/setting/fetch_notification", { ...getDefaultParams() });
    console.log('response.data', response.data);
    sessionStorage.setItem('notification', JSON.stringify(response.data));
  } catch (error) {
    console.error("Error in checkLogin:", error);
    throw error;  // ✅ throw if you want upstream to catch it
  }
};

export const getWatchListDataAPI = async () => {
  await fetchNotificationAPI();  // chatgpt : this work

  const isAuthorized = await checkLoginAPI();  // chatgpt : give cors error
  console.log('isAuthorized', isAuthorized); // isAuthorized undefined
  if (!isAuthorized) {
    console.log("Session expired. Please loginAAAAAAAAAAAAAA");
    alert("Session expired. Please login.");
    window.location.href = '/login';
    return;
  } else {
    console.log("Pass.......");
  }

  try {
    const response = await axiosInstance.post('ajaxfiles/market_watch_list1', { ...getDefaultParams() });
    return response.data;
  } catch (error) {
    console.error('Error in getting watchlist data:', error);
    throw error;
  }
}

export const updateTrade = async ({ trade_id, trade_rate, trade_lot, trade_qty, device_type = 0 }) => {
  try {
    const response = await axiosInstance.post('ajaxfiles/trade_edit', {
      trade_id,
      trade_rate,
      trade_lot,
      trade_qty,
      device_type,
      ...getDefaultParams(), // Optional: add auth tokens, etc., if required
    });

    return response.data;
  } catch (error) {
    console.error('Error in updating trade:', error);
    throw error;
  }
};

export const deleteTrade = async ({ trade_id, password = '', device_type = 0 }) => {
  try {
    const response = await axiosInstance.post('ajaxfiles/trade_delete', {
      trade_id,
      password,
      device_type,
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
};
