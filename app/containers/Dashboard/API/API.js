import axios from "axios";
import { fetchClient } from "./fetchconfig";
import axiosInstance from "./axiosconfig";

import { constant, forex_market_type_id } from "../Watchlist/constant";

async function getDefaultParams() {
  const dataStored = JSON.parse(sessionStorage.getItem("data"));
  const { ip_address, user_agent } = await getUserInfo();
  const { isEmployeeLogin, isEmployeeLoginId, login_string } = dataStored;

  const emp_para = { isEmployeeLogin, isEmployeeLoginId, login_string };

  return {
    is_app: "1",
    login_user_id: dataStored?.user_id,
    auth_key: dataStored?.auth_key,
    ip_address,
    user_agent,
    ...(isEmployeeLogin ? emp_para : {})
  }
}

export const changePasswordApi = async (api, current_password, new_password, confirm_password) => {
  const defaultParams = await getDefaultParams();
  try {
    const { data } = await axiosInstance.post(`/${api}`, { ...defaultParams, current_password, new_password, confirm_password });
    return data;
  } catch (err) {
    console.error("Error fetching in changePassword:", err);
  }
};

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
    isTodayTrade: type,
  };

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_new", formData);
    return data.aaData || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


export const fetcholdOrdersAPI = async (userId, authKey, searchValue = "") => {
  const formData = {
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10000,
    sSearch: searchValue,
    is_app: 1,
    login_user_id: userId,
    auth_key: authKey,

  };

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_old", formData);
    return data.aaData || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


export const fetcholdforexOrdersAPI = async (userId, authKey, searchValue = "") => {
  const formData = {
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10000,
    sSearch: searchValue,
    is_app: 1,
    login_user_id: userId,
    auth_key: authKey,
  };

  try {
    const { data } = await axiosInstance.post("/datatables/order_book_forex_old", formData);
    return data.aaData || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};


export const fetchOrders1API = async ({
  userId,
  authKey,

  start_end = "",
  end_date = "",
  script_full_name = "",
  tradeType = ""
}) => {
  const formData = {
    sEcho: 1,
    iDisplayStart: 0,
    iDisplayLength: 10,
    is_app: 1,
    login_user_id: userId,
    auth_key: authKey,

    start_end,
    end_date,
    script_full_name,
    tradeType
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

      isTodayTrade: filterType,
      sSearch: searchQuery,

      sEcho: 1,
      iDisplayStart: currentPage * pageSize,
      iDisplayLength: pageSize,

      market_type_id: marketId,
      script_id: scriptId,
      user_id: clientId,
      master_user_id: masterId,

      end_date: end_date,
      start_date: start_date,
    });

    return response.data || [];
  } catch (error) {
    console.error("Error fetching rejection logs:", error);
    return [];
  }
};


