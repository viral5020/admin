import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Typography, Tabs, Tab, Box, Grid, Tooltip, IconButton, useTheme, useMediaQuery,
  Checkbox, FormGroup, FormControlLabel, Button, TextField, Paper,
  Divider
} from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function LedgerPage() {
  const [tab, setTab] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:767px)');
  const errorColor = theme.palette.error.main;
  const profitColor = theme.palette.success.main;
  const textColor = theme.palette.text.primary;
  const subtitleColor = theme.palette.text.secondary;
  const borderColor = theme.palette.divider;
  const bgPaper = theme.palette.background.paper;
  const bgDefault = theme.palette.background.default;

  const dataStored = JSON.parse(sessionStorage.getItem("data"));

  const BASE_URL = 'http://128.199.126.171/~goldorg/'
  const isApp = '1';
  const loginUserId = dataStored?.user_id;
  const authKey = dataStored?.auth_key;


  const [filters, setFilters] = useState({
    onlyBills: true,
    onlyCashEntry: true,
    onlyJVEntry: true,
    onlyDebitBill: true,
    onlyCreditBill: true,
    onlyDebitCash: true,
    onlyCreditCash: true,
    onlyDebitJV: true,
    onlyCreditJV: true,
    start_date: "",
    user_id: dataStored?.user_id
  });

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://128.199.126.171/~goldorg/ajaxfiles/get_valan_wise_ledger.php', {
        ...filters,
        is_app: '1',
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
      });

      if (response.data.status === "ok") {
        const data = response.data.data;
        const otherEntries = data.filter(item => item.valan_name !== "Opening Balance");
        const opening = data.find(item => item.valan_name === "Opening Balance");

        setLedgerData(otherEntries);
        setOpeningBalance(opening ? opening.debit : 0);
        setBalanceAmount(otherEntries.reduce((sum, d) => sum + (parseFloat(d.debit) || 0), 0));
      } else {
        console.error('API error', response.data);
      }
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const applyFilters = () => {
    setShowFilter(false);
    fetchLedger();
  };

  const sortedLedgerData = [...ledgerData].sort((a, b) =>
    sortOrder === 'asc'
      ? parseFloat(a.debit) - parseFloat(b.debit)
      : parseFloat(b.debit) - parseFloat(a.debit)
  );

  // Close popup when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    };
    if (showFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilter]);

  return (
    <Box sx={{ background: bgDefault, minHeight: '100vh', position: 'relative' }}>
      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        variant="fullWidth"
        sx={{
          borderBottom: `1px solid ${borderColor}`,
          minHeight: '26px',
          '& .MuiTab-root': {
            fontSize: '0.7rem',
            minHeight: '26px',
            padding: '2px 4px',
            fontWeight: 600
          },
          '& .Mui-selected': {
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)',
            color: '#fff',
            borderRadius: '4px 4px 0 0'
          },
          '& .MuiTabs-indicator': {
            display: 'none'
          }
        }}
      >
        <Tab label="STOCK" />
        <Tab label="FOREX" />
        <Tab label="SPORTS" />
      </Tabs>

      {/* Net Balance */}
      <Box sx={{ textAlign: 'center', px: 0, py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            {balanceAmount < 0 ? (
              <TrendingDownIcon sx={{ color: errorColor, fontSize: '1.2rem' }} />
            ) : (
              <TrendingUpIcon sx={{ color: profitColor, fontSize: '1.2rem' }} />
            )}
            <Box
              component="span"
              sx={{
                px: 1,
                py: 0.3,
                borderRadius: 1,
                backgroundColor: balanceAmount < 0 ? '#ffebee' : '#e8f5e9',
                color: balanceAmount < 0 ? errorColor : profitColor,
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              {balanceAmount.toFixed(2)}
            </Box>
          </Box>
        </Box>

        {/* Opening Balance */}
        <Box
          sx={{
            backgroundColor: openingBalance < 0 ? '#ffebee' : '#e8f5e9',
            border: `2px solid ${openingBalance < 0 ? '#f44336' : '#4caf50'}`,
            px: 1.5,
            py: 1,
            mb: 1.5,
            borderRadius: 1.5,
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mx: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight={600} fontSize="0.8rem">Opening Balance</Typography>
            <Typography variant="caption" sx={{ color: subtitleColor }}>07-08-2025</Typography>
          </Box>
          <Typography fontWeight={700} sx={{ color: openingBalance < 0 ? errorColor : profitColor, fontSize: '0.9rem' }}>
            {openingBalance.toFixed(2)}
          </Typography>
        </Box>

        {/* Controls: Sort + Filter */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, mb: 1 }}>
          <Tooltip title="Sort Ascending">
            <IconButton
              size="small"
              onClick={() => setSortOrder('asc')}
              sx={{
                backgroundColor: sortOrder === 'asc' ? '#e3f2fd' : 'transparent',
                border: `1px solid ${borderColor}`,
                borderRadius: 1,
                p: 0.5,
                color: sortOrder === 'asc' ? theme.palette.primary.main : textColor
              }}
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Sort Descending">
            <IconButton
              size="small"
              onClick={() => setSortOrder('desc')}
              sx={{
                backgroundColor: sortOrder === 'desc' ? '#fce4ec' : 'transparent',
                border: `1px solid ${borderColor}`,
                borderRadius: 1,
                p: 0.5,
                ml: 0.5,
                color: sortOrder === 'desc' ? theme.palette.error.main : textColor
              }}
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Filter">
            <IconButton
              size="small"
              onClick={() => setShowFilter(prev => !prev)}
              sx={{
                border: `1px solid ${borderColor}`,
                borderRadius: 1,
                p: 0.5,
                ml: 0.5,
                color: textColor
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Filter Popup */}
       {showFilter && (
  <Paper
    ref={filterRef}
    elevation={6}
    sx={{
      position: 'absolute',
      top: 100,
      right: 16,
      zIndex: 20,
      p: 2,
      borderRadius: 2,
      border: '1px solid rgba(0,0,0,0.1)',
      width: isMobile ? '90%' : '360px',
      maxWidth: '95vw',
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Start Date */}
      <TextField
        type="date"
        size="small"
        label="Start Date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={filters.start_date}
        onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
      />

      <Divider />

      {/* Only Bills */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onlyBills}
              onChange={(e) => setFilters(prev => ({ ...prev, onlyBills: e.target.checked }))}
              color="secondary"
            />
          }
          label="Only Bills"
        />
        {filters.onlyBills && (
          <Box sx={{ pl: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyDebitBill}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, onlyDebitBill: e.target.checked }))
                  }
                  color="secondary"
                />
              }
              label="Debit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyCreditBill}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, onlyCreditBill: e.target.checked }))
                  }
                  color="secondary"
                />
              }
              label="Credit"
            />
          </Box>
        )}
      </FormGroup>

      <Divider />

      {/* Only Cash */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onlyCashEntry}
              onChange={(e) =>
                setFilters(prev => ({ ...prev, onlyCashEntry: e.target.checked }))
              }
              color="secondary"
            />
          }
          label="Only Cash"
        />
        {filters.onlyCashEntry && (
          <Box sx={{ pl: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyDebitCash}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, onlyDebitCash: e.target.checked }))
                  }
                  color="secondary"
                />
              }
              label="Debit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyCreditCash}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, onlyCreditCash: e.target.checked }))
                  }
                  color="secondary"
                />
              }
              label="Credit"
            />
          </Box>
        )}
      </FormGroup>

      <Divider />

      {/* Only JV Entry */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onlyJVEntry}
              onChange={(e) =>
                setFilters(prev => ({ ...prev, onlyJVEntry: e.target.checked }))
              }
              color="secondary"
            />
          }
          label="Only JV Entry"
        />
        {filters.onlyJVEntry && (
          <Box sx={{ pl: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyDebitJV}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, onlyDebitJV: e.target.checked }))
                  }
                  color="secondary"
                />
              }
              label="Debit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.onlyCreditJV}
                  onChange={(e) =>
                    setFilters(prev => ({ ...prev, onlyCreditJV: e.target.checked }))
                  }
                  color="secondary"
                />
              }
              label="Credit"
            />
          </Box>
        )}
      </FormGroup>

      <Divider />

      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          size="small"
          color="secondary"
          onClick={applyFilters}
        >
          Apply Filter
        </Button>
      </Box>
    </Box>
  </Paper>
)}



        {/* Ledger Cards */}
        {loading ? (
          <Typography variant="body2" sx={{ mt: 2 }}>Loading...</Typography>
        ) : sortedLedgerData.map((item, idx) => {
          const amount = parseFloat(item.debit);
          const isProfit = amount > 0;
          const borderGradient = isProfit
            ? 'linear-gradient(to right, #00c6ff, #0072ff)'
            : 'linear-gradient(to right, #f44336, #d32f2f)';

          return (
            <Box
              key={idx}
              sx={{
                px: 1,
                py: 1,
                borderRadius: 2,
                background: bgPaper,
                border: '1px solid transparent',
                backgroundImage: `linear-gradient(${bgPaper}, ${bgPaper}), ${borderGradient}`,
                backgroundOrigin: 'padding-box, border-box',
                backgroundClip: 'padding-box, border-box',
                mx: 0,
                my: 0.5
              }}
            >
              <Grid container alignItems="center" spacing={0} wrap="wrap">
                <Grid item xs={12} sx={{ textAlign: 'left' }}>
                  <Typography fontWeight={600} lineHeight={1.3} fontSize="0.85rem">
                    {item.valan_name}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.2 }}>
                    <Typography variant="caption" sx={{ color: subtitleColor }}>
                      {item.date1 || item.date}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: isProfit ? profitColor : errorColor }}
                      >
                        {amount.toFixed(2)}
                      </Typography>

                      {item.download && typeof item.download === 'string' && item.download.trim() !== '' && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            const BASE_URL = 'http://128.199.126.171/~goldorg/';
                            const authKey = dataStored?.auth_key;
                            const loginUserId = dataStored?.user_id;

                            // Build the full URL
                            const url = new URL(
                              item.download.startsWith('http') ? item.download : `${BASE_URL}${item.download}`,
                              BASE_URL
                            );

                            // Append required params
                            url.searchParams.set('is', '1');
                            url.searchParams.set('k', authKey);
                            url.searchParams.set('lui', loginUserId);

                            // Open PDF
                            window.open(url.toString(), '_blank');
                          }}
                          sx={{ p: 0.3 }}
                        >
                          <PictureAsPdfIcon sx={{ color: subtitleColor, fontSize: '1rem' }} />
                        </IconButton>
                      )}

                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
