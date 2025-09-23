import React, { useEffect, useState } from 'react';
import {
  Box, Typography, IconButton, FormControl, InputLabel,
  Select, MenuItem, TextField, CircularProgress,
  Card, CardContent, Button, useTheme, useMediaQuery, Drawer,
  Dialog,
  DialogTitle
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';


import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
  LeadingActions
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import CancelIcon from '@mui/icons-material/Cancel';


import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ForexComexScriptFilter from './forexorderfilter';
import OrderFilter from './OrderFilter';
import ForexFilter from './forexfilter';
import FilterBtn from './filters/FilterBtn';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import { deleteTrade, fetchforexOrdersAPI, fetchforexTradesDataAPI, updateTrade } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';
import Pagination from './filters/Pagination';

const Forex_order = () => {
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
  const [isFilterChange, setIsFilterChange] = useState(false);

  // # Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelItem, setCancelItem] = useState(null);

  const [password, setPassword] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [selectedScripts, setSelectedScripts] = useState([]);
  const [script, setScript] = useState([]);

  const handleCancel = async (itemToCancel, enteredPassword = '') => {
    try {
      const payload = {
        trade_id: itemToCancel.trade_id,
        password: enteredPassword,
        device_type: 0,
      };

      console.log('Sending cancel payload:', payload);

      const response = await deleteTrade(payload);

      if (response.success) {
        alert('Trade cancelled successfully');
        // TODO: refresh data or update UI as needed
      } else {
        alert(response.message || 'Failed to cancel trade');
      }
    } catch (error) {
      alert('An error occurred while cancelling the trade.');
    }
  };


  // const [market, setMarket] = useState({});
  // const [script, setScript] = useState([]);
  const [client, setClient] = useState({});
  const [master, setMaster] = useState({});
  const [broker, setBroker] = useState({});

  // 1. Retrieve the raw data from sessionStorage
  const rawData = sessionStorage.getItem("data");

  // 2. Initialize parsedData safely
  let parsedData = null;
  if (rawData) {
    try {
      parsedData = JSON.parse(rawData);
    } catch (error) {
      console.error("Failed to parse session data:", error);
    }
  }

  // 3. Extract user_type and deletePopup safely
  let userType = null;
  let deletePopup = 0; // default to 0 if not set

  if (parsedData) {
    // Convert user_type to integer if available
    if (parsedData.user_type !== undefined) {
      userType = parseInt(parsedData.user_type, 10);
      if (isNaN(userType)) {
        console.warn("user_type is not a valid number");
        userType = null;
      }
    }

    // Convert deletePopup to integer if available
    if (parsedData.deletePopup !== undefined) {
      deletePopup = parseInt(parsedData.deletePopup, 10);
      if (isNaN(deletePopup)) {
        console.warn("deletePopup is not a valid number");
        deletePopup = 0;
      }
    }
  }

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const fetchPageData = async (filterType = "today", searchValue = "") => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const data = await fetchforexOrdersAPI({
      userId: dataStored.user_id,
      authKey: dataStored.auth_key,
      filterType,
      searchValue: searchText,
      currentPage,
      pageSize,
      end_date,
      start_end,
      marketId: selectedMarket?.id || null,
      scriptIds: formatScriptIds(selectedScripts),
      brokerId: broker?.id || null,
      masterUserId: master?.id || null,
      clientId: client?.id || null,
      status,
      orderType,
    });

    // setTotalPages(result?.iTotalRecords ? Math.ceil(result.iTotalRecords / rowsPerPage) : 0);
    isMobile
      ? isFilterChange || currentPage === 0
        ? setOrders(data.aaData || [])
        : setOrders(prev => [...prev, ...data.aaData])
      : setOrders(data.aaData || []);

    setTotalRecords(data?.iTotalRecords || 0);
    setIsFilterChange(false);
    setLoading(false);
  };

  function onFilterApply() {
    !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
    setCurrentPage(0);
    toggleDrawer(false)();
  }

  useEffect(() => {
    console.log('orders.length', orders.length);
  }, [orders])

  // # Pagination useEffects
  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize));
  }, [pageSize, totalRecords])

  useEffect(() => {
    !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
    setCurrentPage(0);
  }, [filterType, debouncedSearchText]);

  useEffect(() => {
    !isFirstRender && fetchPageData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    isFilterChange && !isFirstRender && fetchPageData();
  }, [isFilterChange])

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lot, setLot] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleModify = (item) => {
    setSelectedItem(item);
    setLot(item.trd_lot);
    setQuantity(item.trd_qty);
    setPrice(item.trd_rate);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!item?.trade_id) {
      alert('Trade ID is missing.');
      return;
    }

    try {
      const payload = {
        trade_id: item.trade_id,
        trade_rate: price,
        trade_lot: lot,
        trade_qty: quantity,
        device_type: 0,
      };

      console.log('Sending payload:', payload);

      const response = await updateTrade(payload);

      if (response.success) {
        alert('Trade updated successfully.');
        handleClose(); // Close the dialog
        // Optionally refresh data or state here
      } else {
        alert(response.message || 'Failed to update trade.');
      }
    } catch (error) {
      console.error('Error updating trade:', error);
      alert('Something went wrong while updating the trade.');
    }
  };

  const needsPassword = userType === 4 && deletePopup;

  const renderActions = (item, idx, isQty) => ({
    // leading: (
    //     <LeadingActions>
    //         <SwipeAction
    //             // destructive={true}
    //             onClick={() => handleStar(item, isFavorite)}
    //         >
    //             <ThemeProvider theme={theme}>
    //                 <Button
    //                     variant="contained"
    //                     color="star"
    //                     sx={{
    //                         backgroundColor: isDarkMode ? '#eca52e' : '#ffb63c',
    //                         height: '100%',
    //                         borderRadius: 0,
    //                         minWidth: '80px',
    //                         fontSize: '0.85rem',
    //                         color: '#fff',
    //                     }}
    //                 >
    //                     {/* Star */}
    //                     {isFavorite ? <RemoveCircleIcon sx={{ fontSize: '1.8rem' }} /> : <StarSharpIcon sx={{ fontSize: '2rem' }} />}
    //                 </Button>
    //             </ThemeProvider>
    //         </SwipeAction >
    //     </LeadingActions >
    // ),
    trailing: (
      <TrailingActions>
        <SwipeAction
          // destructive={isQty ? false : true}  
          destructive={false}
          onClick={() => handleModify(item)}  // chatgpt: is it ok ?
        >
          <button
            style={{
              marginRight: '4px',
              padding: '4px 8px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <ModeIcon />
          </button>
        </SwipeAction>

        <SwipeAction
          onClick={() => {
            setCancelItem(item);
            setCancelDialogOpen(true); // Always show confirmation
          }}>
          <button
            style={{
              padding: '4px 8px',
              backgroundColor: '#d32f2f',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <CancelIcon />
          </button>
        </SwipeAction>
      </TrailingActions >
    )
  });


  return (
    <Box sx={{ p: 0, mt: 2 }}>

      {/* Filter Drawer for Mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 280, p: 2 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={toggleDrawer(false)}><CloseIcon /></IconButton>
          </Box>
          <ForexFilter
            isDarkMode={isDarkMode}
            setStatus={setStatus}
            setEnd_date={setEnd_date}
            setStart_end={setStart_end}
            setOrderType={setOrderType}
            status={status}
            end_date={end_date}
            start_end={start_end}
            orderType={orderType}
            setMarket={setSelectedMarket}
            setScript={setSelectedScripts}
            setClient={setClient}
            setMaster={setMaster}
            setBroker={setBroker}
            market={selectedMarket}
            script={selectedScripts}
            client={client}
            master={master}
            broker={broker}
            onApply={onFilterApply}
          />
        </Box>

      </Drawer>

      {/* Desktop Filter Display */}
      {!isMobile && (
        <>

          <ForexFilter
            isDarkMode={isDarkMode}
            setStatus={setStatus}
            setEnd_date={setEnd_date}
            setStart_end={setStart_end}
            setOrderType={setOrderType}
            status={status}
            end_date={end_date}
            start_end={start_end}
            orderType={orderType}
            setMarket={setSelectedMarket}
            setScript={setSelectedScripts}
            setClient={setClient}
            setMaster={setMaster}
            setBroker={setBroker}
            market={selectedMarket}
            script={selectedScripts}
            client={client}
            master={master}
            broker={broker}
            onApply={onFilterApply}
          />

        </>
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
          <SwipeableList type={ListType.IOS}>
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

              const { trailing } = renderActions(item);

              return (
                <SwipeableListItem
                  key={item.trd_id || index}
                  trailingActions={trailing}
                >
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
                      width: "100%",
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
                </SwipeableListItem>
              );
            })}
          </SwipeableList>

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
                minWidth: "1650px",
                fontSize: "12px",
                margin: 0,
                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                color: theme.palette.mode === "dark" ? "#fff" : "#000",
              }}
            >
              <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                <tr>
                  {[
                    "Device",
                    "Status",
                    ...(userType !== 1 ? ["Client Name"] : []),
                    ...(userType !== 1 ? ["Client Code"] : []),
                    "Script",
                    "B/S",
                    "Order Type",
                    "Qty (Lot)",
                    "Order Price",
                    "Time",
                    "Status",
                    "O. Time",
                    "Comm Amt",
                    ...(userType === 4 || userType === 5 ? ["Trade ID"] : []),
                    ...(userType !== 2 ? ["Action"] : [])
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                        fontWeight: 600,
                        padding: '8px 12px',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        borderBottom: '1px solid #ccc',
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>

              </thead>
              <tbody>
                {orders.map((item, index) => {
                  const market = item.mrkt_t_name?.toUpperCase?.() || "DEFAULT";
                  let backgroundColor = "#9e9e9e";
                  if (market === "NSEFUT") backgroundColor = "#5a88adff";
                  else if (market === "GLOBAL FUTURES") backgroundColor = "#519253ff";
                  else if (market === "MCXFUT") backgroundColor = "#895d91ff";
                  else if (market === "NYSE") backgroundColor = "#dbad68ff";
                  else if (market === "COMEX") backgroundColor = "#974991ff";

                  const [scriptPrefix, ...scriptRest] = item.scrp_name.split(" ");
                  const scriptSuffix = scriptRest.join(" ");

                  // Left line color
                  const leftLineColor = item.trd_type === "Buy" ? "#0288d1" : item.trd_type === "Sell" ? "#d32f2f" : "transparent";

                  // Slightly darker fade gradient
                  const rowGradient = item.trd_type === "Buy"
                    ? "linear-gradient(to right, rgba(2,136,209,0.15), rgba(255,255,255,0))"
                    : item.trd_type === "Sell"
                      ? "linear-gradient(to right, rgba(211,47,47,0.15), rgba(255,255,255,0))"
                      : "none";

                  return (
                    <tr
                      key={item.trd_id || index}
                      style={{
                        borderLeft: `4px solid ${leftLineColor}`,
                        background: rowGradient,
                      }}
                    >
                      <td dangerouslySetInnerHTML={{ __html: item.d_type_html }} />
                      <td
                        style={{
                          color:
                            item.status === "Executed" ? "#2e7d32" : // green for executed
                              item.status === "Pending Order" ? "#fbc02d" : // yellow for pending
                                "#000", // default color
                          fontSize: 13.5,
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.status}
                      </td>
                      {userType !== 1 && <td>{item.client_full_name_dis}</td>}
                      {userType !== 1 && <td>{item.client_name_dis}</td>}
                      <td>
                        <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
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
                            {item.mrkt_t_name}
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
                      <td>
                        <Box
                          component="span"
                          sx={{
                            fontSize: "10px",       // small font
                            px: 1,                  // horizontal padding
                            py: 0.3,                // vertical padding
                            borderRadius: "8px",    // rounded corners
                            backgroundColor:
                              item.trd_type2 === "Exit Position" ? "#ffd54f" :
                                item.trd_type2 === "Exit All" ? "#cf6363ff" :
                                  item.trd_type2 === "Buy Limit" ? "#6c7eb8ff" :
                                    item.trd_type2 === "Exit auto" ? "#81d4fa" :
                                      item.trd_type2 === "Exit Intraday" ? "#ce93d8" :
                                        item.trd_type2 === "Market" ? "#a5d6a7" :
                                          item.trd_type2 === "BF" ? "#ffcc80" :
                                            "#ffffff",
                            color: "#000000ff",
                            fontWeight: "bold",
                            display: "inline-block",
                            textAlign: "center",
                          }}
                        >
                          {item.trd_type2}
                        </Box>
                      </td>
                      <td>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {item.trd_qty}
                        </Box>{" "}
                        <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                          ({item.trd_lot})
                        </Box>
                      </td>
                      <td style={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        {item.trd_rate}
                      </td>
                      <td>{item.trd_matchedtime}</td>
                      <td>{item.trd_time}</td>
                      <td>{item.trd_commision_amount}</td>
                      {(userType === 4 || userType === 5) && <td>#{item.trd_id}</td>}
                      {userType !== 2 && (
                        <td>
                          <button
                            style={{
                              marginRight: '8px',
                              padding: '4px 8px',
                              backgroundColor: '#1976d2',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleModify(item)}
                          >
                            Modify
                          </button>

                          <button
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#d32f2f',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setCancelItem(item);
                              setCancelDialogOpen(true);
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </Box>

          {/* 🔽 Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
          />
        </>
      )}

      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: '500px', maxWidth: '90%' } }}>
        <DialogTitle>Modify Order</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <Typography variant="subtitle1">
                <span
                  dangerouslySetInnerHTML={{
                    __html: `Client Name: <strong>${selectedItem.client_full_name}</strong>`,
                  }}
                />
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Script Name: <strong>{selectedItem.scrp_name}</strong>
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Lot"
                  value={lot}
                  onChange={(e) => setLot(e.target.value)}
                  fullWidth
                  type="number"
                />
                <TextField
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  fullWidth
                  type="number"
                />
                <TextField
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  fullWidth
                  type="number"
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for ALL users */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to cancel this order?
          </Typography>

          {/* Show password input only for userType === 4 and deletePopup === true */}
          {needsPassword && (
            <TextField
              label="Enter Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              if (needsPassword && !password) {
                alert('Please enter your password.');
                return;
              }

              handleCancel(cancelItem, password);
              setCancelDialogOpen(false);
              setPassword('');
            }}
            color="error"
            variant="contained"
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default Forex_order