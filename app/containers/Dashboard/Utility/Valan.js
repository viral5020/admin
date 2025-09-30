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
import { editDeleteLogLogsAPI, tradeEditDeleteLogLogsAPI, tradeEditLoglistAPI, ValanLogsAPI } from '../API/API';
import BackToTop from '../helpers/BackToTop';
import Valanpagefilter from './Valanpagefilter';
import SearchPdfCsv from '../filters/SearchPdfCsv';


const colArr = [
    "Market",
    "Valan Name",
    "Start Date",
    "End Date",
    "Change",
]

const keyArr = [
    "market_type_name",
    "valan_name",
    "start_date",
    "end_date",
    "valan_status",
]

const Valan = () => {
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

    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');

    const [end1_date, setEnd1_date] = useState('');
    const [start1_date, setStart1_date] = useState('');

    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [isAdminOnly, setIsAdminOnly] = useState(false);

    const [valanId, setValanId] = useState(null);

    const fetchLogs = async () => {
        setLoading(true);

        const result = await ValanLogsAPI(
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

        // ✅ sort latest first (by start_date or valan_id)
        data = data.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

        // ✅ paginate manually if API does not support it
        const start = currentPage * pageSize;
        const paginatedData = data.slice(start, start + pageSize);

        isMobile
            ? isFilterChange || currentPage === 0
                ? setLogs(paginatedData)
                : setLogs(prev => [...prev, ...paginatedData])
            : setLogs(paginatedData);

        setTotalRecords(data.length); // total count for pagination UI
        setIsFilterChange(false);

        setLoading(false);
    };

    useEffect(() => {
        if (!isFirstRender) {
            setCurrentPage(0);  // reset page
            fetchLogs();         // fetch logs with debounced search
        }
    }, [debouncedSearchText]);

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
                    <Valanpagefilter
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
                                '&::-webkit-scrollbar': { height: 6, width: 6 },
                                '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: 4 },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4 },
                                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                            }}
                        >
                            <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Market</TableCell>
                                        <TableCell>Valan Name</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Change</TableCell>
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
                                            <TableCell>{row.valan_name ?? '-'}</TableCell>
                                            <TableCell>{row.start_date ?? '-'}</TableCell>
                                            <TableCell>{row.end_date ?? '-'}</TableCell>
                                            <TableCell>
                                                <Typography
                                                    sx={{ fontWeight: 600, color: row.valan_status === "Open" ? "green" : "red" }}
                                                >
                                                    {row.valan_status ?? "-"}
                                                </Typography>
                                            </TableCell>

                                        </TableRow>
                                    ))}
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

                </Paper>
            ) : (<>
                {/** Header */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
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
                            <Valanpagefilter
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
                                        borderRadius: 2,
                                        border: "1px solid transparent",
                                        backgroundImage: (theme) =>
                                            `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"
                                            }), ${borderGradient}`,
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
                                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                                        {/* First Row: Market & Valan */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                {log.market_type_name ?? "-"}
                                            </Typography>
                                            <Typography variant="body2">{log.valan_name ?? "-"}</Typography>
                                        </Box>

                                        {/* Second Row: Dates */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                                            <Typography variant="caption">Start: {log.start_date ?? "-"}</Typography>
                                            <Typography variant="caption">End: {log.end_date ?? "-"}</Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: log.valan_status === "Open" ? "green" : "red",
                                                }}
                                            >
                                                {log.valan_status ?? "-"}
                                            </Typography>
                                        </Box>
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



export default Valan