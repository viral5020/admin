import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useIsFirstRender } from '@uidotdev/usehooks';
import AddIcon from '@mui/icons-material/Add';
import { addPosition } from './API/API';

const marketChipStyles = {
  NSEEQT: { backgroundColor: "#1976d2", color: "#fff" }, // Blue
  NSEFUT: { backgroundColor: "#9c27b0", color: "#fff" }, // Purple
  NSEOPT: { backgroundColor: "#2e7d32", color: "#fff" },    // Green
  GLOBALFUTURES: { backgroundColor: "#d32f2f", color: "#fff" },  // Red
  FOREX: { backgroundColor: "#f9a825", color: "#000" },  // Amber
  MCXFUT: { backgroundColor: "#25b6f9ff", color: "#000" },  // Amber
  NSECDS: { backgroundColor: "#f94f25ff", color: "#000" },  // Amber
  "GLOBAL FUTURES": { backgroundColor: "#e4f925ff", color: "#000" },
};

const EditDeleteLogs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isFirstRender = useIsFirstRender();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [userLevels, setUserLevels] = useState([]);
  const [selectedUserLevel, setSelectedUserLevel] = useState('');

  // filter panel state
  const [showFilters, setShowFilters] = useState(false);
  const [marketOptions, setMarketOptions] = useState([]);
  const [scriptOptions, setScriptOptions] = useState([]);
  const [marketName, setMarketName] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [positionLimit, setPositionLimit] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [maxOrder, setMaxOrder] = useState('');
  const [minBet, setMinBet] = useState('');
  const [maxBet, setMaxBet] = useState('');

  const userType = JSON.parse(sessionStorage.getItem("data"))?.user_type || '';

  const totalPages = Math.ceil(totalRecords / pageSize);

  const fetchPageData = async (search = '', append = false) => {
    setLoading(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const response = await axios.post(
        'http://128.199.126.171/~goldorg/datatables/script_qty_list',
        {
          is_app: '1',
          login_user_id: dataStored?.user_id,
          auth_key: dataStored?.auth_key,
          sEcho: 1,
          iDisplayStart: currentPage * pageSize,
          iDisplayLength: pageSize,
          sSearch: search,
          user_level: selectedUserLevel,
          market_name: marketName,
          script_name: scriptName,
          position_limit: positionLimit,
          min_order: minOrder,
          max_order: maxOrder,
          min_bet: minBet,
          max_bet: maxBet,
        }
      );

      const newData = response.data.aaData || [];
      setLogs(prev => append ? [...prev, ...newData] : newData);
      setTotalRecords(response.data.iTotalRecords || 0);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const fetchUserLevels = async () => {
      try {
        const res = await axios.post('http://128.199.126.171/~goldorg/ajaxfiles/get_user_level', {
          is_app: '1',
          login_user_id: dataStored?.user_id,
          auth_key: dataStored?.auth_key,
        });
        const levels = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
        setUserLevels(levels);
      } catch (err) {
        console.error('Failed to fetch user levels:', err);
      }
    };

    const fetchFilters = async () => {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      try {
        const res = await axios.post('http://128.199.126.171/~goldorg/ajaxfiles/get_market_watch_filter', {
          is_app: '1',
          login_user_id: dataStored?.user_id,
          auth_key: dataStored?.auth_key,
        });

        const staticMarket = { value: "3", label: "Cricket" };
        const marketList = Array.isArray(res.data?.market_list) ? res.data.market_list : [];
        const scriptList = Array.isArray(res.data?.script_list) ? res.data.script_list : [];

        const updatedMarkets = [...marketList, staticMarket];

        let updatedScripts = [...scriptList];

        if (marketName === "3") {
          const staticScripts = [
            { value: "169", label: "MATCH_ODDS" },
            { value: "170", label: "FANCY_ODDS" },
          ];
          updatedScripts = [...updatedScripts, ...staticScripts];
        }

        setMarketOptions(updatedMarkets);
        setScriptOptions(updatedScripts);
      } catch (err) {
        console.error('Failed to fetch filters:', err);
      }
    };


    fetchUserLevels();
    fetchFilters();
  }, [marketName]);

  useEffect(() => {
    !isMobile ? fetchPageData(searchText) : fetchPageData(searchText, true);
  }, [currentPage, pageSize]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setCurrentPage(0);
      if (!isFirstRender) fetchPageData(searchText);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  useEffect(() => {
    if (!isFirstRender) {
      setCurrentPage(0);
      fetchPageData(searchText);
    }
  }, [selectedUserLevel]);

  const handleSubmit = async () => {
    // validation & payload building
    if (marketName !== "3") {
      if (!selectedUserLevel || !marketName || !scriptName || positionLimit === "" || maxOrder === "" ||
        parseFloat(positionLimit) < 0 || parseFloat(maxOrder) < 0
      ) {
        console.error("fill required fields");
        return;
      }
      const payload = {
        user_type: selectedUserLevel,
        market_type_id: marketName,
        script_id: scriptName,
        position_limit: positionLimit,
        maximum_order: maxOrder,
        min_order: minOrder
      }
      console.log("payload", payload);
      const response = await addPosition(payload);;
    } else {
      if (!marketName || !scriptName || minBet === "" || maxBet === "" ||
        parseFloat(minBet) < 0 || parseFloat(maxBet) < 0
      ) {
        console.error("fill required for cricket");
        return;
      }
      const payload = {
        user_type: selectedUserLevel,
        market_type_id: marketName,
        script_id: scriptName,
        min_order: minBet,
        maximum_order: maxBet
      }
      console.log("payload", payload);
      const response = await addPosition(payload);;
    }
  };

  const handleCancel = () => {
    setMarketName('');
    setScriptName('');
    setPositionLimit('');
    setMinOrder('');
    setMaxOrder('');
    setMinBet('');
    setMaxBet('');
    setShowFilters(false);
  };
  const handleFilterToggle = () => {
    if (showFilters) {
      // Reset all filter fields
      setMarketName('');
      setScriptName('');
      setPositionLimit('');
      setMinOrder('');
      setMaxOrder('');
      setMinBet('');
      setMaxBet('');
    }
    (userType == 3 || userType == 4) ? setShowFilters(prev => !prev) : null;
  };

  return (
    <>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {/* Filters and Controls */}
        {!isMobile ? (
          // Desktop View Controls
          <Box sx={{
            display: 'flex',
            gap: 0.5,
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
            mx: 1,
            flexWrap: 'wrap',
          }}>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <TextField
                select
                label="User Level"
                value={selectedUserLevel}
                onChange={(e) => { setSelectedUserLevel(e.target.value); setCurrentPage(0); }}
                size="small"
                sx={{ width: 180 }}
              >
                {userLevels.map(level => (
                  <MenuItem key={level.user_level_id} value={level.user_level_id}>
                    {level.user_level_name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Search logs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 200 }}
              />
              <Button
                style={{ display: (userType == 3 || userType == 4) ? 'inline-flex' : 'none' }}
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleFilterToggle} // replace this
              >
                {showFilters ? 'CANCEL' : 'ADD POSITION'}
              </Button>
            </Box>
          </Box>
        ) : (
          // Mobile View  Controls
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {/* User Level and Filter Side-by-Side */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                select
                label="User Level"
                value={selectedUserLevel}
                onChange={(e) => { setSelectedUserLevel(e.target.value); setCurrentPage(0); }}
                size="small"
                fullWidth
                sx={{ flex: 1 }}
              >
                {userLevels.map(level => (
                  <MenuItem key={level.user_level_id} value={level.user_level_id}>
                    {level.user_level_name}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleFilterToggle} // replace this
              >
                {showFilters ? 'CANCEL' : 'ADD POSITION'}
              </Button>
            </Box>

            {/* Search Field Below */}
            <TextField
              variant="outlined"
              placeholder="Search logs..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Box>

        )}

        {/* Filters Section (Shared) */}
        {showFilters && (
          <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <TextField select label="Market" value={marketName}
              onChange={e => setMarketName(e.target.value)} size="small" sx={{ width: isMobile ? '100%' : 180 }}>
              {marketOptions.map(m =>
                <MenuItem key={m.value || m.market_name} value={m.value || m.market_name}>
                  {m.label || m.market_name}
                </MenuItem>
              )}
            </TextField>

            <TextField select label="Script" value={scriptName}
              onChange={e => setScriptName(e.target.value)} size="small" sx={{ width: isMobile ? '100%' : 180 }}>
              {scriptOptions.map(s =>
                <MenuItem key={s.value || s.script_name} value={s.value || s.script_name}>
                  {s.label || s.script_name}
                </MenuItem>
              )}
            </TextField>

            {[{ label: 'Position', val: positionLimit, set: setPositionLimit },
            { label: 'Min Order', val: minOrder, set: setMinOrder },
            { label: 'Max Order', val: maxOrder, set: setMaxOrder },
            { label: 'Min Bet', val: minBet, set: setMinBet },
            { label: 'Max Bet', val: maxBet, set: setMaxBet }].map(({ label, val, set }) => (
              <TextField
                key={label}
                label={label}
                type="number"
                value={val}
                onChange={(e) => set(e.target.value)}
                size="small"
                fullWidth={isMobile}
                sx={{ width: isMobile ? '100%' : 150 }}
              />
            ))}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleSubmit}
                sx={{ flex: 1 }}
              >
                ADD
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancel}
                sx={{ flex: 1 }}
              >
                CANCEL
              </Button>
            </Box>

          </Box>
        )}


        {/* Logs Table or Cards */}
        {logs.length === 0 && !loading ? (
          <Typography textAlign="center">No Logs Found</Typography>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : (
          <>
            {!isMobile ? (
              // Desktop: Table
              <TableContainer sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader size="small" sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "40%" }}>Script</TableCell>
                      <TableCell sx={{ width: "30%" }}>Position</TableCell>
                      <TableCell sx={{ width: "30%" }}>Max Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <span>{log.script_name || "-"}</span>{" "}
                          {log.market_name && (
                            <Chip
                              label={log.market_name}
                              size="small"
                              sx={{
                                ml: 1,
                                height: 22,
                                fontSize: "0.75rem",
                                ...marketChipStyles[log.market_name] || {
                                  backgroundColor: "#e0e0e0", // Default gray
                                  color: "#000",
                                },
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{log.position_limit}</TableCell>
                        <TableCell>{log.max_order}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              // Mobile: Card UI
              <Box>
                {logs.map((log, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 0.5,
                      borderRadius: 2,
                      background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      p: '1px',
                      boxShadow: `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(33, 203, 243, 0.1)' : 'rgba(33, 203, 243, 0.2)'}`,
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        p: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography fontWeight="bold" fontSize="15px" color="text.primary">
                        {log.script_name || '-'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontSize="13px" color="text.secondary">
                          {log.level_name || '-'}
                        </Typography>
                        <Typography fontSize="13px" color="text.secondary">
                          {log.market_name || '-'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography fontSize="14px" fontWeight={500} color="text.primary">
                          {Number(log.position_limit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                        <Typography fontSize="14px" fontWeight={500} color="text.primary">
                          {Number(log.max_order).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>


            )}

            {/* Pagination */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: 1,
                pt: 2,
                flexWrap: 'wrap',
              }}
            >
              <Button
                size="small"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                color="secondary"
                variant="outlined"
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
                      variant={i === currentPage ? 'contained' : 'outlined'}
                      onClick={() => setCurrentPage(i)}
                      color="secondary"
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
                    <Typography key={i} sx={{ color: 'secondary.main' }}>
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
                variant="outlined"
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
      </Paper>
    </>
  );

};

export default EditDeleteLogs;
