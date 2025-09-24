import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchLedgerDetailsAPI, fetchSelfplAPI } from "./API/API";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    TextField,
    Typography,
    Dialog,
    IconButton,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Drawer,
    useMediaQuery,
    Button,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ValanFilter from "./ValanFilter";
import Pagination from "./filters/Pagination";
import { formatScriptIds } from "./helpers/utilFunc";
import SearchPdfCsv from "./filters/SearchPdfCsv";

const colArr = [
    "Serial No",
    "Name",
    "bill_amount",
    "user_type"
]

const keyArr = [
    "sr_no",
    "user_name",
    "bill_amount",
    "user_type",
]

const Selfpl = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 10;

    const [start_end, setStart_end] = useState(null);
    const [end_date, setEnd_date] = useState(null);
    const [market, setMarket] = useState(null);
    const [script, setScript] = useState(null);
    const [client, setClient] = useState(null);
    const [master, setMaster] = useState(null);
    const [broker, setBroker] = useState(null);
    const [valanId, setValanId] = useState(null);

    // Pagination states
    const [pageSize, setPageSize] = useState(10);

    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [ledgerDetails, setLedgerDetails] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const fetchLedgerDetails = async (userId) => {
        setLoadingLedger(true);
        const dataStored = JSON.parse(sessionStorage.getItem("data"));

        try {
            const result = await fetchLedgerDetailsAPI({
                user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                targetUserId: userId,
            });

            if (result.status === "ok" && Array.isArray(result.data)) {
                const filtered = result.data.filter(
                    (item) => item.valan_name !== "Opening Balance"
                );
                setLedgerDetails(filtered);
            } else {
                setLedgerDetails([]);
            }
        } catch (err) {
            setLedgerDetails([]);
        } finally {
            setLoadingLedger(false);
        }
    };

    const handleOpenLedger = (row) => {
        setSelectedRow(row);
        setOpen(true);
        fetchLedgerDetails(row.user_id);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
        setLedgerDetails([]);
    };

    const fetchSummaryReportData = async () => {
        if (!valanId) return; // prevent fetching if no valanId
        setLoading(true);
        try {
            const result = await fetchSelfplAPI(
                client?.id,
                master?.id,
                broker?.id,
                end_date,
                start_end,
                market?.id,
                formatScriptIds(script),
                valanId?.id
            );

            const formattedData = Object.entries(result).map(([key, value], index) => ({
                ...value,
                user_id: key,
                index: index + 1,
            }));

            setReportData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error("Error fetching summary report data:", error);
            setReportData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data only when valanId changes
    // useEffect(() => {
    //     if (valanId) {
    //         fetchSummaryReportData();
    //     } else {
    //         setReportData([]);
    //         setFilteredData([]);
    //     }
    // }, [valanId]);

    // Filter search
    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = reportData.filter(
            (row) =>
                row.user_name?.toLowerCase().includes(query) ||
                row.user_code?.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
        setCurrentPage(0);
    }, [searchQuery, reportData]);

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        currentPage * rowsPerPage,
        (currentPage + 1) * rowsPerPage
    );

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fafafa",
            }}
        >
            {/* Sticky Filters + Search */}
            <Box
                sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 20,
                    background: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "#333" : "#e5e5e5"}`,
                    p: 1,
                }}
            >
                {/* Filters */}
                {/* <Box sx={{ width: 300 }}>
                    <ValanFilter valanId={valanId} setValanId={setValanId} />
                </Box> */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: 300 }}>
                    <ValanFilter valanId={valanId} setValanId={setValanId} />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={fetchSummaryReportData}
                        disabled={!valanId || loading}
                        sx={{ borderRadius: 1, mb: 0.5 }}
                    >
                        {loading ? "Submit" : "Submit"}
                    </Button>
                </Box>


                <Box sx={{ mt: 1 }}>
                    <SearchPdfCsv
                        placeholder="Search by name or code"
                        searchText={searchQuery}
                        setSearchText={setSearchQuery}
                        logs={paginatedData}
                        colArr={colArr}
                        keyArr={keyArr}
                        isLoading={loading}
                    />
                </Box>
            </Box>

            {/* Scrollable Content Area */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
                {!valanId ? (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Typography variant="h6" color="text.secondary">
                            Please select a Valan ID to view data
                        </Typography>
                    </Box>
                ) : isMobile ? (
                    <Grid container spacing={0.75}>
                        {loading ? (
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                    <CircularProgress size={30} />
                                </Box>
                            </Grid>
                        ) : paginatedData.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography align="center" sx={{ py: 2 }}>
                                    No Data Found
                                </Typography>
                            </Grid>
                        ) : (
                            paginatedData.map((row) => {
                                const m2mColor = Number(row.self_m2m ?? 0) >= 0 ? "#1976d2" : "#d32f2f";
                                return (
                                    <Grid item xs={12} key={row.sr_no}>
                                        <Card
                                            sx={{
                                                borderLeft: `4px solid ${m2mColor}`,
                                                boxShadow: 1,
                                            }}
                                        >
                                            <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {row.user_name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {row.bill_amount}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {row.user_type}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>
                ) : (
                    <Box sx={{ overflowX: "auto" }}>
                        <table
                            className="table table-striped table-bordered"
                            style={{
                                minWidth: "500px",
                                fontSize: "12px",
                                margin: 0,
                                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                whiteSpace: "nowrap",
                                borderCollapse: "collapse",
                            }}
                        >
                            <thead
                                style={{
                                    backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 5,
                                }}
                            >
                                <tr>
                                    {["Serial No", "Name", "bill_amount", "user_type"].map((header) => (
                                        <th key={header} style={{ padding: "8px 12px", fontWeight: 600 }}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={12} style={{ textAlign: "center", padding: 40 }}>
                                            <CircularProgress size={30} />
                                        </td>
                                    </tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={12} style={{ padding: 16, textAlign: "center" }}>
                                            No Data Found
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedData.map((row, idx) => (
                                        <tr key={row.sr_no}
                                            style={{
                                                backgroundColor:
                                                    row.sr_no % 2 === 0
                                                        ? theme.palette.mode === "dark"
                                                            ? "#333" // dark mode stripe (even rows)
                                                            : "#fff" // light mode stripe (even rows)
                                                        : theme.palette.mode === "dark"
                                                            ? "#222" // darker alt for dark mode (odd rows)
                                                            : "#e0e0e0", // darker grey for light mode (odd rows)
                                            }}>
                                            {/* <td>{idx + 1 + currentPage * rowsPerPage}</td> */}
                                            <td>{row.sr_no}</td>
                                            <td>{row.user_name}</td>
                                            <td>{row.bill_amount}</td>
                                            <td>{row.user_type}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Box>
                )}

                {/* Pagination */}
                {valanId && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                    />
                )}
            </Box>
        </Box>
    );
};
export default Selfpl;
