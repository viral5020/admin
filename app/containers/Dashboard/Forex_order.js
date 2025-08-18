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
import { deleteTrade, fetchforexOrdersAPI, updateTrade } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';

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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [isFilterChange, setIsFilterChange] = useState(false);
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

  const rawData = sessionStorage.getItem("data");
  const parsedData = JSON.parse(rawData);
  const userType = parseInt(parsedData.user_type, 10);

  const ordersPerPage = 10;

  useEffect(() => {
    console.log('end_date', end_date);
    console.log('start_end', start_end);
  }, [start_end, end_date])


  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const fetchOrders = async (type = "today", searchValue = "") => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const result = await fetchforexOrdersAPI({
      userId: dataStored.user_id,
      authKey: dataStored.auth_key,
      type,
      searchValue,
      currentPage,
      ordersPerPage,
      end_date,
      start_end,
      marketId: selectedMarket?.id || null,
      scriptIds: formatScriptIds(selectedScripts),
      brokerId: broker?.id || null,
      masterUserId: master?.id || null,
      clientId: client?.id || null,
      status,
      orderType
    });

    setOrders(result);
    setLoading(false);
    setIsFilterChange(false);
  };


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

  // useEffect(() => {
  //   fetchOrders(filterType, searchText);
  // }, [selectedMarket, selectedScripts]);

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
            onApply={() => {
              fetchOrders('', searchText);
              toggleDrawer(false)();
            }}
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
            onApply={() => fetchOrders('', searchText)}
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
                    "Time",
                    ...(userType !== 1 ? ["Client"] : []),
                    "Script",
                    "B/S",
                    "Order Type",
                    "Qty (Lot)",
                    "Order Price",
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
                      <td dangerouslySetInnerHTML={{ __html: item.d_type_html }} />
                      <td>{item.trd_matchdtime}</td>
                      {userType !== 1 && <td>{item.client_full_name}</td>}
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
                          {item.trd_qty}
                        </Box>{" "}
                        <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                          ({item.trd_lot})
                        </Box>
                      </td>
                      <td style={{ fontWeight: 700, color: theme.palette.text.primary }}>
                        {item.trd_rate}
                      </td>
                      <td>{item.status}</td>
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
                              setCancelDialogOpen(true); // Always show confirmation
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