export const fetchOrderlimitAPI = async (
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
    const response = await axiosInstance.post("datatables/client_order_limit_list", {
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

export const fetchBlockedAllowedAPI = async (
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
    const response = await axiosInstance.post("ajaxfiles/setting/list_client_block_script_list", {
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


export const fetchTopGainersLosersAPI = async (userId, authKey) => {
  if (!userId || !authKey) return { topGainers: [], topLosers: [] };

  const formData = {
    is_app: "1",
    login_user_id: userId,
    auth_key: authKey,
  };

  try {
    const { data } = await axiosInstance.post(
      "/ajaxfiles/top_gainers_losers.php",
      formData
    );

    if (data?.status === "ok") {
      return {
        topGainers: data.topGainers || [],
        topLosers: data.topLosers || [],
      };
    }

    return { topGainers: [], topLosers: [] };
  } catch (error) {
    console.error("❌ Failed to fetch top gainers/losers:", error);
    return { topGainers: [], topLosers: [] };
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
    // window.location.href !== "http://localhost:3000/login" ? window.location.reload() : null;
  }
}

export const checkLoginAPI = async (isJustLogin, user_id, auth_key) => {
  // console.log("REMAIN THIS CONSOLE LOG HERE, OTHERWISE SOMETIMES THIS API IS NOT CALLED");
  let defaultParams = await getDefaultParams();

  // console.log('beofre isJustLogin defaultParams', defaultParams);
  if (isJustLogin) {
    // console.log("inside isJustLogin");
    defaultParams = { ...defaultParams, login_user_id: user_id, auth_key }
    // console.log('defaultParams', defaultParams);
  }
  // console.log('after isJustLogin defaultParams', defaultParams);
  if (!(defaultParams?.auth_key || defaultParams?.login_user_id)) {
    // console.log("cannt get defaultParams");
    return
  };
  // console.log("if (!(defaultParams?.auth_key || defaultParams?.login_user_id)) return;")
  try {
    const response = await axiosInstance.post("/ajaxfiles/check_login", { ...defaultParams });
    // console.log('check_login==', response.data);
    return response.data;
  } catch (error) {
    console.error("Error in checkLogin:", error);
    throw error;
  }
};

export const fetchNotificationAPI = async (isJustLogin, user_id, auth_key) => {
  let defaultParams = await getDefaultParams();
  // console.log("fetchNotificationAPI.........");
  if (isJustLogin) {
    defaultParams = { ...defaultParams, login_user_id: user_id, auth_key }
  }
  if (!(defaultParams?.auth_key || defaultParams?.login_user_id)) return;

  try {
    const response = await axiosInstance.post("/ajaxfiles/setting/fetch_notification", { ...defaultParams });
    // isChanged(response.data);
    return response.data;
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
    // Retrieve user credentials from sessionStorage
    const rawData = sessionStorage.getItem("data");
    if (!rawData) {
      throw new Error("User data not found in sessionStorage.");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawData);
    } catch (err) {
      throw new Error("Failed to parse user data from sessionStorage.");
    }

    const userId = parsedData.user_id;
    const authKey = parsedData.auth_key;

    if (!userId || !authKey) {
      throw new Error("User credentials are missing.");
    }

    const response = await axiosInstance.post('ajaxfiles/trade_delete', {
      is_app: "1",
      login_user_id: userId,
      auth_key: authKey,
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

export const fetchSelfplAPI = async (user_id, master_user_id, broker_id, end_date, start_end, market_type_id, script_id, valan_id) => {
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
    const { data } = await axiosInstance.post("ajaxfiles/self_profit_and_loss_report", formData);
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


// export const fetchLedgerDetailsAPI = async (userId) => {
//   const dataStored = JSON.parse(sessionStorage.getItem("data"));

//   const payload = {
//     is_app: '1',
//     login_user_id: dataStored?.user_id,
//     auth_key: dataStored?.auth_key,
//     user_id: userId,
//   };

//   try {
//     const response = await axios.post(
//       'http://128.199.126.171/~goldorg/ajaxfiles/get_user_valan_wise_bill',
//       payload
//     );

//     if (response.data.status === 'ok' && Array.isArray(response.data.data)) {
//       // Filter out "Opening Balance" if needed
//       const filtered = response.data.data.filter(item => item.valan_name !== 'Opening Balance');
//       return filtered; // return the filtered data
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.error('Error fetching ledger details:', err);
//     return [];
//   }
// };


export const tradePlaceAPI = async (dataObj) => {
  const dataStored = JSON.parse(sessionStorage.getItem("data"));
  console.log('dataObj', dataObj);
  const defaultParams = await getDefaultParams();
  const payload = {
    ...defaultParams,
    device_type: 0,

    market_type_id: dataObj.market_type_id,
    script_id: dataObj.script_id,
    script_expiry_id: dataObj.script_expiry_id,
    trade_rate: dataObj.price,
    trade_qty: dataObj.qty,
    trade_lot: dataObj.lot,
    trade_type: dataObj.market, // market, lot ,stock loss.. > market price has value and disablabled
    trade_type_x: dataObj.tradeType, // buy sell
    check_script_name: dataObj.script_expiry_type ? `${dataObj.script_name}-${dataObj.script_expiry_type}` : dataObj.script_name, // HOW THIS SHOULD BE SET
    user_id: (dataStored?.user_type != 1 && dataStored?.user_type != 2) ? dataObj.client.id : undefined,
  };
  console.log('payload', payload);

  const errorPayload = {
    "auth_key": "6tjC7iHdYZ",
    "is_app": "1",
    "login_user_id": "41296",
    "market_type_id": "1",
    "script_id": "2",
    "script_expiry_id": "27745",
    "trade_rate": 113300,
    "trade_qty": 30,
    "trade_lot": 1,
    "trade_type": 0, // market, lot, stock
    "trade_type_x": "0", // buy sell
    "check_script_name": "SILVER-I",
    "device_type": 0,
    "user_id": "41297"
  }

  try {
    const response = await axiosInstance.post('/ajaxfiles/trade_place', payload);
    // const response = await axiosInstance.post('/ajaxfiles/trade_place', errorPayload);
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

export const fetchEmployeelistingAPI = async (currentPage, rowsPerPage, tradeAfter, tradeBefore, broker, master, user, status, searchText) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * rowsPerPage,
    iDisplayLength: rowsPerPage,
    sSearch: searchText || "",
    tradeBefore,
    tradeAfter,
    broker,
    master,
    user,
    status,
  };

  try {
    const { data } = await axiosInstance.post("datatables/employee_list_key", formData);

    return data || [];
  } catch (error) {
    console.error("Failed to fetch  list:", error);
    return [];
  }
};

export const fetchMasterlistingAPI = async (
  currentPage,
  rowsPerPage,
  joinAfter,
  joinBefore,
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
    joinBefore,
    joinAfter,
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

export const fetchBrokerlistingAPI = async (
  currentPage,
  rowsPerPage,
  joinAfter,
  joinBefore,
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
    joinAfter,
    joinBefore,
    broker,
    master,
    // user,
    status,
  };

  try {
    const { data } = await axiosInstance.post("datatables/broker_list2", formData);

    return data || [];
  } catch (error) {
    console.error("Failed to fetch  list:", error);
    return [];
  }
};

// utility function for API call
export const tradeEditDeleteLogLogsAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/trade_log_view.php", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const tradeAutosquareofAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/auto_closed_report", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const MtmalertsAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/mtm_alert_top20", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const ipaddresslogAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/same_ip_list", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const cashledgerAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/cash_ledger_list", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const cashEntryAPI = async (
  currentPage,
  pageSize = 10,
  searchText = '',
  user_type = '',
  user_id = '',
  start_date = '',
  end_date = '',
  cash_add = '',
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    user_type,
    user_id,
    start_date,
    end_date,

    cash_add,
  };

  try {
    const response = await axiosInstance.post("datatables/cash_ledger_list", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const JVEntryAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  date,       // must match backend
  date_to,    // must match backend
  is_deleted,
  is_updated,
  is_admin,
  cash_add
) => {
  const defaultParams = await getDefaultParams(); // should include is_app, login_user_id, auth_key

  const formData = {
    ...defaultParams,   // contains: is_app, login_user_id, auth_key
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    date,      // ✅ correct key
    date_to,   // ✅ correct key

    is_deleted,
    is_updated,
    is_admin,
    cash_add,
  };

  try {
    const response = await axiosInstance.post("ajaxfiles/fetch_jv_entries", formData);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch JV entries:", error);
    throw error;
  }
};



export const BillfilterAPI = async ({
  currentPage,
  pageSize = 10,
  term = "",
  // sSearch = "",

  valan_id = valanId?.id,
  amount = "",
  start_date = "",
  end_date = "",
  market_type_id = "",
  user_id = "",
  broker_user_id = "",
  master_user_id = "",
}) => {
  //{"master_user_id":"","broker_user_id":"","valan_id":"2025-08-18","market_type_id":"","user_id":"","start_date":"","end_date":"","amount":17000}
  try {
    const defaultParams = await getDefaultParams();

    const payload = {
      ...defaultParams,
      sEcho: 1,
      iDisplayStart: currentPage * pageSize,
      iDisplayLength: pageSize,
      term,
      //  

      master_user_id,
      broker_user_id,
      valan_id,
      market_type_id,
      user_id,
      start_date,
      end_date,
      amount,
      term,
    };

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/bill_filter_amount_wise",
      payload
    );

    // ✅ Return the actual array of logs
    return response.data || [];
  } catch (err) {
    console.error("Error fetching Valan IDs:", err);
    return [];
  }
};

export const CrosstradelogAPI = async ({
  currentPage,
  pageSize = 10,
  valan_id,
  start_date = "",
  end_date = "",
  market_type_id = "",
  script_id,
  user_id = "",
  broker_user_id = "",
  master_user_id = "",
  term = "",
}) => {
  try {
    const defaultParams = await getDefaultParams();

    const payload = {
      ...defaultParams,
      sEcho: 1,
      iDisplayStart: currentPage * pageSize,
      iDisplayLength: pageSize,
      term,

      valan_id,
      market_type_id,
      script_id,
      user_id,
      master_user_id,
      broker_user_id,
      start_date,
      end_date,
    };

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/cross_trade_data",
      payload
    );


    return response.data || [];
  } catch (err) {
    console.error("Error fetching Valan IDs:", err);
    return [];
  }
};

export const tradeEditLoglistAPI = async (
  currentPage,
  pageSize,
  searchText,
  master,
  client,
  end_date,
  start_date,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/user_edit_log_list", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const editDeleteLogLogsAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
  is_admin,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
    is_admin,
  }

  try {
    const response = await axiosInstance.post("datatables/trade_log_view.php", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const ValanLogsAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,
  }

  try {
    const response = await axiosInstance.post("ajaxfiles/setting/list_valan_master", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const editDeleteoldLogsAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
  }

  try {
    const response = await axiosInstance.post("datatables/trade_log_view_old", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const CasheditDeleteLogsAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
  }

  try {
    const response = await axiosInstance.post("datatables/cash_ledger_log_list", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const manualtradesAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,

    market_type_id: market?.id,
    script_id: scriptIds,
    master_user_id: master?.id,
    user_id: client?.id,

    end_date,
    start_date,

    is_deleted,
    is_updated,
  }

  try {
    const response = await axiosInstance.post("datatables/order_book_manual", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const bulktradingAPI = async ({
  currentPage,
  pageSize = 10,
  sSearch = '',
  master_user_id = '',
  broker_user_id = '',
  market_type_id = '',
  script_id = '',
  user_id = '',
  start_date = '',
  end_date = '',
  noOfTrades = '',
}) => {
  const defaultParams = await getDefaultParams();

  const payload = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch,

    master_user_id,
    broker_user_id,
    market_type_id,
    script_id,
    user_id,
    start_date,
    end_date,
    noOfTrades
  };
  // {"master_user_id":"","broker_user_id":"","market_type_id":"","script_id":"","user_id":"","start_date":"","end_date":"","noOfTrades":2}
  try {
    const response = await axiosInstance.post('ajaxfiles/bulk_trading_report', payload);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return {
      status: 'error',
      data: [],
      minimum: 0,
      message: error.message || 'Something went wrong',
    };
  }
};



export const addAccountAPI = async (payload) => {
  const defaultParams = await getDefaultParams();

  try {
    const { data } = await axiosInstance.post("/ajaxfiles/create_user", { ...defaultParams, ...payload });
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return error;
  }
  // "status": "error",
  //   "message": "NCDS Intraday Minimum Upline Brokerage is 1",
};

export const getMarketScriptForAddAccountAPI = async () => {
  const defaultParams = await getDefaultParams();

  try {
    const { data } = await axiosInstance.post("/ajaxfiles/get_mcx_script_type", { ...defaultParams });
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return error;
  }
  // "status": "error",
  //   "message": "NCDS Intraday Minimum Upline Brokerage is 1",
};

console.log("API.js runn.......");
const apiCache = new Map();
export const fetchOptionsAPI = async (url, params) => {
  const key = `${url}:${JSON.stringify(params)}`;

  // If we already have cached response, return it
  if (apiCache.has(key)) {
    console.log("Returning cached response for:", key);
    return apiCache.get(key);
  }

  // Otherwise, call the API
  try {
    const { data } = await axiosInstance.post(url, params);

    // Save response in cache
    apiCache.set(key, data.results);

    return data.results;
  } catch (err) {
    console.error(`Error fetching from ${url}`, err);
    setter([]);
  }
};
export const fetchOptionsPriceOptionAPI = async (url, params) => {
  const key = `${url}:${JSON.stringify(params)}`;

  // If we already have cached response, return it
  if (apiCache.has(key)) {
    console.log("Returning cached response for:", key);
    return apiCache.get(key);
  }

  // Otherwise, call the API
  try {
    const { data } = await axiosInstance.post(url, params);

    // Save response in cache
    apiCache.set(key, data);

    return data;
  } catch (err) {
    console.error(`Error fetching from ${url}`, err);
    setter([]);
  }
};

export const fetchOptionsAPIManualScript = async (url, params) => {
  const key = `${url}:${JSON.stringify(params)}`;

  // If we already have cached response, return it
  if (apiCache.has(key)) {
    console.log("Returning cached response for:", key);
    return apiCache.get(key);
  }

  // Otherwise, call the API
  try {
    const { data } = await axiosInstance.post(url, params);
    console.log("datadata=", data);
    // Save response in cache
    apiCache.set(key, data);
    return data;
  } catch (err) {
    console.error(`Error fetching from ${url}`, err);
    setter([]);
  }
};

export const editAccountAPI = async (payload) => {
  const defaultParams = await getDefaultParams();

  try {
    const { data } = await axiosInstance.post("/ajaxfiles/edit_user", { ...defaultParams, ...payload });
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return error;
  }
};

export const getUserDetailsAPI = async (user_id) => {
  const defaultParams = await getDefaultParams();

  try {
    const { data } = await axiosInstance.post("/ajaxfiles/view_user_details", { ...defaultParams, user_id });
    return data || [];
  } catch (error) {
    console.error("Error fetching getUserDetails:", error);
    return error;
  }
};

export const getemployeeDetailsAPI = async (user_id) => {
  const defaultParams = await getDefaultParams();

  try {
    const { data } = await axiosInstance.post("/ajaxfiles/view_user_details_emp", { ...defaultParams, user_id });
    return data || [];
  } catch (error) {
    console.error("Error fetching getUserDetails:", error);
    return error;
  }
};

export const fetchPermissionsAPI = async () => {
  const dataStored = JSON.parse(sessionStorage.getItem("data"));
  try {
    const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};
    const payload = {
      is_app: 1,
      login_user_id: dataStored?.user_id || '',
      auth_key: dataStored?.auth_key || ''
    };

    const res = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_emp_permission",
      payload
    );

    if (res.data && Array.isArray(res.data.emp_per)) {
      return res.data.emp_per;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching permissions:", err);
    throw err;
  }
};

export const ScriptwiselotAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,
  }

  try {
    const response = await axiosInstance.post("ajaxfiles/setting/list_script_master", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const StopfuturelistAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,
  }

  try {
    const response = await axiosInstance.post("datatables/list_future_block", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};

export const ExpiryvalidationAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,
  }

  try {
    const response = await axiosInstance.post("ajaxfiles/setting/list_expiry_validation", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};


export const TimesettingAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated,
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,
  }

  try {
    const response = await axiosInstance.post("ajaxfiles/setting/list_start_end_time", formData);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};


export const NSEOPTmanageAPI = async (
  currentPage,
  pageSize,
  searchText,
  market,
  scriptIds,
  master,
  client,
  end_date,
  start_date,
  is_deleted,
  is_updated
) => {
  const defaultParams = await getDefaultParams();

  const formData = {
    ...defaultParams,
    sEcho: 1,
    iDisplayStart: currentPage * pageSize,
    iDisplayLength: pageSize,
    sSearch: searchText,
  };

  try {
    const response = await axiosInstance.post("datatables/option_block_list", formData);

    console.log("API raw response:", response.data); // debug

    // return aaData array inside data
    return response.data?.aaData || [];
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    throw error;
  }
};



// api.js

export const fetchPositionDataAPI = async ({
  user_id,
  auth_key,
  selectedMarket,
  selectedScripts,
  searchText,
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      market: selectedMarket?.name || "",
      scripts: selectedScripts.map((s) => s.name).join(","),
      sSearch: searchText.trim(),
    };

    console.log("🔍 Fetching with payload:", payload);

    const response = await fetch(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_script_wise_qty1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result; // return full response for flexibility
  } catch (err) {
    console.error("❌ API call failed", err);
    throw err;
  }
};


export const fetchBlockedScriptsAPI = async ({
  user_id,
  auth_key,
  selectedMarket,
  script,
  searchText,
  formatScriptIds,
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      market: selectedMarket?.name || "",
      script_id: formatScriptIds(script),
      search_text: searchText.trim(),
    };

    console.log("🔍 Fetching with payload:", payload);

    const response = await fetch(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/list_block_script.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    return await response.json();
  } catch (err) {
    console.error("❌ API call failed", err);
    throw err;
  }
};


export const confirmTradeAPI = async ({
  user_id,
  auth_key,
  broker,
  master,
  client,
  valanId,
  password,
}) => {
  try {
    const payload = {
      is_app: 1,
      login_user_id: user_id,
      auth_key,
      broker_id: broker?.id || "",
      master_id: master?.id || "",
      user_id: client?.id || "",
      valan_id: valanId?.id || "",
      password,
    };

    console.log("🔍 Confirm Trade Payload:", payload);

    const response = await fetch(
      "http://128.199.126.171/~goldorg/ajaxfiles/brokerage_refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return result; // return full response
  } catch (err) {
    console.error("❌ API call (Confirm Trade) failed", err);
    throw err;
  }
};


export const fetchBalanceAPI = async ({ user_id, auth_key, entryUserId }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      user_id: entryUserId,
    };

    console.log("🔍 Fetching Balance with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_ledger_balance",
      payload
    );

    return response.data; // return raw data so component can decide what to do
  } catch (err) {
    console.error("❌ API call (Fetch Balance) failed", err);
    throw err;
  }
};


export const fetchLedgerDetailsAPI = async ({ user_id, auth_key, targetUserId }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      user_id: targetUserId,
    };

    console.log("🔍 Fetching Ledger Details with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_user_valan_wise_bill",
      payload
    );

    return response.data; // return raw response for flexibility
  } catch (err) {
    console.error("❌ API call (Ledger Details) failed", err);
    throw err;
  }
};

export const fetchJVAPI = async ({ user_id, auth_key, start_date, end_date }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      date: start_date || "21-08-2025",
      date_to: end_date || "28-08-2025",
    };

    console.log("🔍 Fetching Logs with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/fetch_jv_entries",
      payload
    );

    return response.data; // return raw API response
  } catch (err) {
    console.error("❌ API call (Fetch Logs) failed", err);
    throw err;
  }
};


export const fetchLedgerAPI = async ({ user_id, auth_key, selectedUserId, filters }) => {
  try {
    const payload = {
      ...filters,
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      user_id: selectedUserId,
    };

    console.log("🔍 Fetching Ledger with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_valan_wise_ledger.php",
      payload
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Fetch Ledger) failed", err);
    throw err;
  }
};


export const fetchSportsLedgerAPI = async ({ user_id, auth_key }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      sEcho: 1,
      iDisplayStart: 0,
      iDisplayLength: 100,
      sSearch: "",
    };

    console.log("🔍 Fetching Sports Ledger with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/datatables/cricket_account_statement",
      payload
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Sports Ledger) failed", err);
    throw err;
  }
};


export const updateCnbcLinkAPI = async ({ user_id, auth_key, link }) => {
  try {
    const payload = {
      link,
      is_app: 1,
      login_user_id: user_id,
      auth_key,
    };

    console.log("🔍 Updating CNBC link with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/update_cnbc",
      payload
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Update CNBC Link) failed", err);
    throw err;
  }
};


export const fetchLedgerReportAPI = async ({ user_id, auth_key, filters }) => {
  try {
    const payload = {
      ...filters,
      is_app: "1",
      login_user_id: user_id,
      auth_key,
    };

    console.log("🔍 Fetching Ledger Report with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/ledger_report",
      payload
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Ledger Report) failed", err);
    throw err;
  }
};


export const uploadUserTypeQtyAPI = async ({ user_id, auth_key, file }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("login_user_id", user_id);
    formData.append("auth_key", auth_key);

    console.log("🔍 Uploading file:", file.name);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/upload_user_type_qty",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Upload User Type Qty) failed", err);
    throw err;
  }
};


export const confirmTradeManualAPI = async ({
  user_id,
  auth_key,
  password,
  trade_date,
  addMarket,
  addScript,
  lot,
  quantity,
  price,
  pair,
  addClient,
}) => {
  try {
    const scriptArray = Array.isArray(addScript) ? addScript : [addScript];

    const payload = {
      is_app: 1,
      login_user_id: user_id,
      auth_key,
      password: password || "",
      trade_date,
      high_low: 0,
      market_type_id: addMarket?.id || "",
      device_type: 0,
      script_id: scriptArray[0]?.value || "",
      script_expiry_id: scriptArray[0]?.script_expiry_id || "",
      trade_lot: lot || 1,
      trade_qty: quantity || 0,
      trade_rate: price || 0,
      trade_type: pair === "buy" ? 1 : 0,
      with_broker: 1,
      check_script_name: scriptArray.map((s) => s.script_name).join(","),
      user_id: addClient?.id || user_id || "",
    };

    console.log("🔍 Submitting manual trade with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/trade_manual",
      payload
    );

    return response.data; // return API response
  } catch (err) {
    console.error("❌ API call (Manual Trade) failed", err);
    throw err;
  }
};


export const updateMarqueeMessageAPI = async ({ user_id, auth_key, message }) => {
  try {
    const payload = {
      message,
      is_app: 1,
      login_user_id: user_id,
      auth_key,
    };

    console.log("🔍 Updating Marquee Message with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/marquee_add",
      payload
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Update Marquee Message) failed", err);
    throw err;
  }
};

export const uploadUserTypeQtyMasterAPI = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("🔍 Uploading CSV file:", file.name);

    const response = await fetch(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/upload_user_type_qty_master",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data; // return API response
  } catch (err) {
    console.error("❌ API call (Upload CSV) failed", err);
    throw err;
  }
};

export const fetchScriptQtyListAPI = async ({
  user_id,
  auth_key,
  currentPage = 0,
  pageSize = 10,
  searchText = "",
  selectedUserLevel,
  marketName,
  scriptName,
  positionLimit,
  minOrder,
  maxOrder,
  minBet,
  maxBet,
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      sEcho: 1,
      iDisplayStart: currentPage * pageSize,
      iDisplayLength: pageSize,
      sSearch: searchText,
      user_level: selectedUserLevel,
      market_name: marketName,
      script_name: scriptName,
      position_limit: positionLimit,
      min_order: minOrder,
      max_order: maxOrder,
      min_bet: minBet,
      max_bet: maxBet,
    };

    console.log("🔍 Fetching Script Qty List with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/datatables/script_qty_list",
      payload
    );

    return response.data; // return full API response
  } catch (err) {
    console.error("❌ API call (Script Qty List) failed", err);
    throw err;
  }
};


export const fetchUserLevelsAPI = async ({ user_id, auth_key }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
    };

    console.log("🔍 Fetching user levels with payload:", payload);

    const res = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_user_level",
      payload
    );

    return Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
  } catch (err) {
    console.error("❌ API call (User Levels) failed", err);
    throw err;
  }
};

