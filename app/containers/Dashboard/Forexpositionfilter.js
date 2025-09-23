import React, { useEffect, useState } from 'react';
import RadioFilter from './filters/RadioFilterField';
import DateFilter from './filters/DateFilter';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import {
  Button, useTheme, Grid, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions,
  TextField,
  Box
} from '@mui/material';
import { closeAllPositions, forexcloseAllPositions, rolloverPositions } from './API/API';
import ForexComexScriptFilter from './forexorderfilter';

const ForexpositionFilter = ({
  ClientWiseOptions,
  allOutstandingOptions,
  setExparyDate,
  exparyDate,
  setClient_wise_value,
  client_wise_value,
  setAll_outstanding,
  all_outstanding,
  market,
  script,
  setScript,
  setMarket,
  client,
  master,
  broker,
  setClient,
  setMaster,
  setBroker,
  onApply
}) => {
  const theme = useTheme();

  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const rawData = JSON.parse(sessionStorage.getItem("data"));
    const userTypeValue = parseInt(rawData.user_type, 10);
    setUserType(userTypeValue);
  }, []);


  const [openDialog, setOpenDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [openRolloverDialog, setOpenRolloverDialog] = useState(false);
  const [rolloverPassword, setRolloverPassword] = useState('');


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPassword('');
  };

  const handleConfirmRollover = async () => {
    try {
      const result = await rolloverPositions({
        password: rolloverPassword,
        market,
        script,
        client,
        master,
        broker,
        exparyDate,
      });

      if (result.success) {
        alert('Rollover successful!');
      } else {
        alert(`Failed: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message || 'Something went wrong'}`);
    } finally {
      setOpenRolloverDialog(false);
      setRolloverPassword('');
    }
  };

  const handleConfirmClose = async () => {
    try {
      const result = await forexcloseAllPositions({
        password,
        market,
        script,
        client,
        master,
        broker,
        exparyDate,
      });

      if (result.success) {
        alert('Positions closed successfully!');
      } else {
        alert(`Failed: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error: ${err.message || 'Something went wrong'}`);
    } finally {
      handleCloseDialog();
    }
  };

  const handleClear = () => {
    setExparyDate(null);
    setClient_wise_value('');
    setAll_outstanding('');
    setMarket([]);
    setScript([]);
    setClient('');
    setMaster('');
    setBroker('');
  };

  return (
    <>
      <Grid container spacing={1} mt={1}>
        <RadioFilter
          label="All Outstanding"
          options={allOutstandingOptions}
          value={all_outstanding}
          onChange={setAll_outstanding}
        />
        <RadioFilter
          label="Value"
          options={ClientWiseOptions}
          value={client_wise_value}
          onChange={setClient_wise_value}
          isLong={true}
        />
        <DateFilter
          label="Expary date"
          value={exparyDate}
          onChange={setExparyDate}
        />
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

        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box sx={{ display: 'flex', gap: 1 }}> {/* flex container */}
            <Button
              onClick={onApply}
              sx={{
                flex: 1, // both buttons take equal space
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                padding: '6px 10px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: theme.palette.secondary.dark },
              }}
            >
              Apply
            </Button>

            <Button
              onClick={handleClear}
              sx={{
                flex: 1,
                backgroundColor: theme.palette.grey[500],
                color: theme.palette.getContrastText(theme.palette.grey[500]),
                padding: '6px 10px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': { backgroundColor: theme.palette.grey[700] },
              }}
            >
              Clear
            </Button>
            {userType !== 2 && (
              <Button
                fullWidth
                onClick={() => setOpenDialog(true)}
                sx={{
                  backgroundColor: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                  padding: '6px 10px',
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark,
                  },
                }}
              >
                Close All Positions
              </Button>
            )}
          </Box>
        </Grid>


        {/* ✅ Rollover Button */}
        {/* {userType !== 2 && (
  <Grid item xs={12} sm={4} md={2.4}>
    <Button
      fullWidth
      onClick={() => setOpenRolloverDialog(true)}
      sx={{
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        padding: '6px 10px',
        borderRadius: '4px',
        textTransform: 'none',
        fontSize: '0.875rem',
        '&:hover': {
          backgroundColor: theme.palette.info.dark,
        },
      }}
    >
      Rollover
    </Button>

    <Dialog open={openRolloverDialog} onClose={() => setOpenRolloverDialog(false)}>
      <DialogTitle>Rollover Positions</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to roll over all positions? Please enter your password to confirm.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={rolloverPassword}
          onChange={(e) => setRolloverPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenRolloverDialog(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmRollover} color="info" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </Grid>
)} */}


        {/* ✅ Close All Positions Button */}
        {userType !== 2 && (
          <Grid item xs={12} sm={4} md={2.4}>
            {/* <Button
              fullWidth
              onClick={() => setOpenDialog(true)}
              sx={{
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                padding: '6px 10px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
              }}
            >
              Close All Positions
            </Button> */}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Close All Positions</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to close all positions? This action is irreversible.
                  Please enter your password to confirm.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmClose} color="error" variant="contained">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ForexpositionFilter;
