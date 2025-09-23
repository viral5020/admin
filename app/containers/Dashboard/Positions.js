import React, { useContext, useState, useEffect, startTransition, useRef } from "react";
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
    Dialog,
    DialogContent,
    DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from '@mui/icons-material/Close';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import { styled } from "@mui/material/styles";
import { useTheme, alpha } from '@mui/material/styles';
import axios from 'axios';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import InputAdornment from "@mui/material/InputAdornment";
// import ClientMasterBrokerFilter from "./filters/ClientMasterBrokerFilter";
// import MarketScriptNameFilter from "./filters/MarketScriptNameFilter";
// import RadioFilter from "./filters/RadioFilterField";
// import DateFilter from "./filters/DateFilter";
import PositionFilter from "./PositionFilter";
import FilterBtn from "./filters/FilterBtn";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { apifetchPositions, fetchTradesDataAPI, placeTrade } from "./API/API";
import SocketContext from "./Socket/SocketContext";
import { formatScriptIds } from "./helpers/utilFunc";
import { toast, ToastContainer } from "react-toastify";
import SearchPdfCsv from "./filters/SearchPdfCsv";


// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//     maxHeight: "65vh",
//     borderRadius: 12,
//     border: "1px solid #ccc",
// }));

// const TableHeaderCell = styled(TableCell)({
//     backgroundColor: "#F4F4F4",
//     fontWeight: "bold",
//     position: "sticky",
//     top: 0,
//     zIndex: 1,
// });