// 🔹 Fetch filters (markets + scripts)
export const fetchMarketWatchFiltersAPI = async ({ user_id, auth_key }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
    };

    console.log("🔍 Fetching Market Watch Filters with payload:", payload);

    const res = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/get_market_watch_filter",
      payload
    );

    return res.data || {};
  } catch (err) {
    console.error("❌ API call (Market Watch Filters) failed", err);
    throw err;
  }
};

export const addNotificationAPI = async ({ user_id, auth_key, user_type, title, message }) => {
  try {
    const payload = {
      is_app: 1,
      login_user_id: user_id,
      auth_key,
      user_type,
      title,
      message,
    };

    console.log("🔍 Adding notification with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/add_notification",
      payload
    );

    return response.data; // return API response
  } catch (err) {
    console.error("❌ API call (Add Notification) failed", err);
    throw err;
  }
};


export const removeBlockOptionExpiryAPI = async ({ script_expiry_option_id }) => {
  try {
    const payload = {
      script_expiry_option_id,
      is_block: 0,
    };

    console.log("🔍 Removing block option with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/add_block_option_expiry",
      payload
    );

    return response.data; // return API response
  } catch (err) {
    console.error("❌ API call (Remove Block Option) failed", err);
    throw err;
  }
};

export const addClientOrderLimitAPI = async ({
  user_id,
  auth_key,
  market_type_id,
  script_id,
  client_user_id,
  master_user_id,
  price_percent,
  value,
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      market_type_id,
      script_id,
      user_id: client_user_id,
      master_user_id,
      price_percent,
      value,
    };

    console.log("🔹 Sending payload to add_client_order_limit:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/add_client_order_limit",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Add Client Order Limit) failed", err);
    throw err;
  }
};

