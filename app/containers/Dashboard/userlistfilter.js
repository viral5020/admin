import React, { useEffect, useState } from 'react';
import {
  Box, Grid, MenuItem, Select, InputLabel, FormControl, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import RadioFilter from './filters/RadioFilterField';
import { getInputBoxStyle } from './filters/inputBoxStyle';

const statusOptions = [
  { label: 'Active', value: '1' },
  { label: 'In-Active', value: '0' },
];

const orderTypes = [
  { label: 'Buy Limit', value: 'buy_limit' },
  { label: 'Buy Stop Loss', value: 'buy_stop_loss' },
  { label: 'Sell Limit', value: 'sell_limit' },
  { label: 'Sell Stop Loss', value: 'sell_stop_loss' }
];

const UserListFilter = ({
  isDarkMode,
  onApply
}) => {
  const theme = useTheme();

  // API parameter states
  const [databroker, setDatabroker] = useState('');
  const [master, setMaster] = useState('');
  const [user, setUser] = useState('');
  const [status, setStatus] = useState('');
  const [segment, setSegment] = useState('');
  const [loginBefore, setLoginBefore] = useState('');
  const [loginAfter, setLoginAfter] = useState('');
  const [tradeBefore, setTradeBefore] = useState('');
  const [tradeAfter, setTradeAfter] = useState('');
  const [type, setType] = useState(1);

  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem("data"));
    const userTypeValue = parseInt(rawData.user_type, 10);
    setUserType(userTypeValue);
  }, []);

  const handleExport = async () => {
    try {
      const rawData = JSON.parse(sessionStorage.getItem("data"));

      const payload = {
        databroker,
        master,
        user,
        status,
        segment,
        loginBefore,
        loginAfter,
        tradeBefore,
        tradeAfter,
        type,
        is_app: "1",
        login_user_id: rawData.user_id,
        auth_key: rawData.auth_key,
      };

      console.log("⬇ Export Payload:", payload);

      const queryParams = new URLSearchParams(payload).toString();

      const response = await fetch(
        `http://128.199.126.171/~goldorg/ajaxfiles/download_csv_trade_book?${queryParams}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "trade_book.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ Trade export failed:", error);
    }
  };

  return (
    <Box sx={{ pt: 1, mb: 2, overflowX: 'auto' }}>
      <Grid container spacing={1}>

        {/* Status */}
        <Grid item xs={12} sm={6} md={4} lg={3.6}>
          <RadioFilter
            label="Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
            flag={false}
          />
        </Grid>

        {/* Login After */}
        <DateFilter label="Login After" value={loginAfter} onChange={setLoginAfter} />
        {/* Login Before */}
        <DateFilter label="Login Before" value={loginBefore} onChange={setLoginBefore} />

        {/* Trade After */}
        <DateFilter label="Trade After" value={tradeAfter} onChange={setTradeAfter} />
        {/* Trade Before */}
        <DateFilter label="Trade Before" value={tradeBefore} onChange={setTradeBefore} />

        {/* Order Type */}
        {/* <Grid item xs={12} sm={6} md={4} lg={3.6}>
          <FormControl fullWidth size="small" sx={getInputBoxStyle(isDarkMode)}>
            <InputLabel>Select Order Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Select Order Type"
            >
              {orderTypes.map((ot) => (
                <MenuItem key={ot.value} value={ot.value}>
                  {ot.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}

        {/* Segment & Script */}
        {/* <MarketScriptNameFilter
          market={segment}
          script={null}
          setScript={() => {}}
          setMarket={setSegment}
        /> */}

        {/* Client / Master / Broker */}
        <ClientMasterBrokerFilter
          client={userType !== 1 ? user : null}
          master={userType !== 1 ? master : null}
          broker={userType !== 1 && userType !== 2 ? databroker : null}
          setClient={setUser}
          setMaster={setMaster}
          setBroker={setDatabroker}
          showClient={userType !== 1}
          showMaster={userType !== 1}
          showBroker={userType !== 1 && userType !== 2}
        />

        {/* Buttons */}
        <Grid item xs={12} sm={6} md={3} lg={2.4} sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={onApply}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'none',
              flex: 1,
              '&:hover': { backgroundColor: theme.palette.secondary.dark },
            }}
          >
            Apply
          </Button>

          {/* <Button
            onClick={handleExport}
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
            Trade Export
          </Button> */}
        </Grid>

      </Grid>
    </Box>
  );
};

export default UserListFilter;
