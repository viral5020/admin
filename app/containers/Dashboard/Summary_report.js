import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchSummaryReportAPI } from "./API/API";
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

const Summary_report = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [start_end, setStart_end] = useState(null);
  const [end_date, setEnd_date] = useState(null);
  const [market, setMarket] = useState(null);
  const [script, setScript] = useState([]);
  const [client, setClient] = useState(null);
  const [master, setMaster] = useState(null);
  const [broker, setBroker] = useState(null);
  const [valanId, setValanId] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [ledgerDetails, setLedgerDetails] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchLedgerDetails = async (userId) => {
    setLoadingLedger(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const payload = {
        is_app: '1',
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: userId,
      };

      const response = await axios.post(
        'http://128.199.126.171/~goldorg/ajaxfiles/get_user_valan_wise_bill',
        payload
      );

      if (response.data.status === 'ok' && Array.isArray(response.data.data)) {
        const filtered = response.data.data.filter(item => item.valan_name !== 'Opening Balance');
        setLedgerDetails(filtered);
      } else {
        setLedgerDetails([]);
      }
    } catch (err) {
      console.error('Error fetching ledger details:', err);
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
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!dataStored?.user_id || !dataStored?.auth_key) return;

    setLoading(true);
    const result = await fetchSummaryReportAPI(dataStored.user_id, dataStored.auth_key);

    const formattedData = Object.entries(result).map(([key, value], index) => ({
      ...value,
      user_id: key,
      index: index + 1,
    }));

    setReportData(formattedData);
    setFilteredData(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchSummaryReportData();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = reportData.filter((row) =>
      row.user_name?.toLowerCase().includes(query) ||
      row.user_code?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [searchQuery, reportData]);

  const handleApplyFilters = () => {
    let filtered = [...reportData];
    if (valanId) filtered = filtered.filter((row) => row.valan_id === valanId);
    if (start_end) filtered = filtered.filter((row) => new Date(row.trade_date) >= new Date(start_end));
    if (end_date) filtered = filtered.filter((row) => new Date(row.trade_date) <= new Date(end_date));
    if (market) filtered = filtered.filter((row) => row.market === market);
    if (script?.length > 0) filtered = filtered.filter((row) => script.includes(row.script));
    if (client) filtered = filtered.filter((row) => row.client === client);
    if (master) filtered = filtered.filter((row) => row.master === master);
    if (broker) filtered = filtered.filter((row) => row.broker === broker);

    setFilteredData(filtered);
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh"
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <div style={{ overflowX: "auto", padding: 16 }}>
      {/* Filters */}
      {isMobile ? (
        <>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              component: 'form',
              onSubmit: (e) => {
                e.preventDefault();
                handleApplyFilters();
                setDrawerOpen(false);
              },
            }}
          >
            <Box sx={{ width: 300, p: 2 }}>
              <Typography variant="h6" gutterBottom>Filters</Typography>
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
              />
              {/* <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Apply</Button> */}
            </Box>
          </Drawer>
        </>
      ) : (
        <Box sx={{ mb: 2 }}>
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
            onApply={handleApplyFilters}
          />
        </Box>
      )}

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} color="primary" sx={{ mr: 1 }}>
            <FilterListIcon />
          </IconButton>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "6px 10px",
            fontSize: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />
      </div>

      {isMobile ? (
        <Grid container spacing={0.5}>
          {paginatedData.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" sx={{ py: 1 }}>No Data Found</Typography>
            </Grid>
          ) : (
            paginatedData.map((row) => (
              <Grid item xs={12} key={row.user_id}>
                <Card
                  sx={{
                    borderLeft: `4px solid ${Number(row.self_m2m) >= 0 ? "#1976d2" : "#d32f2f"}`,
                    boxShadow: 1
                  }}
                >
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    {/* Top row: Name & Code */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" fontWeight={600}>
                        {row.user_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{row.user_code}
                      </Typography>
                    </Box>

                    {/* Ledger amt */}
                    <Typography variant="body2">
                      Ledger: ₹{row.ledger_amt?.toLocaleString()}
                    </Typography>

                    {/* MTM Row */}
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Net MTM: {row.netm2m}</Typography>
                      <Typography variant="body2">Total MTM: {row.totalm2m}</Typography>
                    </Box>

                    {/* PDF + Ledger button in one row */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <Box display="flex" gap={0.5}>
                        {/* MCX */}
                        {row.mcx_pdf && row.mcx_pdf.trim() !== '' && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              const dataStored = JSON.parse(sessionStorage.getItem("data"));
                              if (!dataStored) {
                                alert("Session expired. Please log in again.");
                                return;
                              }
                              const BASE_URL = 'http://128.199.126.171/~goldorg/';
                              const authKey = dataStored.auth_key;
                              const loginUserId = dataStored.user_id;
                              const filePath = row.mcx_pdf;
                              const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                              const url = new URL(fullUrl);
                              url.searchParams.set('is', '1');
                              url.searchParams.set('k', authKey);
                              url.searchParams.set('lui', loginUserId);
                              window.open(url.toString(), '_blank');
                            }}
                          >
                            <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.2 }}>
                              MCX
                            </Typography>
                          </Box>
                        )}

                        {/* NSE */}
                        {row.nse_pdf && row.nse_pdf.trim() !== '' && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              const dataStored = JSON.parse(sessionStorage.getItem("data"));
                              if (!dataStored) {
                                alert("Session expired. Please log in again.");
                                return;
                              }
                              const BASE_URL = 'http://128.199.126.171/~goldorg/';
                              const authKey = dataStored.auth_key;
                              const loginUserId = dataStored.user_id;
                              const filePath = row.nse_pdf;
                              const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                              const url = new URL(fullUrl);
                              url.searchParams.set('is', '1');
                              url.searchParams.set('k', authKey);
                              url.searchParams.set('lui', loginUserId);
                              window.open(url.toString(), '_blank');
                            }}
                          >
                            <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.2 }}>
                              NSE
                            </Typography>
                          </Box>
                        )}

                        {/* NET */}
                        {row.net_pdf && row.net_pdf.trim() !== '' && (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              const dataStored = JSON.parse(sessionStorage.getItem("data"));
                              if (!dataStored) {
                                alert("Session expired. Please log in again.");
                                return;
                              }
                              const BASE_URL = 'http://128.199.126.171/~goldorg/';
                              const authKey = dataStored.auth_key;
                              const loginUserId = dataStored.user_id;
                              const filePath = row.net_pdf;
                              const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                              const url = new URL(fullUrl);
                              url.searchParams.set('is', '1');
                              url.searchParams.set('k', authKey);
                              url.searchParams.set('lui', loginUserId);
                              window.open(url.toString(), '_blank');
                            }}
                          >
                            <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.2 }}>
                              NET
                            </Typography>
                          </Box>
                        )}


                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ p: 0.5, minWidth: 'auto' }}
                        onClick={() => handleOpenLedger(row)}
                      >
                        Show Ledger
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      ) : (

        <table
          className="table table-striped table-bordered"
          style={{
            minWidth: "1650px",
            fontSize: "12px",
            margin: 0,
            backgroundColor:
              theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            whiteSpace: "nowrap",
          }}
        >
          <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
            <tr>
              {[
                "Serial No", "Name", "Code", "Ledger", "Ledger Amount",
                "All", "Outstanding", "Net MTM", "Total MTM",
                "Downline MTM", "Upline MTM", "Self MTM", "Net Position"
              ].map((header) => (
                <th key={header} style={{ padding: "8px 12px", fontWeight: 600 }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="13" style={{ padding: 16, textAlign: "center" }}>No Data Found</td>
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
                  <td>{row.ledger_amt?.toLocaleString()}</td>
                  <td>
                    {row.mcx_pdf && row.mcx_pdf.trim() !== '' && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const dataStored = JSON.parse(sessionStorage.getItem("data"));
                          if (!dataStored) {
                            alert("Session expired. Please log in again.");
                            return;
                          }

                          const BASE_URL = 'http://128.199.126.171/~goldorg/';
                          const authKey = dataStored.auth_key;
                          const loginUserId = dataStored.user_id;

                          const filePath = row.mcx_pdf;

                          const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                          const url = new URL(fullUrl);

                          url.searchParams.set('is', '1');
                          url.searchParams.set('k', authKey);
                          url.searchParams.set('lui', loginUserId);

                          window.open(url.toString(), '_blank');
                        }}
                        sx={{ p: 0.3 }}
                      >
                        <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                      </IconButton>
                    )}

                  </td>

                  <td>
                    {row.nse_pdf && row.nse_pdf.trim() !== '' && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const dataStored = JSON.parse(sessionStorage.getItem("data"));
                          if (!dataStored) {
                            alert("Session expired. Please log in again.");
                            return;
                          }

                          const BASE_URL = 'http://128.199.126.171/~goldorg/';
                          const authKey = dataStored.auth_key;
                          const loginUserId = dataStored.user_id;

                          const filePath = row.nse_pdf;

                          const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                          const url = new URL(fullUrl);

                          url.searchParams.set('is', '1');
                          url.searchParams.set('k', authKey);
                          url.searchParams.set('lui', loginUserId);

                          window.open(url.toString(), '_blank');
                        }}
                        sx={{ p: 0.3 }}
                      >
                        <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                      </IconButton>
                    )}

                  </td>
                  <td>{row.netm2m}</td>
                  <td>{row.totalm2m}</td>
                  <td>{row.downline_amount}</td>
                  <td>{row.upline_amount}</td>
                  <td>{row.self_m2m}</td>
                  <td>
                    {row.net_pdf && row.net_pdf.trim() !== '' && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const dataStored = JSON.parse(sessionStorage.getItem("data"));
                          if (!dataStored) {
                            alert("Session expired. Please log in again.");
                            return;
                          }

                          const BASE_URL = 'http://128.199.126.171/~goldorg/';
                          const authKey = dataStored.auth_key;
                          const loginUserId = dataStored.user_id;

                          const filePath = row.net_pdf;

                          const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                          const url = new URL(fullUrl);

                          url.searchParams.set('is', '1');
                          url.searchParams.set('k', authKey);
                          url.searchParams.set('lui', loginUserId);

                          window.open(url.toString(), '_blank');
                        }}
                        sx={{ p: 0.3 }}
                      >
                        <PictureAsPdfIcon sx={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                      </IconButton>
                    )}

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* 📘 Ledger Dialog - Card View */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Ledger Details</DialogTitle>
        <DialogContent dividers sx={{ p: 0.5 }}>
          {/* {selectedRow && (
      <>
        <Typography variant="body2">
          <strong>User Name:</strong> {selectedRow.user_name}
        </Typography>
        <Typography variant="body2">
          <strong>User Code:</strong> {selectedRow.user_code}
        </Typography>
      </>
    )} */}

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
                      {/* Top: Name (left) and Date (right) */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {entry.valan_name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {entry.date}
                        </Typography>
                      </Box>

                      {/* Bottom Row: Values + PDF */}
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
                          ₹{Number(entry.balance).toLocaleString()}
                        </Typography>
                        {entry.download && entry.download.trim() !== '' ? (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();

                              const dataStored = JSON.parse(sessionStorage.getItem("data"));
                              if (!dataStored) {
                                alert("Session expired. Please log in again.");
                                return;
                              }

                              const BASE_URL = 'http://128.199.126.171/~goldorg/';
                              const authKey = dataStored.auth_key;
                              const loginUserId = dataStored.user_id;

                              const filePath = entry.download;
                              const fullUrl = filePath.startsWith('http') ? filePath : `${BASE_URL}${filePath}`;
                              const url = new URL(fullUrl);

                              url.searchParams.set('is', '1');
                              url.searchParams.set('k', authKey);
                              url.searchParams.set('lui', loginUserId);

                              window.open(url.toString(), '_blank');
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
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem" }}
                          >
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


      {/* 🔽 Pagination */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mt: 2 }}>
        <Button size="small" disabled={currentPage === 0} onClick={() => setCurrentPage((prev) => prev - 1)} color="secondary" sx={{ mr: 1 }}>Prev</Button>
        {[...Array(totalPages)].map((_, i) => {
          if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
            return (
              <Button key={i} size="small" variant={i === currentPage ? "contained" : "outlined"} color="secondary" onClick={() => setCurrentPage(i)} sx={{ mx: 0.3 }}>{i + 1}</Button>
            );
          }
          if ((i === 1 && currentPage > 2) || (i === totalPages - 2 && currentPage < totalPages - 3)) {
            return <Typography key={i} sx={{ mx: 0.5 }}>...</Typography>;
          }
          return null;
        })}
        <Button size="small" disabled={currentPage + 1 >= totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} color="secondary" sx={{ ml: 1 }}>Next</Button>
        <TextField
          label="Go to page"
          type="number"
          size="small"
          InputProps={{ inputProps: { min: 1, max: totalPages } }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = parseInt(e.target.value, 10) - 1;
              if (!isNaN(page) && page >= 0 && page < totalPages) {
                setCurrentPage(page);
              }
            }
          }}
          sx={{ width: 100, ml: 2 }}
        />
      </Box>
    </div>
  );
};

export default Summary_report;
