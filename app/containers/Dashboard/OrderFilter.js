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
            <Grid container spacing={1} sx={{ p: 0 }}>
                {/* (1) Status Multi-select - wider */}
                <Grid item xs={12} sm={6} md={4} lg={3.6} sx={{ p: 0 }}>
                    {/* <Autocomplete
                        multiple
                        options={statusOptions}
                        getOptionLabel={(opt) => opt.label}
                        value={status}
                        onChange={(e, val) => setStatus(val)}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        disableCloseOnSelect
                        renderInput={(params) => (
                            <TextField {...params} label="Status" size="small" sx={inputBoxStyle} />
                        )}
                        fullWidth
                        sx={inputBoxStyle}
                    /> */}
                    {/* <FormControl component="fieldset" fullWidth sx={{ ...inputBoxStyle, p: 0 }}>
                        <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>Status</FormLabel>
                        <RadioGroup
                            row
                            value={status?.value || ""}
                            onChange={(e) => {
                                const selected = statusOptions.find((opt) => opt.value === e.target.value);
                                setStatus(selected);
                            }}
                            sx={{ p: 0 }}
                        >
                            {statusOptions.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio size="small" />}
                                    label={option.label}
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.8rem' }, mx: 0 }} />
                            ))}
                        </RadioGroup>
                    </FormControl> */}
                    <RadioFilter
                        label="Status"
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                    />
                </Grid>

                {/* (2) Trade After */}
                <DateFilter
                    label="Trade After"
                    value={end_date}
                    onChange={setEnd_date}
                    maxDate={today}
                />

                {/* (3) Trade Before */}
                <DateFilter
                    label="Trade Before"
                    value={start_end}
                    onChange={setStart_end}
                    maxDate={today}
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
                    isDarkMode={isDarkMode}
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                />
                <ClientMasterBrokerFilter
                    isDarkMode={isDarkMode}
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
