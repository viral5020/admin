import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import RadioFilter from './filters/RadioFilterField';
import { getInputBoxStyle } from './filters/inputBoxStyle';

const statusOptions = [
  { label: 'Pending Order', value: 'is_pending' },
  { label: 'Executed Order', value: 'is_executed' },
];

const orderTypes = [
  '', 'Buy Limit', 'Buy Stop Loss', 'Sell Limit', 'Sell Stop Loss'
];

const OrderFilter = ({
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
  onApply,
}) => {
  const theme = useTheme();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem("data"));
    const userTypeValue = parseInt(rawData.user_type, 10);
    setUserType(userTypeValue);
  }, []);

  return (
    <Box sx={{ pt: 1, mb: 2, overflowX: 'auto' }}>
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
                  {type === '' ? 'Select Order Type' : type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <MarketScriptNameFilter
          market={market}
          script={script}
          setScript={setScript}
          setMarket={setMarket}
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
              padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'none',
              flex: 1,
              '&:hover': { backgroundColor: theme.palette.secondary.dark },
            }}
          >
            Apply
          </Button>

          {/* Trade Export Button */}
          <Button
            onClick={async () => {
              try {
                const rawData = JSON.parse(sessionStorage.getItem("data"));
                const payload = {
                  is_app: "1",
                  login_user_id: rawData.user_id,
                  auth_key: rawData.auth_key,
                  status,
                  start_end,
                  end_date,
                  orderType,
                  market,
                  script,
                  client,
                  master,
                  broker,
                };

                console.log("⬇ Export Payload:", payload);

                const response = await fetch(
                  "http://128.199.126.171/~goldorg/ajaxfiles/download_csv_trade_book",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  }
                );

                if (!response.ok) throw new Error("Export failed");

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "trade_book.csv"; // Adjust filename if needed
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error("❌ Trade export failed:", error);
              }
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
            Trade Export
          </Button>
        </Grid>

      </Grid>
    </Box>
  );
};

export default OrderFilter;
