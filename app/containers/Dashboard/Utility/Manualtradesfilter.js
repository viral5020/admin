import React from 'react';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormGroup,
    useTheme,
    Paper,
} from '@mui/material';
import DateFilter from '../filters/DateFilter';
import Manualscriptfilter from '../filters/Manualscriptfilter';
import Clientmanualfilter from '../filters/Clientmanualfilter';




const Manualtradesfilter = ({
    // Date filters
    start_date, setStart_date,
    end_date, setEnd_date,
    trade_date, settrade_date,

    // Script/market/client
    market, setMarket,
    script, setScript,
    client, setClient,
    master, setMaster,
    broker, setBroker,

    // Trade params
    lot, setLot,
    quantity, setQuantity,
    price, setPrice,
    pair, setPair,
    brokerage, setBrokerage,

    // Flags
    is_deleted, setIs_deleted,
    is_updated, setIs_updated,
    isAdminOnly, setIsAdminOnly,

    // Handlers
    onApply,
    onSubmit
}) => {
    const theme = useTheme();

    // Whole box color based on Buy/Sell
    const filterBoxColor =
        pair === '0' // Buy
            ? theme.palette.info.light // blue
            : pair === '1' // Sell
                ? theme.palette.error.light // red
                : theme.palette.grey[100]; // default

    const handleClear = () => {
        if (setStart_date) setStart_date("");
        if (setEnd_date) setEnd_date("");
        if (settrade_date) settrade_date("");
        if (setMarket) setMarket("");
        if (setScript) setScript("");
        if (setClient) setClient(null);
        if (setMaster) setMaster(null);
        if (setBroker) setBroker(null);
        if (setLot) setLot("");
        if (setQuantity) setQuantity("");
        if (setPrice) setPrice("");
        if (setPair) setPair("");
        if (setBrokerage) setBrokerage("");
        if (setIs_deleted) setIs_deleted(false);
        if (setIs_updated) setIs_updated(false);
        if (setIsAdminOnly) setIsAdminOnly(false);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: filterBoxColor,
                transition: 'background-color 0.3s ease',
            }}
        >
            <Grid container spacing={1} sx={{ alignItems: 'center' }}>
                {/* Update/Delete Checkboxes */}
                {setIs_updated && (
                    <Grid item xs={12} sm={6} md={3} lg={2.4}>
                        <FormGroup row>
                            {setIs_updated && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={is_updated}
                                            onChange={(e) => setIs_updated(e.target.checked)}
                                        />
                                    }
                                    label="Update"
                                />
                            )}
                            {setIs_deleted && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={is_deleted}
                                            onChange={(e) => setIs_deleted(e.target.checked)}
                                        />
                                    }
                                    label="Delete"
                                />
                            )}
                        </FormGroup>
                    </Grid>
                )}

                {/* Date Filters */}
                {setStart_date && <DateFilter label="From Date" value={start_date} onChange={setStart_date} />}
                {setEnd_date && <DateFilter label="To Date" value={end_date} onChange={setEnd_date} />}
                {settrade_date && <DateFilter label="Trade Date" value={trade_date} onChange={settrade_date} />}

                {/* Script/Market Filter */}
                <Manualscriptfilter
                    market={market}
                    setMarket={setMarket}
                    script={script}
                    setScript={setScript}
                    onLotQtyChange={(lotQty) => {
                        setLot(1);
                        setQuantity(lotQty);
                    }}
                />

                {/* Trade Inputs */}

                <Grid item>
                    <TextField
                        label="Price"
                        size="small"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        sx={{ width: 100 }}
                    />
                </Grid>

                {/* Client/Master/Broker Filter */}
                <Clientmanualfilter
                    client={client}
                    setClient={setClient}
                    master={master}
                    setMaster={setMaster}
                    broker={broker}
                    setBroker={setBroker}
                />

                {/* Trade type (Buy/Sell) */}
                <Grid item>
                    <FormControl>
                        <RadioGroup row value={pair} onChange={(e) => setPair(e.target.value)}>
                            <FormControlLabel value="0" control={<Radio size="small" />} label="Buy" />
                            <FormControlLabel value="1" control={<Radio size="small" />} label="Sell" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                {/* Brokerage toggle */}
                <Grid item>
                    <FormControl>
                        <RadioGroup row value={brokerage} onChange={(e) => setBrokerage(e.target.value)}>
                            <FormControlLabel value="0" control={<Radio size="small" />} label="With Brokerage" />
                            <FormControlLabel value="1" control={<Radio size="small" />} label="Without Brokerage" />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                {/* Buttons */}
                {onApply && (
                    <Grid item>
                        <Button onClick={onApply}>Apply</Button>
                    </Grid>
                )}
                {onSubmit && (
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onSubmit}
                            sx={{ borderRadius: 1 }}
                        >
                            Submit
                        </Button>
                    </Grid>
                )}
                <Grid item>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleClear}
                        sx={{ borderRadius: 1, ml: 1 }}
                    >
                        Clear
                    </Button>
                </Grid>

            </Grid>
        </Paper>
    );
};

export default Manualtradesfilter;
