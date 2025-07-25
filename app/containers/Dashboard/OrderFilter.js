import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import axios from 'axios';

const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending Order', value: 'is_pending' },
    { label: 'Executed Order', value: 'is_executed' },
];

const orderTypes = [
    'Buy Limit', 'Buy Stop Loss', 'Sell Limit', 'Sell Stop Loss'
];

const OrderFilter = ({ isDarkMode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [status, setStatus] = useState([]);
    const [tradeAfter, setTradeAfter] = useState('');
    const [tradeBefore, setTradeBefore] = useState('');
    const [orderType, setOrderType] = useState('');

    const [market, setMarket] = useState('');
    const [script, setScript] = useState('');
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');

    const [marketOptions, setMarketOptions] = useState([]);
    const [scriptOptions, setScriptOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [masterOptions, setMasterOptions] = useState([]);
    const [brokerOptions, setBrokerOptions] = useState([]);

    // Utility fetcher
    const fetchOptions = async (url, params, setter) => {
        try {
            const { data } = await axios.get(url, { params });
            setter(data || []);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    };

    // Autocomplete handlers
    const handleFetch = (term, type) => {
        if (!term) return;

        switch (type) {
            case 'market':
                fetchOptions('/ajaxfiles/get_market_name_search', { term }, setMarketOptions);
                break;
            case 'script':
                fetchOptions('/ajaxfiles/get_script_name_search', { term, market }, setScriptOptions);
                break;
            case 'client':
                fetchOptions('/ajaxfiles/get_client_name_search', { term: 1 }, setClientOptions);
                break;
            case 'master':
                fetchOptions('/ajaxfiles/get_master_name_search', { term: 1 }, setMasterOptions);
                break;
            case 'broker':
                fetchOptions('/ajaxfiles/get_broker_name_search', { term: 1, term2: 2 }, setBrokerOptions);
                break;
            default:
                break;
        }
    };

    const today = dayjs().format('YYYY-MM-DD');

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                {/* (1) Status Multi-select */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <Autocomplete
                        multiple
                        options={statusOptions}
                        getOptionLabel={(opt) => opt.label}
                        value={status}
                        onChange={(e, val) => setStatus(val)}
                        renderInput={(params) => (
                            <TextField {...params} label="Status" size="small" />
                        )}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        disableCloseOnSelect
                        sx={{ backgroundColor: isDarkMode ? '#263238' : '#fff', borderRadius: 1 }}
                    />
                </Grid>

                {/* (2) Trade After */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <TextField
                        label="Trade After"
                        type="date"
                        size="small"
                        value={tradeAfter}
                        onChange={(e) => setTradeAfter(e.target.value)}
                        InputProps={{ inputProps: { max: today } }}
                        fullWidth
                    />
                </Grid>

                {/* (3) Trade Before */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <TextField
                        label="Trade Before"
                        type="date"
                        size="small"
                        value={tradeBefore}
                        onChange={(e) => setTradeBefore(e.target.value)}
                        InputProps={{ inputProps: { max: today } }}
                        fullWidth
                    />
                </Grid>

                {/* (4) Order Type */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Select Order Type</InputLabel>
                        <Select
                            value={orderType}
                            onChange={(e) => setOrderType(e.target.value)}
                            label="Select Order Type"
                        >
                            <MenuItem value="">Select Order Type</MenuItem>
                            {orderTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* (5) Market Name */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <Autocomplete
                        freeSolo
                        options={marketOptions}
                        value={market}
                        onInputChange={(e, val) => {
                            setMarket(val);
                            handleFetch(val, 'market');
                        }}
                        onChange={(e, val) => setMarket(val || '')}
                        renderInput={(params) => <TextField {...params} label="Market" size="small" />}
                        fullWidth
                    />
                </Grid>

                {/* (6) Script Name */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <Autocomplete
                        freeSolo
                        options={scriptOptions.length ? scriptOptions : []}
                        value={script}
                        onInputChange={(e, val) => {
                            setScript(val);
                            handleFetch(val, 'script');
                        }}
                        onChange={(e, val) => setScript(val || '')}
                        renderInput={(params) => <TextField {...params} label="Script" size="small" />}
                        fullWidth
                    />
                </Grid>

                {/* (7) Client Name */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <Autocomplete
                        freeSolo
                        options={clientOptions}
                        value={client}
                        onInputChange={(e, val) => {
                            setClient(val);
                            handleFetch(val, 'client');
                        }}
                        onChange={(e, val) => setClient(val || '')}
                        renderInput={(params) => <TextField {...params} label="Client" size="small" />}
                        fullWidth
                    />
                </Grid>

                {/* (8) Master Name */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <Autocomplete
                        freeSolo
                        options={masterOptions}
                        value={master}
                        onInputChange={(e, val) => {
                            setMaster(val);
                            handleFetch(val, 'master');
                        }}
                        onChange={(e, val) => setMaster(val || '')}
                        renderInput={(params) => <TextField {...params} label="Master" size="small" />}
                        fullWidth
                    />
                </Grid>

                {/* (9) Broker Name */}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
                    <Autocomplete
                        freeSolo
                        options={brokerOptions}
                        value={broker}
                        onInputChange={(e, val) => {
                            setBroker(val);
                            handleFetch(val, 'broker');
                        }}
                        onChange={(e, val) => setBroker(val || '')}
                        renderInput={(params) => <TextField {...params} label="Broker" size="small" />}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default OrderFilter;
