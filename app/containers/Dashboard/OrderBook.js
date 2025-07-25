import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, IconButton, FormControl, InputLabel,
    Select, MenuItem, TextField, CircularProgress,
    Card, CardContent, Button, useTheme, useMediaQuery
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import { useDebounce } from '@uidotdev/usehooks';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OrderFilter from './OrderFilter';
// import { useTheme } from '@mui/material/styles';


const OrderBook = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isDarkMode = theme.palette.mode === 'dark';

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(10);
    const [filterType, setFilterType] = useState("today");

    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 800);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState();

    const ordersPerPage = 10;

    // Fetch orders
    const fetchOrders = async (type = "today", searchValue = "") => {
        setLoading(true);
        const dataStored = JSON.parse(sessionStorage.getItem("data"));

        const formData = {
            sEcho: 1,
            iDisplayStart: (currentPage * ordersPerPage),
            iDisplayLength: ordersPerPage,
            sSearch: searchValue,
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
            isTodayTrade: type === "today" ? "today" : "",
        };

        try {
            const response = await fetch("http://128.199.126.171/~goldorg/datatables/order_book_new", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setOrders(data.aaData || []);
            const totalPage = Math.ceil(data.iTotalRecords / ordersPerPage);
            setTotalPages(totalPage);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(filterType, searchText);
    }, [filterType, debouncedSearchText]);

    // Handlers
    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setCurrentPage(0);
        setVisibleCount(10);
    };

    const handleSearchChange = (value) => {
        setSearchText(value);
        setCurrentPage(0);
        setVisibleCount(10);
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const visibleOrders = useMemo(() => orders.slice(0, visibleCount), [orders, visibleCount]);

    // const paginatedOrders = useMemo(() => {
    //     console.log('currentPage', currentPage);
    //     const start = currentPage * ordersPerPage;
    //     return orders.slice(start, start + ordersPerPage);
    // }, [orders, currentPage]);

    useEffect(() => {
        fetchOrders(filterType, searchText);
    }, [currentPage, ordersPerPage]);

    return (
        <Box sx={{ p: 0, mt: 2 }}>
            <OrderFilter isDarkMode={isDarkMode} />
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                px: 1,
                // py: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
                borderRadius: 1,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select value={filterType} label="Filter" onChange={handleFilterChange}>
                            <MenuItem value="today">Today</MenuItem>
                            <MenuItem value="all">This Week</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        size="small"
                        placeholder="Search orders"
                        value={searchText}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        fullWidth
                        sx={{ ml: 1 }}
                    />
                </Box>
            </Box>

            {/* Body */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : orders.length === 0 ? (
                <Typography sx={{ px: 1, mt: 2 }}>No orders found.</Typography>
            ) : isMobile ? (
                <>
                    {visibleOrders.map((item, index) => {
                        const [mainName, subName] = item.scrp_name.split(" ", 2);
                        const cleanRate = item.trd_rate?.split("(")[0].trim();
                        const isBuy = item.trd_type === "Buy";
                        const isSell = item.trd_type === "Sell";

                        const borderGradient = isBuy
                            ? "linear-gradient(to right, #2196f3, #21cbf3)"
                            : isSell
                                ? "linear-gradient(to right, #f44336, #ff7961)"
                                : "#ccc";

                        const boxShadowColor = isBuy
                            ? "rgba(33, 150, 243, 0.3)"
                            : isSell
                                ? "rgba(244, 67, 54, 0.3)"
                                : "rgba(0,0,0,0.1)";

                        return (
                            <Card
                                key={item.trd_id || index}
                                sx={{
                                    mb: 1,
                                    mx: 1,
                                    borderRadius: 2,
                                    border: "1px solid transparent",
                                    backgroundImage: `linear-gradient(${theme.palette.mode === "dark" ? "#333" : "#fff"
                                        }, ${theme.palette.mode === "dark" ? "#333" : "#fff"}), ${borderGradient}`,
                                    backgroundOrigin: "border-box",
                                    backgroundClip: "content-box, border-box",
                                    boxShadow: `0 4px 12px ${boxShadowColor}`,
                                    "&:hover": {
                                        transform: "scale(1.02)",
                                        boxShadow: `0 8px 20px ${boxShadowColor}`,
                                    },
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardContent
                                    sx={{
                                        p: 0.5,
                                        pb: "0px", // remove bottom padding
                                        "&:last-child": {
                                            pb: 0, // override MUI default last-child padding
                                        },
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {mainName}{" "}
                                            <span style={{ fontSize: "0.8em" }}>{subName}</span>
                                        </Typography>
                                        <Typography variant="caption">ID: #{item.trd_id}</Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <span
                                                dangerouslySetInnerHTML={{ __html: item.device_type_html }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: isBuy ? "#2196f3" : isSell ? "#f44336" : "#000",
                                                }}
                                            >
                                                {item.trd_type}{" "}
                                                <span style={{ fontSize: "0.8em", fontWeight: 400 }}>
                                                    {item.trd_type2}
                                                </span>
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2">
                                            ({item.trd_lot}) {item.actual_lot_qty} @{" "}
                                            <strong>{cleanRate}</strong>
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="caption">{item.trd_time}</Typography>
                                        <Typography variant="caption">
                                            Comm:{" "}
                                            <strong style={{ color: "#2e7d32" }}>
                                                {item.trd_comm_amnt}
                                            </strong>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {visibleCount < orders.length && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                            <Button variant="outlined" onClick={handleLoadMore} size="small">Load More</Button>
                        </Box>
                    )}
                </>
            ) : (
                <>
                    <Box
                        sx={{
                            overflowX: 'auto',
                            overflowY: 'auto',
                            maxHeight: '69vh',
                            // border: '1px solid #ddd',
                            borderRadius: 1,
                            mx: 1,

                            /* Thin scrollbar */
                            '&::-webkit-scrollbar': {
                                width: '6px',
                                height: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#aaa',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
                            },

                            /* Firefox */
                            // scrollbarWidth: 'thin',
                            // scrollbarColor: '#aaa #f0f0f0',
                        }}
                    >

                        <table style={{ minWidth: 1500, fontSize: "12px", margin: '0px' }}>
                            <thead style={{ backgroundColor: theme.palette.mode === "dark" ? "#444" : "#e0e0e0" }}>
                                <tr>
                                    {[
                                        "Device", "Time", "Trade ID", "Client", "Market", "Script",
                                        "B/S", "Order Type", "Lot", "Qty", "Order Price", "Status",
                                        "O. Time", "Comm Amt"
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            style={{
                                                color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((item, index) => {
                                    let rowBgColor;
                                    if (item.trd_type === "Buy") {
                                        rowBgColor = theme.palette.mode === "dark" ? "#264653" : "#e0f7fa";
                                    } else if (item.trd_type === "Sell") {
                                        rowBgColor = theme.palette.mode === "dark" ? "#6d2c41" : "#fce4ec";
                                    } else {
                                        rowBgColor = theme.palette.mode === "dark" ? "#333" : "#f5f5f5";
                                    }

                                    return (
                                        <tr
                                            key={item.trd_id || index}
                                            style={{
                                                backgroundColor: rowBgColor,
                                            }}
                                        >
                                            <td dangerouslySetInnerHTML={{ __html: item.device_type_html }} />
                                            <td>{item.trd_matchedtime}</td>
                                            <td>#{item.trd_id}</td>
                                            <td>{item.client_full_name}</td>
                                            <td>{item.mrkt_name}</td>
                                            <td>{item.scrp_name}</td>
                                            <td>{item.trd_type}</td>
                                            <td>{item.trd_type2}</td>
                                            <td>{item.trd_lot}</td>
                                            <td>{item.actual_lot_qty}</td>
                                            <td>{item.trd_rate}</td>
                                            <td>{item.trd_status}</td>
                                            <td>{item.trd_time}</td>
                                            <td>{item.trd_comm_amnt}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Box>
                    {/* Page Numbers */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
                        <Button
                            size="small"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            color="secondary"
                            sx={{ mr: 1 }}
                        >
                            Prev
                        </Button>

                        {[...Array(totalPages)].map((_, i) => {
                            if (
                                i === 0 ||
                                i === totalPages - 1 ||
                                (i >= currentPage - 1 && i <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={i}
                                        size="small"
                                        variant={i === currentPage ? 'contained' : 'outlined'}
                                        color="secondary"
                                        onClick={() => setCurrentPage(i)}
                                        sx={{ mx: 0.3, minWidth: '30px' }}
                                    >
                                        {i + 1}
                                    </Button>
                                );
                            }
                            if (
                                (i === 1 && currentPage > 2) ||
                                (i === totalPages - 2 && currentPage < totalPages - 3)
                            ) {
                                return (
                                    <Typography key={i} sx={{ mx: 0.5 }}>
                                        ...
                                    </Typography>
                                );
                            }
                            return null;
                        })}

                        <Button
                            size="small"
                            disabled={currentPage + 1 >= totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            color="secondary"
                            sx={{ ml: 1 }}
                        >
                            Next
                        </Button>
                    </Box>

                </>
            )
            }
        </Box >
    );
};

export default OrderBook;