// 🔹 Delete client order limit
export const deleteClientOrderLimitAPI = async ({ user_id, auth_key, client_order_id }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      client_order_id,
    };

    console.log("🔹 Sending payload to delete_client_order_limit:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/delete_client_order_limit",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Delete Client Order Limit) failed", err);
    throw err;
  }
};

export const deleteFutureTradingBlockAPI = async ({ future_id, user_id, auth_key }) => {
  try {
    const payload = {
      future_id,
      login_user_id: user_id,
      auth_key,
      is_app: 1,
    };

    console.log("🔍 Deleting future trading block with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/setting/remove_future_trading_block",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Delete Future Trading Block) failed", err);
    throw err;
  }
};


export const fetchBulkTradeListAPI = async ({ user_id, auth_key, noOfTrades }) => {
  try {
    const payload = { user_id, auth_key, noOfTrades };
    console.log("🔍 Fetching bulk trade list with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/datatables/bulk_trade_list",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Bulk Trade List) failed", err);
    throw err;
  }
};

// 🔹 Save/update bulk trading settings
export const saveBulkTradingSettingsAPI = async ({ user_id, auth_key, noOfTrades }) => {
  try {
    const payload = {
      user_id,
      auth_key,
      no_of_trade: noOfTrades,
    };

    console.log("🔍 Saving bulk trading settings with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_bulk_trading",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Save Bulk Trading Settings) failed", err);
    throw err;
  }
};

