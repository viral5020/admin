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
import SearchPdfCsv from "./filters/SearchPdfCsv";
import Pagination from './filters/Pagination';
import FilterBtn from "./filters/FilterBtn";

const colArr = [
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
]

const keyArr = [
  "user_details",
  "user_code",
  "nse_margin",
  "mcx_margin",
  "nseopt_margin",
  "global_margin",
  "nseeqt_margin",
  "forex_margin",
  "comex_margin",
  "total",
]

const Marginmanagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 10;

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
      client,
      master,
      broker
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

  const handleClearFilters = () => {
    setClient(null);
    setMaster(null);
    setBroker(null);
    setSearchQuery("");
    setFilteredData(reportData);
    setCurrentPage(0);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <Box sx={{ height: "70h", display: "flex", flexDirection: "column" }}>
      {/* Filters & Search */}
      <Box sx={{ p: 2, borderBottom: "1px solid #ddd" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              color="primary"
              sx={{
                mr: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                p: 1,
              }}
            >
              <FilterBtn />
            </IconButton>
          )}
          <SearchPdfCsv
            searchText={searchQuery}
            setSearchText={setSearchQuery}
            logs={paginatedData}
            colArr={[]}
            keyArr={[]}
          />
        </Box>

        {/* Desktop filters */}
        {!isMobile && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }}>
            <Grid container spacing={2} alignItems="center">
              <ClientMasterBrokerFilter
                client={client}
                master={master}
                broker={broker}
                setClient={setClient}
                setMaster={setMaster}
                setBroker={setBroker}
                showClient
                showMaster
                showBroker
              />
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ minWidth: 100, borderRadius: 2, height: 38 }}
                  onClick={fetchMarginManagementListData}
                >
                  Apply
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 100, borderRadius: 2, height: 38 }}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

      {/* Mobile Drawer */}
      {isMobile && (
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
              showClient
              showMaster
              showBroker
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 1, borderRadius: 2 }}
              onClick={fetchMarginManagementListData}
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              sx={{ mt: 2, borderRadius: 2 }}
              onClick={() => {
                handleClearFilters();
                setDrawerOpen(false);
              }}
            >
              Clear
            </Button>
          </Box>
        </Drawer>
      )}

      {/* Table */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
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
          <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
            <tr>
              {["Name", "Code", "NSEFUT", "MCXFUT", "NSE OPT", "Global", "NSEeqt", "Forex", "Comex", "Total"].map((header) => (
                <th key={header} style={{ padding: "8px 12px", fontWeight: 600 }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: 30 }}>
                  <Box display="flex" justifyContent="center">
                    <CircularProgress size={30} />
                  </Box>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ padding: 16, textAlign: "center" }}>
                  No Data Found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.user_code || index}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? theme.palette.mode === "dark"
                          ? "#333"
                          : "#fff"
                        : theme.palette.mode === "dark"
                          ? "#222"
                          : "#e0e0e0",
                  }}
                >
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
      </Box>

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

export default Marginmanagement;
