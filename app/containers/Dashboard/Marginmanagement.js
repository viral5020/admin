import React, { useEffect, useState } from "react";
import { fetchMarginManagementListAPI } from "./API/API";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Drawer,
  IconButton,
  Grid,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClientMasterBrokerFilter from "./filters/ClientMasterBrokerFilter";

const Marginmanagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  // Filter states
  const [client, setClient] = useState(null);
  const [master, setMaster] = useState(null);
  const [broker, setBroker] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchMarginManagementListData = async () => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!dataStored?.user_id || !dataStored?.auth_key) return;

    setLoading(true);
    const result = await fetchMarginManagementListAPI(
      dataStored.user_id,
      dataStored.auth_key,
      client, master, broker,
    );

    const formattedData = Array.isArray(result)
      ? result.map((item, index) => ({ ...item, index: index + 1 }))
      : [];

    setReportData(formattedData);
    setFilteredData(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchMarginManagementListData();
  }, []);

  // Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = reportData.filter(
      (row) =>
        row.user_details?.toLowerCase().includes(query) ||
        row.user_code?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [searchQuery, reportData]);

  // Apply Filters
  const handleApplyFilters = () => {
    let filtered = [...reportData];

    const clientValue = client?.text?.toLowerCase() || "";
    const masterValue = master?.text?.toLowerCase() || "";
    const brokerValue = broker?.text?.toLowerCase() || "";

    if (clientValue) {
      filtered = filtered.filter(
        (row) => row.client_name?.toLowerCase() === clientValue
      );
    }
    if (masterValue) {
      filtered = filtered.filter(
        (row) => row.master_name?.toLowerCase() === masterValue
      );
    }
    if (brokerValue) {
      filtered = filtered.filter(
        (row) => row.broker_name?.toLowerCase() === brokerValue
      );
    }

    setFilteredData(filtered);
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
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
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            component: "form",
            onSubmit: (e) => {
              e.preventDefault();
              handleApplyFilters();
              setDrawerOpen(false);
            },
          }}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <ClientMasterBrokerFilter
              client={client}
              master={master}
              broker={broker}
              setClient={setClient}
              setMaster={setMaster}
              setBroker={setBroker}
              showClient={true}
              showMaster={true}
              showBroker={true}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={fetchMarginManagementListData}
            >
              Apply
            </Button>
          </Box>
        </Drawer>
      ) : (
        <Box sx={{ mb: 2, p: 1 }}>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleApplyFilters();
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <ClientMasterBrokerFilter
                client={client}
                master={master}
                broker={broker}
                setClient={setClient}
                setMaster={setMaster}
                setBroker={setBroker}
                showClient={true}
                showMaster={true}
                showBroker={true}
              />
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ minWidth: 100, borderRadius: 0, height: 38, mt: -0.5 }}
                  onClick={fetchMarginManagementListData}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        {isMobile && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            color="primary"
            sx={{ mr: 1 }}
          >
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
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Table */}
      <table
        className="table table-striped table-bordered"
        style={{
          minWidth: "1200px",
          fontSize: "12px",
          margin: 0,
          backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          whiteSpace: "nowrap",
        }}
      >
        <thead
          style={{
            backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
          }}
        >
          <tr>
            {[
              "Name",
              "Code",
              "NSEFUT",
              "MCXFUT",
              "NSE OPT",
              "Global",
              "NSEeqt",
              "Forex",
              "Comex",
              "Total",
            ].map((header) => (
              <th
                key={header}
                style={{ padding: "8px 12px", fontWeight: 600 }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ padding: 16, textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          ) : (
            paginatedData.map((row, index) => (
              <tr key={row.user_code || index}>
                <td>{row.user_details}</td>
                <td>{row.user_code}</td>
                <td>{row.nse_margin ?? 0}</td>
                <td>{row.mcx_margin ?? 0}</td>
                <td>{row.nseopt_margin ?? 0}</td>
                <td>{row.global_margin ?? 0}</td>
                <td>{row.nseeqt_margin ?? 0}</td>
                <td>{row.forex_margin ?? 0}</td>
                <td>{row.comex_margin ?? 0}</td>
                <td>{row.total ?? 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Marginmanagement;
