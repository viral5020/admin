import React, { useEffect, useState } from 'react';
import {
    Grid, Autocomplete, TextField, Tooltip,
} from '@mui/material';
import { getInputBoxStyle } from './inputBoxStyle';
import AutocompleteFilter from './AutocompleteFilter';
import { useTheme } from '@emotion/react';
import { clone } from 'lodash';
import axiosInstance from '../API/axiosconfig';
import { fetchOptionsAPI } from '../API/API';

const ClientMasterBrokerFilter = ({
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
    const [userType, setUserType] = useState(0)

    const data = sessionStorage.getItem("data");

    useEffect(() => {
        console.log('broker', broker);
    }, [broker])

    // Utility fetcher
    async function fetchOptions(url, params, setter) {
        // try {
        //     const { data } = await axiosInstance.post(url, params);
        //     const results = data.results;
        //     // console.log('TTT results', results);
        //     setter(Array.isArray(results) ? results : []);
        // } catch (err) {
        //     console.error(`Error fetching from ${url}`, err);
        //     setter([]);
        // }
        const data = await fetchOptionsAPI(url, params);
        setter(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        handleFetch('', 'client');
        handleFetch('', 'master');
        handleFetch('', 'broker');
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        setUserType(dataStored.user_type)
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
                // console.log('TTT term', term);
                fetchOptions(`${url}/get_client_name_search`, { ...params, term }, setClientOptions);
                break;
            case 'master':
                fetchOptions(`${url}/get_master_name_search`, { ...params, term }, setMasterOptions);
                break;
            case 'broker':
                fetchOptions(`${url}/get_broker_name_search`, { ...params, term, term2: 2 }, setBrokerOptions);
                break;
            default:
                break;
        }
    };

    return (
        <>
            {/* WHEN API WORKS, THEN MAKE IT FUNCTIONAL LIKE SCRIPT NAME'S AUTO COMPLETE */}

            {/* (7) Client Name */}
            {userType != 1 && setClient && <Grid item xs={12} sm={6} md={3} lg={2.4}>
                <Autocomplete
                    options={clientOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                    value={client || null}
                    // isOptionEqualToValue={(option, value) => {
                    //     if (!value || Object.keys(value).length === 0) return false; // empty object case
                    //     return option?.text === value?.text;
                    // }}
                    inputValue={client?.text || ''}
                    onInputChange={(e, val, reason) => {
                        if (reason === 'input') {
                            setClient({ text: val });
                            console.log('val', val);
                            handleFetch(val, 'client');
                        }
                    }}
                    onChange={(e, val) => setClient(val)}
                    onBlur={() => {
                        console.log('TTT clientOptions', clientOptions);
                        const matched = clientOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === client?.text);
                        (!matched) && setClient(null);
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Start typing to search..." label="Client" size="small" sx={inputBoxStyle} />}
                    noOptionsText="No Client found"
                    fullWidth
                    sx={inputBoxStyle}
                />
            </Grid>}

            {/* (8) Master Name */}
            {userType != 1 && setMaster && <Grid item xs={12} sm={6} md={3} lg={2.4}>
                <Autocomplete
                    options={masterOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                    value={master || null}
                    // isOptionEqualToValue={(option, value) => {
                    //     if (!value || Object.keys(value).length === 0) return false; // empty object case
                    //     return option?.text === value?.text;
                    // }}
                    inputValue={master?.text || ''}
                    onInputChange={(e, val, reason) => {
                        if (reason === 'input') {
                            setMaster({ text: val });
                            handleFetch(val, 'master');
                        }
                    }}
                    onChange={(e, val) => setMaster(val)}
                    onBlur={() => {
                        const matched = masterOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === master?.text);
                        (!matched) && setMaster(null);
                    }}
                    renderInput={(params) => <TextField {...params} placeholder="Start typing to search..." label="Master" size="small" sx={inputBoxStyle} />}
                    noOptionsText="No Master found"
                    fullWidth
                    sx={inputBoxStyle}
                />
            </Grid>}

            {/* (9) Broker Name */}
            {setBroker && <Grid item xs={12} sm={6} md={3} lg={2.4}>
                <Autocomplete
                    multiple={isMultipleBroker}
                    options={brokerOptions}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                    // value={broker || null}
                    value={Array.isArray(broker) ? broker : (broker || null)}
                    // isOptionEqualToValue={(option, value) => {
                    //     if (!value || Object.keys(value).length === 0) return false; // empty object case
                    //     return option?.text === value?.text;
                    // }}
                    filterSelectedOptions={isMultipleBroker}
                    // inputValue={broker?.text || ''}
                    onInputChange={(e, val, reason) => {
                        if (reason === 'input') {
                            // setBroker({ text: val });
                            handleFetch(val, 'broker');
                        }
                    }}
                    onChange={(e, val) => setBroker(val)}
                    // onBlur={() => {
                    //     const matched = brokerOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === broker?.text);
                    //     (!matched) && setBroker(null);
                    // }}
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
                    renderInput={(params) => <TextField {...params} placeholder="Start typing to search..." label="Broker" size="small" sx={inputBoxStyle} />}
                    noOptionsText="No Broker found"
                    fullWidth
                    sx={inputBoxStyle}
                />
            </Grid>}
        </>
    )
}

export default ClientMasterBrokerFilter