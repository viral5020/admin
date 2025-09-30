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
import BackToTop from './helpers/BackToTop';
import ClientMasterBrokerFilter2 from './filters/Clientmasterbrokerfilter2';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import ClientMasterBrokerFilter3 from './filters/ClientMasterBrokerFilter3';
import DownlineFilter from './filters/ClientMasterBrokerFilter3';
import { Tooltip } from '@mui/material';
import { fetchJVAPI } from './API/API';
import SearchPdfCsv from "./filters/SearchPdfCsv";

const colArr = [
    "Sr No",
    "From Account",
    "To Account",
    "Name Dis",
    "Datetime Date",
    "Cash Type",
    "Debit",
    "Credit",
    "Remark",
]

const keyArr = [
    "srno",
    { isParse: true, key: 'user_id', name: "from_account" },
    { isParse: true, key: 'user_id', name: "to_account" },
    "name_dis",
    "datetime_Date",
    "cash_type",
    "debit",
    "credit",
    "remark",
]


const Jventry = () => {
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
    const [selectedUser, setSelectedUser] = useState(null);

    const [start_date, setStart_date] = useState('');
    const [end_date, setEnd_date] = useState('');

    const [formOpen, setFormOpen] = useState(false);
    const [entryUser, setEntryUser] = useState(null);
    const [entryDate, setEntryDate] = useState("");
    const [entryType, setEntryType] = useState("");
    const [entryAmount, setEntryAmount] = useState("");
    const [entryRemark, setEntryRemark] = useState("");

    const [accountValue, setAccountValue] = useState(null);
    const [toAccountValue, setToAccountValue] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [logToDelete, setLogToDelete] = useState(null);

    const [entryUserBalance, setEntryUserBalance] = useState(null);
    const [entry_date, setentry_date] = useState('');
    const [entrybefore_date, setentrybefore_date] = useState('');

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
            user: { id: log.user_id, name: log.user_full_name || log.name_dis },
            type: log.cash_type === "Receipt" ? 1 : 0,
            date1: log.datetime_entry || "",
            amount: log.amount1 || "",
            remarks: log.remark || ""
        });
    };

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const dataStored = JSON.parse(sessionStorage.getItem("data"));
            if (!dataStored) return toast.error("Session expired. Please log in again.");

            const result = await fetchJVAPI({
                user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                start_date,
                end_date,
            });

            const data = Array.isArray(result?.data) ? result.data : [];
            setLogs(data);
            setTotalRecords(data.length);
        } catch (err) {
            setLogs([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const handleEntrySubmit = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!dataStored) return toast.error("Session expired. Please log in again.");

        try {
            const result = await addJVEntryAPI({
                login_user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                from_ledger: accountValue?.value || "",
                to_ledger: toAccountValue?.value || "",
                ledger_type: entryType,
                date1: entryDate,
                amount: entryAmount,
                remarks: entryRemark,
            });

            if (result?.status === "success") {
                toast.success("JV Entry added successfully!");
                fetchLogs();
            } else {
                toast.error(result?.message || "Failed to add JV entry");
            }
        } catch (err) {
            toast.error("Error submitting JV entry");
        } finally {
            setFormOpen(false);
        }
    };

    // Update JV
    const handleUpdateLog = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!dataStored || !editingLog) return toast.error("Session expired or invalid entry.");

        try {
            const result = await updateJVEntryAPI({
                login_user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                from_ledger: editValue.from_account?.value || editValue.from_account || "",
                to_ledger: editValue.to_account?.value || editValue.to_account || "",
                ledger_type: editValue.cash_type === "Receipt" ? "1" : "0",
                date1: editingLog.datetime_entry || "",
                amount: Math.abs(Number(editValue.debit || editValue.credit || 0)),
                remarks: editValue.remark || "",
                jv_entry_id: editingLog.entry_id || 0,
                jv_entry_time: editingLog.jv_entry_time || editingLog.datetime_Date || ""
            });

            if (result?.status === "success") {
                toast.success("JV Entry updated successfully!");
                fetchLogs();
            } else {
                toast.error(result?.message || "Failed to update JV entry");
            }
        } catch (err) {
            toast.error("Error updating JV entry");
        } finally {
            setEditingLog(null);
        }
    };

    // Delete JV
    const handleConfirmDelete = async () => {
        if (!logToDelete) return;

        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!dataStored) return toast.error("Session expired. Please log in again.");

        try {
            const result = await deleteJVEntryAPI({
                login_user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                entryId: logToDelete.entry_id
            });

            if (result?.status === "success") {
                toast.success("JV Entry deleted successfully!");
                fetchLogs();
            } else {
                toast.error(result?.message || "Failed to delete JV entry");
            }
        } catch (err) {
            toast.error("Error deleting JV entry");
        } finally {
            setDeleteDialogOpen(false);
            setLogToDelete(null);
        }
    };


    const toggleDrawer = (open) => () => setFilterDrawer(open);
    const onFilterApply = () => {
        setCurrentPage(0);
        setIsFilterChange(true);
        toggleDrawer(false)();
    };

    useEffect(() => { fetchLogs(); }, []);
    useEffect(() => { setTotalPages(Math.ceil(totalRecords / pageSize)); }, [pageSize, totalRecords]);
    useEffect(() => { !isFirstRender && fetchLogs(); }, [debouncedSearchText, currentPage, isFilterChange]);
    useEffect(() => {
        if (editingLog) {
            setEditValue({
                from_account: editingLog.from_account || "",
                to_account: editingLog.to_account || "",
                name_dis: editingLog.name_dis || "",
                datetime_Date: editingLog.datetime_Date || "",
                cash_type: editingLog.cash_type || "Receipt",
                debit: editingLog.debit || 0,
                credit: editingLog.credit || 0,
                remark: editingLog.remark || "",
            });
        }
    }, [editingLog]);


    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    {/* Filters + Add JV Entry button inline */}
                    <Box
                        sx={{
                            mb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "nowrap", // no wrapping
                        }}
                    >
                        <TradeEditDeleteLogFilter
                            start_date={start_date}
                            setStart_date={setStart_date}
                            end_date={end_date}
                            setEnd_date={setEnd_date}
                            onApply={onFilterApply}
                        />

                        {/* Push button to the right */}
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

                    {/* Collapsible Form (hidden until Add JV Entry clicked) */}
                    <Collapse in={formOpen}>
                        <Box sx={{ mt: 1, display: "grid", gap: 0.5 }}>
                            <DownlineFilter
                                accountValue={accountValue}
                                setAccountValue={setAccountValue}
                                toAccountValue={toAccountValue}
                                setToAccountValue={setToAccountValue}
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
                                    onClick={handleEntrySubmit}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>

                    {/* Search Box */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2.5,
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

                    {/* Table */}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : logs.length === 0 ? (
                        <Typography textAlign="center">No Logs Found</Typography>
                    ) : (
                        <TableContainer sx={{ overflowX: 'auto' }}>
                            <Table stickyHeader size="small" sx={{ minWidth: 1700 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>srno</TableCell>
                                        <TableCell>from_account</TableCell>
                                        <TableCell>to_account</TableCell>
                                        <TableCell>name_dis</TableCell>
                                        <TableCell>datetime_Date</TableCell>
                                        <TableCell>cash_type</TableCell>
                                        <TableCell>debit</TableCell>
                                        <TableCell>credit</TableCell>
                                        <TableCell>remark</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{log.srno}</TableCell>
                                            <TableCell>
                                                {(() => {
                                                    try {
                                                        return JSON.parse(log.from_account)?.login_id_no || "";
                                                    } catch {
                                                        return log.from_account || "";
                                                    }
                                                })()}
                                            </TableCell>

                                            <TableCell>
                                                {(() => {
                                                    try {
                                                        return JSON.parse(log.to_account)?.login_id_no || "";
                                                    } catch {
                                                        return log.to_account || "";
                                                    }
                                                })()}
                                            </TableCell>
                                            <TableCell>{log.name_dis}</TableCell>
                                            <TableCell>{log.datetime_Date}</TableCell>
                                            <TableCell>{log.cash_type}</TableCell>
                                            <TableCell>{log.debit}</TableCell>
                                            <TableCell>{log.credit}</TableCell>
                                            <TableCell>{log.remark}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleEditClick(log)}
                                                    >
                                                        Edit
                                                    </Button>
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

                    )}

                    {/* Delete Confirmation */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this entry?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                            <Button color="error" onClick={handleConfirmDelete}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Edit Log */}
                    <Dialog open={!!editingLog} onClose={() => setEditingLog(null)}>
                        <DialogTitle>Edit Log</DialogTitle>
                        <DialogContent>
                            {/* From Account */}
                            <TextField
                                label="From Account"
                                fullWidth
                                value={editValue.from_account || ""}
                                onChange={(e) => setEditValue({ ...editValue, from_account: e.target.value })}
                                margin="dense"
                            />

                            {/* To Account */}
                            <TextField
                                label="To Account"
                                fullWidth
                                value={editValue.to_account || ""}
                                onChange={(e) => setEditValue({ ...editValue, to_account: e.target.value })}
                                margin="dense"
                            />

                            {/* Display Name */}
                            <TextField
                                label="Name Display"
                                fullWidth
                                value={editValue.name_dis || ""}
                                onChange={(e) => setEditValue({ ...editValue, name_dis: e.target.value })}
                                margin="dense"
                            />

                            {/* Date */}
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                value={editValue.datetime_Date || ""}
                                onChange={(e) => setEditValue({ ...editValue, datetime_Date: e.target.value })}
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />

                            {/* Cash Type */}
                            <TextField
                                select
                                label="Cash Type"
                                fullWidth
                                value={editValue.cash_type || "Receipt"}
                                onChange={(e) => setEditValue({ ...editValue, cash_type: e.target.value })}
                                margin="dense"
                            >
                                <MenuItem value="Receipt">Receipt</MenuItem>
                                <MenuItem value="Payment">Payment</MenuItem>
                            </TextField>


                            {/* Debit */}
                            <TextField
                                label="Debit"
                                type="number"
                                fullWidth
                                value={editValue.debit || 0}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    setEditValue({ ...editValue, debit: value });
                                }}
                                margin="dense"
                            />

                            {/* Credit */}
                            <TextField
                                label="Credit"
                                type="number"
                                fullWidth
                                value={editValue.credit || 0}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    setEditValue({ ...editValue, credit: value });
                                }}
                                margin="dense"
                            />




                            {/* Remark */}
                            <TextField
                                label="Remark"
                                fullWidth
                                value={editValue.remark || ""}
                                onChange={(e) => setEditValue({ ...editValue, remark: e.target.value })}
                                margin="dense"
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setEditingLog(null)}>Cancel</Button>
                            <Button color="primary" onClick={handleUpdateLog}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {/* Pagination + Toast + Back to Top */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                    />
                    <ToastContainer position="top-right" autoClose={3000} />
                    <BackToTop />
                </Paper >

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
                                <ClientMasterBrokerFilter2 value={selectedUser} setValue={setSelectedUser} sx={{ width: "100%", mb: 3 }} />
                                <TradeEditDeleteLogFilter entry_date={entry_date} setentry_date={setentry_date} entrybefore_date={entrybefore_date} setentrybefore_date={setentrybefore_date} onApply={onFilterApply} />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setFormOpen(prev => !prev)}
                                    fullWidth
                                    sx={{ borderRadius: 1, mt: 2 }}
                                >
                                    {formOpen ? "Close Form" : "Add JV Entry"}
                                </Button>
                                <Collapse in={formOpen}>
                                    <Box sx={{ mt: 1, display: "grid", gap: 0.5 }}>
                                        <DownlineFilter
                                            accountValue={accountValue}
                                            setAccountValue={setAccountValue}
                                            toAccountValue={toAccountValue}
                                            setToAccountValue={setToAccountValue}
                                        />
                                        <Box
                                            sx={{
                                                px: 3,
                                                py: 1,
                                                mb: 1,
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
                                            <Typography variant="body2" sx={{ fontWeight: 400, opacity: 0.8 }}>Balance:</Typography>
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

                    {logs.map((log, index) => {
                        const borderGradient = 'linear-gradient(90deg, #FF8A80, #FF80AB)';
                        const boxShadowColor = 'rgba(0,0,0,0.08)';
                        return (
                            <Card
                                key={log.entry_id ?? index}
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
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{log.name_dis}</Typography>
                                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: theme.palette.text.secondary }}>
                                            {log.datetime_Date ?? '-'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.remark ?? '-'}</Typography>
                                            <Box sx={{ mt: 0.25, display: 'flex', gap: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, px: 1, py: 0.5, borderRadius: 1, backgroundColor: theme.palette.error.main, color: "white" }}>
                                                    Debit: {log.debit ?? '-'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontWeight: 600, px: 1, py: 0.5, borderRadius: 1, backgroundColor: theme.palette.success.main, color: "white" }}>
                                                    Credit: {log.credit ?? '-'}
                                                </Typography>
                                            </Box>
                                        </Box>

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

                    {/* Delete Dialog */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent><Typography>Are you sure you want to delete this entry?</Typography></DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                            <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={!!editingLog} onClose={() => setEditingLog(null)}>
                        <DialogTitle>Edit Log</DialogTitle>
                        <DialogContent>
                            {/* From Account */}
                            <TextField
                                label="From Account"
                                fullWidth
                                value={editValue.from_account || ""}
                                onChange={(e) => setEditValue({ ...editValue, from_account: e.target.value })}
                                margin="dense"
                            />

                            {/* To Account */}
                            <TextField
                                label="To Account"
                                fullWidth
                                value={editValue.to_account || ""}
                                onChange={(e) => setEditValue({ ...editValue, to_account: e.target.value })}
                                margin="dense"
                            />

                            {/* Display Name */}
                            <TextField
                                label="Name Display"
                                fullWidth
                                value={editValue.name_dis || ""}
                                onChange={(e) => setEditValue({ ...editValue, name_dis: e.target.value })}
                                margin="dense"
                            />

                            {/* Date */}
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                value={editValue.datetime_Date || ""}
                                onChange={(e) => setEditValue({ ...editValue, datetime_Date: e.target.value })}
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />

                            {/* Cash Type */}
                            <TextField
                                select
                                label="Cash Type"
                                fullWidth
                                value={editValue.cash_type || "Receipt"}
                                onChange={(e) => setEditValue({ ...editValue, cash_type: e.target.value })}
                                margin="dense"
                            >
                                <MenuItem value="Receipt">Receipt</MenuItem>
                                <MenuItem value="Payment">Payment</MenuItem>
                            </TextField>


                            {/* Debit */}
                            <TextField
                                label="Debit"
                                type="number"
                                fullWidth
                                value={editValue.debit || 0}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    setEditValue({ ...editValue, debit: value });
                                }}
                                margin="dense"
                            />

                            {/* Credit */}
                            <TextField
                                label="Credit"
                                type="number"
                                fullWidth
                                value={editValue.credit || 0}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    setEditValue({ ...editValue, credit: value });
                                }}
                                margin="dense"
                            />




                            {/* Remark */}
                            <TextField
                                label="Remark"
                                fullWidth
                                value={editValue.remark || ""}
                                onChange={(e) => setEditValue({ ...editValue, remark: e.target.value })}
                                margin="dense"
                            />
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setEditingLog(null)}>Cancel</Button>
                            <Button color="primary" onClick={handleUpdateLog}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} setPageSize={setPageSize} pageSize={pageSize} />
                    <ToastContainer position="top-right" autoClose={3000} />
                    <BackToTop />
                </>

            )}
        </>
    );
};

export default Jventry;
