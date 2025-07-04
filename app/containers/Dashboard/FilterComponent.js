import React, { useState, useMemo } from 'react';
import {
    Box, Grid, Autocomplete, TextField, Button, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

const dummyOptions = {
    Equity: {
        RELIANCE: {
            expiries: ['2025-07-05', '2025-07-12', '2025-07-19'],
            types: ['CE', 'PE'],
            strikes: [2500, 2550, 2600, 2650]
        },
        TCS: {
            expiries: ['2025-07-10', '2025-07-17'],
            types: ['CE', 'PE'],
            strikes: [3600, 3700, 3800]
        },
        INFY: {
            expiries: ['2025-07-01', '2025-07-08', '2025-07-15'],
            types: ['CE', 'PE'],
            strikes: [1400, 1450, 1500]
        },
        HDFCBANK: {
            expiries: ['2025-07-03', '2025-07-13'],
            types: ['CE'],
            strikes: [1550, 1600]
        }
    },
    Commodity: {
        GOLD: {
            expiries: ['2025-07-01', '2025-07-11'],
            types: ['PE'],
            strikes: [60000, 60500, 61000]
        },
        SILVER: {
            expiries: ['2025-07-02', '2025-07-09'],
            types: ['CE', 'PE'],
            strikes: [72000, 73000, 74000]
        },
        CRUDEOIL: {
            expiries: ['2025-07-04', '2025-07-18'],
            types: ['PE'],
            strikes: [6800, 6900, 7000]
        }
    },
    Currency: {
        USDINR: {
            expiries: ['2025-07-05', '2025-07-15'],
            types: ['CE', 'PE'],
            strikes: [83.5, 84.0, 84.5]
        },
        EURINR: {
            expiries: ['2025-07-07'],
            types: ['PE'],
            strikes: [91.0, 92.0]
        },
        GBPINR: {
            expiries: ['2025-07-06'],
            types: ['CE'],
            strikes: [106.0, 107.0]
        }
    },
    Index: {
        NIFTY: {
            expiries: ['2025-07-04', '2025-07-11', '2025-07-18'],
            types: ['CE', 'PE'],
            strikes: [23500, 23600, 23700]
        },
        BANKNIFTY: {
            expiries: ['2025-07-08', '2025-07-15'],
            types: ['PE'],
            strikes: [52000, 52500]
        },
        FINNIFTY: {
            expiries: ['2025-07-09'],
            types: ['CE'],
            strikes: [22000, 22100]
        }
    }
};


const FilterComponent = ({ searchText, setSearchText }) => {
    const theme = useTheme();
    const [segment, setSegment] = useState('');
    const [script, setScript] = useState('');
    const [expiry, setExpiry] = useState('');
    const [type, setType] = useState('');
    const [strike, setStrike] = useState('');

    const segmentOptions = Object.keys(dummyOptions);

    const scriptOptions = useMemo(() => segment ? Object.keys(dummyOptions[segment]) : [], [segment]);
    const expiryOptions = useMemo(() => segment && script ? dummyOptions[segment][script]?.expiries || [] : [], [segment, script]);
    const typeOptions = useMemo(() => segment && script ? dummyOptions[segment][script]?.types || [] : [], [segment, script]);
    const strikeOptions = useMemo(() => segment && script ? dummyOptions[segment][script]?.strikes || [] : [], [segment, script]);

    const handleReset = () => {
        setSegment('');
        setScript('');
        setExpiry('');
        setType('');
        setStrike('');
        setSearchText('');
        onFilterChange?.({});
    };

    const handleAdd = () => {
        onFilterChange?.({
            segment, script, expiry, type, strike, searchText
        });
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* First row: 5 dropdowns */}
            <Grid container spacing={2}>
                {[{
                    label: 'Segment', value: segment, onChange: setSegment, options: segmentOptions
                }, {
                    label: 'Script', value: script, onChange: setScript, options: scriptOptions
                }, {
                    label: 'Expiry', value: expiry, onChange: setExpiry, options: expiryOptions
                }, {
                    label: 'CE/PE', value: type, onChange: setType, options: typeOptions
                }, {
                    label: 'Strike', value: strike, onChange: setStrike, options: strikeOptions
                }].map(({ label, value, onChange, options }) => (
                    <Grid item xs={12} sm={6} md={2.4} key={label}>
                        <Autocomplete
                            value={value} // initialValues are ''
                            onChange={(_, newValue) => onChange(newValue)}
                            options={options}
                            getOptionLabel={(opt) => String(opt)}
                            isOptionEqualToValue={(option, val) => option.value === val.value}
                            renderInput={(params) => <TextField {...params} label={label} size="small" />}
                            fullWidth
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Second row: buttons and search field */}
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2, flexWrap: 'wrap' }}>
                {/* Left side: Add + Reset */}
                <Grid item xs={12} sm={6} md={8} lg={9} sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                    <Button variant="contained" onClick={handleAdd} size="small">Add</Button>
                    <Button variant="outlined" onClick={handleReset} size="small">Reset</Button>
                </Grid>

                {/* Right side: Search bar */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" justifyContent="flex-end">
                        <TextField
                            label="Search"
                            size="small"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            sx={{ width: '100%', maxWidth: 300 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>

        </Box>
    );
};

export default FilterComponent;
