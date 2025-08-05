import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, FormControl, InputLabel,
  Select, MenuItem, TextField, CircularProgress,
  Card, CardContent, Button, useTheme, useMediaQuery, Drawer
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OrderFilter from './OrderFilter';
import FilterBtn from './filters/FilterBtn';

const OrderBook = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = theme.palette.mode === 'dark';
  const isFirstRender = useIsFirstRender();

  const [status, setStatus] = useState();  // []
  const [end_date, setEnd_date] = useState('');
  const [start_end, setStart_end] = useState('');
  const [orderType, setOrderType] = useState('');  // trade_type
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("today");
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 800);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [isFilterChange, setIsFilterChange] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);


  const [market, setMarket] = useState({});
  const [script, setScript] = useState([]);
  const [client, setClient] = useState({});
  const [master, setMaster] = useState({});
  const [broker, setBroker] = useState({});

  const ordersPerPage = 10;

  useEffect(() => {
    console.log('end_date', end_date);
    console.log('start_end', start_end);
  }, [start_end, end_date])


  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const fetchOrders = async (type = "today", searchValue = "") => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    const formData = {
      sEcho: 1,
      iDisplayStart: (currentPage * ordersPerPage),
      iDisplayLength: ordersPerPage,
      sSearch: searchValue,
      is_app: 1,
      login_user_id: dataStored?.user_id,
      auth_key: dataStored?.auth_key,
      isTodayTrade: type === "today" ? "today" : "",
      end_date: end_date,
      start_end: start_end, //2025-07-30
      market_type_id: market?.id,
      script_id: JSON.stringify(script?.map(val => val.id)),
      broker_id: broker?.id,
      master_user_id: master?.id,
      user_id: client?.id,
      is_pending: status === 'is_pending' || '',
      is_executed: status === 'is_executed' || '',
      trade_type: orderType,
    };

    try {
      const response = await fetch("http://128.199.126.171/~goldorg/datatables/order_book_new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      isMobile
        ? isFilterChange
          ? setOrders(data.aaData || [])
          : setOrders(prev => [...prev, ...data.aaData])
        : setOrders(data.aaData || []);

      setTotalPages(Math.ceil(data.iTotalRecords / ordersPerPage));
      setTotalRecords(data.iTotalRecords);
      setIsFilterChange(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsFilterChange(true);
    setCurrentPage(0);
  }, [filterType, debouncedSearchText]);

  useEffect(() => {
    !isFirstRender && fetchOrders(filterType, searchText);
  }, [currentPage]);

  useEffect(() => {
    isFilterChange && !isFirstRender && fetchOrders(filterType, searchText);
  }, [isFilterChange])

  useEffect(() => {
    fetchOrders(filterType, searchText);
  }, []);

  return (
    <Box sx={{ p: 0, mt: 2 }}>

      {/* Filter Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280, p: 2 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleDrawer(false)}><CloseIcon /></IconButton>
          </Box>
          <OrderFilter
            isDarkMode={isDarkMode}
            setStatus={setStatus}
            setEnd_date={setEnd_date}
            setStart_end={setStart_end}
            setOrderType={setOrderType}
            status={status}
            end_date={end_date}
            start_end={start_end}
            orderType={orderType}
            setMarket={setMarket}
            setScript={setScript}
            setClient={setClient}
            setMaster={setMaster}
            setBroker={setBroker}
            market={market}
            script={script}
            client={client}
            master={master}
            broker={broker}
            onApply={fetchOrders}
          />
        </Box>
      </Drawer>

      {/* Desktop Filter Display */}
      {!isMobile && (
        <OrderFilter
          isDarkMode={isDarkMode}
          setStatus={setStatus}
          setEnd_date={setEnd_date}
          setStart_end={setStart_end}
          setOrderType={setOrderType}
          status={status}
          end_date={end_date}
          start_end={start_end}
          orderType={orderType}
          setMarket={setMarket}
          setScript={setScript}
          setClient={setClient}
          setMaster={setMaster}
          setBroker={setBroker}
          market={market}
          script={script}
          client={client}
          master={master}
          broker={broker}
          onApply={fetchOrders}
        />
      )}

      {/* Filter Options Row */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        px: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
        borderRadius: 1,
        gap: 1,
      }}>
        {/* IconButton LEFT of filter dropdown on mobile */}
        {isMobile && <FilterBtn setFilterOpen={setDrawerOpen} />}


        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filterType} label="Filter" onChange={(e) => setFilterType(e.target.value)}>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="all">This Week</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search orders"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          fullWidth
        // sx={{ ml: 1 }}
        />
      </Box>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Typography sx={{ px: 1, mt: 2 }}>No orders found.</Typography>
      ) : isMobile ? (
        <>
          {orders.map((item, index) => {
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
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: `0 8px 20px ${boxShadowColor}`,
                  },
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                <CardContent
                  sx={{
                    p: 0.5,
                    "&:last-child": { pb: 0.5 },
                  }}
                >
                  {/* Row 1 */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ m: 0, lineHeight: 1 }}>
                      {mainName} <span style={{ fontSize: "0.8em" }}>{subName}</span>
                    </Typography>
                    <Typography variant="caption" sx={{ m: 0, lineHeight: 1 }}>ID: #{item.trd_id}</Typography>
                  </Box>

                  {/* Row 2 */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <span dangerouslySetInnerHTML={{ __html: item.device_type_html }} />

                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          ml: 0.5,
                          fontSize: "1rem",
                        }}
                      >
                        {isBuy ? "📈" : isSell ? "📉" : ""}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: isBuy ? "#2196f3" : isSell ? "#f44336" : "#000",
                          ml: 0.5,
                          m: 0,
                          lineHeight: 1,
                        }}
                      >
                        {item.trd_type}
                        <span style={{ fontSize: "0.8em", fontWeight: 400 }}> {item.trd_type2}</span>
                      </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ m: 0, lineHeight: 1 }}>
                      ({item.trd_lot}) {item.actual_lot_qty} @ <strong>{cleanRate}</strong>
                    </Typography>
                  </Box>

                  {/* Row 3 */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ m: 0, lineHeight: 1 }}>{item.trd_time}</Typography>
                    <Typography variant="caption" sx={{ m: 0, lineHeight: 1 }}>
                      Comm: <strong style={{ color: "#2e7d32" }}>{item.trd_comm_amnt}</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>


            );
          })}

          {orders.length < totalRecords && (
            loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Button variant="outlined" onClick={() => setCurrentPage(prev => prev + 1)} size="small">
                  Load More
                </Button>
              </Box>
            )
          )}
        </>
      ) : (
        <>
          <Box
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "69vh",
              border: "1px solid #ddd",
              borderRadius: 1,
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
                {orders.map((item, index) => {
                  // let rowBgColor = theme.palette.mode === "dark" ? "#333" : "#f5f5f5";
                  // if (item.trd_type === "Buy") rowBgColor = theme.palette.mode === "dark" ? "#264653" : "#e0f7fa";
                  // if (item.trd_type === "Sell") rowBgColor = theme.palette.mode === "dark" ? "#6d2c41" : "#fce4ec";

                  const market = item.mrkt_name?.toUpperCase?.() || "DEFAULT";
                  let backgroundColor = "#9e9e9e";
                  if (market === "NSEFUT") backgroundColor = "#1976d2";
                  else if (market === "GLOBAL FUTURES") backgroundColor = "#388e3c";
                  else if (market === "MCXFUT") backgroundColor = "#8e24aa";
                  else if (market === "NYSE") backgroundColor = "#f57c00";

                  const [scriptPrefix, ...scriptRest] = item.scrp_name.split(" ");
                  const scriptSuffix = scriptRest.join(" ");

                  return (
                    <tr key={item.trd_id || index} >
                      <td dangerouslySetInnerHTML={{ __html: item.device_type_html }} />
                      <td>{item.trd_matchedtime}</td>
                      <td>
                        <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box component="span">
                            <Box component="span" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                              {scriptPrefix}
                            </Box>{" "}
                            <Box component="span" sx={{ fontSize: "10px" }}>
                              {scriptSuffix}
                            </Box>
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              fontSize: "10px",
                              px: 1,
                              borderRadius: "8px",
                              backgroundColor,
                              color: "#fff",
                              display: "inline-block",
                            }}
                          >
                            {item.mrkt_name}
                          </Box>
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
                      <td style={{ fontWeight: 700, color: theme.palette.text.primary }}>
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


          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
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
              if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                return (
                  <Button
                    key={i}
                    size="small"
                    variant={i === currentPage ? 'contained' : 'outlined'}
                    color="secondary"
                    onClick={() => setCurrentPage(i)}
                    sx={{ mx: 0.3, minWidth: '30px' }}
                  >
                    {i + 1}
                  </Button>
                );
              }
              if ((i === 1 && currentPage > 2) || (i === totalPages - 2 && currentPage < totalPages - 3)) {
                return <Typography key={i} sx={{ mx: 0.5 }}>...</Typography>;
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
            <TextField
                label="Go to page"
                type="number"
                size="small"
                InputProps={{ inputProps: { min: 1, max: totalPages } }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt(e.target.value, 10) - 1;
                    if (!isNaN(page) && page >= 0 && page < totalPages) {
                      setCurrentPage(page);
                    }
                  }
                }}
                sx={{ width: 100 }}
              />
          </Box>
        </>
      )}
    </Box>
  );
};

export default OrderBook;
