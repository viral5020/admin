import React, { useEffect, useState } from 'react';
import {
    Box,
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
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import axios from 'axios';

import FilterBtn from './filters/FilterBtn';
import BackToTop from './helpers/BackToTop';
import { deleteFutureTradingBlockAPI, StopfuturelistAPI } from './API/API';
import Scriptwiselotfilter from './Utility/Scriptwiselotfilter';
import Pagination from './filters/Pagination';
import Stopfuturefilter from './Utility/Stopfuturefilter';
import { toast } from 'dan-vendor/react-toastify/dist';
import SearchPdfCsv from './filters/SearchPdfCsv';

const colArr = [
    "Market Name",
    "Master Name",
    "Expiry",
    "Added Date",
]

const keyArr = [
    "market_name",
    "full_name",
    "expiry_original_format",
    "added_datetime",
]

const Stopfuturetrading = () => {
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

    const [isFilterChange, setIsFilterChange] = useState(false);

    const [removeTrade, setRemoveTrade] = useState(false);

    // ✅ Delete handler (common for desktop + mobile)
    const handleDelete = async (future_block_id) => {
        try {
            const result = await deleteFutureTradingBlockAPI({ future_block_id });

            if (result?.status === "ok") {
                toast.success("Future block deleted!", { position: "top-right", autoClose: 3000 });
                setLogs((prev) => prev.filter((item) => item.future_id !== future_id));
            } else {
                toast.error("Failed to delete!", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error("Error deleting future block!", { position: "top-right", autoClose: 3000 });
        }
    };

    // ✅ Fetch logs
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const result = await StopfuturelistAPI(
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

            let data = result?.aaData || [];

            // client-side search
            const searchTerm = debouncedSearchText?.trim().toLowerCase();
            if (searchTerm) {
                data = data.filter(
                    (item) =>
                        (item?.full_name || '').toLowerCase().includes(searchTerm) ||
                        (item?.market_name || '').toLowerCase().includes(searchTerm)
                );
            }

            // sort by date
            data = data.sort((a, b) => {
                const da = new Date(a?.added_datetime?.replace(/(\d+)-(\d+)-(\d+) (\d+:\d+:\d+)/, '$2/$1/$3 $4'));
                const db = new Date(b?.added_datetime?.replace(/(\d+)-(\d+)-(\d+) (\d+:\d+:\d+)/, '$2/$1/$3 $4'));
                return db - da;
            });

            // pagination
            const start = currentPage * pageSize;
            const paginatedData = data.slice(start, start + pageSize);

            if (isMobile) {
                if (isFilterChange || currentPage === 0) setLogs(paginatedData);
                else setLogs((prev) => [...prev, ...paginatedData]);
            } else {
                setLogs(paginatedData);
            }

            setTotalRecords(data.length);
        } catch (err) {
            console.error('fetchLogs error:', err);
        } finally {
            setIsFilterChange(false);
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

    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Stopfuturefilter
                        master={master}
                        setMaster={setMaster}
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        valanId={valanId}
                        setValanId={setValanId}
                        onApply={onFilterApply}
                    />

                    {/* Search Box */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2.5,
                            mx: 1,
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
                                }}
                            >
                                <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Market Name</TableCell>
                                            <TableCell>Master Name</TableCell>
                                            <TableCell>Expiry</TableCell>
                                            <TableCell>Added Date</TableCell>
                                            <TableCell align="center">Action</TableCell>
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
                                                <TableCell>{row.market_name ?? '-'}</TableCell>
                                                <TableCell>{row.full_name ?? '-'}</TableCell>
                                                <TableCell>{row.expiry_original_format ?? '-'}</TableCell>
                                                <TableCell>{row.added_datetime ?? '-'}</TableCell>
                                                <TableCell align="center">
                                                    <Typography style={{ textAlign: 'center' }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="error"
                                                            sx={{ borderRadius: 1 }}
                                                            // onClick={() => setRemoveTrade(row)}
                                                            onClick={() => handleDelete(row.future_id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Typography>
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
                    {/* Mobile Layout */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1.5,
                            mt: 0.5,
                            mx: 1,
                        }}
                    >
                        <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                            <Box sx={{ width: 280, p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                            {logs.map((log, index) => (
                                <Card key={index} sx={{ mb: 1, mx: 1, borderRadius: 2 }}>
                                    <CardContent sx={{ p: 1, mb: -1.8 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {log.full_name ?? '-'}
                                            </Typography>
                                            <Typography variant="body2">{log.market_name ?? '-'}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="subtitle2">{log.expiry_original_format ?? '-'}</Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <Typography variant="body2">{log.added_datetime ?? '-'}</Typography>
                                                <Typography
                                                    variant="contained"
                                                    sx={{
                                                        color: 'error.main',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        '&:hover': { textDecoration: 'underline' },
                                                    }}
                                                    // onClick={() => handleDelete(log.future_id)}
                                                    onClick={() => handleDelete(log.future_id)}
                                                >
                                                    Delete
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Load More */}
                            {logs.length < totalRecords &&
                                (loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                        <Button variant="outlined" onClick={() => setCurrentPage((prev) => prev + 1)} size="small">
                                            Load More
                                        </Button>
                                    </Box>
                                ))}

                            <BackToTop />
                        </>
                    )}
                </>
            )}

            <Dialog
                open={!!removeTrade}
                onClose={() => setRemoveTrade(false)}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title" sx={{ mb: 2 }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <Typography id="confirm-dialog-description">
                        Are you sure, you want to delete ?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setRemoveTrade(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(removeTrade.future_id)} variant="contained" color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Stopfuturetrading;
