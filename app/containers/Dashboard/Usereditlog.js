import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Button, CircularProgress, InputAdornment, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography, useMediaQuery, useTheme,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Drawer,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from './filters/Pagination';
import { fetchBasicLogAPI, fetchBrokerageLogAPI, fetchMarketLogAPI, tradeEditLoglistAPI } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import BackToTop from './helpers/BackToTop';
import FilterBtn from './filters/FilterBtn';
import SearchPdfCsv from "./filters/SearchPdfCsv";

const colArr = [
    "Username",
    "IP Address",
    "Log Time",
]

const keyArr = [
    "username",
    "ip_address",
    "log_time",
]


const Usereditlog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);
    const isFirstRender = useIsFirstRender();

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filters
    const [filterDrawer, setFilterDrawer] = useState(false);
    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');
    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [isAdminOnly, setIsAdminOnly] = useState(false);

    // Dialog states
    const [openBasic, setOpenBasic] = useState(false);
    const [openBrokerage, setOpenBrokerage] = useState(false);
    const [openMarket, setOpenMarket] = useState(false);

    const [selectedLog, setSelectedLog] = useState(null);
    const [basicDetails, setBasicDetails] = useState(null);
    const [brokerageDetails, setBrokerageDetails] = useState(null);
    const [marketDetails, setMarketDetails] = useState(null);

    // Loading states for dialogs
    const [basicLoading, setBasicLoading] = useState(false);
    const [brokerageLoading, setBrokerageLoading] = useState(false);
    const [marketLoading, setMarketLoading] = useState(false);


    // Fetch Logs
    const fetchLogs = async () => {
        setLoading(true);
        const result = await tradeEditLoglistAPI(
            currentPage, pageSize, searchText, master, client, end_date, start_date, isAdminOnly
        );
        const data = result.aaData || [];
        setLogs(data);
        setTotalRecords(result.iTotalRecords || 0);
        setIsFilterChange(false);
        setLoading(false);
    };

    // Button click handlers
    const handleBasicClick = async (log) => {
        setSelectedLog(log);
        setOpenBasic(true);
        setBasicLoading(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));
            const data = await fetchBasicLogAPI({
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                user_id: log.user_id,
                log_datetime: log.log_time
            });
            setBasicDetails(data);
        } catch {
            toast.error("Failed to fetch basic details");
        } finally {
            setBasicLoading(false);
        }
    };

    // Brokerage details
    const handleBrokerageClick = async (log) => {
        setSelectedLog(log);
        setOpenBrokerage(true);
        setBrokerageLoading(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));
            const data = await fetchBrokerageLogAPI({
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                user_id: log.user_id,
                log_datetime: log.log_time
            });
            setBrokerageDetails(data);
        } catch {
            toast.error("Failed to fetch brokerage details");
        } finally {
            setBrokerageLoading(false);
        }
    };

    // Market details
    const handleMarketClick = async (log) => {
        setSelectedLog(log);
        setOpenMarket(true);
        setMarketLoading(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));
            const data = await fetchMarketLogAPI({
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                user_id: log.user_id,
                log_datetime: log.log_time
            });
            setMarketDetails(data);
        } catch {
            toast.error("Failed to fetch market details");
        } finally {
            setMarketLoading(false);
        }
    };

    // Close handlers
    const handleCloseBasic = () => {
        setOpenBasic(false);
        setBasicDetails(null);
        setSelectedLog(null);
    };
    const handleCloseBrokerage = () => {
        setOpenBrokerage(false);
        setBrokerageDetails(null);
        setSelectedLog(null);
    };
    const handleCloseMarket = () => {
        setOpenMarket(false);
        setMarketDetails(null);
        setSelectedLog(null);
    };

    const handleConfirm = () => {
        handleCloseBasic();
        handleCloseBrokerage();
        handleCloseMarket();
    };

    const toggleDrawer = (open) => () => setFilterDrawer(open);

    const onFilterApply = () => {
        setIsFilterChange(true);
        setCurrentPage(0);
        toggleDrawer(false)();
    };

    useEffect(() => { fetchLogs(); }, []);
    useEffect(() => { setTotalPages(Math.ceil(totalRecords / pageSize)); }, [pageSize, totalRecords]);
    useEffect(() => { !isFirstRender && setIsFilterChange(true); setCurrentPage(0); }, [debouncedSearchText]);
    useEffect(() => { !isFirstRender && fetchLogs(); }, [currentPage, pageSize]);
    useEffect(() => { isFilterChange && !isFirstRender && fetchLogs(); }, [isFilterChange]);

    return (
        <>
            <Paper sx={{ p: 1, borderRadius: 2 }}>

                {isMobile ?
                    <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                        <Box sx={{ width: 280, p: 2 }} role="presentation">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Filters</Typography>
                                <IconButton onClick={() => setFilterDrawer(false)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            <TradeEditDeleteLogFilter
                                end_date={end_date}
                                start_date={start_date}
                                setEnd_date={setEnd_date}
                                setStart_date={setStart_date}
                                client={client}
                                master={master}
                                setClient={setClient}
                                setMaster={setMaster}
                                onApply={onFilterApply}
                            />
                        </Box>
                    </Drawer>

                    : <TradeEditDeleteLogFilter
                        end_date={end_date}
                        start_date={start_date}
                        setEnd_date={setEnd_date}
                        setStart_date={setStart_date}
                        client={client}
                        master={master}
                        setClient={setClient}
                        setMaster={setMaster}
                        onApply={onFilterApply}
                    />
                }
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2.5, mx: 1 }}>
                    {isMobile && <FilterBtn setFilterOpen={setFilterDrawer} />}
                    <SearchPdfCsv
                        searchText={searchText}
                        setSearchText={setSearchText}
                        logs={logs}
                        colArr={colArr}
                        keyArr={keyArr}

                    />
                </Box>


                {logs.length === 0 && !loading && <Typography textAlign='center'>No Logs Found</Typography>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        <TableContainer sx={{ minWidth: '1100px' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {/* <TableCell>User ID</TableCell> */}
                                        <TableCell>Username</TableCell>
                                        <TableCell>Parent</TableCell>
                                        <TableCell>IP Address</TableCell>
                                        <TableCell>Log Time</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            {/* <TableCell>{log?.user_id ?? "-"}</TableCell> */}
                                            <TableCell>{log?.username_full_dis ?? "-"}</TableCell>
                                            <TableCell>{log?.parent_full_name_dis ?? "-"}</TableCell>
                                            <TableCell>{log?.ip_address ?? "-"}</TableCell>
                                            <TableCell>{log?.log_time ?? "-"}</TableCell>
                                            <TableCell>
                                                <Button size="small" variant="contained" onClick={() => handleBasicClick(log)} sx={{ borderRadius: 1, mr: 1 }}>Basic</Button>
                                                <Button size="small" variant="contained" color="secondary" onClick={() => handleBrokerageClick(log)} sx={{ borderRadius: 1, mr: 1 }}>Brokerage</Button>
                                                <Button size="small" variant="contained" color="success" onClick={() => handleMarketClick(log)} sx={{ borderRadius: 1 }}>Market</Button>
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
                    </Box>
                )}

                {/* Basic Dialog */}
                <Dialog open={openBasic} onClose={handleCloseBasic} maxWidth="lg" fullWidth>
                    <DialogTitle>Basic Edit for {selectedLog?.username}</DialogTitle>
                    <DialogContent dividers>
                        {basicLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : basicDetails ? (
                            <TableContainer sx={{ minWidth: '1800px' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Log Type</TableCell>
                                            <TableCell>Level</TableCell>
                                            <TableCell>Alert %</TableCell>
                                            <TableCell>MTM Limit</TableCell>
                                            <TableCell>Broker</TableCell>
                                            <TableCell>High/Low</TableCell>
                                            <TableCell>Auto Square</TableCell>
                                            <TableCell>Intraday</TableCell>
                                            <TableCell>Square Off</TableCell>
                                            <TableCell>NSE</TableCell>
                                            <TableCell>MCX</TableCell>
                                            <TableCell>NSE Script Limit</TableCell>
                                            <TableCell>MCX Script Limit</TableCell>
                                            <TableCell>NSE Margin</TableCell>
                                            <TableCell>MCX Margin</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {basicDetails.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.log_type ?? '-'}</TableCell>
                                                <TableCell>{item.level_names_label ?? '-'}</TableCell>
                                                <TableCell>{item.alert_percnetage ?? '-'}</TableCell>
                                                <TableCell>{item.mtm_limit ?? '-'}</TableCell>
                                                <TableCell>{item.my_percentage ?? '-'}</TableCell>
                                                <TableCell>{item.check_high_low ?? '-'}</TableCell>
                                                <TableCell>{item.apply_auto_sqaure ?? '-'}</TableCell>
                                                <TableCell>{item.intraday_auto_sqaure ?? '-'}</TableCell>
                                                <TableCell>{item.only_position_squareoff ?? '-'}</TableCell>
                                                <TableCell>{item.nseFirstSell ?? '-'} / {item.nseUnmatched ?? '-'}</TableCell>
                                                <TableCell>{item.mcxFirstSell ?? '-'} / {item.mcxUnmatched ?? '-'}</TableCell>
                                                <TableCell>{item.nsescriptLimit ?? '-'}</TableCell>
                                                <TableCell>{item.mcxscriptLimit ?? '-'}</TableCell>
                                                <TableCell>{item.nse_margin_limit ?? '-'}</TableCell>
                                                <TableCell>{item.mcx_margin_limit ?? '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>No Data Found</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseBasic}>Close</Button>
                        {/* <Button onClick={handleConfirm} variant="contained">Confirm</Button> */}
                    </DialogActions>
                </Dialog>

                {/* Brokerage Dialog */}
                <Dialog open={openBrokerage} onClose={handleCloseBrokerage} maxWidth="lg" fullWidth>
                    <DialogTitle>Brokerage Edit for {selectedLog?.username}</DialogTitle>
                    <DialogContent dividers>
                        {brokerageLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : brokerageDetails && brokerageDetails.length > 0 ? (
                            <TableContainer sx={{ minWidth: '1800px' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Log Type</TableCell>
                                            <TableCell>Log Date/Time</TableCell>
                                            <TableCell>Market Type</TableCell>
                                            <TableCell>Commission Type</TableCell>
                                            <TableCell>Fix/Percentage</TableCell>
                                            <TableCell>Script</TableCell>
                                            <TableCell>User Delivery Comm</TableCell>
                                            <TableCell>User Intraday Comm</TableCell>
                                            <TableCell>Broker Delivery Comm</TableCell>
                                            <TableCell>Broker Intraday Comm</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {brokerageDetails.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.log_type}</TableCell>
                                                <TableCell>{item.log_datetime}</TableCell>
                                                <TableCell>{item.market_type_name}</TableCell>
                                                <TableCell>{item.commission_type}</TableCell>
                                                <TableCell>{item.commission_fix_percentage}</TableCell>
                                                <TableCell>{item.script_name}</TableCell>
                                                <TableCell>{item.user_delivery_commision}</TableCell>
                                                <TableCell>{item.user_intraday_commission}</TableCell>
                                                <TableCell>{item.broker_delivery_commission}</TableCell>
                                                <TableCell>{item.broker_intraday_commission}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>No Data Found</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseBrokerage}>Close</Button>
                        {/* <Button onClick={handleConfirm} variant="contained">Confirm</Button> */}
                    </DialogActions>
                </Dialog>

                {/* Market Dialog */}
                <Dialog open={openMarket} onClose={handleCloseMarket} maxWidth="lg" fullWidth>
                    <DialogTitle>Market Edit for {selectedLog?.username}</DialogTitle>
                    <DialogContent dividers>
                        {marketLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : marketDetails && marketDetails.length > 0 ? (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Log Type</TableCell>
                                            <TableCell>Log Date/Time</TableCell>
                                            <TableCell>Markets</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {marketDetails.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.log_type}</TableCell>
                                                <TableCell>{item.log_datetime}</TableCell>
                                                <TableCell>{item.market_name_list_label}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography>No Data Found</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMarket}>Close</Button>
                        {/* <Button onClick={handleConfirm} variant="contained">Confirm</Button> */}
                    </DialogActions>
                </Dialog>
            </Paper>

            <BackToTop />
        </>
    );
};

export default Usereditlog;
