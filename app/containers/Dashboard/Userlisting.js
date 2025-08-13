import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Drawer,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { fetchLedgerDetailsAPI, fetchUserlistingAPI } from "./API/API";
import UserListFilter from "./userlistfilter";
import LedgerDetailsDialog from "./Ledgerdialog";

const Userlisting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

    const [openDialog, setOpenDialog] = useState(false);
  const [ledgerDetails, setLedgerDetails] = useState([]);

  // Filters
  const [databroker, setDatabroker] = useState("");
  const [master, setMaster] = useState("");
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("");
  const [segment, setSegment] = useState("");
  const [loginBefore, setLoginBefore] = useState("");
  const [loginAfter, setLoginAfter] = useState("");
  const [tradeBefore, setTradeBefore] = useState("");
  const [tradeAfter, setTradeAfter] = useState("");
  const [type, setType] = useState(1);
  const [loadingLedger, setLoadingLedger] = useState(false);
    const [open, setOpen] = useState(false);
    const [openR, setOpenR] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
const [invoiceData, setInvoiceData] = useState(null);
const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => setOpenR(true);
  const handleClose1 = () => {setOpenR(false);
};

   const handleConfirm = async () => {
    try {
      // Call your reset password API
      const response = await axios.post("http://128.199.126.171/~goldorg/ajaxfiles/reset_password", { user_id: userId });
      console.log("Password reset response:", response.data);
      alert("Password has been reset successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Failed to reset password.");
    } finally {
      handleClose();
    }
  };


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
        setLedgerDetails(response.data.data);
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

  const [loginUserId] = useState(123); 
