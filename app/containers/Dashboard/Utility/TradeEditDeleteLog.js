import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    InputAdornment,
    MenuItem,
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
    useTheme, Grid,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Drawer,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TradeEditDeleteLogFilter from './TradeEditDeleteLogFilter';
import FilterBtn from '../filters/FilterBtn';
import { formatScriptIds } from '../helpers/utilFunc';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from '../filters/Pagination';
import { editDeleteLogLogsAPI, tradeEditDeleteLogLogsAPI, tradeEditLoglistAPI } from '../API/API';
import BackToTop from '../helpers/BackToTop';
import SearchPdfCsv from '../filters/SearchPdfCsv';

const colArr = [
    "Action",
    "Client",
    "Script",
    "Type",
    "Qty",
    "lot",
    "Rate",
    "Added By",
    "DateTime"
]

const keyArr = [
    "log_type",
    "user_full_name",
    "script_name",
    "trade_type",
    "trade_qty",
    { isDesimal: true, name: "trade_lot" },
    { isDesimal: true, name: "trade_rate" },
    "added_by",
    "added_datetime",
];

const TradeEditDeleteLog = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);
    const isFirstRender = useIsFirstRender();

    // # Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filterDrawer, setFilterDrawer] = useState(false);

    const [market, setMarket] = useState('');
    const [script, setScript] = useState('');
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');

    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');

    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [isAdminOnly, setIsAdminOnly] = useState(false);


    const fetchLogs = async () => {
        setLoading(true);
        const scriptIds = formatScriptIds(script);
        const result = await editDeleteLogLogsAPI(
            currentPage,
            pageSize,
            searchText,
            market,
            scriptIds,
            master,
            client,
            end_date,
            start_date,
            is_deleted,
            is_updated,
            isAdminOnly,
        );

        const data = result.aaData || [];

        isMobile
            ? isFilterChange || currentPage === 0
                ? setLogs(data || [])
                : setLogs(prev => [...prev, ...data])
            : setLogs(data || []);

        setTotalRecords(result.iTotalRecords || 0);
        setIsFilterChange(false);

        setLoading(false);
    };

    const toggleDrawer = (open) => () => setFilterDrawer(open);

    function onFilterApply() {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
        setCurrentPage(0);
        toggleDrawer(false)();
    }

    useEffect(() => {
        console.log('logs.length', logs.length);
    }, [logs])

    // # pagination useEffects
    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [pageSize, totalRecords])

    useEffect(() => {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
        setCurrentPage(0);
    }, [debouncedSearchText]);

    useEffect(() => {
        !isFirstRender && fetchLogs();
    }, [currentPage, pageSize]);

    useEffect(() => {
        isFilterChange && !isFirstRender && fetchLogs();
    }, [isFilterChange])


    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <TradeEditDeleteLogFilter
                        end_date={end_date}
                        start_date={start_date}
                        setEnd_date={setEnd_date}
                        setStart_date={setStart_date}
                        is_deleted={is_deleted}
                        is_updated={is_updated}
                        setIs_deleted={setIs_deleted}
                        setIs_updated={setIs_updated}
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        client={client}
                        master={master}
                        setClient={setClient}
                        setMaster={setMaster}
                        isAdminOnly={isAdminOnly}
                        setIsAdminOnly={setIsAdminOnly}
                        onApply={onFilterApply}
                    />

                    <SearchPdfCsv
                        searchText={searchText}
                        setSearchText={setSearchText}
                        logs={logs}
                        colArr={colArr}
                        keyArr={keyArr}
                    />


                    {/** Keep everything here as-is including search bar, table, and pagination */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (<>
                        <TableContainer
                            sx={{
                                maxHeight: '70vh',
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    height: 6, // horizontal scrollbar height
                                    width: 6,  // vertical scrollbar width
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: '#f1f1f1',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: '#888',
                                    borderRadius: 4,
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    backgroundColor: '#555',
                                },
                            }}
                        >

                            <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
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
                                    {logs.map((log, i) => {
                                        const isBuy = log.log_type === 'BUY';
                                        const isSell = log.log_type === 'SELL';

                                        // Safe check for script_name
                                        const scriptName = log?.script_name || '';
                                        const [highlightName, ...rest] = scriptName.split(' ');
                                        const remainingScriptName = rest.join(' ');

                                        return (
                                            <TableRow
                                                key={i}
                                                sx={{
                                                    backgroundColor: i % 2 === 0
                                                        ? theme.palette.mode === "dark"
                                                            ? "#333"   // even rows (dark mode)
                                                            : "#fff"   // even rows (light mode)
                                                        : theme.palette.mode === "dark"
                                                            ? "#222"   // odd rows (dark mode)
                                                            : "#e0e0e0", // odd rows (light mode)
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.mode === "dark" ? "#444" : "#f5f5f5", // hover effect
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{ color: 'black' }}>
                                                    <span style={{ color: isBuy ? 'green' : isSell ? 'red' : 'black' }}>
                                                        {log.log_type}
                                                    </span>
                                                </TableCell>

                                                <TableCell>{log.user_full_name ?? '-'}</TableCell>

                                                <TableCell>
                                                    {scriptName ? (
                                                        <>
                                                            <span style={{ fontWeight: 'bold' }}>{highlightName}</span>
                                                            {remainingScriptName && ` ${remainingScriptName}`}
                                                        </>
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        color:
                                                            log.trade_type === 'Buy'
                                                                ? 'green'
                                                                : log.trade_type === 'Sell'
                                                                    ? 'red'
                                                                    : 'inherit',
                                                        fontWeight: '600',
                                                        textTransform: 'uppercase'
                                                    }}
                                                >
                                                    {log.trade_type ?? '-'}
                                                </TableCell>

                                                <TableCell>
                                                    <strong>{log.trade_qty ?? '-'}</strong>{' '}
                                                    {log.trade_lot !== undefined && `(${Number(log.trade_lot).toFixed(2)})`}
                                                </TableCell>

                                                <TableCell>
                                                    <strong>{log.trade_rate ?? '-'}</strong>
                                                </TableCell>

                                                <TableCell>{log.added_by ?? '-'}</TableCell>
                                                <TableCell>{log.added_datetime ?? '-'}</TableCell>
                                            </TableRow>

                                        );
                                    })}
                                </TableBody>

                            </Table>
                            {logs.length === 0 && !loading && (
                                <Typography textAlign='center'>No Logs Found</Typography>
                            )}
                        </TableContainer>


                        {/* Pagination Controls */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                        />
                    </>)}
                    {/* ...your full content */}
                </Paper>
            ) : (<>
                {/** Header */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        mt: 0.5,
                        mx: 1,
                        flexWrap: 'nowrap', // ensures everything stays on one line
                    }}
                >
                    <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                        <Box sx={{ width: 280, p: 2 }} role="presentation">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Filters</Typography>
                                <IconButton onClick={() => setFilterDrawer(false)}><CloseIcon /></IconButton>
                            </Box>
                            <TradeEditDeleteLogFilter
                                end_date={end_date}
                                start_date={start_date}
                                setEnd_date={setEnd_date}
                                setStart_date={setStart_date}
                                is_deleted={is_deleted}
                                is_updated={is_updated}
                                setIs_deleted={setIs_deleted}
                                setIs_updated={setIs_updated}
                                market={market}
                                script={script}
                                setScript={setScript}
                                setMarket={setMarket}
                                client={client}
                                master={master}
                                setClient={setClient}
                                setMaster={setMaster}
                                isAdminOnly={isAdminOnly}
                                setIsAdminOnly={setIsAdminOnly}
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

                {logs.length === 0 && !loading && (
                    <Typography textAlign='center'>No Logs Found</Typography>
                )}

                {loading && (isFilterChange || currentPage === 0) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {logs.map((log, index) => {
                            const isBuy = log.trade_type?.toLowerCase() === "buy";
                            const isSell = log.trade_type?.toLowerCase() === "sell";

                            const borderGradient = isBuy
                                ? "linear-gradient(to right, #2196f3, #21cbf3)"
                                : isSell
                                    ? "linear-gradient(to right, #f44336, #ff7961)"
                                    : "#ccc";

                            const boxShadowColor = isBuy
                                ? "rgba(33, 150, 243, 0.3)"
                                : isSell
                                    ? "rgba(244, 67, 54, 0.3)"
                                    : "rgba(0,0,0,0.1)";


                            return (
                                <Card
                                    key={index}
                                    sx={{
                                        mb: 1,
                                        mx: 1,
                                        // px: 1,
                                        borderRadius: 2,
                                        border: "1px solid transparent",
                                        backgroundImage: (theme) =>
                                            `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"}), ${borderGradient}`,
                                        backgroundOrigin: "border-box",
                                        backgroundClip: "content-box, border-box",
                                        boxShadow: `0 4px 12px ${boxShadowColor}`,
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.02)",
                                            boxShadow: `0 8px 20px ${boxShadowColor}`,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {log.trade_rate} &nbsp;
                                                {log.trade_qty} Qty&nbsp;
                                                <span style={{ fontWeight: 400 }}>{log.trade_lot} Lot</span>
                                            </Typography>
                                            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                                                {log.added_datetime}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: isSell
                                                        ? "#f44336"
                                                        : isBuy
                                                            ? "#2196f3"
                                                            : "inherit",
                                                }}
                                            >
                                                {log.trade_type}
                                                <span style={{ fontWeight: 400, marginLeft: 4 }}>({log.log_type})</span>
                                            </Typography>
                                            <Typography variant="body2">{log.user_full_name}</Typography>
                                        </Box>

                                        {/* <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#d32f2f",
                                        }}
                                    >
                                        {log.log_message}
                                        AAAAAAAAA
                                    </Typography> */}
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {/* LOAD MORE */}
                        {logs.length < totalRecords && (
                            loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : (
                                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                    <Button variant="outlined" onClick={() => setCurrentPage(prev => prev + 1)} size="small">
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

export default TradeEditDeleteLog;
