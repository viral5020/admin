import React, { useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { getInputBoxStyle } from './inputBoxStyle';
import { useTheme } from '@emotion/react';
import { fetchOptionsAPI } from '../API/API';

const MasterFilter = ({ master, setMaster }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [masterOptions, setMasterOptions] = useState([]);
    const [inputBoxStyle, setInputBoxStyle] = useState({});
    const [userType, setUserType] = useState(0);

    // Utility fetcher
    async function fetchOptions(url, params, setter) {
        const data = await fetchOptionsAPI(url, params);
        setter(Array.isArray(data) ? data : []);
    }

    function handleFetch(term) {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        let params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
        };

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles/get_master_name_search';
        fetchOptions(url, { ...params, term }, setMasterOptions);
    }

    useEffect(() => {
        handleFetch('');
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        setUserType(dataStored.user_type);
        setInputBoxStyle(getInputBoxStyle(isDarkMode));
    }, []);

    return (
        <>
            {userType !== 1 && setMaster && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={masterOptions}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option?.text || ''
                        }
                        value={master || null}
                        inputValue={master?.text || ''}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                setMaster({ text: val });
                                handleFetch(val);
                            }
                        }}
                        onChange={(e, val) => setMaster(val)}
                        onBlur={() => {
                            const matched = masterOptions.find(
                                (opt) =>
                                    (typeof opt === 'string' ? opt : opt?.text) === master?.text
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
        </>
    );
};

export default MasterFilter;
