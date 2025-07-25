import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Grid, Autocomplete, TextField, Button, InputAdornment, IconButton,
    DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, useMediaQuery } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { position } from 'stylis';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import axios from 'dan-vendor/axios';

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

function changeFormat(arr) {
    const result = {};

    arr.forEach(script => {
        const { market_type_name, script_name, script_expiry_orginal_format } = script;

        if (!result[market_type_name]) {
            result[market_type_name] = {};
        }

        if (!result[market_type_name][script_name]) {
            result[market_type_name][script_name] = { expiry: [] };
        }

        result[market_type_name][script_name].expiry.push(script_expiry_orginal_format);
    });
    console.log('result', result);
    return result;
}


const FilterComponent = ({ searchText, setSearchText, isMobile, isDarkMode }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [dataObj, setDataObj] = useState({});
    const [script, setScript] = useState('');
    const [expiry, setExpiry] = useState('');
    const [type, setType] = useState('');
    const [strike, setStrike] = useState('');
    const [segment, setSegment] = useState(Object.keys(dataObj)?.[0] || '');

    async function getFilterData() {
        const userData = JSON.parse(sessionStorage.getItem('data'));
        try {
            const response = await axios.post("http://128.199.126.171/~goldorg/ajaxfiles/market_watch_list1", {
                is_app: 1,
                login_user_id: userData.user_id,
                auth_key: userData.auth_key,
            })
            console.log(response.data.scripts);
            const data = changeFormat(response.data.scripts);
            setDataObj(data);
        } catch (error) {
            console.log('## getFilterData error', error);
        }
    }

    useEffect(() => {
        setSegment(Object.keys(dataObj)?.[0] || '');
    }, [dataObj])

    useEffect(() => {
        getFilterData();
    }, [])


    const segmentOptions = Object.keys(dataObj);

    const scriptOptions = useMemo(() => {
        if (segment) {
            const firstScriptName = Object.keys(dataObj[segment])?.[0];
            setScript(firstScriptName || '');
            setExpiry(dataObj[segment][firstScriptName]?.expiry?.[0] || '');
        }
        return segment ? Object.keys(dataObj[segment]) : []
    }, [segment]);

    const expiryOptions = useMemo(() => {
        setExpiry(segment && script ? dataObj[segment][script]?.expiry?.[0] || '' : '');
        return segment && script ? dataObj[segment][script]?.expiry || [] : []
    }, [segment, script]);
    // const typeOptions = useMemo(() => segment && script ? dataObj[segment][script]?.types || [] : [], [segment, script]);
    // const strikeOptions = useMemo(() => segment && script ? dataObj[segment][script]?.strikes || [] : [], [segment, script]);


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

    function formatExpiryDate(dateStr) {
        return dateStr.replace(/(\d{2})([A-Z]{3})(\d{4})/, '$1 $2 $3');
    }

    const renderFilterFields = () => (
        <Grid container spacing={2}>
            {[{
                label: 'Segment', value: segment, onChange: setSegment, options: segmentOptions
            }, {
                label: 'Script', value: script, onChange: setScript, options: scriptOptions
            }, {
                label: 'Expiry', value: expiry, onChange: setExpiry, options: expiryOptions
            }, {
                label: 'CE/PE', value: type, onChange: setType, options: ['Demo Option 1', 'Demo Option 2']
            }, {
                label: 'Strike', value: strike, onChange: setStrike, options: ['Demo Option 1', 'Demo Option 2']
            }].map(({ label, value, onChange, options }) => (
                <Grid item xs={12} sm={6} md={2.4} key={label}>
                    <Autocomplete
                        value={value}
                        onChange={(_, newValue) => onChange(newValue)}
                        options={options}
                        getOptionLabel={(opt) => String(opt)}
                        isOptionEqualToValue={(option, val) => option.value === val.value}
                        inputValue={value}
                        onInputChange={(_, newInputValue) => onChange(newInputValue)}
                        renderOption={(props, option) => {
                            const isMatch = String(option)?.toLowerCase() === value?.toLowerCase();

                            return (
                                <li {...props}
                                    style={{
                                        backgroundColor: isMatch ? isDarkMode ? '#2e4354' : '#c7eaf9' : 'inherit',
                                        fontWeight: isMatch ? 600 : 400
                                    }}
                                >
                                    {label === 'Expiry' ? formatExpiryDate(option) : option}
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label={label} size="small" />
                        )}
                        fullWidth
                        slotProps={{
                            paper: {
                                sx: {
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1e1e1e' : '#e0f7fa',
                                    '& .MuiAutocomplete-option': {
                                        backgroundColor: 'transparent',
                                        '&[aria-selected="true"]': {
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#333' : '#e0f7fa',
                                        },
                                        '&:hover': {
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#2c2c2c' : '#e3f2fd',
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Box sx={{ p: 1.5, py: !isMobile ? 2 : null, pb: isMobile ? 2 : null }}>
            {!isMobile && renderFilterFields()}

            <Grid container alignItems="center" sx={{ mt: isMobile ? 0 : 1.4, flexWrap: 'wrap', gap: { xs: 2, sm: 0 } }}>
                {!isMobile && (
                    <Grid item xs={12} sm={6} md={8} lg={9} sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={handleAdd} size="small">Add</Button>
                            <Button variant="outlined" onClick={handleReset} size="small">Reset</Button>
                        </Box>
                    </Grid>
                )}

                <Grid item xs={12} sm={6} md={isMobile ? 12 : 4} lg={isMobile ? 12 : 3}>
                    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'space-between' : 'flex-end', gap: 1 }}>
                        {isMobile && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FilterListIcon sx={{ position: 'relative', left: '4px' }} />}
                                onClick={() => setFilterOpen(true)}
                                sx={{
                                    backgroundColor: isDarkMode ? '#263238' : '#fff',
                                    borderColor: isDarkMode ? '#90a4ae' : '#607d8b',
                                    color: isDarkMode ? '#cfd8dc' : '#607d8b',
                                    borderRadius: '9px',
                                    px: 0,
                                    py: 0,
                                    minHeight: '10px',
                                    minWidth: '45px',
                                    '& .MuiButton-startIcon': {
                                        marginRight: '6px', // Adjust icon spacing if needed
                                    },
                                    '&:hover': {
                                        borderColor: isDarkMode ? '#b0bec5' : '#546e7a',
                                        backgroundColor: isDarkMode ? '#37474f' : '#f0f4f7',
                                        color: isDarkMode ? '#eceff1' : '#546e7a',
                                    },
                                }}
                            />
                        )}

                        <TextField
                            label="Search"
                            size="small"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            sx={{
                                flexGrow: 1,
                                // maxWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '9px', // Fully rounded
                                    paddingLeft: 2,
                                    paddingRight: 1,
                                    backgroundColor: isDarkMode ? '#37474f' : '#fff',
                                    color: isDarkMode ? '#eceff1' : '#263238',
                                    '& fieldset': {
                                        borderColor: isDarkMode ? '#607d8b' : '#b0bec5',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: isDarkMode ? '#90a4ae' : '#78909c',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: isDarkMode ? '#b0bec5' : '#455a64',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: isDarkMode ? '#cfd8dc' : '#546e7a',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <SearchIcon sx={{ color: isDarkMode ? '#cfd8dc' : '#455a64' }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>


            {/* Filter dialog for mobile */}
            <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} fullWidth>
                <DialogTitle sx={{ mb: 1, pt: 2, pb: 1 }}>Filter</DialogTitle>

                <DialogContent dividers>
                    {renderFilterFields()}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            // your apply logic
                            setFilterOpen(false);
                        }}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>

    );
};

export default FilterComponent;
