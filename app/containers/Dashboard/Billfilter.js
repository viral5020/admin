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
import { BillfilterAPI } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Summaryreportfilter from './summaryreportfilter';
import ValanFilter from './ValanFilter';

const Billfilter = () => {
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
    // const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');
    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');
    const [isAdminOnly, setIsAdminOnly] = useState(false);

    const [valanId, setValanId] = useState(null);
    const [amount, setAmount] = useState('');

    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const fetchLogs = async () => {
        try {
            // Validate valanId and amount
            if (!valanId || !amount) {
                console.warn("Select Valan and Amount");
                setIsFilterChange(false);
                setLogs([]);
                setTotalRecords(0);
                return;
            }

            setLoading(true);

            // const scriptIds = formatScriptIds?.(script);

            const response = await BillfilterAPI({
                currentPage,
                pageSize,
                valan_id: valanId?.id,
                amount: amount,
                start_date,
                end_date,
                market_type_id: market?.id || '',
                user_id: client?.id || '',
                broker_user_id: broker?.id || '',
                master_user_id: isAdminOnly ? master?.id : "",
                term: searchText,
                currentPage,
                // sSearch: searchText,
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
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    {/* Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>

                        <div>
                            <ValanFilter valanId={valanId} setValanId={setValanId} />
                        </div>
                        <div style={{ minWidth: '150px', marginLeft: '10px', marginBottom: '6px' }}>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>


                    <TradeEditDeleteLogFilter
                        end_date={end_date}
                        start_date={start_date}
                        setEnd_date={setEnd_date}
                        setStart_date={setStart_date}

                        market={market}
                        setMarket={setMarket}

                        client={client}
                        master={master}
                        broker={broker}
                        setClient={setClient}
                        setMaster={setMaster}
                        setBroker={setBroker}
                        onApply={onFilterApply}
                    />

                    {/* Search */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2.5, mx: 1, flexWrap: 'nowrap' }}>
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

                    {/* Validation message */}
                    {(!valanId || !amount) && (
                        <Typography textAlign="center" color="error" sx={{ mt: 2 }}>
                            Please select Valan and enter Amount
                        </Typography>
                    )}

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {/* Table */}
                            <TableContainer>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sr. No</TableCell>
                                            <TableCell>User Name</TableCell>
                                            <TableCell>Bill Amount</TableCell>
                                            <TableCell>Download</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((log, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{log?.sr_no ?? "-"}</TableCell>
                                                <TableCell>{log?.user_name ?? "-"}</TableCell>
                                                <TableCell><strong>{Number(log?.bill_amount ?? 0).toLocaleString()}</strong></TableCell>
                                                <TableCell>
                                                    {log.url && log.url.trim() !== '' && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => {
                                                                const BASE_URL = 'http://128.199.126.171/~goldorg/';
                                                                const authKey = dataStored?.auth_key;
                                                                const loginUserId = dataStored?.user_id;

                                                                const url = new URL(
                                                                    log.url.startsWith('http') ? log.url : `${BASE_URL}${log.url}`,
                                                                    BASE_URL
                                                                );

                                                                url.searchParams.set('is', '1');
                                                                url.searchParams.set('k', authKey);
                                                                url.searchParams.set('lui', loginUserId);

                                                                window.open(url.toString(), '_blank');
                                                            }}
                                                            sx={{ p: 0.5, minWidth: 'auto' }}
                                                        >
                                                            <PictureAsPdfIcon sx={{ color: theme.palette.text.secondary, fontSize: '1rem' }} />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
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
            ) : (
                <>
                    {/* Mobile header */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 1.5, mt: 0.5, mx: 1, flexWrap: 'nowrap' }}>
                        <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                            <Box sx={{ width: 280, p: 2 }} role="presentation">
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Filters</Typography>
                                    <IconButton onClick={() => setFilterDrawer(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>

                                <div style={{ display: 'flex-column', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <ValanFilter valanId={valanId} setValanId={setValanId} />
                                    </div>

                                    <div style={{ flex: 1, minWidth: '150px' }}>
                                        <input
                                            type="number"
                                            placeholder="Enter amount"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc'
                                            }}
                                        />
                                    </div>
                                </div>

                                <TradeEditDeleteLogFilter
                                    end_date={end_date}
                                    start_date={start_date}
                                    setEnd_date={setEnd_date}
                                    setStart_date={setStart_date}
                                    market={market}
                                    setMarket={setMarket}
                                    client={client}
                                    master={master}
                                    broker={broker}
                                    setClient={setClient}
                                    setMaster={setMaster}
                                    setBroker={setBroker}
                                    onApply={onFilterApply}
                                />
                            </Box>
                        </Drawer>

                        <FilterBtn setFilterOpen={setFilterDrawer} />

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

                    {/* Validation message */}
                    {(!valanId || !amount) && (
                        <Typography textAlign="center" color="error" sx={{ mt: 2 }}>
                            Please select Valan and enter Amount
                        </Typography>
                    )}

                    {loading && (isFilterChange || currentPage === 0) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {logs.map((log, index) => (
                                <Card key={index} sx={{
                                    mb: 0.5,
                                    mx: 0.5,
                                    borderRadius: 1,
                                    border: '1px solid transparent',
                                    backgroundImage: `linear-gradient(#fff, #fff), linear-gradient(to right, #2196f3, #21cbf3)`,
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'content-box, border-box',
                                    boxShadow: 'none',
                                }}>
                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.3 }}>
                                                    {log?.user_name ?? '-'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                                                    Amt: <strong>{Number(log?.bill_amount ?? 0).toLocaleString()}</strong>
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                                                    {log?.valan_name ?? '-'}
                                                </Typography>
                                                {log.url && log.url.trim() !== '' && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            const BASE_URL = 'http://128.199.126.171/~goldorg/';
                                                            const authKey = dataStored?.auth_key;
                                                            const loginUserId = dataStored?.user_id;

                                                            const url = new URL(
                                                                log.url.startsWith('http') ? log.url : `${BASE_URL}${log.url}`,
                                                                BASE_URL
                                                            );

                                                            url.searchParams.set('is', '1');
                                                            url.searchParams.set('k', authKey);
                                                            url.searchParams.set('lui', loginUserId);

                                                            window.open(url.toString(), '_blank');
                                                        }}
                                                        sx={{ p: 0.5, minWidth: 'auto' }}
                                                    >
                                                        <PictureAsPdfIcon sx={{ color: theme.palette.text.secondary, fontSize: '1rem' }} />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Load more */}
                            {logs.length < totalRecords && (
                                loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            size="small"
                                            disabled={!valanId || !amount} // disable until filled
                                        >
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

export default Billfilter;
