import axios from "axios";
import { fetchClient } from "./fetchconfig";
import axiosInstance from "./axiosconfig";

import { constant, forex_market_type_id } from "../Watchlist/constant";


async function getDefaultParams() {
  const { ip_address, user_agent } = await getUserInfo();
  const dataStored = JSON.parse(sessionStorage.getItem("data"));
  return {
    is_app: "1",
    login_user_id: dataStored?.user_id,
    auth_key: dataStored?.auth_key,
    ip_address,
    user_agent
  }
}

const eee = {
  // "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  // "ip_address": "116.74.117.150",
  "is_app": "1",
  "login_user_id": "41297",
  "auth_key": "9QA0wn7z6W",
  "market_type_id": "4",
  "script_id": "7895546",
  "script_expiry_id": "27287",
  "trade_rate": "33",
  "trade_qty": "22",
  "trade_lot": "11",
  "trade_type": 0,
  "trade_type_x": 1,
  "check_script_name": "NASDAQ",
  "device_type": 0
}

const rrr = {
  "auth_key": "{{auth_key}}",
  "is_app": "1",
  "login_user_id": "{{user_id}}",
  "market_type_id": "1",
  "script_id": "2",
  "script_expiry_id": "27745",
  "trade_rate": 113300,
  "trade_qty": 30,
  "trade_lot": 1,
  "trade_type": 0,
  "trade_type_x": "0", // buy sell
  "check_script_name": "SILVER-I",
  "device_type": 0,
  "user_id": "41297"  // backed fix
}

