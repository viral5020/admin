import React, { useEffect, useState } from 'react';
import {
    Grid, Autocomplete, TextField, Tooltip,
} from '@mui/material';
import axios from 'axios';
import { getInputBoxStyle } from './inputBoxStyle';
import AutocompleteFilter from './AutocompleteFilter';
import { useTheme } from '@emotion/react';

const ClientMasterBrokerFilter = ({
    client,
    master,
    broker,
    setClient,
    setMaster,
    setBroker,
    showClient = true,
    showMaster = true,
    showBroker = true,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [clientOptions, setClientOptions] = useState([]);
    const [masterOptions, setMasterOptions] = useState([]);
    const [brokerOptions, setBrokerOptions] = useState([]);

    const [inputBoxStyle, setInputBoxStyle] = useState({});

    // Utility fetcher
    async function fetchOptions(url, params, setter) {
        try {
            const { data } = await axios.post(url, params);
            const results = data.results;
            setter(Array.isArray(results) ? results : []);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    };

    useEffect(() => {
        handleFetch('', 'client');
        handleFetch('', 'master');
        handleFetch('', 'broker');

        setInputBoxStyle(getInputBoxStyle(isDarkMode));
    }, []);

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
            case 'client':
                fetchOptions(`${url}/get_client_name_search`, { ...params, term: 1 }, setClientOptions);
                break;
            case 'master':
                fetchOptions(`${url}/get_master_name_search`, { ...params, term: 1 }, setMasterOptions);
                break;
            case 'broker':
                fetchOptions(`${url}/get_broker_name_search`, { ...params, term: 1, term2: 2 }, setBrokerOptions);
                break;
            default:
                break;
        }
    };

    return (
        <>
            {/* WHEN API WORKS, THEN MAKE IT FUNCTIONAL LIKE SCRIPT NAME'S AUTO COMPLETE */}

            {/* (7) Client Name */}
            {showClient && <Grid item xs={12} sm={6} md={3} lg={2.4}>
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
            </Grid>}

            {/* (8) Master Name */}
            {showMaster && <Grid item xs={12} sm={6} md={3} lg={2.4}>
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
            </Grid>}

            {/* (9) Broker Name */}
            {showBroker && <Grid item xs={12} sm={6} md={3} lg={2.4}>
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
            </Grid>}

            {/* {showClient && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <AutocompleteFilter
                        label="Client"
                        options={clientOptions}
                        value={client}
                        setValue={setClient}
                        handleFetch={handleFetch}
                        isDarkMode={isDarkMode}
                    />
                </Grid>
            )}

            {showMaster && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <AutocompleteFilter
                        label="Master"
                        options={masterOptions}
                        value={master}
                        setValue={setMaster}
                        handleFetch={handleFetch}
                        isDarkMode={isDarkMode}
                    />
                </Grid>
            )}

            {showBroker && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <AutocompleteFilter
                        label="Broker"
                        options={brokerOptions}
                        value={broker}
                        setValue={setBroker}
                        handleFetch={handleFetch}
                        isDarkMode={isDarkMode}
                    />
                </Grid>
            )} */}
        </>
    )
}

export default ClientMasterBrokerFilter