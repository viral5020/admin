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

const NseoptManageFilter = ({
    isDarkMode,
    setRemoveTrade,
    script,
    expiry,
    type,
    strike,
    setScript,
    setExpiry,
    setType,
    setStrike,
    scriptOptions, setScriptOptions,
    expiryOptions, setExpiryOptions,
    strikeOptions, setStrikeOptions,
    strikeLoading, setStrikeLoading,
    expiryLoading, setExpiryLoading,
    scriptLoading, setScriptLoading,
    handleAction
}) => {
    // const [isAddMarketLoading, setIsAddMarketLoading] = useState(false);
    // const [isBlockLoading, setIsBlockLoading] = useState(false);

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
                    disabled: false,
                    loading: scriptLoading,
                },
                {
                    label: 'Expiry',
                    value: Array.isArray(expiryOptions) ? expiryOptions.find(e => e.expiry_id === expiry?.expiry_id) || null : null,
                    onChange: setExpiry,
                    options: expiryOptions || [],
                    getOptionLabel: o => o?.expiry_date || '',
                    isOptionEqualToValue: (o, v) => o?.expiry_id === v?.expiry_id,
                    disabled: expiryLoading || !(expiryOptions?.length),
                    loading: expiryLoading,
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
                    disabled: false,
                    loading: strikeLoading,
                }
            ]}
        />
    );

    return (
        <Box sx={{ pb: 2 }}>
            <Grid
                container
                spacing={2}
                alignItems="center"        // vertical centering
                justifyContent="center"    // horizontal centering
            >
                {renderFilterFields()}

                <Grid item xs={12} sm={6} md={2.4} key={'action'}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                if (!expiry?.script_expiry_id || !strike?.rate_id) {
                                    toast.error('Please select Expiry and Strike to block');
                                    return;
                                }

                                handleAction(strike.rate_id, 'block')
                            }}
                            // disabled={isBlockLoading}
                            sx={{ borderRadius: 1 }}
                        >
                            {/* {isBlockLoading ? <CircularProgress size={18} /> : 'ADD'} */}
                            ADD
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                if (!expiry?.script_expiry_id || !strike?.rate_id) {
                                    toast.error('Please select Expiry and Strike to block');
                                    return;
                                }
                                // setRemoveTrade(strike)
                                handleAction(strike.rate_id, 'remove')
                            }}
                            // disabled={isAddMarketLoading}
                            sx={{ borderRadius: 1 }}
                        >
                            {/* {isAddMarketLoading ? <CircularProgress size={18} /> : 'REMOVE'} */}
                            REMOVE
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NseoptManageFilter;
