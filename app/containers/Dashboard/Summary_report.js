import React, { useEffect, useState } from "react";
import { fetchSummaryReportAPI } from "./API/API";
import { useTheme } from "@mui/material/styles";
import { Box, Button, TextField, Typography } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// 🔽 Import the filter component
import Forexsummaryfilter from './Forexsummaryfilter';

const Summary_report = () => {
  const theme = useTheme();

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  // 🔽 Filter States
  const [start_end, setStart_end] = useState(null);
  const [end_date, setEnd_date] = useState(null);
  const [market, setMarket] = useState(null);
  const [script, setScript] = useState([]);
  const [client, setClient] = useState(null);
  const [master, setMaster] = useState(null);
  const [broker, setBroker] = useState(null);
  const [valanId, setValanId] = useState(null);

  // 🔽 Fetch Data
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

  // 🔍 Handle Text Search
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = reportData.filter((row) =>
      row.user_name?.toLowerCase().includes(query) ||
      row.user_code?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [searchQuery, reportData]);

  // 🔽 Called when Apply button is clicked
  const handleApplyFilters = () => {
    // Example filtering logic (you can customize this as needed)
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

  if (loading) return <div style={{ padding: 16, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ overflowX: "auto", padding: 16 }}>
      {/* 🔽 Filter Component at the Top */}
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

      {/* 🔍 Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "6px 10px",
            fontSize: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "250px",
          }}
        />
      </div>

      {/* 🧾 Table */}
      <table
        className="table table-striped table-bordered"
        style={{
          minWidth: "1650px",
          fontSize: "12px",
          margin: 0,
          backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          whiteSpace: "nowrap",
        }}
      >
        <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
          <tr>
            {[
              "Serial No", "Name", "Code", "Ledger", "Ledger Amount",
              "All MCX PDF", "Outstanding NSE PDF", "Net MTM", "Total MTM",
              "Downline MTM", "Upline MTM", "Self MTM", "Net Position PDF"
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
                <td>Ledger</td>
                <td>{row.ledger_amt?.toLocaleString()}</td>
                <td><a href={row.mcx_pdf} target="_blank" rel="noopener noreferrer"><PictureAsPdfIcon sx={{ fontSize: '1rem', color: '#1976d2' }} /></a></td>
                <td><a href={row.nse_pdf} target="_blank" rel="noopener noreferrer"><PictureAsPdfIcon sx={{ fontSize: '1rem', color: '#1976d2' }} /></a></td>
                <td>{row.netm2m}</td>
                <td>{row.totalm2m}</td>
                <td>{row.downline_amount}</td>
                <td>{row.upline_amount}</td>
                <td>{row.self_m2m}</td>
                <td><a href={row.net_pdf} target="_blank" rel="noopener noreferrer"><PictureAsPdfIcon sx={{ fontSize: '1rem', color: '#1976d2' }} /></a></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 📄 Pagination */}
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
