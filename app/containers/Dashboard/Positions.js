import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton,
    useMediaQuery as useMUIQuery,
    Button,
    Avatar,
    Slide,
    Fade,
    Card,
    CardContent,
    Grid,
    Drawer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from "@mui/material/styles";
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InputAdornment from "@mui/material/InputAdornment";
import ClientMasterBrokerFilter from "./filters/ClientMasterBrokerFilter";
import MarketScriptNameFilter from "./filters/MarketScriptNameFilter";
import RadioFilter from "./filters/RadioFilterField";
import DateFilter from "./filters/DateFilter";
import PositionFilter from "./PositionFilter";
import FilterBtn from "./filters/FilterBtn";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    maxHeight: "65vh",
    borderRadius: 12,
    border: "1px solid #ccc",
}));

const TableHeaderCell = styled(TableCell)({
    backgroundColor: "#F4F4F4",
    fontWeight: "bold",
    position: "sticky",
    top: 0,
    zIndex: 1,
});

const OrderPage = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMUIQuery(theme.breakpoints.down('sm', 'md'));

    const [positionData, setPositionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    // const [filter, setFilter] = useState("today");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [tradesData, setTradesData] = useState([]);
    const [loadingTrades, setLoadingTrades] = useState(false);

    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');

    const [all_outstanding, setAll_outstanding] = useState('');
    const [client_wise_value, setClient_wise_value] = useState('');
    const [exparyDate, setExparyDate] = useState('');

    const [filterDrawer, setFilterDrawer] = useState(false);

    const handleCardClick = (row) => {
        setSelectedRow(row);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
    };

    const fetchTradesData = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        if (!selectedRow) return;

        setLoadingTrades(true);
        try {
            const response = await fetch(
                "http://128.199.126.171/~goldorg/datatables/order_book_new",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        isTodayTrade: "today",
                        is_app: "1",
                        login_user_id: dataStored.user_id,
                        auth_key: dataStored.auth_key,
                        sEcho: 1,
                        iDisplayStart: 0,
                        iDisplayLength: 10,
                        script_id: selectedRow?.script_id,
                        sSearch: "",
                    }),
                }
            );

            const result = await response.json();
            setTradesData(result?.aaData || []);
        } catch (err) {
            console.error("Error fetching trades", err);
            setTradesData([]);
        } finally {
            setLoadingTrades(false);
        }
    };

    const fetchPositions = async (search = "") => {
        setLoading(true);
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        try {
            const response = await axios.post("http://128.199.126.171/~goldorg/datatables/position_book_list", {
                is_app: "1",
                login_user_id: dataStored.user_id,
                auth_key: dataStored.auth_key,
                sEcho: 1,
                iDisplayStart: 0,
                iDisplayLength: 10,
                sSearch: search,
            });

            if (response.data && response.data.aaData) {
                setPositionData(response.data.aaData);
            } else {
                setPositionData([]);
            }
        } catch (error) {
            console.error("Error fetching position data:", error);
            setPositionData([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPositions();
    }, []);

    const handleSearch = () => {
        fetchPositions(searchText.trim());
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPositions(searchText.trim());
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchText]);


    const handleViewTradesClick = () => {
        if (!expanded) fetchTradesData();
        setExpanded((prev) => !prev);
    };

    const allOutstandingOptions = [
        { label: 'All', value: '1' },
        { label: 'Outstanding', value: '0' }
    ];

    const ClientWiseOptions = [
        { label: ' Scritp name', value: 't.scritp_name' },
        { label: 'User Name', value: 'u.user_full_name' }
    ]

    return (
        <Box sx={{ p: 0, position: "relative" }}>
            {/* Filter Drawer for Mobile */}
            {isMobile ? <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                <Box sx={{ width: 280, p: 2 }} role="presentation">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setFilterDrawer(false)}><CloseIcon /></IconButton>
                    </Box>
                    <PositionFilter
                        ClientWiseOptions={ClientWiseOptions}
                        allOutstandingOptions={allOutstandingOptions}
                        setExparyDate={setExparyDate}
                        exparyDate={exparyDate}
                        setClient_wise_value={setClient_wise_value}
                        client_wise_value={client_wise_value}
                        setAll_outstanding={setAll_outstanding}
                        all_outstanding={all_outstanding}
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        client={client}
                        master={master}
                        broker={broker}
                        setClient={setClient}
                        setMaster={setMaster}
                        setBroker={setBroker}
                    />
                </Box>
            </Drawer>
                : <PositionFilter
                    ClientWiseOptions={ClientWiseOptions}
                    allOutstandingOptions={allOutstandingOptions}
                    setExparyDate={setExparyDate}
                    exparyDate={exparyDate}
                    setClient_wise_value={setClient_wise_value}
                    client_wise_value={client_wise_value}
                    setAll_outstanding={setAll_outstanding}
                    all_outstanding={all_outstanding}
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                    client={client}
                    master={master}
                    broker={broker}
                    setClient={setClient}
                    setMaster={setMaster}
                    setBroker={setBroker}
                />}
            {/* 🔍 Search Bar */}
            <Box sx={{
                px: 2, py: 1, display: "flex",
                alignItems: "center", gap: 2
            }}>
                {isMobile && <FilterBtn setFilterOpen={setFilterDrawer} />}

                {/* 🔍 Search Input */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search positions..."
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', verticalAlign: 'middle' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        // width:'100%'
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            height: 36,
                            fontSize: 13,
                            '& fieldset': {
                                borderColor: '#ccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#666',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#000',
                            },
                        },
                        '& input': {
                            py: 0.5,
                        },
                    }}
                />
            </Box>


            {/* Body */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <CircularProgress />
                </Box>
            ) : positionData.length > 0 ? (
                <>
                    {isMobile ? (
                        <>
                            {positionData.map((row, index) => {
                                const scriptHtml = row?.script_name || "";
                                const parts = scriptHtml.split("<br>");
                                const mainName = parts[0] || "";
                                const datePart = parts[1] || "";

                                const currentValue = row.total_buy * row.last_trade_price;
                                const todaysPL = -203.0;
                                const unrealizedPL = 8170;
                                const unrealizedPLPerc = 10.62;

                                return (
                                    <Box
                                        key={index}
                                        onClick={() => handleCardClick(row)}
                                        sx={{
                                            m: 0.2, // Reduce margin
                                            border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                            borderRadius: 1.5,
                                            backgroundColor: (theme) => theme.palette.background.paper,
                                            boxShadow: (theme) =>
                                                theme.palette.mode === "dark"
                                                    ? "0 0 4px rgba(255, 255, 255, 0.08)"
                                                    : "0 0 4px rgba(0, 0, 0, 0.04)",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {/* Top row */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                px: 0.8,
                                                py: 0.5, // Reduce vertical padding
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                                                <Avatar
                                                    alt={mainName.replace(/<\/?[^>]+(>|$)/g, "")}
                                                    src="/path-to-your-logo.png"
                                                    variant="square"
                                                    sx={{ width: 28, height: 28, mr: 0.6, flexShrink: 0 }} // Smaller avatar, smaller margin
                                                />
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        overflow: "hidden",
                                                        flexWrap: "nowrap",
                                                        minWidth: 0,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 700,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            mr: 0.3, // Reduce margin
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: mainName }}
                                                    />
                                                    <Box sx={{ display: "flex", alignItems: "center", ml: 0.4 }}>
                                                        <ShoppingBagIcon fontSize="inherit" sx={{ fontSize: 10, color: "text.disabled" }} />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: 10,
                                                                fontWeight: 300,
                                                                ml: 0.2,
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {row.total_buy} X {row.buy_avg_rate}
                                                        </Typography>
                                                    </Box>
                                                    {datePart && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{ opacity: 0.7, ml: 0.4, whiteSpace: "nowrap" }}
                                                            dangerouslySetInnerHTML={{ __html: datePart }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: "right", minWidth: 65, flexShrink: 0 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                    {row.last_trade_price}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: row.change_value < 0
                                                            ? (theme) => theme.palette.error.main
                                                            : (theme) => theme.palette.success.main,
                                                    }}
                                                >
                                                    {row.change_value} ({row.change_perc}%)
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Bottom row */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                py: 0.3, // Reduce vertical padding
                                                px: 0.5, // Add small horizontal padding
                                                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                                                textAlign: "center",
                                                width: "100%",
                                            }}
                                        >
                                            <Box sx={{ flex: 0.5, pr: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                    {isNaN(currentValue)
                                                        ? "---"
                                                        : currentValue >= 1000
                                                            ? `${(currentValue / 1000).toFixed(2)}K`
                                                            : currentValue.toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    Current Value
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "error.main" }}>
                                                    {todaysPL.toFixed(2)}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    Today&apos;s P&amp;L
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 0.5, minWidth: '125px' }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "success.main" }}>
                                                    {unrealizedPL >= 1000
                                                        ? `+${(unrealizedPL / 1000).toFixed(2)}K`
                                                        : `+${unrealizedPL.toFixed(2)}`}{" "}
                                                    <Typography component="span" variant="caption" sx={{ color: "success.main" }}>
                                                        ({unrealizedPLPerc}%)
                                                    </Typography>
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    Unrealized P&amp;L
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </>
                    ) : (
                        <Box
                            sx={{
                                height: 'calc(100vh - 120px)', // Adjust based on your layout
                                overflow: 'hidden',
                                mx: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Paper
                                sx={{
                                    flex: 1,
                                    overflow: 'auto',
                                    scrollbarWidth: 'none', // Firefox
                                    '&::-webkit-scrollbar': {
                                        display: 'none', // Chrome, Safari, Edge
                                    },
                                }}
                            >
                                <table
                                    style={{
                                        minWidth: '1350px',
                                        fontSize: '12px',
                                        borderCollapse: 'collapse',
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {[
                                                'Market Type',
                                                'Script',
                                                'Total Buy',
                                                'Buy Avg Rate',
                                                'Total Sell',
                                                'Sell Avg Rate',
                                                'Net Qty',
                                                'Last Trade Price',
                                                'MTM',
                                                'Auto Closed Date',
                                                'Close Btn',
                                            ].map((heading, i) => (
                                                <th
                                                    key={i}
                                                    style={{
                                                        backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#e0e0e0',
                                                        textAlign: 'left',
                                                        padding: '8px',
                                                        position: 'sticky',
                                                        top: 0,
                                                        zIndex: 1,
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
                                                theme.palette.mode === 'dark'
                                                    ? isEven
                                                        ? '#2a2a2a'
                                                        : '#1f1f1f'
                                                    : isEven
                                                        ? '#f9f9f9'
                                                        : '#ffffff';

                                            return (
                                                <tr key={index} style={{ backgroundColor: rowBgColor }}>
                                                    <td style={{ padding: '8px' }}>{row.market_type_name}</td>
                                                    <td style={{ padding: '8px' }}>
                                                        <div
                                                            style={{
                                                                display: 'inline-block',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                maxWidth: '180px',
                                                                lineHeight: 1.2,
                                                                verticalAlign: 'middle',
                                                            }}
                                                            dangerouslySetInnerHTML={{ __html: row.script_name }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '8px' }}>{row.total_buy}</td>
                                                    <td style={{ padding: '8px' }}>{row.buy_avg_rate}</td>
                                                    <td style={{ padding: '8px' }}>{row.total_sell}</td>
                                                    <td style={{ padding: '8px' }}>{row.sell_avg_rate}</td>
                                                    <td style={{ padding: '8px' }}>{row.net_qty}</td>
                                                    <td style={{ padding: '8px' }}>{row.last_trade_price}</td>
                                                    <td style={{ padding: '8px' }}>
                                                        <span dangerouslySetInnerHTML={{ __html: row.mym_html }} />
                                                    </td>
                                                    <td style={{ padding: '8px' }}>{row.trade_auto_closed_date}</td>
                                                    <td style={{ padding: '8px' }}>
                                                        <button
                                                            style={{
                                                                backgroundColor: '#d32f2f',
                                                                border: 'none',
                                                                color: '#fff',
                                                                padding: '6px 12px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => alert('Close Position')}
                                                        >
                                                            Close
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            </Paper>
                        </Box>

                    )}
                </>
            ) : (
                <Typography sx={{ p: 2 }}>No data found.</Typography>
            )}

            {/* Slide-up panel inside dialog */}
            {/* --- Drawer Panel Inside Dialog --- */}
            {drawerOpen && (
                <>
                    <Slide
                        direction="up"
                        in={drawerOpen}
                        mountOnEnter
                        unmountOnExit
                        onExited={() => {
                            setExpanded(false); // optional reset of expanded state
                        }}
                    >
                        <Box
                            sx={{
                                position: "fixed",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                width: "100%",
                                bgcolor: "background.paper",
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                boxShadow: "0px -8px 30px rgba(0, 0, 0, 0.3)",
                                p: 2,
                                maxHeight: "85vh",
                                display: "flex",
                                flexDirection: "column",
                                zIndex: 1400,
                            }}
                        >
                            {/* Fixed Header */}
                            <Box sx={{ flexShrink: 0 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                                        <Avatar
                                            alt={selectedRow?.script_name?.replace(/<\/?[^>]+(>|$)/g, "")}
                                            src="/path-to-your-logo.png"
                                            variant="square"
                                            sx={{ width: 50, height: 50, mr: 1, flexShrink: 0 }}
                                        />
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            dangerouslySetInnerHTML={{ __html: selectedRow?.script_name }}
                                            sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                        />
                                    </Box>
                                    <IconButton size="large" onClick={handleDrawerClose}>
                                        <ArrowDropDownIcon />
                                    </IconButton>
                                </Box>

                                {/* Summary Info */}
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Total Buy</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.total_buy}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Total Sell</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.total_sell}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Buy Avg Rate</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.buy_avg_rate}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Sell Avg Rate</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.sell_avg_rate}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Market Type</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.market_type_name}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Net Qty</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.net_qty}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">LTP</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.last_trade_price}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">MTM</Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            dangerouslySetInnerHTML={{ __html: selectedRow?.mym_html }}
                                        />
                                    </Box>
                                </Box>

                                <Box sx={{ flex: "1 1 100%", mb: 2 }}>
                                    <Typography variant="caption">Auto Closed Date</Typography>
                                    <Typography variant="body2" fontWeight={600}>{selectedRow?.trade_auto_closed_date}</Typography>
                                </Box>

                                {/* Action Buttons */}
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        fullWidth
                                        sx={{
                                            background: "linear-gradient(135deg, #0d47a1, #1565c0)",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            boxShadow: "0 4px 10px rgba(13, 71, 161, 0.4)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.03)",
                                                boxShadow: "0 6px 16px rgba(13, 71, 161, 0.6)",
                                                background: "linear-gradient(135deg, #0b3c91, #0d47a1)",
                                            },
                                        }}
                                        onClick={handleViewTradesClick}
                                    >
                                        {expanded ? "Hide Trades" : "View Trades"}
                                    </Button>

                                    <Button
                                        fullWidth
                                        sx={{
                                            background: "linear-gradient(135deg, #b71c1c, #c62828)",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            fontWeight: 600,
                                            textTransform: "uppercase",
                                            boxShadow: "0 4px 10px rgba(183, 28, 28, 0.4)",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.03)",
                                                boxShadow: "0 6px 16px rgba(183, 28, 28, 0.6)",
                                                background: "linear-gradient(135deg, #8e0000, #b71c1c)",
                                            },
                                        }}
                                        onClick={() => alert("Close Position")}
                                    >
                                        Close Position
                                    </Button>
                                </Box>
                            </Box>

                            {/* Scrollable Trades */}
                            {expanded && (
                                <Fade in={expanded} timeout={600}>
                                    <Box
                                        sx={{
                                            mt: 2,
                                            overflowY: "auto",
                                            maxHeight: "60vh",
                                            pr: 1,
                                        }}
                                    >
                                        {loadingTrades ? (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "150px",
                                                }}
                                            >
                                                <CircularProgress size={32} thickness={4} />
                                            </Box>
                                        ) : tradesData.length > 0 ? (
                                            tradesData.map((item, index) => {
                                                const [mainName, subName] = item.scrp_name.split(" ", 2);
                                                const cleanRate = item.trd_rate?.split("(")[0].trim();
                                                const isBuy = item.trd_type === "Buy";
                                                const isSell = item.trd_type === "Sell";

                                                const borderGradient = isBuy
                                                    ? "linear-gradient(to right, #1976d2, #0d47a1)"
                                                    : isSell
                                                        ? "linear-gradient(to right, #c62828, #b71c1c)"
                                                        : "#ccc";

                                                const boxShadowColor = isBuy
                                                    ? "rgba(25, 118, 210, 0.3)"
                                                    : isSell
                                                        ? "rgba(198, 40, 40, 0.3)"
                                                        : "rgba(0,0,0,0.1)";

                                                return (
                                                    <Card
                                                        key={item.trd_id || index}
                                                        sx={{
                                                            mb: 1,
                                                            borderRadius: 2,
                                                            position: "relative",
                                                            border: "1px solid transparent",
                                                            backgroundImage: (theme) =>
                                                                `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"}, ${theme.palette.mode === "dark" ? "#333" : "#fff"
                                                                }), ${borderGradient}`,
                                                            backgroundOrigin: "border-box",
                                                            backgroundClip: "content-box, border-box",
                                                            boxShadow: `0 4px 12px ${boxShadowColor}`,
                                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                            "&:hover": {
                                                                transform: "scale(1.02)",
                                                                boxShadow: `0 8px 20px ${boxShadowColor}`,
                                                            },
                                                        }}
                                                    >
                                                        {item.is_hot && (
                                                            <Box
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    right: 0,
                                                                    backgroundColor: "gold",
                                                                    color: "#000",
                                                                    fontSize: "0.7em",
                                                                    px: 1,
                                                                    py: 0.3,
                                                                    borderBottomLeftRadius: 4,
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                HOT
                                                            </Box>
                                                        )}

                                                        <CardContent sx={{ p: 0.5, "&:last-child": { pb: 0.5 } }}>
                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                                    {mainName}{" "}
                                                                    <span style={{ fontSize: "0.8em", fontWeight: 500 }}>{subName}</span>
                                                                </Typography>
                                                                <Typography variant="caption">ID: #{item.trd_id}</Typography>
                                                            </Box>

                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        component="span"
                                                                        dangerouslySetInnerHTML={{ __html: item.device_type_html }}
                                                                        sx={{ mr: 0.3 }}
                                                                    />
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: isBuy ? "#1976d2" : isSell ? "#c62828" : "#000",
                                                                            fontWeight: 700,
                                                                            textTransform: "uppercase",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                        }}
                                                                    >
                                                                        {isBuy ? "📈" : isSell ? "📉" : ""} {item.trd_type}{" "}
                                                                        <span style={{ fontSize: "0.8em", fontWeight: 400 }}>
                                                                            {item.trd_type2}
                                                                        </span>
                                                                    </Typography>
                                                                </Box>

                                                                <Typography variant="body2">
                                                                    ({item.trd_lot}) {item.actual_lot_qty} @{" "}
                                                                    <span style={{ fontWeight: 700, fontSize: "1em", marginLeft: 4 }}>
                                                                        {cleanRate}
                                                                    </span>
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Typography variant="caption">{item.trd_time}</Typography>
                                                                <Typography variant="caption">
                                                                    Commission:{" "}
                                                                    <span style={{ fontWeight: 700, color: "#2e7d32" }}>{item.trd_comm_amnt}</span>
                                                                </Typography>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })
                                        ) : (
                                            <Typography variant="body2">No trades found</Typography>
                                        )}
                                    </Box>
                                </Fade>
                            )}
                        </Box>
                    </Slide>

                    {/* Backdrop */}
                    <Box
                        onClick={handleDrawerClose}
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backdropFilter: "blur(5px)",
                            backgroundColor: "rgba(0,0,0,0.2)",
                            zIndex: 1200,
                        }}
                    />
                </>
            )}
        </Box>
    );
};

export default OrderPage;
