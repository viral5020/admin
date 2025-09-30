import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import ForexComexScriptFilter from './forexorderfilter';
import ValanFilter from './ValanFilter';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';

const Summaryreportfilter = ({
  isDarkMode,
  setEnd_date,
  setStart_end,
  end_date,
  start_end,
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
  valanId,
  setValanId,
  onApply,
}) => {
  const theme = useTheme();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem("data"));
    const userTypeValue = parseInt(rawData.user_type, 10);
    setUserType(userTypeValue);
  }, []);
  const handleClear = () => {
    if (setStart_end) setStart_end("");
    if (setEnd_date) setEnd_date("");
    if (setMarket) setMarket("");
    if (setScript) setScript("");
    if (setClient) setClient(null);
    if (setMaster) setMaster(null);
    if (setBroker) setBroker(null);
    if (setValanId) setValanId(null);
  };


  return (
    <Box sx={{ pt: 1, mb: 2, overflowX: 'auto' }}>
      <Grid container spacing={1}>
        <DateFilter label="Trade After" value={start_end} onChange={setStart_end} />
        <DateFilter label="Trade Before" value={end_date} onChange={setEnd_date} />

        {/* ✅ Use the new ValanFilter component */}
        <ValanFilter valanId={valanId} setValanId={setValanId} isDarkMode={isDarkMode} />

        {/* Market & Script Filter */}
        <MarketScriptNameFilter
          market={market}
          script={script}
          setScript={setScript}
          setMarket={setMarket}
        />

        {/* Client, Master, Broker Filters */}
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

        {/* Apply Button Row */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Button
            onClick={onApply}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              // padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'none',
              '&:hover': { backgroundColor: theme.palette.secondary.dark },
            }}
            fullWidth
          >
            Apply
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClear}
            sx={{ borderRadius: 1 }}
            fullWidth
          >
            Clear
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Button
            onClick={() => {
              const dataStored = JSON.parse(sessionStorage.getItem("data"));
              if (!dataStored) {
                alert("Session expired. Please log in again.");
                return;
              }
              const BASE_URL = 'http://128.199.126.171/~goldorg/';
              const authKey = dataStored.auth_key;
              const loginUserId = dataStored.user_id;
              const filePath = 'pdf/self_summary';
              const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
              const url = new URL(fullUrl);
              url.searchParams.set('is', '1');
              url.searchParams.set('k', authKey);
              url.searchParams.set('lui', loginUserId);
              window.open(url.toString(), '_blank');
            }}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              // padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'none',
              // ml: 0.50,
              flex: 1,
              '&:hover': { backgroundColor: theme.palette.primary.dark },
            }}
            fullWidth
          >
            Script Wise Summary
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Button
            onClick={() => {
              const dataStored = JSON.parse(sessionStorage.getItem("data"));
              if (!dataStored) {
                alert("Session expired. Please log in again.");
                return;
              }
              const BASE_URL = 'http://128.199.126.171/~goldorg/';
              const authKey = dataStored.auth_key;
              const loginUserId = dataStored.user_id;
              const filePath = 'pdf/buy_sell_turnover';
              const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
              const url = new URL(fullUrl);
              url.searchParams.set('is', '1');
              url.searchParams.set('k', authKey);
              url.searchParams.set('lui', loginUserId);
              window.open(url.toString(), '_blank');
            }}
            sx={{
              backgroundColor: theme.palette.success.main,
              color: theme.palette.success.contrastText,
              // padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'none',

              flex: 1,
              '&:hover': { backgroundColor: theme.palette.success.dark },
            }}
            fullWidth
          >
            Buy Sell Turnover
          </Button>
        </Grid>

        {/* Script Wise Summary + Buy Sell Turnover Side by Side */}
        {/* <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
            <Button
              onClick={() => {
                const dataStored = JSON.parse(sessionStorage.getItem("data"));
                if (!dataStored) {
                  alert("Session expired. Please log in again.");
                  return;
                }
                const BASE_URL = 'http://128.199.126.171/~goldorg/';
                const authKey = dataStored.auth_key;
                const loginUserId = dataStored.user_id;
                const filePath = 'pdf/self_summary';
                const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                const url = new URL(fullUrl);
                url.searchParams.set('is', '1');
                url.searchParams.set('k', authKey);
                url.searchParams.set('lui', loginUserId);
                window.open(url.toString(), '_blank');
              }}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                padding: '6px 12px',
                borderRadius: '4px',
                textTransform: 'none',
                flex: 1,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
              }}
            >
              Script Wise Summary
            </Button>

            <Button
              onClick={() => {
                const dataStored = JSON.parse(sessionStorage.getItem("data"));
                if (!dataStored) {
                  alert("Session expired. Please log in again.");
                  return;
                }
                const BASE_URL = 'http://128.199.126.171/~goldorg/';
                const authKey = dataStored.auth_key;
                const loginUserId = dataStored.user_id;
                const filePath = 'pdf/buy_sell_turnover';
                const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                const url = new URL(fullUrl);
                url.searchParams.set('is', '1');
                url.searchParams.set('k', authKey);
                url.searchParams.set('lui', loginUserId);
                window.open(url.toString(), '_blank');
              }}
              sx={{
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                padding: '6px 12px',
                borderRadius: '4px',
                textTransform: 'none',
                flex: 1,
                '&:hover': { backgroundColor: theme.palette.success.dark },
              }}
            >
              Buy Sell Turnover
            </Button>
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default Summaryreportfilter;
