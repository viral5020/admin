import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import ForexComexScriptFilter from './forexorderfilter';
import ValanFilter from './ValanFilter';

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
        <DateFilter label="Trade After" value={start_end} onChange={setStart_end} />
        <DateFilter label="Trade Before" value={end_date} onChange={setEnd_date} />

        {/* ✅ Use the new ValanFilter component */}
        <ValanFilter
          valanId={valanId}
          setValanId={setValanId}
          isDarkMode={isDarkMode}
        />

        {/* Market & Script Filter */}
        <ForexComexScriptFilter
          selectedMarket={market}
          setSelectedMarket={setMarket}
          selectedScripts={script}
          setSelectedScripts={setScript}
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

        {/* Apply Button */}
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