const [dataStored, setDataStored] = useState(() => {
        return JSON.parse(sessionStorage.getItem("data")) || [];
    });
  const fetchUserListingData = async () => {
    setLoading(true);
    try {
      const result = await fetchUserlistingAPI(
        dataStored.user_id,
        dataStored.auth_key
      );

      if (result?.aaData && Array.isArray(result.aaData)) {
        setReportData(result.aaData);
        setFilteredData(result.aaData);
      } else {
        setReportData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching user listing:", error);
      setReportData([]);
      setFilteredData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserListingData();
  }, []);

  // Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = reportData.filter(
      (row) =>
        row.user_name?.toLowerCase().includes(query) ||
        row.master?.toLowerCase().includes(query) ||
        row.broker?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [searchQuery, reportData]);

  // Apply filters
  const handleApplyFilters = () => {
    let filtered = [...reportData];

    if (user) {
      filtered = filtered.filter(
        (row) => row.user_name?.toLowerCase() === user.toLowerCase()
      );
    }
    if (master) {
      filtered = filtered.filter(
        (row) => row.master?.toLowerCase() === master.toLowerCase()
      );
    }
    if (databroker) {
      filtered = filtered.filter(
        (row) => row.broker?.toLowerCase() === databroker.toLowerCase()
      );
    }
    if (status) {
      filtered = filtered.filter(
        (row) => String(row.user_status) === String(status)
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

  // Action handlers
  const getInvoices = (id) => console.log("Get invoices for", id);
  const resetPassword = (id) => console.log("Reset password for", id);
  const changeStatus = (id) => console.log("Change status for", id);
  const clearLogin = (id) => console.log("Clear login for", id);
  const refreshMargin = (id) => console.log("Refresh margin for", id);
  const viewPassword = (id) => console.log("View password for", id);

  const renderActions = (row) => {
    const buttons = [];

    
      buttons.push(
        <Button
          key="invoices"
          onClick={() => handleOpenLedger(row)}
          variant="contained"
          color="info"
          size="small"
          sx={{ minWidth: 30, p: "4px", m: "2px" }}
        >
          L
        </Button>,
         <Button
        onClick={handleOpen1}
        variant="contained"
        color="warning"
        size="small"
        sx={{ minWidth: 30, p: "4px", m: "2px" }}
      >
        R
      </Button>,
        <Button
          key="status"
          onClick={() => changeStatus(row.user_id)}
          variant="contained"
          color={row.current_status || "primary"}
          size="small"
          sx={{ minWidth: 30, p: "4px", m: "2px" }}
        >
          A
        </Button>,
        <Button
          key="clear"
          onClick={() => clearLogin(row.user_id)}
          variant="contained"
          color={row.current_login_status || "secondary"}
          size="small"
          sx={{ minWidth: 30, p: "4px", m: "2px" }}
        >
          CL
        </Button>
      );

      if ( dataStored.user_type === 4) {
        buttons.push(
          <Button
            key="margin"
            onClick={() => refreshMargin(row.user_id)}
            variant="contained"
            color="primary"
            size="small"
            sx={{ minWidth: 30, p: "4px", m: "2px" }}
          >
            M
          </Button>
        );
      }
    

    if (row.parent_user_id === dataStored.user_id) {
      buttons.push(
        <Button
          key="investor"
          onClick={() => viewPassword(row.fetch_user_id)}
          variant="contained"
          color={row.investor_color || "success"}
          size="small"
          sx={{ minWidth: 30, p: "4px", m: "2px" }}
        >
          <i className="fa fa-eye" />
        </Button>
      );
    }

    return buttons;
  };

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
            <UserListFilter
              isDarkMode={theme.palette.mode === "dark"}
              databroker={databroker}
              setDatabroker={setDatabroker}
              master={master}
              setMaster={setMaster}
              user={user}
              setUser={setUser}
              status={status}
              setStatus={setStatus}
              segment={segment}
              setSegment={setSegment}
              loginBefore={loginBefore}
              setLoginBefore={setLoginBefore}
              loginAfter={loginAfter}
              setLoginAfter={setLoginAfter}
              tradeBefore={tradeBefore}
              setTradeBefore={setTradeBefore}
              tradeAfter={tradeAfter}
              setTradeAfter={setTradeAfter}
              type={type}
              setType={setType}
              onApply={handleApplyFilters}
            />
          </Box>
        </Drawer>
      ) : (
        <Box sx={{ mb: 2, p: 1 }}>
          <UserListFilter
            isDarkMode={theme.palette.mode === "dark"}
            databroker={databroker}
            setDatabroker={setDatabroker}
            master={master}
            setMaster={setMaster}
            user={user}
            setUser={setUser}
            status={status}
            setStatus={setStatus}
            segment={segment}
            setSegment={setSegment}
            loginBefore={loginBefore}
            setLoginBefore={setLoginBefore}
            loginAfter={loginAfter}
            setLoginAfter={setLoginAfter}
            tradeBefore={tradeBefore}
            setTradeBefore={setTradeBefore}
            tradeAfter={tradeAfter}
            setTradeAfter={setTradeAfter}
            type={type}
            setType={setType}
            onApply={handleApplyFilters}
          />
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
          backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          whiteSpace: "nowrap",
        }}
      >
        <thead
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
          }}
        >
          <tr>
            {[
              "User Code",
              "User Name",
              "Broker",
              "Master",
              "Login IP",
              "Login Time",
              "Joining Date",
              "Status",
              "Actions",
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
              <td colSpan="9" style={{ padding: 16, textAlign: "center" }}>
                No Data Found
              </td>
            </tr>
          ) : (
            paginatedData.map((row, index) => (
              <tr key={row.user_id || index}>
                <td
                  dangerouslySetInnerHTML={{
                    __html: row.user_code || "",
                  }}
                />
                <td>{row.user_name || "-"}</td>
                <td
                  dangerouslySetInnerHTML={{
                    __html: row.broker || "-",
                  }}
                />
                <td
                  dangerouslySetInnerHTML={{
                    __html: row.master || "-",
                  }}
                />
                <td>{row.login_ip || "-"}</td>
                <td>{row.login_time || "-"}</td>
                <td>{row.creation_time || "-"}</td>
                <td>{row.user_status === 1 ? "Active" : "Inactive"}</td>
                <td>{renderActions(row)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 📘 Ledger Dialog - Card View */}
            <LedgerDetailsDialog
        open={open}
        onClose={handleClose}
        ledgerDetails={ledgerDetails}
        loading={loadingLedger}
      />


        <Dialog open={openR} onClose={handleClose}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the password for this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1} color="primary">
            No
          </Button>
          <Button onClick={handleConfirm} color="warning">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Userlisting;