const OrderPage1 = ({
    filterShow = true,
    setFilterShow = () => { },
    filterShow1 = true,
    setFilterShow1 = () => { },
    view_user_id
}) => {
    // console.log("filterShow=", filterShow);
    const theme = useTheme();
    // const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMUIQuery(theme.breakpoints.down('sm', 'md'));

    const { socket, socketSports } = useContext(SocketContext);
    const [positionData, setPositionData] = useState([]);
    const [data, setPositionDataNew] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    // const [filter, setFilter] = useState("today");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerOpen1, setDrawerOpen1] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [tradesData, setTradesData] = useState([]);
    const [loadingTrades, setLoadingTrades] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState("");

    const [market, setMarket] = useState('');
    const [script, setScript] = useState([]);
    const [client, setClient] = useState('');
    const [master, setMaster] = useState('');
    const [broker, setBroker] = useState('');
    const [totals, setTotals] = useState({
        upline_grand: "0",
        downline_grand: "0",
        self_grand: "0",
        total_qty: "0",
        totalMTM: "0",
        net: "0",
        limit: "0",
        limit1: "0",
    });


    const rawData = JSON.parse(sessionStorage.getItem("data"));
    const userType = parseInt(rawData?.user_type, 10);

    const [all_outstanding, setAll_outstanding] = useState('');
    const [client_wise_value, setClient_wise_value] = useState('');
    const [exparyDate, setExparyDate] = useState('');

    const [filterDrawer, setFilterDrawer] = useState(false);

    const [closeDialogOpen, setCloseDialogOpen] = useState(false);
    const [orderType, setOrderType] = useState("MARKET");
    const [lot, setLot] = useState(0.01);
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);
    const [dataStored, setDataStored] = useState(() => {
        return JSON.parse(sessionStorage.getItem("data")) || [];
    });

    const [closetradeData, setClosetradeData] = useState({
        market_type_id: "",
        script_id: "",
        script_expiry_id: "",
        trade_type: "",
        trade_rate: 0,
        trade_qty: "",
        trade_lot: "",
        trade_type_x: "",
        check_script_name: "",
        user_id: "",
        trade_id: "",
        device_type: 0,
        is_app: "1",
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
    });

    const [dataTrade, SetdataTrade] = useState(undefined);
    const [liveRates, setliveRates] = useState({});
    const selectedOrderSet = useRef();
    const selectTradeTypeSet = useRef("0");
    const currentData = liveRates[selectedOrder];

    const [flat, setfFlat] = useState([]);
    const [QuotationLot, setQuotationLot] = useState(0);
    const formatNumberWithCommas = (number, decimalPlaces) => {
        const fixedNumber = Number(number).toFixed(decimalPlaces);
        return fixedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    const colArr = [
        ...(userType !== 1 ? ["Client"] : []),
        "Script",
        "Market",
        "Total Buy",
        "Buy Avg Rate",
        "Total Sell",
        "Sell Avg Rate",
        "Net Qty",
        // "Last Trade Price",
        "MTM",
        "Auto Closed Date",
        // "Close Btn",
    ]

    const keyArr = [
        ...(userType !== 1 ? ["client_full_name"] : []),   // shown only if userType !== 1
        "script_name",
        "market_type_name",
        "total_buy_qty",
        "buy_avg_rate",
        "total_sell_qty",
        "sell_avg_rate",
        "net_qty",
        // "check_script_name",  // used for liveRates lookup
        // "mtm",                // numeric value for color logic
        "mym_html",           // rendered with dangerouslySetInnerHTML
        "trade_auto_closed_date",
    ]


    const handleCardClick = (row) => {
        setSelectedRow(row);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
    };


    const openDrawer = (row) => {
        setSelectedRow(row);
        setDrawerOpen1(true);
    };

    const closeDrawer = () => {
        setDrawerOpen1(false);
        setSelectedRow(null);
    };

    const fetchTradesData = async () => {
        if (!selectedRow) return;
        setLoadingTrades(true);
        const result = await fetchTradesDataAPI(dataStored.user_id, dataStored.auth_key, selectedRow.script_id, searchText);
        setTradesData(result);
        setLoadingTrades(false);
    };

    async function handlePlaceTrade() {
        try {
            const result = await placeTrade(closetradeData);

            if (result?.status === "ok" || result?.success) {
                toast.success(result.message || "Trade placed successfully!");
                setCloseDialogOpen(false);
            } else {
                toast.error(result.message || "Trade placement failed");
            }
        } catch (error) {
            console.error("❌ Trade placement error:", error);
            toast.error(`Network error: ${error.message}`);
        }
    }


    const fetchPositions = async () => {
        setLoading(true);
        const result = await apifetchPositions(view_user_id);
        setPositionData(result);
        setLoading(false);
    };

    useEffect(() => {

        fetchPositions();
    }, []);


    const items = [
        { label: "Total MTM", value: totals.totalMTM, key: "totalMTM", color: "#1976d2" },
        { label: "Self MTM", value: totals.self_grand, key: "self_grand", color: "#2e7d32" },
        { label: "Downline MTM", value: totals.downline_grand, key: "downline_grand", color: "#ed6c02" },
        { label: "Upline MTM", value: totals.upline_grand, key: "upline_grand", color: "#9c27b0" },
        { label: "Total Qty", value: totals.total_qty, key: "total_qty", color: "#d32f2f" },
    ];
    const [highlighted, setHighlighted] = useState({});
    const prevTotals = useRef({ ...totals });

    useEffect(() => {
        items.forEach(item => {
            if (prevTotals.current[item.key] !== item.value) {
                // Value changed → trigger highlight
                setHighlighted(prev => ({ ...prev, [item.key]: true }));

                // Remove highlight after a short delay
                setTimeout(() => {
                    setHighlighted(prev => ({ ...prev, [item.key]: false }));
                }, 1200);
            }
        });

        // Update previous values
        prevTotals.current = { ...totals };
    }, [totals]);


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPositions(null, searchText.trim());
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    useEffect(() => {
        initSocketEvents();
    }, [positionData]);

    const initSocketEvents = async () => {
        // console.log("initSocketEvents=");
        socket.emit('connected1', {
            'ty': 1
        });
        socket.on('connectionSuccess', function (args) {

            let flat_new = flat.filter((v, i, a) => a.indexOf(v) === i);
            // console.log("flat_new=", flat_new);
            setfFlat(flat_new)
            socket.emit('connectMarketWatch', {
                scripts: flat_new
            });
        });
        socket.on('reconnecting', function () { })
        socket.on('reconnect', function () { })
        var old_rate = 0;
        socket.on('marketWatch', function (args) {
            // console.log('args', args);


            if (args && args.data) {

                if (args.data.InstrumentIdentifier == "SGXNIFTY-I" || args.data.InstrumentIdentifier == "NIFTY 50-I") {
                    args.data.InstrumentIdentifier = "NIFTY 50-I";
                    args.data.Exchange = "GLOBAL FUTURES";
                }

                var newArray = data.reduce(function (a, e, i) {


                    if (e[0] === args.data.InstrumentIdentifier && parseInt(e[8]) != 0)
                        a.push(i);
                    return a;
                }, []);

                var iz = 0;
                let liveRatesConst = {};
                while (newArray[iz] >= 0) {
                    let updatedData = [...data];

                    if ((args.data.BuyPrice > 0 && args.data.SellPrice > 0) || args.data.LastTradePrice > 0) {
                        if (args.data.BuyPrice == 0 || !args.data.BuyPrice || true) {
                            args.data.BuyPrice = args.data.LastTradePrice;
                        }
                        if (args.data.SellPrice == 0 || !args.data.SellPrice || true) {
                            args.data.SellPrice = args.data.LastTradePrice;
                        }

                        if (liveRates[args.data.InstrumentIdentifier]) {
                            liveRates[args.data.InstrumentIdentifier].BuyPrice = args.data.BuyPrice;
                            liveRates[args.data.InstrumentIdentifier].SellPrice = args.data.SellPrice;
                            liveRates[args.data.InstrumentIdentifier].PriceChange = args.data.PriceChange;
                            liveRates[args.data.InstrumentIdentifier].PriceChangePercentage = args.data.PriceChangePercentage;
                            liveRates[args.data.InstrumentIdentifier].Open = args.data.Open;
                            liveRates[args.data.InstrumentIdentifier].Close = args.data.Close;
                            liveRates[args.data.InstrumentIdentifier].LastTradePrice = args.data.LastTradePrice;
                            console.log('liveRates', liveRates);

                            startTransition(() => {
                                setliveRates(liveRates);
                            });
                        } else {

                            liveRates[args.data.InstrumentIdentifier] = {};
                            liveRates[args.data.InstrumentIdentifier].BuyPrice = args.data.BuyPrice;
                            liveRates[args.data.InstrumentIdentifier].SellPrice = args.data.SellPrice;
                            liveRates[args.data.InstrumentIdentifier].PriceChange = args.data.PriceChange;
                            liveRates[args.data.InstrumentIdentifier].PriceChangePercentage = args.data.PriceChangePercentage;
                            liveRates[args.data.InstrumentIdentifier].Open = args.data.Open;
                            liveRates[args.data.InstrumentIdentifier].Close = args.data.Close;
                            liveRates[args.data.InstrumentIdentifier].LastTradePrice = args.data.LastTradePrice;
                            console.log('liveRates', liveRates);
                            startTransition(() => {
                                setliveRates(liveRates);
                            });
                        }
                        if (parseInt(updatedData[newArray[iz]][8]) && parseInt(updatedData[newArray[iz]][8]) > 0) {

                            var x = Number(args.data.BuyPrice).toFixed(2);
                            var x = formatNumberWithCommas(x, 2);

                            if (dataStored.user_type != 1) {
                                $($($("." + updatedData[newArray[iz]][13])).children()[8]).html(x);
                            } else {
                                $($($("." + updatedData[newArray[iz]][13])).children()[7]).html(x);
                            }

                            var x2 = Math.abs(parseInt(updatedData[newArray[iz]][8]));
                            var x1 = (parseFloat(updatedData[newArray[iz]][6]) * parseFloat(updatedData[newArray[iz]][7])) - (parseFloat(updatedData[newArray[iz]][4]) * parseFloat(updatedData[newArray[iz]][5])) + (parseFloat(x2) * parseFloat(args.data.BuyPrice));
                            if ($("." + updatedData[newArray[iz]][13] + "_self") && $("." + updatedData[newArray[iz]][13] + "_self")[0]) {
                                var flag_1 = 1;
                                var x1_1 = 0;
                                if (parseInt(dataStored.user_type) != 1) {
                                    flag_1 = -1;
                                    x1_1 = x1 * updatedData[newArray[iz]][14] / 100 * flag_1;
                                    updatedData[newArray[iz]][17] = x1_1;
                                    x1_1 = Number(x1_1).toFixed(2);
                                    x1_1 = formatNumberWithCommas(x1_1, 2);

                                    $("." + updatedData[newArray[iz]][13] + "_self").html(x1_1);
                                } else {
                                    flag_1 = 1;
                                    x1_1 = x1;
                                    updatedData[newArray[iz]][17] = x1_1;
                                    x1_1 = Number(x1_1).toFixed(2);
                                    x1_1 = formatNumberWithCommas(x1_1, 2);
                                    $("." + updatedData[newArray[iz]][13] + "_self").html(x1_1);
                                }
                            }
                            if ($("." + updatedData[newArray[iz]][13] + "_upline") && $("." + updatedData[newArray[iz]][13] + "_upline")[0]) {
                                var flag_2 = 1;
                                var x1_2 = 0;
                                if (parseInt(dataStored.user_type) != 1) {
                                    flag_2 = -1;
                                }
                                x1_2 = x1 * updatedData[newArray[iz]][15] / 100 * flag_2;
                                updatedData[newArray[iz]][18] = x1_2;
                                x1_2 = Number(x1_2).toFixed(2);
                                x1_2 = formatNumberWithCommas(x1_2, 2);
                                $("." + updatedData[newArray[iz]][13] + "_upline").html(x1_2);
                            }
                            if ($("." + updatedData[newArray[iz]][13] + "_downline") && $("." + updatedData[newArray[iz]][13] + "_downline")[0]) {
                                var flag_3 = 1;
                                var x1_3 = 0;
                                if (parseInt(dataStored.user_type) != 1 && updatedData[newArray[iz]][16] > 0) {
                                    flag_3 = -1;
                                    x1_3 = x1 * updatedData[newArray[iz]][16] / 100 * flag_3;
                                    updatedData[newArray[iz]][19] = x1_3;
                                    x1_3 = Number(x1_3).toFixed(2);
                                    x1_3 = formatNumberWithCommas(x1_3, 2);
                                    $("." + updatedData[newArray[iz]][13] + "_downline").html(x1_3);
                                }
                            }
                            if ($("." + updatedData[newArray[iz]][13] + "_user") && $("." + updatedData[newArray[iz]][13] + "_user")[0]) {
                                var x1_3 = x1;
                                updatedData[newArray[iz]][20] = x1_3;
                                x1_3 = Number(x1_3).toFixed(2);
                                x1_3 = formatNumberWithCommas(x1_3, 2);
                                $("." + updatedData[newArray[iz]][13] + "_user").html(x1_3);
                            }
                            if (selectedOrderSet.current == args.data.InstrumentIdentifier && parseInt(selectTradeTypeSet.current) == 0) {
                                setClosetradeData(prvValue => ({
                                    ...prvValue,
                                    trade_rate: args.data.BuyPrice,
                                }))
                                SetdataTrade(args.data);
                            }
                        } else if (parseInt(updatedData[newArray[iz]][8]) && parseInt(updatedData[newArray[iz]][8]) < 0) {
                            var x = Number(args.data.SellPrice).toFixed(2);
                            var x = formatNumberWithCommas(x, 2);
                            if (dataStored.user_type != 1) {
                                $($($("." + updatedData[newArray[iz]][13])).children()[8]).html(x);
                            } else {
                                $($($("." + updatedData[newArray[iz]][13])).children()[7]).html(x);
                            }

                            var x2 = Math.abs(parseInt(updatedData[newArray[iz]][8]));
                            var x1 = parseFloat(updatedData[newArray[iz]][6]) * parseFloat(updatedData[newArray[iz]][7]) - parseFloat(updatedData[newArray[iz]][4]) * parseFloat(updatedData[newArray[iz]][5]) - parseFloat(x2) * parseFloat(args.data.SellPrice);
                            var flag_1 = 1;
                            var x1_1 = 0;
                            if ($("." + updatedData[newArray[iz]][13] + "_self") && $("." + updatedData[newArray[iz]][13] + "_self")[0]) {
                                if (parseInt(dataStored.user_type) != 1) {
                                    flag_1 = -1;
                                    x1_1 = x1 * updatedData[newArray[iz]][14] / 100 * flag_1;
                                    updatedData[newArray[iz]][17] = x1_1;
                                    x1_1 = Number(x1_1).toFixed(2);
                                    x1_1 = formatNumberWithCommas(x1_1, 2);
                                    $("." + updatedData[newArray[iz]][13] + "_self").html(x1_1);
                                } else {
                                    flag_1 = 1;
                                    x1_1 = x1;
                                    updatedData[newArray[iz]][17] = x1_1;
                                    x1_1 = Number(x1_1).toFixed(2);
                                    x1_1 = formatNumberWithCommas(x1_1, 2);
                                    $("." + updatedData[newArray[iz]][13] + "_self").html(x1_1);
                                }
                            }
                            if ($("." + updatedData[newArray[iz]][13] + "_upline") && $("." + updatedData[newArray[iz]][13] + "_upline")[0]) {
                                var flag_2 = 1;
                                var x1_2 = 0;
                                if (parseInt(dataStored.user_type) != 1) {
                                    flag_2 = -1;
                                }
                                x1_2 = x1 * updatedData[newArray[iz]][15] / 100 * flag_2;
                                updatedData[newArray[iz]][18] = x1_2;
                                x1_2 = Number(x1_2).toFixed(2);
                                x1_2 = formatNumberWithCommas(x1_2, 2);
                                $("." + updatedData[newArray[iz]][13] + "_upline").html(x1_2);
                            }
                            if ($("." + updatedData[newArray[iz]][13] + "_downline") && $("." + updatedData[newArray[iz]][13] + "_downline")[0]) {
                                var flag_3 = 1;
                                var x1_3 = 0;
                                if (parseInt(dataStored.user_type) != 1 && updatedData[newArray[iz]][16] > 0) {
                                    flag_3 = -1;
                                    x1_3 = x1 * updatedData[newArray[iz]][16] / 100 * flag_3;
                                    updatedData[newArray[iz]][19] = x1_3;
                                    x1_3 = Number(x1_3).toFixed(2);
                                    x1_3 = formatNumberWithCommas(x1_3, 2);
                                    $("." + updatedData[newArray[iz]][13] + "_downline").html(x1_3);
                                }
                            }
                            if ($("." + updatedData[newArray[iz]][13] + "_user") && $("." + updatedData[newArray[iz]][13] + "_user")[0]) {
                                var x1_3 = x1;
                                updatedData[newArray[iz]][20] = x1_3;
                                x1_3 = Number(x1_3).toFixed(2);
                                x1_3 = formatNumberWithCommas(x1_3, 2);
                                $("." + updatedData[newArray[iz]][13] + "_user").html(x1_3);
                            }
                            if (selectedOrderSet.current == args.data.InstrumentIdentifier && parseInt(selectTradeTypeSet.current) == 0) {

                                setClosetradeData(prvValue => ({
                                    ...prvValue,
                                    trade_rate: args.data.SellPrice,
                                }))
                                SetdataTrade(args.data);
                            }
                        } else { }
                    }
                    iz++;
                    if (iz == newArray.length) {


                        var myArray1 = updatedData.map(function (town) {
                            return town[17];
                        }).reduce(function (a, b) {
                            return a + b;
                        }, 0);
                        var myArray2 = updatedData.map(function (town) {
                            return town[18];
                        }).reduce(function (a, b) {
                            return a + b;
                        }, 0);
                        var myArray3 = updatedData.map(function (town) {
                            return town[19];
                        }).reduce(function (a, b) {
                            return a + b;
                        }, 0);
                        var flag_total = 1;
                        if (dataStored.user_type != 1) {
                            flag_total = -1
                        }
                        var net = parseFloat(totals.limit1) + myArray1;

                        var myArray4 = (parseFloat(myArray1) + parseFloat(myArray2) + parseFloat(myArray3)) * flag_total;
                        myArray4 = Number(myArray4).toFixed(2);
                        myArray4 = formatNumberWithCommas(myArray4, 2);
                        myArray1 = Number(myArray1).toFixed(2);
                        myArray1 = formatNumberWithCommas(myArray1, 2);
                        myArray2 = Number(myArray2).toFixed(2);
                        myArray2 = formatNumberWithCommas(myArray2, 2);
                        myArray3 = Number(myArray3).toFixed(2);
                        myArray3 = formatNumberWithCommas(myArray3, 2);
                        net = Number(net).toFixed(2);
                        net = formatNumberWithCommas(net, 2);
                        if (args.data.InstrumentIdentifier == "GOLD-I") {

                            if (old_rate != args.data.LastTradePrice) {
                                // console.log("args=", args.data.LastTradePrice);
                                // console.log("total old=", totals.totalMTM);
                            }
                        }


                        setTotals(prv => ({
                            ...prv,
                            upline_grand: myArray2,
                            downline_grand: myArray3,
                            self_grand: myArray1,
                            totalMTM: myArray4,
                            net: net,

                        }));
                        if (args.data.InstrumentIdentifier == "GOLD-I") {

                            if (old_rate != args.data.LastTradePrice) {
                                console.log("total new=", totals.totalMTM);
                                old_rate = args.data.LastTradePrice;
                            }
                        }


                    }
                }
            }
        });
    }
    useEffect(() => {
        // console.log("totals updated:", totals.totalMTM);
    }, [totals]);
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

    const openClose = (data) => {
        if (data) {
            let selectTradeQtySize = Math.abs(parseInt(data['net_qty']));

            let selectTradePrice = 0;
            let buyRadio = 0;
            if (liveRates && liveRates[data['check_script_name']]) {
                if (parseInt(data['net_qty']) < 0) {
                    buyRadio = 0;
                    selectTradePrice = liveRates[data['check_script_name']].SellPrice;
                } else {
                    buyRadio = 1;
                    selectTradePrice = liveRates[data['check_script_name']].BuyPrice;
                }
            }
            let selectMarketTrade = data['market_type_name'] == 'NSECDS' ? 9 : data['market_type_name'] == 'NSEFUT' ? 2 : data['market_type_name'] == 'NSEOPT' ? 5 : data['market_type_name'] == 'GLOBAL FUTURES' ? 4 : data['market_type_name'] == 'NSEEQT' ? 8 : data['market_type_name'] == 'MCXFUT' ? 1 : data['market_type_name'] == 'GLOBAL STOCKS' ? 11 : 1;
            let QuotationLot = parseInt(data['script_lot_qty']);
            setQuotationLot(QuotationLot);
            let selectTradeLotSize = selectTradeQtySize / QuotationLot;
            let selectedOrdern = data['check_script_name'];

            startTransition(() => {
                setSelectedOrder(selectedOrdern);

            });
            selectedOrderSet.current = selectedOrdern;
            let scriptNameTrade = selectedOrdern;
            let selectScriptTrade = data['script_id'];
            let selectExpiryTrade = data['script_expiry_id'];
            let selectTradeId = "";
            var str = data['client_script_id'].split("-");
            let positionUserId = str[str.length - 1];

            setClosetradeData(prvValue => ({
                ...prvValue,
                market_type_id: selectMarketTrade,
                script_id: selectScriptTrade,
                script_expiry_id: selectExpiryTrade,
                trade_type: buyRadio,
                trade_rate: selectTradePrice,
                trade_qty: selectTradeQtySize,
                trade_lot: selectTradeLotSize,
                trade_type_x: selectTradeTypeSet.current,
                check_script_name: scriptNameTrade,
                user_id: positionUserId,
                trade_id: selectTradeId,
                device_type: 0,
            }))
            setSelectedRow(data);
            setCloseDialogOpen(true);
        }
    }
    const setTradeType = (element) => {
        // console.log(element);
        startTransition(() => {
            setOrderType(element);
            selectTradeTypeSet.current = element;
            setClosetradeData(prvValue => ({
                ...prvValue,
                trade_type_x: element,

            }))
        });

        if (element == 0) {
            if (closetradeData.trade_type == 0) {
                if (dataTrade) {
                    startTransition(() => {
                        setClosetradeData(prvValue => ({
                            ...prvValue,
                            trade_rate: dataTrade.SellPrice,

                        }))
                    });
                }

            } else {
                if (dataTrade) {
                    startTransition(() => {
                        setClosetradeData(prvValue => ({
                            ...prvValue,
                            trade_rate: dataTrade.BuyPrice,

                        }))
                    });
                }
            }
        }
    }
    const lotChange = async (e) => {
        if (QuotationLot && e.target.value) {
            setClosetradeData(prvValue => ({
                ...prvValue,
                trade_qty: QuotationLot * e.target.value,
            }))
        }
        setClosetradeData(prvValue => ({
            ...prvValue,
            trade_lot: e.target.value,
        }))

    }
    const qtyChange = async (e) => {
        if (closetradeData.market_type_id != "1" && closetradeData.market_type_id != "5") {
            if (e.target.value && QuotationLot) {
                setClosetradeData(prvValue => ({
                    ...prvValue,
                    trade_lot: e.target.value / QuotationLot,
                }))
            }
            setClosetradeData(prvValue => ({
                ...prvValue,
                trade_qty: e.target.value,
            }))
        }
    }
    const priceChange = async (e) => {
        setClosetradeData(prvValue => ({
            ...prvValue,
            trade_rate: e.target.value,
        }))

    }

    const getColor = (val) => {
        const num = Number(val ?? 0);
        if (num > 0) return "black";
        if (num < 0) return "black";
        return "black";
    };

    return (
        <Box sx={{ p: 0, position: "relative" }}>
            {/* Filter Drawer for Mobile */}
            {isMobile ? (
                <Drawer anchor="left" open={filterDrawer} onClose={() => setFilterDrawer(false)}>
                    {filterShow && (
                        <Box sx={{ width: 280, p: 2 }} role="presentation">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Filters</Typography>
                                <IconButton onClick={() => setFilterDrawer(false)}>
                                    <CloseIcon />
                                </IconButton>
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
                                onApply={fetchPositions}
                            />
                        </Box>
                    )}
                </Drawer>
            ) : (
                filterShow && (
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
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
                            onApply={fetchPositions}
                        />
                    </Box>
                )
            )}



            {/* 🔢 MTM & Quantity Summary */}
            <>

                {/* Desktop View */}
                {!isMobile && filterShow1 && (
                    <Box
                        sx={{
                            px: 2,
                            py: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 2,
                            justifyContent: "space-between",
                            borderBottom: theme.palette.mode === "dark" ? "1px solid #333" : "1px solid #eee",
                            background: theme.palette.mode === "dark" ? "#121212" : "#ffffffff",
                            borderRadius: 2,
                            boxShadow:
                                theme.palette.mode === "dark"
                                    ? "0 4px 12px rgba(0,0,0,0.3)"
                                    : "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                    >
                        <>
                            {items.map((item, i) => {
                                const bgColor = highlighted[item.key]
                                    ? alpha(item.color, theme.palette.mode === "dark" ? 0.35 : 0.25)
                                    : alpha(item.color, theme.palette.mode === "dark" ? 0.1 : 0.05);

                                const borderColor = alpha(item.color, theme.palette.mode === "dark" ? 0.35 : 0.25);

                                return (
                                    <Box
                                        key={i}
                                        sx={{
                                            fontSize: 13,
                                            px: 2,
                                            py: 1,
                                            borderRadius: 2,
                                            border: `1px solid ${borderColor}`,
                                            background: bgColor,
                                            boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)",
                                            transition: "all 0.5s ease",
                                        }}
                                    >
                                        {item.label}:{" "}
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontWeight: "bold",
                                                transition: "color 0.3s ease",
                                                color: getColor(item.value),
                                            }}
                                        >
                                            {(item.value ?? 0).toLocaleString("en-IN")}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </>
                    </Box>
                )}


                {/* Mobile View - Top Bar */}
                {isMobile && filterShow1 && (
                    <Box
                        sx={{
                            position: "relative",
                            top: 0,          // ensure no gap from top
                            left: 0,
                            right: 0,
                            width: "100vw",
                            ml: "calc(-50vw + 50%)",
                            mt: 0,
                            pt: 0,
                            px: 0,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor:
                                theme.palette.mode === "dark" ? "#121212" : "#f9f9f9",
                            borderBottom:
                                theme.palette.mode === "dark" ? "1px solid #333" : "1px solid #eee",
                            boxShadow:
                                theme.palette.mode === "dark"
                                    ? "0 2px 4px rgba(0,0,0,0.3)"
                                    : "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Row 1 - Total & Self */}
                        <Box sx={{ display: "flex", width: "100%" }}>
                            {[
                                { key: "totalMTM", label: "Total", value: totals.totalMTM, color: "#1976d2", flex: 1 },
                                { key: "self_grand", label: "Self", value: totals.self_grand, color: "#2e7d32", flex: 1 },
                            ].map((col, i) => {
                                const bgColor = highlighted[col.key]
                                    ? alpha(col.color, theme.palette.mode === "dark" ? 0.35 : 0.25)
                                    : alpha(col.color, theme.palette.mode === "dark" ? 0.1 : 0.05);

                                return (
                                    <Box
                                        key={col.key}
                                        sx={{
                                            flex: col.flex,
                                            textAlign: "center",
                                            py: 0.5,
                                            px: 0,
                                            borderRight:
                                                i === 0
                                                    ? theme.palette.mode === "dark"
                                                        ? "1px solid #333"
                                                        : "1px solid #ddd"
                                                    : "none",
                                            background: bgColor,
                                            transition: "all 0.4s ease",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 10,
                                                lineHeight: 1,
                                                color:
                                                    theme.palette.mode === "dark"
                                                        ? "#fff"
                                                        : "text.secondary",
                                            }}
                                        >
                                            {col.label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                lineHeight: 1.5,
                                                transition: "color 0.3s ease",
                                                color:
                                                    theme.palette.mode === "dark"
                                                        ? "#fff"
                                                        : getColor(col.value),
                                            }}
                                        >
                                            {(col.value ?? 0).toLocaleString("en-IN")}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Row 2 - Downline, Upline, Qty */}
                        <Box sx={{ display: "flex", width: "100%" }}>
                            {[
                                { key: "downline_grand", label: "Downline", value: totals.downline_grand, color: "#ed6c02", flex: 2 },
                                { key: "upline_grand", label: "Upline", value: totals.upline_grand, color: "#9c27b0", flex: 1 },
                                { key: "total_qty", label: "Qty", value: totals.total_qty, color: "#0288d1", flex: 1 },
                            ].map((col, i, arr) => {
                                const bgColor = highlighted[col.key]
                                    ? alpha(col.color, theme.palette.mode === "dark" ? 0.35 : 0.25)
                                    : alpha(col.color, theme.palette.mode === "dark" ? 0.1 : 0.05);

                                return (
                                    <Box
                                        key={col.key}
                                        sx={{
                                            flex: col.flex,
                                            textAlign: "center",
                                            py: 0.5,
                                            px: 0,
                                            borderRight:
                                                i < arr.length - 1
                                                    ? theme.palette.mode === "dark"
                                                        ? "1px solid #333"
                                                        : "1px solid #ddd"
                                                    : "none",
                                            background: bgColor,
                                            transition: "all 0.4s ease",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 10,
                                                lineHeight: 1,
                                                color:
                                                    theme.palette.mode === "dark"
                                                        ? "#fff"
                                                        : "text.secondary",
                                            }}
                                        >
                                            {col.label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                lineHeight: 1.5,
                                                transition: "color 0.3s ease",
                                                color:
                                                    theme.palette.mode === "dark"
                                                        ? "#fff"
                                                        : getColor(col.value),
                                            }}
                                        >
                                            {(col.value ?? 0).toLocaleString("en-IN")}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </>


            {/* 🔍 Search Bar */}
            {/* <Box sx={{
                px: 2, py: 1, display: "flex",
                alignItems: "center", gap: 2
            }}>
                {isMobile && filterShow && <FilterBtn setFilterOpen={setFilterDrawer} />}

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
            </Box> */}
            <SearchPdfCsv
                searchText={searchText}
                setSearchText={setSearchText}
                logs={positionData.slice(0, 5)}
                colArr={colArr}
                keyArr={keyArr}
            />


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

                                const currentValue =
                                    row.net_qty > 0
                                        ? row.net_qty * (liveRates[row.check_script_name]?.BuyPrice ?? 0)
                                        : row.net_qty * (liveRates[row.check_script_name]?.SellPrice ?? 0);

                                const todaysPL =
                                    row.net_qty > 0
                                        ? row.net_qty *
                                        ((Number(liveRates[row.check_script_name]?.BuyPrice ?? 0) -
                                            Number(liveRates[row.check_script_name]?.Close ?? 0)))
                                        : row.net_qty *
                                        ((Number(liveRates[row.check_script_name]?.SellPrice ?? 0) -
                                            Number(liveRates[row.check_script_name]?.Close ?? 0)));

                                const unrealizedPL =
                                    row.net_qty > 0
                                        ? row.net_qty *
                                        ((row.buy_avg_rate ?? 0) -
                                            (liveRates[row.check_script_name]?.BuyPrice ?? 0))
                                        : row.net_qty *
                                        ((row.sell_avg_rate ?? 0) -
                                            (liveRates[row.check_script_name]?.SellPrice ?? 0));

                                // ✅ Dynamic border color
                                const getColor = (val) => {
                                    const num = Number(val ?? 0);
                                    if (num > 0) return "#2e7d32"; // green
                                    if (num < 0) return "#d32f2f"; // red
                                    return "#9e9e9e"; // grey
                                };

                                return (
                                    <Box
                                        key={index}
                                        onClick={() => handleCardClick(row)}
                                        sx={{
                                            m: 0.6,
                                            border: `2px solid ${getColor(row.net_qty)}`, // ✅ dynamic border
                                            borderRadius: 2,
                                            backgroundColor: (theme) => theme.palette.background.paper,
                                            boxShadow: (theme) =>
                                                theme.palette.mode === "dark"
                                                    ? "0 0 6px rgba(255, 255, 255, 0.08)"
                                                    : "0 2px 8px rgba(0, 0, 0, 0.08)",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                transform: "scale(1.02)",
                                                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                                            },
                                        }}
                                    >
                                        {/* Top Thin Bar (Client Name) */}
                                        {userType !== 1 && (
                                            <Box
                                                sx={{
                                                    background:
                                                        row.net_qty > 0
                                                            ? "linear-gradient(135deg, #2e7d32 0%, #6ebb72ff 50%, #b8ddbaff 100%)" // ✅ green gradient
                                                            : row.net_qty < 0
                                                                ? "linear-gradient(135deg, #c62828 0%, #d16f6fff 50%, #e59191ff 100%)" // ✅ red gradient
                                                                : "linear-gradient(135deg, #616161 0%, #757575 50%, #9e9e9e 100%)", // ✅ grey gradient
                                                    color: "#fff",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 600,
                                                    px: 1,
                                                    py: 0.3,
                                                    textAlign: "left",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                👤{" "}
                                                {row.client_full_name
                                                    ?.replace(/<[^>]+>/g, " ")
                                                    ?.split(/\s+/)
                                                    .map((part, i) => (
                                                        <Typography
                                                            key={i}
                                                            variant="caption"
                                                            sx={{ color: "#fff", fontWeight: 600 }}
                                                        >
                                                            {part}
                                                        </Typography>
                                                    ))}
                                            </Box>
                                        )}


                                        {/* Top Row */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                px: 1,
                                                py: 0.6,
                                            }}
                                        >
                                            {row.mym_html && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ display: "none" }}
                                                    dangerouslySetInnerHTML={{ __html: row.mym_html }}
                                                />
                                            )}

                                            {/* Script + Qty + Date */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Avatar
                                                    alt={mainName.replace(/<\/?[^>]+(>|$)/g, "")}
                                                    src="/path-to-your-logo.png"
                                                    variant="square"
                                                    sx={{ width: 28, height: 28, mr: 0.8, flexShrink: 0 }}
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
                                                            mr: 0.4,
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: mainName }}
                                                    />
                                                    <Box sx={{ display: "flex", alignItems: "center", ml: 0.4 }}>
                                                        <ShoppingBagIcon
                                                            fontSize="inherit"
                                                            sx={{ fontSize: 12, color: "text.disabled", ml: 2 }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontSize: 11,
                                                                fontWeight: 400,
                                                                ml: 0.3,
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {row.net_qty}
                                                        </Typography>
                                                    </Box>
                                                    {datePart && (
                                                        <Typography
                                                            variant="caption"
                                                            sx={{ opacity: 0.7, ml: 0.6, whiteSpace: "nowrap" }}
                                                            dangerouslySetInnerHTML={{ __html: datePart }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>

                                            {/* Price + Change */}
                                            <Box sx={{ textAlign: "right", minWidth: 70, flexShrink: 0 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                    {(
                                                        row.net_qty > 0
                                                            ? liveRates[row.check_script_name]?.BuyPrice
                                                            : liveRates[row.check_script_name]?.SellPrice
                                                    )?.toLocaleString("en-IN", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color:
                                                            liveRates[row.check_script_name]?.PriceChange < 0
                                                                ? (theme) => theme.palette.error.main
                                                                : (theme) => theme.palette.success.main,
                                                    }}
                                                >
                                                    {liveRates && liveRates[row.check_script_name]?.PriceChange
                                                        ? liveRates[
                                                            row.check_script_name
                                                        ]?.PriceChange.toLocaleString("en-IN", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })
                                                        : "--"}{" "}
                                                    (
                                                    {liveRates[row.check_script_name]?.PriceChangePercentage?.toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    ) ?? "--"}
                                                    %)
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Bottom Row */}

                                        {row.net_qty != 0 && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    py: 0.4,
                                                    px: 0.8,
                                                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                                                    textAlign: "center",
                                                    width: "100%",
                                                }}
                                            >
                                                <Box sx={{ flex: 0.5, pr: 2 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {currentValue.toLocaleString("en-IN", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                        Current Value
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: todaysPL > 0 ? "success.main" : "error.main",
                                                        }}
                                                    >
                                                        {todaysPL.toLocaleString("en-IN", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                        Today&apos;s P&amp;L
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 0.6, minWidth: "120px" }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: unrealizedPL > 0 ? "success.main" : "error.main",
                                                        }}
                                                    >
                                                        {unrealizedPL >= 1000
                                                            ? `${(unrealizedPL / 1000).toLocaleString("en-IN", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}K`
                                                            : unrealizedPL.toLocaleString("en-IN", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2,
                                                            })}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                        Unrealized P&amp;L
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
                                        {row.net_qty == 0 && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    py: 0.4,
                                                    px: 0.8,
                                                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                                                    textAlign: "center",
                                                    width: "100%",
                                                }}
                                            >
                                                <Box sx={{ flex: 0.5, pr: 2 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                        {row.buy_avg_rate.toLocaleString("en-IN", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                        Buy Average
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 700,

                                                        }}
                                                    >
                                                        {row.sell_avg_rate.toLocaleString("en-IN", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                        Sell Average
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ flex: 0.6, minWidth: "120px" }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 700,

                                                        }}
                                                    >
                                                        <span
                                                            style={{ fontWeight: "bold" }}
                                                            dangerouslySetInnerHTML={{ __html: row.mym_html }}
                                                        />
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                        MTM
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}
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
                                                            <span dangerouslySetInnerHTML={{ __html: row.client_full_name }} />
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
                                                    <td style={{ padding: "6px 10px" }}>{row.total_buy_qty?.toLocaleString()}</td>
                                                    <td style={{ padding: "6px 10px" }}>{row.buy_avg_rate?.toLocaleString()}</td>
                                                    <td style={{ padding: "6px 10px" }}>{row.total_sell_qty?.toLocaleString()}</td>
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
                                                            ? liveRates[row.check_script_name]?.BuyPrice?.toLocaleString()
                                                            : liveRates[row.check_script_name]?.SellPrice?.toLocaleString()}
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



                                <Dialog
                                    open={closeDialogOpen}
                                    onClose={() => setCloseDialogOpen(false)}
                                    fullWidth
                                    maxWidth="xs"
                                >
                                    {/* Header */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                                            color: "#fff",
                                            px: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={700}
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: 150, // adjust as needed
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: selectedRow?.script_name || "N/A",
                                                }}
                                            />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: currentData?.PriceChange >= 0 ? "green" : "red"
                                                }}
                                            >
                                                {currentData?.PriceChange?.toFixed(2) ?? "--"}{" "}
                                                ({currentData?.PriceChangePercentage?.toFixed(2) ?? "--"}%)
                                            </Typography>

                                        </Box>
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography variant="body2">
                                                Bid: {liveRates && liveRates[selectedOrder]?.BuyPrice
                                                    ? liveRates[selectedOrder].BuyPrice.toFixed(2)
                                                    : "--"}
                                            </Typography>
                                            <Typography variant="body2">
                                                Ask: {liveRates && liveRates[selectedOrder]?.SellPrice
                                                    ? liveRates[selectedOrder].SellPrice.toFixed(2)
                                                    : "--"}
                                            </Typography>
                                        </Box>

                                        {/* Uncomment below to add close icon */}
                                        {/* 
    <IconButton onClick={() => setCloseDialogOpen(false)} size="small" sx={{ color: "#fff" }}>
      <CloseIcon />
    </IconButton> 
    */}
                                    </Box>

                                    {/* Open & Close Prices */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Open: {currentData?.Open?.toFixed(2) ?? "--"}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Close: {currentData?.Close?.toFixed(2) ?? "--"}
                                        </Typography>
                                    </Box>


                                    {/* Order Type Toggle */}
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                        {["MARKET", "LIMIT", "SL"].map((label) => (
                                            <Button
                                                key={label}
                                                variant={orderType === label ? "contained" : "outlined"}
                                                onClick={() => setTradeType(label)}
                                                sx={{
                                                    minWidth: 60,
                                                    fontWeight: 600,
                                                    fontSize: "0.75rem",
                                                    borderRadius: 2,
                                                    backgroundColor: orderType === label ? "#2a5298" : "transparent",
                                                    color: orderType === label ? "#fff" : "#2a5298",
                                                    borderColor: "#2a5298",
                                                    "&:hover": {
                                                        backgroundColor: orderType === label ? "#1e3c72" : "#f3e5f5",
                                                    },
                                                }}
                                            >
                                                {label}
                                            </Button>
                                        ))}
                                    </Box>

                                    {/* Lot, Qty, Price Controls */}
                                    <DialogContent sx={{ mt: 2 }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            {closeDialogOpen && selectedRow && (
                                                <>
                                                    {/* Lot */}
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography>Lot</Typography>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <IconButton onClick={() => setLot(Math.max(0, closetradeData.trade_lot - 1))} size="small">
                                                                <RemoveIcon fontSize="small" />
                                                            </IconButton>
                                                            <TextField
                                                                value={closetradeData.trade_lot}
                                                                autoFocus
                                                                onChange={lotChange}
                                                                size="small"
                                                                sx={{ width: 70 }}
                                                                inputProps={{ style: { textAlign: "center" } }}
                                                            />
                                                            <IconButton onClick={() => setLot(closetradeData.trade_lot + 1)} size="small">
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    {/* Qty */}
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography>Qty</Typography>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                            <IconButton onClick={() => setQty(Math.max(1, closetradeData.trade_qty - 1))} size="small">
                                                                <RemoveIcon fontSize="small" />
                                                            </IconButton>
                                                            <TextField
                                                                value={closetradeData.trade_qty}
                                                                onChange={qtyChange}
                                                                size="small"
                                                                disabled={closetradeData.market_type_id == "1" || closetradeData.market_type_id == "5" ? true : false}
                                                                sx={{ width: 70 }}
                                                                inputProps={{ style: { textAlign: "center" } }}

                                                            />
                                                            <IconButton onClick={() => setQty(closetradeData.trade_qty + 1)} size="small">
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                    {/* Price */}
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <Typography>Price</Typography>
                                                        {
                                                            ((closetradeData.trade_type == "1" && closetradeData.trade_type_x == "0") || (closetradeData.trade_type == "0" && closetradeData.trade_type_x == "0")) && (
                                                                <TextField
                                                                    type="number"
                                                                    value={closetradeData.trade_rate}
                                                                    onChange={(e) => setPrice(Number(e.target.value))}
                                                                    size="small"
                                                                    sx={{ width: 100, mr: 3 }}
                                                                    inputProps={{ style: { textAlign: "center" }, step: "0.05" }}
                                                                    disabled={orderType === "MARKET"} // Disable if MARKET
                                                                />
                                                            )
                                                        }
                                                        {
                                                            ((closetradeData.trade_type == "1" && closetradeData.trade_type_x != "0") || (closetradeData.trade_type == "0" && closetradeData.trade_type_x != "0")) && (
                                                                <TextField
                                                                    type="number"
                                                                    value={closetradeData.trade_rate}
                                                                    onChange={priceChange}
                                                                    size="small"
                                                                    sx={{ width: 100, mr: 3 }}
                                                                    inputProps={{ style: { textAlign: "center" }, step: "0.05" }}
                                                                />
                                                            )
                                                        }

                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </DialogContent>

                                    {/* Bottom Action */}
                                    <DialogActions>
                                        {selectedRow?.net_qty > 0 ? (
                                            <Button
                                                fullWidth
                                                onClick={handlePlaceTrade}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#ff3d3d", // Red for Sell
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    fontSize: "0.9rem",
                                                    py: 1,
                                                    borderRadius: 1.5,
                                                    "&:hover": {
                                                        backgroundColor: "#d32f2f",
                                                    },
                                                }}
                                            >
                                                Sell
                                            </Button>
                                        ) : selectedRow?.net_qty < 0 ? (
                                            <Button
                                                fullWidth
                                                onClick={handlePlaceTrade}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#4caf50", // Green for Buy
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    fontSize: "0.9rem",
                                                    py: 1,
                                                    borderRadius: 1.5,
                                                    "&:hover": {
                                                        backgroundColor: "#388e3c",
                                                    },
                                                }}
                                            >
                                                Buy
                                            </Button>
                                        ) : (
                                            <Button
                                                fullWidth
                                                disabled
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "#9e9e9e",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    fontSize: "0.9rem",
                                                    py: 1,
                                                    borderRadius: 1.5,
                                                }}
                                            >
                                                No Position
                                            </Button>
                                        )}
                                    </DialogActions>
                                </Dialog>

                                {/* Drawer Section */}
                                {drawerOpen1 && (
                                    <>
                                        <Slide
                                            direction="up"
                                            in={drawerOpen1}
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
                                                    left: 220,
                                                    width: "calc(100% - 420px)",
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
                                                        <IconButton size="large" onClick={closeDrawer}>
                                                            <ArrowDropDownIcon />
                                                        </IconButton>
                                                    </Box>

                                                    {/* Summary Info */}
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
                                                        <Box sx={{ flex: "1 1 22%" }}>
                                                            <Typography variant="caption">Total Buy</Typography>
                                                            <Typography variant="body2" fontWeight={600}>{selectedRow?.total_buy_qty}</Typography>
                                                        </Box>
                                                        <Box sx={{ flex: "1 1 22%" }}>
                                                            <Typography variant="caption">Total Sell</Typography>
                                                            <Typography variant="body2" fontWeight={600}>{selectedRow?.total_sell_qty}</Typography>
                                                        </Box>
                                                        <Box sx={{ flex: "1 1 22%" }}>
                                                            <Typography variant="caption">Buy Avg Rate</Typography>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {selectedRow?.buy_avg_rate?.toLocaleString()}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ flex: "1 1 22%" }}>
                                                            <Typography variant="caption">Sell Avg Rate</Typography>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {selectedRow?.sell_avg_rate?.toLocaleString()}
                                                            </Typography>
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
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {(
                                                                    selectedRow?.net_qty > 0
                                                                        ? liveRates[selectedRow?.check_script_name]?.BuyPrice
                                                                        : liveRates[selectedRow?.check_script_name]?.SellPrice
                                                                )?.toLocaleString()}
                                                            </Typography>
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

                                                        {selectedRow.net_qty !== 0 && (
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
                                                                onClick={() => {
                                                                    openClose(selectedRow);
                                                                }}
                                                            >
                                                                Close Position
                                                            </Button>
                                                        )}


                                                        <Dialog
                                                            open={closeDialogOpen}
                                                            onClose={() => setCloseDialogOpen(false)}
                                                            fullWidth
                                                            maxWidth="xs"
                                                        >
                                                            {/* Header */}
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                                                                    color: "#fff",
                                                                    px: 2,
                                                                    py: 1,
                                                                }}
                                                            >
                                                                <Box>
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        fontWeight={700}
                                                                        sx={{
                                                                            whiteSpace: "nowrap",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            maxWidth: 150, // adjust as needed
                                                                        }}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: selectedRow?.script_name || "N/A",
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: currentData?.PriceChange >= 0 ? "green" : "red"
                                                                        }}
                                                                    >
                                                                        {currentData?.PriceChange?.toFixed(2) ?? "--"}{" "}
                                                                        ({currentData?.PriceChangePercentage?.toFixed(2) ?? "--"}%)
                                                                    </Typography>

                                                                </Box>
                                                                <Box sx={{ textAlign: "right" }}>
                                                                    <Typography variant="body2">
                                                                        Bid: {liveRates && liveRates[selectedOrder]?.BuyPrice
                                                                            ? liveRates[selectedOrder].BuyPrice.toFixed(2)
                                                                            : "--"}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        Ask: {liveRates && liveRates[selectedOrder]?.SellPrice
                                                                            ? liveRates[selectedOrder].SellPrice.toFixed(2)
                                                                            : "--"}
                                                                    </Typography>
                                                                </Box>

                                                                {/* Uncomment below to add close icon */}
                                                                {/* 
    <IconButton onClick={() => setCloseDialogOpen(false)} size="small" sx={{ color: "#fff" }}>
      <CloseIcon />
    </IconButton> 
    */}
                                                            </Box>

                                                            {/* Open & Close Prices */}
                                                            <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pt: 1 }}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Open: {currentData?.Open?.toFixed(2) ?? "--"}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Close: {currentData?.Close?.toFixed(2) ?? "--"}
                                                                </Typography>
                                                            </Box>


                                                            {/* Order Type Toggle */}
                                                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                                                {["MARKET", "LIMIT", "SL"].map((label) => (
                                                                    <Button
                                                                        key={label}
                                                                        variant={orderType === label ? "contained" : "outlined"}
                                                                        onClick={() => setTradeType(label)}
                                                                        sx={{
                                                                            minWidth: 60,
                                                                            fontWeight: 600,
                                                                            fontSize: "0.75rem",
                                                                            borderRadius: 2,
                                                                            backgroundColor: orderType === label ? "#2a5298" : "transparent",
                                                                            color: orderType === label ? "#fff" : "#2a5298",
                                                                            borderColor: "#2a5298",
                                                                            "&:hover": {
                                                                                backgroundColor: orderType === label ? "#1e3c72" : "#f3e5f5",
                                                                            },
                                                                        }}
                                                                    >
                                                                        {label}
                                                                    </Button>
                                                                ))}
                                                            </Box>

                                                            {/* Lot, Qty, Price Controls */}
                                                            <DialogContent sx={{ mt: 2 }}>
                                                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                                    {closeDialogOpen && selectedRow && (
                                                                        <>
                                                                            {/* Lot */}
                                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                                <Typography>Lot</Typography>
                                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                                    <IconButton onClick={() => setLot(Math.max(0, closetradeData.trade_lot - 1))} size="small">
                                                                                        <RemoveIcon fontSize="small" />
                                                                                    </IconButton>
                                                                                    <TextField
                                                                                        value={closetradeData.trade_lot}
                                                                                        autoFocus
                                                                                        onChange={lotChange}
                                                                                        size="small"
                                                                                        sx={{ width: 70 }}
                                                                                        inputProps={{ style: { textAlign: "center" } }}
                                                                                    />
                                                                                    <IconButton onClick={() => setLot(closetradeData.trade_lot + 1)} size="small">
                                                                                        <AddIcon fontSize="small" />
                                                                                    </IconButton>
                                                                                </Box>
                                                                            </Box>

                                                                            {/* Qty */}
                                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                                <Typography>Qty</Typography>
                                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                                    <IconButton onClick={() => setQty(Math.max(1, closetradeData.trade_qty - 1))} size="small">
                                                                                        <RemoveIcon fontSize="small" />
                                                                                    </IconButton>
                                                                                    <TextField
                                                                                        value={closetradeData.trade_qty}
                                                                                        onChange={qtyChange}
                                                                                        size="small"
                                                                                        disabled={closetradeData.market_type_id == "1" || closetradeData.market_type_id == "5" ? true : false}
                                                                                        sx={{ width: 70 }}
                                                                                        inputProps={{ style: { textAlign: "center" } }}

                                                                                    />
                                                                                    <IconButton onClick={() => setQty(closetradeData.trade_qty + 1)} size="small">
                                                                                        <AddIcon fontSize="small" />
                                                                                    </IconButton>
                                                                                </Box>
                                                                            </Box>

                                                                            {/* Price */}
                                                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                                <Typography>Price</Typography>
                                                                                {
                                                                                    ((closetradeData.trade_type == "1" && closetradeData.trade_type_x == "0") || (closetradeData.trade_type == "0" && closetradeData.trade_type_x == "0")) && (
                                                                                        <TextField
                                                                                            type="number"
                                                                                            value={closetradeData.trade_rate}
                                                                                            onChange={(e) => setPrice(Number(e.target.value))}
                                                                                            size="small"
                                                                                            sx={{ width: 100, mr: 3 }}
                                                                                            inputProps={{ style: { textAlign: "center" }, step: "0.05" }}
                                                                                            disabled={orderType === "MARKET"} // Disable if MARKET
                                                                                        />
                                                                                    )
                                                                                }
                                                                                {
                                                                                    ((closetradeData.trade_type == "1" && closetradeData.trade_type_x != "0") || (closetradeData.trade_type == "0" && closetradeData.trade_type_x != "0")) && (
                                                                                        <TextField
                                                                                            type="number"
                                                                                            value={closetradeData.trade_rate}
                                                                                            onChange={priceChange}
                                                                                            size="small"
                                                                                            sx={{ width: 100, mr: 3 }}
                                                                                            inputProps={{ style: { textAlign: "center" }, step: "0.05" }}
                                                                                        />
                                                                                    )
                                                                                }

                                                                            </Box>
                                                                        </>
                                                                    )}
                                                                </Box>
                                                            </DialogContent>

                                                            {/* Bottom Action */}
                                                            <DialogActions>
                                                                {selectedRow?.net_qty > 0 ? (
                                                                    <Button
                                                                        fullWidth
                                                                        onClick={handlePlaceTrade}
                                                                        variant="contained"
                                                                        sx={{
                                                                            backgroundColor: "#ff3d3d", // Red for Sell
                                                                            color: "#fff",
                                                                            fontWeight: 700,
                                                                            fontSize: "0.9rem",
                                                                            py: 1,
                                                                            borderRadius: 1.5,
                                                                            "&:hover": {
                                                                                backgroundColor: "#d32f2f",
                                                                            },
                                                                        }}
                                                                    >
                                                                        Sell
                                                                    </Button>
                                                                ) : selectedRow?.net_qty < 0 ? (
                                                                    <Button
                                                                        fullWidth
                                                                        onClick={handlePlaceTrade}
                                                                        variant="contained"
                                                                        sx={{
                                                                            backgroundColor: "#4caf50", // Green for Buy
                                                                            color: "#fff",
                                                                            fontWeight: 700,
                                                                            fontSize: "0.9rem",
                                                                            py: 1,
                                                                            borderRadius: 1.5,
                                                                            "&:hover": {
                                                                                backgroundColor: "#388e3c",
                                                                            },
                                                                        }}
                                                                    >
                                                                        Buy
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        fullWidth
                                                                        disabled
                                                                        variant="contained"
                                                                        sx={{
                                                                            backgroundColor: "#9e9e9e",
                                                                            color: "#fff",
                                                                            fontWeight: 700,
                                                                            fontSize: "0.9rem",
                                                                            py: 1,
                                                                            borderRadius: 1.5,
                                                                        }}
                                                                    >
                                                                        No Position
                                                                    </Button>
                                                                )}
                                                            </DialogActions>
                                                        </Dialog>
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
                                            onClick={closeDrawer}
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
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.total_buy_qty}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Total Sell</Typography>
                                        <Typography variant="body2" fontWeight={600}>{selectedRow?.total_sell_qty}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Buy Avg Rate</Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {selectedRow?.buy_avg_rate?.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 22%" }}>
                                        <Typography variant="caption">Sell Avg Rate</Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {selectedRow?.sell_avg_rate?.toLocaleString()}
                                        </Typography>
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
                                        <Typography variant="body2" fontWeight={600}>
                                            {(
                                                selectedRow?.net_qty > 0
                                                    ? liveRates[selectedRow?.check_script_name]?.BuyPrice
                                                    : liveRates[selectedRow?.check_script_name]?.SellPrice
                                            )?.toLocaleString()}
                                        </Typography>
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

                                    {selectedRow.net_qty !== 0 && (
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
                                            onClick={() => {
                                                openClose(selectedRow);
                                            }}
                                        >
                                            Close Position
                                        </Button>
                                    )}


                                    <Dialog
                                        open={closeDialogOpen}
                                        onClose={() => setCloseDialogOpen(false)}
                                        fullWidth
                                        maxWidth="xs"
                                    >
                                        {/* Header */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)",
                                                color: "#fff",
                                                px: 2,
                                                py: 1,
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                    sx={{
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: 150, // adjust as needed
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedRow?.script_name || "N/A",
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: currentData?.PriceChange >= 0 ? "green" : "red"
                                                    }}
                                                >
                                                    {currentData?.PriceChange?.toFixed(2) ?? "--"}{" "}
                                                    ({currentData?.PriceChangePercentage?.toFixed(2) ?? "--"}%)
                                                </Typography>

                                            </Box>
                                            <Box sx={{ textAlign: "right" }}>
                                                <Typography variant="body2">
                                                    Bid: {liveRates && liveRates[selectedOrder]?.BuyPrice
                                                        ? liveRates[selectedOrder].BuyPrice.toFixed(2)
                                                        : "--"}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Ask: {liveRates && liveRates[selectedOrder]?.SellPrice
                                                        ? liveRates[selectedOrder].SellPrice.toFixed(2)
                                                        : "--"}
                                                </Typography>
                                            </Box>

                                            {/* Uncomment below to add close icon */}
                                            {/* 
    <IconButton onClick={() => setCloseDialogOpen(false)} size="small" sx={{ color: "#fff" }}>
      <CloseIcon />
    </IconButton> 
    */}
                                        </Box>

                                        {/* Open & Close Prices */}
                                        <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Open: {currentData?.Open?.toFixed(2) ?? "--"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Close: {currentData?.Close?.toFixed(2) ?? "--"}
                                            </Typography>
                                        </Box>


                                        {/* Order Type Toggle */}
                                        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                            {["MARKET", "LIMIT", "SL"].map((label) => (
                                                <Button
                                                    key={label}
                                                    variant={orderType === label ? "contained" : "outlined"}
                                                    onClick={() => setTradeType(label)}
                                                    sx={{
                                                        minWidth: 60,
                                                        fontWeight: 600,
                                                        fontSize: "0.75rem",
                                                        borderRadius: 2,
                                                        backgroundColor: orderType === label ? "#2a5298" : "transparent",
                                                        color: orderType === label ? "#fff" : "#2a5298",
                                                        borderColor: "#2a5298",
                                                        "&:hover": {
                                                            backgroundColor: orderType === label ? "#1e3c72" : "#f3e5f5",
                                                        },
                                                    }}
                                                >
                                                    {label}
                                                </Button>
                                            ))}
                                        </Box>

                                        {/* Lot, Qty, Price Controls */}
                                        <DialogContent sx={{ mt: 2 }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                                {closeDialogOpen && selectedRow && (
                                                    <>
                                                        {/* Lot */}
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Typography>Lot</Typography>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                <IconButton onClick={() => setLot(Math.max(0, closetradeData.trade_lot - 1))} size="small">
                                                                    <RemoveIcon fontSize="small" />
                                                                </IconButton>
                                                                <TextField
                                                                    value={closetradeData.trade_lot}
                                                                    autoFocus
                                                                    onChange={lotChange}
                                                                    size="small"
                                                                    sx={{ width: 70 }}
                                                                    inputProps={{ style: { textAlign: "center" } }}
                                                                />
                                                                <IconButton onClick={() => setLot(closetradeData.trade_lot + 1)} size="small">
                                                                    <AddIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>

                                                        {/* Qty */}
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Typography>Qty</Typography>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                <IconButton onClick={() => setQty(Math.max(1, closetradeData.trade_qty - 1))} size="small">
                                                                    <RemoveIcon fontSize="small" />
                                                                </IconButton>
                                                                <TextField
                                                                    value={closetradeData.trade_qty}
                                                                    onChange={qtyChange}
                                                                    size="small"
                                                                    disabled={closetradeData.market_type_id == "1" || closetradeData.market_type_id == "5" ? true : false}
                                                                    sx={{ width: 70 }}
                                                                    inputProps={{ style: { textAlign: "center" } }}

                                                                />
                                                                <IconButton onClick={() => setQty(closetradeData.trade_qty + 1)} size="small">
                                                                    <AddIcon fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>

                                                        {/* Price */}
                                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Typography>Price</Typography>
                                                            {
                                                                ((closetradeData.trade_type == "1" && closetradeData.trade_type_x == "0") || (closetradeData.trade_type == "0" && closetradeData.trade_type_x == "0")) && (
                                                                    <TextField
                                                                        type="number"
                                                                        value={closetradeData.trade_rate}
                                                                        onChange={(e) => setPrice(Number(e.target.value))}
                                                                        size="small"
                                                                        sx={{ width: 100, mr: 3 }}
                                                                        inputProps={{ style: { textAlign: "center" }, step: "0.05" }}
                                                                        disabled={orderType === "MARKET"} // Disable if MARKET
                                                                    />
                                                                )
                                                            }
                                                            {
                                                                ((closetradeData.trade_type == "1" && closetradeData.trade_type_x != "0") || (closetradeData.trade_type == "0" && closetradeData.trade_type_x != "0")) && (
                                                                    <TextField
                                                                        type="number"
                                                                        value={closetradeData.trade_rate}
                                                                        onChange={priceChange}
                                                                        size="small"
                                                                        sx={{ width: 100, mr: 3 }}
                                                                        inputProps={{ style: { textAlign: "center" }, step: "0.05" }}
                                                                    />
                                                                )
                                                            }

                                                        </Box>
                                                    </>
                                                )}
                                            </Box>
                                        </DialogContent>

                                        {/* Bottom Action */}
                                        <DialogActions>
                                            {selectedRow?.net_qty > 0 ? (
                                                <Button
                                                    fullWidth
                                                    onClick={handlePlaceTrade}
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "#ff3d3d", // Red for Sell
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        fontSize: "0.9rem",
                                                        py: 1,
                                                        borderRadius: 1.5,
                                                        "&:hover": {
                                                            backgroundColor: "#d32f2f",
                                                        },
                                                    }}
                                                >
                                                    Sell
                                                </Button>
                                            ) : selectedRow?.net_qty < 0 ? (
                                                <Button
                                                    fullWidth
                                                    onClick={handlePlaceTrade}
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "#4caf50", // Green for Buy
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        fontSize: "0.9rem",
                                                        py: 1,
                                                        borderRadius: 1.5,
                                                        "&:hover": {
                                                            backgroundColor: "#388e3c",
                                                        },
                                                    }}
                                                >
                                                    Buy
                                                </Button>
                                            ) : (
                                                <Button
                                                    fullWidth
                                                    disabled
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "#9e9e9e",
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        fontSize: "0.9rem",
                                                        py: 1,
                                                        borderRadius: 1.5,
                                                    }}
                                                >
                                                    No Position
                                                </Button>
                                            )}
                                        </DialogActions>
                                    </Dialog>
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
                    <ToastContainer position="top-right" autoClose={3000} />
                </>
            )}
        </Box>

    );
};

export default OrderPage1;