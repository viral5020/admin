import React, { useEffect, useState } from 'react';
import {
  Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import RadioFilter from './filters/RadioFilterField';
import { getInputBoxStyle } from './filters/inputBoxStyle';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';

const statusOptions = [
  { label: 'Pending Order', value: 'is_pending' },
  { label: 'Executed Order', value: 'is_executed' },
];

const orderTypes = [
  'Buy Limit', 'Buy Stop Loss', 'Sell Limit', 'Sell Stop Loss'
];

const ForexFilter = ({
  isDarkMode,
  setStatus,
  setEnd_date,
  setStart_end,
  setOrderType,
  status,
  end_date,
  start_end,
  orderType,
  setMarket,
  setScript,
  setClient,
  setMaster,
  setBroker,
  market,
  script,
  client,
  master,
  broker,
  isMobile,
  onApply,
}) => {
  const theme = useTheme();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem("data"));
    const userTypeValue = parseInt(rawData.user_type, 10);
    setUserType(userTypeValue);
  }, []);

  // Clear all filters
  const handleClear = () => {
    setStatus('');
    setStart_end(null);
    setEnd_date(null);
    setOrderType('');
    setMarket('');
    setScript('');
    setClient('');
    setMaster('');
    setBroker('');
  };


  return (
    <Box sx={{ pt: 1, mb: 2, overflowX: !isMobile && 'auto' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={4} lg={3.6}>
          <RadioFilter
            label="Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
            flag={false}
          />
        </Grid>

        <DateFilter label="Trade After" value={start_end} onChange={setStart_end} />
        <DateFilter label="Trade Before" value={end_date} onChange={setEnd_date} />

        <Grid item xs={12} sm={6} md={4} lg={3.6}>
          <FormControl fullWidth size="small" sx={getInputBoxStyle(isDarkMode)}>
            <InputLabel>Select Order Type</InputLabel>
            <Select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              label="Select Order Type"
            >
              {orderTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <MarketScriptNameFilter
          market={market}
          setMarket={setMarket}
          script={script}
          setScript={setScript}
          isForex={true}
        />

        <ClientMasterBrokerFilter
          client={userType !== 1 ? client : null}
          master={userType !== 1 ? master : null}
          broker={userType !== 1 && userType !== 2 ? broker : null}
          setClient={setClient}
          setMaster={setMaster}
          setBroker={setBroker}
          showClient={userType !== 1}
          showMaster={userType !== 1}
          showBroker={userType !== 1 && userType !== 2}
        />

        <Grid
          item
          xs={12} sm={6} md={3} lg={2.4}
          sx={{ display: 'flex', gap: 1 }}
        >
          {/* Apply Button */}
          <Button
            onClick={onApply}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              padding: '6px 30px', // wider
              borderRadius: '4px',
              textTransform: 'none',
              flex: 1,
              '&:hover': { backgroundColor: theme.palette.secondary.dark },
            }}
          >
            Apply
          </Button>

          {/* Clear Button */}
          <Button
            onClick={handleClear}
            sx={{
              backgroundColor: theme.palette.error.main, // red color
              color: theme.palette.error.contrastText,   // readable text color
              padding: '6px 30px', // wider
              borderRadius: '4px',
              textTransform: 'none',
              flex: 1,
              '&:hover': { backgroundColor: theme.palette.error.dark }, // darker red on hover
            }}
          >
            Clear
          </Button>

        </Grid>
      </Grid>
    </Box>
  );
};

export default ForexFilter;
