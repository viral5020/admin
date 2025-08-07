import React, { useEffect, useState } from 'react';
import {
  Box, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import { getInputBoxStyle } from './filters/inputBoxStyle';
import ForexComexScriptFilter from './forexorderfilter'; 

// Example Valan ID options (replace with real values or props as needed)
const valanIdOptions = [
  { label: 'Valan ID 1', value: 'valan_1' },
  { label: 'Valan ID 2', value: 'valan_2' },
  { label: 'Valan ID 3', value: 'valan_3' },
];

const Forexsummaryfilter = ({
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

  return (
    <Box sx={{ pt: 1, mb: 2, overflowX: 'auto' }}>
      <Grid container spacing={1}>
        {/* Removed Status RadioFilter */}

        <DateFilter label="Trade After" value={start_end} onChange={setStart_end} />
        <DateFilter label="Trade Before" value={end_date} onChange={setEnd_date} />

        {/* Removed Order Type Dropdown */}

        {/* Added Valan ID Dropdown */}
        <Grid item xs={12} sm={6} md={4} lg={3.6}>
          <FormControl fullWidth size="small" sx={getInputBoxStyle(isDarkMode)}>
            <InputLabel>Valan ID</InputLabel>
            <Select
              value={valanId}
              onChange={(e) => setValanId(e.target.value)}
              label="Valan ID"
            >
              {valanIdOptions.map((valan) => (
                <MenuItem key={valan.value} value={valan.value}>
                  {valan.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <ForexComexScriptFilter
          selectedMarket={market}
          setSelectedMarket={setMarket}
          selectedScripts={script}
          setSelectedScripts={setScript}
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

        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Button
            onClick={onApply}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              padding: '6px 12px',
              borderRadius: '4px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
            fullWidth
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Forexsummaryfilter;
