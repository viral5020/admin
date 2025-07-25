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

const OrderFilter = ({ isDarkMode, setStatus,
    setEnd_date,
    setStart_end,
    setOrderType,
    status,
    end_date,
    start_end,
    orderType
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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


    const inputBoxStyle = {
        backgroundColor: isDarkMode ? '#263238' : '#fff',
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
            height: 40,
            '& fieldset': {
                borderColor: '#c4c4c4',
            },
            '&:hover fieldset': {
                borderColor: '#000',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#000',
            },
        },
    };

    // Autocomplete handlers
    const handleFetch = (term, type) => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!term) return;
        let params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
        }

        switch (type) {
            case 'market':
                fetchOptions('/ajaxfiles/get_market_name_search', { ...params, term }, setMarketOptions);
                break;
            case 'script':
                fetchOptions('/ajaxfiles/get_script_name_search', { ...params, term, market }, setScriptOptions);
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
        <Box sx={{ pt: 1, mb: 2, overflowX: 'auto' }}>
            <Grid container spacing={1}>
                {/* (1) Status Multi-select - wider */}
                <Grid item xs={12} sm={6} md={4} lg={3.6}>
                    <Autocomplete
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
                    />
                </Grid>

                {/* (2) Trade After */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="Trade After"
                        type="date"
                        size="small"
                        value={end_date}
                        onChange={(e) => setEnd_date(e.target.value)}
                        InputProps={{ inputProps: { max: today } }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (3) Trade Before */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="Trade Before"
                        type="date"
                        size="small"
                        value={start_end}
                        onChange={(e) => setStart_end(e.target.value)}
                        InputProps={{ inputProps: { max: today } }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (4) Order Type - wider */}
                <Grid item xs={12} sm={6} md={4} lg={3.6}>
                    <FormControl fullWidth size="small" sx={inputBoxStyle}>
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

                {/* (5) Market Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        freeSolo
                        options={marketOptions}
                        value={market}
                        onInputChange={(e, val) => {
                            setMarket(val);
                            handleFetch(val, 'market');
                        }}
                        onChange={(e, val) => setMarket(val || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Market" size="small" sx={inputBoxStyle} />
                        )}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (6) Script Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        freeSolo
                        options={scriptOptions}
                        value={script}
                        onInputChange={(e, val) => {
                            setScript(val);
                            handleFetch(val, 'script');
                        }}
                        onChange={(e, val) => setScript(val || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Script" size="small" sx={inputBoxStyle} />
                        )}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (7) Client Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        freeSolo
                        options={clientOptions}
                        value={client}
                        onInputChange={(e, val) => {
                            setClient(val);
                            handleFetch(val, 'client');
                        }}
                        onChange={(e, val) => setClient(val || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Client" size="small" sx={inputBoxStyle} />
                        )}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (8) Master Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        freeSolo
                        options={masterOptions}
                        value={master}
                        onInputChange={(e, val) => {
                            setMaster(val);
                            handleFetch(val, 'master');
                        }}
                        onChange={(e, val) => setMaster(val || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Master" size="small" sx={inputBoxStyle} />
                        )}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (9) Broker Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        freeSolo
                        options={brokerOptions}
                        value={broker}
                        onInputChange={(e, val) => {
                            setBroker(val);
                            handleFetch(val, 'broker');
                        }}
                        onChange={(e, val) => setBroker(val || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Broker" size="small" sx={inputBoxStyle} />
                        )}
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>
            </Grid>
        </Box>


    );
};

export default OrderFilter;
