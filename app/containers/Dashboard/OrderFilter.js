import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl, useMediaQuery,
    Tooltip,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import axios from 'axios';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import DateFilter from './filters/DateFilter';
import RadioFilter from './filters/RadioFilterField';
import { getInputBoxStyle } from './filters/inputBoxStyle';

const statusOptions = [
    // { label: 'All', value: 'all' },
    { label: 'Pending Order', value: 'is_pending' },
    { label: 'Executed Order', value: 'is_executed' },
];

const orderTypes = [
    'Buy Limit', 'Buy Stop Loss', 'Sell Limit', 'Sell Stop Loss'
];

const OrderFilter = ({ isDarkMode, setStatus,
    setEnd_date,
    setStart_end,
    setOrderType,
    status,
    end_date,
    start_end,
    orderType
}) => {
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');

    const today = dayjs().format('YYYY-MM-DD');

    return (
        <Box sx={{ pt: 1, mb: 2, overflowX: 'auto' }}>
            <Grid container spacing={1}>
                {/* (1) Status Multi-select - wider */}
                <Grid item xs={12} sm={6} md={4} lg={3.6}>
                    <RadioFilter
                        label="Status"
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                        flag={false}
                    />
                </Grid>

                {/* (2) Trade After */}
                <DateFilter
                    label="Trade After"
                    value={start_end}
                    onChange={setStart_end}
                />

                {/* (3) Trade Before */}
                <DateFilter
                    label="Trade Before"
                    value={end_date}
                    onChange={setEnd_date}
                />

                {/* (4) Order Type - wider */}
                <Grid item xs={12} sm={6} md={4} lg={3.6}>
                    <FormControl fullWidth size="small" sx={getInputBoxStyle(isDarkMode)}>
                        <InputLabel>Select Order Type</InputLabel>
                        <Select
                            value={orderType}
                            onChange={(e) => setOrderType(e.target.value)}
                            label="Select Order Type"
                        >
                            <MenuItem value="">Select Order Type</MenuItem>
                            {orderTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* ➤ Moved Market to second row (after Order Type) */}

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
            </Grid>
        </Box>


    );
};

export default OrderFilter;
