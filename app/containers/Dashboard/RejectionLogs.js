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
  Grid,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import { fetchRejectionLogsAPI } from './API/API';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';


const RejectionLogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

  const [filterType, setFilterType] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logCurrentPage, setLogCurrentPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const pageSize = 10;

  const [market, setMarket] = useState('');
  const [script, setScript] = useState([]);
  const [client, setClient] = useState('');
  const [master, setMaster] = useState('');
  // const [broker, setBroker] = useState('');

  const [end_date, setEnd_date] = useState('');
  const [start_date, setStart_date] = useState('');

  const [is_updated, setIs_updated] = useState(false);
  const [is_deleted, setIs_deleted] = useState(false);

  const fetchRejectionLogs = async () => {
    setLoading(true);
    try {
      const dataStored = JSON.parse(sessionStorage.getItem('data'));
      const result = await fetchRejectionLogsAPI(
        dataStored.user_id,
        dataStored.auth_key,
        filterType,
        searchQuery,

        market?.id,
        formatScriptIds(script),
        client?.id,
        master?.id,
        end_date,
        start_date,
      );
      setLogs(result || []);
    } catch (err) {
      console.error('Failed to fetch rejection logs:', err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectionLogs();
    setVisibleMobileCount(10); // Reset visible count on new search/filter
  }, [filterType, searchQuery]);

  const filteredLogs = logs;
  const [visibleMobileCount, setVisibleMobileCount] = useState(10);
  const visibleMobileLogs = filteredLogs.slice(0, visibleMobileCount);
  const paginatedLogs = filteredLogs.slice(
    logCurrentPage * pageSize,
    (logCurrentPage + 1) * pageSize
  );
  const logTotalPages = Math.ceil(filteredLogs.length / pageSize);

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
      {/* Filter + Search */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column', // ✅ correct property
          gap: 1.8,             // optional: add unit (default is px, but better explicit)
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
          py: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
          borderRadius: 1,
        }}
      >
        <Grid container spacing={1}>
          <DateFilter
            label="Trade After"
            value={end_date}
            onChange={setEnd_date}
          />

          <DateFilter
            label="Trade Before"
            value={start_date}
            onChange={setStart_date}
          />

          <MarketScriptNameFilter
            market={market}
            script={script}
            setScript={setScript}
            setMarket={setMarket}
          />

          <ClientMasterBrokerFilter
            client={client}
            master={master}
            // broker={broker}
            setClient={setClient}
            setMaster={setMaster}
            // setBroker={setBroker}
            showBroker={false}
          />
        </Grid>

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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



      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <CircularProgress size={24} />
        </Box>
      ) : filteredLogs.length === 0 ? (
        <Typography sx={{ fontSize: '14px', px: 1 }}>No rejection logs found.</Typography>
      ) : isMobile ? (
        <>
          {visibleMobileLogs.map((log, index) => {
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
                    <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                      {log.full_name}
                    </Typography>
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
          })}

          {visibleMobileCount < filteredLogs.length && (
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setVisibleMobileCount((prev) => prev + 10)}
                sx={{ color: theme.palette.text.primary, borderColor: theme.palette.divider }}
              >
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
              <thead
                style={{
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
                }}
              >
                <tr>
                  {[
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
                {paginatedLogs.map((log, index) => {
                  // Split script name and date
                  const [scriptBase, ...rest] = log.script_name.split(" ");
                  const scriptSuffix = rest.join(" ");

                  return (
                    <tr key={index}>
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
                      <td>{log.log_message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>

          {/* Pagination */}
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

export default RejectionLogs;
