import React, { useState } from 'react';
import RadioFilter from './filters/RadioFilterField';
import DateFilter from './filters/DateFilter';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import { Button, useTheme,  Grid, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions,
    TextField } from '@mui/material';
import { closeAllPositions, rolloverPositions } from './API/API';

const PositionFilter = ({
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
    const result = await closeAllPositions({
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
                <MarketScriptNameFilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                />
                <ClientMasterBrokerFilter
                    client={client}
                    master={master}
                    broker={broker}
                    setClient={setClient}
                    setMaster={setMaster}
                    setBroker={setBroker}
                />

               <Grid item xs={12} sm={4} md={2.4}>
    <Button
      fullWidth
      onClick={onApply}
      sx={{
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        padding: '6px 10px',
        borderRadius: '4px',
        textTransform: 'none',
        fontSize: '0.875rem',
        '&:hover': {
          backgroundColor: theme.palette.secondary.dark,
        },
      }}
    >
      Apply
    </Button>
  </Grid>

  {/* ✅ Rollover Button */}
  <Grid item xs={12} sm={4} md={2.4}>
  <Button
    fullWidth
    onClick={() => setOpenRolloverDialog(true)}  // Open dialog here
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


  {/* ✅ Close All Positions Button */}
  <Grid item xs={12} sm={4} md={2.4}>
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

    {/* Dialog remains the same */}
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
            </Grid>
        </>
    );
};

export default PositionFilter;
