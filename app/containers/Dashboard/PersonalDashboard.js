import React, { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import '@fortawesome/fontawesome-free/css/all.min.css';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  Button, Dialog, DialogTitle, DialogContent, Fade, Slide, DialogActions, Avatar, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, FormControl, InputLabel, Select, MenuItem,
  Grid, Paper, TextField, Card, CardContent, Typography, Box, Divider, useMediaQuery as useMUIQuery,
} from '@mui/material';

import { Tabs, Tab } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import BarChartIcon from '@mui/icons-material/BarChart';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportIcon from '@mui/icons-material/Report';
import ShowChartIcon from '@mui/icons-material/ShowChart';


import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import brand from 'dan-api/dummy/brand';
import DropdownMenu from './DropdownMenu'
import ApexCharts from './Apexcharts.js';
import axios from 'axios';

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
// import TextField from "@mui/material/TextField";

import { data } from 'dan-vendor/autoprefixer/lib/autoprefixer';
import { motion, AnimatePresence } from 'framer-motion';
import { left } from 'dan-vendor/@popperjs/core';
import { apifetchPositions, fetchDashboardDataAPI, fetchLoginDataAPI, fetchOrdersAPI, fetchPendingOrdersAPI, fetchRejectionLogsAPI, fetchStockPositionsAPI, fetchTradesAPI, fetchTradesDataAPI, fetchTrendStocksAPI } from './API/API';

const animationVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

ChartJS.register(ArcElement, Tooltip, Legend);

const generateCandleData = (name) => {
  const base = 1000 + Math.random() * 100;
  const data = Array.from({ length: 10 }, (_, i) => {
    const open = base + Math.random() * 10;
    const close = open + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    return {
      x: new Date(2025, 5, 20 + i),
      y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)],
    };
  });
  return data;
};

const detailedSectorData = [
  {
    sector: 'Finance',
    value: 400,
    color: '#42a5f5',
    companies: [
      { name: 'HDFC Bank', qty: 120, price: 5000, pl: 4500 },
      { name: 'ICICI Bank', qty: 80, price: 4500, pl: -1200 },
      { name: 'SBI', qty: 100, price: 4800, pl: 2300 },
    ],
  },
  {
    sector: 'Technology',
    value: 300,
    color: '#66bb6a',
    companies: [
      { name: 'Infosys', qty: 90, price: 6000, pl: 3600 },
      { name: 'TCS', qty: 60, price: 8000, pl: 2100 },
      { name: 'Wipro', qty: 50, price: 4000, pl: -400 },
    ],
  },
  {
    sector: 'Healthcare',
    value: 200,
    color: '#ffca28',
    companies: [
      { name: 'Sun Pharma', qty: 70, price: 6500, pl: 1800 },
      { name: 'Dr. Reddy', qty: 30, price: 8000, pl: 950 },
    ],
  },
  {
    sector: 'Energy',
    value: 100,
    color: '#ef5350',
    companies: [
      { name: 'Reliance', qty: 60, price: 9000, pl: 2500 },
      { name: 'ONGC', qty: 40, price: 3000, pl: -600 },
    ],
  },
];

// Now add calculated totalInvestment per sector:
detailedSectorData.forEach(sector => {
  sector.totalInvestment = sector.companies.reduce(
    (sum, company) => sum + company.qty * company.price,
    0
  );
});

const asserts = {
  "HDFC Bank": { price: 500, pl: 4500, qty: 120 },
  "ICICI Bank": { price: 450, pl: -1200, qty: 80 },
  "SBI": { price: 480, pl: 2300, qty: 100 },
  "Infosys": { price: 600, pl: 3600, qty: 90 },
  "TCS": { price: 800, pl: 2100, qty: 60 },
  "Wipro": { price: 400, pl: -400, qty: 50 },
  "Sun Pharma": { price: 650, pl: 1800, qty: 70 },
  "Dr. Reddy": { price: 800, pl: 950, qty: 30 },
  "Reliance": { price: 900, pl: 2500, qty: 60 },
  "ONGC": { price: 300, pl: -600, qty: 40 },
};


const assertNames = Object.keys(asserts);
const smallCapNames = ["Wipro", "ONGC", "Dr. Reddy"];
const midCapNames = ["Sun Pharma", "SBI", "ICICI Bank"];
const largeCapNames = ["HDFC Bank", "Infosys", "TCS"];

const smallCapColors = ["#4a148c", "#6a1b9a", "#7b1fa2"];
const midCapColors = ["#1a237e", "#283593", "#303f9f"];
const largeCapColors = ["#0d47a1", "#1565c0", "#1976d2", "#1e88e5"];

const smallCapData = smallCapNames.map(name => asserts[name].qty);
const midCapData = midCapNames.map(name => asserts[name].qty);
const largeCapData = largeCapNames.map(name => asserts[name].qty);

// const companyRefs = useRef({});

// const scrollToCompany = (name) => {
//   const el = companyRefs.current[name];
//   if (el) {
//     el.scrollIntoView({ behavior: "smooth", block: "center" });
//   }
// };


const exampleStock = {
  name: "Reliance Industries",
  ltp: 2850,
  priceChange: "+30",
  pricePercentChange: "+1.06",
  open: 2820,
  high: 2865,
  low: 2800,
  close: 2820,
  bidRate: 2848,
  askRate: 2852,
  volumeOi: 1200000,
  minOrder: 1,
  maxOrder: 1000,
  positions: "200 shares held at average ₹2700",
  shortDescription: "India's largest private sector company with businesses in energy, petrochemicals, textiles, natural resources, retail, and telecommunications.",
  longDescription: "Reliance Industries Limited is a Fortune 500 company and the largest private sector corporation in India. It operates in multiple segments including oil and gas exploration, refining and marketing, petrochemicals, retail, digital services, and financial services. The company has consistently delivered strong revenue and profit growth, supported by its diversified business model and robust execution capabilities.",
};

const boxHeight = 300;

