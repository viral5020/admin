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
import { cashEntryAPI, fetchOptionsAPI, fetchProfileAPI, fetchSummaryAPI, fetchPositionsByUserAPI } from "./API/API";
import OrderBook from "./OrderBook";
import OrderPage1 from "./Positions";
import { useDebounce } from "@uidotdev/usehooks";

const UserTablePage = () => {
    const theme = useTheme();

    // Dropdown state
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserId, setselectedUserId] = useState(null);

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

    const userData = JSON.parse(sessionStorage.getItem("data") || "{}");

    const userType = userData?.user_type; // example user type

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);

    useEffect(() => {
        fetchUsers(searchText);
    }, [debouncedSearchText]);

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
            const params = {
                is_app: 1,
                login_user_id: userData?.user_id,
                auth_key: userData?.auth_key,
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
            const { profile, loginIps } = await fetchProfileAPI({ view_user_id: selectedUser?.id || "" });

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
            const data = await fetchSummaryAPI({
                login_user_id: userData?.user_id,
                auth_key: userData?.auth_key,
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
        if (!selectedUser) return;
        setIsUserSelected(true);

        fetchLogs();
        if (!userData?.investor_status) fetchProfile();
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
                    onInputChange={(e, val, reason) => reason === "input" && setSearchText(val)}
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
                        {console.log('selectedUser', selectedUser)}
                        <OrderBook
                            filterShow={false}
                            user_id={selectedUser?.id || ""}   // ✅ correct
                        />
                    </Paper>



                    {/* Positions Table */}

                    <Paper sx={{ ...glassStyles, mb: 3, p: 1, overflowX: "auto" }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Positions</Typography>
                        <OrderPage1
                            filterShow={false}
                            filterShow1={false}
                            user_id={selectedUser?.id} // pass selectedUser ID here
                        />
                    </Paper>
                </>
            )}
        </Box>
    );
};

export default UserTablePage;