export const addClientBlockScriptAPI = async ({
  user_id,
  auth_key,
  market_type_id,
  script_id,
  client_user_id,
  master_user_id,
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      market_type_id,
      script_id,
      user_id: client_user_id,
      master_user_id,
    };

    console.log("🔹 Adding client block script with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_client_block_script_setting",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Add Client Block Script) failed", err);
    throw err;
  }
};

// 🔹 Delete client block script setting
export const deleteClientBlockScriptAPI = async ({ user_id, auth_key, client_block_script_id }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      client_block_script_id,
    };

    console.log("🔹 Deleting client block script with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/remove_client_block_script_setting",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Delete Client Block Script) failed", err);
    throw err;
  }
};

// 🔹 Remove selected client block script setting
export const removeSelectedClientBlockScriptAPI = async ({
  user_id,
  auth_key,
  market_type_id,
  script_id,
  client_user_id,
  master_user_id,
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      market_type_id,
      script_id,
      user_id: client_user_id,
      master_user_id,
    };

    console.log("🔹 Removing selected client block script with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/setting/remove_client_block1_script_setting",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Remove Selected Client Block Script) failed", err);
    throw err;
  }
};

export const addReceiptAPI = async ({
  user_id,
  auth_key,
  user_type,
  entry_user_id,
  type,
  date1,
  amount,
  remarks = "",
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      user_type,
      user_id: entry_user_id,
      type,
      date1,
      amount,
      remarks,
    };

    console.log("🔹 Adding receipt with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/add_receipt",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Add Receipt) failed", err);
    throw err;
  }
};

