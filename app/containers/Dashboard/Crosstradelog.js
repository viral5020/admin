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
    Drawer,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';

import Pagination from './filters/Pagination';
import FilterBtn from './filters/FilterBtn';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import BackToTop from './helpers/BackToTop';
import { BillfilterAPI, CrosstradelogAPI } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Summaryreportfilter from './summaryreportfilter';
import ValanFilter from './ValanFilter';

const Crosstradelog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);
    const isFirstRender = useIsFirstRender();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filterDrawer, setFilterDrawer] = useState(false);

    // Filters
    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');

    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');

    const [valanId, setValanId] = useState(null);

    const fetchLogs = async () => {
        console.log("fetchLogs");
        try {
            setLoading(true);

            const scriptIds = formatScriptIds?.(script);

            const response = await CrosstradelogAPI({
                currentPage,
                pageSize,
                start_date,
                end_date,
                valan_id: valanId?.id,
                market_type_id: market?.id,
                script_id: scriptIds,
                user_id: client?.id,
                broker_user_id: broker?.id,
                master_user_id: master?.id,
                term: searchText,
            });

            const logsArray = response?.data || [];
            console.log("Logs array:", logsArray);

            if (isMobile) {
                if (isFilterChange || currentPage === 0) {
                    setLogs(logsArray);
                } else {
                    setLogs(prev => [...prev, ...logsArray]);
                }
            } else {
                setLogs(logsArray);
            }

            setTotalRecords(logsArray.length);
            setIsFilterChange(false);

        } catch (err) {
            console.error("Failed to fetch logs:", err);
            setLogs([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const toggleDrawer = (open) => () => setFilterDrawer(open);

    function onFilterApply() {
        !isFirstRender && currentPage === 0
            ? setIsFilterChange(true)
            : setIsFilterChange(false);
        setCurrentPage(0);
        toggleDrawer(false)();
    }

    useEffect(() => {
        console.log('logs.length', logs.length, logs);
    }, [logs]);

    // Initial fetch
    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [pageSize, totalRecords]);

    useEffect(() => {
        !isFirstRender && currentPage === 0
            ? setIsFilterChange(true)
            : setIsFilterChange(false);
        setCurrentPage(0);
    }, [debouncedSearchText]);

    useEffect(() => {
        !isFirstRender && fetchLogs();
    }, [currentPage, pageSize]);

    useEffect(() => {
        isFilterChange && !isFirstRender && fetchLogs();
    }, [isFilterChange]);

    return (
        <>
            {/* Mobile filter drawer */}
            <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                <Box sx={{ width: 280, p: 2 }} role="presentation">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setFilterDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Filters (same as desktop) */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <ValanFilter valanId={valanId} setValanId={setValanId} />
                        </div>
                    </div>

                    <TradeEditDeleteLogFilter
                        End1_date={end_date}
                        Start1_date={start_date}
                        setEnd1_date={setEnd_date}
                        setStart1_date={setStart_date}
                        market={market}
                        setMarket={setMarket}
                        client={client}
                        master={master}
                        broker={broker}
                        script={script}
                        setScript={setScript}
                        setClient={setClient}
                        setMaster={setMaster}
                        setBroker={setBroker}
                        onApply={onFilterApply}
                    />
                </Box>
            </Drawer>

            <Paper sx={{ p: 1, borderRadius: 2 }}>
                {/* Desktop filters (always visible) */}
                {!isMobile && (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '16px',
                                gap: '16px',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <ValanFilter valanId={valanId} setValanId={setValanId} />
                            </div>
                        </div>

                        <TradeEditDeleteLogFilter
                            End1_date={end_date}
                            Start1_date={start_date}
                            setEnd1_date={setEnd_date}
                            setStart1_date={setStart_date}
                            market={market}
                            setMarket={setMarket}
                            client={client}
                            master={master}
                            broker={broker}
                            script={script}
                            setScript={setScript}
                            setClient={setClient}
                            setMaster={setMaster}
                            setBroker={setBroker}
                            onApply={onFilterApply}
                        />
                    </>
                )}

                {/* Top bar with search + filter icon (filter icon only on mobile) */}
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
                    {isMobile && <FilterBtn setFilterOpen={setFilterDrawer} />}

                    <TextField
                        variant="outlined"
                        placeholder="Search logs..."
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

                {logs.length === 0 && !loading && <Typography textAlign='center'>No Logs Found</Typography>}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Table with horizontal scroll */}
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table stickyHeader size="small" sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sr. No</TableCell>
                                        <TableCell>User Code</TableCell>
                                        <TableCell>Market</TableCell>
                                        <TableCell>Script</TableCell>
                                        <TableCell>Trade Type</TableCell>
                                        <TableCell>Trade Rate</TableCell>
                                        <TableCell>Lot</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{log?.sr_no ?? '-'}</TableCell>
                                            <TableCell>{log?.user_code ?? '-'}</TableCell>
                                            <TableCell>{log?.Market ?? '-'}</TableCell>
                                            <TableCell>{log?.Script ?? '-'}</TableCell>
                                            <TableCell>{log?.Trade_Type ?? '-'}</TableCell>
                                            <TableCell>{log?.Trade_Rate ?? '-'}</TableCell>
                                            <TableCell>{log?.Lot ?? '-'}</TableCell>
                                            <TableCell>{log?.Qty ?? '-'}</TableCell>
                                            <TableCell>{log?.Amount ?? '-'}</TableCell>
                                            <TableCell>{log?.Time ?? '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
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
        </>
    );
};


export default Crosstradelog