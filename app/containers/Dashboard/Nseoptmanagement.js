import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    IconButton,
    Drawer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';

import FilterBtn from './filters/FilterBtn';
import BackToTop from './helpers/BackToTop';
import { getDefaultParams, NSEOPTmanageAPI, ScriptwiselotAPI, setBlockOptionExpiryAPI } from './API/API';
import Scriptwiselotfilter from './Utility/Scriptwiselotfilter';
import Pagination from './filters/Pagination';
import FilterComponent from './Watchlist/FilterComponent';
import SocketContext from './Socket/SocketContext';
import Nseoptmanagefilter from './Watchlist/Nseoptmanagefilter';
import { toast } from 'react-toastify';
import axios from 'dan-vendor/axios';
import SearchPdfCsv from './filters/SearchPdfCsv';
import Loader from './Components/Loader';

const forexMarketType = { market_type_id: 5, market_type_name: 'Forex' };

const colArr = [
    "Script Name",
    "Option Type",
    "Strike Rate",
]

const keyArr = [
    "option_check_script_name",
    "option_type",
    "option_strike_rate",
]

const Nseoptmanagement = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [isForex, setIsForex] = useState();
    const [dummyData, setDummyData] = useState();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [marketNames, setMarketNames] = useState([]);

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const isFirstRender = useIsFirstRender();

    const [scriptOptions, setScriptOptions] = useState([]);
    const [expiryOptions, setExpiryOptions] = useState([]);
    const [strikeOptions, setStrikeOptions] = useState([]);
    const [strikeLoading, setStrikeLoading] = useState(false);
    const [expiryLoading, setExpiryLoading] = useState(false);
    const [scriptLoading, setScriptLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filterDrawer, setFilterDrawer] = useState(false);

    // marker to indicate filter/search was changed and we should refresh
    const [isFilterChange, setIsFilterChange] = useState(false);

    const [script, setScript] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [type, setType] = useState('CE');
    const [strike, setStrike] = useState(null);

    const [removeTrade, setRemoveTrade] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const result = await NSEOPTmanageAPI(
                currentPage,
                pageSize,
                debouncedSearchText,
            );

            const data = result.aaData || [];

            // Correct client-side search on option_check_script_name
            // const searchTerm = debouncedSearchText?.trim().toLowerCase();
            // if (searchTerm) {
            //     data = data.filter(item =>
            //         (item?.option_check_script_name || '').toLowerCase().includes(searchTerm)
            //     );
            // }

            // Optional: sort by script_expiry_option_id descending
            // data = data.sort((a, b) => (b?.script_expiry_option_id ?? 0) - (a?.script_expiry_option_id ?? 0));


            isMobile
                ? isFilterChange || currentPage === 0
                    ? setLogs(data || [])
                    : setLogs(prev => [...prev, ...data])
                : setLogs(data || []);

            setTotalRecords(result.iTotalRecords || 0);
            setIsFilterChange(false);
        } catch (err) {
            console.error('fetchLogs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (script_expiry_option_id, action) => {
        const w1 = action === 'block' ? 'blocked' : action === 'remove' ? 'removed' : '';
        const w2 = action === 'block' ? 'blocking' : action === 'remove' ? 'removing' : '';

        try {
            setLoading(true);

            const result = await setBlockOptionExpiryAPI({ script_expiry_option_id, action });
            console.log(action, "response:", result);

            if (result?.status === "ok") {
                toast.success(`Option ${w1} successfully`);
                fetchLogs(); // refresh table/cards
            } else {
                toast.error(`Failed to ${action} option`);
            }
        } catch (err) {
            toast.error(`Error ${w2} option`);
        } finally {
            toggleDrawer(false)();
            setRemoveTrade(false);
            setLoading(false);
        }
    };

    // # pagination useEffects
    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [pageSize, totalRecords])

    useEffect(() => {
        console.log("aa");
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setCurrentPage(0);
    }, [debouncedSearchText]);

    useEffect(() => {
        !isFirstRender && fetchLogs();
    }, [currentPage, pageSize]);

    useEffect(() => {
        isFilterChange && !isFirstRender && fetchLogs();
    }, [isFilterChange])

    const toggleDrawer = (open) => () => setFilterDrawer(open);

    function onFilterApply() {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setCurrentPage(0);
        toggleDrawer(false)();
    }

    function setKeysOfScriptData(item) {
        const scriptName = `${item.script_name} ${formatDate(item.script_expiry_orginal_format)}`;
        // const maxOrder = parseInt(item.max_order, 10) || 0;
        // const qty = parseInt(item.quantity, 10) || 0;

        return {
            ...item,
            id: item.market_watch_id,
            scriptName,
            isFavorite: item.favourite == 1,
            // exchange: item.market_type_name || 'NSE',
            // open: getRandomPrice(280000, 290000),
            // close: getRandomPrice(270000, 285000),
            // high: getRandomPrice(285000, 295000),
            // low: getRandomPrice(265000, 280000),
            // bidRate: getRandomPrice(250000, 290000),
            // askRate: getRandomPrice(250000, 290000),
            // ltp: getRandomPrice(270000, 290000),
            // priceChange: getRandomFloat(-500, 500),
            // priceChangePercent: getRandomFloat(-2.5, 2.5),
            // qty,
            // time: new Date().getTime(),
            // maxOrder,
            // position: Math.random() > 0.5 ? 'Buy' : 'Sell',
            // lastChangedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
    }

    function setKeysOfAllScriptData(scripts = []) {
        return scripts.map((item, index) => setKeysOfScriptData(item));
    }

    const fetchScripts = async () => {
        try {
            setScriptLoading(true);
            const defaultParams = await getDefaultParams();
            const res = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/get_market_wise_script_forex',
                { ...defaultParams, market_type_id: forexMarketType.market_type_id }
            );
            const scripts = res.data?.data || [];
            setScriptOptions(scripts);
            if (scripts.length > 0) setScript(scripts[0]);
        } catch (err) {
            console.error('Error fetching scripts:', err);
        } finally {
            setScriptLoading(false);
        }
    };

    const fetchExpiries = async () => {
        if (!script?.script_id) {
            setExpiryOptions([]);
            setExpiry(null);
            return;
        }
        try {
            setExpiryLoading(true);
            const defaultParams = await getDefaultParams();
            const res = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/get_script_wise_expiry_forex',
                { ...defaultParams, script_id: script.script_id }
            );
            const expiries = res.data?.data || [];
            setExpiryOptions(expiries);
            setExpiry(expiries.length > 0 ? expiries[0] : null);
        } catch (err) {
            console.error('Error fetching expiries:', err);
            setExpiryOptions([]);
            setExpiry(null);
        } finally {
            setExpiryLoading(false);
        }
    };

    const fetchStrikes = async () => {
        if (!expiry?.script_expiry_id || !type) {
            setStrikeOptions([]);
            setStrike(null);
            return;
        }
        try {
            setStrikeLoading(true);
            const defaultParams = await getDefaultParams();
            const res = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/get_option_strike_price',
                {
                    ...defaultParams,
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


    // Fetch Scripts on mount
    useEffect(() => {
        console.log("}, []);");
        fetchScripts();
    }, []);

    // Fetch Expiry whenever Script changes
    useEffect(() => {
        fetchExpiries();
    }, [script]);

    // Fetch Strike whenever Expiry or Type changes
    useEffect(() => {
        fetchStrikes();
    }, [expiry, type]);

    return (
        <>
            {loading
                && (!isMobile
                    ? <Loader />
                    : currentPage == 0 && <Loader />)}

            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Nseoptmanagefilter
                        isDarkMode={isDarkMode}
                        strike={strike} setScript={setScript}
                        expiry={expiry} setExpiry={setExpiry}
                        script={script} setStrike={setStrike}
                        type={type} setType={setType}
                        scriptOptions={scriptOptions} setScriptOptions={setScriptOptions}
                        expiryOptions={expiryOptions} setExpiryOptions={setExpiryOptions}
                        strikeOptions={strikeOptions} setStrikeOptions={setStrikeOptions}
                        strikeLoading={strikeLoading} setStrikeLoading={setStrikeLoading}
                        expiryLoading={expiryLoading} setExpiryLoading={setExpiryLoading}
                        scriptLoading={scriptLoading} setScriptLoading={setScriptLoading}
                        setRemoveTrade={setRemoveTrade}
                        handleAction={handleAction}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2.5,
                            mx: 1,
                            flexWrap: 'nowrap',
                        }}
                    >
                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                        />
                    </Box>

                    {logs.length === 0 && !loading && <Typography textAlign="center">No Logs Found</Typography>}

                    <TableContainer
                        sx={{
                            maxHeight: '70vh',
                            overflow: 'auto',
                            '&::-webkit-scrollbar': { height: 6, width: 6 },
                            '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: 4 },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4 },
                            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                        }}
                    >
                        <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Script Name</TableCell>
                                    <TableCell>Option Type</TableCell>
                                    <TableCell>Strike Rate</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((row, i) => (
                                    <TableRow key={i} style={{
                                        backgroundColor:
                                            i % 2 === 0
                                                ? theme.palette.mode === "dark"
                                                    ? "#333" // dark mode stripe (even rows)
                                                    : "#fff" // light mode stripe (even rows)
                                                : theme.palette.mode === "dark"
                                                    ? "#222" // darker alt for dark mode (odd rows)
                                                    : "#e0e0e0", // darker grey for light mode (odd rows)
                                    }}>
                                        <TableCell>{row.option_check_script_name ?? '-'}</TableCell>
                                        <TableCell>{row.option_type ?? '-'}</TableCell>
                                        <TableCell>{row.option_strike_rate ?? '-'}</TableCell>

                                        {/* Action column */}
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                // onClick={() => setRemoveTrade(row)}
                                                onClick={() => handleAction(row.script_expiry_option_id)}
                                                sx={{ borderRadius: 1 }}
                                            >
                                                Remove
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                    />
                </Paper>
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.7,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1.5,
                            mt: 0.5,
                            mx: 1,
                            flexWrap: 'nowrap',
                        }}
                    >
                        <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                            <Box sx={{ width: 280, p: 2 }} role="presentation">
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Filters</Typography>
                                    <IconButton onClick={() => setFilterDrawer(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Nseoptmanagefilter
                                    isDarkMode={isDarkMode}
                                    strike={strike} setScript={setScript}
                                    expiry={expiry} setExpiry={setExpiry}
                                    script={script} setStrike={setStrike}
                                    type={type} setType={setType}
                                    scriptOptions={scriptOptions} setScriptOptions={setScriptOptions}
                                    expiryOptions={expiryOptions} setExpiryOptions={setExpiryOptions}
                                    strikeOptions={strikeOptions} setStrikeOptions={setStrikeOptions}
                                    strikeLoading={strikeLoading} setStrikeLoading={setStrikeLoading}
                                    expiryLoading={expiryLoading} setExpiryLoading={setExpiryLoading}
                                    scriptLoading={scriptLoading} setScriptLoading={setScriptLoading}
                                    setRemoveTrade={setRemoveTrade}
                                    handleAction={handleAction}
                                />
                            </Box>
                        </Drawer>

                        <FilterBtn setFilterOpen={setFilterDrawer} />

                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                        />
                    </Box>

                    {logs.length === 0 && !loading && <Typography textAlign="center">No Logs Found</Typography>}

                    {logs.map((log, index) => {
                        const isBuy = log.trade_type?.toLowerCase() === 'buy';
                        const isSell = log.trade_type?.toLowerCase() === 'sell';

                        const borderGradient = isBuy
                            ? 'linear-gradient(to right, #2196f3, #21cbf3)'
                            : isSell
                                ? 'linear-gradient(to right, #f44336, #ff7961)'
                                : '#ccc';

                        const boxShadowColor = isBuy
                            ? 'rgba(33, 150, 243, 0.3)'
                            : isSell
                                ? 'rgba(244, 67, 54, 0.3)'
                                : 'rgba(0,0,0,0.1)';

                        return (
                            <Card
                                key={index}
                                sx={{
                                    mb: 1,
                                    mx: 1,
                                    borderRadius: 2,
                                    border: '1px solid transparent',
                                    backgroundImage: (theme) =>
                                        `linear-gradient(${theme.palette.mode === 'dark' ? '#333' : '#fff'}, ${theme.palette.mode === 'dark' ? '#333' : '#fff'}), ${borderGradient}`,
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'content-box, border-box',
                                    boxShadow: `0 4px 12px ${boxShadowColor}`,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: `0 8px 20px ${boxShadowColor}`,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                            {log.option_check_script_name ?? '-'}
                                        </Typography>
                                        <Typography variant="body2">{log.option_type ?? '-'}</Typography>
                                        <Typography variant="body2">{log.option_strike_rate ?? '-'}</Typography>

                                        {/* Remove Button */}
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            style={{ borderRadius: 4 }}
                                            // onClick={() => setRemoveTrade(log)}
                                            onClick={() => handleAction(log.script_expiry_option_id)}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>

                        );
                    })}

                    {/* LOAD MORE */}
                    {logs.length < totalRecords && (
                        loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                <Button variant="outlined" onClick={() => setCurrentPage((prev) => prev + 1)} size="small">
                                    Load More
                                </Button>
                            </Box>
                        )
                    )}

                    <BackToTop />
                </>
            )}

            <Dialog
                open={!!removeTrade}
                onClose={() => setRemoveTrade(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title" sx={{ mb: 2 }}>
                    Confirm Removal
                </DialogTitle>
                <DialogContent>
                    <Typography id="confirm-dialog-description">
                        Are you sure, you want to Remove ?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setRemoveTrade(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        autoFocus
                        onClick={() => handleAction(removeTrade.script_expiry_option_id ?? removeTrade.rate_id, 'remove')}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};


export default Nseoptmanagement