// 🔹 Edit entry/receipt
export const editReceiptAPI = async ({
  user_id,
  auth_key,
  entry_id,
  entry_user_id,
  type,
  date1,
  amount,
  remarks = "",
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      entry_id,
      user_id: entry_user_id,
      type,
      date1,
      amount,
      remarks,
    };

    console.log("🔹 Editing receipt with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/edit_receipt",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Edit Receipt) failed", err);
    throw err;
  }
};

// 🔹 Delete entry/receipt
export const deleteReceiptAPI = async ({ user_id, auth_key, entry_id, entry_user_id }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id: user_id,
      auth_key,
      entry_id,
      user_id: entry_user_id,
    };

    console.log("🔹 Deleting receipt with payload:", payload);

    const response = await axios.post(
      "http://128.199.126.171/~goldorg/ajaxfiles/delete_receipt",
      payload
    );

    return response.data;
  } catch (err) {
    console.error("❌ API call (Delete Receipt) failed", err);
    throw err;
  }
};

export const addJVEntryAPI = async ({
  login_user_id,
  auth_key,
  from_ledger,
  to_ledger,
  ledger_type,
  date1,
  amount,
  remarks = "",
  jv_entry_id = 0,
  jv_entry_time = ""
}) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id,
      auth_key,
      from_ledger,
      to_ledger,
      ledger_type,
      date1,
      amount,
      remarks,
      jv_entry_id,
      jv_entry_time
    };

    console.log("🔹 Add JV payload:", payload);
    const response = await axios.post("http://128.199.126.171/~goldorg/ajaxfiles/add_jv", payload);
    return response.data;
  } catch (err) {
    console.error("❌ API call (Add JV) failed", err);
    throw err;
  }
};