function PersonalDashboard() {
  const theme = useTheme();
  const [trendStocks, setTrendStocks] = useState([]);

  const isMobile = useMUIQuery(theme.breakpoints.down('sm', 'md'));

  const [open, setOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);

  const [showMore, setShowMore] = useState(false);

  const [selected, setSelected] = useState('MCX');

  const [highlightedStock, setHighlightedStock] = useState(null);

  const [candleOpen, setCandleOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);

  const [margindata, setMargindata] = useState()

  const [ordersDialogOpen, setOrdersDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState("today");
  const [PendingFilterType, setPendingFilterType] = useState("today");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [visibleCount, setVisibleCount] = useState(10);
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [positionDialogOpen, setpositionDialogOpen] = useState(false);
  const [positionData, setPositionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const [rejectionDialogOpen, setrejectionDialogOpen] = useState(false);
  const [rejectionLogs, setRejectionLogs] = useState([]);
  const [logPageSize, setLogPageSize] = useState(10);
  const [logCurrentPage, setLogCurrentPage] = useState(0);
  const [logTotalPages, setLogTotalPages] = useState(0);
  const [visibleLogCount, setVisibleLogCount] = useState(10);


  const [pendingOrdersDialogOpen, setPendingOrdersDialogOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [pendingSearchText, setPendingSearchText] = useState("");
  const [pendingCurrentPage, setPendingCurrentPage] = useState(0);
  const pendingRowsPerPage = 10;
  const [pendingVisibleCount, setpendingVisibleCount] = useState(10);

  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [tradesData, setTradesData] = useState([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [tradesError, setTradesError] = useState(null);

  const [expanded, setExpanded] = useState(false);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const [searchQuery, setSearchQuery] = useState("");

  const [dashboardData, setDashboardData] = useState({
    today_rejection: '0',
    total_rejection: '0',
    total_position: '0',
    today_trades: '0',
    week_trades: '0',
    today_pending_trades: '0',
  });

  const handlePendingSearchChange = (value) => {
    setPendingSearchText(value);
    setPendingCurrentPage(0);
  };

  const filteredPositions = positionData.filter((row) =>
    row?.script_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingOrders = pendingOrders.filter((order) =>
    order.scrp_name?.toLowerCase().includes(pendingSearchText.toLowerCase()) ||
    order.client_full_name?.toLowerCase().includes(pendingSearchText.toLowerCase())
  );

  const pendingPaginatedOrders = filteredPendingOrders.slice(
    pendingCurrentPage * pendingRowsPerPage,
    (pendingCurrentPage + 1) * pendingRowsPerPage
  );

  const handlePendingFilterChange = (event) => {
    const newFilter = event.target.value;
    setPendingFilterType(newFilter);
    setPendingCurrentPage(0);
    fetchPendingOrders(newFilter); // pass filter type to fetch updated data
    setPendingOrdersDialogOpen(true)
  };

  const handlePendingLoadMore = () => {
    setPendingVisibleCount((prev) => prev + 10);
  };

  const handleRejectionLoadMore = () => {
    setVisibleLogCount((prev) => prev + 10);
  };

  const pendingVisibleOrders = pendingOrders.slice(0, pendingVisibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleOrders = orders.slice(0, visibleCount);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Chart ref
  const chartRef = useRef(null);
  const sectorChart = useRef(null);

  const handleCardClick = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const handleDialogClose = () => {
    setpositionDialogOpen(false);
    handleDrawerClose(); // close drawer too
  };



  // Refs for each list item
  const companyRefs = useRef({});
  const listRef = useRef(null);

  const glassStyles = {
    p: 3,
    borderRadius: 4,
    backdropFilter: 'blur(10px)',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(30, 30, 30, 0.4)'
      : 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: theme.shadows[6],
  };

  // const sectorData = useMemo(() => sectorData, []);
  // const assetData = useMemo(() => rawAssetData, []);

  const showChartTooltip = (index) => {
    const chart = chartRef.current;
    if (!chart) return;

    const segment = chart.getDatasetMeta(0).data[index];
    if (!segment) return;

    chart.setActiveElements([
      { datasetIndex: 0, index }
    ]);
    chart.tooltip.setActiveElements([{ datasetIndex: 0, index }], { x: 0, y: 0 });
    chart.update();
  };

  const scrollToCompany = (companyName) => {
    const ref = companyRefs.current[companyName];
    const listContainer = listRef.current;

    if (ref && listContainer) {
      const scrollOffset = ref.offsetTop - listContainer.offsetTop;

      listContainer.scrollTo({
        top: scrollOffset,
        behavior: 'smooth',
      });

      // setHighlightedStock(companyName);
      setTimeout(() => setHighlightedStock(companyName), 400);
      setTimeout(() => setHighlightedStock(null), 1000);
    }
  };

  const filteredLogs = rejectionLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.full_name?.toLowerCase().includes(query) ||
      log.script_name?.toLowerCase().includes(query) ||
      log.trade_type?.toLowerCase().includes(query) ||
      log.log_message?.toLowerCase().includes(query)
    );
  });


  const InfoCardHorizontal = ({ title, icon, content, bgcolor }) => (
    <Paper
      elevation={0}
      sx={{
        ...glassStyles,
        minHeight: 110,
        borderRadius: 2,
        p: 1,
        backgroundColor: bgcolor,
      }}
    >
      {/* Row: Icon + Title (Horizontally Aligned) */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      {/* Divider below the title row */}
      <Divider sx={{ width: '30%', mb: 1 }} />

      {/* Content (listed below icon-title row) */}
      <Box display="flex" flexDirection="column" gap={0.5}>
        {content.map((line, i) => (
          <Typography key={i} variant="body2" color="text.secondary" component="div">
            {line}
          </Typography>
        ))}
      </Box>
    </Paper>
  );

  const fetchPositions = async () => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    const result = await apifetchPositions(dataStored.user_id, dataStored.auth_key);
    setPositionData(result);
    setLoading(false);
  };

  const fetchLoginData = async () => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    const result = await fetchLoginDataAPI(dataStored.user_id, dataStored.auth_key);
    setLoginData(result);
    setLoading(false);
  };


  const fetchOrders = async (type = "today", searchValue = "") => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    const result = await fetchOrdersAPI(dataStored.user_id, dataStored.auth_key, type, searchValue);
    setOrders(result);
    setLoading(false);
  };

  const fetchPendingOrders = async () => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    const result = await fetchPendingOrdersAPI(dataStored.user_id, dataStored.auth_key);
    setPendingOrders(result);
    setLoading(false);
  };

  const fetchRejectionLogs = async () => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    const result = await fetchRejectionLogsAPI(dataStored.user_id, dataStored.auth_key, filterType, searchQuery);
    setRejectionLogs(result);
    setLoading(false);
  };

  const fetchTradesData = async () => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!selectedRow) return;
    setLoadingTrades(true);
    const result = await fetchTradesDataAPI(dataStored.user_id, dataStored.auth_key, selectedRow.script_id);
    setTradesData(result);
    setLoadingTrades(false);
  };

  const handleViewTradesClick = () => {
    if (!expanded) fetchTradesData();
    setExpanded((prev) => !prev);
  };

  const paginatedOrders = orders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const paginatedLogs = useMemo(() => {
    const start = logCurrentPage * logPageSize;
    const end = start + logPageSize;
    return filteredLogs.slice(start, end);
  }, [filteredLogs, logCurrentPage, logPageSize]);

  const visibleMobileLogs = useMemo(
    () => filteredLogs.slice(0, visibleLogCount),
    [filteredLogs, visibleLogCount]
  );


  function getMarginDataFromSessionStorage() {
    const data = sessionStorage.getItem("data");
    const dataObj = JSON.parse(data);
    console.log('!!dataObj', !!dataObj);

    const tempObj = {
      nse_margin: dataObj.nse_margin,
      mcx_margin: dataObj.mcx_margin,
      cricket_margin: dataObj.cricket_margin,
      nseopt_margin: dataObj.nseopt_margin,
      comex_margin: dataObj.comex_margin,
      forex_margin: dataObj.forex_margin,
      global_margin: dataObj.global_margin,
      nseeqt_margin: dataObj.nseeqt_margin,
    }

    let obj = [];

    for (let i in tempObj) {
      obj.push({
        label: i,
        value: dataObj[i],
      })
    }
    // console.log('obj', obj);
    setMargindata(obj);
  }

  const [loginData, setLoginData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarginDataFromSessionStorage();
    fetchLoginData();
    fetchOrders(filterType);
    fetchPendingOrders(PendingFilterType)
  }, [filterType, PendingFilterType]);

  useEffect(() => {
    if (rejectionDialogOpen) {
      fetchRejectionLogs();
    }
  }, [rejectionDialogOpen, filterType, searchQuery]);

  useEffect(() => {
    const fetchTrendStocks = async () => {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      const result = await fetchTrendStocksAPI(dataStored.user_id, dataStored.auth_key);
      setTrendStocks(result);
    };

    fetchTrendStocks();
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      if (tabValue === 1 && selectedStock) {
        setLoadingTrades(true);
        setTradesError(null);

        try {
          const result = await fetchTradesAPI(dataStored.user_id, dataStored.auth_key, selectedStock.script_id);
          setTradesData(result);
        } catch (error) {
          setTradesError("Failed to load trades data");
          setTradesData([]);
        } finally {
          setLoadingTrades(false);
        }
      }
    };

    fetchTrades();
  }, [tabValue, selectedStock]);

  useEffect(() => {
    const fetchPositions = async () => {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      if (tabValue === 2 && selectedStock) {
        setLoading(true);
        setPositionData([]); // clear old data
        const result = await fetchStockPositionsAPI(dataStored.user_id, dataStored.auth_key, selectedStock.script_id);
        setPositionData(result);
        setLoading(false);
      }
    };

    fetchPositions();
  }, [tabValue, selectedStock]);


  useEffect(() => {
    if (pendingOrdersDialogOpen) {
      fetchPendingOrders();
    }
  }, [pendingOrdersDialogOpen]);

  useEffect(() => {
    const total = Math.ceil(filteredLogs.length / logPageSize);
    setLogTotalPages(total);
    // Ensure current page is valid
    if (logCurrentPage >= total) {
      setLogCurrentPage(total > 0 ? total - 1 : 0);
    }
  }, [filteredLogs, logPageSize]);

  useEffect(() => {
    // Only reset if logs changed completely
    setVisibleLogCount((prev) => Math.min(prev, filteredLogs.length));
  }, [filteredLogs.length]);



  useEffect(() => {
    if (positionDialogOpen) {
      fetchPositions();
    }
  }, [positionDialogOpen]);

  useEffect(() => {
    setExpanded(false); // collapse trades on new selection
  }, [selectedRow]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      const result = await fetchDashboardDataAPI(dataStored.user_id, dataStored.auth_key);
      if (result) {
        setDashboardData(result);
      }
    };

    fetchDashboardData();
  }, []);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilterType(newFilter);
    setCurrentPage(0);
    fetchOrders(newFilter); // pass filter type to fetch updated data
    setOrdersDialogOpen(true)
  };

  const handleSearchChange = (value) => {
    setSearchText(value);

    // Clear previous timeout if exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Delay search to avoid firing on every keystroke
    const timeout = setTimeout(() => {
      fetchOrders(filterType, value);
    }, 500);

    setSearchTimeout(timeout);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
      <Helmet>
        <title>{brand.name} - Personal Dashboard</title>
      </Helmet>

      <Grid container spacing={1}>

        <Grid item xs={12} sm={6} md={3}>
          <Box onClick={() => setOrdersDialogOpen(true)} sx={{ cursor: "pointer" }}>
            <InfoCardHorizontal
              title="Orders"
              icon={<SwapHorizIcon sx={{ color: "#9c27b0", fontSize: 30 }} />}
              content={[
                `Today: ${dashboardData.today_trades}`,
                `This Week: ${dashboardData.week_trades}`,
              ]}
              bgcolor="rgba(156, 39, 176, 0.1)"
            />
          </Box>
        </Grid>


        <Dialog
          open={ordersDialogOpen}
          fullScreen={isMobile}
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              setOrdersDialogOpen(false);
            }
          }}
          fullWidth
          maxWidth="xl"
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              overflow: "hidden", // ✅ Hide outer scrollbar
              maxHeight: isMobile ? "100vh" : "90vh",
              overflowY: 'auto'
            },
          }}
        >
          <Box sx={{ p: 0 }}>
            {/* Blue header similar to your image */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 1,
                backdropFilter: "blur(6px)",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                color: "#fff",
                width: "100%",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  textShadow: "0 0 6px rgba(33,203,243,0.9)",
                }}
              >
                <AssignmentIcon sx={{ mr: 1, fontSize: "2rem", color: "#fff" }} />
                Orders
              </Typography>

              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                onClick={() => setOrdersDialogOpen(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>


            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0,
                px: 1,
                py: 1,
                backgroundColor: (theme) => theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 120,
                    "& .MuiOutlinedInput-root": {
                      height: 26,
                      "& fieldset": {
                        borderColor: "black", // ✅ black border
                      },
                      "&:hover fieldset": {
                        borderColor: "black", // ✅ on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black", // ✅ on focus
                      },
                    },
                  }}
                >
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filterType}
                    label="Filter"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="all">This Week</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Search orders"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  fullWidth
                  sx={{
                    ml: 1,
                    "& .MuiOutlinedInput-root": {
                      height: 26,
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            ) : orders.length > 0 ? (
              <>
                {isMobile ? (
                  <>
                    {visibleOrders.map((item, index) => {
                      const [mainName, subName] = item.scrp_name.split(" ", 2);
                      const cleanRate = item.trd_rate?.split("(")[0].trim();

                      const isBuy = item.trd_type === "Buy";
                      const isSell = item.trd_type === "Sell";
                      const borderGradient = isBuy
                        ? "linear-gradient(to right, #2196f3, #21cbf3)"
                        : isSell
                          ? "linear-gradient(to right, #f44336, #ff7961)"
                          : "#ccc";

                      const boxShadowColor = isBuy
                        ? "rgba(33, 150, 243, 0.3)"
                        : isSell
                          ? "rgba(244, 67, 54, 0.3)"
                          : "rgba(0,0,0,0.1)";

                      return (
                        <Card
                          key={item.trd_id || index}
                          sx={{
                            mb: 1,
                            mx: 1,
                            borderRadius: 2,
                            // Transparent border to allow gradient
                            border: "1px solid transparent",
                            // Inner background color based on theme
                            backgroundImage: (theme) =>
                              `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"
                              }), ${borderGradient}`,
                            backgroundOrigin: "border-box",
                            backgroundClip: "content-box, border-box",
                            boxShadow: `0 4px 12px ${boxShadowColor}`,
                            position: "relative",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: `0 8px 20px ${boxShadowColor}`,
                            },
                          }}
                        >
                          {item.is_hot && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "gold",
                                color: "#000",
                                fontSize: "0.7em",
                                px: 1,
                                py: 0.3,
                                borderBottomLeftRadius: 4,
                                fontWeight: 700,
                              }}
                            >
                              HOT
                            </Box>
                          )}

                          <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000" }}>
                                {mainName}
                                {" "}
                                <span style={{ fontSize: "0.8em", fontWeight: 500 }}>
                                  {subName}
                                </span>
                              </Typography>
                              <Typography variant="caption" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000" }}>
                                ID: #{item.trd_id}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                  variant="body2"
                                  component="span"
                                  dangerouslySetInnerHTML={{ __html: item.device_type_html }}
                                  sx={{ mr: 0.3 }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isBuy ? "#2196f3" : isSell ? "#f44336" : (theme) => theme.palette.mode === "dark" ? "#fff" : "#000",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {isBuy ? "📈" : isSell ? "📉" : ""} {item.trd_type}
                                  {" "}
                                  <span style={{ fontSize: "0.8em", fontWeight: 400 }}>
                                    {item.trd_type2}
                                  </span>
                                </Typography>
                              </Box>

                              <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000" }}>
                                ({item.trd_lot}) {item.actual_lot_qty} @
                                <span style={{ fontWeight: 700, fontSize: "1em", marginLeft: 4 }}>
                                  {cleanRate}
                                </span>
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="caption" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000" }}>
                                {item.trd_time}
                              </Typography>
                              <Typography variant="caption" sx={{ color: (theme) => theme.palette.mode === "dark" ? "#ccc" : "#000" }}>
                                Commission:{" "}
                                <span style={{ fontWeight: 700, color: "#2e7d32" }}>
                                  {item.trd_comm_amnt}
                                </span>
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {visibleCount < orders.length && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                        <Button variant="outlined" onClick={handleLoadMore} size="small">
                          Load More
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                  
<Box
  sx={{
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "400px",
    border: "1px solid #ddd",
    borderRadius: "0px",
    mx: 1,
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  }}
>
  <table
    className="table table-striped table-bordered"
    style={{
      minWidth: "1500px",
      fontSize: "12px",
      margin: 0,
      backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    }}
  >
    <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
      <tr>
        {[
          "Device", "Time", "Script", "B/S", "Order Type",
          "Qty (Lot)", "Order Price", "Status", "O. Time", "Comm Amt", "Trade ID"
        ].map((header) => (
          <th
            key={header}
            style={{
              color: theme.palette.mode === "dark" ? "#fff" : "#000",
              fontWeight: 600,
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {paginatedOrders.map((item, index) => {
        const market = item.mrkt_name?.toUpperCase?.() || "DEFAULT";
        let backgroundColor = "#9e9e9e"; // default

        if (market === "NSEFUT") backgroundColor = "#1976d2";
        else if (market === "GLOBAL FUTURES") backgroundColor = "#388e3c";
        else if (market === "MCXFUT") backgroundColor = "#8e24aa";
        else if (market === "NYSE") backgroundColor = "#f57c00";

        return (
          <tr key={item.trd_id || index}>
            <td dangerouslySetInnerHTML={{ __html: item.device_type_html }} />
            <td>{item.trd_matchedtime}</td>
            <td>
              {item.scrp_name}
              <Box
                component="span"
                sx={{
                  fontSize: "10px",
                  px: 1,
                  ml: 1,
                  borderRadius: "8px",
                  backgroundColor,
                  color: "#fff",
                  display: "inline-block",
                }}
              >
                {item.mrkt_name}
              </Box>
            </td>
            <td
  style={{
    color:
      item.trd_type === "Buy"
        ? theme.palette.success.main
        : item.trd_type === "Sell"
        ? theme.palette.error.main
        : theme.palette.text.primary,
    textTransform: "uppercase",
    fontWeight: 700,
  }}
>
  {item.trd_type}
</td>

            <td>{item.trd_type2}</td>
           <td>
  <Box component="span" sx={{ fontWeight: 700 }}>
    {item.actual_lot_qty}
  </Box>{" "}
  <Box component="span" sx={{ color: theme.palette.text.secondary }}>
    ({item.trd_lot})
  </Box>
</td>
            <td
  style={{
    fontWeight: 700,
    color: 'black',
  }}
>
  {item.trd_rate}
</td>

            <td>{item.trd_status}</td>
            <td>{item.trd_time}</td>
            <td>{item.trd_comm_amnt}</td>
            <td>#{item.trd_id}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</Box>




                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, py: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                        <Button
                          size="small"
                          disabled={currentPage === 0}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          color="secondary"
                          sx={{ mr: 1 }}
                        >
                          Prev
                        </Button>

                        {[...Array(totalPages)].map((_, i) => {
                          // Show first, last, current, and neighbors; else show ellipsis
                          if (
                            i === 0 ||
                            i === totalPages - 1 ||
                            (i >= currentPage - 1 && i <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={i}
                                size="small"
                                variant={i === currentPage ? "contained" : "outlined"}
                                color="secondary"
                                onClick={() => setCurrentPage(i)}
                                sx={{ mx: 0.3, minWidth: "30px" }}
                              >
                                {i + 1}
                              </Button>
                            );
                          }
                          if (
                            (i === 1 && currentPage > 2) ||
                            (i === totalPages - 2 && currentPage < totalPages - 3)
                          ) {
                            return (
                              <Typography key={i} sx={{ mx: 0.5 }}>
                                ...
                              </Typography>
                            );
                          }
                          return null;
                        })}

                        <Button
                          size="small"
                          disabled={currentPage + 1 >= totalPages}
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          color="secondary"
                          sx={{ ml: 1 }}
                        >
                          Next
                        </Button>
                      </Box>
                    </Box>

                  </>
                )}
              </>
            ) : (
              <Typography sx={{ fontSize: "14px", px: 1, color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000" }}>
                No orders found.
              </Typography>
            )}
          </Box>
        </Dialog>



        <Grid item xs={12} sm={6} md={3}>
          <Box onClick={() => setpositionDialogOpen(true)} sx={{ cursor: 'pointer' }}>
            <InfoCardHorizontal
              title="Positions"
              icon={<TrendingUpIcon sx={{ color: '#4caf50', fontSize: 30 }} />}
              content={[`Positions: ${dashboardData.total_position}`]}
              bgcolor="rgba(76, 175, 80, 0.1)"
            />
          </Box>
        </Grid>

        <Dialog
          open={positionDialogOpen}
          onClose={handleDialogClose}
          fullScreen={isMobile}
          fullWidth
          maxWidth="xl"
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              overflow: "hidden", // ✅ Prevent outer scrolling
              maxHeight: isMobile ? "100vh" : "90vh",
              overflowY: 'auto'
            },
          }}
        >
          <Box sx={{ p: 0, position: "relative" }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 1,
                backdropFilter: "blur(6px)",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                color: "#fff",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  textShadow: "0 0 6px rgba(33,203,243,0.9)",
                }}
              >
                <BarChartIcon sx={{ mr: 1, fontSize: "2rem", color: "#fff" }} />
                Positions
              </Typography>
              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                onClick={handleDialogClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 1, py: 0.5, backgroundColor: "background.default" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search positions..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ mr: 0.5 }}>
                      <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', verticalAlign: 'middle' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#666',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000', // 🔥 Black border on focus
                    },
                  },
                  '& input': {
                    py: 0.5,
                  },
                }}
              />
            </Box>


            {/* Body */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress />
              </Box>
            ) : filteredPositions.length > 0 ? (
              <>
                {isMobile ? (
                  <>
                    {filteredPositions.map((row, index) => {
                      const scriptHtml = row?.script_name || "";
                      const parts = scriptHtml.split("<br>");
                      const mainName = parts[0] || "";
                      const datePart = parts[1] || "";

                      const currentValue = row.total_buy * row.last_trade_price;
                      const todaysPL = -203.0;
                      const unrealizedPL = 8170;
                      const unrealizedPLPerc = 10.62;

                      return (
                        <Box
                          key={index}
                          onClick={() => handleCardClick(row)}
                          sx={{
                            m: 0.2, // Reduce margin
                            border: (theme) => `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 1.5,
                            backgroundColor: (theme) => theme.palette.background.paper,
                            boxShadow: (theme) =>
                              theme.palette.mode === "dark"
                                ? "0 0 4px rgba(255, 255, 255, 0.08)"
                                : "0 0 4px rgba(0, 0, 0, 0.04)",
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                        >
                          {/* Top row */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 0.8,
                              py: 0.5, // Reduce vertical padding
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                              <Avatar
                                alt={mainName.replace(/<\/?[^>]+(>|$)/g, "")}
                                src="/path-to-your-logo.png"
                                variant="square"
                                sx={{ width: 28, height: 28, mr: 0.6, flexShrink: 0 }} // Smaller avatar, smaller margin
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  overflow: "hidden",
                                  flexWrap: "nowrap",
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    mr: 0.3, // Reduce margin
                                  }}
                                  dangerouslySetInnerHTML={{ __html: mainName }}
                                />
                                <Box sx={{ display: "flex", alignItems: "center", ml: 0.4 }}>
                                  <ShoppingBagIcon fontSize="inherit" sx={{ fontSize: 10, color: "text.disabled" }} />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: 10,
                                      fontWeight: 300,
                                      ml: 0.2,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {row.total_buy} X {row.buy_avg_rate}
                                  </Typography>
                                </Box>
                                {datePart && (
                                  <Typography
                                    variant="caption"
                                    sx={{ opacity: 0.7, ml: 0.4, whiteSpace: "nowrap" }}
                                    dangerouslySetInnerHTML={{ __html: datePart }}
                                  />
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: "right", minWidth: 65, flexShrink: 0 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {row.last_trade_price}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: row.change_value < 0
                                    ? (theme) => theme.palette.error.main
                                    : (theme) => theme.palette.success.main,
                                }}
                              >
                                {row.change_value} ({row.change_perc}%)
                              </Typography>
                            </Box>
                          </Box>

                          {/* Bottom row */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              py: 0.3, // Reduce vertical padding
                              px: 0.5, // Add small horizontal padding
                              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                              textAlign: "center",
                              width: "100%",
                            }}
                          >
                            <Box sx={{ flex: 0.5, pr: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {isNaN(currentValue)
                                  ? "---"
                                  : currentValue >= 1000
                                    ? `${(currentValue / 1000).toFixed(2)}K`
                                    : currentValue.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Current Value
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "error.main" }}>
                                {todaysPL.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Today&apos;s P&amp;L
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "success.main" }}>
                                {unrealizedPL >= 1000
                                  ? `+${(unrealizedPL / 1000).toFixed(2)}K`
                                  : `+${unrealizedPL.toFixed(2)}`}{" "}
                                <Typography component="span" variant="caption" sx={{ color: "success.main" }}>
                                  ({unrealizedPLPerc}%)
                                </Typography>
                              </Typography>
                              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                Unrealized P&amp;L
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </>
                ) : (
                  <Box
                    sx={{
                      overflowX: "auto",
                      overflowY: "auto",
                      maxHeight: "400px", // adjust as needed
                      border: "1px solid #ddd",
                      borderRadius: "0px",
                      mx: 1,
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                    }}
                  >
                    <Table style={{ minWidth: "1350px", fontSize: "12px", margin: 0 }}>
                      <TableHead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                        <TableRow>
                          <TableCell>Market Type</TableCell>
                          <TableCell>Script</TableCell>
                          <TableCell>Total Buy</TableCell>
                          <TableCell>Buy Avg Rate</TableCell>
                          <TableCell>Total Sell</TableCell>
                          <TableCell>Sell Avg Rate</TableCell>
                          <TableCell>Net Qty</TableCell>
                          <TableCell>Last Trade Price</TableCell>
                          <TableCell>MTM</TableCell>
                          <TableCell>Auto Closed Date</TableCell>
                          <TableCell>Close Btn</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredPositions.map((row, index) => {
                          const isEven = index % 2 === 0;
                          const rowBgColor = theme.palette.mode === "dark"
                            ? isEven ? "#2a2a2a" : "#1f1f1f"
                            : isEven ? "#f9f9f9" : "#ffffff";

                          return (
                            <TableRow key={index} style={{ backgroundColor: rowBgColor }}>
                              <TableCell>{row.market_type_name}</TableCell>
                              <TableCell><span dangerouslySetInnerHTML={{ __html: row.script_name }} /></TableCell>
                              <TableCell>{row.total_buy}</TableCell>
                              <TableCell>{row.buy_avg_rate}</TableCell>
                              <TableCell>{row.total_sell}</TableCell>
                              <TableCell>{row.sell_avg_rate}</TableCell>
                              <TableCell>{row.net_qty}</TableCell>
                              <TableCell>{row.last_trade_price}</TableCell>
                              <TableCell><span dangerouslySetInnerHTML={{ __html: row.mym_html }} /></TableCell>
                              <TableCell>{row.trade_auto_closed_date}</TableCell>
                              <TableCell>
                                <Button variant="contained" color="error" onClick={() => alert("Close Position")}>
                                  Close
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                )}
              </>
            ) : (
              <Typography sx={{ p: 2 }}>No data found.</Typography>
            )}

            {/* Slide-up panel inside dialog */}
            {/* --- Drawer Panel Inside Dialog --- */}
            {drawerOpen && (
              <>
                <Slide
                  direction="up"
                  in={drawerOpen}
                  mountOnEnter
                  unmountOnExit
                  onExited={() => {
                    setExpanded(false); // optional reset of expanded state
                  }}
                >
                  <Box
                    sx={{
                      position: "fixed",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      width: "100%",
                      bgcolor: "background.paper",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      boxShadow: "0px -8px 30px rgba(0, 0, 0, 0.3)",
                      p: 2,
                      maxHeight: "85vh",
                      display: "flex",
                      flexDirection: "column",
                      zIndex: 1400,
                    }}
                  >
                    {/* Fixed Header */}
                    <Box sx={{ flexShrink: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                          <Avatar
                            alt={selectedRow?.script_name?.replace(/<\/?[^>]+(>|$)/g, "")}
                            src="/path-to-your-logo.png"
                            variant="square"
                            sx={{ width: 50, height: 50, mr: 1, flexShrink: 0 }}
                          />
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            dangerouslySetInnerHTML={{ __html: selectedRow?.script_name }}
                            sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                          />
                        </Box>
                        <IconButton size="large" onClick={handleDrawerClose}>
                          <ArrowDropDownIcon />
                        </IconButton>
                      </Box>

                      {/* Summary Info */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">Total Buy</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.total_buy}</Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">Total Sell</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.total_sell}</Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">Buy Avg Rate</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.buy_avg_rate}</Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">Sell Avg Rate</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.sell_avg_rate}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">Market Type</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.market_type_name}</Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">Net Qty</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.net_qty}</Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">LTP</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedRow?.last_trade_price}</Typography>
                        </Box>
                        <Box sx={{ flex: "1 1 22%" }}>
                          <Typography variant="caption">MTM</Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            dangerouslySetInnerHTML={{ __html: selectedRow?.mym_html }}
                          />
                        </Box>
                      </Box>

                      <Box sx={{ flex: "1 1 100%", mb: 2 }}>
                        <Typography variant="caption">Auto Closed Date</Typography>
                        <Typography variant="body2" fontWeight={600}>{selectedRow?.trade_auto_closed_date}</Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          sx={{
                            background: "linear-gradient(135deg, #0d47a1, #1565c0)",
                            color: "#fff",
                            borderRadius: "6px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            boxShadow: "0 4px 10px rgba(13, 71, 161, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.03)",
                              boxShadow: "0 6px 16px rgba(13, 71, 161, 0.6)",
                              background: "linear-gradient(135deg, #0b3c91, #0d47a1)",
                            },
                          }}
                          onClick={handleViewTradesClick}
                        >
                          {expanded ? "Hide Trades" : "View Trades"}
                        </Button>

                        <Button
                          fullWidth
                          sx={{
                            background: "linear-gradient(135deg, #b71c1c, #c62828)",
                            color: "#fff",
                            borderRadius: "6px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            boxShadow: "0 4px 10px rgba(183, 28, 28, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.03)",
                              boxShadow: "0 6px 16px rgba(183, 28, 28, 0.6)",
                              background: "linear-gradient(135deg, #8e0000, #b71c1c)",
                            },
                          }}
                          onClick={() => alert("Close Position")}
                        >
                          Close Position
                        </Button>
                      </Box>
                    </Box>

                    {/* Scrollable Trades */}
                    {expanded && (
                      <Fade in={expanded} timeout={600}>
                        <Box
                          sx={{
                            mt: 2,
                            overflowY: "auto",
                            maxHeight: "60vh",
                            pr: 1,
                          }}
                        >
                          {loadingTrades ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "150px",
                              }}
                            >
                              <CircularProgress size={32} thickness={4} />
                            </Box>
                          ) : tradesData.length > 0 ? (
                            tradesData.map((item, index) => {
                              const [mainName, subName] = item.scrp_name.split(" ", 2);
                              const cleanRate = item.trd_rate?.split("(")[0].trim();
                              const isBuy = item.trd_type === "Buy";
                              const isSell = item.trd_type === "Sell";

                              const borderGradient = isBuy
                                ? "linear-gradient(to right, #1976d2, #0d47a1)"
                                : isSell
                                  ? "linear-gradient(to right, #c62828, #b71c1c)"
                                  : "#ccc";

                              const boxShadowColor = isBuy
                                ? "rgba(25, 118, 210, 0.3)"
                                : isSell
                                  ? "rgba(198, 40, 40, 0.3)"
                                  : "rgba(0,0,0,0.1)";

                              return (
                                <Card
                                  key={item.trd_id || index}
                                  sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    position: "relative",
                                    border: "1px solid transparent",
                                    backgroundImage: (theme) =>
                                      `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"
                                      }), ${borderGradient}`,
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "content-box, border-box",
                                    boxShadow: `0 4px 12px ${boxShadowColor}`,
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                      transform: "scale(1.02)",
                                      boxShadow: `0 8px 20px ${boxShadowColor}`,
                                    },
                                  }}
                                >
                                  {item.is_hot && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        backgroundColor: "gold",
                                        color: "#000",
                                        fontSize: "0.7em",
                                        px: 1,
                                        py: 0.3,
                                        borderBottomLeftRadius: 4,
                                        fontWeight: 700,
                                      }}
                                    >
                                      HOT
                                    </Box>
                                  )}

                                  <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        {mainName}{" "}
                                        <span style={{ fontSize: "0.8em", fontWeight: 500 }}>{subName}</span>
                                      </Typography>
                                      <Typography variant="caption">ID: #{item.trd_id}</Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                          variant="body2"
                                          component="span"
                                          dangerouslySetInnerHTML={{ __html: item.device_type_html }}
                                          sx={{ mr: 0.3 }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: isBuy ? "#1976d2" : isSell ? "#c62828" : "#000",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {isBuy ? "📈" : isSell ? "📉" : ""} {item.trd_type}{" "}
                                          <span style={{ fontSize: "0.8em", fontWeight: 400 }}>
                                            {item.trd_type2}
                                          </span>
                                        </Typography>
                                      </Box>

                                      <Typography variant="body2">
                                        ({item.trd_lot}) {item.actual_lot_qty} @{" "}
                                        <span style={{ fontWeight: 700, fontSize: "1em", marginLeft: 4 }}>
                                          {cleanRate}
                                        </span>
                                      </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Typography variant="caption">{item.trd_time}</Typography>
                                      <Typography variant="caption">
                                        Commission:{" "}
                                        <span style={{ fontWeight: 700, color: "#2e7d32" }}>{item.trd_comm_amnt}</span>
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              );
                            })
                          ) : (
                            <Typography variant="body2">No trades found</Typography>
                          )}
                        </Box>
                      </Fade>
                    )}
                  </Box>
                </Slide>

                {/* Backdrop */}
                <Box
                  onClick={handleDrawerClose}
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backdropFilter: "blur(5px)",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    zIndex: 1200,
                  }}
                />
              </>
            )}



          </Box>
        </Dialog>

        <Grid item xs={12} sm={6} md={3}>
          <Box onClick={() => setPendingOrdersDialogOpen(true)} sx={{ cursor: "pointer" }}>
            <InfoCardHorizontal
              title="Pending Orders"
              icon={<AccessTimeIcon sx={{ color: "#ff9800", fontSize: 30 }} />}
              content={[
                `Pending orders: ${dashboardData.today_pending_trades}`,
              ]}
              bgcolor="rgba(255, 152, 0, 0.1)"
            />
          </Box>
        </Grid>


        <Dialog
          open={pendingOrdersDialogOpen}
          fullScreen={isMobile}
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              setPendingOrdersDialogOpen(false);
            }
          }}
          fullWidth
          maxWidth="xl"
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              overflow: "hidden", // ✅ Hide outer scrollbar
              maxHeight: isMobile ? "100vh" : "90vh",
            },
          }}
        >
          <Box sx={{ p: 0 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 1,
                backdropFilter: "blur(6px)",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                color: "#fff",
                borderTopLeftRadius: "0px", // same as requested
                borderTopRightRadius: "0px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  textShadow: "0 0 6px rgba(33,203,243,0.9)",
                }}
              >
                <PendingActionsIcon sx={{ mr: 1, fontSize: "2rem", color: "#fff" }} />
                Pending Orders
              </Typography>

              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                onClick={() => setPendingOrdersDialogOpen(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>


            {/* Filters & Search */}
            {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                py: 1,
                backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5"),
                borderRadius: 1,
              }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-root": {
                    height: 26,
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
              >
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterType}
                  label="Filter"
                  onChange={handlePendingFilterChange}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="all">This Week</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search pending orders"
                value={pendingSearchText}
                onChange={(e) => handlePendingSearchChange(e.target.value)}
                fullWidth
                sx={{
                  ml: 1,
                  "& .MuiOutlinedInput-root": {
                    height: 26,
                    "& fieldset": { borderColor: "black" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                }}
              />
            </Box> */}

            {/* Content */}
            {loadingPending ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : pendingOrders.length > 0 ? (
              <>
                {isMobile ? (
                  <>
                    {pendingVisibleOrders.map((item, index) => {
                      const [mainName, subName] = item.scrp_name.split(" ", 2);
                      const cleanRate = item.trd_rate?.split("(")[0].trim();

                      const isBuy = item.trd_type === "Buy";
                      const isSell = item.trd_type === "Sell";
                      const borderGradient = isBuy
                        ? "linear-gradient(to right, #2196f3, #21cbf3)"
                        : isSell
                          ? "linear-gradient(to right, #f44336, #ff7961)"
                          : "#ccc";

                      const boxShadowColor = isBuy
                        ? "rgba(33, 150, 243, 0.3)"
                        : isSell
                          ? "rgba(244, 67, 54, 0.3)"
                          : "rgba(0,0,0,0.1)";

                      return (
                        <Card
                          key={item.trd_id || index}
                          sx={{
                            mb: 1,
                            mx: 1,
                            borderRadius: 2,
                            border: "1px solid transparent",
                            backgroundImage: (theme) =>
                              `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"
                              }), ${borderGradient}`,
                            backgroundOrigin: "border-box",
                            backgroundClip: "content-box, border-box",
                            boxShadow: `0 4px 12px ${boxShadowColor}`,
                            position: "relative",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: `0 8px 20px ${boxShadowColor}`,
                            },
                          }}
                        >
                          {item.is_hot && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "gold",
                                color: "#000",
                                fontSize: "0.7em",
                                px: 1,
                                py: 0.3,
                                borderBottomLeftRadius: 4,
                                fontWeight: 700,
                              }}
                            >
                              HOT
                            </Box>
                          )}

                          <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000"),
                                }}
                              >
                                {mainName}
                                {" "}
                                <span style={{ fontSize: "0.8em", fontWeight: 500 }}>
                                  {subName}
                                </span>
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000") }}
                              >
                                ID: #{item.trd_id}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography
                                  variant="body2"
                                  component="span"
                                  dangerouslySetInnerHTML={{ __html: item.device_type_html }}
                                  sx={{ mr: 0.3 }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: isBuy ? "#2196f3" : isSell ? "#f44336" : (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000"),
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {isBuy ? "📈" : isSell ? "📉" : ""} {item.trd_type}
                                  {" "}
                                  <span style={{ fontSize: "0.8em", fontWeight: 400 }}>
                                    {item.trd_type2}
                                  </span>
                                </Typography>
                              </Box>

                              <Typography
                                variant="body2"
                                sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000") }}
                              >
                                ({item.trd_lot}) {item.actual_lot_qty} @
                                <span style={{ fontWeight: 700, fontSize: "1em", marginLeft: 4 }}>
                                  {cleanRate}
                                </span>
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography
                                variant="caption"
                                sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000") }}
                              >
                                {item.trd_time}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: (theme) => (theme.palette.mode === "dark" ? "#ccc" : "#000") }}
                              >
                                Commission:{" "}
                                <span style={{ fontWeight: 700, color: "#2e7d32" }}>
                                  {item.trd_comm_amnt}
                                </span>
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {pendingOrders.length > pendingVisibleCount && (
                      <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                        <Button variant="outlined" size="small" onClick={handlePendingLoadMore}>
                          Load More
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box sx={{ overflowX: "auto", maxHeight: "400px", mx: 1 }}>
                    <table
                      style={{
                        minWidth: "1350px",
                        fontSize: "12px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                        <tr>
                          {[
                            "Device", "Time", "Trade ID", "Client", "Market", "Script",
                            "B/S", "Order Type", "Lot", "Qty", "Order Price", "Status",
                            "O. Time", "Comm Amt"
                          ].map((header) => (
                            <th key={header} style={{ fontWeight: 600 }}>
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pendingPaginatedOrders.map((item, index) => {
                          let rowBgColor;
                          if (item.trd_type === "Buy") {
                            rowBgColor = theme.palette.mode === "dark" ? "#264653" : "#e0f7fa";
                          } else if (item.trd_type === "Sell") {
                            rowBgColor = theme.palette.mode === "dark" ? "#6d2c41" : "#fce4ec";
                          } else {
                            rowBgColor = theme.palette.mode === "dark" ? "#333" : "#f5f5f5";
                          }

                          return (
                            <tr key={item.trd_id || index} style={{ backgroundColor: rowBgColor }}>
                              <td dangerouslySetInnerHTML={{ __html: item.device_type_html }} />
                              <td>{item.trd_matchedtime}</td>
                              <td>#{item.trd_id}</td>
                              <td>{item.client_full_name}</td>
                              <td>{item.mrkt_name}</td>
                              <td dangerouslySetInnerHTML={{ __html: item.scrp_name }} />
                              <td>{item.trd_type}</td>
                              <td>{item.trd_type2}</td>
                              <td>{item.trd_lot}</td>
                              <td>{item.actual_lot_qty}</td>
                              <td>{item.trd_rate}</td>
                              <td>{item.trd_status}</td>
                              <td>{item.trd_time}</td>
                              <td>{item.trd_comm_amnt}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Box>
                )}
              </>
            ) : (
              <Typography sx={{ px: 1, mt: 2 }}>No pending orders found.</Typography>
            )}
          </Box>
        </Dialog>

        <Grid item xs={12} sm={6} md={3}>
          <Box onClick={() => setrejectionDialogOpen(true)} sx={{ cursor: 'pointer' }}>
            <InfoCardHorizontal
              title="Rejection Logs"
              icon={<CloseIcon sx={{ color: '#d32f2f', fontSize: 30 }} />}
              content={[
                `Today: ${dashboardData.today_rejection}`,
                `Total: ${dashboardData.total_rejection}`,
              ]}
              bgcolor="rgba(206, 48, 48, 0.1)"
            />
          </Box>
        </Grid>
        <Dialog
          open={rejectionDialogOpen}
          fullScreen={isMobile}
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              setrejectionDialogOpen(false);
            }
          }}
          fullWidth
          maxWidth="xl"
          disableEscapeKeyDown
          PaperProps={{
            sx: {
              overflow: "hidden",
              maxHeight: isMobile ? "100vh" : "90vh",
              overflowY: "auto",
            },
          }}
        >
          <Box sx={{ p: 0 }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 3,
                py: 1,
                backdropFilter: "blur(6px)",
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                color: "#fff",
                width: "100%",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  textShadow: "0 0 6px rgba(33,203,243,0.9)",
                }}
              >
                <ReportIcon sx={{ mr: 1, fontSize: "2rem", color: "#fff" }} />
                Rejection Logs
              </Typography>

              <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
                onClick={() => setrejectionDialogOpen(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Filter + Search */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                backgroundColor: (theme) => theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 120,
                    "& .MuiOutlinedInput-root": {
                      height: 26,
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                >
                  <InputLabel>Filter</InputLabel>
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Filter">
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="total">Total</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Search logs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  fullWidth
                  sx={{
                    ml: 1,
                    "& .MuiOutlinedInput-root": {
                      height: 26,
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Content */}
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            ) : filteredLogs.length === 0 ? (
              <Typography sx={{ fontSize: "14px", px: 1 }}>
                No rejection logs found.
              </Typography>
            ) : isMobile ? (
              <>
                {visibleMobileLogs.map((log, index) => {
                  const isBuy = log.trade_type === "Buy";
                  const isSell = log.trade_type === "Sell";

                  const borderGradient = isBuy
                    ? "linear-gradient(to right, #2196f3, #21cbf3)"
                    : isSell
                      ? "linear-gradient(to right, #f44336, #ff7961)"
                      : "#ccc";

                  const boxShadowColor = isBuy
                    ? "rgba(33, 150, 243, 0.3)"
                    : isSell
                      ? "rgba(244, 67, 54, 0.3)"
                      : "rgba(0,0,0,0.1)";

                  return (
                    <Card
                      key={index}
                      sx={{
                        mb: 1,
                        mx: 1,
                        borderRadius: 2,
                        border: "1px solid transparent",
                        backgroundImage: (theme) =>
                          `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"}), ${borderGradient}`,
                        backgroundOrigin: "border-box",
                        backgroundClip: "content-box, border-box",
                        boxShadow: `0 4px 12px ${boxShadowColor}`,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: `0 8px 20px ${boxShadowColor}`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {log.trade_rate} &nbsp;
                            {log.trade_qty} Qty&nbsp;
                            <span style={{ fontWeight: 400 }}>{log.trade_lot} Lot</span>
                          </Typography>
                          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                            {log.datetime}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: isSell
                                ? "#f44336"
                                : isBuy
                                  ? "#2196f3"
                                  : "inherit",
                            }}
                          >
                            {log.trade_type}
                            <span style={{ fontWeight: 400, marginLeft: 4 }}>({log.type})</span>
                          </Typography>
                          <Typography variant="body2">{log.full_name}</Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#d32f2f",
                          }}
                        >
                          {log.log_message}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}

                {visibleLogCount < filteredLogs.length && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <Button variant="outlined" size="small" onClick={handleRejectionLoadMore}>
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <Box
                  sx={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "400px",
                    border: "1px solid #ddd",
                    borderRadius: "0px",
                    mx: 1,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  <table
                    className="table table-striped table-bordered"
                    style={{
                      minWidth: "1400px",
                      fontSize: "12px",
                      margin: 0,
                      backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                      color: theme.palette.mode === "dark" ? "#fff" : "#000",
                    }}
                  >
                    <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                      <tr>
                        {["Type", "Datetime", "Client", "Script", "Trade Type", "Lot", "Qty", "Rate", "Message"].map((header) => (
                          <th key={header} style={{ fontWeight: 600 }}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map((log, index) => {
                        let bgColor =
                          log.trade_type === "Buy"
                            ? theme.palette.mode === "dark"
                              ? "#264653"
                              : "#e0f7fa"
                            : log.trade_type === "Sell"
                              ? theme.palette.mode === "dark"
                                ? "#6d2c41"
                                : "#fce4ec"
                              : theme.palette.mode === "dark"
                                ? "#333"
                                : "#f5f5f5";

                        return (
                          <tr key={index} style={{ backgroundColor: bgColor }}>
                            <td>{log.type}</td>
                            <td>{log.datetime}</td>
                            <td>{log.full_name}</td>
                            <td>{log.script_name}</td>
                            <td>{log.trade_type}</td>
                            <td>{log.trade_lot}</td>
                            <td>{log.trade_qty}</td>
                            <td>{log.trade_rate}</td>
                            <td>{log.log_message}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Box>

                {/* Pagination */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, py: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      disabled={logCurrentPage === 0}
                      onClick={() => setLogCurrentPage((prev) => prev - 1)}
                      color="secondary"
                      sx={{ mr: 1 }}
                    >
                      Prev
                    </Button>

                    {[...Array(logTotalPages)].map((_, i) => {
                      if (i === 0 || i === logTotalPages - 1 || (i >= logCurrentPage - 1 && i <= logCurrentPage + 1)) {
                        return (
                          <Button
                            key={i}
                            size="small"
                            variant={i === logCurrentPage ? "contained" : "outlined"}
                            color="secondary"
                            onClick={() => setLogCurrentPage(i)}
                            sx={{ mx: 0.3, minWidth: "30px" }}
                          >
                            {i + 1}
                          </Button>
                        );
                      }

                      if ((i === 1 && logCurrentPage > 2) || (i === logTotalPages - 2 && logCurrentPage < logTotalPages - 3)) {
                        return (
                          <Typography key={i} sx={{ mx: 0.5 }}>
                            ...
                          </Typography>
                        );
                      }

                      return null;
                    })}

                    <Button
                      size="small"
                      disabled={logCurrentPage + 1 >= logTotalPages}
                      onClick={() => setLogCurrentPage((prev) => prev + 1)}
                      color="secondary"
                      sx={{ ml: 1 }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Dialog>




        {/* <Box
          sx={{
            mt: 1,
            mx: 2,
            paddingLeft: '10px',
            width: '100%',
            border: '2px solid #f44336',      // Red border
            backgroundColor: '#ffebee',        // Light red background
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,                            // Space between icon and text
          }}
        >
          <WarningIcon sx={{ color: '#f44336', fontSize: 30 }} />
          <Typography variant="subtitle1" sx={{ color: 'black' }}>
            Important Notice: Some rejections require immediate attention! Please review the logs.
          </Typography>
        </Box> */}

        {/*--------------------- Sector-wise Distribution ---------------------- */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={glassStyles}>
            <Box sx={{ mb: 1 }}>
              {!isMobile ? (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    mb: 0,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} textAlign="center" sx={{ m: 0 }}>
                    Sector-Wise Distribution
                  </Typography>
                  <Box sx={{ position: 'absolute', right: 0 }}>
                    <DropdownMenu selected={selected} setSelected={setSelected} />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    m: 0,
                    p: 0,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    textAlign="left"
                    gutterBottom={false}
                    sx={{ m: 0, p: 0, lineHeight: 1.2 }}
                  >
                    {"Sector-wise Distribution"}
                  </Typography>

                  <DropdownMenu selected={selected} setSelected={setSelected} />
                </Box>
              )}
            </Box>
            <Divider sx={{ mb: 0.5 }} /> {/* Reduced vertical margin */}
            <Box sx={{ height: 220, m: 0, p: 0 }}> {/* Reduced chart height */}
              <Doughnut
                ref={sectorChart}
                data={{
                  labels: ['Finance', 'Technology', 'Healthcare', 'Energy'],
                  datasets: [{
                    data: [400, 300, 200, 100],
                    backgroundColor: ['#1976d2', '#388e3c', '#7b1fa2', '#d32f2f'],
                    borderColor: theme.palette.mode === 'dark' ? '#222' : '#fff',
                    borderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  onClick: (event, elements) => {
                    if (elements?.length > 0) {
                      const index = elements[0].index;
                      const sector = detailedSectorData[index];
                      setSelectedSector(sector);
                      setOpen(true);
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const index = context.dataIndex;
                          const sector = detailedSectorData[index];
                          if (!sector) return '';
                          return [`Total Investment: ₹${sector.totalInvestment.toLocaleString()}`];
                        },
                      },
                    },
                    legend: {
                      position: 'left',
                      labels: {
                        color: theme.palette.text.primary,
                        usePointStyle: true,
                        padding: 10, // Reduced legend padding
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>


        {/*--------------------- sector popup ---------------------*/}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          {/* 🧾 Title + Total Investment: Stacked on small screens */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              px: 3,
              pt: 2,
              pb: 1,
              gap: 1,
            }}
          >
            <DialogTitle
              sx={{ m: 0, p: 0, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.3rem' } }}
            >
              {selectedSector?.sector} Sector Details
            </DialogTitle>

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, color: 'text.secondary' }}
            >
              Total Investment: ₹{selectedSector?.totalInvestment.toLocaleString()}
            </Typography>
          </Box>

          <DialogContent sx={{ overflow: 'hidden', px: { xs: 2, sm: 3 } }}>
            {selectedSector && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 4,
                  alignItems: 'stretch',
                }}
              >
                {/* 📊 Chart on LHS */}
                <Box
                  sx={{
                    flex: 1,
                    width: '100%',
                    maxWidth: { xs: '100%', md: 400 },
                    height: { xs: 250, sm: 300 },
                    mx: 'auto',
                  }}
                >
                  <Pie
                    data={{
                      labels: selectedSector.companies.map(c => c.name),
                      datasets: [{
                        data: selectedSector.companies.map(c => c.qty),
                        backgroundColor: selectedSector.companies.map((_, i) =>
                          ['#42a5f5', '#66bb6a', '#ffca28', '#ef5350', '#ab47bc', '#26c6da'][i % 6]
                        ),
                        borderColor: theme.palette.mode === 'dark' ? '#444' : '#fff',
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            color: theme.palette.text.primary, // ← sets color dynamically
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const index = context.dataIndex;
                              const company = selectedSector.companies[index];
                              return `${company.name}\nQty: ${company.qty}\nP/L: ₹${company.pl.toLocaleString('en-IN')}`;
                            },
                          }
                        }
                      }
                    }}
                  />

                </Box>

                {/* 📋 Company list on RHS (scrollable) */}
                <Box
                  sx={{
                    flex: 1,
                    maxHeight: { xs: 250, sm: 300 },
                    overflowY: 'auto',
                    pr: 1,
                    width: '100%',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {selectedSector.companies.map((company, i) => (
                    <Box
                      key={i}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                      }}
                    >
                      {/* Top Row: Company Name & P/L */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography fontWeight={600} variant="subtitle1">
                          {company.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: company.pl >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 600,
                          }}
                        >
                          P/L: ₹{company.pl}
                        </Typography>
                      </Box>

                      {/* Bottom Row: Qty & Price */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          mt: 1,
                        }}
                      >
                        <Typography variant="body2">Qty: {company.qty}</Typography>
                        <Typography variant="body2">Price: ₹{company.price}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>


              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} variant="contained" color="secondary" >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ----------- Recent Login ---------- */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ ...glassStyles, height: '100%', p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={1}>
              Recent Login
            </Typography>
            <Divider sx={{ mb: 1 }} />

            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              sx={{
                height: 220, // Fixed height so content doesn't push it
                overflowY: 'auto',
                pr: 0.5,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {loading ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    Loading...
                  </Typography>
                </Box>
              ) : loginData.length === 0 ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flex={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    No login records found.
                  </Typography>
                </Box>
              ) : (
                loginData.map((login, idx) => (
                  <Box
                    key={idx}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                    sx={{ m: 0, p: 0 }}
                  >
                    {/* Left part */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: ['#1976d2', '#9c27b0', '#4caf50'][idx % 3],
                        }}
                      />
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ lineHeight: 1.2, m: 0 }}
                        >
                          {login.loginTime}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ lineHeight: 1.2, m: 0 }}
                        >
                          IP: {login.ip}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right part: icon */}
                    {login.source?.toLowerCase() === 'web' && (
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: '#e3f2fd',
                          border: '2px solid #1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LaptopMacIcon sx={{ color: '#1976d2', fontSize: 16 }} />
                      </Box>
                    )}

                    {login.source?.toLowerCase() === 'mobile' && (
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: '#f3e5f5', // light purple background
                          border: '2px solid #9c27b0', // purple border
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PhoneIphoneIcon sx={{ color: '#9c27b0', fontSize: 16 }} />
                      </Box>

                    )}
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
        {/* ------------------ Stock-Wise Distribution ------------------ */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ ...glassStyles, p: 2 }}>
            {/*--------- Title --------- */}
            <Box sx={{ mb: 1 }}>
              {!isMobile ? (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 0,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700} textAlign="center" sx={{ m: 0 }}>
                    Stock-Wise Distribution
                  </Typography>
                  <Box sx={{ position: 'absolute', right: 0 }}>
                    <DropdownMenu selected={selected} setSelected={setSelected} />
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    textAlign="left"
                    sx={{ m: 0 }}
                  >
                    Stock-Wise Distribution
                  </Typography>
                  <DropdownMenu selected={selected} setSelected={setSelected} />
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 1 }} />

            <DialogContent sx={{ overflow: 'hidden', px: { xs: 1, sm: 2 }, pt: 0, pb: 0 }}>
              {asserts && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    alignItems: 'stretch',
                  }}
                >
                  {/* Company list */}
                  <Box
                    ref={listRef}
                    sx={{
                      flex: 1,
                      maxHeight: { xs: 220, sm: 280 },
                      overflowY: 'auto',
                      overflowX: 'hidden',
                      px: 0.5,
                      '&::-webkit-scrollbar': { display: 'none' },
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#90caf9 transparent',
                    }}
                  >
                    {Object.entries(asserts).map(([name, details], i) => (
                      <Box
                        key={i}
                        ref={(el) => (companyRefs.current[name] = el)}
                        onClick={() => showChartTooltip(i)}
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: 1,
                          boxShadow: 1,
                          cursor: 'pointer',
                          backgroundColor: highlightedStock === name ? 'primary.light' : 'background.paper',
                          transition: 'background-color 0.4s ease, transform 0.3s ease',
                          transform: highlightedStock === name ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: details.pl >= 0 ? 'success.main' : 'error.main',
                              fontWeight: 600,
                              lineHeight: 1.2,
                              m: 0,
                            }}
                          >
                            P/L: ₹{details.pl}
                          </Typography>
                          <Typography fontWeight={600} variant="subtitle2" sx={{ lineHeight: 1.2, m: 0 }}>
                            {name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                            Price: ₹{details.price}
                          </Typography>
                          <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                            Qty: {details.qty}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Chart */}
                  <Box
                    sx={{
                      flex: 1,
                      width: '100%',
                      maxWidth: { xs: '100%', md: 400 },
                      height: { xs: 250, sm: 300 },
                      mx: 'auto',
                      position: 'relative',
                    }}
                  >
                    <Doughnut
                      data={{
                        labels: [],
                        datasets: [
                          {
                            label: "Small Cap",
                            data: smallCapData,
                            backgroundColor: smallCapColors,
                            borderColor: "#222",
                            borderWidth: 1,
                          },
                          {
                            label: "Mid Cap",
                            data: midCapData,
                            backgroundColor: midCapColors,
                            borderColor: "#222",
                            borderWidth: 1,
                          },
                          {
                            label: "Large Cap",
                            data: largeCapData,
                            backgroundColor: largeCapColors,
                            borderColor: "#222",
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false, // Keep or try removing to test
                        cutout: "50%",
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              usePointStyle: true,
                              pointStyle: 'circle',
                              color: theme.palette.text.primary,
                              padding: 20,
                              generateLabels: (chart) => {
                                return chart.data.datasets.map((dataset, i) => ({
                                  text: dataset.label,
                                  fillStyle: dataset.backgroundColor[0],
                                  strokeStyle: dataset.borderColor,
                                  lineWidth: 1,
                                  hidden: false,
                                  index: i,
                                }));
                              },
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: function (context) {
                                const datasetLabel = context.dataset.label;
                                const dataIndex = context.dataIndex;
                                let name = "";

                                if (datasetLabel === "Small Cap") name = smallCapNames[dataIndex];
                                else if (datasetLabel === "Mid Cap") name = midCapNames[dataIndex];
                                else if (datasetLabel === "Large Cap") name = largeCapNames[dataIndex];

                                const asset = asserts[name];
                                return `${name}: Qty ${asset.qty}, P/L ₹${asset.pl.toLocaleString("en-IN")}`;
                              },
                            },
                          },
                        },
                        onClick: (_, elements) => {
                          if (elements.length > 0) {
                            const datasetIndex = elements[0].datasetIndex;
                            const dataIndex = elements[0].index;
                            let stockName = "";

                            if (datasetIndex === 0) stockName = smallCapNames[dataIndex];
                            else if (datasetIndex === 1) stockName = midCapNames[dataIndex];
                            else if (datasetIndex === 2) stockName = largeCapNames[dataIndex];

                            scrollToCompany(stockName);
                          }
                        },
                      }}
                      height={250}  // ⭐ Optional fallback
                      width={250}
                    />
                  </Box>
                </Box>
              )}
            </DialogContent>
          </Paper>
        </Grid>

        {console.log("ZZZZZZZZZZ")}
        {/*--------------------- LAST 3 CARDS ---------------------*/}
        <Grid item xs={12}>
          <Grid container spacing={0.5}>
            {['Scripts in Trends', 'Top Gainers', 'Top Losers'].map((title, index) => {
              const headerColor = '#fff';
              const gradientBg =
                index === 1
                  ? 'linear-gradient(to right,rgb(11, 122, 43), #d0f0d2)'
                  : index === 2
                    ? 'linear-gradient(to right,rgb(189, 29, 11),rgb(219, 182, 185))'
                    : 'linear-gradient(to right,rgb(10, 57, 90),rgb(184, 207, 226))';

              const shadowColor =
                index === 1
                  ? 'rgba(76, 175, 80, 0.5)' // green shadow
                  : index === 2
                    ? 'rgba(244, 67, 54, 0.5)' // red shadow
                    : 'rgba(33, 150, 243, 0.5)'; // blue shadow

              const stocks = index === 0
                ? trendStocks
                : index === 1
                  ? [
                    { name: 'ADANIPORTS', ltp: '₹845.30', change: '+4.2%', qty: 75, rate: '830.00', id: '#31452391', time: '12-07-2025 05:35:10', commission: 0 },
                  ]
                  : [
                    { name: 'WIPRO', ltp: '₹412.40', change: '-₹12.50', qty: 100, rate: '425.00', id: '#31452392', time: '12-07-2025 06:01:23', commission: 0 },
                  ];

              return (
                <Grid key={index} item xs={12} md={4}>
                  <Paper
                    elevation={3}
                    sx={{
                      height: boxHeight,
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' },
                      borderRadius: 2,
                      boxShadow: `0 0 10px ${shadowColor}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        position: 'sticky',
                        top: 0,
                        background: gradientBg,
                        backdropFilter: 'blur(6px)',
                        zIndex: 1,
                        py: 0.5,
                        px: 1,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: headerColor,
                        fontSize: '1rem',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {title}
                    </Typography>

                    {stocks.map((stock, idx) => {
                      const isPositive = stock.per >= 0;
                      const changeColor = isPositive ? '#2196f3' : '#f44336';

                      return (
                        <Paper
                          key={idx}
                          elevation={1}
                          onClick={() => {
                            setSelectedStock({
                              script_id: stock.Id,
                              name: stock.name,
                              ltp: stock.ltp,
                              per: stock.per,
                              rateChange: stock.rateChange,
                              data: generateCandleData(stock.name),
                            });
                            setCandleOpen(true);
                          }}
                          sx={{
                            mb: 0.5,
                            mt: 0.5,
                            mr: 0.5,
                            ml: 0.5,
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: `1px solid ${changeColor}`,
                            boxShadow: `0 2px 5px ${shadowColor}`,
                            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                            '&:hover': {
                              transform: 'scale(1.01)',
                              boxShadow: `0 4px 12px ${shadowColor}`,
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" px={0.5}>
                            {/* Square avatar */}
                            <Avatar
                              variant="square"
                              sx={{
                                bgcolor: changeColor,
                                width: 32,
                                height: 32,
                                mr: 1,
                                fontSize: 14,
                                fontWeight: 600,
                              }}
                            >
                              {stock.name.charAt(0)}
                            </Avatar>

                            {/* Main content */}
                            <Box flexGrow={1}>
                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {stock.name}
                                </Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  ₹{Number(stock.ltp).toLocaleString()}
                                </Typography>
                              </Box>

                              <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography
                                  variant="body2"
                                  color={isPositive ? 'success.main' : 'error.main'}
                                  fontWeight={600}
                                >
                                  {isPositive ? `+${stock.per}%` : `${stock.per}%`}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color={isPositive ? 'success.main' : 'error.main'}
                                  fontWeight={600}
                                >
                                  ₹{Number(stock.rateChange).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Grid>


        <Dialog
          open={candleOpen}
          onClose={() => setCandleOpen(false)}
          fullWidth
          fullScreen={isMobile}
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh", // Ensures 100% height on mobile
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 1,
              backdropFilter: "blur(6px)",
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              borderTopLeftRadius: isMobile ? 0 : "8px",
              borderTopRightRadius: isMobile ? 0 : "8px",
              zIndex: 10,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                textTransform: "uppercase",
                letterSpacing: 1.5,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                textShadow: "0 0 6px rgba(33,203,243,0.9)",
              }}
            >
              <ShowChartIcon sx={{ mr: 1, fontSize: "2rem", color: "#fff" }} />
              {selectedStock?.name || "Stock Details"}
            </Typography>

            <IconButton
              size="small"
              sx={{
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
              onClick={() => setCandleOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              bgcolor: "background.paper",
              ".MuiTab-root": { fontWeight: 600, textTransform: "none" },
            }}
          >
            <Tab label="Basic" />
            <Tab label="Trades" />
            <Tab label="Positions" />
            <Tab label="Charts" />
          </Tabs>

          {/* Content - takes full remaining height */}
          <DialogContent
            dividers
            sx={{
              px: 0,
              py: 0,
              flex: 1, // Grows to fill remaining vertical space
              overflow: "auto", // Allows scrolling
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            {tabValue === 0 && selectedStock && (
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  {[
                    { label: "LTP", value: `₹${exampleStock.ltp}` },
                    { label: "Price Change", value: exampleStock.priceChange },
                    { label: "% Change", value: `${exampleStock.pricePercentChange}%` },
                    { label: "Open", value: `₹${exampleStock.open}` },
                    { label: "High", value: `₹${exampleStock.high}` },
                    { label: "Low", value: `₹${exampleStock.low}` },
                    { label: "Close", value: `₹${exampleStock.close}` },
                    { label: "Bid Rate", value: `₹${exampleStock.bidRate}` },
                    { label: "Ask Rate", value: `₹${exampleStock.askRate}` },
                    { label: "Volume", value: exampleStock.volumeOi },
                    { label: "OI", value: exampleStock.volumeOi },
                    { label: "Min Order", value: exampleStock.minOrder },
                    { label: "Max Order", value: exampleStock.maxOrder },
                  ].map((item, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {item.value}
                      </Typography>
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Positions
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {exampleStock.positions}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      Short Description
                    </Typography>
                    <Typography variant="body2">
                      {exampleStock.shortDescription}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                      Long Description
                    </Typography>
                    <Typography variant="body2">
                      {exampleStock.longDescription}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {tabValue === 1 && selectedStock && (
              <>
                {loadingTrades ? (
                  <Typography sx={{ p: 2 }}>Loading...</Typography>
                ) : tradesError ? (
                  <Typography color="error" sx={{ p: 2 }}>{tradesError}</Typography>
                ) : tradesData.length === 0 ? (
                  <Typography sx={{ p: 2 }}>No trades found</Typography>
                ) : (
                  <>
                    {/* Pagination Logic */}
                    {(() => {
                      const pageSize = 10;
                      const totalPages = Math.ceil(tradesData.length / pageSize);
                      const paginatedTrades = tradesData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

                      return (
                        <>
                          {isMobile ? (
                            paginatedTrades.map((item, index) => {
                              const [mainName, subName] = item.scrp_name.split(" ", 2);
                              const cleanRate = item.trd_rate?.split("(")[0].trim();
                              const isBuy = item.trd_type === "Buy";
                              const isSell = item.trd_type === "Sell";

                              const borderGradient = isBuy
                                ? "linear-gradient(to right, #2196f3, #21cbf3)"
                                : isSell
                                  ? "linear-gradient(to right, #f44336, #ff7961)"
                                  : "#ccc";

                              const boxShadowColor = isBuy
                                ? "rgba(33, 150, 243, 0.3)"
                                : isSell
                                  ? "rgba(244, 67, 54, 0.3)"
                                  : "rgba(0,0,0,0.1)";

                              return (
                                <Card
                                  key={item.trd_id || index}
                                  sx={{
                                    mb: 1,
                                    mx: 1,
                                    borderRadius: 2,
                                    border: "1px solid transparent",
                                    backgroundImage: `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"}), ${borderGradient}`,
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "content-box, border-box",
                                    boxShadow: `0 4px 12px ${boxShadowColor}`,
                                    position: "relative",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                      transform: "scale(1.02)",
                                      boxShadow: `0 8px 20px ${boxShadowColor}`,
                                    },
                                  }}
                                >
                                  {item.is_hot && (
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        backgroundColor: "gold",
                                        color: "#000",
                                        fontSize: "0.7em",
                                        px: 1,
                                        py: 0.3,
                                        borderBottomLeftRadius: 4,
                                        fontWeight: 700,
                                      }}
                                    >
                                      HOT
                                    </Box>
                                  )}
                                  <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                        {mainName} <span style={{ fontSize: "0.8em", fontWeight: 500 }}>{subName}</span>
                                      </Typography>
                                      <Typography variant="caption">ID: #{item.trd_id}</Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                          variant="body2"
                                          component="span"
                                          dangerouslySetInnerHTML={{ __html: item.device_type_html }}
                                          sx={{ mr: 0.3 }}
                                        />
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            color: isBuy ? "#2196f3" : isSell ? "#f44336" : "inherit",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          {isBuy ? "📈" : isSell ? "📉" : ""} {item.trd_type}{" "}
                                          <span style={{ fontSize: "0.8em", fontWeight: 400 }}>{item.trd_type2}</span>
                                        </Typography>
                                      </Box>

                                      <Typography variant="body2">
                                        ({item.trd_lot}) {item.actual_lot_qty} @{" "}
                                        <span style={{ fontWeight: 700 }}>{cleanRate}</span>
                                      </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <Typography variant="caption">{item.trd_time}</Typography>
                                      <Typography variant="caption">
                                        Commission: <span style={{ fontWeight: 700, color: "#2e7d32" }}>{item.trd_comm_amnt}</span>
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
                              );
                            })
                          ) : (
                            <Box sx={{ overflowX: "auto", border: "1px solid #ddd", mx: 1 }}>
                              <table
                                className="table table-striped table-bordered"
                                style={{
                                  minWidth: "1350px",
                                  fontSize: "12px",
                                  margin: 0,
                                  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                  color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                }}
                              >
                                <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                                  <tr>
                                    {["Device", "Time", "Trade ID", "Client", "Market", "Script", "B/S", "Order Type", "Lot", "Qty", "Order Price", "Status", "O. Time", "Comm Amt"].map((header) => (
                                      <th key={header} style={{ fontWeight: 600 }}>
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {paginatedTrades.map((item, index) => (
                                    <tr
                                      key={item.trd_id || index}
                                      style={{
                                        backgroundColor:
                                          item.trd_type === "Buy"
                                            ? theme.palette.mode === "dark" ? "#264653" : "#e0f7fa"
                                            : item.trd_type === "Sell"
                                              ? theme.palette.mode === "dark" ? "#6d2c41" : "#fce4ec"
                                              : theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
                                      }}
                                    >
                                      <td dangerouslySetInnerHTML={{ __html: item.device_type_html }} />
                                      <td>{item.trd_matchedtime}</td>
                                      <td>#{item.trd_id}</td>
                                      <td>{item.client_full_name}</td>
                                      <td>{item.mrkt_name}</td>
                                      <td>{item.scrp_name}</td>
                                      <td>{item.trd_type}</td>
                                      <td>{item.trd_type2}</td>
                                      <td>{item.trd_lot}</td>
                                      <td>{item.actual_lot_qty}</td>
                                      <td>{item.trd_rate}</td>
                                      <td>{item.trd_status}</td>
                                      <td>{item.trd_time}</td>
                                      <td>{item.trd_comm_amnt}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </Box>
                          )}

                          {/* Pagination Controls */}
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, py: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                              <Button
                                size="small"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                color="secondary"
                                sx={{ mr: 1 }}
                              >
                                Prev
                              </Button>

                              {[...Array(totalPages)].map((_, i) => {
                                if (
                                  i === 0 ||
                                  i === totalPages - 1 ||
                                  (i >= currentPage - 1 && i <= currentPage + 1)
                                ) {
                                  return (
                                    <Button
                                      key={i}
                                      size="small"
                                      variant={i === currentPage ? "contained" : "outlined"}
                                      color="secondary"
                                      onClick={() => setCurrentPage(i)}
                                      sx={{ mx: 0.3, minWidth: "30px" }}
                                    >
                                      {i + 1}
                                    </Button>
                                  );
                                }
                                if (
                                  (i === 1 && currentPage > 2) ||
                                  (i === totalPages - 2 && currentPage < totalPages - 3)
                                ) {
                                  return (
                                    <Typography key={i} sx={{ mx: 0.5 }}>
                                      ...
                                    </Typography>
                                  );
                                }
                                return null;
                              })}

                              <Button
                                size="small"
                                disabled={currentPage + 1 >= totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                color="secondary"
                                sx={{ ml: 1 }}
                              >
                                Next
                              </Button>
                            </Box>
                          </Box>
                        </>
                      );
                    })()}
                  </>
                )}
              </>
            )}

            {tabValue === 2 && (
              <>
                {/* Content */}
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredPositions.length === 0 ? (
                  <Typography sx={{ p: 2 }}>No position data found.</Typography>
                ) : isMobile ? (
                  <Box sx={{ p: 1 }}>
                    {filteredPositions.map((row, index) => {
                      const scriptHtml = row?.script_name || "";
                      const parts = scriptHtml.split("<br>");
                      const mainName = parts[0] || "";
                      const datePart = parts[1] || "";

                      const currentValue = row.total_buy * row.last_trade_price;
                      const todaysPL = -203.0;
                      const unrealizedPL = 8170;
                      const unrealizedPLPerc = 10.62;

                      return (
                        <Box
                          key={index}
                          sx={{
                            m: 0.5,
                            border: (theme) => `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 2,
                            backgroundColor: (theme) => theme.palette.background.paper,
                            boxShadow: 1,
                          }}
                        >
                          {/* Top Row */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 1,
                              pt: 0.8,
                              pb: 0.6,
                            }}
                          >
                            {/* Left: Avatar + Script Name + Expiry */}
                            <Box sx={{ display: "flex", alignItems: "flex-start", minWidth: 0, flex: 1 }}>
                              <Avatar
                                alt={mainName.replace(/<\/?[^>]+(>|$)/g, "")}
                                src="/path-to-your-logo.png"
                                variant="square"
                                sx={{ width: 28, height: 28, mr: 1 }}
                              />
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={700}
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    lineHeight: 1.2,
                                  }}
                                  dangerouslySetInnerHTML={{ __html: mainName }}
                                />
                                {datePart && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      opacity: 0.7,
                                      fontWeight: 500,
                                      lineHeight: 1.2,
                                      whiteSpace: "nowrap",
                                    }}
                                    dangerouslySetInnerHTML={{ __html: datePart }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {/* Center-right: Shopping Bag + Qty × Rate */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0,
                                mx: 1.5,
                                whiteSpace: "nowrap",
                              }}
                            >

                              <ShoppingBagIcon sx={{ fontSize: 11, color: "text.disabled" }} />
                              <Typography
                                variant="body2"
                                sx={{ fontSize: 11, fontWeight: 500 }}
                              >
                                {row.total_buy} × {row.buy_avg_rate}
                              </Typography>
                            </Box>

                            {/* Right: Last Trade Price + % Change */}
                            <Box sx={{ textAlign: "right", minWidth: 70 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700 }}
                              >
                                {row.last_trade_price}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color:
                                    row.change_value < 0
                                      ? (theme) => theme.palette.error.main
                                      : (theme) => theme.palette.success.main,
                                }}
                              >
                                {row.change_value} ({row.change_perc}%)
                              </Typography>
                            </Box>
                          </Box>


                          {/* Bottom Row */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                              py: 0.5,
                              px: 1,
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2">
                                {isNaN(currentValue)
                                  ? "---"
                                  : currentValue >= 1000
                                    ? `${(currentValue / 1000).toFixed(2)}K`
                                    : currentValue.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Current Value
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="error.main">
                                {todaysPL.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Today’s P&L
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="success.main">
                                +{unrealizedPL >= 1000
                                  ? `${(unrealizedPL / 1000).toFixed(2)}K`
                                  : unrealizedPL.toFixed(2)}
                                <Typography component="span" variant="caption" sx={{ color: "success.main" }}>
                                  ({unrealizedPLPerc}%)
                                </Typography>
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Unrealized P&L
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      height: "100%",
                      overflow: "hidden",
                      mx: 1,
                      my: 1,
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        border: "1px solid #ddd",
                      }}
                    >
                      <Table sx={{ minWidth: 1350, fontSize: "12px" }}>
                        <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                          <TableRow>
                            <TableCell>Market Type</TableCell>
                            <TableCell>Script</TableCell>
                            <TableCell>Total Buy</TableCell>
                            <TableCell>Buy Avg Rate</TableCell>
                            <TableCell>Total Sell</TableCell>
                            <TableCell>Sell Avg Rate</TableCell>
                            <TableCell>Net Qty</TableCell>
                            <TableCell>Last Trade Price</TableCell>
                            <TableCell>MTM</TableCell>
                            <TableCell>Auto Closed Date</TableCell>
                            <TableCell>Close Btn</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredPositions.map((row, index) => {
                            const isEven = index % 2 === 0;
                            const rowBgColor =
                              theme.palette.mode === "dark"
                                ? isEven
                                  ? "#2a2a2a"
                                  : "#1f1f1f"
                                : isEven
                                  ? "#f9f9f9"
                                  : "#ffffff";
                            return (
                              <TableRow key={index} sx={{ backgroundColor: rowBgColor }}>
                                <TableCell>{row.market_type_name}</TableCell>
                                <TableCell>
                                  <span dangerouslySetInnerHTML={{ __html: row.script_name }} />
                                </TableCell>
                                <TableCell>{row.total_buy}</TableCell>
                                <TableCell>{row.buy_avg_rate}</TableCell>
                                <TableCell>{row.total_sell}</TableCell>
                                <TableCell>{row.sell_avg_rate}</TableCell>
                                <TableCell>{row.net_qty}</TableCell>
                                <TableCell>{row.last_trade_price}</TableCell>
                                <TableCell>
                                  <span dangerouslySetInnerHTML={{ __html: row.mym_html }} />
                                </TableCell>
                                <TableCell>{row.trade_auto_closed_date}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => alert("Close Position")}
                                  >
                                    Close
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                )}
              </>
            )}

            {tabValue === 3 && selectedStock && (
              <Box>
                <ApexCharts name={selectedStock.name} data={selectedStock.data} theme={theme} />
              </Box>
            )}
          </DialogContent>
        </Dialog>


      </Grid>

    </Box>
  );
}

export default PersonalDashboard;

// function PersonalDashboard() {
//   // const title = brand.name + ' - Personal Dashboard';
//   // const description = brand.desc;

//   // const lgDown = useMediaQuery(theme => theme.breakpoints.down('lg'));
//   // const { classes } = useStyles();

//   // return (
//   //   <div>
//   //     <Helmet>
//   //       <title>{title}</title>
//   //       <meta name="description" content={description} />
//   //       <meta property="og:title" content={title} />
//   //       <meta property="og:description" content={description} />
//   //       <meta property="twitter:title" content={title} />
//   //       <meta property="twitter:description" content={description} />
//   //     </Helmet>
//   //     {/* 1st Section */}
//   //     {/* <Grid container spacing={3} className={classes.root}>
//   //       <Grid item md={6} xs={12}>
//   //         <CounterIconsWidget />
//   //       </Grid>
//   //       <Grid item md={6} sm={12} xs={12}>
//   //         <div className={classes.sliderWrap}>
//   //           <SliderWidget />
//   //         </div>
//   //       </Grid>
//   //     </Grid> */}
//   //     <Divider className={classes.divider} />
//   //     {/* 2nd Section */}
//   //     <Grid container spacing={2} className={classes.root}>
//   //       <Grid item xs={12}>
//   //         <PerformanceChartWidget />
//   //       </Grid>
//   //     </Grid>
//   //     {/* 3rd Section */}
//   //     <Grid container spacing={3} className={classes.root}>
//   //       <Grid item md={6} xs={12}>
//   //         <Divider className={classes.divider} />
//   //         <ContactWidget />
//   //         <Divider className={classes.divider} />
//   //         <TaskWidget />
//   //       </Grid>
//   //       <Grid item md={6} xs={12}>
//   //         {!lgDown && (
//   //           <Divider className={classes.divider} />
//   //         )}
//   //         <WeatherWidget />
//   //         <Divider className={classes.divider} />
//   //         <DateWidget />
//   //         <Divider className={classes.divider} />
//   //         <TimelineWidget />
//   //       </Grid>
//   //     </Grid>
//   //     <Divider className={classes.divider} />
//   //     <FilesWidget />
//   //   </div>
//   // );
// }

