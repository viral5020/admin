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
import { useIsFirstRender } from '@uidotdev/usehooks';


const EditDeleteLogs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isFirstRender = useIsFirstRender();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [userLevels, setUserLevels] = useState([]);
    const [selectedUserLevel, setSelectedUserLevel] = useState('');

    const totalPages = Math.ceil(totalRecords / pageSize);

    const fetchLogs = async (search = '', append = false) => {
        setLoading(true);
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/datatables/script_qty_list',
                {
                    is_app: '1',
                     login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
                    sEcho: 1,
                    iDisplayStart: currentPage * pageSize,
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
        !isMobile ? fetchLogs(searchText) : fetchLogs(searchText, true);
    }, [currentPage, pageSize]);


    useEffect(() => {
        const fetchUserLevels = async () => {
             const dataStored = JSON.parse(sessionStorage.getItem("data"));
            try {
                const res = await axios.post('http://128.199.126.171/~goldorg/ajaxfiles/get_user_level', {
                    is_app: '1',
                    login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
                });

                if (Array.isArray(res.data)) {
                    setUserLevels(res.data);
                } else if (res.data?.data && Array.isArray(res.data.data)) {
                    setUserLevels(res.data.data);
                } else {
                    console.error('❌ Invalid user level data:', res.data);
                }
            } catch (err) {
                console.error('⚠️ Failed to fetch user levels:', err);
            }
        };

        fetchUserLevels();
    }, []);


    useEffect(() => {
        const delay = setTimeout(() => {
            setCurrentPage(0);
            !isFirstRender && fetchLogs(searchText);
        }, 500);
        return () => clearTimeout(delay);
    }, [searchText]);

    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.2,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5,
                            mx: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* User Level Dropdown */}
                        <TextField
                            select
                            label="User Level"
                            value={selectedUserLevel}
                            onChange={(e) => setSelectedUserLevel(e.target.value)}
                            size="small"
                            sx={{ width: 180, flexShrink: 0 }}
                        >
                            {userLevels.map((level) => (
                                <MenuItem key={level.user_level_id} value={level.user_level_id}>
                                    {level.user_level_name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Rows Per Page */}
                        <TextField
                            select
                            label="Rows per page"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(0);
                            }}
                            size="small"
                            sx={{ width: 150 }}
                        >
                            {[10, 25, 50].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Search Field */}
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


                    {logs.length === 0 && !loading && (
                        <Typography textAlign="center">No Logs Found</Typography>
                    )}

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
                                    '&::-webkit-scrollbar': {
                                        height: 6,
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
                                <Table stickyHeader size="small" sx={{ minWidth: 600 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>level_name</TableCell>
                                            <TableCell>market_name</TableCell>
                                            <TableCell>script_name</TableCell>
                                            <TableCell>position_limit</TableCell>
                                            <TableCell>max_order</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((log, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{log.level_name}</TableCell>
                                                <TableCell>{log.market_name || '-'}</TableCell>
                                                <TableCell>{log.script_name || '-'}</TableCell>
                                                <TableCell>{log.position_limit}</TableCell>
                                                <TableCell>{log.max_order}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
                        </>
                    )}
                </Paper>
            ) : (
                <>
                    {/* Mobile Cards */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.2,
                            mb: 0.5,
                            mx: 0.2,
                            flexWrap: 'nowrap',
                        }}
                    >
                        {/* User Level Dropdown (fixed width) */}
                        <TextField
                            select
                            label="User Level"
                            value={selectedUserLevel}
                            onChange={(e) => setSelectedUserLevel(e.target.value)}
                            size="small"
                            sx={{ width: 150, flexShrink: 0 }}
                        >
                            {userLevels.map((level) => (
                                <MenuItem key={level.user_level_id} value={level.user_level_id}>
                                    {level.user_level_name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Search Field (flex-grow to fill space) */}
                        <TextField
                            variant="outlined"
                            placeholder="Search logs..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            size="small"
                            fullWidth
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
                        <Typography textAlign="center">No Logs Found</Typography>
                    )}

                    {logs.map((log, index) => (
                        <Box
                            key={index}
                            sx={{
                                mb: 0.5,
                                mx: 0.5,
                                borderRadius: 3,
                                background: 'linear-gradient(to right, #2196f3, #21cbf3)',
                                p: '2px', // thin gradient border
                                boxShadow: '0 4px 12px rgba(33, 203, 243, 0.5)',
                            }}
                        >
                            <Box
                                sx={{
                                    borderRadius: 3,
                                    backgroundColor: '#fff',
                                    p: 1,
                                }}
                            >
                                {/* Script Title */}
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {log.script_name || '-'}
                                </Typography>

                                {/* First Row: Group & Exchange */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">
                                        <strong></strong> {log.level_name}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong></strong> {log.market_name || '-'}
                                    </Typography>
                                </Box>

                                {/* Second Row: Qty & Rate */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">
                                        <strong></strong> {log.position_limit}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong></strong> {log.max_order}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}

                    {logs.length < totalRecords && (
                        <>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        const nextPage = currentPage + 1;
                                        setCurrentPage(nextPage);  // this will call fetchLogs in useeffcet
                                        // fetchLogs(searchText, nextPage, true);
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </Button>
                            </Box>)}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default EditDeleteLogs;
