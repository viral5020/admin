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
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from './filters/Pagination';
import FilterBtn from './filters/FilterBtn';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import BackToTop from './helpers/BackToTop';
import { tradeAutosquareofAPI, tradeEditDeleteLogLogsAPI } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';



const Autosquareuplog = ({
    filterShow = true,
    setfilterShow = () => { } // default no-op function
}) => {
    console.log("filterShow=", filterShow);
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
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');

    const [end_date, setEnd_date] = useState('');
    const [start_date, setStart_date] = useState('');

    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [isAdminOnly, setIsAdminOnly] = useState(false);


    const fetchLogs = async () => {
        try {
            setLoading(true);

            const scriptIds = formatScriptIds?.(script);

            const result = await tradeAutosquareofAPI(
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

            // Guard shape
            const data = Array.isArray(result?.aaData) ? result.aaData : [];

            if (isMobile) {
                if (isFilterChange || currentPage === 0) {
                    setLogs(data);
                } else {
                    setLogs(prev => [...prev, ...data]);
                }
            } else {
                setLogs(data);
            }

            setTotalRecords(Number(result?.iTotalRecords) || 0);
            setIsFilterChange(false);
        } catch (err) {
            console.error("Failed to fetch logs:", err);
            setLogs([]);            // keep UI stable
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
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
                    {filterShow && (
                        <Box>
                            <TradeEditDeleteLogFilter
                                end_date={end_date}
                                start_date={start_date}
                                setEnd_date={setEnd_date}
                                setStart_date={setStart_date}
                                onApply={onFilterApply}
                            />
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2.5,
                            mx: 1,
                            flexWrap: 'nowrap', // ensures everything stays on one line
                        }}
                    >

                        <TextField
                            variant="outlined"
                            placeholder="Search logs..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                            sx={{ flex: 1, minWidth: 200 }} // takes all available space
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ position: 'relative', top: '-5px' }}>
                                        <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {logs.length === 0 && !loading && (
                        <Typography textAlign='center'>No Logs Found</Typography>
                    )}
                    {/** Keep everything here as-is including search bar, table, and pagination */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (<>
                        <TableContainer>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Client</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Date / Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{log?.client_full_name ?? "-"}</TableCell>
                                            <TableCell>
                                                <strong>{log?.amount?.toLocaleString() ?? "0"}</strong>
                                            </TableCell>
                                            <TableCell>{log?.datetime ?? "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
                        gap: 2,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                        mt: 0.5,
                        mx: 1,
                        flexWrap: 'nowrap', // ensures everything stays on one line
                    }}
                >
                    {filterShow && (
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
                                    onApply={onFilterApply}
                                />
                            </Box>
                        </Drawer>
                    )}
                    <FilterBtn setFilterOpen={setFilterDrawer} />

                    <TextField
                        variant="outlined"
                        placeholder="Search logs..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="small"
                        sx={{ flex: 1, minWidth: 200 }} // takes all available space
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ position: 'relative', top: '-5px' }}>
                                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                                </InputAdornment>
                            ),
                        }}
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
                        {logs.map((log, index) => (
                            <Card
                                key={index}
                                sx={{
                                    mb: 0.5,
                                    mx: 0.5,
                                    borderRadius: 1,
                                    border: "1px solid transparent", // important
                                    backgroundImage: `
      linear-gradient(#fff, #fff), 
      linear-gradient(to right, #2196f3, #21cbf3)
    `,
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "content-box, border-box",
                                    boxShadow: "none",
                                }}
                            >
                                <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                                    {/* Client name */}
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.3 }}
                                    >
                                        {log?.client_full_name ?? "-"}
                                    </Typography>

                                    {/* Amount + Date side by side */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: "0.75rem", lineHeight: 1.2 }}
                                        >
                                            Amt: <strong>{log?.amount?.toLocaleString() ?? "0"}</strong>
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                                        >
                                            {log?.datetime ?? "-"}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>


                        ))}


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

export default Autosquareuplog