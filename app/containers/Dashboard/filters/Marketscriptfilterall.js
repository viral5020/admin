import React, { useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { useTheme } from '@emotion/react';
import { forex_comex_market } from '../helpers/utilFunc';
import { fetchOptionsAPI } from '../API/API';

const Marketscriptfilterall = ({
    script,
    setScript,
    setMarket,
    market,
    isScriptMultiSelect = false,
    isForex,
    showMarket = true,
    showScript = true
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [marketOptions, setMarketOptions] = useState(isForex ? forex_comex_market : []);
    const [scriptOptions, setScriptOptions] = useState([]);
    const [isScriptNameDisable, setIsScriptNameDisable] = useState(true);

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

    useEffect(() => {
        setIsScriptNameDisable(!market);
    }, [market]);

    useEffect(() => {
        if (!isForex) {
            handleFetch('', 'market');
        }
    }, []);

    async function fetchOptions(url, params, setter) {
        try {
            const data = await fetchOptionsAPI(url, params);
            setter(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    }

    function handleFetch(term, type, selectedMarket) {
        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};
        const params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
            block: 1,
        };

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles';

        switch (type) {
            case 'market':
                if (!isForex) {
                    fetchOptions(`${url}/get_market_name_search`, { ...params, term }, setMarketOptions);
                }
                break;
            case 'script': {
                const marketToUse = selectedMarket || market;
                if (isForex && !marketToUse && !term) {
                    setScriptOptions([]);
                } else if (marketToUse?.id) {
                    fetchOptions(
                        `${url}/get_script_name_search`,
                        { ...params, term, market: marketToUse.id },
                        setScriptOptions
                    );
                } else {
                    setScriptOptions([]);
                }
                break;
            }
            default:
                break;
        }
    }

    return (
        <>
            {showMarket && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={marketOptions}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option?.text || ''
                        }
                        value={market || null}
                        inputValue={market?.text || ''}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                setMarket({ text: val });
                                handleFetch(val, 'market');
                            }
                        }}
                        onChange={(e, val) => {
                            setMarket(val);
                            setScript([]); // clear scripts when market changes
                            handleFetch('', 'script', val);
                        }}
                        onBlur={() => {
                            const matched = marketOptions.find(
                                (opt) => (typeof opt === 'string' ? opt : opt?.text) === market?.text
                            );
                            if (!matched) setMarket(null);
                            handleFetch('', 'script', market);
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
                            '& .MuiAutocomplete-input': { width: '100% !important' },
                        }}
                    />
                </Grid>
            )}

            {showScript && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        multiple={isScriptMultiSelect}
                        disableCloseOnSelect={isScriptMultiSelect}
                        options={scriptOptions}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option?.text || ''
                        }
                        value={script} // <-- script should always be an array in parent
                        filterSelectedOptions={isScriptMultiSelect}
                        disabled={isScriptNameDisable}
                        onInputChange={(e, val, reason) => {
                            if (reason === 'input') {
                                handleFetch(val, 'script', market);
                            }
                        }}
                        onChange={(e, val) => setScript(val)}
                        renderOption={(props, option) => {
                            const optionText = typeof option === 'string' ? option : option.text;
                            const isSelected = Array.isArray(script)
                                ? script.some(
                                    (item) =>
                                        (typeof item === 'string' ? item : item.text) === optionText
                                )
                                : (typeof script === 'string' ? script : script?.text) === optionText;

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
                                label="Script"
                                size="small"
                                sx={inputBoxStyle}
                            />
                        )}
                        noOptionsText="No Script found"
                        fullWidth
                        sx={{
                            ...inputBoxStyle,
                            '& .MuiAutocomplete-input': { width: 'auto !important' },
                        }}
                    />
                </Grid>
            )}
        </>
    );
};

export default Marketscriptfilterall;
