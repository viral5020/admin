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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';

import FilterBtn from './filters/FilterBtn';
import BackToTop from './helpers/BackToTop';
import { NSEOPTmanageAPI, ScriptwiselotAPI } from './API/API';
import Scriptwiselotfilter from './Utility/Scriptwiselotfilter';
import Pagination from './filters/Pagination';
import FilterComponent from './Watchlist/FilterComponent';
import SocketContext from './Socket/SocketContext';
import Nseoptmanagefilter from './Watchlist/Nseoptmanagefilter';
import { toast } from 'dan-vendor/react-toastify/dist';
import axios from 'dan-vendor/axios';

const Nseoptmanagement = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [isForex, setIsForex] = useState();
    const [dummyData, setDummyData] = useState();
    const [socketData, setSocketData] = useState();
    const socketContext = useContext(SocketContext);

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [marketNames, setMarketNames] = useState([]);

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const isFirstRender = useIsFirstRender();

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filterDrawer, setFilterDrawer] = useState(false);

    // Filters
    const [market, setMarket] = useState('');
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [script, setScript] = useState('');
    const [end1_date, setEnd1_date] = useState('');
    const [start1_date, setStart1_date] = useState('');
    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [isAdminOnly, setIsAdminOnly] = useState(false);
    const [valanId, setValanId] = useState(null);

    // marker to indicate filter/search was changed and we should refresh
    const [isFilterChange, setIsFilterChange] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const result = await NSEOPTmanageAPI(
                currentPage,
                pageSize,
                debouncedSearchText,
                market,
                master,
                client,
                end1_date,
                start1_date,
                is_deleted,
                is_updated,
                isAdminOnly,
            );

            let data = result || []; // API already returns aaData array

            // Correct client-side search on option_check_script_name
            const searchTerm = debouncedSearchText?.trim().toLowerCase();
            if (searchTerm) {
                data = data.filter(item =>
                    (item?.option_check_script_name || '').toLowerCase().includes(searchTerm)
                );
            }

            // Optional: sort by script_expiry_option_id descending
            data = data.sort((a, b) => (b?.script_expiry_option_id ?? 0) - (a?.script_expiry_option_id ?? 0));

            setLogs(data);
            setTotalRecords(data.length);
        } catch (err) {
            console.error('fetchLogs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (script_expiry_option_id) => {
        try {
            setLoading(true);

            const payload = { script_expiry_option_id, is_block: 0 };

            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/add_block_option_expiry',
                payload
            );

            console.log('Remove response:', response.data);

            if (response.data?.status === 'ok') {
                toast.success(response.data.message || 'Option removed successfully');
                fetchLogs(); // refresh table/cards
            } else {
                toast.error(response.data?.message || 'Failed to remove option');
            }
        } catch (err) {
            toast.error(err.message || 'Error removing option');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    // Initial load
    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // When debounced search term changes -> reset to page 0 and mark filter change
    useEffect(() => {
        if (!isFirstRender) {
            setCurrentPage(0);
            setIsFilterChange(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchText]);

    // When page / pageSize / filter-change toggles -> fetch
    useEffect(() => {
        if (!isFirstRender) {
            fetchLogs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, isFilterChange]);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [pageSize, totalRecords]);

    const toggleDrawer = (open) => () => setFilterDrawer(open);

    function onFilterApply() {
        // user applied filters from drawer -> reset page and fetch
        setIsFilterChange(true);
        setCurrentPage(0);
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

    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Nseoptmanagefilter
                        searchText={searchText}
                        setSearchText={setSearchText}
                        isDarkMode={isDarkMode}
                        isMobile={isMobile}
                        isForex={isForex}
                        setDummyData={setDummyData}

                        setKeysOfScriptData={setKeysOfScriptData}
                        setMarketNames={setMarketNames}
                        marketNames={marketNames}
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
                        <TextField
                            variant="outlined"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                            sx={{ flex: 1, minWidth: 200 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ position: 'relative', top: '-5px' }}>
                                        <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {logs.length === 0 && !loading && <Typography textAlign="center">No Logs Found</Typography>}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
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
                                            <TableRow key={i}>
                                                <TableCell>{row.option_check_script_name ?? '-'}</TableCell>
                                                <TableCell>{row.option_type ?? '-'}</TableCell>
                                                <TableCell>{row.option_strike_rate ?? '-'}</TableCell>

                                                {/* Action column */}
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleRemove(row.script_expiry_option_id)}
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
                        </>
                    )}
                </Paper>
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
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
                                    searchText={searchText}
                                    setSearchText={setSearchText}
                                    isDarkMode={isDarkMode}
                                    isMobile={isMobile}
                                    isForex={isForex}
                                    setDummyData={setDummyData}
                                    setKeysOfScriptData={setKeysOfScriptData}
                                    setMarketNames={setMarketNames}
                                    marketNames={marketNames}
                                />
                            </Box>
                        </Drawer>

                        <FilterBtn setFilterOpen={setFilterDrawer} />

                        <TextField
                            variant="outlined"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                            sx={{ flex: 1, minWidth: 200 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ position: 'relative', top: '-5px' }}>
                                        <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {logs.length === 0 && !loading && <Typography textAlign="center">No Logs Found</Typography>}

                    {loading && (isFilterChange || currentPage === 0) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
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
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleRemove(log.script_expiry_option_id)}
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
                </>
            )}
        </>
    );
};


export default Nseoptmanagement