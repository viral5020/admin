import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl, useMediaQuery,
    Tooltip
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

    const [marketSelectedVal, setMarketSelectedVal] = useState({});
    const [scriptSelectedVal, setScriptSelectedVal] = useState({});
    const [clientSelectedVal, setClientSelectedVal] = useState({});
    const [masterSelectedVal, setMasterSelectedVal] = useState({});
    const [brokerSelectedVal, setBrokerSelectedVal] = useState({});

    const [marketOptions, setMarketOptions] = useState([]);
    const [scriptOptions, setScriptOptions] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [masterOptions, setMasterOptions] = useState([]);
    const [brokerOptions, setBrokerOptions] = useState([]);

    const [isScriptNameDisable, setIsScriptNameDisable] = useState(true)

    useEffect(() => {
        console.log('market', market);
        if (Object.keys(market || {}).length === 0) {
            setIsScriptNameDisable(true);
        } else {
            market.id ? handleFetch('', 'script') : null;
            setIsScriptNameDisable(false);
        }
    }, [market])

    // Utility fetcher
    async function fetchOptions(url, params, setter) {
        try {
            const { data } = await axios.post(url, params); // POST request with body
            const results = data.results;
            setter(Array.isArray(results) ? results : []);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    };

    useEffect(() => {
        handleFetch('', "market");
        handleFetch('', 'client');
        handleFetch('', 'master');
        handleFetch('', 'broker');
    }, []);

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
    function handleFetch(term, type) {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        // if (!term) return;
        let params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
        }

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles'

        switch (type) {
            case 'market':
                fetchOptions(`${url}/get_market_name_search`, { ...params, term }, setMarketOptions);
                break;
            case 'script':
                fetchOptions(`${url}/get_script_name_search`, { ...params, term, market: market.id }, setScriptOptions);
                break;
            case 'client':
                fetchOptions(`${url}/get_client_name_search`, { term: 1 }, setClientOptions);
                break;
            case 'master':
                fetchOptions(`${url}/get_master_name_search`, { term: 1 }, setMasterOptions);
                break;
            case 'broker':
                fetchOptions(`${url}/get_broker_name_search`, { term: 1, term2: 2 }, setBrokerOptions);
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
                        options={marketOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={market || null}
                        inputValue={market?.text || ''}
                        onInputChange={(e, val, reason) => {
                            (reason === 'input') && setMarket({ text: val }); // tempararyly set market value
                            handleFetch(val, 'market');
                        }}
                        onChange={(e, val) => setMarket(val)}
                        onBlur={() => {  // on focus out, if inputvalue don't match with any options then setMarket(null)
                            const matched = marketOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === market?.text);
                            (!matched) && setMarket(null);  // clear if unmatched
                        }}
                        renderInput={(params) => <TextField {...params} label="Market" size="small" sx={inputBoxStyle} />}
                        noOptionsText="No Market found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>



                {/* (6) Script Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Tooltip arrow disableHoverListener={!isScriptNameDisable}
                        title={isScriptNameDisable ? "First Select Market Name" : ""}
                    >
                        <Autocomplete
                            disabled={isScriptNameDisable}
                            options={scriptOptions}
                            getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                            value={script || null}
                            inputValue={script?.text || ''}
                            onInputChange={(e, val, reason) => {
                                (reason === 'input') && setScript({ text: val }); // tempararyly set Script value
                                handleFetch(val, 'script');
                            }}
                            onChange={(e, val) => setScript(val)}
                            onBlur={() => {  // on focus out, if inputvalue don't match with any options then setScript(null)
                                console.log('scriptOptions', scriptOptions);
                                console.log('script?.text', script?.text);
                                console.log('opt?.text', opt?.text);
                                const matched = scriptOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === script?.text);
                                (!matched) && setScript(null);  // clear if unmatched
                            }}
                            renderInput={(params) => <TextField {...params} label="Script" size="small" sx={inputBoxStyle} />}
                            noOptionsText="No Script found"
                            fullWidth
                            sx={inputBoxStyle}
                        />
                    </Tooltip>
                </Grid>

                {/* (7) Client Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={clientOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={client || null}
                        inputValue={client?.text || ''}
                        onInputChange={(e, val, reason) => {
                            (reason === 'input') && setClient({ text: val });
                            handleFetch(val, 'client');
                        }}
                        onChange={(e, val) => setClient(val)}
                        onBlur={() => {
                            const matched = clientOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === client?.text);
                            (!matched) && setClient(null);
                        }}
                        renderInput={(params) => <TextField {...params} label="Client" size="small" sx={inputBoxStyle} />}
                        noOptionsText="No Client found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (8) Master Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={masterOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={master || null}
                        inputValue={master?.text || ''}
                        onInputChange={(e, val, reason) => {
                            (reason === 'input') && setMaster({ text: val });
                            handleFetch(val, 'master');
                        }}
                        onChange={(e, val) => setMaster(val)}
                        onBlur={() => {
                            const matched = masterOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === master?.text);
                            (!matched) && setMaster(null);
                        }}
                        renderInput={(params) => <TextField {...params} label="Master" size="small" sx={inputBoxStyle} />}
                        noOptionsText="No Master found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>

                {/* (9) Broker Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={brokerOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={broker || null}
                        inputValue={broker?.text || ''}
                        onInputChange={(e, val, reason) => {
                            (reason === 'input') && setBroker({ text: val });
                            handleFetch(val, 'broker');
                        }}
                        onChange={(e, val) => setBroker(val)}
                        onBlur={() => {
                            const matched = brokerOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === broker?.text);
                            (!matched) && setBroker(null);
                        }}
                        renderInput={(params) => <TextField {...params} label="Broker" size="small" sx={inputBoxStyle} />}
                        noOptionsText="No Broker found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>


            </Grid>
        </Box>


    );
};

export default OrderFilter;
