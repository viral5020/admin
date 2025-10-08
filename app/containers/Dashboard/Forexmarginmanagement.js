import React, { useEffect, useState } from "react";
import { fetchforexMarginManagementListAPI, fetchMarginManagementListAPI } from "./API/API";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Drawer,
  IconButton,
  Grid,
  useMediaQuery
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClientMasterBrokerFilter from "./filters/ClientMasterBrokerFilter";
import SearchPdfCsv from "./filters/SearchPdfCsv";
import Pagination from './filters/Pagination';
import FilterBtn from "./filters/FilterBtn";
import CloseIcon from '@mui/icons-material/Close';


const colArr = [
  "Name",
  "Forex",
  "Comex",
  "Total"
]

const keyArr = [
  "user_details",
  "forex_margin",
  "comex_margin",
  "total",
]

const Forexmarginmanagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // # Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState()
  // # Pagnation Page data States
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [client, setClient] = useState(null);
  const [master, setMaster] = useState(null);
  const [broker, setBroker] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchPageData = async () => {
    setLoading(true);
    const result = await fetchforexMarginManagementListAPI(client, master, broker,);

    const formattedData =
      Array.isArray(result)
        ? result.map((item, index) => ({ ...item, index: index + 1 }))
        : [];

    console.log("Fetched Data:", formattedData);

    setReportData(formattedData);
    setFilteredData(formattedData);
    setLoading(false);
  };

  // <Pagnation useEffect>
  useEffect(() => {
    fetchPageData();
  }, []);

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

  useEffect(() => {
    setPaginatedData(getPageData());
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize])

  useEffect(() => {
    setPaginatedData(getPageData());
  }, [currentPage])

  function getPageData() {
    return filteredData.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    )
  }
  // </Pagnation useEffect>

  // 🔹 Apply Filters Button
  // const handleApplyFilters = () => {
  //   let filtered = [...reportData];

  //   const clientValue = client?.text?.toLowerCase() || "";
  //   const masterValue = master?.text?.toLowerCase() || "";
  //   const brokerValue = broker?.text?.toLowerCase() || "";

  //   if (clientValue) {
  //     filtered = filtered.filter(
  //       (row) => row.client_name?.toLowerCase() === clientValue
  //     );
  //   }
  //   if (masterValue) {
  //     filtered = filtered.filter(
  //       (row) => row.master_name?.toLowerCase() === masterValue
  //     );
  //   }
  //   if (brokerValue) {
  //     filtered = filtered.filter(
  //       (row) => row.broker_name?.toLowerCase() === brokerValue
  //     );
  //   }

  //   setFilteredData(filtered);
  //   setCurrentPage(0);
  // };

  const handleClearFilters = () => {
    setClient(null);
    setMaster(null);
    setBroker(null);
    setSearchQuery("");
    setFilteredData(reportData);
    setCurrentPage(0);
  };

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
    <div style={{ padding: !isMobile ? 16 : 0 }}>
      {/* 🔹 Filters */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        // PaperProps={{
        //   component: "form",
        //   onSubmit: (e) => {
        //     e.preventDefault();
        //     handleApplyFilters();
        //     setDrawerOpen(false);
        //   }
        // }}
        >
          <Box sx={{ width: 280, p: 2 }} role="presentation">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Filters</Typography>
              <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
            </Box>
            <ClientMasterBrokerFilter
              client={client}
              master={master}
              broker={broker}
              setClient={setClient}
              setMaster={setMaster}
              setBroker={setBroker}
              horizontal={false}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                fetchPageData();
                setDrawerOpen(false);
              }}
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="contained"
              color="erroe"
              sx={{ mt: 2 }}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </Box>
        </Drawer>
      ) : (
        <Box sx={{ mb: 2, p: 1 }}>
          <Box
          // component="form"
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   handleApplyFilters();
          // }}
          >
            <Grid container spacing={2} alignItems="center">
              <ClientMasterBrokerFilter
                client={client}
                master={master}
                broker={broker}
                setClient={setClient}
                setMaster={setMaster}
                setBroker={setBroker}
                horizontal={true}
              />
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{
                    minWidth: 100,
                    borderRadius: 0,
                    height: 38,
                    mt: -0.5
                  }}
                  onClick={fetchPageData}
                >
                  Apply
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 100, borderRadius: 1, height: 38, mt: -0.5 }}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}

      {/* 🔹 Search */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        {isMobile && (
          <FilterBtn setFilterOpen={setDrawerOpen} />
        )}
        <SearchPdfCsv
          searchText={searchQuery}
          setSearchText={setSearchQuery}
          logs={paginatedData}
          colArr={colArr}
          keyArr={keyArr}
        // isLoading={}
        />
      </div>

      {/* 🔹 Table */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <table
          className="table table-striped table-bordered"
          style={{
            minWidth: "200px",
            fontSize: "12px",
            margin: 0,
            backgroundColor:
              theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
            color: theme.palette.mode === "dark" ? "#fff" : "#000",
            whiteSpace: "nowrap"
          }}
        >
          <thead
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? "#444" : "#e0e0e0"
            }}
          >
            <tr>
              {[
                "Name",
                "Forex",
                "Comex",
                "Total"
              ].map((header) => (
                <th key={header} style={{ padding: "8px 12px", fontWeight: 600 }}>
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
                <tr key={row.user_code || index}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? theme.palette.mode === "dark"
                          ? "#333" // dark mode stripe (even rows)
                          : "#fff" // light mode stripe (even rows)
                        : theme.palette.mode === "dark"
                          ? "#222" // darker alt for dark mode (odd rows)
                          : "#e0e0e0", // darker grey for light mode (odd rows)
                  }}
                >
                  <td>{row.user_details}</td>
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
    </div>
  );
};

export default Forexmarginmanagement