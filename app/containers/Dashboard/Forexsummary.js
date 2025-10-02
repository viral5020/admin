import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchforexSummaryReportAPI, fetchLedgerDetailsAPI } from "./API/API";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FilterListIcon from "@mui/icons-material/FilterList";
import Forexsummaryfilter from "./Forexsummaryfilter";
import { formatScriptIds } from "./helpers/utilFunc";
import SearchPdfCsv from "./filters/SearchPdfCsv";
import Pagination from "./filters/Pagination";

const colArr = [
  "Sr No",
  "Name",
  "Code",
  // "Ledger",
  // "All",
  // "Outstanding",
  "Net MTM",
  "Total MTM",
  "Downline MTM",
  "Upline MTM",
  "Self MTM",
  // "Net Position",
]

const keyArr = [
  // "user_id",
  "index",
  "user_name",
  "user_code",
  // "mcx_pdf",
  // "nse_pdf",
  { isDesimal: true, name: "netm2m" },
  { isDesimal: true, name: "totalm2m" },
  { isDesimal: true, name: "downline_amount" },
  { isDesimal: true, name: "upline_amount" },
  { isDesimal: true, name: "self_m2m" },
  // "net_pdf"
]

const Summary_report = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLedger, setLoadingLedger] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [start_end, setStart_end] = useState(null);
  const [end_date, setEnd_date] = useState(null);
  const [market, setMarket] = useState(null);
  const [script, setScript] = useState(null);
  const [client, setClient] = useState(null);
  const [master, setMaster] = useState(null);
  const [broker, setBroker] = useState(null);
  const [valanId, setValanId] = useState(null);
  const [appliedValanId, setAppliedValanId] = useState(null);


  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [ledgerDetails, setLedgerDetails] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ---------- Helpers ----------
  const openSecuredPdf = (filePath) => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!dataStored) {
      alert("Session expired. Please log in again.");
      return;
    }
    const BASE_URL = "http://128.199.126.171/~goldorg/";
    const authKey = dataStored.auth_key;
    const loginUserId = dataStored.user_id;
    const fullUrl = filePath.startsWith("http") ? filePath : `${BASE_URL}${filePath}`;
    const url = new URL(fullUrl);
    url.searchParams.set("is", "1");
    url.searchParams.set("k", authKey);
    url.searchParams.set("lui", loginUserId);
    window.open(url.toString(), "_blank");
  };

  // ---------- Ledger ----------
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

  // ---------- Report ----------
  const fetchforexSummaryReportData = async () => {
    setAppliedValanId(valanId);
    setLoading(true);

    try {
      const result = await fetchforexSummaryReportAPI(
        client?.id,
        master?.id,
        broker?.id,
        end_date,
        start_end,
        market?.id,
        formatScriptIds(script),
        valanId?.id
      );

      const formattedData = Object.entries(result || {}).map(([key, value], index) => ({
        ...value,
        user_id: key,
        index: index + 1,
      }));

      setReportData(formattedData);
      setFilteredData(formattedData);
    } catch (e) {
      console.error("fetchforexSummaryReportData error:", e);
      setReportData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchforexSummaryReportData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Search filter
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

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // ---------- Layout ----------
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
        {isMobile ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={() => setDrawerOpen(true)} color="primary">
                <FilterListIcon />
              </IconButton>
              {/* <Typography variant="subtitle1" sx={{ flex: 0, mr: 1 }}>
                Filters
              </Typography> */}
              <SearchPdfCsv
                searchText={searchQuery}
                setSearchText={setSearchQuery}
                logs={paginatedData}
                colArr={colArr}
                keyArr={keyArr}

              />
            </Box>

            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 300, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <Forexsummaryfilter
                  isDarkMode={theme.palette.mode === "dark"}
                  start_end={start_end}
                  setStart_end={setStart_end}
                  end_date={end_date}
                  setEnd_date={setEnd_date}
                  market={market}
                  setMarket={setMarket}
                  script={script}
                  setScript={setScript}
                  client={client}
                  setClient={setClient}
                  master={master}
                  setMaster={setMaster}
                  broker={broker}
                  setBroker={setBroker}
                  valanId={valanId}
                  setValanId={setValanId}
                  isMobile={isMobile}
                  onApply={() => {
                    fetchforexSummaryReportData();
                    setDrawerOpen(false);
                  }}
                />
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Forexsummaryfilter
              isDarkMode={theme.palette.mode === "dark"}
              start_end={start_end}
              setStart_end={setStart_end}
              end_date={end_date}
              setEnd_date={setEnd_date}
              market={market}
              setMarket={setMarket}
              script={script}
              setScript={setScript}
              client={client}
              setClient={setClient}
              master={master}
              setMaster={setMaster}
              broker={broker}
              setBroker={setBroker}
              valanId={valanId}
              setValanId={setValanId}
              isMobile={isMobile}
              onApply={fetchforexSummaryReportData}
            />

            {/* Search row desktop */}
            <SearchPdfCsv
              searchText={searchQuery}
              setSearchText={setSearchQuery}
              logs={paginatedData}
              colArr={colArr}
              keyArr={keyArr}

            />
          </>
        )}
      </Box>

      {/* Scrollable Content Area (vertical) */}
      <Box sx={{ overflowY: "auto", p: 1 }}>
        {isMobile ? (
          // -------- Mobile Card View (loader inside this area) --------
          <Grid container spacing={0.75}>
            {!appliedValanId ? (
              <Grid item xs={12}>
                <Box textAlign="center" py={5} fontSize="0.9rem" color="#dd1b1b">
                  Please select Valan ID
                </Box>
              </Grid>
            ) : loading ? (
              <Grid item xs={12}>
                <Box textAlign="center" py={3}>
                  <CircularProgress size={30} />
                </Box>
              </Grid>
            ) : paginatedData.length === 0 ? (
              <Grid item xs={12}>
                <Box textAlign="center" py={2} fontSize="0.9rem">
                  No Data Found
                </Box>
              </Grid>
            ) : (
              paginatedData.map((row) => {
                const m2mColor = Number(row.self_m2m ?? 0) >= 0 ? "#1976d2" : "#d32f2f";
                return (
                  <Grid item xs={12} key={row.user_id}>
                    <Card
                      sx={{
                        borderLeft: `4px solid ${m2mColor}`,
                        boxShadow: 1,
                      }}
                    >
                      <CardContent sx={{ p: 1.25, "&:last-child": { pb: 1.25 } }}>
                        {/* Top: Name & Code */}
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2" fontWeight={600}>
                            {row.user_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            #{row.user_code}
                          </Typography>
                        </Box>

                        {/* Ledger amount */}
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Ledger: ₹{Number(row.ledger_amt ?? 0).toLocaleString()}
                        </Typography>

                        {/* MTM Row */}
                        <Box display="flex" justifyContent="space-between" sx={{ mt: 0.5 }}>
                          <Typography variant="body2">Net MTM: {row.netm2m}</Typography>
                          <Typography variant="body2">Total MTM: {row.totalm2m}</Typography>
                        </Box>

                        {/* PDFs + Ledger button */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={0.75}
                        >
                          <Box display="flex" gap={1}>
                            {/* MCX */}
                            {row.mcx_pdf && row.mcx_pdf.trim() !== "" && (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                sx={{ cursor: "pointer" }}
                                onClick={() => openSecuredPdf(row.mcx_pdf)}
                              >
                                <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                                <Typography variant="caption" sx={{ fontSize: "0.65rem", mt: 0.2 }}>
                                  MCX
                                </Typography>
                              </Box>
                            )}
                            {/* NSE */}
                            {row.nse_pdf && row.nse_pdf.trim() !== "" && (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                sx={{ cursor: "pointer" }}
                                onClick={() => openSecuredPdf(row.nse_pdf)}
                              >
                                <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                                <Typography variant="caption" sx={{ fontSize: "0.65rem", mt: 0.2 }}>
                                  NSE
                                </Typography>
                              </Box>
                            )}
                            {/* NET */}
                            {row.net_pdf && row.net_pdf.trim() !== "" && (
                              <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                sx={{ cursor: "pointer" }}
                                onClick={() => openSecuredPdf(row.net_pdf)}
                              >
                                <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                                <Typography variant="caption" sx={{ fontSize: "0.65rem", mt: 0.2 }}>
                                  NET
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ p: 0.5, minWidth: "auto" }}
                            onClick={() => handleOpenLedger(row)}
                          >
                            Show Ledger
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        ) : (
          // -------- Desktop Table (only this scrolls horizontally) --------
          <Box sx={{ overflowX: "auto" }}>
            <table
              className="table table-striped table-bordered"
              style={{
                minWidth: "1650px",
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
                  {[
                    "Serial No",
                    "Name",
                    "Code",
                    "Ledger",
                    "All",
                    "Outstanding",
                    "Net MTM",
                    "Total MTM",
                    "Downline MTM",
                    "Upline MTM",
                    "Self MTM",
                    "Net Position",
                  ].map((header) => (
                    <th key={header} style={{ padding: "8px 12px", fontWeight: 600 }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!appliedValanId ? (
                  <tr>
                    <td colSpan={12} style={{ textAlign: "left", padding: 40, fontSize: "0.9rem", color: "#dd1b1b" }}>
                      Please select Valan ID
                    </td>
                  </tr>
                ) : loading ? (
                  <tr>
                    <td colSpan={12} style={{ padding: 20, position: 'relative', left: '45vw' }}>
                      <CircularProgress size={30} />
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={12} style={{ padding: 16, textAlign: "left", fontSize: "0.9rem", }}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr key={row.user_id}>
                      <td>{row.index}</td>
                      <td>{row.user_name}</td>
                      <td>{row.user_code}</td>
                      <td>
                        <Button onClick={() => handleOpenLedger(row)}>Ledger</Button>
                      </td>
                      {/* All (MCX) */}
                      <td>
                        {row.mcx_pdf && row.mcx_pdf.trim() !== "" && (
                          <IconButton
                            size="small"
                            onClick={() => openSecuredPdf(row.mcx_pdf)}
                            sx={{ p: 0.3 }}
                          >
                            <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                          </IconButton>
                        )}
                      </td>
                      {/* Outstanding (NSE) */}
                      <td>
                        {row.nse_pdf && row.nse_pdf.trim() !== "" && (
                          <IconButton
                            size="small"
                            onClick={() => openSecuredPdf(row.nse_pdf)}
                            sx={{ p: 0.3 }}
                          >
                            <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                          </IconButton>
                        )}
                      </td>
                      <td>{Number(row.netm2m ?? 0).toFixed(2)}</td>
                      <td>{Number(row.totalm2m ?? 0).toFixed(2)}</td>
                      <td>{Number(row.downline_amount ?? 0).toFixed(2)}</td>
                      <td>{Number(row.upline_amount ?? 0).toFixed(2)}</td>
                      <td>{Number(row.self_m2m ?? 0).toFixed(2)}</td>
                      {/* Net Position (NET) */}
                      <td>
                        {row.net_pdf && row.net_pdf.trim() !== "" && (
                          <IconButton
                            size="small"
                            onClick={() => openSecuredPdf(row.net_pdf)}
                            sx={{ p: 0.3 }}
                          >
                            <PictureAsPdfIcon sx={{ color: "#d32f2f", fontSize: "1.2rem" }} />
                          </IconButton>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Box>
        )}
      </Box>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
      />

      {/* Ledger Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Ledger Details</DialogTitle>
        <DialogContent dividers sx={{ p: 0.5 }}>
          {loadingLedger ? (
            <Box sx={{ textAlign: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : ledgerDetails.length > 0 ? (
            <Grid container spacing={0.5}>
              {ledgerDetails.map((entry, idx) => {
                const isBuy = Number(entry.credit) > 0;
                const borderColor = isBuy ? "#1976d2" : "#d32f2f";
                return (
                  <Grid item xs={12} md={6} key={idx}>
                    <Box
                      sx={{
                        border: `2px solid ${borderColor}`,
                        borderRadius: "8px",
                        p: 1,
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                      }}
                    >
                      {/* Top: Name & Date */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {entry.valan_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {entry.date}
                        </Typography>
                      </Box>

                      {/* Values + PDF */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="body2">
                          {entry.debit !== "-" ? `₹${Number(entry.debit).toLocaleString()}` : "-"}
                        </Typography>
                        <Typography variant="body2">
                          {entry.credit !== "-" ? `₹${Number(entry.credit).toLocaleString()}` : "-"}
                        </Typography>
                        <Typography variant="body2">
                          ₹{Number(entry.balance ?? 0).toLocaleString()}
                        </Typography>

                        {entry.download && entry.download.trim() !== "" ? (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              openSecuredPdf(entry.download);
                            }}
                            style={{
                              fontSize: "0.75rem",
                              color: "#1976d2",
                              fontWeight: 500,
                              textDecoration: "none",
                            }}
                          >
                            PDF
                          </a>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                            No PDF
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No ledger data found.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Summary_report;
