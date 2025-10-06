import React, { useEffect, useState } from 'react';
import { Grid, Autocomplete, TextField, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { forex_comex_market } from '../helpers/utilFunc';
import { fetchOptionsAPI, fetchOptionsAPIManualScript, fetchOptionsPriceOptionAPI } from '../API/API';

const Manualscriptfilter = ({
    market,
    setMarket,
    script,
    setScript,
    isScriptMultiSelect = false,
    isForex,
    showMarket = true,
    showScript = true,
    onLotQtyChange,
    lot,
    setLot,
    quantity,
    setQuantity,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    const [marketOptions, setMarketOptions] = useState(isForex ? forex_comex_market : []);
    const [scriptOptions, setScriptOptions] = useState([]);
    const [optionScripts, setOptionScripts] = useState([]);
    const [isScriptNameDisable, setIsScriptNameDisable] = useState(true);

    const [baseLotQty, setBaseLotQty] = useState(0);

    const [showOptionType, setShowOptionType] = useState(false);
    const [optionType, setOptionType] = useState(null);

    const inputBoxStyle = {
        backgroundColor: isDarkMode ? '#263238' : '#fff',
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
            height: 40,
            '& fieldset': { borderColor: '#c4c4c4' },
            '&:hover fieldset': { borderColor: '#000' },
            '&.Mui-focused fieldset': { borderColor: '#000' },
        },
    };

    // Enable/disable script input & show Option Type for NSEOPT
    useEffect(() => {
        setIsScriptNameDisable(!market);
        setShowOptionType(market?.text === 'NSEOPT');
        if (market?.text !== 'NSEOPT') {
            setOptionType(null);
            setOptionScripts([]);
        }
    }, [market]);

    // Fetch markets on mount if not Forex
    useEffect(() => {
        if (!isForex) handleFetch('', 'market');
    }, []);

    // Fetch scripts for NSEOPT options
    useEffect(() => {
        if (market?.text === 'NSEOPT' && script?.script_expiry_id) {
            handleFetch('', 'optionScript', market, script, setOptionScripts);
        }
    }, [script]);

    async function fetchOptions(url, params, setter) {
        try {
            const data = await fetchOptionsAPI(url, params);
            setter(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    }
    async function fetchscriptPriceOptions(url, params, setter) {
        try {
            const data = await fetchOptionsPriceOptionAPI(url, params);
            setter(data);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    }
    async function fetchOptionsManual(url, params, setter) {
        try {
            const data = await fetchOptionsAPIManualScript(url, params);
            setter(data ? data : []);
        } catch (err) {
            console.error(`Error fetching from ${url}`, err);
            setter([]);
        }
    }

    function handleFetch(term, type, selectedMarket, scrtiptPass, setter = setScriptOptions) {
        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};
        const params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
            term,
        };
        const url = 'http://128.199.126.171/~goldorg/ajaxfiles';

        switch (type) {
            case 'market':
                if (!isForex) fetchOptions(`${url}/get_market_name_search`, params, setMarketOptions);
                break;
            case 'script': {
                const marketToUse = selectedMarket || market;
                if (marketToUse?.id) {
                    fetchOptionsManual(
                        `${url}/get_market_script_list_for_place_manual`,
                        { ...params, market: marketToUse.id },
                        (data) => {
                            if (data.status === 'ok' && data.script_expiry_list) {
                                const scripts = Object.values(data.script_expiry_list[marketToUse?.id])
                                    .flat()
                                    .map((item) => ({
                                        value: item.script_id,
                                        text: item.script_full_name,
                                        lot_qty: item.script_lot_qty,
                                        script_expiry_id: item.script_expiry_id,
                                        script_name: item.script_name,
                                    }));
                                setter(scripts);
                            } else setter([]);
                        }
                    );
                } else setter([]);
                break;
            }
            case 'optionScript': {
                const marketToUse = selectedMarket || market;
                if (marketToUse?.id && scrtiptPass?.text) {
                    fetchscriptPriceOptions(
                        `${url}/get_options_list`,
                        {
                            ...params,
                            market: marketToUse.id,
                            script_expiry_id: scrtiptPass?.script_expiry_id || '',
                        },
                        (data) => {
                            if (data.status === 'ok' && data.data) {
                                const scriptsRate = Object.values(data.data)
                                    .flat()
                                    .map((item) => ({
                                        value: item.rate_id,
                                        text: item.rate,
                                        check_script_name: item.check_script_name,
                                    }));
                                setter(scriptsRate);
                            } else setter([]);
                        }
                    );
                } else setter([]);
                break;
            }
            default:
                break;
        }
    }

    return (
        <>
            {/* Market Dropdown */}
            {showMarket && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={marketOptions}
                        getOptionLabel={(option) => option?.text || ''}
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
                            setScript([]);
                            handleFetch('', 'script', val);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Start typing to search..." label="Market" size="small" sx={inputBoxStyle} />
                        )}
                        noOptionsText="No Market found"
                        fullWidth
                    />
                </Grid>
            )}

            {/* Script Dropdown */}
            {showScript && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        multiple={isScriptMultiSelect}
                        disableCloseOnSelect={isScriptMultiSelect}
                        options={scriptOptions}
                        getOptionLabel={(option) => option?.text || ''}
                        value={script}
                        filterSelectedOptions={isScriptMultiSelect}
                        disabled={isScriptNameDisable}
                        onChange={(e, val) => {
                            setScript(val);
                            if (!isScriptMultiSelect && val?.lot_qty != null) {
                                setLot(1);
                                setQuantity(val.lot_qty);
                                setBaseLotQty(val.lot_qty); // <-- set base for multiply
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="Select Script" label="Script" size="small" sx={inputBoxStyle} />
                        )}
                        noOptionsText="No Script found"
                        fullWidth
                    />
                </Grid>
            )}

            <Grid item xs={12} sm={6} md={3} lg={2.4}>
                {/* Lot & Quantity Inputs */}
                <Box sx={{ display: 'flex', gap: 1, position: 'relative', bottom: '3px' }}>
                    {market?.text?.toUpperCase() !== 'NSEEQT' && (
                        <TextField
                            fullWidth
                            type='number'
                            label="Lot"
                            size="small"
                            value={lot}
                            onChange={(e) => {
                                const rawVal = e.target.value;
                                const newLot = parseInt(rawVal, 10);
                                setLot(newLot);
                                if (!isNaN(newLot) && baseLotQty > 0) {
                                    setQuantity(newLot * baseLotQty);
                                }
                            }}
                        // sx={{ width: 100 }}
                        />
                    )}

                    <TextField
                        fullWidth
                        type='number'
                        label="Quantity"
                        size="small"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        // sx={{ width: 120 }}
                        disabled={
                            market?.id === 1 ||
                            ['MCXFUT', 'NSEOPT', 'NSECDS'].includes(market?.text?.toUpperCase())
                        }
                    />
                </Box>
            </Grid>
            {/* Option Type Dropdown */}
            {showOptionType && (
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Autocomplete
                        options={optionScripts}
                        getOptionLabel={(option) => option.text}
                        value={optionType}
                        onChange={(e, val) => setOptionType(val)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder="CE/PE" label="Option Type" size="small" sx={inputBoxStyle} />
                        )}
                    />
                </Grid>
            )}
        </>
    );
};

export default Manualscriptfilter;
