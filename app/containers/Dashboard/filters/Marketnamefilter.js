import React, { useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { useTheme } from '@emotion/react';
import { forex_comex_market } from '../helpers/utilFunc';
import { fetchOptionsAPI } from '../API/API';

const Marketnamefilter = ({
    market,
    setMarket,
    isForex,
    showMarket = true,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const [marketOptions, setMarketOptions] = useState(
        isForex ? forex_comex_market : []
    );

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

    async function fetchOptions(url, params, setter) {
        const data = await fetchOptionsAPI(url, params);
        setter(Array.isArray(data) ? data : []);
    }

    function handleFetch(term) {
        const dataStored = JSON.parse(sessionStorage.getItem('data'));
        let params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
        };

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles';
        if (!isForex) {
            fetchOptions(`${url}/get_market_name_search`, { ...params, term }, setMarketOptions);
        }
    }

    useEffect(() => {
        handleFetch('');
    }, []);

    return (
        <>
            {showMarket && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={marketOptions}
                        getOptionLabel={(option) =>
                            typeof option === 'string'
                                ? option
                                : option?.text || ''
                        }
                        value={market || null}
                        inputValue={market?.text || ''}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                setMarket({ text: val }); // temporarily set
                                handleFetch(val);
                            }
                        }}
                        onChange={(e, val) => {
                            setMarket(val);
                        }}
                        onBlur={() => {
                            const matched = marketOptions.find(
                                (opt) =>
                                    (typeof opt === 'string'
                                        ? opt
                                        : opt?.text) === market?.text
                            );
                            !matched && setMarket(null);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Start typing to search..."
                                label="Market"
                                size="small"
                                sx={inputBoxStyle}
                            />
                        )}
                        noOptionsText="No Market found"
                        fullWidth
                        sx={{
                            ...inputBoxStyle,
                            '& .MuiAutocomplete-input': {
                                width: '100% !important',
                            },
                        }}
                    />
                </Grid>
            )}
        </>
    );
};

export default Marketnamefilter;
