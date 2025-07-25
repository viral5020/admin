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
    useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const EditDeleteLogs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);

    const totalPages = Math.ceil(totalRecords / pageSize);

    const fetchLogs = async (search = '', page = currentPage, append = false) => {
        setLoading(true);
        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/datatables/trade_log_view.php',
                {
                    is_app: '1',
                    login_user_id: '41297',
                    auth_key: 'IGKBp4OuFS',
                    sEcho: 1,
                    iDisplayStart: page * pageSize,
                    iDisplayLength: pageSize,
                    sSearch: search,
                }
            );

            const newData = response.data.aaData || [];

            setLogs(prevLogs => append ? [...prevLogs, ...newData] : newData);
            setTotalRecords(response.data.iTotalRecords || 0);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchLogs(searchText);
    }, [currentPage, pageSize]);

    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(0);
            fetchLogs(searchText);
        }, 500);

        return () => clearTimeout(delay);
    }, [searchText]);

    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    {/** 💻 Desktop View */}
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
                            select
                            label="Rows per page"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                            size="small"
                            sx={{ width: 150, flexShrink: 0 }}
                        >
                            {[10, 25, 50].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

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
                        <TableContainer
                            sx={{
                                maxHeight: '70vh',
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    height: 6, // horizontal scrollbar height
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
                                        <TableCell>Log</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Script</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Lot</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Rate</TableCell>
                                        <TableCell>Added By</TableCell>
                                        <TableCell>DateTime</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ fontWeight: 700, color: log.log_type === 'DEL' ? 'error.main' : 'success.main' }}>
                                                {log.log_type}
                                            </TableCell>
                                            <TableCell>{log.user_full_name}</TableCell>
                                            <TableCell>{log.script_name}</TableCell>
                                            <TableCell>{log.trade_type}</TableCell>
                                            <TableCell>{log.trade_lot}</TableCell>
                                            <TableCell>{log.trade_qty}</TableCell>
                                            <TableCell>{log.trade_rate}</TableCell>
                                            <TableCell>{log.added_by}</TableCell>
                                            <TableCell>{log.added_datetime}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        {/* Pagination Controls */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                pt: 2,
                                flexWrap: 'wrap',
                                gap: 2,
                            }}
                        >
                            {/* Page Numbers */}
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                <Button
                                    size="small"
                                    disabled={currentPage === 0}
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                    color="secondary"
                                    sx={{ mr: 1 }}
                                >
                                    Prev
                                </Button>

                                {[...Array(totalPages)].map((_, i) => {
                                    if (
                                        i === 0 ||
                                        i === totalPages - 1 ||
                                        (i >= currentPage - 1 && i <= currentPage + 1)
                                    ) {
                                        return (
                                            <Button
                                                key={i}
                                                size="small"
                                                variant={i === currentPage ? 'contained' : 'outlined'}
                                                color="secondary"
                                                onClick={() => setCurrentPage(i)}
                                                sx={{ mx: 0.3, minWidth: '30px' }}
                                            >
                                                {i + 1}
                                            </Button>
                                        );
                                    }
                                    if (
                                        (i === 1 && currentPage > 2) ||
                                        (i === totalPages - 2 && currentPage < totalPages - 3)
                                    ) {
                                        return (
                                            <Typography key={i} sx={{ mx: 0.5 }}>
                                                ...
                                            </Typography>
                                        );
                                    }
                                    return null;
                                })}

                                <Button
                                    size="small"
                                    disabled={currentPage + 1 >= totalPages}
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                    color="secondary"
                                    sx={{ ml: 1 }}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    logs.map((log, index) => {
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
                    })
                )}

                {/* LOAD MORE */}
                {logs.length < totalRecords && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                const nextPage = currentPage + 1;
                                setCurrentPage(nextPage);
                                fetchLogs(searchText, nextPage, true);
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    </Box>
                )}
            </>
            )}
        </>
    );
};

export default EditDeleteLogs;

{/**

            "trade_id": "31502628",
           > "log_type": "DEL",
           > "user_full_name": "DEMO DEV 3 (949391)",
           > "script_name": "NIFTY 31JUL2025",
           > "trade_type": "Sell",
           > "trade_lot": "1",
           > "trade_qty": "75",
           > "trade_rate": "25000",
           >  "added_datetime": "2025-07-23 01:06:01"
           "added_by": "Auto",


             
          > "type": "INS",
          > "datetime": "2025-07-24 09:24:00",
          >  "full_name": "DEMO DEV 3 (949391) / Demo master nnn",
        > "script_name": "NASDAQ 19SEP2025",
        >    "trade_type": "Buy",
         >   "trade_lot": "1.000",
          >  "trade_qty": "70",
          >  "trade_rate": "23,383.25",
            "log_message": "Invalid Server Time"
        },

*/}