// 🔹 Update JV entry (same endpoint as add, but with jv_entry_id)
export const updateJVEntryAPI = async (payload) => addJVEntryAPI(payload);

// 🔹 Delete JV entry
export const deleteJVEntryAPI = async ({ login_user_id, auth_key, entryId }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id,
      auth_key,
      entryId
    };

    console.log("🔹 Delete JV payload:", payload);
    const response = await axios.post("http://128.199.126.171/~goldorg/ajaxfiles/delete_jv_entry", payload);
    return response.data;
  } catch (err) {
    console.error("❌ API call (Delete JV) failed", err);
    throw err;
  }
};


const fetchUserLog = async ({ endpoint, login_user_id, auth_key, user_id, log_datetime }) => {
  try {
    const payload = {
      is_app: "1",
      login_user_id,
      auth_key,
      user_id,
      log_datetime
    };
    console.log(`🔹 Fetching from ${endpoint} with payload:`, payload);
    const response = await axios.post(endpoint, payload);
    return response.data.data || [];
  } catch (err) {
    console.error(`❌ API call failed for ${endpoint}`, err);
    throw err;
  }
};

// Fetch basic edit log
export const fetchBasicLogAPI = async ({ login_user_id, auth_key, user_id, log_datetime }) =>
  fetchUserLog({
    endpoint: "http://128.199.126.171/~goldorg/ajaxfiles/setting/user_basic_edit_log",
    login_user_id,
    auth_key,
    user_id,
    log_datetime
  });

// Fetch brokerage edit log
export const fetchBrokerageLogAPI = async ({ login_user_id, auth_key, user_id, log_datetime }) =>
  fetchUserLog({
    endpoint: "http://128.199.126.171/~goldorg/ajaxfiles/setting/user_commission_edit_log",
    login_user_id,
    auth_key,
    user_id,
    log_datetime
  });

// Fetch market edit log
export const fetchMarketLogAPI = async ({ login_user_id, auth_key, user_id, log_datetime }) =>
  fetchUserLog({
    endpoint: "http://128.199.126.171/~goldorg/ajaxfiles/setting/user_market_edit_log",
    login_user_id,
    auth_key,
    user_id,
    log_datetime
  });