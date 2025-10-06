import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Button, Card, CircularProgress, InputAdornment, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography, useMediaQuery, useTheme, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Drawer
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import { useDispatch } from 'react-redux';
import axios from 'dan-vendor/axios';

import CloseIcon from '@mui/icons-material/Close';
import BackToTop from './helpers/BackToTop';
import Manualtradesfilter from './Utility/Manualtradesfilter';
import Pagination from './filters/Pagination';
import { manualtradesAPI } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';
import SocketContext from './Socket/SocketContext';
import SearchPdfCsv from "./filters/SearchPdfCsv";
import FilterBtn from './filters/FilterBtn';

const colArr = [
    "Action",
    "Client",
    "Script",
    "Type",
    "Qty",
    "Lot",
    "Rate",
    "Added By",
    "DateTime",
]

const keyArr = [
    "log_type",
    "user_full_name",
    "script_name",
    "trade_type",
    "trade_qty",
    "trade_lot",
    "trade_rate",
    "added_by",
    "added_datetime",
]

const Manualtrade = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);

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

    const [filterDrawer, setFilterDrawer] = useState(false);

    // Trade filters
    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');

    // Add trade states
    const [addMarket, setAddMarket] = useState('');
    const [addScript, setAddScript] = useState([]);
    const [addClient, setAddClient] = useState('');

    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');
    const [trade_date, setTrade_date] = useState('');

    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [isAdminOnly, setIsAdminOnly] = useState(false);

    const [lot, setLot] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [brokerage, setBrokerage] = useState('0');
    const [pair, setPair] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);
    const [totals, setTotals] = useState({ high: "-", low: "-", ltp: "-" });

    const rawData = sessionStorage.getItem("data");

    // 2. Initialize parsedData safely
    let parsedData = null;
    if (rawData) {
        try {
            parsedData = JSON.parse(rawData);
        } catch (error) {
            console.error("Failed to parse session data:", error);
        }
    }

    // 3. Extract user_type and deletePopup safely
    let userType = null;
    let deletePopup = 0; // default to 0 if not set

    if (parsedData) {
        // Convert user_type to integer if available
        if (parsedData.user_type !== undefined) {
            userType = parseInt(parsedData.user_type, 10);
            if (isNaN(userType)) {
                console.warn("user_type is not a valid number");
                userType = null;
            }
        }

        // Convert deletePopup to integer if available
        if (parsedData.deletePopup !== undefined) {
            deletePopup = parseInt(parsedData.deletePopup, 10);
            if (isNaN(deletePopup)) {
                console.warn("deletePopup is not a valid number");
                deletePopup = 0;
            }
        }
    }

    const items = [
        { label: "High", value: totals.high, key: "high", color: "#1976d2" },
        { label: "Low", value: totals.low, key: "low", color: "#2e7d32" },
        { label: "LTP", value: totals.ltp, key: "ltp", color: "#ed6c02" },
    ];

    // Socket subscription for selected script
    useEffect(() => {
        if (!socket || !addScript || addScript.length === 0) return;
        const selectedScript = Array.isArray(addScript) ? addScript[0]?.script_name : addScript?.script_name;
        if (!selectedScript) return;

        socket.emit("addMarketWatch", { product: selectedScript });

        const handleMarketWatch = (args) => {
            if (args?.data?.InstrumentIdentifier === selectedScript) {
                setTotals({
                    high: args.data.High,
                    low: args.data.Low,
                    ltp: args.data.LastTradePrice,
                });
            }
        };

        socket.on("marketWatch", handleMarketWatch);
        return () => socket.off("marketWatch", handleMarketWatch);
    }, [socket, addScript]);

    const fetchLogs = async () => {
        setLoading(true);
        const scriptIds = formatScriptIds(script);
        const result = await manualtradesAPI(
            currentPage, pageSize, searchText, market, scriptIds, master, client,
            end_date, start_date, is_deleted, is_updated, isAdminOnly
        );
        const data = result.aaData || [];
        setLogs(isMobile && !isFilterChange && currentPage > 0 ? prev => [...prev, ...data] : data);
        setTotalRecords(result.iTotalRecords || 0);
        setIsFilterChange(false);
        setLoading(false);
    };

    useEffect(() => { fetchLogs(); }, []);
    useEffect(() => { setTotalPages(Math.ceil(totalRecords / pageSize)); }, [pageSize, totalRecords]);
    useEffect(() => { if (!isFirstRender) setCurrentPage(0); }, [debouncedSearchText]);
    useEffect(() => { if (!isFirstRender) fetchLogs(); }, [currentPage, pageSize]);
    useEffect(() => { if (isFilterChange && !isFirstRender) fetchLogs(); }, [isFilterChange]);

    const handleSubmit = () => {
        setPendingPayload({ lot, quantity, price, brokerage, pair, trade_date, addMarket, addScript, addClient, searchText });
        setDialogOpen(true);
    };

    const confirmTrade = async () => {
        try {
            const passwordValue = userType === 4 ? document.getElementById("trade-password")?.value || "" : "";

            await confirmTradeManualAPI({
                user_id: parsedData?.user_id,
                auth_key: parsedData?.auth_key,
                password: passwordValue,
                trade_date,
                addMarket,
                addScript,
                lot,
                quantity,
                price,
                pair,
                addClient,
            });

            setDialogOpen(false);
            fetchLogs();
        } catch (error) {
            console.error(error);
            alert("Failed to submit trade.");
        }
    };

    const boxStyles = {
        borderRadius: 2,
        border: '2px solid',
        borderColor: pair === 'buy' ? '#2196f3' : pair === 'sell' ? '#f44336' : '#ccc',
        backgroundColor: pair === 'buy' ? '#e3f2fd' : pair === 'sell' ? '#ffebee' : '#f5f5f5',
        padding: 2,
        mb: 2,
    };

    const needsPassword = userType === 4 && deletePopup === 1;

    return (
        <>
            <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>



                {/* Desktop Filter */}
                {isMobile

                    ? <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                        <Box sx={{ width: 280, p: 2 }} role="presentation">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Filters</Typography>
                                <IconButton onClick={() => setFilterDrawer(false)}><CloseIcon /></IconButton>
                            </Box>
                            <Manualtradesfilter
                                trade_date={trade_date} settrade_date={setTrade_date}
                                market={addMarket} script={addScript} setScript={setAddScript} setMarket={setAddMarket}
                                client={addClient} setClient={setAddClient}
                                lot={lot} setLot={setLot}
                                quantity={quantity} setQuantity={setQuantity}
                                price={price} setPrice={setPrice}
                                pair={pair} setPair={setPair}
                                brokerage={brokerage} setBrokerage={setBrokerage}
                                onSubmit={() => { handleSubmit(); setFilterDrawer(false); }}
                            />
                        </Box>
                    </Drawer>

                    : <Box sx={boxStyles}>
                        <Manualtradesfilter
                            trade_date={trade_date} settrade_date={setTrade_date}
                            market={addMarket} script={addScript} setScript={setAddScript} setMarket={setAddMarket}
                            client={addClient} setClient={setAddClient}
                            lot={lot} setLot={setLot}
                            quantity={quantity} setQuantity={setQuantity}
                            price={price} setPrice={setPrice}
                            pair={pair} setPair={setPair}
                            brokerage={brokerage} setBrokerage={setBrokerage}
                            onSubmit={handleSubmit}
                        />
                    </Box>
                }

                {/* High/Low/LTP Cards */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    {items.map(item => (
                        <Card key={item.key} sx={{ flex: '1 1 100px', p: 1, textAlign: 'center', borderRadius: 2, backgroundColor: item.color + '22' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: item.color }}>{item.value}</Typography>
                        </Card>
                    ))}
                </Box>

                {/* Search */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {/* Filter icon on the left */}
                    {isMobile && (
                        <IconButton onClick={() => setFilterDrawer(true)}>
                            <FilterBtn />
                        </IconButton>
                    )}

                    {/* Search input */}
                    <SearchPdfCsv
                        searchText={searchText}
                        setSearchText={setSearchText}
                        logs={logs}
                        colArr={colArr}
                        keyArr={keyArr}

                    />
                </Box>

                {/* Logs Table */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : logs.length === 0 ? (
                    <Typography textAlign="center">No Logs Found</Typography>
                ) : (
                    <>
                        <TableContainer sx={{ maxHeight: '60vh' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Script</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Qty (Lot)</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Added By</TableCell>
                                        <TableCell>DateTime</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ color: log.log_type === 'BUY' ? 'green' : log.log_type === 'SELL' ? 'red' : 'black' }}>
                                                {log.log_type}
                                            </TableCell>
                                            <TableCell>{log.user_full_name ?? '-'}</TableCell>
                                            <TableCell>{log.script_name ?? '-'}</TableCell>
                                            <TableCell sx={{
                                                color: log.trade_type === 'Buy' ? 'green' : log.trade_type === 'Sell' ? 'red' : 'inherit',
                                                fontWeight: '600'
                                            }}>{log.trade_type ?? '-'}</TableCell>
                                            <TableCell><strong>{log.trade_qty ?? '-'}</strong> {log.trade_lot !== undefined && `(${Number(log.trade_lot).toFixed(2)})`}</TableCell>
                                            <TableCell><strong>{log.trade_rate ?? '-'}</strong></TableCell>
                                            <TableCell>{log.added_by ?? '-'}</TableCell>
                                            <TableCell>{log.added_datetime ?? '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} setPageSize={setPageSize} pageSize={pageSize} />
                    </>
                )}
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Trade</DialogTitle>
                <DialogContent>
                    <Typography>{userType === 4 ? "Enter password to confirm trade." : "Are you sure you want to submit this trade?"}</Typography>
                    {needsPassword && (<TextField id="trade-password" type="password" label="Password" fullWidth sx={{ mt: 2 }} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={confirmTrade}>Confirm</Button>
                </DialogActions>
            </Dialog>

            <BackToTop />
        </>
    );
};

export default Manualtrade;
