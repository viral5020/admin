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
import FilterBtn from '../filters/FilterBtn';
// import { apiData } from './FilterWatchlistAPIresponse';
import AutoCompleteFilter from './AutoCompleteFilter';
import { addMarketScriptAPI, fetchStrikeDataAPI, getMarketWatchFilterAPI, getMarketWiseScriptForexAPI, getScriptWiseExpiryForexAPI } from '../API/API';
import { constant, forex_market_type_id } from './constant';
import { Toaster, toast } from 'react-hot-toast';
import { functionsIn } from 'lodash';
import { forex_comex_market } from '../helpers/utilFunc';

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


const FilterComponent = ({ searchText, setSearchText, isMobile, isDarkMode, isForex, setDummyData, socket, getScriptKey, marketNames, setMarketNames, setKeysOfScriptData }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [dataObj, setDataObj] = useState(false);

    // my below code works exactly, don't change its logic
    const [segment, setSegment] = useState('');
    const [script, setScript] = useState([]);
    const [expiry, setExpiry] = useState('');
    const [type, setType] = useState('');
    const [strike, setStrike] = useState('');
    const [expiryTerm, setExpiryTerm] = useState('')

    const [segmentOptions, setSegmentOptions] = useState([]);
    const [scriptOptions, setScriptOptions] = useState([]);
    const [expiryOptions, setExpiryOptions] = useState([]);
    const [strikeOptions, setStrikeOptions] = useState([]);

    async function getFilterData() {
        try {
            const data = await getMarketWatchFilterAPI();
            setDataObj(data);
        } catch (error) {
            console.log('## getFilterData error', error);
        }
    }

    async function getMarketWiseScriptForex() {
        try {
            const data = await getMarketWiseScriptForexAPI(segment.market_type_id);
            return data?.data;
        } catch (error) {
            console.log('## getMarketWiseScriptForex error', error);
        }
    }

    async function getScriptWiseExpiryForex() {
        try {
            const data = await getScriptWiseExpiryForexAPI(segment.market_type_id, script.script_id);
            return data?.data;
        } catch (error) {
            console.log('## getMarketWiseScriptForex error', error);
        }
    }

    useEffect(() => {
        if (isForex !== undefined && isForex !== null) {
            // console.log('#filtercomp isForex', isForex);
            if (!isForex) {
                // console.log("if (!isForex) {");
                getFilterData();
            } else {
                // console.log("} else {");
                setSegment(forex_comex_market[0]);
            }
        }
    }, [isForex])


    useEffect(() => {
        if (dataObj) {
            const segments = dataObj?.market_type;
            const defaultSegment = segments?.length > 0 ? segments[0] : { market_type_name: '' };

            const marketTypeId = defaultSegment?.market_type_id;
            const scripts = marketTypeId && dataObj?.script_list?.[marketTypeId]
                ? dataObj.script_list[marketTypeId].map(s => s)
                : [];

            const defaultScript = scripts?.length > 0 ? scripts[0] : { script_name: '' };

            const scriptId = defaultScript?.script_id;
            const expiries = scriptId && dataObj?.script_expiry_list?.[scriptId]
                ? dataObj.script_expiry_list[scriptId].map(e => e)
                : [];

            const defaultExpiry = expiries?.length > 0 ? expiries[0] : { expiry_date: '' };

            setSegmentOptions(segments?.length > 0 ? segments : [{ market_type_name: 'Not Found' }]);
            setScriptOptions(scripts?.length > 0 ? scripts : [{ script_name: 'Not Found' }]);
            setExpiryOptions(expiries?.length > 0 ? expiries : [{ expiry_date: 'Not Found' }]);

            setSegment(defaultSegment);
            setScript(defaultScript);
            setExpiry(defaultExpiry);
        }
    }, [dataObj]);

    useEffect(() => {
        (async function () {
            if (segment && segment.market_type_name !== 'Not Found') {
                let scripts;
                if (segment.market_type_id == 6 || segment.market_type_id == 7) {
                    scripts = await getMarketWiseScriptForex();
                } else {
                    const marketTypeId = segment?.market_type_id;
                    scripts = marketTypeId && dataObj?.script_list?.[marketTypeId]
                        ? dataObj.script_list[marketTypeId].map(s => s)
                        : [];
                }
                // console.log('scripts', scripts);
                setScriptOptions(scripts.length > 0 ? scripts : [{ script_name: 'Not Found' }]);
                setScript(scripts.length > 0 ? scripts[0] : { script_name: '' });
            }
        })();
    }, [segment]);

    useEffect(() => {
        (async function () {
            if (script && script.script_name !== 'Not Found' && segment.market_type_id != 6) {
                let expiries;
                if (segment.market_type_id == 7) {
                    expiries = await getScriptWiseExpiryForex();
                } else {
                    const scriptId = script.script_id;
                    expiries = scriptId && dataObj?.script_expiry_list?.[scriptId]
                        ? dataObj.script_expiry_list[scriptId].map(e => e)
                        : [];
                }

                setExpiryOptions(expiries.length > 0 ? expiries : [{ expiry_date: 'Not Found' }]);
                setExpiry(expiries.length > 0 ? expiries[0] : { expiry_date: '' });
            }
        })();
    }, [script]);

    useEffect(() => {
        setType('');
    }, [expiry, script])

    useEffect(() => {
        setStrike('');
    }, [type])

    useEffect(() => {
        const index = expiryOptions.findIndex((opt) => opt?.script_expiry_id === expiry?.script_expiry_id);
        setExpiryTerm(index);
        // if (segment.market_type_id == constant) {
        // setType('');
        // setStrike('');
        // setExpiryTerm('');
        // }

        if (!type || !expiry?.expiry_date || !script?.script_id) return;

        const fetchStrikeData = async () => {
            try {
                const data = await fetchStrikeDataAPI({ expiry, script, index, term: type });
                setStrikeOptions(data);
            } catch (err) {
                console.error('Error fetching strike data:', err);
                setStrikeOptions([]);
            }
        };

        fetchStrikeData();
    }, [type, expiry, script]);

    const renderFilterFields = () => {
        const baseFields = [
            {
                label: 'Segment',
                value: segment,
                onChange: setSegment,
                options: isForex ? forex_comex_market : segmentOptions,  // FOREX 2 OPTIONS : ID 6 FOREX 2 PARAMETER, ID 7 COMEX SHOW EXPIRY 4 PARAMETER
                getOptionLabel: (opt) => opt?.market_type_name || '',
                isOptionEqualToValue: (opt, val) => opt?.market_type_id === val?.market_type_id
            },
            {
                label: 'Script',
                value: script,
                onChange: setScript,
                options: scriptOptions,
                getOptionLabel: (opt) => opt?.script_name || '',
                isOptionEqualToValue: (opt, val) => opt?.script_id === val?.script_id
            },
            {
                label: 'Expiry',
                value: expiry,
                onChange: setExpiry,
                options: expiryOptions,
                getOptionLabel: (opt) => opt?.expiry_date || '',
                isOptionEqualToValue: (opt, val) => opt?.script_expiry_id === val?.script_expiry_id,
                hidden: isForex && segment?.market_type_id == 6,
            }
        ];

        const additionalFields = [
            {
                label: 'Type',
                value: type,
                onChange: setType,
                options: ['CE', 'PE'],
                getOptionLabel: (opt) => opt,
                disabled: segment?.market_type_id != constant || !expiry,
                hidden: segment?.market_type_id != constant || isForex,
            },
            {
                label: 'Strike',
                value: strike,
                onChange: setStrike,
                options: strikeOptions,
                getOptionLabel: (opt) => opt?.rate || '',
                isOptionEqualToValue: (opt, val) => opt?.rate_id === val?.rate_id,
                disabled: segment?.market_type_id != constant || !type,
                hidden: segment?.market_type_id != constant || isForex,
            },
        ];

        return (
            <AutoCompleteFilter
                isDarkMode={false}
                configs={[...baseFields, ...additionalFields]}
            />
        );
    };

    const handleReset = () => {
        //     setSegment('');
        //     setScript('');
        //     setExpiry('');
        //     setType('');
        //     setStrike('');
        //     setSearchText('');
        //     onFilterChange?.({});
    };

    const showToast = (message) => {
        if (message.includes('Market Added')) {
            toast.success(message);
        } else if (message.includes('Market Already Added')) {
            toast(message, { icon: '⚠️' });
        } else {
            toast.error(message);
        }
    };

    async function handleAdd() {
        if (!expiry.script_expiry_id && segment.market_type_id != forex_market_type_id) {
            toast(() => <span>⚠️ Please select <b>Expiry</b> first</span>)
            return;
        } else if (segment.market_type_id == constant) {
            if (!type) {
                toast(() => <span>⚠️ Please select <b>Type</b> first</span>)
                return;
            } else if (!strike) {
                toast(() => <span>⚠️ Please select <b>Strike</b> first</span>)
                return;
            }
        }

        try {
            const response = await addMarketScriptAPI({
                market_type_id: segment.market_type_id,
                script_id: script.script_id,
                // script_id: script.length > 0 ? JSON.stringify(script?.map(val => Number(val.id))) : '',
                script_expiry_id: expiry.script_expiry_id,
                expiryTerm: expiryTerm,
                type: segment.market_type_id == constant ? type : null,
                strickObj: segment.market_type_id == constant ? strike : null,
                // isForex,
            })
            console.log('Added scripts:', response);
            if (response.status == "ok") {
                // response.scripts[0].market_type_name,included in marketNames?
                const market_name = response.scripts[0].market_type_name;
                const isMarketInWatchList = marketNames.includes(market_name)
                if (!isMarketInWatchList) {
                    setMarketNames(p => [...p, market_name])
                }
                const newStock = response.scripts[0];
                const setKeys = setKeysOfScriptData(newStock);
                setDummyData(prevData => [...prevData, setKeys]);
                setFilterOpen(false);

                if (socket) {
                    socket.emit("addMarketWatch", {
                        product: getScriptKey(setKeys),
                    });
                }
            }
            showToast(response.message);
        } catch (err) {
            showToast(err.message);
            console.error('Add Market Failed:', err.message);
        }
    }

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

                        {isMobile && <FilterBtn setFilterOpen={setFilterOpen} icon='add' />}
                        {/* {isMobile && <FilterBtn />} */}

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
                <DialogTitle sx={{ mb: 1, pt: 2, pb: 1 }}>Add Market</DialogTitle>

                <DialogContent dividers>
                    {renderFilterFields()}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            // your apply logic
                            // setFilterOpen(false);
                            handleAdd()
                        }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>

    );
};

export default FilterComponent;
