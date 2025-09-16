import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
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
} from '@mui/material';
import { addClientBlockScriptAPI, deleteClientBlockScriptAPI, fetchBlockedAllowedAPI, removeSelectedClientBlockScriptAPI } from './API/API';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from './filters/Pagination';
import Blockedallowedscriptfilter from './Utility/Blockedallowedscriptfilter';

const Blockedallowedscript = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isFirstRender = useIsFirstRender();

    // Search & Filter
    const [filterType, setFilterType] = useState('today');
    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Add/Edit/Delete
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openRemoveAllDialog, setOpenRemoveAllDialog] = useState(false);

    const [addMarket, setAddMarket] = useState('');
    const [addScript, setAddScript] = useState([]);
    const [addClient, setAddClient] = useState('');
    const [addMaster, setAddMaster] = useState('');

    // Data
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    // User info from session
    const rawData = sessionStorage.getItem("data");
    const parsedData = JSON.parse(rawData);
    const userType = parseInt(parsedData.user_type, 10);

    // ------------------- Dialog Handlers -------------------
    const handleOpenConfirm = (log) => {
        setSelectedLog(log);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedLog(null);
    };

    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setAddMarket('');
        setAddScript([]);
        setAddClient('');
        setAddMaster('');
    };

    const handleOpenRemoveAllDialog = () => setOpenRemoveAllDialog(true);
    const handleCloseRemoveAllDialog = () => setOpenRemoveAllDialog(false);

    // ------------------- Add Order -------------------
    const handleAddOrder = async () => {
        handleCloseAddDialog();
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            await addClientBlockScriptAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                market_type_id: typeof addMarket === "object" ? addMarket.id || addMarket.value : addMarket,
                script_id: typeof addScript === "object" ? addScript.id || addScript.value : addScript,
                client_user_id: addClient && typeof addClient === "object" ? addClient.id : addClient || "",
                master_user_id: addMaster && typeof addMaster === "object" ? addMaster.id : addMaster || "",
            });

            fetchPageData();
        } catch (error) {
            console.error("Add failed:", error);
        }
    };

    // Delete
    const handleConfirmDelete = async () => {
        handleCloseConfirm();
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            await deleteClientBlockScriptAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                client_block_script_id: selectedLog.client_block_script_id || selectedLog.id,
            });

            fetchPageData();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    // Remove selected
    const handleConfirmRemoveSelected = async () => {
        handleCloseRemoveAllDialog();
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data"));

            await removeSelectedClientBlockScriptAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                market_type_id: typeof addMarket === "object" ? addMarket.id || addMarket.value : addMarket,
                script_id: typeof addScript === "object" ? addScript.id || addScript.value : addScript,
                client_user_id: addClient && typeof addClient === "object" ? addClient.id : addClient || "",
                master_user_id: addMaster && typeof addMaster === "object" ? addMaster.id : addMaster || "",
            });

            fetchPageData();
        } catch (error) {
            console.error("Remove selected failed:", error);
        }
    };


    // ------------------- Fetch Logs -------------------
    const fetchPageData = async () => {
        setLoading(true);
        const dataStored = JSON.parse(sessionStorage.getItem('data'));
        const data = await fetchBlockedAllowedAPI(
            dataStored.user_id,
            dataStored.auth_key,
            filterType,
            "", // Fetch all, filter locally
            pageSize,
            currentPage,
        );

        let safeData = Array.isArray(data?.data) ? data.data : [];

        // Filter by client full name
        if (debouncedSearchText.trim() !== "") {
            const searchLower = debouncedSearchText.toLowerCase();
            safeData = safeData.filter(log =>
                log.user_full_name?.toLowerCase().includes(searchLower)
            );
        }

        isMobile
            ? isFilterChange || currentPage === 0
                ? setLogs(safeData)
                : setLogs(prev => [...prev, ...safeData])
            : setLogs(safeData);

        setTotalRecords(safeData.length);
        setTotalPages(Math.ceil(safeData.length / pageSize));
        setLoading(false);
        setIsFilterChange(false);
    };

    // ------------------- Effects -------------------
    useEffect(() => {
        fetchPageData();
    }, [currentPage, pageSize, filterType, debouncedSearchText]);

    // ------------------- Render -------------------
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '100%',
                mx: 'auto',
                px: isMobile ? 0 : 2,
                py: isMobile ? 0 : 2,
                backgroundColor: theme.palette.background.default,
                overflowY: 'auto',
                maxHeight: '90vh',
            }}
        >
            {/* Add / Remove All Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1, px: 1 }}>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleOpenRemoveAllDialog}
                    sx={{ borderRadius: 1 }}
                >
                    Remove All
                </Button>
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

            {/* Search */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1,
                    py: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f5f5f5',
                    borderRadius: 1,
                    mb: 1,
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search by Client Full Name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: 28,
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' },
                        },
                        '& input': { padding: '0 8px' },
                    }}
                />
            </Box>

            {/* Loading */}
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {/* Logs */}
            {!loading && logs.length === 0 && (
                <Typography sx={{ fontSize: '14px', px: 1 }}>No logs found.</Typography>
            )}

            {!loading && logs.length > 0 && (
                <>
                    {isMobile ? (
                        logs.map((log, index) => (
                            <Card
                                key={index}
                                sx={{
                                    mb: 1,
                                    mx: 1,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc',
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <CardContent sx={{ p: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {log.user_full_name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            {log.market_type_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                            {log.script_name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                            {log.time}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Box sx={{ overflowX: 'auto', maxHeight: '400px', border: '1px solid #ddd', mx: 1 }}>
                            <table style={{ minWidth: '900px', fontSize: '12px', margin: 0 }}>
                                <thead style={{ backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0' }}>
                                    <tr>
                                        {["Client Full Name", "Market Type", "Script", "Datetime", "Action"].map(header => (
                                            <th key={header} style={{ fontWeight: 600 }}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.user_full_name}</td>
                                            <td>{log.market_type_name}</td>
                                            <td>{log.script_name}</td>
                                            <td>{log.time}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Button size="small" variant="outlined" color="error" onClick={() => handleOpenConfirm(log)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    )}
                </>
            )}

            {/* Confirm Delete Dialog */}
            <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {selectedLog ? `"${selectedLog.script_name}"` : ""}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add Order Dialog */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog} fullWidth maxWidth="sm" scroll="paper">
                <DialogTitle sx={{ pt: 2, pb: 1 }}>Add Client Order Limit</DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                    <Blockedallowedscriptfilter
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
                    <Button onClick={handleAddOrder} variant="contained" color="primary">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Remove All Dialog */}
            <Dialog open={openRemoveAllDialog} onClose={handleCloseRemoveAllDialog} fullWidth maxWidth="sm" scroll="paper">
                <DialogTitle sx={{ pt: 2, pb: 1 }}>Remove Client Block Scripts</DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                    <Blockedallowedscriptfilter
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
                    <Button onClick={handleCloseRemoveAllDialog} variant="outlined">Cancel</Button>
                    <Button onClick={handleConfirmRemoveSelected} variant="contained" color="error">Remove</Button>
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
        </Box>
    );
};

export default Blockedallowedscript;
