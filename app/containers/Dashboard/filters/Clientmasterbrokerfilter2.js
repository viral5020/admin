import React, { useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { useTheme } from '@emotion/react';
import axiosInstance from '../API/axiosconfig';
import { getInputBoxStyle } from './inputBoxStyle';

const ClientMasterBrokerFilter2 = ({ value, setValue }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const inputBoxStyle = getInputBoxStyle(isDarkMode);

    const [userType, setUserType] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const userTypes = [
        { label: 'Client', value: 'client' },
        { label: 'Master', value: 'master' },
        { label: 'Broker', value: 'broker' }
    ];

    const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

    // Fetch options based on selected user type
    const fetchOptions = async (type) => {
        if (!type) return;
        const url = 'http://128.199.126.171/~goldorg/ajaxfiles';
        const params = {
            is_app: 1,
            login_user_id: dataStored.user_id,
            auth_key: dataStored.auth_key,
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

    useEffect(() => {
        if (userType) fetchOptions(userType.value);
    }, [userType]);

    return (
        <Grid container spacing={2}>
            {/* User Type Dropdown */}
            <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                    options={userTypes}
                    getOptionLabel={(option) => option.label}
                    value={userType}
                    onChange={(e, val) => {
                        setUserType(val);
                        setSelectedOption(null); // reset dependent dropdown
                    }}
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
                    getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                    value={selectedOption}
                    onChange={(e, val) => {
                        setSelectedOption(val);
                        setValue(val); // pass selected option to parent if needed
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={userType ? userType.label : 'Select Option'}
                            placeholder={userType ? `Start typing ${userType.label}` : 'Select User Type first'}
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