const getUserInfo = async () => {
  try {
    // Get IP Address
    const ipRes = await axios.get("https://api.ipify.org?format=json");
    const ip_address = ipRes.data.ip;
    const user_agent = navigator.userAgent;

    return { ip_address, user_agent };
  } catch (err) {
    console.error("Error fetching IP/UserAgent:", err);
    return { ip_address: null, user_agent: navigator.userAgent };
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

export const fetchforexOrdersAPI = async ({
  userId,
  authKey,
  filterType = "today",
  searchValue = "",
  currentPage = 0,
  pageSize = 10000,
  end_date = "",
  start_end = "",
  marketId = "",
  scriptIds = "",
  brokerId = "",
  masterUserId = "",
  clientId = "",
  status = "",
  orderType = ""
}) => {
  const formData = {
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchValue,
    is_app: 1,
    login_user_id: userId,
    auth_key: authKey,
    isTodayTrade: filterType === "today" ? "today" : "",
    end_date,
    start_end,
    market_type_id: marketId || "",
    script_id: scriptIds,
    broker_id: brokerId || "",
    master_user_id: masterUserId || "",
    user_id: clientId || "",
    is_pending: status === "is_pending" ? "is_pending" : "",
    is_executed: status === "is_executed" ? "is_executed" : "",
    trade_type: orderType || "",
  };

  console.log("Forex API formData:", formData); // debug

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_forex", formData);
    return data;
  } catch (error) {
    console.error("Error fetching forex orders:", error);
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
  pageSize,
  currentPage,
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
      sSearch: searchQuery,

      iDisplayStart: currentPage * pageSize,
      iDisplayLength: pageSize,

      // market_type_id: marketId,
      // script_id: scriptId,
      // user_id: clientId,
      // master_user_id: masterId,

      // end_date: end_date,
      // start_date: start_date,
    });

    return response.data || [];
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
  const defaultParams = await getDefaultParams();
  const response = await axiosInstance.post('ajaxfiles/get_option_strike_price', {
    ...defaultParams,
    expiry_id,
    term,
  });

  // console.log('response.data', response.data);

  return response.data?.data || [];
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
  const defaultParams = await getDefaultParams();

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
    ...defaultParams
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

export const forexcloseAllPositions = async ({
  password,
  market,
  script,
  client,
  master,
  broker,
  exparyDate,
}) => {
  const defaultParams = await getDefaultParams();

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
    ...defaultParams
  };

  try {
    const res = await axiosInstance.post('ajaxfiles/trade_exit_all_position1_forex', {
      ...defaultParams,
      ...payload,
    });

    if (res.data.success) {
      return res.data;
    } else {
      throw new Error(res.data.message || 'Failed to close positions');
    }
  } catch (err) {
    console.error('Error in forexcloseAllPositions:', err.message || err);
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
  const defaultParams = await getDefaultParams();

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

function isChanged(apiData) {
  const data = sessionStorage.getItem('notification');
  // console.log('JSON.stringify(apiData) == data', JSON.stringify(apiData) == data)
  // console.log('data', data)
  // console.log('aaaa', JSON.stringify(apiData))
  if (JSON.stringify(apiData) == data) {
    return;
  } else {
    window.location.href !== "http://localhost:3000/login" ? window.location.reload() : null;
  }
}

export const checkLoginAPI = async () => {
  // console.log("checkLoginAPI..............")
  const defaultParams = await getDefaultParams();
  if (!(defaultParams.auth_key || defaultParams.login_user_id)) return;
  try {
    const response = await axiosInstance.post("/ajaxfiles/check_login", { ...defaultParams });
    // console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error("Error in checkLogin:", error);
    throw error;
  }
};

export const fetchNotificationAPI = async () => {
  const defaultParams = await getDefaultParams();
  if (!(defaultParams?.auth_key || defaultParams?.login_user_id)) return;
  // console.log("fetchNotificationAPI.........");
  try {
    const response = await axiosInstance.post("/ajaxfiles/setting/fetch_notification", { ...defaultParams });
    // console.log('response.data', response.data);
    isChanged(response.data);
    sessionStorage.setItem('notification', JSON.stringify(response.data));
  } catch (error) {
    console.error("Error in checkLogin:", error);
    throw error;
  }
};

// stored in sessionstorage > first_password_changed === 0 > navigate to changePassword

export const getWatchListDataAPI = async () => {
  try {
    const defaultParams = await getDefaultParams();
    const response = await axiosInstance.post('ajaxfiles/market_watch_list1', { ...defaultParams });
    return response.data;
  } catch (error) {
    console.error('Error in getting watchlist data:', error);
    throw error;
  }
}

export async function getMarketWatchFilterAPI() {
  const defaultParams = await getDefaultParams();
  try {
    const response = await axiosInstance.post('/ajaxfiles/get_market_watch_filter2', { ...defaultParams });
    return response.data;
  } catch (error) {
    console.error('getMarketWatchFilterAPI error:', error);
    throw error;
  }
}

export async function getMarketWiseScriptForexAPI(marketId) {
  const defaultParams = await getDefaultParams();
  try {
    const response = await axiosInstance.post('/ajaxfiles/get_market_wise_script_forex', { ...defaultParams, market_type_id: marketId });
    return response.data;
  } catch (error) {
    console.error('getMarketWiseScriptForexAPI error:', error);
    throw error;
  }
}

export async function getScriptWiseExpiryForexAPI(marketId, scriptId) {
  const defaultParams = await getDefaultParams();
  try {
    const response = await axiosInstance.post('/ajaxfiles/get_script_wise_expiry_forex', {
      ...defaultParams,
      market_type_id: marketId,
      script_id: scriptId,
    });
    return response.data;
  } catch (error) {
    console.error('getMarketWiseScriptForexAPI error:', error);
    throw error;
  }
}

export const getForexWatchListDataAPI = async () => {
  // console.log("getForexWatchListDataAPI getForexWatchListDataAPI")
  try {
    const defaultParams = await getDefaultParams();
    const response = await axiosInstance.post('ajaxfiles/market_watch_list_forex', { ...defaultParams });
    return response.data;
  } catch (error) {
    console.error('Error in getting watchlist data:', error);
    throw error;
  }
}

export const addPosition = async (payload) => {
  try {
    const defaultParams = await getDefaultParams();
    // const response = await axiosInstance.post('ajaxfiles/setting/set_user_type_qty_single', { ...defaultParams, ...payload });
    return response.data;
  } catch (error) {
    console.error('Error in Add Postion data:', error);
    throw error;
  }
}

export const updateTrade = async ({ trade_id, trade_rate, trade_lot, trade_qty, device_type = 0 }) => {
  try {
    const defaultParams = await getDefaultParams();
    const response = await axiosInstance.post('ajaxfiles/trade_edit', {
      trade_id,
      trade_rate,
      trade_lot,
      trade_qty,
      device_type,
      ...defaultParams, // Optional: add auth tokens, etc., if required
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


export const getForexOrders = async (userId, authKey) => {
  try {
    const response = await axiosInstance.post("datatables/position_book_list_forex", {
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

export const fetchforexTradesDataAPI = async (userId, authKey, scriptId) => {
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
    const { data } = await axiosInstance.post("/datatables/order_book_forex", formData);
    return data?.aaData || [];
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return [];
  }
};


export const fetchSummaryReportAPI = async (user_id, master_user_id, broker_id, end_date, start_end, market_type_id, script_id, valan_id) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    broker_id,
    master_user_id,
    user_id,
    end_date,
    start_end,
    market_type_id,
    script_id,
    valan_id,
  };

  try {
    const { data } = await axiosInstance.post("ajaxfiles/summary_report", formData);
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch summary report:", error);
    return [];
  }
};

export const fetchforexSummaryReportAPI = async (user_id, master_user_id, broker_id, end_date, start_end, market_type_id, script_id, valan_id) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    broker_id,
    master_user_id,
    user_id,
    end_date,
    start_end,
    market_type_id,
    script_id,
    valan_id,
  };

  try {
    const { data } = await axiosInstance.post("ajaxfiles/summary_report_forex", formData);
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch summary report:", error);
    return [];
  }
};

export const fetchMarginManagementListAPI = async (userId, authKey, client, master, broker) => {
  if (!userId || !authKey) return [];

  const formData = {
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
    broker_id: broker?.id,
    master_user_id: master?.id,
    user_id: client?.id,
  };

  try {
    const { data } = await axiosInstance.post("ajaxfiles/margin_management_list", formData);
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch margin management list:", error);
    return [];
  }
};

export const fetchUserlistingAPI = async (currentPage, rowsPerPage, tradeAfter, tradeBefore, loginBefore, loginAfter, broker, master, user, status, searchText) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * rowsPerPage,
    iDisplayLength: rowsPerPage,
    sSearch: searchText || "",
    loginBefore,
    loginAfter,
    tradeBefore,
    tradeAfter,
    broker,
    master,
    user,
    status,
  };

  try {
    const { data } = await axiosInstance.post("datatables/user_list_key", formData);

    return data || [];
  } catch (error) {
    console.error("Failed to fetch  list:", error);
    return [];
  }
};

export const fetchforexMarginManagementListAPI = async (userId, authKey, client, master, broker) => {
  if (!userId || !authKey) return [];

  const formData = {
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
    broker_id: broker?.id,
    master_user_id: master?.id,
    user_id: client?.id,
  };

  try {
    const { data } = await axiosInstance.post("ajaxfiles/margin_management_forex_list", formData);
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch margin management list:", error);
    return [];
  }
};


export const fetchLedgerDetailsAPI = async (userId) => {
  const dataStored = JSON.parse(sessionStorage.getItem("data"));

  const payload = {
    is_app: '1',
    login_user_id: dataStored?.user_id,
    auth_key: dataStored?.auth_key,
    user_id: userId,
  };

  try {
    const response = await axios.post(
      'http://128.199.126.171/~goldorg/ajaxfiles/get_user_valan_wise_bill',
      payload
    );

    if (response.data.status === 'ok' && Array.isArray(response.data.data)) {
      // Filter out "Opening Balance" if needed
      const filtered = response.data.data.filter(item => item.valan_name !== 'Opening Balance');
      return filtered; // return the filtered data
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error fetching ledger details:', err);
    return [];
  }
};


export const tradePlaceAPI = async (dataObj) => {
  console.log('dataObj', dataObj);
  const defaultParams = await getDefaultParams();
  const payload = {
    ...defaultParams,
    market_type_id: dataObj.market_type_id,
    script_id: dataObj.id,
    script_expiry_id: dataObj.script_expiry_id,
    trade_rate: dataObj.price,
    trade_qty: dataObj.qty,
    trade_lot: dataObj.lot,
    trade_type: dataObj.market, // market, lot ,.. > market price has value and disablabled
    trade_type_x: dataObj.tradeType, // buy sell
    check_script_name: dataObj.script_name,
    // user_id: , // or pass as `params.user_id`  ERROR: IF DOESN'T SEND IT THEN GIVE ERROR IN POST MAN
    device_type: 0,
  };
  console.log('payload', payload);

  try {
    const response = await axiosInstance.post('/ajaxfiles/trade_place', payload);
    console.log('Trade response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in tradePlaceAPI:', error);
    throw error;
  }
};




export const addMarketScriptAPI = async ({
  market_type_id,
  script_id,
  script_expiry_id,
  expiryTerm,
  type,
  strickObj,
  // isForex = false
}) => {
  const defaultParams = await getDefaultParams();
  let payload;
  if (String(market_type_id) === constant) {
    payload = {
      market_type_id,
      script_id,
      script_expiry_id: `${script_expiry_id}-${expiryTerm}`,
      script_expiry_type: strickObj.check_script_name,
      script_expiry_orginal_formate: `${strickObj.rate} ${type}`
    }
  } else if (market_type_id == forex_market_type_id) {
    payload = {
      market_type_id,
      script_id,
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
    const res =
      market_type_id == forex_market_type_id
        ? await axiosInstance.post('ajaxfiles/add_market_watch_forex', { ...defaultParams, ...payload })
        : await axiosInstance.post('ajaxfiles/add_market_watch', { ...defaultParams, ...payload });

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

export async function removeMarketWatchAPI(market_watch_id) {
  const defaultParams = await getDefaultParams();
  try {
    const response = await axiosInstance.post('ajaxfiles/remove_market_watch', { ...defaultParams, market_watch_id })
    console.log('response.data', response.data);
  } catch (err) {
    console.log('err', err);
  }
}

export async function favouriteActionAPI(market_watch_id, action_type) {
  const defaultParams = await getDefaultParams();
  try {
    const response = await axiosInstance.post('ajaxfiles/favourite_upde', { ...defaultParams, market_watch_id, action_type })
    console.log('response.data', response.data);
    return response.data;
  } catch (err) {
    console.log('err', err);
  }
}


export const fetchValanNamesApi = async (term) => {
  try {
    const defaultParams = await getDefaultParams();
    const response = await axios.post("http://128.199.126.171/~goldorg/ajaxfiles/get_valan_name_search", { ...defaultParams, term },
    );
    return response.data.results
  } catch (err) {
    console.error("Error fetching Valan IDs:", err);
    return [];
  }
};

// export const fetchLedgerDetailsApi = async (user_id, dataStored) => {
//   const defaultParams = await getDefaultParams();

//   try {
//     const response = await axios.post('http://128.199.126.171/~goldorg/ajaxfiles/get_user_valan_wise_bill', {
//       ...defaultParams,
//       user_id,
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching ledger details:', error);
//     throw error;
//   }
// };

export const fetchMasterlistingAPI = async (
  currentPage,
  rowsPerPage,
  start_end,
  end_date,
  loginBefore,
  loginAfter,
  broker,
  master,
  // user,
  status,
  searchText
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * rowsPerPage,
    iDisplayLength: rowsPerPage,
    sSearch: searchText || "",
    loginBefore,
    loginAfter,
    end_date,
    start_end,
    broker,
    master,
    // user,
    status,
  };

  try {
    const { data } = await axiosInstance.post("datatables/master_list_key", formData);

    return data || [];
  } catch (error) {
    console.error("Failed to fetch  list:", error);
    return [];
  }
};