import React, { useEffect, useState } from 'react';
import {
    Grid, Autocomplete, TextField,
} from '@mui/material';
import { getInputBoxStyle } from './inputBoxStyle';
import { useTheme } from '@emotion/react';
import { fetchOptionsAPI } from '../API/API';

const Clientmasterall = ({
    client,
    master,
    broker,
    setClient,
    setMaster,
    setBroker,
    isMultipleBroker = false,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [clientOptions, setClientOptions] = useState([]);
    const [masterOptions, setMasterOptions] = useState([]);
    const [brokerOptions, setBrokerOptions] = useState([]);

    const [inputBoxStyle, setInputBoxStyle] = useState({});
    const [userType, setUserType] = useState(0);

    // Utility fetcher
    async function fetchOptions(url, params, setter) {
        const data = await fetchOptionsAPI(url, params);
        setter(Array.isArray(data) ? data : []);
    }

    function handleFetch(term, type) {
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};
        const params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
            block: 1, // <-- added block=1 to all calls
            term,
        };

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles';

        switch (type) {
            case 'client':
                fetchOptions(`${url}/get_client_name_search`, params, setClientOptions);
                break;
            case 'master':
                fetchOptions(`${url}/get_master_name_search`, params, setMasterOptions);
                break;
            case 'broker':
                fetchOptions(`${url}/get_broker_name_search`, { ...params, term2: 2 }, setBrokerOptions);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        handleFetch('', 'client');
        handleFetch('', 'master');
        handleFetch('', 'broker');
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};
        setUserType(dataStored.user_type);
        setInputBoxStyle(getInputBoxStyle(isDarkMode));
    }, [isDarkMode]);

    return (
        <>
            {/* Client Name */}
            {userType !== 1 && setClient && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={clientOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={client || null}
                        inputValue={client?.text || ''}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                setClient({ text: val });
                                handleFetch(val, 'client');
                            }
                        }}
                        onChange={(e, val) => setClient(val)}
                        onBlur={() => {
                            const matched = clientOptions.find(
                                (opt) => (typeof opt === 'string' ? opt : opt?.text) === client?.text
                            );
                            if (!matched) setClient(null);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Start typing to search..."
                                label="Client"
                                size="small"
                                sx={inputBoxStyle}
                            />
                        )}
                        noOptionsText="No Client found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>
            )}

            {/* Master Name */}
            {userType !== 1 && setMaster && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={masterOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={master || null}
                        inputValue={master?.text || ''}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                setMaster({ text: val });
                                handleFetch(val, 'master');
                            }
                        }}
                        onChange={(e, val) => setMaster(val)}
                        onBlur={() => {
                            const matched = masterOptions.find(
                                (opt) => (typeof opt === 'string' ? opt : opt?.text) === master?.text
                            );
                            if (!matched) setMaster(null);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Start typing to search..."
                                label="Master"
                                size="small"
                                sx={inputBoxStyle}
                            />
                        )}
                        noOptionsText="No Master found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>
            )}

            {/* Broker Name */}
            {setBroker && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        multiple={isMultipleBroker}
                        options={brokerOptions}
                        getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                        value={Array.isArray(broker) ? broker : (broker || null)}
                        filterSelectedOptions={isMultipleBroker}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                handleFetch(val, 'broker');
                            }
                        }}
                        onChange={(e, val) => setBroker(val)}
                        renderOption={(props, option) => {
                            const optionText = typeof option === 'string' ? option : option.text;
                            const isSelected = Array.isArray(broker)
                                ? broker.some(
                                    (item) =>
                                        (typeof item === 'string' ? item : item.text) === optionText
                                )
                                : (typeof broker === 'string' ? broker : broker?.text) === optionText;

                            return (
                                <li
                                    {...props}
                                    style={{
                                        backgroundColor: isSelected
                                            ? isDarkMode
                                                ? '#333'
                                                : '#e0f7fa'
                                            : 'inherit',
                                        color: isSelected ? '#999' : 'inherit',
                                        pointerEvents: isSelected ? 'none' : 'auto',
                                        opacity: isSelected ? 0.6 : 1,
                                    }}
                                    aria-disabled={isSelected}
                                >
                                    {optionText}
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Start typing to search..."
                                label="Broker"
                                size="small"
                                sx={inputBoxStyle}
                            />
                        )}
                        noOptionsText="No Broker found"
                        fullWidth
                        sx={inputBoxStyle}
                    />
                </Grid>
            )}
        </>
    );
};

export default Clientmasterall;
