import React, { useEffect, useState } from 'react';
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
import { ScriptwiselotAPI } from './API/API';
import Scriptwiselotfilter from './Utility/Scriptwiselotfilter';
import Pagination from './filters/Pagination';
import SearchPdfCsv from './filters/SearchPdfCsv';

const colArr = [
    "Market Name",
    "Script Name",
    "Quantity",
]

const keyArr = [
    "market_type_name",
    "script_name",
    "script_lot_qty",
];


const Scriptwiselot = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

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
            const result = await ScriptwiselotAPI(
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

            let data = result?.data || [];

            // -- CLIENT-SIDE SEARCH FILTER (case-insensitive, partial match)
            // If backend search isn't working for you, use this to force-filter
            const searchTerm = debouncedSearchText?.trim().toLowerCase();
            if (searchTerm) {
                data = data.filter((item) => (item?.script_name || '').toLowerCase().includes(searchTerm));
            }

            // sort latest first by start_date (fallback to valan_id if no start_date)
            data = data.sort((a, b) => {
                const da = a?.start_date ? new Date(a.start_date) : null;
                const db = b?.start_date ? new Date(b.start_date) : null;
                if (da && db) return db - da;
                if (db) return 1;
                if (da) return -1;
                // fallback to valan_id numeric desc
                return (b?.valan_id ?? 0) - (a?.valan_id ?? 0);
            });

            // Manual pagination if API doesn't do it
            const start = currentPage * pageSize;
            const paginatedData = data.slice(start, start + pageSize);

            if (isMobile) {
                // mobile: append on "load more", replace on new filters or first page
                if (isFilterChange || currentPage === 0) setLogs(paginatedData);
                else setLogs((prev) => [...prev, ...paginatedData]);
            } else {
                setLogs(paginatedData);
            }

            setTotalRecords(data.length);
        } catch (err) {
            console.error('fetchLogs error:', err);
            // keep previous logs on error
        } finally {
            setIsFilterChange(false);
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

    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Scriptwiselotfilter
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        valanId={valanId}
                        setValanId={setValanId}
                        onApply={onFilterApply}
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
                                            <TableCell>Market Name</TableCell>
                                            <TableCell>Script Name</TableCell>
                                            <TableCell>Quantity</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((row, i) => (
                                            <TableRow key={i}
                                                style={{
                                                    backgroundColor:
                                                        i % 2 === 0
                                                            ? theme.palette.mode === "dark"
                                                                ? "#333" // dark mode stripe (even rows)
                                                                : "#fff" // light mode stripe (even rows)
                                                            : theme.palette.mode === "dark"
                                                                ? "#222" // darker alt for dark mode (odd rows)
                                                                : "#e0e0e0", // darker grey for light mode (odd rows)
                                                }}>
                                                <TableCell>{row.market_type_name ?? '-'}</TableCell>
                                                <TableCell>{row.script_name ?? '-'}</TableCell>
                                                <TableCell>{row.script_lot_qty ?? '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {logs.length === 0 && !loading && <Typography textAlign="center">No Logs Found</Typography>}
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
                                <Scriptwiselotfilter
                                    end1_date={end1_date}
                                    start1_date={start1_date}
                                    setEnd1_date={setEnd1_date}
                                    setStart1_date={setStart1_date}
                                    is_deleted={is_deleted}
                                    is_updated={is_updated}
                                    setIs_deleted={setIs_deleted}
                                    setIs_updated={setIs_updated}
                                    market={market}
                                    setMarket={setMarket}
                                    valanId={valanId}
                                    setValanId={setValanId}
                                    onApply={onFilterApply}
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
                                                `linear-gradient(${theme.palette.mode === 'dark' ? '#333' : '#fff'}, ${theme.palette.mode === 'dark' ? '#333' : '#fff'
                                                }), ${borderGradient}`,
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
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                    {log.market_type_name ?? '-'}
                                                </Typography>
                                                <Typography variant="body2">{log.script_name ?? '-'}</Typography>
                                                <Typography variant="body2">{log.script_lot_qty ?? '-'}</Typography>
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

export default Scriptwiselot;
