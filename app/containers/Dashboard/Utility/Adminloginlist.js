import React, { useEffect, useState } from "react";
import axios from "axios";
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
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import Pagination from "../filters/Pagination";
import { AdminloginlistAPI, deleteAllLogsAPI, deleteLogAPI } from "../API/API";
import BackToTop from "../helpers/BackToTop";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helpers for export
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SearchPdfCsv from "../filters/SearchPdfCsv";

const colArr = [
    "Sr no",
    "Device Type",
    "Brand",
    "Extra Details",
    "First Seen",
    "Last Seen",
]

const keyArr = [
    "sr_no",
    "type",
    "model",
    "extra_details",
    "first_seen",
    "last_seen",
]

const Adminloginlist = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 800);
    const [isFilterChange, setIsFilterChange] = useState(false);
    const isFirstRender = useIsFirstRender();

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // View Log dialog
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [viewRow, setViewRow] = useState(null);


    // Delete All dialog
    const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
    const [passwordAll, setPasswordAll] = useState("");
    const [deleteAllLoading, setDeleteAllLoading] = useState(false);

    // Delete single row dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [password, setPassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    ;
    const [deletePassword, setDeletePassword] = useState("");

    // Mobile filter drawer
    const [filterDrawer, setFilterDrawer] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        const result = await AdminloginlistAPI(currentPage, pageSize, searchText);
        const data = result.data || [];
        if (isMobile && currentPage > 0) {
            setLogs((prev) => [...prev, ...data]);
        } else {
            setLogs(data || []);
        }
        setTotalRecords(result.iTotalRecords || 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / pageSize));
    }, [pageSize, totalRecords]);

    useEffect(() => {
        !isFirstRender && setCurrentPage(0);
    }, [debouncedSearchText]);

    useEffect(() => {
        !isFirstRender && fetchLogs();
    }, [currentPage, pageSize]);


    const handleDeleteLog = async () => {
        if (!selectedRow) return;

        try {
            const result = await deleteLogAPI(selectedRow.admin_id, deletePassword);
            if (result.success) {
                fetchLogs(); // refresh table
                setOpenDeleteDialog(false);
                setDeletePassword("");
                toast.success("Log deleted successfully!");
            } else {
                toast.error(result.message || "Failed to delete log");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting log");
        }
    };

    const handleDeleteAllLogs = async () => {
        try {
            const result = await deleteAllLogsAPI(deletePassword);
            if (result.success) {
                fetchLogs(); // refresh table
                setOpenDeleteAllDialog(false);
                setDeletePassword("");
                toast.success("All logs deleted successfully!");
            } else {
                toast.error(result.message || "Failed to delete all logs");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting all logs");
        }
    };


    // Export CSV
    const handleExportCSV = () => {
        const csv = Papa.unparse(logs);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "admin_logs.csv");
    };

    // Export PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Admin Logs", 14, 10);
        autoTable(doc, {
            startY: 20,
            head: [["Sr no", "Device Type", "Brand", "Extra Details", "First Seen", "Last Seen"]],
            body: logs
                .map((log) => [
                    log.sr_no ?? "-",  // chatgpt : if log.key has html content then it should be vvierwed as html tags
                    log.type ?? "-",
                    log.model ?? "-",
                    log.extra_details ?? "-",
                    log.first_seen ?? "-",
                    log.last_seen ?? "-",
                ]),

        });
        doc.save("admin_logs.pdf");
    };



    return (
        <>
            {/* ✅ Desktop View */}
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    {/* Top Buttons */}
                    <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                            isLoading={loading}
                        />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setOpenDeleteAllDialog(true)}
                            sx={{ borderRadius: 1, textTransform: "capitalize" }}
                        >
                            Delete All
                        </Button>
                        {/* 
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleExportCSV}
                            sx={{ borderRadius: 1, textTransform: "capitalize" }}
                        >
                            Export CSV
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleExportPDF}
                            sx={{ borderRadius: 1, textTransform: "capitalize" }}
                        >
                            Export PDF
                        </Button> */}
                    </Box>


                    {/* Search */}
                    {/* <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2.5,
                            mx: 1,
                        }}
                    >
                       
                    </Box> */}

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer sx={{ maxHeight: "70vh", overflow: "auto" }}>
                                <Table stickyHeader size="small" sx={{ minWidth: 1200 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sr no</TableCell>
                                            <TableCell>Device Type</TableCell>
                                            <TableCell>Brand</TableCell>
                                            <TableCell>Extra Details</TableCell>
                                            <TableCell>First Seen</TableCell>
                                            <TableCell>Last Seen</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((log, i) => (
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
                                                <TableCell>{log.sr_no ?? "-"}</TableCell>
                                                <TableCell
                                                    dangerouslySetInnerHTML={{ __html: log.type }}
                                                />

                                                <TableCell>{log.model ?? "-"}</TableCell>
                                                <TableCell>{log.extra_details ?? "-"}</TableCell>
                                                <TableCell>{log.first_seen ?? "-"}</TableCell>
                                                <TableCell>{log.last_seen ?? "-"}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() => {
                                                            setSelectedRow(log);
                                                            setOpenDeleteDialog(true);
                                                        }}
                                                        sx={{ borderRadius: 1, textTransform: "capitalize" }}
                                                    >
                                                        Logout
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={() => {
                                                            setViewRow(log);
                                                            setOpenViewDialog(true);
                                                        }}
                                                        sx={{ borderRadius: 1, textTransform: "capitalize", ml: 0.5 }}
                                                    >
                                                        View
                                                    </Button>


                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {logs.length === 0 && !loading && (
                                    <Typography textAlign="center">No Logs Found</Typography>
                                )}
                            </TableContainer>

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
                /* ✅ Mobile View */
                <>
                    {/* Header with buttons + search */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 1,
                            mb: 1.5,
                            mx: 1,
                        }}
                    >
                        {/* Left: Action Buttons */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                sx={{ borderRadius: "12px", textTransform: "capitalize" }}
                                onClick={handleExportCSV}
                            >
                                Export CSV
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                sx={{ borderRadius: "12px", textTransform: "capitalize" }}
                                onClick={handleExportPDF}
                            >
                                Export PDF
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                color="error"
                                sx={{ borderRadius: "12px", textTransform: "capitalize" }}
                                onClick={() => setOpenDeleteAllDialog(true)}
                            >
                                Delete All
                            </Button>
                        </Box>

                        {/* Right: Search */}
                        <SearchPdfCsv
                            searchText={searchText}
                            setSearchText={setSearchText}
                            logs={logs}
                            colArr={colArr}
                            keyArr={keyArr}
                            isLoading={loading}
                        />
                    </Box>

                    {/* Empty / Loading States */}
                    {logs.length === 0 && !loading && (
                        <Typography textAlign="center">No Logs Found</Typography>
                    )}

                    {loading && (isFilterChange || currentPage === 0) ? (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {logs.map((log, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        mb: 1.2,
                                        mx: 1,
                                        borderRadius: 2,
                                        p: 1.2,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            transform: "scale(1.01)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                        },
                                    }}
                                >

                                    <CardContent sx={{ p: 1 }}>
                                        {/* Top Row: Sr no, type, model, extra details */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{ fontWeight: 600, wordBreak: "break-word" }}
                                            >
                                                {log.sr_no} &nbsp;|&nbsp;{" "}
                                                <span
                                                    dangerouslySetInnerHTML={{ __html: log.type }}
                                                />{" "}
                                                &nbsp;|&nbsp; {log.model} &nbsp;|&nbsp; {log.extra_details}
                                            </Typography>

                                        </Box>

                                        {/* Middle Row: First Seen & Last Seen */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="caption" sx={{ fontStyle: "italic", display: "block" }}>
                                                {log.first_seen} &nbsp; | &nbsp; {log.last_seen}
                                            </Typography>
                                        </Box>

                                        {/* Bottom Row: Action Buttons */}
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                sx={{ borderRadius: "12px", textTransform: "capitalize" }}
                                                onClick={() => {
                                                    setSelectedRow(log);
                                                    setOpenDeleteDialog(true);
                                                }}
                                            >
                                                Logout
                                            </Button>

                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                sx={{ borderRadius: "12px", textTransform: "capitalize" }}
                                                onClick={() => {
                                                    setViewRow(log);
                                                    setOpenViewDialog(true);
                                                }}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    </CardContent>

                                </Card>
                            ))}

                            {/* Load More */}
                            {logs.length < totalRecords && (
                                loading ? (
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            size="small"
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

            <Dialog
                open={openDeleteDialog}
                onClose={() => {
                    setOpenDeleteDialog(false);
                    setDeletePassword(""); // clear password on close
                }}
                BackdropProps={{
                    style: { backgroundColor: "transparent" }, // remove black shadow
                }}
            >
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDeleteDialog(false);
                            setDeletePassword(""); // also clear on Cancel
                        }}
                    >
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleDeleteLog}>Delete</Button>
                </DialogActions>
            </Dialog>


            {/* 🔹 Delete All Logs Dialog */}
            <Dialog
                open={openDeleteAllDialog}
                onClose={() => {
                    setOpenDeleteAllDialog(false);
                    setDeletePassword(""); // clear password on close
                }}
                BackdropProps={{
                    style: { backgroundColor: "transparent" },
                }}
            >
                <DialogTitle>Confirm Delete All Logs</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpenDeleteAllDialog(false);
                            setDeletePassword(""); // also clear on Cancel
                        }}
                    >
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleDeleteAllLogs}>Delete All</Button>
                </DialogActions>
            </Dialog>


            {/* 🔹 View Log Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
                <DialogTitle>Log Details</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>IP Address:</strong> {viewRow?.ip_address ?? "-"}
                    </Typography>
                    <Typography variant="body2">
                        <strong>User Agent:</strong> {viewRow?.user_agent ?? "-"}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default Adminloginlist;
