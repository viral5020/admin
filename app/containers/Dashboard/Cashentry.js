import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from "@mui/icons-material/Add";

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
    Grid,
    Collapse,
    Drawer,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce, useIsFirstRender } from '@uidotdev/usehooks';
import Pagination from './filters/Pagination';
import FilterBtn from './filters/FilterBtn';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import BackToTop from './helpers/BackToTop';
import { addReceiptAPI, cashEntryAPI, deleteReceiptAPI, editReceiptAPI } from './API/API';
import { formatScriptIds } from './helpers/utilFunc';
import ClientMasterBrokerFilter2 from './filters/Clientmasterbrokerfilter2';
import { Tooltip } from '@mui/material';
import SearchPdfCsv from "./filters/SearchPdfCsv";

const colArr = [
    "Name",
    "Date",
    "Debit",
    "Credit",
    "Remark",
]

const keyArr = [
    "user",
    "account_date_time",
    "debit",
    "credit",
    "remark",
]


const Cashentry = ({
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

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filterDrawer, setFilterDrawer] = useState(false);

    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');

    const [userType, setUserType] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [entryAfter_date, setEntryAfter_date] = useState('');
    const [entryBefore_date, setEntryBefore_date] = useState('');

    const [formOpen, setFormOpen] = useState(false);

    const [entryUserType, setEntryUserType] = useState(null);
    const [entryUser, setEntryUser] = useState(null);
    const [entryDate, setEntryDate] = useState("");
    const [entryType, setEntryType] = useState("");
    const [entryAmount, setEntryAmount] = useState("");
    const [entryRemark, setEntryRemark] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [logToDelete, setLogToDelete] = useState(null);

    const [entryUserBalance, setEntryUserBalance] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [userBalance, setuserBalance] = useState(false);

    const [editingLog, setEditingLog] = useState(null);
    const [editValue, setEditValue] = useState({
        user: null,
        type: "",
        date1: "",
        amount: "",
        remarks: ""
    });

    const handleDeleteClick = (log) => {
        setLogToDelete(log);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (log) => {
        setEditingLog(log);
        setEditValue({
            user: { id: log.user_id, name: log.user },
            type: log.type,
            date1: log.account_date_time?.split("T")[0] || "",
            amount: log.amount || log.debit || log.credit || "",
            remarks: log.remark || ""
        });
    };

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const scriptIds = formatScriptIds?.(script);
            const result = await cashEntryAPI(
                currentPage,
                pageSize,
                searchText,


                userType?.value,
                selectedUser?.id,
                entryAfter_date,
                entryBefore_date
                // cash_add=cash_add
            );

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
            setLogs([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const handleEntrySubmit = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!dataStored) return toast.error("Session expired. Please log in again.");
        if (!entryUser?.id || !entryDate || entryType === "" || !entryAmount) {
            return toast.error("Please fill all required fields!");
        }

        try {
            setLoading(true);
            const result = await addReceiptAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                user_type: entryUserType.value,
                entry_user_id: entryUser.id,
                type: entryType,
                date1: entryDate,
                amount: entryAmount,
                remarks: entryRemark || "",
            });

            if (result?.success) {
                toast.success("Entry added successfully!");
                setFormOpen(false);
                setEntryUser(null);
                setEntryDate("");
                setEntryType("");
                setEntryAmount("");
                setEntryRemark("");
                fetchLogs();
            } else {
                toast.error(result?.message || "Failed to add entry.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while adding the entry.");
        } finally {
            setLoading(false);
        }
    };

    // Edit entry
    const handleUpdateLog = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!dataStored) return toast.error("Session expired. Please log in again.");
        if (!editValue.user?.id || editValue.type === "" || !editValue.date1 || !editValue.amount) {
            return toast.error("Please fill all required fields!");
        }

        try {
            setLoading(true);
            const result = await editReceiptAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                entry_id: editingLog.entry_id,
                entry_user_id: editValue.user.id,
                type: editValue.type,
                date1: editValue.date1,
                amount: editValue.amount,
                remarks: editValue.remarks || "",
            });

            if (result?.success) {
                toast.success("Entry updated successfully!");
                setEditingLog(null);
                setEditValue({ user: null, type: "", date1: "", amount: "", remarks: "" });
                fetchLogs();
            } else {
                toast.error(result?.message || "Failed to update entry.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while updating the entry.");
        } finally {
            setLoading(false);
        }
    };

    // Delete entry
    const handleConfirmDelete = async () => {
        if (!logToDelete) return;
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!dataStored) return toast.error("Session expired. Please log in again.");

        try {
            setLoading(true);
            const result = await deleteReceiptAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                entry_id: logToDelete.entry_id,
                entry_user_id: logToDelete.user_id,
            });

            if (result?.success) {
                toast.success("Entry deleted successfully!");
                setDeleteDialogOpen(false);
                setLogToDelete(null);
                fetchLogs();
            } else {
                toast.error(result?.message || "Failed to delete entry.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while deleting the entry.");
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

    useEffect(() => { fetchLogs(); }, []);
    useEffect(() => { setTotalPages(Math.ceil(totalRecords / pageSize)); }, [pageSize, totalRecords]);

    useEffect(() => {
        !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
        setCurrentPage(0);
    }, [debouncedSearchText]);

    useEffect(() => { !isFirstRender && fetchLogs(); }, [currentPage, pageSize]);
    useEffect(() => { isFilterChange && !isFirstRender && fetchLogs(); }, [isFilterChange]);

    useEffect(() => {
        if (!entryUser?.id) {
            setEntryUserBalance(null);
            return;
        }

        useEffect(() => {
            const fetchBalance = async () => {
                setBalanceLoading(true);

                const dataStored = JSON.parse(sessionStorage.getItem("data"));
                if (!dataStored) {
                    toast.error("Session expired. Please log in again.");
                    return;
                }

                try {
                    const result = await fetchBalanceAPI({
                        user_id: dataStored.user_id,
                        auth_key: dataStored.auth_key,
                        entryUserId: entryUser.id,
                    });

                    setEntryUserBalance(result?.balance ?? 0);
                } catch (err) {
                    setEntryUserBalance(0);
                } finally {
                    setBalanceLoading(false);
                }
            };

            fetchBalance();
        }, [entryUser]);

        fetchBalance();
    }, [entryUser]);

    return (
        <>
            {/* Desktop */}
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    {/* {filterShow && (
                        <Box sx={{ mb: 3 }}>
                            <ClientMasterBrokerFilter2
                                sx={{ width: "100%" }}
                                userType={userType}
                                setUserType={setUserType}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                            />
                        </Box>
                    )} */}
                    {filterShow && (
                        <Box sx={{ mb: 3 }}>
                            {/* Filter + Add Cash Entry icon button together */}
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TradeEditDeleteLogFilter
                                    entry_date={entryAfter_date}
                                    setentry_date={setEntryAfter_date}
                                    entrybefore_date={entryBefore_date}
                                    setentrybefore_date={setEntryBefore_date}
                                    userType={userType}
                                    setUserType={setUserType}
                                    selectedUser={selectedUser}
                                    setSelectedUser={setSelectedUser}
                                    onApply={onFilterApply}
                                />

                                {/* Add Cash Entry Button directly after Apply */}
                                <Tooltip title={formOpen ? "Close Form" : "Add Cash Entry"}>
                                    <IconButton
                                        onClick={() => setFormOpen((prev) => !prev)}
                                        sx={{
                                            ml: 0.5, // very small margin to avoid sticking visually
                                            bgcolor: "secondary.main",
                                            color: "white",
                                            "&:hover": { bgcolor: "secondary.dark" },
                                            borderRadius: 1.5,
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Collapse in={formOpen}>
                                <Box sx={{ mt: 1, display: "grid", gap: 0.5 }}>
                                    {/* Filter and Current Balance side by side */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <ClientMasterBrokerFilter2
                                            sx={{ width: "100%" }}
                                            userType={entryUserType}
                                            setUserType={setEntryUserType}
                                            selectedUser={entryUser}
                                            setSelectedUser={setEntryUser}
                                        />
                                        <Box
                                            sx={{
                                                px: 3,
                                                py: 1,
                                                borderRadius: 1,
                                                fontWeight: 600,
                                                bgcolor: entryUserBalance >= 0 ? "success.main" : "error.main",
                                                color: "common.white",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.5,
                                                width: "fit-content",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 400, opacity: 0.8 }}>
                                                Balance:
                                            </Typography>
                                            <Typography variant="body2">{entryUserBalance ?? 0}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Form fields */}
                                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                type="date"
                                                label="Date"
                                                InputLabelProps={{ shrink: true }}
                                                value={entryDate}
                                                onChange={(e) => setEntryDate(e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                select
                                                label="Type"
                                                value={entryType}
                                                onChange={(e) => setEntryType(e.target.value)}
                                                fullWidth
                                            >
                                                <MenuItem value={1}>Receipt</MenuItem>
                                                <MenuItem value={0}>Payment</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                type="number"
                                                label="Amount"
                                                value={entryAmount}
                                                onChange={(e) => setEntryAmount(e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                label="Remark"
                                                value={entryRemark}
                                                onChange={(e) => setEntryRemark(e.target.value)}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            sx={{ borderRadius: 1 }}
                                            onClick={handleEntrySubmit}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Box>
                            </Collapse>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                            isLoading={loading}
                        />
                    </Box>

                    {logs.length === 0 && !loading ? <Typography textAlign='center'>No Logs Found</Typography> : loading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box> : (
                        <>
                            <TableContainer>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Debit</TableCell>
                                            <TableCell>Credit</TableCell>
                                            <TableCell>Remark</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((log, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{log?.user ?? "-"}</TableCell>
                                                <TableCell><strong>{log?.account_date_time?.toLocaleString() ?? "-"}</strong></TableCell>
                                                <TableCell>{log?.debit ?? "-"}</TableCell>
                                                <TableCell>{log?.credit ?? "-"}</TableCell>
                                                <TableCell>{log?.remark ?? "-"}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", gap: 0.5 }}>
                                                        <Button size="small" variant="outlined" color="primary" onClick={() => handleEditClick(log)}>Edit</Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => handleDeleteClick(log)}
                                                        >
                                                            Delete
                                                        </Button>

                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                                <DialogTitle>Confirm Delete</DialogTitle>
                                <DialogContent>
                                    <Typography>Are you sure you want to delete this entry?</Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                    <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={!!editingLog} onClose={() => setEditingLog(null)}>
                                <DialogTitle>Edit Log</DialogTitle>
                                <DialogContent>
                                    <TextField label="User" fullWidth value={editValue.user?.name || ""} onChange={(e) => setEditValue({ ...editValue, user: { ...editValue.user, name: e.target.value } })} margin="dense" />
                                    <TextField label="Date" type="date" fullWidth value={editValue.date1} onChange={(e) => setEditValue({ ...editValue, date1: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
                                    <TextField select label="Type" fullWidth value={editValue.type} onChange={(e) => setEditValue({ ...editValue, type: e.target.value })} margin="dense">
                                        <MenuItem value={1}>Receipt</MenuItem>
                                        <MenuItem value={0}>Payment</MenuItem>
                                    </TextField>
                                    <TextField label="Amount" type="number" fullWidth value={editValue.amount} onChange={(e) => setEditValue({ ...editValue, amount: e.target.value })} margin="dense" />
                                    <TextField label="Remark" fullWidth value={editValue.remarks} onChange={(e) => setEditValue({ ...editValue, remarks: e.target.value })} margin="dense" />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setEditingLog(null)}>Cancel</Button>
                                    <Button color="primary" onClick={handleUpdateLog}>Save</Button>
                                </DialogActions>
                            </Dialog>

                            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} setPageSize={setPageSize} pageSize={pageSize} />
                        </>
                    )}

                    <ToastContainer position="top-right" autoClose={3000} />
                    <BackToTop />
                </Paper>
            ) : (
                <>
                    {/* Mobile version */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 1.5, mt: 0.5 }}>
                        <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                            <Box sx={{ width: 280, p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Filters</Typography>
                                    <IconButton onClick={() => setFilterDrawer(false)}><CloseIcon /></IconButton>
                                </Box>
                                <Box sx={{ mb: 3, width: "100%" }}>
                                    <ClientMasterBrokerFilter2
                                        sx={{ width: "100%" }}
                                        userType={userType}
                                        setUserType={setUserType}
                                        selectedUser={selectedUser}
                                        setSelectedUser={setSelectedUser}
                                    />
                                </Box>

                                <TradeEditDeleteLogFilter
                                    entry_date={entryAfter_date}
                                    setentry_date={setEntryAfter_date}
                                    entrybefore_date={entryBefore_date}
                                    setentrybefore_date={setEntryBefore_date}
                                    onApply={onFilterApply}
                                />

                                <Box sx={{ mb: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => setFormOpen(prev => !prev)}
                                        fullWidth
                                        sx={{ borderRadius: 1 }}
                                    >
                                        {formOpen ? "Close Form" : "Add Cash Entry"}
                                    </Button>
                                    <Collapse in={formOpen}>
                                        <Box sx={{ mt: 1, display: "grid", gap: 0.5 }}>
                                            <ClientMasterBrokerFilter2
                                                sx={{ width: "100%" }}
                                                userType={entryUserType}
                                                setUserType={setEntryUserType}
                                                selectedUser={entryUser}
                                                setSelectedUser={setEntryUser}
                                            />
                                            {/* Current Balance on the left */}
                                            <Box
                                                sx={{
                                                    px: 3,               // horizontal padding
                                                    py: 1,            // vertical padding
                                                    mb: 1,
                                                    borderRadius: 1,
                                                    fontWeight: 600,
                                                    bgcolor: entryUserBalance >= 0 ? "success.main" : "error.main",
                                                    color: "common.white",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    width: "fit-content",
                                                    whiteSpace: "nowrap",  // prevent wrapping
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ fontWeight: 400, opacity: 0.8 }}>
                                                    Balance:
                                                </Typography>
                                                <Typography variant="body2">{entryUserBalance ?? 0}</Typography>
                                            </Box>
                                            <TextField type="date" label="Date" InputLabelProps={{ shrink: true }} value={entryDate} onChange={e => setEntryDate(e.target.value)} fullWidth />
                                            <TextField select label="Type" value={entryType} onChange={e => setEntryType(e.target.value)} fullWidth>
                                                <MenuItem value={1}>Receipt</MenuItem>
                                                <MenuItem value={0}>Payment</MenuItem>
                                            </TextField>
                                            <TextField type="number" label="Amount" value={entryAmount} onChange={e => setEntryAmount(e.target.value)} fullWidth />
                                            <TextField label="Remark" value={entryRemark} onChange={e => setEntryRemark(e.target.value)} fullWidth />
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                                                <Button variant="contained" color="secondary" size="small" onClick={handleEntrySubmit}>Submit</Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </Box>
                            </Box>
                        </Drawer>

                        <FilterBtn setFilterOpen={setFilterDrawer} />

                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                            isLoading={loading}
                        />
                    </Box>

                    {logs.map((log, index) => {
                        const borderGradient = 'linear-gradient(90deg, #FF8A80, #FF80AB)'; // Example gradient
                        const boxShadowColor = 'rgba(0,0,0,0.08)';

                        return (
                            <Card
                                key={log.id ?? index}
                                sx={{
                                    mb: 1,
                                    mx: 1,
                                    borderRadius: 2,
                                    border: '1px solid transparent',
                                    backgroundImage: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.paper}), ${borderGradient}`,
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'content-box, border-box',
                                    boxShadow: `0 4px 12px ${boxShadowColor}`,
                                }}
                            >
                                <CardContent sx={{ p: 0.5, '&:last-child': { pb: 0.5 } }}>
                                    {/* Top Row: User / Date */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                            {log.user ?? '-'} ({log.id ?? '-'})
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                            {log.account_date_time?.toLocaleString() ?? '-'}
                                        </Typography>
                                    </Box>

                                    {/* Second Row: Remark and Debit/Credit */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                                {log.remark ?? '-'}
                                            </Typography>
                                            <Box sx={{ mt: 0.25, display: 'flex', gap: 1 }}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontWeight: 600,
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        backgroundColor: theme.palette.error.main,
                                                        color: theme.palette.common.white, // white text inside solid block
                                                    }}
                                                >
                                                    Debit: {log.debit ?? '-'}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontWeight: 600,
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        backgroundColor: theme.palette.success.main,
                                                        color: theme.palette.common.white, // white text inside solid block
                                                    }}
                                                >
                                                    Credit: {log.credit ?? '-'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Actions */}
                                        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                                            <IconButton size="small" color="primary" onClick={() => handleEditClick(log)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(log)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}


                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this entry?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                            <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={!!editingLog} onClose={() => setEditingLog(null)}>
                        <DialogTitle>Edit Log</DialogTitle>
                        <DialogContent>
                            <TextField label="User" fullWidth value={editValue.user?.name || ""} onChange={(e) => setEditValue({ ...editValue, user: { ...editValue.user, name: e.target.value } })} margin="dense" />
                            <TextField label="Date" type="date" fullWidth value={editValue.date1} onChange={(e) => setEditValue({ ...editValue, date1: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
                            <TextField select label="Type" fullWidth value={editValue.type} onChange={(e) => setEditValue({ ...editValue, type: e.target.value })} margin="dense">
                                <MenuItem value={1}>Receipt</MenuItem>
                                <MenuItem value={0}>Payment</MenuItem>
                            </TextField>
                            <TextField label="Amount" type="number" fullWidth value={editValue.amount} onChange={(e) => setEditValue({ ...editValue, amount: e.target.value })} margin="dense" />
                            <TextField label="Remark" fullWidth value={editValue.remarks} onChange={(e) => setEditValue({ ...editValue, remarks: e.target.value })} margin="dense" />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditingLog(null)}>Cancel</Button>
                            <Button color="primary" onClick={handleUpdateLog}>Save</Button>
                        </DialogActions>
                    </Dialog>

                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} setPageSize={setPageSize} pageSize={pageSize} />
                    <ToastContainer position="top-right" autoClose={3000} />
                    {filterShow && (
                        <BackToTop />
                    )}
                </>
            )}
        </>
    );
};

export default Cashentry;
