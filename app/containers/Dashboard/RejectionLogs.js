import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { fetchRejectionLogsAPI } from './API/API';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from './filters/Pagination';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';


const RejectionLogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isFirstRender = useIsFirstRender();

  const [filterType, setFilterType] = useState('today');
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 800);
  const [isFilterChange, setIsFilterChange] = useState(false);

  // # Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [market, setMarket] = useState('');
  const [script, setScript] = useState([]);
  const [client, setClient] = useState('');
  const [master, setMaster] = useState('');
  const [broker, setBroker] = useState('');
  const [after_date, setafter_date] = useState('');
  const [before_date, setbefore_date] = useState('');
  const [End_date, setEnd_date] = useState('');
  const [Start_date, setStart_date] = useState('');


  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const rawData = sessionStorage.getItem("data");
  const parsedData = JSON.parse(rawData);
  const userType = parseInt(parsedData.user_type, 10);

  const fetchPageData = async () => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem('data'));
    const data = await fetchRejectionLogsAPI(
      dataStored.user_id,
      dataStored.auth_key,
      filterType,
      searchText,
      pageSize,
      currentPage,
    );

    const safeData = Array.isArray(data?.aaData) ? data.aaData : [];

    isMobile
      ? isFilterChange || currentPage === 0
        ? setLogs(safeData)
        : setLogs(prev => [...prev, ...safeData])
      : setLogs(safeData);

    setTotalRecords(data?.iTotalRecords || 0);

    setLoading(false);
    setIsFilterChange(false);
  };


  function onFilterApply() {
    !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
    setCurrentPage(0);
    toggleDrawer(false)();
  }

  useEffect(() => {
    console.log('logs.length', logs.length);
  }, [logs])

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

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        px: isMobile ? 0 : 2,
        py: isMobile ? 0 : 2,
        overflow: 'hidden',
        maxHeight: isMobile ? '100vh' : '90vh',
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default,
      }}
    >

      <TradeEditDeleteLogFilter
        End_date={End_date}
        Start_date={Start_date}
        setEnd_date={setEnd_date}
        setStart_date={setStart_date}
        market={market}
        script={script}
        setScript={setScript}
        setMarket={setMarket}
        client={client}
        master={master}
        setClient={setClient}
        setMaster={setMaster}
        onApply={onFilterApply}
      />
      {/* Filter + Search */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
          py: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                height: 26,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
            }}
          >
            <InputLabel>Filter</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Filter"
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="total">Total</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Search logs"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
            sx={{
              ml: 1,
              '& .MuiOutlinedInput-root': {
                height: 26,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'black',
                },
              },
              '& input': {
                padding: '0 8px',
              },
            }}
          />
        </Box>
      </Box>

      {isMobile
        ? loading && (isFilterChange || currentPage === 0)
          ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              {logs.length === 0 ? (
                <Typography sx={{ fontSize: '14px', px: 1 }}>No rejection logs found.</Typography>
              ) : (
                logs.map((log, index) => {
                  const isBuy = log.trade_type === 'Buy';
                  const isSell = log.trade_type === 'Sell';

                  const borderGradient = isBuy
                    ? 'linear-gradient(to right, #2196f3, #21cbf3)'
                    : isSell
                      ? 'linear-gradient(to right, #f44336, #ff7961)'
                      : '#ccc';

                  const boxShadowColor = isBuy
                    ? 'rgba(33, 150, 243, 0.3)'
                    : isSell
                      ? 'rgba(244, 67, 54, 0.3)'
                      : 'rgba(0,0,0,0.1)';

                  return (
                    <Card
                      key={index}
                      sx={{
                        mb: 1,
                        mx: 1,
                        borderRadius: 2,
                        border: '1px solid transparent',
                        backgroundImage: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}), ${borderGradient}`,
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'content-box, border-box',
                        boxShadow: `0 4px 12px ${boxShadowColor}`,
                      }}
                    >
                      <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                            {log.trade_rate} &nbsp; {log.trade_qty} Qty&nbsp;
                            <span style={{ fontWeight: 400 }}>{log.trade_lot} Lot</span>
                          </Typography>
                          <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                            {log.datetime}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: isSell
                                ? theme.palette.error.main
                                : isBuy
                                  ? theme.palette.info.main
                                  : theme.palette.text.primary,
                            }}
                          >
                            {log.trade_type}
                            <span style={{ fontWeight: 400, marginLeft: 4, color: theme.palette.text.secondary }}>
                              ({log.type})
                            </span>
                          </Typography>
                          {userType !== 1 && (
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                              {log.full_name}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: theme.palette.error.dark }}
                        >
                          {log.log_message}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })
              )}

              {logs.length < totalRecords && (
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
          )
        :
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <CircularProgress size={24} />
          </Box>
        ) : logs.length === 0 ? (
          <Typography sx={{ fontSize: '14px', px: 1 }}>No rejection logs found.</Typography>
        ) : (
          <>
            <Box
              sx={{
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: '400px',
                border: '1px solid #ddd',
                mx: 1,
                '&::-webkit-scrollbar': { display: 'none' },
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
                <thead
                  style={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
                  }}
                >
                  <tr>
                    {[
                      ...(userType !== 1 ? ["Client"] : []),
                      "Type",
                      "Datetime",
                      "Script",
                      "Trade Type",
                      "Qty (Lot)",
                      "Rate",
                      "Message",
                    ].map((header) => (
                      <th key={header} style={{ fontWeight: 600 }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => {
                    // Split script name and date
                    const [scriptBase, ...rest] = (log.script_name || "").split(" ");
                    const scriptSuffix = rest.join(" ");

                    return (
                      <tr key={index}>
                        {/* <td>
                          {userType !== 1 ? log.full_name : null}
                        </td> */}
                        {userType !== 1 && <td>{log.full_name}</td>}
                        <td>{log.type}</td>
                        <td>{log.datetime}</td>
                        <td>
                          <span style={{ fontWeight: "bold" }}>{scriptBase}</span>{" "}
                          {scriptSuffix}
                        </td>
                        <td
                          style={{
                            color:
                              log.trade_type === "Buy"
                                ? "green"
                                : log.trade_type === "Sell"
                                  ? "red"
                                  : undefined,
                            fontWeight: 700,
                          }}
                        >
                          {log.trade_type.toUpperCase()}
                        </td>

                        <td>
                          <span style={{ fontWeight: "bold" }}>{log.trade_qty}</span>
                          {log.trade_lot ? ` (${log.trade_lot})` : ""}
                        </td>
                        <td>{log.trade_rate}</td>
                        <td style={{ color: "red", fontWeight: "bold" }}>{log.log_message}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              pageSize={pageSize}
            />
          </>
        )}
    </Box>
  );
};

export default RejectionLogs;