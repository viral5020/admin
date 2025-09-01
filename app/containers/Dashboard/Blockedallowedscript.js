import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    RadioGroup,
} from '@mui/material';
import { fetchBlockedAllowedAPI, fetchOrderlimitAPI, fetchRejectionLogsAPI } from './API/API';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from './filters/Pagination';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import { DeleteIcon } from 'dan-vendor/react-trello/dist/styles/Elements';
import { FormControlLabel } from '@mui/material';
import { Radio } from '@mui/material';


const Blockedallowedscript = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isFirstRender = useIsFirstRender();

    const [filterType, setFilterType] = useState('today');
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);

    // # Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');
    const [after_date, setafter_date] = useState('');
    const [before_date, setbefore_date] = useState('');
    const [End_date, setEnd_date] = useState('');
    const [Start_date, setStart_date] = useState('');

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);

    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const rawData = sessionStorage.getItem("data");
    const parsedData = JSON.parse(rawData);
    const userType = parseInt(parsedData.user_type, 10);


    const [addMarket, setAddMarket] = useState('');
    const [addScript, setAddScript] = useState([]);
    const [addClient, setAddClient] = useState('');
    const [addMaster, setAddMaster] = useState('');
    const [addValue, setAddValue] = useState('');
    const [addPricePercent, setAddPricePercent] = useState('');
    const [valueType, setValueType] = useState(0);



    const handleOpenConfirm = (log) => {
        setSelectedLog(log);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedLog(null);
    };

    // New states for Add Dialog
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newOrder, setNewOrder] = useState({
        market_type_name: "",
        script_name: "",
        value: "",
        price_percent: "",
        client_name: userType !== 1 ? "" : undefined,
    });


    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewOrder({
            market_type_name: "",
            script_name: "",
            value: "",
            price_percent: "",
            client_name: userType !== 1 ? "" : undefined,
        });
    };

    const handleAddOrder = async () => {
        fetchPageData();
        handleCloseAddDialog();

        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            const payload = {
                is_app: "1",
                login_user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                market_type_id: typeof addMarket === "object" ? addMarket.id || addMarket.value : addMarket,
                script_id: typeof addScript === "object" ? addScript.id || addScript.value : addScript,
                user_id: addClient && typeof addClient === "object" ? addClient.id : addClient || "",
                master_user_id: addMaster && typeof addMaster === "object" ? addMaster.id : addMaster || "",
            };

            console.log("🔹 Sending payload to add_client_order_limit:", payload);

            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_client_block_script_setting",
                payload
            );

            console.log("✅ API add_client_order_limit response:", response.data);

            // Refresh table immediately after closing
            fetchPageData();

        } catch (error) {
            console.error("❌ Add failed:", error);
            if (error.response) console.error("🔻 Error response:", error.response.data);
        }
    };

    const handleConfirmDelete = async () => {
        fetchPageData();
        handleCloseConfirm();

        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            const payload = {
                is_app: "1",
                login_user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                client_block_script_id: selectedLog.client_block_script_id || selectedLog.id,
            };

            console.log("🔹 Sending payload to delete_client_order_limit:", payload);

            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/remove_client_block_script_setting",
                payload
            );

            console.log("✅ API delete_client_order_limit response:", response.data);

            // Refresh table immediately after closing
            fetchPageData();

        } catch (error) {
            console.error("❌ Delete failed:", error);
            if (error.response) console.error("🔻 Error response:", error.response.data);
        }
    };

    const fetchPageData = async () => {
        setLoading(true);
        const dataStored = JSON.parse(sessionStorage.getItem('data'));
        const data = await fetchBlockedAllowedAPI(
            dataStored.user_id,
            dataStored.auth_key,
            filterType,
            searchText,
            pageSize,
            currentPage,
        );

        const safeData = Array.isArray(data?.data) ? data.data : [];

        isMobile
            ? isFilterChange || currentPage === 0
                ? setLogs(safeData)
                : setLogs(prev => [...prev, ...safeData])
            : setLogs(safeData);

        setTotalRecords(data?.iTotalRecords || 0);

        setLoading(false);
        setIsFilterChange(false);
    };


    function onFilterApply() {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
        setCurrentPage(0);
        toggleDrawer(false)();
    }

    useEffect(() => {
        console.log('logs.length', logs.length);
    }, [logs])

    // # Pagination useEffects
    useEffect(() => {
        fetchPageData();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [pageSize, totalRecords])

    useEffect(() => {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
        setCurrentPage(0);
    }, [filterType, debouncedSearchText]);

    useEffect(() => {
        !isFirstRender && fetchPageData();
    }, [currentPage, pageSize]);

    useEffect(() => {
        isFilterChange && !isFirstRender && fetchPageData();
    }, [isFilterChange])

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '100%',
                mx: 'auto',
                px: isMobile ? 0 : 2,
                py: isMobile ? 0 : 2,
                overflow: 'hidden',
                maxHeight: isMobile ? '100vh' : '90vh',
                overflowY: 'auto',
                backgroundColor: theme.palette.background.default,
            }}
        >

            {/* <TradeEditDeleteLogFilter
                End_date={End_date}
                Start_date={Start_date}
                setEnd_date={setEnd_date}
                setStart_date={setStart_date}
                market={market}
                script={script}
                setScript={setScript}
                setMarket={setMarket}
                client={client}
                master={master}
                setClient={setClient}
                setMaster={setMaster}
                onApply={onFilterApply}
            /> */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                    px: 1
                }}
            >
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={handleOpenAddDialog}
                    sx={{ borderRadius: 1 }}
                >
                    Add Order Limit
                </Button>

            </Box>
            {/* Filter + Search */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1,
                    py: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                    borderRadius: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <TextField
                        size="small"
                        placeholder="Search logs"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        fullWidth
                        sx={{
                            ml: 1,
                            '& .MuiOutlinedInput-root': {
                                height: 26,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'black',
                                },
                            },
                            '& input': {
                                padding: '0 8px',
                            },
                        }}
                    />
                </Box>
            </Box>

            {isMobile
                ? loading && (isFilterChange || currentPage === 0)
                    ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <>
                            {logs.length === 0 ? (
                                <Typography sx={{ fontSize: '14px', px: 1 }}>No rejection logs found.</Typography>
                            ) : (
                                logs.map((log, index) => {
                                    const isBuy = log.trade_type === 'Buy';
                                    const isSell = log.trade_type === 'Sell';

                                    const borderGradient = isBuy
                                        ? 'linear-gradient(to right, #2196f3, #21cbf3)'
                                        : isSell
                                            ? 'linear-gradient(to right, #f44336, #ff7961)'
                                            : '#ccc';

                                    const boxShadowColor = isBuy
                                        ? 'rgba(33, 150, 243, 0.3)'
                                        : isSell
                                            ? 'rgba(244, 67, 54, 0.3)'
                                            : 'rgba(0,0,0,0.1)';

                                    return (
                                        <Card
                                            key={index}
                                            sx={{
                                                mb: 1,
                                                mx: 1,
                                                borderRadius: 2,
                                                border: '1px solid',
                                                borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: `0 4px 12px ${boxShadowColor}`,
                                            }}
                                        >
                                            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                {/* First row → Client (if userType !== 1) + Full Name */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    {userType !== 1 && (
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                            {log.client_block_script_id}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                        {log.user_full_name}
                                                    </Typography>
                                                </Box>

                                                {/* Second row → Market Type + Script */}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                        {log.market_type_name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                                        {log.script_name}
                                                    </Typography>
                                                </Box>

                                                {/* Third row → Datetime */}
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                                        {log.time}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>

                                    );
                                })
                            )}

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
                        </>
                    )
                :
                loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : logs.length === 0 ? (
                    <Typography sx={{ fontSize: '14px', px: 1 }}>No rejection logs found.</Typography>
                ) : (
                    <>
                        <Box
                            sx={{
                                overflowX: 'auto',
                                overflowY: 'auto',
                                maxHeight: '400px',
                                border: '1px solid #ddd',
                                mx: 1,
                                '&::-webkit-scrollbar': { display: 'none' },
                            }}
                        >
                            <table
                                className="table table-striped table-bordered"
                                style={{
                                    minWidth: "900px",
                                    fontSize: "12px",
                                    margin: 0,
                                    backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                }}
                            >
                                <thead
                                    style={{
                                        backgroundColor:
                                            theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
                                    }}
                                >
                                    <tr>
                                        {[
                                            ...(userType !== 1 ? ["Client"] : []),
                                            "Client Full Name",
                                            "Market Type",
                                            "Script",
                                            "Datetime",
                                            "Action"
                                        ].map((header) => (
                                            <th key={header} style={{ fontWeight: 600 }}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => {
                                        // Split script name and date
                                        const [scriptBase, ...rest] = (log.script_name || "").split(" ");
                                        const scriptSuffix = rest.join(" ");

                                        return (
                                            <tr key={index}>
                                                {userType !== 1 && <td>{log.client_block_script_id}</td>}
                                                <td>{log.user_full_name}</td>
                                                <td>{log.market_type_name}</td>
                                                <td>{log.script_name}</td>
                                                <td>{log.time}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleOpenConfirm(log)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Box>
                        <Dialog
                            open={openConfirm}
                            onClose={handleCloseConfirm}
                        >
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete
                                    {selectedLog ? ` "${selectedLog.script_name}"` : ""}? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseConfirm}>Cancel</Button>
                                <Button
                                    onClick={handleConfirmDelete}
                                    color="error"
                                    variant="contained"
                                    autoFocus
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openAddDialog}
                            onClose={handleCloseAddDialog}
                            fullWidth
                            maxWidth="sm"
                            scroll="paper" // ensures content scrolls if needed
                        >
                            <DialogTitle sx={{ pt: 2, pb: 1 }}>Add Client Order Limit</DialogTitle>

                            <DialogContent
                                dividers
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    pt: 1,  // reduce top padding to avoid cutting
                                    pb: 2,  // bottom padding
                                    maxHeight: '60vh', // ensure content is scrollable if too tall
                                    overflowY: 'auto',
                                }}
                            >
                                <TradeEditDeleteLogFilter
                                    market={addMarket}
                                    script={addScript}
                                    setScript={setAddScript}
                                    setMarket={setAddMarket}
                                    client={addClient}
                                    master={addMaster}
                                    setClient={setAddClient}
                                    setMaster={setAddMaster}
                                />
                            </DialogContent>

                            <DialogActions sx={{ px: 3, pb: 2 }}>
                                <Button onClick={handleCloseAddDialog} variant="outlined">Cancel</Button>
                                <Button
                                    onClick={handleAddOrder}
                                    variant="contained"
                                    color="primary"
                                >
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>
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
        </Box>
    );
};

export default Blockedallowedscript