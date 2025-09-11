import React, { useEffect, useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import RadioFilter from './filters/RadioFilterField';

const statusOptions = [
  { label: 'Active', value: '1' },
  { label: 'In-Active', value: '0' },
];

const UserListFilter = ({
  isDarkMode,
  user,
  master,
  databroker,
  status,
  loginBefore,
  loginAfter,
  tradeBefore,
  tradeAfter,
  setUser,
  setMaster,
  setDatabroker,
  setStatus,
  setLoginBefore,
  setLoginAfter,
  setTradeBefore,
  setTradeAfter,
  onApply,
  forBroker = false,
  forMaster = false,
}) => {
  const theme = useTheme();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem('data'));
    if (rawData?.user_type) {
      setUserType(parseInt(rawData.user_type, 10));
    }
  }, []);

  return (
    <Box sx={{ pt: 1, mb: 1, overflowX: 'auto' }}>
      <Grid container spacing={1}>
        {/* Status */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{ pr: 0 }}
        >
          <RadioFilter
            label="Status"
            options={statusOptions}
            value={status}
            onChange={setStatus}
            flag={false}
          />
        </Grid>


        {/* Login & Trade Dates */}
        {setLoginAfter && (
          <DateFilter label="Login After" value={loginAfter} onChange={setLoginAfter} />
        )}
        {setLoginBefore && (
          <DateFilter label="Login Before" value={loginBefore} onChange={setLoginBefore} />
        )}
        <DateFilter
          label="Join After"
          value={tradeAfter}
          onChange={setTradeAfter}
        />
        <DateFilter
          label="Join Before"
          value={tradeBefore}
          onChange={setTradeBefore}
        />

        {/* Client / Master / Broker */}
        <ClientMasterBrokerFilter
          client={userType !== 1 ? user : null}
          master={userType !== 1 ? master : null}
          broker={userType !== 1 && userType !== 2 ? databroker : null}
          setClient={setUser}
          setMaster={setMaster}
          setBroker={setDatabroker}
          showClient={userType !== 1 && !forMaster && !forBroker}
          showMaster={userType !== 1}
          showBroker={userType !== 1 && userType !== 2 && !forBroker}
        />

        {/* Apply Button */}
        <Grid item xs={12} sm={6} md={3} lg={2.4}>
          <Button
            onClick={onApply}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              px: 2,
              py: 0.75,
              borderRadius: 1,
              textTransform: 'none',
              width: '100%',
              '&:hover': { backgroundColor: theme.palette.secondary.dark },
            }}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserListFilter;
