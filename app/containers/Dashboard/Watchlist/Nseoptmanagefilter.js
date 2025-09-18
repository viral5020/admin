import React, { useState, useEffect } from 'react';
import {
    Box, Grid, TextField, Button, InputAdornment, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoCompleteFilter from '../Watchlist/AutoCompleteFilter';
import { toast } from 'react-toastify';
import axios from 'dan-vendor/axios';
import { setBlockOptionExpiryAPI } from '../API/API';

const forexMarketType = { market_type_id: 5, market_type_name: 'Forex' };

const NseoptManageFilter = ({
    searchText,
    setSearchText,
    isMobile,
    isDarkMode,
    setDummyData,
    socket,
    getScriptKey,
    marketNames,
    setMarketNames,
    setKeysOfScriptData
}) => {
    const [filterOpen, setFilterOpen] = useState(false);

    const [script, setScript] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [type, setType] = useState('CE');
    const [strike, setStrike] = useState(null);

    const [scriptOptions, setScriptOptions] = useState([]);
    const [expiryOptions, setExpiryOptions] = useState([]);
    const [strikeOptions, setStrikeOptions] = useState([]);
    const [strikeLoading, setStrikeLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAddMarketLoading, setIsAddMarketLoading] = useState(false);
    const [isBlockLoading, setIsBlockLoading] = useState(false);

    const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};
    const defaultPayload = {
        is_app: 1,
        login_user_id: dataStored.user_id ?? '',
        auth_key: dataStored.auth_key ?? ''
    };

    // Fetch Scripts on mount
    useEffect(() => {
        const fetchScripts = async () => {
            try {
                setLoading(true);
                const res = await axios.post(
                    'http://128.199.126.171/~goldorg/ajaxfiles/get_market_wise_script_forex',
                    { ...defaultPayload, market_type_id: forexMarketType.market_type_id }
                );
                const scripts = res.data?.data || [];
                setScriptOptions(scripts);
                if (scripts.length > 0) setScript(scripts[0]);
            } catch (err) {
                console.error('Error fetching scripts:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchScripts();
    }, []);

    // Fetch Expiry whenever Script changes
    useEffect(() => {
        const fetchExpiries = async () => {
            if (!script?.script_id) {
                setExpiryOptions([]);
                setExpiry(null);
                return;
            }
            try {
                setLoading(true);
                const res = await axios.post(
                    'http://128.199.126.171/~goldorg/ajaxfiles/get_script_wise_expiry_forex',
                    { ...defaultPayload, script_id: script.script_id }
                );
                const expiries = res.data?.data || [];
                setExpiryOptions(expiries);
                setExpiry(expiries.length > 0 ? expiries[0] : null);
            } catch (err) {
                console.error('Error fetching expiries:', err);
                setExpiryOptions([]);
                setExpiry(null);
            } finally {
                setLoading(false);
            }
        };
        fetchExpiries();
    }, [script]);

    // Fetch Strike whenever Expiry or Type changes
    useEffect(() => {
        const fetchStrikes = async () => {
            if (!expiry?.script_expiry_id || !type) {
                setStrikeOptions([]);
                setStrike(null);
                return;
            }
            try {
                setStrikeLoading(true);
                const res = await axios.post(
                    'http://128.199.126.171/~goldorg/ajaxfiles/get_option_strike_price',
                    {
                        ...defaultPayload,
                        expiry_id: expiry.script_expiry_id,
                        term: type
                    }
                );
                const strikes = res.data?.data || [];
                setStrikeOptions(strikes);
                setStrike(strikes.length > 0 ? strikes[0] : null);
            } catch (err) {
                console.error('Error fetching strikes:', err);
                setStrikeOptions([]);
                setStrike(null);
            } finally {
                setStrikeLoading(false);
            }
        };
        fetchStrikes();
    }, [expiry, type]);

    // Block Option
    const handleBlock = async () => {
        if (!expiry?.script_expiry_id || !strike?.rate_id) {
            toast.error('Please select Expiry and Strike to block');
            return;
        }

        setIsBlockLoading(true);
        try {
            const response = await setBlockOptionExpiryAPI({ script_expiry_option_id: strike.rate_id, is_block: 1 });

            if (response?.status === 'ok') {
                toast.success(response.message || 'Option blocked successfully');
            } else {
                toast.error(response?.message || 'Failed to block option');
            }
        } catch (err) {
            toast.error(err.message || 'Error blocking option');
        } finally {
            setIsBlockLoading(false);
        }
    };

    // Remove Option
    const handleRemove = async () => {
        if (!expiry?.script_expiry_id || !strike?.rate_id) {
            toast.error('Please select Expiry and Strike to remove');
            return;
        }

        setIsAddMarketLoading(true);
        try {
            const response = await setBlockOptionExpiryAPI({ script_expiry_option_id: strike.rate_id, is_block: 0 });

            if (response?.status === 'ok') {
                toast.success(response.message || 'Option removed successfully');
            } else {
                toast.error(response?.message || 'Failed to remove option');
            }
        } catch (err) {
            toast.error(err.message || 'Error removing option');
        } finally {
            setIsAddMarketLoading(false);
        }
    };
    const renderFilterFields = () => (
        <AutoCompleteFilter
            isDarkMode={isDarkMode}
            configs={[
                {
                    label: 'Script',
                    value: Array.isArray(scriptOptions) ? scriptOptions.find(s => s.script_id === script?.script_id) || null : null,
                    onChange: setScript,
                    options: scriptOptions || [],
                    getOptionLabel: o => o?.script_name || '',
                    isOptionEqualToValue: (o, v) => o?.script_id === v?.script_id,
                    disabled: false
                },
                {
                    label: 'Expiry',
                    value: Array.isArray(expiryOptions) ? expiryOptions.find(e => e.expiry_id === expiry?.expiry_id) || null : null,
                    onChange: setExpiry,
                    options: expiryOptions || [],
                    getOptionLabel: o => o?.expiry_date || '',
                    isOptionEqualToValue: (o, v) => o?.expiry_id === v?.expiry_id,
                    disabled: loading || !(expiryOptions?.length)
                },
                {
                    label: 'Type',
                    value: type,
                    onChange: (newType) => setType(newType),
                    options: ['CE', 'PE'],
                    getOptionLabel: o => o
                },
                {
                    label: 'Strike',
                    value: Array.isArray(strikeOptions) ? strikeOptions.find(s => s.rate_id === strike?.rate_id) || null : null,
                    onChange: setStrike,
                    options: strikeOptions || [],
                    getOptionLabel: o => o?.rate || '',
                    isOptionEqualToValue: (o, v) => o?.rate_id === v?.rate_id,
                    disabled: false
                }
            ]}
        />
    );

    return (
        <Box sx={{ p: 2 }}>
            {!isMobile && renderFilterFields()}

            <Grid container spacing={1} alignItems="center">
                {!isMobile && (
                    <>
                        <Grid item>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleBlock}
                                    disabled={isBlockLoading}
                                    sx={{ borderRadius: 1 }}
                                >
                                    {isBlockLoading ? <CircularProgress size={18} /> : 'ADD'}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleRemove}
                                    disabled={isAddMarketLoading}
                                    sx={{ borderRadius: 1 }}
                                >
                                    {isAddMarketLoading ? <CircularProgress size={18} /> : 'REMOVE'}
                                </Button>
                            </Box>
                        </Grid>


                    </>
                )}

            </Grid>
        </Box>
    );
};

export default NseoptManageFilter;
