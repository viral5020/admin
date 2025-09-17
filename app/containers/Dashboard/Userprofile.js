import React, { useEffect, useState } from "react";
import {
    Grid,
    Autocomplete,
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Avatar,
    Divider,
    Tabs,
    Tab,
    CircularProgress
} from "@mui/material";
import { useTheme } from "@emotion/react";
import axios from "axios";
import { cashEntryAPI, fetchOptionsAPI, fetchProfileAPI, fetchSummaryAPI } from "./API/API";

const UserTablePage = () => {
    const theme = useTheme();

    // Dropdown state
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Orders & Positions
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [positions, setPositions] = useState([]);
    const [positionData, setPositionData] = useState([]);
    const [loadingPositions, setLoadingPositions] = useState(false);

    // Logs (Cash Entry)
    const [logs, setLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const [loginIPs, setLoginIPs] = useState([]);
    const [loadingIPs, setLoadingIPs] = useState(false);

    // Profile & Summary
    const [profile, setProfile] = useState(null);
    const [summary, setSummary] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const [isUserSelected, setIsUserSelected] = useState(false);

    const userType = 3; // example user type

    const glassStyles = {
        p: 2,
        borderRadius: 2,
        backdropFilter: "blur(10px)",
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(30,30,30,0.5)"
                : "rgba(255,255,255,0.6)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: theme.shadows[3]
    };

    // Fetch users for dropdown
    const fetchUsers = async (term = "") => {
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");
            const params = {
                is_app: 1,
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                term
            };
            const data = await fetchOptionsAPI(
                "http://128.199.126.171/~goldorg/ajaxfiles/get_client_name_search",
                params
            );
            setUsers(Array.isArray(data) ? data : data?.results || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch Orders
    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");
            const res = await fetch(
                "http://128.199.126.171/~goldorg/datatables/order_book_new",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sEcho: 1,
                        iDisplayStart: 0,
                        iDisplayLength: 50,
                        is_app: 1,
                        login_user_id: dataStored?.user_id,
                        auth_key: dataStored?.auth_key,
                        user_id: selectedUser?.id || ""
                    })
                }
            );
            const data = await res.json();
            setOrders(data.aaData || []);
        } catch (err) {
            console.error("Orders fetch error:", err);
            setOrders([]);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Fetch Positions
    const fetchPositions = async () => {
        setLoadingPositions(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");
            const res = await axios.post(
                "http://128.199.126.171/~goldorg/datatables/position_book_list",
                {
                    is_app: "1",
                    login_user_id: dataStored.user_id,
                    auth_key: dataStored.auth_key,
                    sEcho: 1,
                    iDisplayStart: 0,
                    iDisplayLength: 100000,
                    user_id: selectedUser?.id || ""
                }
            );
            setPositions(res.data.aaData || []);
        } catch (err) {
            console.error("Positions fetch error:", err);
            setPositions([]);
        } finally {
            setLoadingPositions(false);
        }
    };

    // Fetch Logs
    const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
            const result = await cashEntryAPI(
                0,
                50,
                "",
                "",
                "",
                "",
                selectedUser?.id || "",
                "",
                "",
                0,
                0,
                0,
                "cash_add"
            );
            const data = Array.isArray(result?.aaData) ? result.aaData : [];
            setLogs(data);
        } catch (err) {
            console.error("Logs fetch error:", err);
            setLogs([]);
        } finally {
            setLoadingLogs(false);
        }
    };

    // Fetch Profile
    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");

            const { profile, loginIps } = await fetchProfileAPI({
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                view_user_id: selectedUser?.id || ""
            });

            setProfile(profile);
            setLoginIPs(loginIps);
        } catch {
            setProfile(null);
            setLoginIPs([]);
            toast.error("Failed to fetch profile");
        } finally {
            setLoadingProfile(false);
        }
    };


    // Fetch Account Summary
    const fetchSummary = async (tab = "Stock") => {
        setLoadingSummary(true);
        try {
            const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");
            const data = await fetchSummaryAPI({
                login_user_id: dataStored?.user_id,
                auth_key: dataStored?.auth_key,
                view_user_id: selectedUser?.id || "",
                tab
            });

            setSummary(data);
        } catch {
            setSummary(null);
            toast.error("Failed to fetch summary");
        } finally {
            setLoadingSummary(false);
        }
    };



    const handleSubmit = () => {
        if (!selectedUser) return; // extra safety
        setIsUserSelected(true);   // show the rest of the content

        fetchOrders();
        fetchPositions();
        fetchLogs();
        fetchProfile();
        fetchSummary();
    };

    return (
        <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: theme.palette.background.default }}>
            {/* User Dropdown */}
            <Box sx={{ display: "flex", gap: 1, maxWidth: 400, mb: 3 }}>
                <Autocomplete
                    options={users}
                    getOptionLabel={(option) => option?.text || option || ""}
                    value={selectedUser}
                    onChange={(e, val) => setSelectedUser(val)}
                    onInputChange={(e, val, reason) => reason === "input" && fetchUsers(val)}
                    renderInput={(params) => <TextField {...params} label="Select User" size="small" />}
                    sx={{ flex: 1 }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                    disabled={!selectedUser}   // <-- disables button if no user selected
                    sx={{
                        height: 40,
                        minWidth: 90,
                        borderRadius: "1px",
                        textTransform: "uppercase",
                        mt: -0.3,
                    }}
                >
                    Submit
                </Button>
            </Box>

            {isUserSelected && (
                <>
                    {/* Profile & Account Summary */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ ...glassStyles, p: 2 }}>
                                <Typography variant="h6">User Information</Typography>
                                <Divider sx={{ mb: 1 }} />
                                {loadingProfile ? (
                                    <CircularProgress />
                                ) : (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar src={profile?.profile_image}>{profile?.user_name?.[0]}</Avatar>
                                        <Box>
                                            <Typography>{profile?.user_full_name || "-"}</Typography>
                                            <Typography>{profile?.email || "-"}</Typography>
                                            <Typography>{profile?.mobile || "-"}</Typography>
                                            <Typography>{profile?.city || "-"}</Typography>
                                            <Typography>{profile?.last_login_time || "-"}</Typography>
                                            <Typography>{profile?.last_login_ip || "-"}</Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ ...glassStyles, p: 2 }}>
                                <Typography variant="h6">Account Summary</Typography>
                                <Divider sx={{ mb: 1 }} />

                                {loadingSummary ? (
                                    <CircularProgress />
                                ) : (
                                    <>
                                        <Tabs
                                            value={tabValue}
                                            onChange={(e, newValue) => {
                                                setTabValue(newValue);
                                                const tabNames = ["Stock", "Forex", "Sports"];
                                                fetchSummary(tabNames[newValue]);
                                            }}
                                        >
                                            <Tab label="Stock" />
                                            <Tab label="Forex" />
                                            <Tab label="Sports" />
                                        </Tabs>

                                        <Box sx={{ mt: 1 }}>
                                            <Typography>Total Trade: {summary?.total_trade ?? 0}</Typography>
                                            <Typography>Total Position: {summary?.total_open_trade ?? 0}</Typography>
                                            <Typography>Total Balance: {summary?.total_balance ?? 0}</Typography>
                                            <Typography>Last Bill Amount: {summary?.last_bill_amt ?? 0}</Typography>
                                        </Box>
                                    </>
                                )}
                            </Card>
                        </Grid>

                    </Grid>

                    {/* Logs & Login IPs */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {/* Cash Entry */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ ...glassStyles, p: 2 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>Cash Entry</Typography>
                                {loadingLogs ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : logs.length === 0 ? (
                                    <Typography textAlign="center" p={2}>No Logs Found</Typography>
                                ) : (
                                    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                        {logs.map((log, i) => (
                                            <Box
                                                component="li"
                                                key={i}
                                                sx={{
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    borderRadius: 2,
                                                    mb: 1,
                                                    p: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f9f9f9',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="subtitle2">{log?.user ?? "-"}</Typography>
                                                    <Typography variant="subtitle2"><strong>{log?.account_date_time ?? "-"}</strong></Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography>Debit: {log?.debit ?? "-"}</Typography>
                                                    <Typography>Credit: {log?.credit ?? "-"}</Typography>
                                                </Box>
                                                <Typography>Remark: {log?.remark ?? "-"}</Typography>
                                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                    <Button size="small" variant="outlined" color="primary" onClick={() => handleEditClick(log)}>Edit</Button>
                                                    <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(log)}>Delete</Button>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Login IPs */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ ...glassStyles, p: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Login IPs</Typography>

                                {loadingProfile ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : loginIPs.length === 0 ? (
                                    <Typography textAlign="center" sx={{ p: 2, color: 'text.secondary' }}>
                                        No Login IPs Found
                                    </Typography>
                                ) : (
                                    <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                        <table
                                            style={{
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                fontSize: '13px',
                                                minWidth: 650,
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    {['IP Address', 'Login Name', 'Action', 'Date', 'Page'].map((header) => (
                                                        <th
                                                            key={header}
                                                            style={{
                                                                textAlign: 'left',
                                                                padding: '8px',
                                                                borderBottom: '2px solid #ccc',
                                                                backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f4f4f4',
                                                                color: theme.palette.mode === 'dark' ? '#fff' : '#222',
                                                            }}
                                                        >
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loginIPs.map((ip, index) => (
                                                    <tr
                                                        key={ip.user_login_ip_id || index}
                                                        style={{
                                                            backgroundColor: index % 2 === 0
                                                                ? theme.palette.mode === 'dark' ? '#2a2a2a' : '#fafafa'
                                                                : theme.palette.mode === 'dark' ? '#1f1f1f' : '#ffffff',
                                                            cursor: 'default',
                                                        }}
                                                    >
                                                        <td style={{ padding: '6px 10px' }}>{ip.ip_address}</td>
                                                        <td style={{ padding: '6px 10px' }}>{ip.login_name}</td>
                                                        <td style={{ padding: '6px 10px' }}>{ip.action_message}</td>
                                                        <td style={{ padding: '6px 10px' }}>{ip.added_datetime}</td>
                                                        <td style={{ padding: '6px 10px' }}>{ip.page_name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>


                    </Grid>




                    {/* Orders Table */}
                    <Paper sx={{ ...glassStyles, mb: 3, p: 1, overflowX: "auto" }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Orders</Typography>
                        {loadingOrders ? (
                            <Box textAlign="center" p={2}>Loading Orders...</Box>
                        ) : (
                            <table
                                className="table table-striped table-bordered"
                                style={{
                                    minWidth: "1850px",
                                    fontSize: "12px",
                                    margin: 0,
                                    backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#fff",
                                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                }}
                            >
                                <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                                    <tr>
                                        {[
                                            "Device",
                                            "Time",
                                            ...(userType !== 1 ? ["Client"] : []),
                                            "Script",
                                            "B/S",
                                            "Order Type",
                                            "Qty (Lot)",
                                            "Order Price",
                                            "Status",
                                            "O. Time",
                                            "Comm Amt",
                                            ...([3, 4, 5].includes(userType) ? ["IP Address"] : []),
                                            ...(userType === 4 || userType === 5 ? ["Trade ID"] : []),
                                            ...(userType !== 2 ? ["Action"] : [])
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                style={{
                                                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                                    fontWeight: 600,
                                                    padding: '8px 12px',
                                                    textAlign: 'left',
                                                    whiteSpace: 'nowrap',
                                                    borderBottom: '1px solid #ccc',
                                                    backgroundColor: theme.palette.background.paper,
                                                }}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>

                                </thead>
                                <tbody>
                                    {orders.map((item, index) => {
                                        // let rowBgColor = theme.palette.mode === "dark" ? "#333" : "#f5f5f5";
                                        // if (item.trd_type === "Buy") rowBgColor = theme.palette.mode === "dark" ? "#264653" : "#e0f7fa";
                                        // if (item.trd_type === "Sell") rowBgColor = theme.palette.mode === "dark" ? "#6d2c41" : "#fce4ec";

                                        const market = item.mrkt_name?.toUpperCase?.() || "DEFAULT";
                                        let backgroundColor = "#9e9e9e";
                                        if (market === "NSEFUT") backgroundColor = "#1976d2";
                                        else if (market === "GLOBAL FUTURES") backgroundColor = "#388e3c";
                                        else if (market === "MCXFUT") backgroundColor = "#8e24aa";
                                        else if (market === "NYSE") backgroundColor = "#f57c00";

                                        const [scriptPrefix, ...scriptRest] = item.scrp_name.split(" ");
                                        const scriptSuffix = scriptRest.join(" ");

                                        return (
                                            <tr key={item.trd_id || index} >
                                                <td dangerouslySetInnerHTML={{ __html: item.device_type_html }} />
                                                <td>{item.trd_matchedtime}</td>
                                                {userType !== 1 && <td>{item.client_full_name}</td>}
                                                <td>
                                                    <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Box component="span">
                                                            <Box component="span" sx={{ fontSize: "12px", fontWeight: "bold" }}>
                                                                {scriptPrefix}
                                                            </Box>{" "}
                                                            <Box component="span" sx={{ fontSize: "10px" }}>
                                                                {scriptSuffix}
                                                            </Box>
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                fontSize: "10px",
                                                                px: 1,
                                                                borderRadius: "8px",
                                                                backgroundColor,
                                                                color: "#fff",
                                                                display: "inline-block",
                                                            }}
                                                        >
                                                            {item.mrkt_name}
                                                        </Box>
                                                    </Box>
                                                </td>
                                                <td
                                                    style={{
                                                        color:
                                                            item.trd_type === "Buy"
                                                                ? theme.palette.success.main
                                                                : item.trd_type === "Sell"
                                                                    ? theme.palette.error.main
                                                                    : theme.palette.text.primary,
                                                        textTransform: "uppercase",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {item.trd_type}
                                                </td>
                                                <td>{item.trd_type2}</td>
                                                <td>
                                                    <Box component="span" sx={{ fontWeight: 700 }}>
                                                        {item.trd_qty}
                                                    </Box>{" "}
                                                    <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                                                        ({item.trd_lot})
                                                    </Box>
                                                </td>
                                                <td style={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    {item.trd_rate}
                                                </td>
                                                <td>{item.trd_status}</td>
                                                <td>{item.trd_time}</td>
                                                <td>{item.trd_comm_amnt}</td>
                                                {(userType === 4 || userType === 5) && <td>#{item.trd_id}</td>}
                                                {[3, 4, 5].includes(userType) && <td>{item.trade_ip_address}</td>}
                                                {userType !== 2 && (
                                                    <td>
                                                        <button
                                                            style={{
                                                                marginRight: '8px',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#1976d2',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => handleModify(item)}
                                                        >
                                                            Modify
                                                        </button>

                                                        <button
                                                            style={{
                                                                padding: '4px 8px',
                                                                backgroundColor: '#d32f2f',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => {
                                                                setCancelItem(item);
                                                                setCancelDialogOpen(true); // Always show confirmation
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </Paper>

                    {/* Positions Table */}

                    <Paper sx={{ ...glassStyles, p: 1, overflowX: "auto" }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Positions</Typography>
                        {loadingPositions ? (
                            <Box textAlign="center" p={2}>Loading Positions...</Box>
                        ) : (
                            <table
                                style={{
                                    minWidth: "1350px",
                                    fontSize: "12px",
                                    borderCollapse: "collapse",
                                    width: "100%",
                                    border: "1px solid #ddd",
                                }}
                            >
                                <thead>
                                    <tr>
                                        {[
                                            ...(userType !== 1 ? ["Client"] : []),
                                            "Script",
                                            "Total Buy",
                                            "Buy Avg Rate",
                                            "Total Sell",
                                            "Sell Avg Rate",
                                            "Net Qty",
                                            "Last Trade Price",
                                            "MTM",
                                            "Auto Closed Date",
                                            "Close Btn",
                                        ].map((heading, i) => (
                                            <th
                                                key={i}
                                                style={{
                                                    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f4f4f4",
                                                    color: theme.palette.mode === "dark" ? "#fff" : "#333",
                                                    textAlign: "left",
                                                    padding: "6px 10px",
                                                    position: "sticky",
                                                    top: 0,
                                                    zIndex: 2,
                                                    fontWeight: "600",
                                                    fontSize: "13px",
                                                    borderBottom: "2px solid #ccc",
                                                }}
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {positionData.map((row, index) => {
                                        const isEven = index % 2 === 0;
                                        const rowBgColor =
                                            theme.palette.mode === "dark"
                                                ? isEven
                                                    ? "#2a2a2a"
                                                    : "#1f1f1f"
                                                : isEven
                                                    ? "#fafafa"
                                                    : "#ffffff";

                                        const marketColors = {
                                            NSEFUT: "#1976d2",
                                            MCXFUT: "#388e3c",
                                            "GLOBAL FUTURES": "#f57c00",
                                        };
                                        const chipColor = marketColors[row.market_type_name] || "#757575";

                                        // MTM color
                                        const mtmValue = row.mtm ?? 0;
                                        const mtmColor = mtmValue > 0 ? "green" : mtmValue < 0 ? "red" : "#666";

                                        return (
                                            <tr
                                                key={index}
                                                style={{
                                                    backgroundColor: rowBgColor,
                                                    cursor: "pointer",
                                                    transition: "background 0.2s ease",
                                                }}
                                                onClick={() => openDrawer(row)}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.palette.mode === "dark" ? "#333" : "#f1f7ff")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = rowBgColor)}
                                            >
                                                {/* Script + Market Chip */}
                                                <td style={{ padding: "6px 10px" }}>
                                                    {userType !== 1 ? (
                                                        <span dangerouslySetInnerHTML={{ __html: row.full_name }} />
                                                    ) : null}
                                                </td>

                                                <td style={{ padding: "6px 10px" }}>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            maxWidth: "200px",
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                fontWeight: 500,
                                                                color: theme.palette.mode === "dark" ? "#fff" : "#222",
                                                            }}
                                                            dangerouslySetInnerHTML={{ __html: row.script_name }}
                                                        />
                                                        <span
                                                            style={{
                                                                backgroundColor: chipColor,
                                                                color: "#fff",
                                                                padding: "1px 6px",
                                                                borderRadius: "12px",
                                                                fontSize: "10px",
                                                                whiteSpace: "nowrap",
                                                                marginLeft: "6px",
                                                            }}
                                                        >
                                                            {row.market_type_name}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Numeric data */}
                                                <td style={{ padding: "6px 10px" }}>{row.total_buy?.toLocaleString()}</td>
                                                <td style={{ padding: "6px 10px" }}>{row.buy_avg_rate?.toLocaleString()}</td>
                                                <td style={{ padding: "6px 10px" }}>{row.total_sell?.toLocaleString()}</td>
                                                <td style={{ padding: "6px 10px" }}>{row.sell_avg_rate?.toLocaleString()}</td>
                                                <td
                                                    style={{
                                                        padding: "6px 10px",
                                                        color: row.net_qty > 0 ? "green" : row.net_qty < 0 ? "red" : "#666",
                                                        fontWeight: row.net_qty !== 0 ? "bold" : "normal",
                                                    }}
                                                >
                                                    {row.net_qty?.toLocaleString()}
                                                </td>
                                                <td style={{ padding: "6px 10px" }}>
                                                    {row.net_qty > 0
                                                    }
                                                </td>

                                                {/* MTM */}
                                                <td style={{ padding: "2px 8px" }}>
                                                    <span
                                                        style={{ fontWeight: "bold" }}
                                                        dangerouslySetInnerHTML={{ __html: row.mym_html }}
                                                    />
                                                </td>

                                                <td style={{ padding: "6px 10px", fontSize: "11px", color: "#666" }}>
                                                    {row.trade_auto_closed_date}
                                                </td>

                                                {/* Close Button */}
                                                <td style={{ padding: "6px 10px" }}>
                                                    {row.net_qty !== 0 ? (
                                                        <Button
                                                            style={{
                                                                backgroundColor: "#d32f2f",
                                                                border: "none",
                                                                color: "#fff",
                                                                padding: "3px 10px",
                                                                borderRadius: "6px",
                                                                cursor: "pointer",
                                                                fontSize: "11px",
                                                                fontWeight: "500",
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openClose(row);
                                                            }}
                                                        >
                                                            Close
                                                        </Button>
                                                    ) : (
                                                        <span style={{ color: "#aaa" }}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default UserTablePage;
