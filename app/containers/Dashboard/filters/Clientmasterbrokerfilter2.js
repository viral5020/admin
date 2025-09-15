import React, { useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { useTheme } from '@emotion/react';
import axiosInstance from '../API/axiosconfig';
import { getInputBoxStyle } from './inputBoxStyle';

const ClientMasterBrokerFilter2 = ({ setUserType, userType, selectedUser, setSelectedUser }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const inputBoxStyle = getInputBoxStyle(isDarkMode);

    const [options, setOptions] = useState([]);

    const userTypeOptions = [
        { label: 'Client', value: 'client' },
        { label: 'Master', value: 'master' },
        { label: 'Broker', value: 'broker' },
    ];

    const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

    // Fetch options based on selected user type & search text
    const fetchOptions = async (type, searchText = "") => {
        if (!type) return;

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles';
        const params = {
            is_app: 1,
            login_user_id: dataStored.user_id,
            auth_key: dataStored.auth_key,
            term: searchText,
        };

        let endpoint = '';
        switch (type) {
            case 'client':
                endpoint = '/get_client_name_search';
                break;
            case 'master':
                endpoint = '/get_master_name_search';
                break;
            case 'broker':
                endpoint = '/get_broker_name_search';
                params.term2 = 2;
                break;
            default:
                return;
        }

        try {
            const { data } = await axiosInstance.post(url + endpoint, params);
            setOptions(Array.isArray(data.results) ? data.results : []);
        } catch (err) {
            console.error('Error fetching options', err);
            setOptions([]);
        }
    };

    // fetch initial options when userType changes
    useEffect(() => {
        if (userType) fetchOptions(userType.value, ""); // empty string initially
        setSelectedUser(null);
    }, [userType]);

    return (
        <Grid container spacing={2}>
            {/* User Type Dropdown */}
            <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                    options={userTypeOptions}
                    getOptionLabel={(option) => option.label}
                    value={userType}
                    onChange={(e, val) => setUserType(val)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select User Type" size="small" sx={inputBoxStyle} />
                    )}
                    fullWidth
                />
            </Grid>

            {/* Dependent Dropdown */}
            <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => typeof option === "string" ? option : option?.text || ""}
                    value={selectedUser}
                    onChange={(e, val) => {
                        setSelectedUser(val);
                    }}
                    onInputChange={(e, newInputValue, reason) => {
                        if (userType && reason === 'input') {
                            fetchOptions(userType.value, newInputValue); // 🔥 pass typed text
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={userType ? userType.label : "Select Option"}
                            placeholder={userType ? `Start typing ${userType.label}` : "Select User Type first"}
                            size="small"
                            sx={inputBoxStyle}
                        />
                    )}
                    fullWidth
                    disabled={!userType}
                />
            </Grid>
        </Grid>
    );
};

export default ClientMasterBrokerFilter2;
