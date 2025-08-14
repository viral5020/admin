import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  DialogActions,
  TextField
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

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusActionItem, setStatusActionItem] = useState(null);

  const [selectedUserName, setSelectedUserName] = React.useState("");

  const [openDialogcl, setOpenDialogcl] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedUserIdcl, setSelectedUserIdcl] = React.useState(null);
  const [selectedUserNamecl, setSelectedUserNamecl] = React.useState("");

  const [investorDialogOpen, setInvestorDialogOpen] = useState(false);
  const [investorData, setInvestorData] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [investorPassword, setInvestorPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  const [removeInvestorDialogOpen, setRemoveInvestorDialogOpen] = useState(false);

  const handleViewInvestor = (row) => {
    setInvestorData(row);
    setLoginPassword("");
    setInvestorPassword("");
    setPasswordErrors({});
    setInvestorDialogOpen(true);
  };

  const validatePasswords = () => {
    const errors = {};
    if (!loginPassword || loginPassword.length < 6) {
      errors.loginPassword = "Login password must be at least 6 characters.";
    }
    if (!investorPassword || investorPassword.length < 6) {
      errors.investorPassword = "Investor password must be at least 6 characters.";
    }
    if (investorPassword === loginPassword) {
      errors.investorPassword = "Investor password cannot be the same as login password.";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleOpenDialogcl = (userId, userFullName) => {
    setSelectedUserIdcl(userId);
    setSelectedUserNamecl(userFullName);
    setOpenDialogcl(true);
  };

  const handleCloseDialogcl = () => {
    setOpenDialogcl(false);
    setSelectedUserIdcl(null);
    setSelectedUserNamecl("");
  };


  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialogcl(true);
  };

  const handleCloseDialog = () => {
    setOpenDialogcl(false);
    setSelectedUserId(null);
  };


  const handleStatusOpen = (row) => {
    setStatusActionItem(row);
    setStatusDialogOpen(true);
  };

  const handleStatusClose = () => {
    setStatusDialogOpen(false);
    setStatusActionItem(null);
  };

  const [actionItem, setactionItem] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleOpen1 = () => setOpenR(true);
  const handleClose1 = () => {
    setOpenR(false);
  };
  const handleConfirm = async () => {
    try {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      const payload = {
        is_app: '1',
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: actionItem.user_id,
      };
      const response = await axios.post(
        "http://128.199.126.171/~goldorg/ajaxfiles/reset_password",
        payload  // sending userId in body
      );

      console.log("Password reset response:", response.data);
      if (response.data.status === "ok") {
        handleClose1();
        toast.success("Password has been reset to '1234' successfully!");
      } else {
        toast.error("Failed to reset password: " + response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password due to network error.");
    } finally {
      handleClose1(); // close modal/dialog
    }
  };

  const handleStatusConfirm = async () => {
    if (!statusActionItem) return;

    try {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      const payload = {
        is_app: '1',
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: statusActionItem.user_id,
      };

      const response = await axios.post(
        "http://128.199.126.171/~goldorg/ajaxfiles/change_user_status",
        payload
      );

      console.log("Change status response:", response.data);

      if (response.data.status === "ok") {
        handleStatusClose();
        toast.success("User status has been updated successfully!");
        //fetchUserListingData(); // refresh table
      } else {
        toast.error("Failed to update status: " + response.data.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to update status due to network error.");
    } finally {
      handleStatusClose();
    }
  };

  const handleConfirmClear = async () => {
    if (!selectedUserIdcl) return; // ✅ use selectedUserIdcl instead

    try {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));
      const payload = {
        is_app: "1",
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: selectedUserIdcl, // ✅ also here
      };

      const response = await axios.post(
        "http://128.199.126.171/~goldorg/ajaxfiles/clear_login_attempts",
        payload
      );

      if (response.data.status === "ok") {
        handleCloseDialogcl(); // ✅ close correct dialog
        toast.success("Login attempts cleared successfully!");
      } else {
        toast.error("Failed to clear login attempts: " + response.data.message);
      }
    } catch (error) {
      console.error("Error clearing login attempts:", error);
      toast.error("Network error while clearing login attempts.");
    } finally {
      handleCloseDialogcl();
    }
  };

  const handleSaveOrUpdateInvestor = async () => {
    if (!validatePasswords()) return;

    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const payload = {
        is_app: "1",
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: investorData.user_id,
        password: investorPassword,
        current_password: loginPassword
      };

      const response = await axios.post(
        "http://128.199.126.171/~goldorg/ajaxfiles/investor_password_set",
        payload
      );

      if (response.data.status === "ok") {
        toast.success("Investor password saved successfully!");
        setInvestorDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to save investor password");
      }
    } catch (error) {
      console.error("Error saving investor password:", error);
      toast.error("Network error while saving investor password.");
    }
  };

  const handleUpdateInvestor = async () => {
    if (!loginPassword || loginPassword.length < 6) {
      setPasswordErrors({ loginPassword: "Login password must be at least 6 characters." });
      return;
    }
    if (!investorPassword || investorPassword.length < 6) {
      setPasswordErrors({ investorPassword: "Investor password must be at least 6 characters." });
      return;
    }

    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const payload = {
        is_app: "1",
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: investorData.user_id,
        current_password: loginPassword,
        password: investorPassword
      };

      const response = await axios.post(
        "http://128.199.126.171/~goldorg/ajaxfiles/investor_password_set",
        payload
      );

      if (response.data.status === "ok") {
        toast.success("Investor password updated successfully!");
        setInvestorDialogOpen(false);
        // Optionally reload table here
      } else {
        toast.error(response.data.message || "Failed to update investor password");
      }
    } catch (error) {
      console.error("Error updating investor password:", error);
      toast.error("Network error while updating investor password.");
    }
  };

  const handleRemoveInvestor = async () => {
    // Make sure login password is entered
    if (!loginPassword || loginPassword.length < 6) {
      setPasswordErrors({
        loginPassword: "Login password must be at least 6 characters."
      });
      return;
    }

    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const payload = {
        is_app: "1",
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: investorData.user_id,
        current_password: loginPassword
      };

      const response = await axios.post(
        "http://128.199.126.171/~goldorg/ajaxfiles/investor_password_remove",
        payload
      );

      if (response.data.status === "ok") {
        toast.success("Investor password removed successfully!");
        setInvestorDialogOpen(false);
      } else {
        toast.error(response.data.message || "Failed to remove investor password");
      }
    } catch (error) {
      console.error("Error removing investor password:", error);
      toast.error("Network error while removing investor password.");
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
const handleApplyFilters = async () => {
  try {
    const rawData = JSON.parse(sessionStorage.getItem("data"));
    if (!rawData?.auth_key || !rawData?.user_id) return;

    const payload = {
      user,          // user filter
      master,        // master filter
      databroker,    // broker filter
      status,        // status filter
      type,          // optional type filter if needed
      is_app: "1",
      login_user_id: rawData.user_id,
      auth_key: rawData.auth_key,
    };

    const queryParams = new URLSearchParams(payload).toString();
    const response = await fetch(
      `http://128.199.126.171/~goldorg/datatables/user_list_key?${queryParams}`
    );

    if (!response.ok) throw new Error("API call failed");

    const data = await response.json();
    setFilteredData(data?.aaData || []);
    setCurrentPage(0); // reset pagination
  } catch (error) {
    console.error("Error fetching filtered data:", error);
  }
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
        onClick={() => {

          setactionItem(row);
          handleOpen1();
        }}
        variant="contained"
        color="warning"
        size="small"
        sx={{ minWidth: 30, p: "4px", m: "2px" }}
      >
        R
      </Button>,
      <Button
        key="status"
        onClick={() => handleStatusOpen(row)}
        variant="contained"
        color={row.user_status === 1 ? "success" : "error"}
        size="small"
        sx={{ minWidth: 30, p: "4px", m: "2px" }}
      >
        A
      </Button>,
      <Button
        onClick={() => handleOpenDialogcl(row.user_id)}
        variant="contained"
        size="small"
        sx={{
          minWidth: 30,
          p: "4px",
          m: "2px",
          backgroundColor: "#9c27b0", // Purple
          "&:hover": {
            backgroundColor: "#7b1fa2", // Darker purple on hover
          },
        }}
      >
        CL
      </Button>

    );

    if (dataStored.user_type === 4) {
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
          onClick={() => {
            setInvestorData(row);
            setLoginPassword("");
            setInvestorPassword("");
            setPasswordErrors({});
            setInvestorDialogOpen(true);
          }}
          variant="contained"
          size="small"
          sx={{
            minWidth: 30,
            p: "4px",
            m: "2px",
            backgroundColor:
              row?.investor_password && row.investor_password !== "false"
                ? "#1976d2" // MUI primary.main blue
                : "#000",   // black
            color: "#fff",
            '&:hover': {
              backgroundColor:
                row?.investor_password && row.investor_password !== "false"
                  ? "#115293" // MUI primary.dark blue
                  : "#333"    // dark grey hover for black
            }
          }}
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
              onApply={fetchUserListingData}
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
            onApply={fetchUserListingData}
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

      {/* 📘 Ledger Dialog - Card View */}
      <LedgerDetailsDialog
        open={open}
        onClose={handleClose}
        ledgerDetails={ledgerDetails}
        loading={loadingLedger}
      />


      <Dialog open={openR} onClose={handleClose1}>
        <DialogTitle>Confirm Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the password for {actionItem ? `${actionItem.user_name} (${actionItem.user_full_name})` : ""}
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

      <Dialog open={statusDialogOpen} onClose={handleStatusClose}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status for {statusActionItem ? `${statusActionItem.user_name} (${statusActionItem.user_full_name})` : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusClose} color="primary">
            No
          </Button>
          <Button onClick={handleStatusConfirm} color="warning">
            Yes
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openDialogcl} onClose={handleCloseDialogcl}>
        <DialogTitle>Clear Login Attempts?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear login attempts for <b>{selectedUserName}</b>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmClear} color="error">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={investorDialogOpen} onClose={() => setInvestorDialogOpen(false)}>
        <DialogTitle>
          {Boolean(investorData?.investor_password && investorData.investor_password !== "false")
            ? "Update Investor Password"
            : "Set Investor Password"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {Boolean(investorData?.investor_password && investorData.investor_password !== "false")
              ? `Investor password is already set for ${investorData.user_name}. You can update or remove it.`
              : `Set a new investor password for ${investorData?.user_name}.`}
          </DialogContentText>

          {/* Always show fields for Update/Set */}
          <TextField
            margin="dense"
            label="Login Password"
            type="password"
            fullWidth
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            error={!!passwordErrors.loginPassword}
            helperText={passwordErrors.loginPassword}
          />
          <TextField
            margin="dense"
            label="Investor Password"
            type="password"
            fullWidth
            value={investorPassword}
            onChange={(e) => setInvestorPassword(e.target.value)}
            error={!!passwordErrors.investorPassword}
            helperText={passwordErrors.investorPassword}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setInvestorDialogOpen(false)}>Cancel</Button>

          {Boolean(investorData?.investor_password && investorData.investor_password !== "false") ? (
            <>
              <Button onClick={handleUpdateInvestor} color="primary">Update</Button>
              <Button
                onClick={() => {
                  setLoginPassword("");
                  setPasswordErrors({});
                  setRemoveInvestorDialogOpen(true);
                }}
                color="error"
              >
                Remove
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                if (validatePasswords()) {
                  handleUpdateInvestor(); // same API for save
                }
              }}
              color="primary"
            >
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>


      <Dialog open={removeInvestorDialogOpen} onClose={() => setRemoveInvestorDialogOpen(false)}>
        <DialogTitle>Remove Investor Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your login password to remove investor password for <b>{investorData?.user_name}</b>.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Login Password"
            type="password"
            fullWidth
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            error={!!passwordErrors.loginPassword}
            helperText={passwordErrors.loginPassword}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveInvestorDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              if (!loginPassword || loginPassword.length < 6) {
                setPasswordErrors({ loginPassword: "Login password must be at least 6 characters." });
                return;
              }
              handleRemoveInvestor();
              setRemoveInvestorDialogOpen(false);
            }}
          >
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Userlisting;
