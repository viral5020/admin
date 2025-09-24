import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
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
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Drawer,
    IconButton,
    useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import TradeEditDeleteLogFilter from './TradeEditDeleteLogFilter';
import Pagination from '../filters/Pagination';
import BackToTop from '../helpers/BackToTop';
import { formatScriptIds } from '../helpers/utilFunc';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import { bulktradingAPI, fetchBulkTradeListAPI, fetchOrders1API } from '../API/API';
import axios from 'axios';
import FilterBtn from '../filters/FilterBtn';
import SearchPdfCsv from "../filters/SearchPdfCsv";

const colArr = [
    "No of Trades",
    "End Date & Time",
    "Start date & Time",
    "Script Name",
]

const keyArr = [
    "script_name",
    "start_datetime",
    "end_datetime",
    "no_of_trade",
]


const Bulktrading = ({
    filterShow = true,
    setfilterShow = () => { } // default no-op function
}) => {
    console.log("filterShow=", filterShow);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    // Main table states
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);
    const isFirstRender = useIsFirstRender();

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [filterDrawer, setFilterDrawer] = useState(false);
    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');

    const [after_date, setafter_date] = useState('');
    const [before_date, setbefore_date] = useState('');

    // Trade dialog states
    const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [tradeLoading, setTradeLoading] = useState(false);
    const [minimum, setMinimum] = useState('-');

    // Bulk trade list states
    const [noOfTrades, setNoOfTrades] = useState(2); // default value
    const [bulkTrades, setBulkTrades] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false);

    const rawData = sessionStorage.getItem("data");
    const parsedData = JSON.parse(rawData);
    const userType = parseInt(parsedData.user_type, 10);

    useEffect(() => {
        console.log('QQQQ orders', orders);
    }, [orders])

    const toggleDrawer = (open) => () => setFilterDrawer(open);


    // --- Fetch trades for dialog ---
    const fetchTradeDetails = async (log) => {
        try {
            setTradeLoading(true);
            const dataStored = JSON.parse(sessionStorage.getItem("data"));
            const result = await fetchOrders1API({
                userId: dataStored.user_id,
                authKey: dataStored.auth_key,
                start_date: log.end_datetime,
                end_date: log.start_datetime,
                script_full_name: log.script_name,
                tradeType: log.trade_type
            });
            setOrders(result || []);
            setTradeDialogOpen(true);
        } catch (error) {
            console.error("Error fetching trades:", error);
        } finally {
            setTradeLoading(false);
        }
    };

    // --- Fetch main logs ---
    const fetchLogs = async () => {
        try {
            setLoading(true);
            const scriptIds = formatScriptIds(script);
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            const payload = {
                is_app: '1',
                currentPage,
                pageSize,
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                master_user_id: master?.id || '',
                broker_user_id: client?.id || '',
                market_type_id: market?.id || '',
                script_id: scriptIds || '',
                user_id: client?.id || '',
                start_date: after_date || '',
                end_date: before_date || '',
                noOfTrades: noOfTrades || '',
                sSearch: searchText,
            };
            const result = await bulktradingAPI(payload);

            const data = result.data || [];
            const minimumValue = result.minimum || '-';

            setLogs(data);
            setTotalRecords(data.length);
            setMinimum(minimumValue);
            setIsFilterChange(false);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Fetch bulk trade list ---
    const fetchBulkTradeList = async () => {
        if (!noOfTrades || parseInt(noOfTrades, 10) <= 0) {
            alert("Number of orders is required and must be positive");
            return;
        }

        try {
            setBulkLoading(true);
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            const result = await fetchBulkTradeListAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                noOfTrades,
            });

            setBulkTrades(result.data?.data || []);
        } catch (error) {
            console.error("Error fetching bulk trade list:", error);
        } finally {
            setBulkLoading(false);
        }
    };

    const onFilterApply = () => {
        if (!noOfTrades || parseInt(noOfTrades, 10) <= 0) {
            alert("Please enter a valid number of orders before applying filter.");
            return;
        }

        setIsFilterChange(true);
        setCurrentPage(0);

        const saveBulkSettings = async () => {
            try {
                const dataStored = JSON.parse(sessionStorage.getItem("data"));

                await saveBulkTradingSettingsAPI({
                    user_id: dataStored.user_id,
                    auth_key: dataStored.auth_key,
                    noOfTrades,
                });

                // Fetch bulk trade list after saving settings
                fetchBulkTradeList();
            } catch (err) {
                console.error("Error saving bulk trading settings:", err);
            }
        };

        saveBulkSettings();
    };

    // --- Effects ---
    useEffect(() => {
        fetchLogs();          // main logs
        fetchBulkTradeList(); // bulk trade list with default noOfTrades
    }, []);

    useEffect(() => { setTotalPages(Math.ceil(totalRecords / pageSize)); }, [totalRecords, pageSize]);

    useEffect(() => {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
        setCurrentPage(0);
    }, [debouncedSearchText]);

    useEffect(() => { !isFirstRender && fetchLogs(); }, [currentPage, pageSize]);
    useEffect(() => { isFilterChange && !isFirstRender && fetchLogs(); }, [isFilterChange]);

    return (
        <Paper sx={{ p: 1, borderRadius: 2 }}>

            {/* Search */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2.5, mx: 1 }}>
                {filterShow && isMobile &&
                    <>
                        <FilterBtn setFilterOpen={setFilterDrawer} />
                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                            isLoading={loading}
                        />
                    </>
                }
            </Box>

            {/* Bulk trade list input */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <TextField
                    type="number"
                    label="Number of Orders"
                    value={noOfTrades}
                    onChange={(e) => setNoOfTrades(e.target.value)}
                    size="small"
                    InputProps={{ inputProps: { min: 1 } }}
                />
            </Box>

            {/* Filter */}
            {filterShow &&
                isMobile ?
                <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                    <Box sx={{ width: 280, p: 2 }} role="presentation">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Filters</Typography>
                            <IconButton onClick={() => setFilterDrawer(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <TradeEditDeleteLogFilter
                            after_date_date={after_date}
                            before_date={before_date}
                            setbefore_date={setbefore_date}
                            setafter_date={setafter_date}
                            market={market}
                            script={script}
                            setScript={setScript}
                            setMarket={setMarket}
                            client={client}
                            master={master}
                            setClient={setClient}
                            setMaster={setMaster}
                            onApply={onFilterApply}
                        />
                    </Box>
                </Drawer>

                : <Box>
                    <TradeEditDeleteLogFilter
                        after_date_date={after_date}
                        before_date={before_date}
                        setbefore_date={setbefore_date}
                        setafter_date={setafter_date}
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        client={client}
                        master={master}
                        setClient={setClient}
                        setMaster={setMaster}
                        onApply={onFilterApply}
                    />
                </Box>
            }

            {filterShow && !isMobile &&
                <SearchPdfCsv
                    searchText={searchText}
                    setSearchText={setSearchText}
                    logs={logs}
                    colArr={colArr}
                    keyArr={keyArr}
                    isLoading={loading}
                />
            }

            {/* Main logs table */}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ maxHeight: '90vh', overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: '90vh' }}>
                            <Table stickyHeader size="small" sx={{ minWidth: 600 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Script Name</TableCell>
                                        {/* <TableCell>Trade type</TableCell> */}
                                        <TableCell>Start date&Time</TableCell>
                                        <TableCell>End Date&Time</TableCell>
                                        {/* <TableCell>Trades IDs</TableCell> */}
                                        <TableCell>No of Trades</TableCell>
                                        {/* <TableCell>Minimum</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>{log.script_name ?? '-'}</TableCell>
                                            {/* <TableCell sx={{ color: 'black' }}>{log.trade_type ?? '-'}</TableCell> */}
                                            <TableCell sx={{ color: 'black', textTransform: 'uppercase' }}>{log.start_datetime ?? '-'}</TableCell>
                                            <TableCell sx={{ color: 'black' }}>{log.end_datetime ?? '-'}</TableCell>
                                            {/* <TableCell sx={{ color: 'black' }}>{log.trade_ids?.join(', ') ?? '-'}</TableCell> */}
                                            <TableCell sx={{ color: 'black', fontWeight: 'bold', cursor: 'pointer' }}
                                                onClick={() => fetchTradeDetails(log)}>
                                                {log.no_of_trade ?? '-'}
                                            </TableCell>
                                            {/* <TableCell sx={{ color: 'black' }}>{minimum}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {logs.length === 0 && !loading && <Typography textAlign='center'>No Logs Found</Typography>}
                        </TableContainer>

                        {/* Trade dialog */}
                        <Dialog open={tradeDialogOpen} onClose={() => setTradeDialogOpen(false)} maxWidth="md" fullWidth>
                            <DialogTitle>Trades Details</DialogTitle>
                            <DialogContent>
                                {tradeLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : Array.isArray(orders) && orders.length > 0 ? (
                                    <table style={{ minWidth: "1850px", fontSize: "12px", margin: 0 }}>
                                        <thead>
                                            <tr>
                                                {["Device", "Time", ...(userType !== 1 ? ["Client"] : []), "Script", "B/S", "Order Type", "Qty (Lot)", "Order Price", "Status", "O. Time", "Comm Amt"].map((header) => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((log, i) => (
                                                <tr key={log.trd_id || i}>
                                                    <td dangerouslySetInnerHTML={{ __html: log.device_type_html }} />
                                                    <td>{log.trd_matchedtime}</td>
                                                    {userType !== 1 && <td>{log.client_full_name}</td>}
                                                    <td>{log.scrp_name}</td>
                                                    <td>{log.trd_type}</td>
                                                    <td>{log.trd_type2}</td>
                                                    {/* <td>{log.trd_qty} ({item.trd_lot})</td> */}
                                                    <td>{log.trd_qty}</td>
                                                    <td>{log.trd_rate}</td>
                                                    <td>{log.trd_status}</td>
                                                    <td>{log.trd_time}</td>
                                                    <td>{log.trd_comm_amnt}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <Typography>No trades found.</Typography>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setTradeDialogOpen(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                    />

                    <BackToTop />
                </>
            )}
        </Paper>
    );
};

export default Bulktrading;
