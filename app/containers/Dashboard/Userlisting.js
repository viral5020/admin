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
  TextField,
  Select
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { fetchLedgerDetailsAPI, fetchUserlistingAPI, resetPasswordAPI, changeUserStatusAPI, clearLoginAttemptsAPI, setInvestorPasswordAPI, removeInvestorPasswordAPI, getUserDetailsAPI } from "./API/API";
import UserListFilter from "./userlistfilter";
import LedgerDetailsDialog from "./Ledgerdialog";
import { useDebounce, useIsFirstRender } from "@uidotdev/usehooks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Pagination from "./filters/Pagination";
import { Grid } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Divider } from "@mui/material";
import { RadioGroup } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Radio } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchPdfCsv from "./filters/SearchPdfCsv";

const colArr = [
  "User Code",
  "User Name",
  "Broker",
  "Master",
  "Login IP",
  "Login Time",
  "Joining Date",
  "Status",
]

const keyArr = [
  "user_code",
  "user_name",
  "broker",
  "master",
  "login_ip",
  "login_time",
  "creation_time",
  "user_status",
]

const Userlisting = ({
  filterShow = true,
  setFilterShow = () => { }
}) => {
  console.log("filterShow=", filterShow);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isFirstRender = useIsFirstRender();

  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 800);
  const [isFilterChange, setIsFilterChange] = useState(false);

  const [loading, setLoading] = useState(true);

  // # Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [ledgerDetails, setLedgerDetails] = useState([]);

  // Filters
  const [databroker, setDatabroker] = useState("");
  const [master, setMaster] = useState("");
  const [user, setUser] = useState("");
  const [status, setStatus] = useState({});
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

  const [open2, setOpen2] = useState(false);
  const [userDetails2, setUserDetails2] = useState(null);
  const [loading2, setLoading2] = useState(false);

  const [userLevels, setUserLevels] = useState([]);
  const [marketTypes, setMarketTypes] = useState([]);
  const [Mcxscript, setMcxscript] = useState([]);
  const [BrokerList, setBrokerList] = useState([]);

  const [formData, setFormData] = useState({
    userType: "1",          // example initial value
    orderOutsideHighLow: "",
    applyAutoSquare: "",
    intradayAutoSquare: "",
    onlyPositionSquareoff: "",
    mtmLinkedLedger: "",
    applyAutoSquareForex: "",
    closeAlertMarginForex: "",
    brokerName: [],
    lossAlertPercentageForex: "",
    lossAlertPercentage: "",
    closeAlertMargin: "",
    minRateStopAmount: "",
    shortTradeAvoid: "",
    userLevel: "",
    marketType: [],
    marketOptions: {},
  });


  const [loginUserId] = useState(123);
  const [dataStored, setDataStored] = useState(() => {
    return JSON.parse(sessionStorage.getItem("data")) || [];
  });

  const fetchPageData = async (current_page) => {
    setLoading(true);
    try {
      const result =
        await fetchUserlistingAPI(
          current_page ?? currentPage,
          pageSize,
          tradeAfter,
          tradeBefore,
          loginBefore,
          loginAfter,
          databroker?.id,
          master?.id,
          user?.id, status,
          searchText
        );

      setReportData(result.aaData || []);
      setFilteredData(result.aaData || []);
      setTotalRecords(result.iTotalRecords || 0);
    } catch (error) {
      console.error("Error fetching user listing:", error);
      setReportData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
      setIsFilterChange(false);
    }
  };


  // # Pagination useEffects
  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize));
  }, [pageSize, totalRecords])

  useEffect(() => {
    !isFirstRender && currentPage === 0 ? setIsFilterChange(true) : setIsFilterChange(false);
    setCurrentPage(0);
  }, [debouncedSearchText]);

  useEffect(() => {
    !isFirstRender && fetchPageData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    isFilterChange && !isFirstRender && fetchPageData();
  }, [isFilterChange])


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
      const res = await resetPasswordAPI({ user_id: actionItem.user_id });
      if (res.status === "ok") {
        handleClose1();
        toast.success("Password has been reset to '1234' successfully!");
      } else {
        toast.error("Failed to reset password: " + res.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password due to network error.");
    } finally {
      handleClose1();
    }
  };

  const handleStatusConfirm = async () => {
    if (!statusActionItem) return;
    try {
      const res = await changeUserStatusAPI({ user_id: statusActionItem.user_id });
      if (res.status === "ok") {
        handleStatusClose();
        toast.success("User status has been updated successfully!");
      } else {
        toast.error("Failed to update status: " + res.message);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to update status due to network error.");
    } finally {
      handleStatusClose();
    }
  };

  const handleConfirmClear = async () => {
    if (!selectedUserIdcl) return;
    try {
      const res = await clearLoginAttemptsAPI({ user_id: selectedUserIdcl });
      if (res.status === "ok") {
        handleCloseDialogcl();
        toast.success("Login attempts cleared successfully!");
      } else {
        toast.error("Failed to clear login attempts: " + res.message);
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
    try {
      const res = await setInvestorPasswordAPI({ user_id: investorData.user_id, current_password: loginPassword, password: investorPassword });
      if (res.status === "ok") {
        toast.success("Investor password saved successfully!");
        setInvestorDialogOpen(false);
      } else {
        toast.error(res.message || "Failed to save investor password");
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
    try {
      const res = await setInvestorPasswordAPI({ user_id: investorData.user_id, current_password: loginPassword, password: investorPassword });
      if (res.status === "ok") {
        toast.success("Investor password updated successfully!");
        setInvestorDialogOpen(false);
      } else {
        toast.error(res.message || "Failed to update investor password");
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
    try {
      const res = await removeInvestorPasswordAPI({ user_id: investorData.user_id, current_password: loginPassword });
      if (res.status === "ok") {
        toast.success("Investor password removed successfully!");
        setInvestorDialogOpen(false);
      } else {
        toast.error(res.message || "Failed to remove investor password");
      }
    } catch (error) {
      console.error("Error removing investor password:", error);
      toast.error("Network error while removing investor password.");
    }
  };


  const fetchLedgerDetails = async (userId) => {
    setLoadingLedger(true);
    try {
      const data = await fetchLedgerDetailsAPI({ user_id: null, auth_key: null, targetUserId: userId });
      if (data && Array.isArray(data.data)) {
        setLedgerDetails(data.data);
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

  const handleClickOpen2 = async (row) => {
    setOpen2(true);
    setLoading2(true);

    try {
      const data = await getUserDetailsAPI(row.user_id);
      setUserDetails2(data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    } finally {
      setLoading2(false);
    }
  };


  const handleClose2 = () => {
    setOpen2(false);
    setUserDetails2(null);
  };

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
      </Button>,
      <Button
        key="status"
        variant="contained"
        size="small"
        sx={{
          minWidth: 30,
          p: "4px",
          m: "2px",
          backgroundColor: "#ff9800", // orange 500
          color: "#fff",
          "&:hover": {
            backgroundColor: "#fb8c00", // darker orange
          },
        }}
        // onClick={() => handleClickOpen2 (row)}
        onClick={() => navigate("/app/dashboard/Edit-Account", { state: { userId: row.user_id } })}
      >
        E
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
          <VisibilityIcon />
        </Button>

      );
    }

    return buttons;
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Filters - Fixed on top */}
      {isMobile && filterShow ? (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
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
              onApply={() => {
                currentPage === 0 ? fetchPageData(0) : setCurrentPage(0);
              }}
            />
          </Box>
        </Drawer>
      ) : (
        filterShow && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: theme.palette.background.paper,
              p: 1,
              mb: 2,
            }}
          >
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
              onApply={() => {
                currentPage === 0 ? fetchPageData(0) : setCurrentPage(0);
              }}
            />
          </Box>
        )
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
        <SearchPdfCsv
          searchText={searchText}
          setSearchText={setSearchText}
          logs={filteredData}
          colArr={colArr}
          keyArr={keyArr}
          isLoading={loading}
        />
      </div>

      {/* Table Wrapper (scrollable horizontally) */}
      <div style={{ overflowX: "auto" }}>
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
              backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0",
              position: "sticky",
              top: 0,
              zIndex: 5,
            }}
          >
            <tr>
              {[
                "User Name",
                "User Code",
                "Broker",
                "Master",
                "Status",
                "Actions",
                "Login IP",
                "Login Time",
                "Joining Date",
              ].map((header) => (
                <th key={header} style={{ padding: "8px 12px", fontWeight: 600 }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: isMobile ? "start" : "center",
                    padding: 20,
                    position: "relative",
                    left: isMobile ? "35vw" : "",
                  }}
                >
                  <CircularProgress size={24} />
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: 20 }}>
                  No Data Found
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={row.user_id || index}
                  style={{
                    backgroundColor:
                      index % 2 === 0
                        ? theme.palette.mode === "dark"
                          ? "#333"
                          : "#f9f9f9"
                        : "transparent",
                    transition: "background-color 0.3s",
                  }}
                >
                  <td dangerouslySetInnerHTML={{ __html: `<strong>${row.user_name || "-"}</strong>` }} />
                  <td dangerouslySetInnerHTML={{ __html: `<strong>${row.user_code || "-"}</strong>` }} />
                  <td dangerouslySetInnerHTML={{ __html: `<strong>${row.broker || "-"}</strong>` }} />
                  <td dangerouslySetInnerHTML={{ __html: `<strong>${row.master || "-"}</strong>` }} />


                  {/* Status with color */}
                  <td
                    style={{
                      color: row.user_status === 1 ? "#28a745" : "#ec081fff",
                      fontWeight: 900,
                    }}
                  >
                    {row.user_status === 1 ? "Active" : "Inactive"}
                  </td>

                  {/* Actions next to Status */}
                  <td>{renderActions(row)}</td>

                  <td>{row.login_ip || "-"}</td>
                  <td>{row.login_time || "-"}</td>
                  <td>{row.creation_time || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

      {/* 🔽 Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        pageSize={pageSize}
      />

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

      <Dialog open={open2} onClose={handleClose2} maxWidth="lg" fullWidth>
        <DialogTitle>Account / Additional Details</DialogTitle>
        <DialogContent>
          {formData.userType === "1" && (
            <>
              <Divider sx={{ mb: 2 }} />

              {/* ================= ACCOUNT DETAILS ================= */}
              <div style={{ padding: 12 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ACCOUNT DETAILS
                </Typography>

                <Grid container spacing={2}>
                  {/* Order Outside of High Low */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Typography>Order Outside of High Low</Typography>
                      <RadioGroup
                        row
                        value={formData.orderOutsideHighLow}
                        onChange={(e) =>
                          handleChange("orderOutsideHighLow", e.target.value)
                        }
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Apply Auto Square */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Typography>Apply Auto Square</Typography>
                      <RadioGroup
                        row
                        value={formData.applyAutoSquare}
                        onChange={(e) => handleChange("applyAutoSquare", e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Intra Day Auto Square */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Typography>Intra Day Auto Square</Typography>
                      <RadioGroup
                        row
                        value={formData.intradayAutoSquare}
                        onChange={(e) => handleChange("intradayAutoSquare", e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Only Position Squareoff */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Typography>Only Position Squareoff</Typography>
                      <RadioGroup
                        row
                        value={formData.onlyPositionSquareoff}
                        onChange={(e) =>
                          handleChange("onlyPositionSquareoff", e.target.value)
                        }
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* MTM Linked with Ledger */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Typography>MTM Linked with Ledger (Stock)</Typography>
                      <RadioGroup
                        row
                        value={FormData.mtmLinkedLedger}
                        onChange={(e) => handleChange("mtmLinkedLedger", e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Apply Auto Square Forex/Comex */}
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <Typography>Apply Auto Square (Forex/Comex)</Typography>
                      <RadioGroup
                        row
                        value={formData.applyAutoSquareForex}
                        onChange={(e) =>
                          handleChange("applyAutoSquareForex", e.target.value)
                        }
                      >
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* Other TextFields */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Close Alert Margin (Forex/Comex)"
                      value={formData.closeAlertMarginForex}
                      onChange={(e) => handleChange("closeAlertMarginForex", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Broker Name</InputLabel>
                      <Select
                        multiple
                        value={formData.brokerName || []}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, brokerName: e.target.value }))
                        }
                        MenuProps={{
                          disablePortal: true,
                          anchorOrigin: { vertical: "bottom", horizontal: "left" },
                          transformOrigin: { vertical: "top", horizontal: "left" },
                          PaperProps: { style: { maxHeight: 200 } },
                        }}
                      >
                        {BrokerList.map((broker) => (
                          <MenuItem key={broker.broker_id} value={broker.broker_id}>
                            {broker.broker_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Loss Alert Percentage (Forex/Comex)"
                      value={formData.lossAlertPercentageForex}
                      onChange={(e) => handleChange("lossAlertPercentageForex", e.target.value)}
                    />
                  </Grid>

                  {/* Row 2 */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Loss Alert Percentage"
                      value={formData.lossAlertPercentage}
                      onChange={(e) => handleChange("lossAlertPercentage", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Close Alert Margin"
                      value={formData.closeAlertMargin}
                      onChange={(e) => handleChange("closeAlertMargin", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Min Rate Stop Amount"
                      value={formData.minRateStopAmount}
                      onChange={(e) => handleChange("minRateStopAmount", e.target.value)}
                    />
                  </Grid>

                  {/* Row 3 */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Short Trade Avoid"
                      value={formData.shortTradeAvoid}
                      onChange={(e) => handleChange("shortTradeAvoid", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </div>

              <Divider sx={{ my: 2 }} />

              {/* ================= ADDITIONAL DETAILS ================= */}
              <div style={{ padding: 12 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ADDITIONAL DETAILS
                </Typography>

                <Grid container spacing={2}>
                  {/* User Level */}
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>User Level</InputLabel>
                      <Select
                        value={FormData.userLevel || ""}
                        onChange={(e) => setFormData({ ...formData, userLevel: e.target.value })}
                      >
                        {userLevels.map((lvl) => (
                          <MenuItem key={lvl.user_level_id} value={lvl.user_level_id}>
                            {lvl.user_level_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Market Type Section */}
                  <Grid item xs={12}>
                    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
                      Market Type
                    </Typography>

                    {marketTypes.map((mkt) => {
                      const isChecked = formData.marketType.includes(mkt.market_type_id);
                      const config = marketConfig[mkt.market_type_name];
                      const selectedBrokers = formData.brokerName || [];

                      return (
                        <div key={mkt.market_type_id} style={{ marginBottom: "16px" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={isChecked}
                                onChange={() =>
                                  handleCheckboxChange("marketType", mkt.market_type_id)
                                }
                              />
                            }
                            label={mkt.market_type_name}
                          />

                          {isChecked && config && (
                            <div style={{ marginLeft: "32px", marginTop: "12px" }}>
                              {/* MCXFUT Specific Section */}
                              {mkt.market_type_name === "MCXFUT" && (
                                <Grid container spacing={2}>
                                  {/* Margin Limit */}
                                  <Grid item xs={6}>
                                    <TextField
                                      label="Margin Limit"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      value={formData.marketOptions?.MCXFUT?.marginLimit || ""}
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          marketOptions: {
                                            ...prev.marketOptions,
                                            MCXFUT: {
                                              ...prev.marketOptions?.MCXFUT,
                                              marginLimit: e.target.value,
                                            },
                                          },
                                        }))
                                      }
                                    />
                                  </Grid>

                                  {/* Script Limit */}
                                  <Grid item xs={6}>
                                    <TextField
                                      label="Script Limit"
                                      size="small"
                                      type="number"
                                      fullWidth
                                      value={formData.marketOptions?.MCXFUT?.scriptLimit || ""}
                                      onChange={(e) =>
                                        setFormData((prev) => ({
                                          ...prev,
                                          marketOptions: {
                                            ...prev.marketOptions,
                                            MCXFUT: {
                                              ...prev.marketOptions?.MCXFUT,
                                              scriptLimit: e.target.value,
                                            },
                                          },
                                        }))
                                      }
                                    />
                                  </Grid>

                                  {/* Commission Type */}
                                  <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                      <InputLabel>Commission Type</InputLabel>
                                      <Select
                                        value={formData.marketOptions?.MCXFUT?.commissionType || ""}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            marketOptions: {
                                              ...prev.marketOptions,
                                              MCXFUT: {
                                                ...prev.marketOptions?.MCXFUT,
                                                commissionType: e.target.value,
                                              },
                                            },
                                          }))
                                        }
                                      >
                                        <MenuItem value={1}>Script Wise (1)</MenuItem>
                                        <MenuItem value={0}>Same for All (0)</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  {/* Brokerage Type */}
                                  <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                      <InputLabel>Brokerage Type</InputLabel>
                                      <Select
                                        value={formData.marketOptions?.MCXFUT?.brokerageType || ""}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            marketOptions: {
                                              ...prev.marketOptions,
                                              MCXFUT: {
                                                ...prev.marketOptions?.MCXFUT,
                                                brokerageType: e.target.value,
                                              },
                                            },
                                          }))
                                        }
                                      >
                                        <MenuItem value={2}>Percentage Wise</MenuItem>
                                        <MenuItem value={0}>MCX Lot Wise</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>

                                  {/* Global Commission Fields */}
                                  {[
                                    "deliveryCommission",
                                    "intradayCommission",
                                    "deliveryBrokerCommission",
                                    "intradayBrokerCommission",
                                  ].map((key) => (
                                    <Grid item xs={6} key={key}>
                                      <TextField
                                        label={{
                                          deliveryCommission: "Delivery Commission",
                                          intradayCommission: "Intraday Commission",
                                          deliveryBrokerCommission: "Delivery Broker Commission",
                                          intradayBrokerCommission: "Intraday Broker Commission",
                                        }[key]}
                                        size="small"
                                        type="number"
                                        fullWidth
                                        value={formData.marketOptions?.MCXFUT?.[key] || ""}
                                        onChange={(e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            marketOptions: {
                                              ...prev.marketOptions,
                                              MCXFUT: {
                                                ...prev.marketOptions?.MCXFUT,
                                                [key]: e.target.value,
                                              },
                                            },
                                          }))
                                        }
                                      />
                                    </Grid>
                                  ))}

                                  {/* Script-wise MCX */}
                                  {formData.marketOptions?.MCXFUT?.commissionType === 1 &&
                                    config.hasMcxScripts &&
                                    Mcxscript.map((script) => (
                                      <Grid
                                        item
                                        xs={12}
                                        key={script.script_id}
                                        style={{ marginBottom: "12px" }}
                                      >
                                        <FormControlLabel
                                          control={<Checkbox size="small" checked disabled />}
                                          label={script.script_name}
                                        />
                                      </Grid>
                                    ))}
                                </Grid>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Grid>
                </Grid>
              </div>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose2}>Cancel</Button>
          <Button
            onClick={() => {
              console.log(formData);
              handleClose2();
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Userlisting;
