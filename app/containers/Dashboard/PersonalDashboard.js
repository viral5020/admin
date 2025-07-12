import React, { useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import '@fortawesome/fontawesome-free/css/all.min.css';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, FormControl, InputLabel, Select, MenuItem,
  Grid, Paper, TextField, Card, CardContent, Typography, Box, Divider, useMediaQuery as useMUIQuery,
} from '@mui/material';

import { Tabs, Tab } from '@mui/material';

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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import brand from 'dan-api/dummy/brand';
import DropdownMenu from './DropdownMenu'
import ApexCharts from './Apexcharts.js';
import axios from 'axios';

import { data } from 'dan-vendor/autoprefixer/lib/autoprefixer';
import { motion, AnimatePresence } from 'framer-motion';

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

const handleOpenDialog = () => {
  setSelectedStock(exampleStock);
  setTabValue(0);        // open Basic tab by default
  setCandleOpen(true);   // show the dialog
};

const boxHeight = 300;

function PersonalDashboard() {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));

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
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [visibleCount, setVisibleCount] = useState(10);
  const [positionDialogOpen, setpositionDialogOpen] = useState(false);

  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleOrders = orders.slice(0, visibleCount);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };


  // Chart ref
  const chartRef = useRef(null);
  const sectorChart = useRef(null);

  // margin collapse expand
  const handleShowMore = () => {
    setShowMore(true);
  };
  const handleCollapse = () => {
    setShowMore(false);
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


  const fetchLoginData = async () => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const res = await axios.post('http://128.199.126.171/~goldorg/datatables/get_login_data_details', {
        is_app: 1,
        login_user_id: dataStored.user_id,
        auth_key: dataStored.auth_key,
      });

      if (res.data.status === 'ok' && Array.isArray(res.data.data)) {
        setLoginData(res.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Login data fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchOrders = async (type = "today", searchValue = "") => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const formData = {
      sEcho: 1,
      iDisplayStart: 0,
      iDisplayLength: 100,
      sSearch: searchValue,
      is_app: 1,
      login_user_id: dataStored.user_id,
      auth_key: dataStored.auth_key,
      isTodayTrade: type === "today" ? "today" : "",
    };

    try {
      const response = await fetch("http://128.199.126.171/~goldorg/datatables/order_book_new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setOrders(data.aaData || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchCount = async (type = "today") => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const formData = {
      sEcho: 1,
      iDisplayStart: 0,
      iDisplayLength: 1, // Only need count
      sSearch: "",
      is_app: 1,
      login_user_id: dataStored.user_id,
      auth_key: dataStored.auth_key,
      isTodayTrade: type === "today" ? "today" : "",
    };

    try {
      const response = await fetch("http://128.199.126.171/~goldorg/datatables/order_book_new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      return data.iTotalRecords || 0;
    } catch (error) {
      console.error(`Error fetching ${type} orders count:`, error);
      return 0;
    }
  };
  const paginatedOrders = orders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
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
  }, [filterType]);

  useEffect(() => {
    const getCounts = async () => {
      const today = await fetchCount("today");
      setTodayCount(today);

      const week = await fetchCount("all");
      setWeekCount(week);
    };

    getCounts();
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
              content={[`Today: ${todayCount}`, `This Week: ${weekCount}`]}
              bgcolor="rgba(156, 39, 176, 0.1)"
            />
          </Box>
        </Grid>

        <Dialog
          open={ordersDialogOpen}
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              setOrdersDialogOpen(false);
            }
          }}
          fullWidth
          maxWidth="xl"
          disableEscapeKeyDown
        >
          <Box sx={{ p: 0 }}>
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
              <Typography variant="h6" fontWeight={600} color={(theme) => theme.palette.mode === "dark" ? "#fff" : "#000"}>
                Order Details
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select value={filterType} label="Filter" onChange={handleFilterChange}>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="all">This Week</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Search orders"
                  value={searchText}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  sx={{ ml: 1 }}
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

                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", px: 1, py: 1 }}>
                      <Button
                        onClick={() => setOrdersDialogOpen(false)}
                        variant="contained"
                        color="secondary"
                        size="small"
                      >
                        Close
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        overflowX: "auto",
                        border: "1px solid #ddd",
                        borderRadius: "0px",
                      }}
                    >
                      <table
                        className="table table-striped table-bordered"
                        style={{
                          minWidth: "1350px",
                          fontSize: "12px",
                          margin: 0,
                          backgroundColor: (theme) => theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                          color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000",
                        }}
                      >
                        <thead style={{ backgroundColor: (theme) => theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                          <tr>
                            {["Device", "Time", "Trade ID", "Client", "Market", "Script", "B/S", "Order Type", "Lot", "Qty", "Order Price", "Status", "O. Time", "Comm Amt"].map((header) => (
                              <th key={header} style={{ color: (theme) => theme.palette.mode === "dark" ? "#fff" : "#000", fontWeight: 600 }}>{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.map((item, index) => (
                            <tr
                              key={item.trd_id || index}
                              style={{
                                backgroundColor:
                                  item.trd_type === "Buy"
                                    ? (theme) => theme.palette.mode === "dark" ? "#264653" : "#e0f7fa"
                                    : item.trd_type === "Sell"
                                      ? (theme) => theme.palette.mode === "dark" ? "#6d2c41" : "#fce4ec"
                                      : (theme) => theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
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

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, py: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Button
                          size="small"
                          disabled={currentPage === 0}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          color="secondary"
                          sx={{ mr: 1 }}
                        >
                          Prev
                        </Button>
                        <Typography sx={{ fontSize: "12px" }}>
                          Page {currentPage + 1} / {Math.ceil(orders.length / itemsPerPage)}
                        </Typography>
                        <Button
                          size="small"
                          disabled={(currentPage + 1) * itemsPerPage >= orders.length}
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          color="secondary"
                          sx={{ ml: 1 }}
                        >
                          Next
                        </Button>
                      </Box>
                      <Button
                        onClick={() => setOrdersDialogOpen(false)}
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Close
                      </Button>
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
              content={['Active: 10', 'Closed: 50']}
              bgcolor="rgba(76, 175, 80, 0.1)"
            />
          </Box>
        </Grid>

        <Dialog open={positionDialogOpen} onClose={() => setpositionDialogOpen(false)} fullWidth maxWidth="sm">
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Positions Details
            </Typography>
            <Typography>
              Here you can show detailed positions data, table, or anything you like!
            </Typography>
          </Box>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setpositionDialogOpen(false)} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Grid item xs={12} sm={6} md={3}>
          <InfoCardHorizontal
            title="Pending Orders"
            icon={<AccessTimeIcon sx={{ color: '#ff9800', fontSize: 30 }} />}
            content={['7']}
            bgcolor="rgba(255, 152, 0, 0.1)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCardHorizontal
            title="Rejection Logs"
            icon={<CloseIcon sx={{ color: '#d32f2f', fontSize: 30 }} />}
            content={['Today: 50', 'This Week: 10']}
            bgcolor="rgba(206, 48, 48, 0.1)"
          />
        </Grid>


        <Box
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
        </Box>
        {/* --------- InfoCards ------------ */}
        {/* <Grid item xs={12} sm={6} md={3}>
          <AnimatePresence mode="wait">
            {!showMore ? (
              <motion.div
                key="compact"
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              // transition={{ type: 'spring', stiffness: 200 }}
              // transition={{ duration: 0 }}
              >
                <InfoCardHorizontal
                  title="Margin"
                  icon={<AccountBalanceWalletIcon sx={{ color: '#1976d2', fontSize: 30 }} />}
                  content={[
                    ...(Array.isArray(margindata)
                      ? margindata.slice(0, 2).map((exchange) => (
                        <Typography
                          key={exchange.key}
                          variant="body2"
                          sx={{ fontWeight: 500 }}
                        >
                          {exchange.label.replace(/_/g, ' ').toUpperCase()}: {exchange.value}
                        </Typography>
                      ))
                      : []),
                    <Typography
                      key="more"
                      variant="body2"
                      sx={{ cursor: 'pointer', fontWeight: 500, color: '#1976d2' }}
                      onClick={handleShowMore}
                    >
                      More
                    </Typography>,
                  ]}
                  bgcolor="rgba(25, 118, 210, 0.1)"
                />
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                variants={animationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <InfoCardHorizontal
                  title="Margin"
                  icon={<AccountBalanceWalletIcon sx={{ color: '#1976d2', fontSize: 30 }} />}
                  content={[
                    ...(Array.isArray(margindata)
                      ? margindata.map((exchange) => (
                        <Typography
                          key={exchange.key}
                          variant="body2"
                          sx={{ fontWeight: 500 }}
                        >
                          {exchange.label.replace(/_/g, ' ').toUpperCase()}: {exchange.value}
                        </Typography>
                      ))
                      : []),
                    <Typography
                      key="collapse"
                      variant="body2"
                      sx={{ cursor: 'pointer', fontWeight: 500, color: '#1976d2' }}
                      onClick={handleCollapse}
                    >
                      Collapse
                    </Typography>,
                  ]}
                  bgcolor="rgba(25, 118, 210, 0.1)"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Grid> */}

        {/*--------------------- Sector-wise Distribution ---------------------- */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={glassStyles}>
            <Box sx={{ mb: 1 }}> {/* Reduced bottom margin of outer Box */}
              {!isMobile ? (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
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
            <Divider sx={{ mb: 1 }} /> {/* Reduced vertical margin */}
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
                      position: 'relative', // ⭐ Added
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

        {/*--------------------- LAST 3 CARDS ---------------------*/}
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {['Scripts in Trend', 'Top Gainers', 'Top Losers'].map((title, index) => {
              const headerColor = index === 1 ? 'green' : index === 2 ? 'red' : theme.palette.primary.main;
              const gradientBg =
                index === 1
                  ? 'linear-gradient(to right, #e6f4ea, #d0f0d2)'
                  : index === 2
                    ? 'linear-gradient(to right, #fdecea, #f8d7da)'
                    : 'linear-gradient(to right, #e3f2fd, #bbdefb)';

              return (
                <Grid key={index} item xs={12} md={4}>
                  <Paper
                    elevation={3}
                    sx={{
                      ...glassStyles,
                      height: boxHeight,
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': { display: 'none' },
                      borderRadius: 3,
                      boxShadow: theme.shadows[6],
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      mb={1}
                      sx={{
                        position: 'sticky',
                        top: 0,
                        background: gradientBg,
                        backdropFilter: 'blur(8px)',
                        zIndex: 1,
                        pb: 0.8,
                        pt: 0.8,
                        px: 1.5,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: headerColor,
                        fontSize: '1.05rem',
                        letterSpacing: '0.4px',
                      }}
                    >
                      {title}
                    </Typography>
                    {(index === 0 ? [
                      { name: 'RELIANCE', ltp: '₹2,485.50', change: '+1.2%' },
                      { name: 'TCS', ltp: '₹3,265.75', change: '-0.5%' },
                      { name: 'INFY', ltp: '₹1,542.30', change: '+0.8%' },
                      { name: 'HDFC', ltp: '₹1,923.90', change: '-1.1%' },
                    ] : index === 1 ? [
                      { name: 'ADANIPORTS', ltp: '₹845.30', change: '+4.2%' },
                      { name: 'TATAMOTORS', ltp: '₹892.75', change: '+3.9%' },
                      { name: 'BHARTIARTL', ltp: '₹1024.10', change: '+3.5%' },
                    ] : [
                      { name: 'WIPRO', ltp: '₹412.40', change: '-₹12.50' },
                      { name: 'TECHM', ltp: '₹492.75', change: '-₹9.80' },
                      { name: 'SBIN', ltp: '₹581.25', change: '-₹8.25' },
                    ]).map((stock, idx) => (
                      <Box
                        key={idx}
                        onClick={() => {
                          setSelectedStock({
                            name: stock.name,
                            data: generateCandleData(stock.name),
                          });
                          setCandleOpen(true);
                        }}
                        sx={{ cursor: 'pointer', mb: 1 }}
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            mr: 1,
                            backgroundColor:
                              index === 1
                                ? theme.palette.success.main
                                : index === 2
                                  ? theme.palette.error.main
                                  : '#ccc',
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.2 }}>
                            {stock.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                            LTP: {stock.ltp} |{' '}
                            <span style={{ color: index === 2 ? 'red' : 'green' }}>{stock.change}</span>
                          </Typography>
                        </Box>
                      </Box>
                    ))}
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
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 24,
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
              py: 2,
              background: "linear-gradient(90deg, #1976d2, #2196f3)",
              color: "white",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {selectedStock?.name || "Stock Details"}
            </Typography>
            <CloseIcon
              sx={{ cursor: "pointer" }}
              onClick={() => setCandleOpen(false)}
            />
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
              px: 3,
              bgcolor: "background.paper",
              ".MuiTab-root": { fontWeight: 600, textTransform: "none" },
            }}
          >
            <Tab label="Basic" />
            <Tab label="Trades" />
            <Tab label="Positions" />
            <Tab label="Charts" />
          </Tabs>

          {/* Scrollable content */}
          <DialogContent dividers sx={{ p: 3, maxHeight: "65vh" }}>
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
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Long Description
                    </Typography>
                    <Typography variant="body2">
                      {exampleStock.longDescription}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {tabValue === 1 && (
              <Typography variant="body1">
                Trades data for {selectedStock?.name}.
              </Typography>
            )}

            {tabValue === 2 && (
              <Typography variant="body1">
                Positions data for {selectedStock?.name}.
              </Typography>
            )}

            {tabValue === 3 && selectedStock && (
              <Box>
                {/* Replace with your actual chart component */}
                {tabValue === 3 && selectedStock && (
                  <ApexCharts name={selectedStock.name} data={selectedStock.data} theme={theme} />
                )}
                {/* <ApexCharts name={selectedStock.name} data={selectedStock.data} theme={theme} /> */}
              </Box>
            )}
          </DialogContent>

          {/* <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => setCandleOpen(false)}
          variant="contained"
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions> */}
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


