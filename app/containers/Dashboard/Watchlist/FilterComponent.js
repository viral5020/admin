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
import { apiData } from './FilterWatchlistAPIresponse';
import AutoCompleteFilter from './AutoCompleteFilter';
import { addMarketScriptAPI, fetchStrikeDataAPI, getMarketWatchFilterAPI, getMarketWiseScriptForexAPI, getScriptWiseExpiryForexAPI } from '../API/API';
import { constant } from './constant';
import { Toaster, toast } from 'react-hot-toast';
import { functionsIn } from 'lodash';

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

const forexSegmentOption = [
    { market_type_name: "FOREX", market_type_id: "6", selected: false },
    { market_type_name: "COMEX", market_type_id: "7", selected: false }
]


const FilterComponent = ({ searchText, setSearchText, isMobile, isDarkMode, isForex }) => {
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
                setSegment(forexSegmentOption[0]);
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
                options: isForex ? forexSegmentOption : segmentOptions,  // FOREX 2 OPTIONS : ID 6 FOREX 2 PARAMETER, ID 7 COMEX SHOW EXPIRY 4 PARAMETER
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
        if (!expiry.script_expiry_id) {
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
                // script_id: script.script_id,
                script_id: script.length > 0 ? JSON.stringify(script?.map(val => Number(val.id))) : '',
                script_expiry_id: expiry.script_expiry_id,
                expiryTerm: expiryTerm,
                type: segment.market_type_id == constant ? type : null,
                strickObj: segment.market_type_id == constant ? strike : null,
            })
            console.log('Added scripts:', response);
            showToast(response.message);
            // toast msg 
        } catch (err) {
            console.log('err.message', err.message);
            showToast(err.message);
            console.error('Add Market Failed:', err.message);
        }
    }

    return (
        <Box sx={{ p: 1.5, py: !isMobile ? 2 : null, pb: isMobile ? 2 : null }}>
            {!isMobile && <Toaster
                position={isMobile ? 'bottom-center' : 'top-right'}
                toastOptions={{
                    style: {
                        background: isDarkMode ? '#333' : '#fff',
                        color: isDarkMode ? '#fff' : '#333',
                        border: `1px solid ${isDarkMode ? '#444' : '#ddd'}`,
                    },
                    duration: 2000,
                }}
            />}

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
                        {isMobile && <FilterBtn />}

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

const data = [
    {
        "rate": "18750",
        "check_script_name": "NIFTY25073118750CE",
        "rate_id": "5943834"
    },
    {
        "rate": "18800",
        "check_script_name": "NIFTY25073118800CE",
        "rate_id": "5943838"
    },
    {
        "rate": "18850",
        "check_script_name": "NIFTY25073118850CE",
        "rate_id": "5943842"
    },
    {
        "rate": "18900",
        "check_script_name": "NIFTY25073118900CE",
        "rate_id": "5943846"
    },
    {
        "rate": "18950",
        "check_script_name": "NIFTY25073118950CE",
        "rate_id": "5943850"
    },
    {
        "rate": "19000",
        "check_script_name": "NIFTY25073119000CE",
        "rate_id": "5943854"
    },
    {
        "rate": "19050",
        "check_script_name": "NIFTY25073119050CE",
        "rate_id": "5943858"
    },
    {
        "rate": "19100",
        "check_script_name": "NIFTY25073119100CE",
        "rate_id": "5943862"
    },
    {
        "rate": "19150",
        "check_script_name": "NIFTY25073119150CE",
        "rate_id": "5943866"
    },
    {
        "rate": "19200",
        "check_script_name": "NIFTY25073119200CE",
        "rate_id": "5943871"
    },
    {
        "rate": "19250",
        "check_script_name": "NIFTY25073119250CE",
        "rate_id": "5943875"
    },
    {
        "rate": "19300",
        "check_script_name": "NIFTY25073119300CE",
        "rate_id": "5943879"
    },
    {
        "rate": "19350",
        "check_script_name": "NIFTY25073119350CE",
        "rate_id": "5943883"
    },
    {
        "rate": "19400",
        "check_script_name": "NIFTY25073119400CE",
        "rate_id": "5943887"
    },
    {
        "rate": "19450",
        "check_script_name": "NIFTY25073119450CE",
        "rate_id": "5943891"
    },
    {
        "rate": "19500",
        "check_script_name": "NIFTY25073119500CE",
        "rate_id": "5943895"
    },
    {
        "rate": "19550",
        "check_script_name": "NIFTY25073119550CE",
        "rate_id": "5943899"
    },
    {
        "rate": "19600",
        "check_script_name": "NIFTY25073119600CE",
        "rate_id": "5943903"
    },
    {
        "rate": "19650",
        "check_script_name": "NIFTY25073119650CE",
        "rate_id": "5943907"
    },
    {
        "rate": "19700",
        "check_script_name": "NIFTY25073119700CE",
        "rate_id": "5943911"
    },
    {
        "rate": "19750",
        "check_script_name": "NIFTY25073119750CE",
        "rate_id": "5943916"
    },
    {
        "rate": "19800",
        "check_script_name": "NIFTY25073119800CE",
        "rate_id": "5943920"
    },
    {
        "rate": "19850",
        "check_script_name": "NIFTY25073119850CE",
        "rate_id": "5943924"
    },
    {
        "rate": "19900",
        "check_script_name": "NIFTY25073119900CE",
        "rate_id": "5943928"
    },
    {
        "rate": "19950",
        "check_script_name": "NIFTY25073119950CE",
        "rate_id": "5943932"
    },
    {
        "rate": "20000",
        "check_script_name": "NIFTY25073120000CE",
        "rate_id": "5943936"
    },
    {
        "rate": "20050",
        "check_script_name": "NIFTY25073120050CE",
        "rate_id": "5943940"
    },
    {
        "rate": "20100",
        "check_script_name": "NIFTY25073120100CE",
        "rate_id": "5943944"
    },
    {
        "rate": "20150",
        "check_script_name": "NIFTY25073120150CE",
        "rate_id": "5943948"
    },
    {
        "rate": "20200",
        "check_script_name": "NIFTY25073120200CE",
        "rate_id": "5943953"
    },
    {
        "rate": "20250",
        "check_script_name": "NIFTY25073120250CE",
        "rate_id": "5943957"
    },
    {
        "rate": "20300",
        "check_script_name": "NIFTY25073120300CE",
        "rate_id": "5943963"
    },
    {
        "rate": "20350",
        "check_script_name": "NIFTY25073120350CE",
        "rate_id": "5943968"
    },
    {
        "rate": "20400",
        "check_script_name": "NIFTY25073120400CE",
        "rate_id": "5943972"
    },
    {
        "rate": "20450",
        "check_script_name": "NIFTY25073120450CE",
        "rate_id": "5943977"
    },
    {
        "rate": "20500",
        "check_script_name": "NIFTY25073120500CE",
        "rate_id": "5943981"
    },
    {
        "rate": "20550",
        "check_script_name": "NIFTY25073120550CE",
        "rate_id": "5943985"
    },
    {
        "rate": "20600",
        "check_script_name": "NIFTY25073120600CE",
        "rate_id": "5943989"
    },
    {
        "rate": "20650",
        "check_script_name": "NIFTY25073120650CE",
        "rate_id": "5943993"
    },
    {
        "rate": "20700",
        "check_script_name": "NIFTY25073120700CE",
        "rate_id": "5943997"
    },
    {
        "rate": "20750",
        "check_script_name": "NIFTY25073120750CE",
        "rate_id": "5944001"
    },
    {
        "rate": "20800",
        "check_script_name": "NIFTY25073120800CE",
        "rate_id": "5944006"
    },
    {
        "rate": "20850",
        "check_script_name": "NIFTY25073120850CE",
        "rate_id": "5944010"
    },
    {
        "rate": "20900",
        "check_script_name": "NIFTY25073120900CE",
        "rate_id": "5944014"
    },
    {
        "rate": "20950",
        "check_script_name": "NIFTY25073120950CE",
        "rate_id": "5944018"
    },
    {
        "rate": "21000",
        "check_script_name": "NIFTY25073121000CE",
        "rate_id": "5944022"
    },
    {
        "rate": "21050",
        "check_script_name": "NIFTY25073121050CE",
        "rate_id": "5944026"
    },
    {
        "rate": "21100",
        "check_script_name": "NIFTY25073121100CE",
        "rate_id": "5944030"
    },
    {
        "rate": "21150",
        "check_script_name": "NIFTY25073121150CE",
        "rate_id": "5944034"
    },
    {
        "rate": "21200",
        "check_script_name": "NIFTY25073121200CE",
        "rate_id": "5944038"
    },
    {
        "rate": "21250",
        "check_script_name": "NIFTY25073121250CE",
        "rate_id": "5944042"
    },
    {
        "rate": "21300",
        "check_script_name": "NIFTY25073121300CE",
        "rate_id": "5944046"
    },
    {
        "rate": "21350",
        "check_script_name": "NIFTY25073121350CE",
        "rate_id": "5944049"
    },
    {
        "rate": "21400",
        "check_script_name": "NIFTY25073121400CE",
        "rate_id": "5944053"
    },
    {
        "rate": "21450",
        "check_script_name": "NIFTY25073121450CE",
        "rate_id": "5944057"
    },
    {
        "rate": "21500",
        "check_script_name": "NIFTY25073121500CE",
        "rate_id": "5944061"
    },
    {
        "rate": "21550",
        "check_script_name": "NIFTY25073121550CE",
        "rate_id": "5944065"
    },
    {
        "rate": "21600",
        "check_script_name": "NIFTY25073121600CE",
        "rate_id": "5944069"
    },
    {
        "rate": "21650",
        "check_script_name": "NIFTY25073121650CE",
        "rate_id": "5944073"
    },
    {
        "rate": "21700",
        "check_script_name": "NIFTY25073121700CE",
        "rate_id": "5944078"
    },
    {
        "rate": "21750",
        "check_script_name": "NIFTY25073121750CE",
        "rate_id": "5944082"
    },
    {
        "rate": "21800",
        "check_script_name": "NIFTY25073121800CE",
        "rate_id": "5944086"
    },
    {
        "rate": "21850",
        "check_script_name": "NIFTY25073121850CE",
        "rate_id": "5944092"
    },
    {
        "rate": "21900",
        "check_script_name": "NIFTY25073121900CE",
        "rate_id": "5944098"
    },
    {
        "rate": "21950",
        "check_script_name": "NIFTY25073121950CE",
        "rate_id": "5944104"
    },
    {
        "rate": "22000",
        "check_script_name": "NIFTY25073122000CE",
        "rate_id": "5944110"
    },
    {
        "rate": "22050",
        "check_script_name": "NIFTY25073122050CE",
        "rate_id": "5944116"
    },
    {
        "rate": "22100",
        "check_script_name": "NIFTY25073122100CE",
        "rate_id": "5944122"
    },
    {
        "rate": "22150",
        "check_script_name": "NIFTY25073122150CE",
        "rate_id": "5944128"
    },
    {
        "rate": "22200",
        "check_script_name": "NIFTY25073122200CE",
        "rate_id": "5944134"
    },
    {
        "rate": "22250",
        "check_script_name": "NIFTY25073122250CE",
        "rate_id": "5944139"
    },
    {
        "rate": "22300",
        "check_script_name": "NIFTY25073122300CE",
        "rate_id": "5944146"
    },
    {
        "rate": "22350",
        "check_script_name": "NIFTY25073122350CE",
        "rate_id": "5944152"
    },
    {
        "rate": "22400",
        "check_script_name": "NIFTY25073122400CE",
        "rate_id": "5944158"
    },
    {
        "rate": "22450",
        "check_script_name": "NIFTY25073122450CE",
        "rate_id": "5944163"
    },
    {
        "rate": "22500",
        "check_script_name": "NIFTY25073122500CE",
        "rate_id": "5944168"
    },
    {
        "rate": "22550",
        "check_script_name": "NIFTY25073122550CE",
        "rate_id": "5944174"
    },
    {
        "rate": "22600",
        "check_script_name": "NIFTY25073122600CE",
        "rate_id": "5944178"
    },
    {
        "rate": "22650",
        "check_script_name": "NIFTY25073122650CE",
        "rate_id": "5944181"
    },
    {
        "rate": "22700",
        "check_script_name": "NIFTY25073122700CE",
        "rate_id": "5944187"
    },
    {
        "rate": "22750",
        "check_script_name": "NIFTY25073122750CE",
        "rate_id": "5944194"
    },
    {
        "rate": "22800",
        "check_script_name": "NIFTY25073122800CE",
        "rate_id": "5944200"
    },
    {
        "rate": "22850",
        "check_script_name": "NIFTY25073122850CE",
        "rate_id": "5944206"
    },
    {
        "rate": "22900",
        "check_script_name": "NIFTY25073122900CE",
        "rate_id": "5944212"
    },
    {
        "rate": "22950",
        "check_script_name": "NIFTY25073122950CE",
        "rate_id": "5944217"
    },
    {
        "rate": "23000",
        "check_script_name": "NIFTY25073123000CE",
        "rate_id": "5944223"
    },
    {
        "rate": "23050",
        "check_script_name": "NIFTY25073123050CE",
        "rate_id": "5944229"
    },
    {
        "rate": "23100",
        "check_script_name": "NIFTY25073123100CE",
        "rate_id": "5944235"
    },
    {
        "rate": "23150",
        "check_script_name": "NIFTY25073123150CE",
        "rate_id": "5944241"
    },
    {
        "rate": "23200",
        "check_script_name": "NIFTY25073123200CE",
        "rate_id": "5944247"
    },
    {
        "rate": "23250",
        "check_script_name": "NIFTY25073123250CE",
        "rate_id": "5944253"
    },
    {
        "rate": "23300",
        "check_script_name": "NIFTY25073123300CE",
        "rate_id": "5944259"
    },
    {
        "rate": "23350",
        "check_script_name": "NIFTY25073123350CE",
        "rate_id": "5944265"
    },
    {
        "rate": "23400",
        "check_script_name": "NIFTY25073123400CE",
        "rate_id": "5944271"
    },
    {
        "rate": "23450",
        "check_script_name": "NIFTY25073123450CE",
        "rate_id": "5944277"
    },
    {
        "rate": "23500",
        "check_script_name": "NIFTY25073123500CE",
        "rate_id": "5944283"
    },
    {
        "rate": "23550",
        "check_script_name": "NIFTY25073123550CE",
        "rate_id": "5944289"
    },
    {
        "rate": "23600",
        "check_script_name": "NIFTY25073123600CE",
        "rate_id": "5944295"
    },
    {
        "rate": "23650",
        "check_script_name": "NIFTY25073123650CE",
        "rate_id": "5944301"
    },
    {
        "rate": "23700",
        "check_script_name": "NIFTY25073123700CE",
        "rate_id": "5944307"
    },
    {
        "rate": "23750",
        "check_script_name": "NIFTY25073123750CE",
        "rate_id": "5944313"
    },
    {
        "rate": "23800",
        "check_script_name": "NIFTY25073123800CE",
        "rate_id": "5944320"
    },
    {
        "rate": "23850",
        "check_script_name": "NIFTY25073123850CE",
        "rate_id": "5944326"
    },
    {
        "rate": "23900",
        "check_script_name": "NIFTY25073123900CE",
        "rate_id": "5944332"
    },
    {
        "rate": "23950",
        "check_script_name": "NIFTY25073123950CE",
        "rate_id": "5944338"
    },
    {
        "rate": "24000",
        "check_script_name": "NIFTY25073124000CE",
        "rate_id": "5944344"
    },
    {
        "rate": "24050",
        "check_script_name": "NIFTY25073124050CE",
        "rate_id": "5944350"
    },
    {
        "rate": "24100",
        "check_script_name": "NIFTY25073124100CE",
        "rate_id": "5944356"
    },
    {
        "rate": "24150",
        "check_script_name": "NIFTY25073124150CE",
        "rate_id": "5944362"
    },
    {
        "rate": "24200",
        "check_script_name": "NIFTY25073124200CE",
        "rate_id": "5944368"
    },
    {
        "rate": "24250",
        "check_script_name": "NIFTY25073124250CE",
        "rate_id": "5944373"
    },
    {
        "rate": "24300",
        "check_script_name": "NIFTY25073124300CE",
        "rate_id": "5944379"
    },
    {
        "rate": "24350",
        "check_script_name": "NIFTY25073124350CE",
        "rate_id": "5944386"
    },
    {
        "rate": "24400",
        "check_script_name": "NIFTY25073124400CE",
        "rate_id": "5944392"
    },
    {
        "rate": "24450",
        "check_script_name": "NIFTY25073124450CE",
        "rate_id": "5944397"
    },
    {
        "rate": "24500",
        "check_script_name": "NIFTY25073124500CE",
        "rate_id": "5944403"
    },
    {
        "rate": "24550",
        "check_script_name": "NIFTY25073124550CE",
        "rate_id": "5944409"
    },
    {
        "rate": "24600",
        "check_script_name": "NIFTY25073124600CE",
        "rate_id": "5944415"
    },
    {
        "rate": "24650",
        "check_script_name": "NIFTY25073124650CE",
        "rate_id": "5944421"
    },
    {
        "rate": "24700",
        "check_script_name": "NIFTY25073124700CE",
        "rate_id": "5944427"
    },
    {
        "rate": "24750",
        "check_script_name": "NIFTY25073124750CE",
        "rate_id": "5944433"
    },
    {
        "rate": "24800",
        "check_script_name": "NIFTY25073124800CE",
        "rate_id": "5944439"
    },
    {
        "rate": "24850",
        "check_script_name": "NIFTY25073124850CE",
        "rate_id": "5944445"
    },
    {
        "rate": "24900",
        "check_script_name": "NIFTY25073124900CE",
        "rate_id": "5944451"
    },
    {
        "rate": "24950",
        "check_script_name": "NIFTY25073124950CE",
        "rate_id": "5944457"
    },
    {
        "rate": "25000",
        "check_script_name": "NIFTY25073125000CE",
        "rate_id": "5944463"
    },
    {
        "rate": "25050",
        "check_script_name": "NIFTY25073125050CE",
        "rate_id": "5944469"
    },
    {
        "rate": "25100",
        "check_script_name": "NIFTY25073125100CE",
        "rate_id": "5944475"
    },
    {
        "rate": "25150",
        "check_script_name": "NIFTY25073125150CE",
        "rate_id": "5944481"
    },
    {
        "rate": "25200",
        "check_script_name": "NIFTY25073125200CE",
        "rate_id": "5944487"
    },
    {
        "rate": "25250",
        "check_script_name": "NIFTY25073125250CE",
        "rate_id": "5944493"
    },
    {
        "rate": "25300",
        "check_script_name": "NIFTY25073125300CE",
        "rate_id": "5944500"
    },
    {
        "rate": "25350",
        "check_script_name": "NIFTY25073125350CE",
        "rate_id": "5944508"
    },
    {
        "rate": "25400",
        "check_script_name": "NIFTY25073125400CE",
        "rate_id": "5944516"
    },
    {
        "rate": "25450",
        "check_script_name": "NIFTY25073125450CE",
        "rate_id": "5944524"
    },
    {
        "rate": "25500",
        "check_script_name": "NIFTY25073125500CE",
        "rate_id": "5944532"
    },
    {
        "rate": "25550",
        "check_script_name": "NIFTY25073125550CE",
        "rate_id": "5944540"
    },
    {
        "rate": "25600",
        "check_script_name": "NIFTY25073125600CE",
        "rate_id": "5944548"
    },
    {
        "rate": "25650",
        "check_script_name": "NIFTY25073125650CE",
        "rate_id": "5944554"
    },
    {
        "rate": "25700",
        "check_script_name": "NIFTY25073125700CE",
        "rate_id": "5944560"
    },
    {
        "rate": "25750",
        "check_script_name": "NIFTY25073125750CE",
        "rate_id": "5944566"
    },
    {
        "rate": "25800",
        "check_script_name": "NIFTY25073125800CE",
        "rate_id": "5944572"
    },
    {
        "rate": "25850",
        "check_script_name": "NIFTY25073125850CE",
        "rate_id": "5944578"
    },
    {
        "rate": "25900",
        "check_script_name": "NIFTY25073125900CE",
        "rate_id": "5944584"
    },
    {
        "rate": "25950",
        "check_script_name": "NIFTY25073125950CE",
        "rate_id": "5944590"
    },
    {
        "rate": "26000",
        "check_script_name": "NIFTY25073126000CE",
        "rate_id": "5944596"
    },
    {
        "rate": "26050",
        "check_script_name": "NIFTY25073126050CE",
        "rate_id": "5944602"
    },
    {
        "rate": "26100",
        "check_script_name": "NIFTY25073126100CE",
        "rate_id": "5944608"
    },
    {
        "rate": "26150",
        "check_script_name": "NIFTY25073126150CE",
        "rate_id": "5944614"
    },
    {
        "rate": "26200",
        "check_script_name": "NIFTY25073126200CE",
        "rate_id": "5944620"
    },
    {
        "rate": "26250",
        "check_script_name": "NIFTY25073126250CE",
        "rate_id": "5944626"
    },
    {
        "rate": "26300",
        "check_script_name": "NIFTY25073126300CE",
        "rate_id": "5944632"
    },
    {
        "rate": "26350",
        "check_script_name": "NIFTY25073126350CE",
        "rate_id": "5944638"
    },
    {
        "rate": "26400",
        "check_script_name": "NIFTY25073126400CE",
        "rate_id": "5944644"
    },
    {
        "rate": "26450",
        "check_script_name": "NIFTY25073126450CE",
        "rate_id": "5944650"
    },
    {
        "rate": "26500",
        "check_script_name": "NIFTY25073126500CE",
        "rate_id": "5944656"
    },
    {
        "rate": "26550",
        "check_script_name": "NIFTY25073126550CE",
        "rate_id": "5944662"
    },
    {
        "rate": "26600",
        "check_script_name": "NIFTY25073126600CE",
        "rate_id": "5944668"
    },
    {
        "rate": "26650",
        "check_script_name": "NIFTY25073126650CE",
        "rate_id": "5944674"
    },
    {
        "rate": "26700",
        "check_script_name": "NIFTY25073126700CE",
        "rate_id": "5944680"
    },
    {
        "rate": "26750",
        "check_script_name": "NIFTY25073126750CE",
        "rate_id": "5944686"
    },
    {
        "rate": "26800",
        "check_script_name": "NIFTY25073126800CE",
        "rate_id": "5944692"
    },
    {
        "rate": "26850",
        "check_script_name": "NIFTY25073126850CE",
        "rate_id": "5944698"
    },
    {
        "rate": "26900",
        "check_script_name": "NIFTY25073126900CE",
        "rate_id": "5944704"
    },
    {
        "rate": "26950",
        "check_script_name": "NIFTY25073126950CE",
        "rate_id": "5944710"
    },
    {
        "rate": "27000",
        "check_script_name": "NIFTY25073127000CE",
        "rate_id": "5944716"
    },
    {
        "rate": "27050",
        "check_script_name": "NIFTY25073127050CE",
        "rate_id": "5944721"
    },
    {
        "rate": "27100",
        "check_script_name": "NIFTY25073127100CE",
        "rate_id": "5944725"
    },
    {
        "rate": "27150",
        "check_script_name": "NIFTY25073127150CE",
        "rate_id": "5944731"
    },
    {
        "rate": "27200",
        "check_script_name": "NIFTY25073127200CE",
        "rate_id": "5944737"
    },
    {
        "rate": "27250",
        "check_script_name": "NIFTY25073127250CE",
        "rate_id": "5944742"
    },
    {
        "rate": "27300",
        "check_script_name": "NIFTY25073127300CE",
        "rate_id": "5944748"
    },
    {
        "rate": "27350",
        "check_script_name": "NIFTY25073127350CE",
        "rate_id": "5944755"
    },
    {
        "rate": "27400",
        "check_script_name": "NIFTY25073127400CE",
        "rate_id": "5944760"
    },
    {
        "rate": "27450",
        "check_script_name": "NIFTY25073127450CE",
        "rate_id": "5944766"
    },
    {
        "rate": "27500",
        "check_script_name": "NIFTY25073127500CE",
        "rate_id": "5944772"
    },
    {
        "rate": "27550",
        "check_script_name": "NIFTY25073127550CE",
        "rate_id": "5944778"
    },
    {
        "rate": "27600",
        "check_script_name": "NIFTY25073127600CE",
        "rate_id": "5944783"
    },
    {
        "rate": "27650",
        "check_script_name": "NIFTY25073127650CE",
        "rate_id": "5944789"
    },
    {
        "rate": "27700",
        "check_script_name": "NIFTY25073127700CE",
        "rate_id": "5944796"
    },
    {
        "rate": "27750",
        "check_script_name": "NIFTY25073127750CE",
        "rate_id": "5944802"
    },
    {
        "rate": "27800",
        "check_script_name": "NIFTY25073127800CE",
        "rate_id": "5944808"
    },
    {
        "rate": "27850",
        "check_script_name": "NIFTY25073127850CE",
        "rate_id": "5944814"
    },
    {
        "rate": "27900",
        "check_script_name": "NIFTY25073127900CE",
        "rate_id": "5944820"
    },
    {
        "rate": "27950",
        "check_script_name": "NIFTY25073127950CE",
        "rate_id": "5944826"
    },
    {
        "rate": "28000",
        "check_script_name": "NIFTY25073128000CE",
        "rate_id": "5944831"
    },
    {
        "rate": "28050",
        "check_script_name": "NIFTY25073128050CE",
        "rate_id": "5944838"
    },
    {
        "rate": "28100",
        "check_script_name": "NIFTY25073128100CE",
        "rate_id": "5944844"
    },
    {
        "rate": "28150",
        "check_script_name": "NIFTY25073128150CE",
        "rate_id": "5944850"
    },
    {
        "rate": "28200",
        "check_script_name": "NIFTY25073128200CE",
        "rate_id": "5944855"
    },
    {
        "rate": "28250",
        "check_script_name": "NIFTY25073128250CE",
        "rate_id": "5944861"
    },
    {
        "rate": "28300",
        "check_script_name": "NIFTY25073128300CE",
        "rate_id": "5944867"
    },
    {
        "rate": "28350",
        "check_script_name": "NIFTY25073128350CE",
        "rate_id": "5944873"
    },
    {
        "rate": "28400",
        "check_script_name": "NIFTY25073128400CE",
        "rate_id": "5944879"
    },
    {
        "rate": "28450",
        "check_script_name": "NIFTY25073128450CE",
        "rate_id": "5944885"
    },
    {
        "rate": "28500",
        "check_script_name": "NIFTY25073128500CE",
        "rate_id": "5944892"
    },
    {
        "rate": "28550",
        "check_script_name": "NIFTY25073128550CE",
        "rate_id": "5944897"
    },
    {
        "rate": "28600",
        "check_script_name": "NIFTY25073128600CE",
        "rate_id": "5944905"
    },
    {
        "rate": "28650",
        "check_script_name": "NIFTY25073128650CE",
        "rate_id": "5944910"
    },
    {
        "rate": "28700",
        "check_script_name": "NIFTY25073128700CE",
        "rate_id": "5944915"
    },
    {
        "rate": "28750",
        "check_script_name": "NIFTY25073128750CE",
        "rate_id": "5944922"
    },
    {
        "rate": "28800",
        "check_script_name": "NIFTY25073128800CE",
        "rate_id": "5944929"
    },
    {
        "rate": "28850",
        "check_script_name": "NIFTY25073128850CE",
        "rate_id": "5944937"
    },
    {
        "rate": "28900",
        "check_script_name": "NIFTY25073128900CE",
        "rate_id": "5944944"
    },
    {
        "rate": "28950",
        "check_script_name": "NIFTY25073128950CE",
        "rate_id": "5944951"
    },
    {
        "rate": "29000",
        "check_script_name": "NIFTY25073129000CE",
        "rate_id": "5944958"
    },
    {
        "rate": "29050",
        "check_script_name": "NIFTY25073129050CE",
        "rate_id": "5944966"
    },
    {
        "rate": "29100",
        "check_script_name": "NIFTY25073129100CE",
        "rate_id": "5944973"
    },
    {
        "rate": "29150",
        "check_script_name": "NIFTY25073129150CE",
        "rate_id": "5944980"
    },
    {
        "rate": "29200",
        "check_script_name": "NIFTY25073129200CE",
        "rate_id": "5944988"
    },
    {
        "rate": "29250",
        "check_script_name": "NIFTY25073129250CE",
        "rate_id": "5944996"
    },
    {
        "rate": "29300",
        "check_script_name": "NIFTY25073129300CE",
        "rate_id": "5945004"
    },
    {
        "rate": "29350",
        "check_script_name": "NIFTY25073129350CE",
        "rate_id": "5945012"
    },
    {
        "rate": "29400",
        "check_script_name": "NIFTY25073129400CE",
        "rate_id": "5945020"
    },
    {
        "rate": "29450",
        "check_script_name": "NIFTY25073129450CE",
        "rate_id": "5945028"
    },
    {
        "rate": "29500",
        "check_script_name": "NIFTY25073129500CE",
        "rate_id": "5945036"
    },
    {
        "rate": "29550",
        "check_script_name": "NIFTY25073129550CE",
        "rate_id": "5945044"
    },
    {
        "rate": "29600",
        "check_script_name": "NIFTY25073129600CE",
        "rate_id": "5945053"
    },
    {
        "rate": "29650",
        "check_script_name": "NIFTY25073129650CE",
        "rate_id": "5945061"
    },
    {
        "rate": "29700",
        "check_script_name": "NIFTY25073129700CE",
        "rate_id": "5945069"
    },
    {
        "rate": "29750",
        "check_script_name": "NIFTY25073129750CE",
        "rate_id": "5945077"
    },
    {
        "rate": "29800",
        "check_script_name": "NIFTY25073129800CE",
        "rate_id": "5945085"
    },
    {
        "rate": "29850",
        "check_script_name": "NIFTY25073129850CE",
        "rate_id": "5945093"
    },
    {
        "rate": "29900",
        "check_script_name": "NIFTY25073129900CE",
        "rate_id": "5945101"
    },
    {
        "rate": "29950",
        "check_script_name": "NIFTY25073129950CE",
        "rate_id": "5945109"
    },
    {
        "rate": "30000",
        "check_script_name": "NIFTY25073130000CE",
        "rate_id": "5945117"
    },
    {
        "rate": "30050",
        "check_script_name": "NIFTY25073130050CE",
        "rate_id": "5945123"
    },
    {
        "rate": "30100",
        "check_script_name": "NIFTY25073130100CE",
        "rate_id": "5945129"
    },
    {
        "rate": "30150",
        "check_script_name": "NIFTY25073130150CE",
        "rate_id": "5945137"
    },
    {
        "rate": "30200",
        "check_script_name": "NIFTY25073130200CE",
        "rate_id": "5945145"
    },
    {
        "rate": "30250",
        "check_script_name": "NIFTY25073130250CE",
        "rate_id": "5945150"
    },
    {
        "rate": "30300",
        "check_script_name": "NIFTY25073130300CE",
        "rate_id": "5945157"
    },
    {
        "rate": "30350",
        "check_script_name": "NIFTY25073130350CE",
        "rate_id": "5945163"
    },
    {
        "rate": "30400",
        "check_script_name": "NIFTY25073130400CE",
        "rate_id": "5945169"
    }
]

const tempData = {
    "status": "ok",
    "market_type": [
        {
            "market_type_name": "NSEFUT",
            "market_type_id": "2",
            "selected": false
        },
        {
            "market_type_name": "MCXFUT",
            "market_type_id": "1",
            "selected": false
        },
    ],
    "script_list": {
        "1": [
            {
                "script_name": "GOLD",
                "script_id": "1",
                "market_type_id": "1",
                "selected": false
            },
            {
                "script_name": "SILVER",
                "script_id": "2",
                "market_type_id": "1",
                "selected": false
            },
        ],
        "2": [
            {
                "script_name": "NIFTY",
                "script_id": "3",
                "market_type_id": "2",
                "selected": false
            },
        ],
    },
    "script_expiry_list": {
        "1": [
            {
                "script_expiry_id": "27256",
                "script_id": "1",
                "expiry_date": "05-08-2025",
                "script_expiry_type": "",
                "script_lot_qty": "100",
                "expiry_date_orginal": "05AUG2025"
            },
            {
                "script_expiry_id": "28199",
                "script_id": "1",
                "expiry_date": "03-10-2025",
                "script_expiry_type": "",
                "script_lot_qty": "100",
                "expiry_date_orginal": "03OCT2025"
            }
        ],
        "2": [
            {
                "script_expiry_id": "27745",
                "script_id": "2",
                "expiry_date": "05-09-2025",
                "script_expiry_type": "",
                "script_lot_qty": "30",
                "expiry_date_orginal": "05SEP2025"
            }
        ],
        "3": [
            {
                "script_expiry_id": "27297",
                "script_id": "3",
                "expiry_date": "31-07-2025",
                "script_expiry_type": "",
                "script_lot_qty": "75",
                "expiry_date_orginal": "31JUL2025"
            },
            {
                "script_expiry_id": "27766",
                "script_id": "3",
                "expiry_date": "28-08-2025",
                "script_expiry_type": "",
                "script_lot_qty": "75",
                "expiry_date_orginal": "28AUG2025"
            }
        ],
        "4": [
            {
                "script_expiry_id": "27298",
                "script_id": "4",
                "expiry_date": "31-07-2025",
                "script_expiry_type": "",
                "script_lot_qty": "35",
                "expiry_date_orginal": "31JUL2025"
            },
        ]
    }
}
