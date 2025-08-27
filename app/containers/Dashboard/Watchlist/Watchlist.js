import React, { useContext, useEffect, useState } from 'react';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import useStyles from '../dashboard-jss';
import StockTable from './StockTable';
import FilterComponent from './FilterComponent';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  DialogContent,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  Chip,
  IconButton,
  Slide,
  useMediaQuery as useMUIQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'; // LHS icon
import ApexCharts from '../Apexcharts';
import { useTheme } from '@mui/material/styles';
import MarketPlaceWIdget from 'dan-components/Widget/MarketPlaceWIdget';
import MobileStockTable from './MobileStockTable';
import { Navigate, useLocation } from 'react-router-dom';
import BackToTop from '../helpers/BackToTop';
import { favouriteActionAPI, getForexWatchListDataAPI, getWatchListDataAPI, removeMarketWatchAPI } from '../API/API';
import { TableBody, TableHead } from 'mui-datatables';
import useStylesCx from '../../../components/Tables/tableStyle-jss';
import { useIsFirstRender } from '@uidotdev/usehooks';
import { cloneDeep } from 'lodash';
import SocketContext from '../Socket/SocketContext';
import { formatSelectedKeys } from '../helpers/utilFunc';
import BottomTradePopup from './BottomTradePopup';
import toast, { Toaster } from 'react-hot-toast';
import { toastTime } from './constant';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import ReportIcon from '@mui/icons-material/Report';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';


const generateCandleData = () => {
  const base = 1000 + Math.random() * 100;
  const data = Array.from({ length: 10 }, (_, i) => {
    const open = base + Math.random() * 10;
    const close = open + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    return {
      x: new Date(2025, 5, 20 + i),
      y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)],
    };
  });
  return data;
};

const toastBoxCss = {
  display: 'flex',
  alignItems: 'center',
  px: 2.5,
  py: 1.5,
  boxShadow: 3,
  // minWidth: '80vw',
  justifyContent: 'space-between',
  borderRadius: '10px',
}


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const dummyWatchlistData = [
  {
    id: '1',
    scriptName: 'RELIANCE 31 JUL 2025',
    exchange: 'NSE',
    open: 284511.51,
    close: 281219.10,
    high: 285110.01,
    low: 281101.25,
    bidRate: 211828.91,
    askRate: 281129.32,
    ltp: 282119.10,
    priceChange: -16.40,
    priceChangePercent: -0.58,
    qty: 150,
    time: new Date().getTime(),
    maxOrder: 1000,
    position: 'Buy',
    isFavorite: true,
    lastChangedAt: '2025-07-01 09:42:11'
  },
  {
    id: '2',
    scriptName: 'HDFCBANK 31 JUL 2025',
    exchange: 'BSE',
    open: 167225.2,
    close: 161182.2,
    high: 169110.1,
    low: 133660.7,
    bidRate: 163382.3,
    askRate: 162282.3,
    ltp: 164482.1,
    priceChange: +70.21,
    priceChangePercent: +10.43,
    qty: 0,
    time: new Date().getTime(),
    maxOrder: 801,
    isFavorite: true,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:43:08'
  },
  {
    id: '3',
    scriptName: 'INFY  31 JUL 2025',
    exchange: 'NSE',
    open: 1530.00,
    close: 1525.10,
    high: 1540.00,
    low: 1518.00,
    bidRate: 1524.90,
    askRate: 1525.20,
    ltp: 1525.10,
    priceChange: -4.90,
    priceChangePercent: -0.32,
    qty: 100,
    time: new Date().getTime(),
    maxOrder: 900,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:44:22'
  },
  {
    id: '4',
    scriptName: 'ITC 31 JUL 2025',
    exchange: 'MCX',
    open: 435.60,
    close: 438.00,
    high: 439.10,
    low: 433.50,
    bidRate: 437.90,
    askRate: 438.10,
    ltp: 438.00,
    priceChange: +2.40,
    priceChangePercent: +0.55,
    qty: 0,
    time: new Date().getTime(),
    maxOrder: 2000,
    isFavorite: true,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:45:01'
  },
  {
    id: '5',
    scriptName: 'TCS 31 JUL 2025',
    exchange: 'NSE',
    open: 3830.00,
    close: 3825.75,
    high: 3845.00,
    low: 3800.00,
    bidRate: 3825.60,
    askRate: 3826.00,
    ltp: 3825.75,
    priceChange: -4.25,
    priceChangePercent: -0.11,
    qty: 0,
    time: new Date().getTime(),
    maxOrder: 600,
    isFavorite: true,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:46:17'
  },
  {
    id: '6',
    scriptName: 'COALINDIA 31 JUL 2025',
    exchange: 'BSE',
    open: 392.00,
    close: 390.10,
    high: 394.50,
    low: 388.75,
    bidRate: 390.00,
    askRate: 390.20,
    ltp: 390.10,
    priceChange: -1.90,
    priceChangePercent: -0.48,
    qty: 500,
    time: new Date().getTime(),
    maxOrder: 2500,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:47:33'
  },
  {
    id: '7',
    scriptName: 'SBIN 31 JUL 2025',
    exchange: 'NSE',
    open: 865.30,
    close: 868.20,
    high: 870.00,
    low: 862.50,
    bidRate: 868.10,
    askRate: 868.30,
    ltp: 868.20,
    priceChange: +2.90,
    priceChangePercent: +0.34,
    qty: 320,
    time: new Date().getTime(),
    maxOrder: 1500,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:48:41'
  },
  {
    id: '8',
    scriptName: 'WIPRO 31 JUL 2025',
    exchange: 'MCX',
    open: 475.00,
    close: 477.65,
    high: 479.00,
    low: 470.00,
    bidRate: 477.55,
    askRate: 477.75,
    ltp: 477.65,
    priceChange: +2.65,
    priceChangePercent: +0.56,
    qty: 0,
    time: new Date().getTime(),
    maxOrder: 1200,
    isFavorite: true,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:49:30'
  },
  {
    id: '9',
    scriptName: 'JSWSTEEL 31 JUL 2025',
    exchange: 'BSE',
    open: 840.00,
    close: 838.20,
    high: 845.00,
    low: 832.50,
    bidRate: 838.00,
    askRate: 838.40,
    ltp: 838.20,
    priceChange: -1.80,
    priceChangePercent: -0.21,
    qty: 0,
    time: new Date().getTime(),
    maxOrder: 1100,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:50:20'
  },
  {
    id: '10',
    scriptName: 'HINDALCO 31 JUL 2025',
    exchange: 'NSE',
    open: 570.00,
    close: 573.40,
    high: 575.60,
    low: 567.10,
    bidRate: 573.30,
    askRate: 573.50,
    ltp: 573.40,
    priceChange: +3.40,
    priceChangePercent: +0.60,
    qty: 180,
    time: new Date().getTime(),
    maxOrder: 1400,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:51:07'
  },
  {
    id: '11',
    scriptName: 'ONGC 31 JUL 2025',
    exchange: 'MCX',
    open: 220.00,
    close: 219.20,
    high: 222.30,
    low: 217.50,
    bidRate: 219.10,
    askRate: 219.30,
    ltp: 219.20,
    priceChange: -0.80,
    priceChangePercent: -0.36,
    qty: 600,
    time: new Date().getTime(),
    maxOrder: 3000,
    isFavorite: true,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:51:59'
  },
  {
    id: '12',
    scriptName: 'HCLTECH 31 JUL 2025',
    exchange: 'NSE',
    open: 1465.00,
    close: 1472.80,
    high: 1480.00,
    low: 1458.50,
    bidRate: 1472.70,
    askRate: 1472.90,
    ltp: 1472.80,
    priceChange: +7.80,
    priceChangePercent: +0.53,
    qty: 95,
    time: new Date().getTime(),
    maxOrder: 850,
    isFavorite: true,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:52:45'
  },
  {
    id: '13',
    scriptName: 'NTPC 31 JUL 2025',
    exchange: 'BSE',
    open: 320.40,
    close: 318.90,
    high: 321.50,
    low: 316.00,
    bidRate: 318.80,
    askRate: 319.00,
    ltp: 318.90,
    priceChange: -1.50,
    priceChangePercent: -0.47,
    qty: 200,
    time: new Date().getTime(),
    maxOrder: 1700,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:53:32'
  },
  {
    id: '14',
    scriptName: 'ASIANPAINT 31 JUL 2025',
    exchange: 'MCX',
    open: 3100.00,
    close: 3106.50,
    high: 3115.00,
    low: 3080.00,
    bidRate: 3106.30,
    askRate: 3106.70,
    ltp: 3106.50,
    priceChange: +6.50,
    priceChangePercent: +0.21,
    qty: 55,
    time: new Date().getTime(),
    maxOrder: 500,
    isFavorite: true,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:54:12'
  },
  {
    id: '15',
    scriptName: 'MARUTI 31 JUL 2025',
    exchange: 'NSE',
    open: 10850.00,
    close: 10825.00,
    high: 10900.00,
    low: 10770.00,
    bidRate: 10824.80,
    askRate: 10825.20,
    ltp: 10825.00,
    priceChange: -25.00,
    priceChangePercent: -0.23,
    qty: 30,
    time: new Date().getTime(),
    maxOrder: 400,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:54:55'
  }
];

function getRandomPrice(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// e.g. "31JUL2025" → "31 JUL 2025"
function formatDate(str) {
  const match = str.match(/(\d{2})([A-Z]{3})(\d{4})/);
  if (!match) return '';

  const [, day, month, year] = match;
  return `${day} ${month} ${year}`;
}

function setKeysOfScriptData(item) {
  const scriptName = `${item.script_name} ${formatDate(item.script_expiry_orginal_format)}`;
  // const maxOrder = parseInt(item.max_order, 10) || 0;
  // const qty = parseInt(item.quantity, 10) || 0;

  return {
    ...item,
    id: item.market_watch_id,
    scriptName,
    isFavorite: item.favourite == 1,
    // exchange: item.market_type_name || 'NSE',
    // open: getRandomPrice(280000, 290000),
    // close: getRandomPrice(270000, 285000),
    // high: getRandomPrice(285000, 295000),
    // low: getRandomPrice(265000, 280000),
    // bidRate: getRandomPrice(250000, 290000),
    // askRate: getRandomPrice(250000, 290000),
    // ltp: getRandomPrice(270000, 290000),
    // priceChange: getRandomFloat(-500, 500),
    // priceChangePercent: getRandomFloat(-2.5, 2.5),
    // qty,
    // time: new Date().getTime(),
    // maxOrder,
    // position: Math.random() > 0.5 ? 'Buy' : 'Sell',
    // lastChangedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };
}

function setKeysOfAllScriptData(scripts = []) {
  return scripts.map((item, index) => setKeysOfScriptData(item));
}


function Watchlist() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));
  const isFirstRender = useIsFirstRender();

  const location = useLocation();
  const [isForex, setIsForex] = useState();
  const [isFavoritePage, setisFavoritePage] = useState(false);
  // const [isForexFavorite, setIsForexFavorite] = useState(false)

  const title = brand.name + ' - Cryptocurrency Dashboard';
  const description = brand.desc;
  const { classes } = useStyles();
  const [searchText, setSearchText] = useState('');
  const [isStockOpen, setIsStockOpen] = useState(null);
  const [isStockOpenInMobile, setIsStockOpenInMobile] = useState();
  const [dummyData, setDummyData] = useState();

  const [removeMarket, setRemoveMarket] = useState(false);

  const [socketData, setSocketData] = useState();
  const socketContext = useContext(SocketContext);
  // console.log('^^^ socketContext', socketContext);
  const socket = socketContext.socket;
  // console.log('socket', socket);
  const [buySellPopup, setBuySellPopup] = useState(null);
  const [tabIndex, setTabIndex] = useState(null);

  const [marketNames, setMarketNames] = useState([]);

  useEffect(() => {
    // console.log('!!! dummyData', dummyData);
    if (Boolean(buySellPopup)) {
      const dataArray = dummyData.find(item => item.script_id === buySellPopup.script_id);
      setBuySellPopup({ ...dataArray });
    }
  }, [dummyData])

  function handleBidAskClick(dataArray, columnName) {
    if (columnName === 'bidRate') {
      setBuySellPopup({ ...dataArray });
      setTabIndex(0);
    } else if (columnName === 'askRate') {
      setBuySellPopup({ ...dataArray });
      setTabIndex(1);
    }
  }

  const sections = [
    { title: 'Nifty 50 Stocks', key: 'nifty' },
    // { title: 'Banking Sector', key: 'banking' },
    // { title: 'Commodities Market', key: 'commodities' },
    // { title: 'Currency Derivatives', key: 'currency' }
  ];

  // Manage expanded state for all sections
  const [expanded, setExpanded] = useState(() => new Set(marketNames));

  useEffect(() => {
    setExpanded(() => new Set(marketNames));
  }, [marketNames])

  const toggleExpand = (key) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  const getScriptKey = (watchlistModel) => {
    // console.log('@@@ watchlistModel', watchlistModel);
    if (!isForex) {
      if (watchlistModel.market_type_id === "8" || watchlistModel.market_type_id === "12" || watchlistModel.market_type_id === "6" || watchlistModel.market_type_id === "10") {
        return watchlistModel.script_name;
      } else if (watchlistModel.market_type_id !== "5") {
        return `${watchlistModel.script_name}-${watchlistModel.script_expiry_type}`;
      } else {
        return watchlistModel.script_expiry_type;
      }
    } else {
      return watchlistModel.market_type_id === "7" ? `${watchlistModel.script_name}-${watchlistModel.script_expiry_type}` : watchlistModel.script_name;
    }
  };

  useEffect(() => {
    // Listen for messages from the server
    socket.on("marketWatch", data => {
      // Assuming InstrumentIdentifier is directly inside data
      // console.log("AAAAAAAAA data.data ", data.data);
      const rawInstrumentId = data.InstrumentIdentifier || data.data?.InstrumentIdentifier;
      if (!rawInstrumentId) {
        console.error("InstrumentIdentifier not found in socket data");
        return;
      }

      // console.log("@@@ rawInstrumentId", rawInstrumentId)

      // const currentSocketData = socketDataRef.current;

      // if (currentSocketData[rawInstrumentId]) {
      //   data.data["colorBuyPrice"] = "black";
      //   data.data["colorSellPrice"] = "black";

      //   if (currentSocketData[rawInstrumentId].BuyPrice > data.data.BuyPrice) {
      //     data.data.colorBuyPrice = "red";
      //   } else if (currentSocketData[rawInstrumentId].BuyPrice < data.data.BuyPrice) {
      //     data.data.colorBuyPrice = "blue";
      //   }

      //   if (currentSocketData[rawInstrumentId].SellPrice > data.data.SellPrice) {
      //     data.data.colorSellPrice = "red";
      //   } else if (currentSocketData[rawInstrumentId].SellPrice < data.data.SellPrice) {
      //     data.data.colorSellPrice = "blue";
      //   }

      //   if (currentSocketData[rawInstrumentId].LastTradePrice > data.data.LastTradePrice) {
      //     data.data.colorLtpPrice = "red";
      //   } else if (currentSocketData[rawInstrumentId].LastTradePrice < data.data.LastTradePrice) {
      //     data.data.colorLtpPrice = "blue";
      //   }

      // }

      // Proper way to update the socket data
      // console.log("Socket data recieveed", data.data);

      setSocketData(prevData => ({
        ...prevData,
        [rawInstrumentId]: data.data, // Use the `InstrumentIdentifier` as the key
      }));
    });
  }, []);

  function addSocketDataToDummyData() {
    const updatedData = dummyData && dummyData.map(item => getStockData(item));
    const numWithCommasData = updatedData && updatedData.map(item => {
      const sss = formatSelectedKeys(item);
      // console.log('sss', sss);
      return sss;
    });
    setDummyData(updatedData);
    // setDummyData(numWithCommasData);
  }

  useEffect(() => {
    addSocketDataToDummyData();
  }, [socketData])

  useEffect(() => {
    // console.log('dummyData', dummyData); // chatgpt : this is not logging with data
  }, [dummyData])

  const getStockData = coinItem => {
    var scriptNameData = getScriptKey(coinItem)
    var coinItemFilter = scriptNameData;
    // console.log('@@@ scriptNameData', scriptNameData);
    // console.log('@@@ scriptNameData === YESBANK', scriptNameData === 'YESBANK');
    // console.log('@@@ scriptNameData.length', scriptNameData.length);
    // console.log('@@@ socketData', socketData);
    const dataItem = socketData[coinItemFilter] || {};
    // console.log('@@@ coinItem', coinItem);
    // console.log('@@@ dataItem', dataItem);
    if (dataItem != undefined) {
      return {
        isFavorite: coinItem.isFavorite,
        scriptName: coinItem.scriptName,
        script_name: coinItem.script_name,
        script_expiry_orginal_format: coinItem.script_expiry_orginal_format,
        priceChange: dataItem.PriceChange !== undefined ? dataItem.PriceChange : "0",
        priceChangePercent: dataItem.PriceChangePercentage !== undefined ? dataItem.PriceChangePercentage : "0",
        ltp: dataItem.LastTradePrice != undefined ? dataItem.LastTradePrice : "0",
        quantity: coinItem.quantity != undefined ? coinItem.quantity : "0",
        market_watch_id: coinItem.market_watch_id,
        market_type_name: coinItem.market_type_name,
        script_expiry_id: coinItem.script_expiry_id,
        script_id: coinItem.script_id,
        market_type_id: coinItem.market_type_id,
        script_expiry_type: coinItem.script_expiry_type,
        script_lot_qty: coinItem.script_lot_qty,
        askRate: dataItem.SellPrice != undefined ? dataItem.SellPrice : "0",
        bidRate: dataItem.BuyPrice != undefined ? dataItem.BuyPrice : "0",
        colorBuyPrice: dataItem.colorBuyPrice != undefined ? dataItem.colorBuyPrice : "black",
        colorSellPrice: dataItem.colorSellPrice != undefined ? dataItem.colorSellPrice : "black",
        colorLtpPrice: dataItem.colorLtpPrice != undefined ? dataItem.colorLtpPrice : "black",
        socket_data: dataItem != undefined ? dataItem : { High: 0, Open: 0, Low: 0, Close: 0 },
        high: dataItem.High != undefined ? dataItem.High : "0",
        low: dataItem.Low != undefined ? dataItem.Low : "0",
        open: dataItem.Open != undefined ? dataItem.Open : "0",
        close: dataItem.Close != undefined ? dataItem.Close : "0",
      };
    };
  };

  async function getWatchListData() {
    try {
      const data = isForex ? await getForexWatchListDataAPI() : await getWatchListDataAPI();

      // console.log('data', data);
      // console.log('WWW data', data);
      const aa = setKeysOfAllScriptData(data.scripts);

      // console.log('isFavoritePage', isFavoritePage);
      const dd = isFavoritePage ? aa.filter(item => item.isFavorite) : aa;
      // console.log('WWW dd', dd);
      setDummyData(dd);
      let arr = []
      data.scripts.forEach(script => {
        // console.log('QQQ script', script);
        socket.emit("addMarketWatch", {
          product: getScriptKey(script), // Assuming script_name is the key you want to emit
        });
        arr.push(script.market_type_name);
      });
      const withOutDuplicates = [...new Set(arr)];
      setMarketNames(withOutDuplicates)
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    // window.location.reload();
    const path = location.pathname;
    const lastPart = path.split("/").pop();
    // console.log('lastPart', lastPart);

    if (lastPart === 'forex-watchlist') {
      setIsForex(true);
      setisFavoritePage(false);
    } else if (lastPart === 'favorite-list') {
      setIsForex(false);
      setisFavoritePage(true);
    } else if (lastPart === 'forex-favorite-list') {
      setIsForex(true);
      setisFavoritePage(true);
    } else {
      setIsForex(false);
      setisFavoritePage(false);
    }

    // setTimeout(() => { getWatchListData(), [2000] })
  }, [location.pathname])

  useEffect(() => {
    // console.log('isForex', isForex);
    !isFirstRender ? getWatchListData() : null;
  }, [isForex, isFavoritePage])


  function showToast(msg, onUndo, actionIcon) {
    let didUndo = false;

    const toastId = toast.custom((t) => (
      <Box sx={{ ...toastBoxCss, background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', }}>
        {actionIcon === 'removed'
          ? <StarBorder sx={{ color: 'gray', mr: 0.8 }} />
          : actionIcon === 'added'
            ? <Star sx={{ color: 'gold', mr: 0.8 }} />
            : actionIcon === 'delete'
              ? <RemoveCircleSharpIcon sx={{ color: 'error.main', mr: 0.8 }} />
              : actionIcon === 'error'
                ? <ReportIcon sx={{ color: 'error.main', mr: 0.8 }} />
                : ''}

        <Typography sx={{ fontSize: '0.9rem' }}>
          {/* {scriptName} Removed */}
          {msg}
        </Typography>
        {onUndo && <Button
          size="small"
          sx={{ color: isDarkMode ? '#90caf9' : '#2196f3', ml: 2, textTransform: 'none', p: 0, backgroundColor: '#90caf933' }}
          onClick={() => {
            didUndo = true;
            onUndo();
            toast.dismiss(t.id);
          }}
        >
          Undo
        </Button>}
      </Box>
    ), {
      id: Date.now(), // optional: prevent duplicate toasts
      duration: toastTime,
      position: 'top-right',
    });
  };

  async function handleStar(stockData, e) {
    if (!!e) {
      let starBtn = e.currentTarget;
      starBtn.disabled = true; // chatgpt : this is not working
      setTimeout(() => {
        starBtn.disabled = false; // re-enable after 2 seconds
      }, 1500);
    }
    let isError = false;
    if (stockData.isFavorite) {
      const response = await favouriteActionAPI(stockData.market_watch_id, 'remove')
      if (response.message === 'remove Successfully') {
        showToast(`${stockData.scriptName} removed from favorites.`, false, 'removed')
      } else {
        isError = true;
        showToast(`${response.message}.`, false, 'error');
      }
    } else {
      const response = await favouriteActionAPI(stockData.market_watch_id, 'add')
      if (response.message === 'Added Successfully') {
        showToast(`${stockData.scriptName} added in favorites.`, false, 'added')
      } else {
        isError = true;
        showToast(`${response.message}.`, false, 'error');
      }
    }
    console.log('isError', isError);
    !isError ? setDummyData(prevData =>
      prevData.map(stock => {
        return stock.script_id === stockData.script_id
          ? { ...stock, isFavorite: !stock.isFavorite }  // chtagpt : some times this not working : "!stock.isFavorite"
          : stock;
      })
    ) : null;
  }

  function handleRemove(stock, idx) {
    setRemoveMarket(false);
    if (stock.quantity > 0) {
      showToast(`Cannot remove ${stock.scriptName} as it has quantity.`, false);
    } else {
      let isUndo = false;
      function onUndo() {
        setDummyData(prev => [
          ...prev.slice(0, idx),
          stock,
          ...prev.slice(idx)
        ]);
        isUndo = true;
      }
      setTimeout(() => {
        console.log('setTimeout isUndo', isUndo);
        if (!isUndo) {
          removeMarketWatchAPI(stock.market_watch_id);
        }
      }, [toastTime + 500])
      setDummyData(prevData => prevData.filter(data => data.market_watch_id !== stock.market_watch_id));
      showToast(`${stock.scriptName} Removed `, onUndo, 'delete');
    }
  }


  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      {/* <MarketPlaceWIdget /> */}
      {!isFavoritePage && <FilterComponent
        searchText={searchText}
        setSearchText={setSearchText}
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        isForex={isForex}
        setDummyData={setDummyData}
        socket={socket}
        getScriptKey={getScriptKey}
        addSocketDataToDummyData={addSocketDataToDummyData}
        setKeysOfScriptData={setKeysOfScriptData}
      />}
      {/* <StockTable /> */}
      <Box>
        {marketNames.map((marketName, index) => (
          <Box key={marketName} mb={2} mt={setisFavoritePage ? 2 : 0}>
            <Accordion
              expanded={expanded.has(marketName)}
              onChange={() => toggleExpand(marketName)}
              sx={{
                // border: '2px solid red',
                // '& .MuiAccordionSummary-root': {
                //   px: 1,
                // },
                '& .MuiAccordionDetails-root': {
                  px: 1,
                }
              }}
              disableGutters
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                <Box display="flex" alignItems="center" gap={1}>
                  {/* <ArrowRightAltIcon fontSize="small" color="action" /> */}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {marketName}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {isMobile ?
                  <MobileStockTable
                    searchText={searchText}
                    setIsStockOpen={setIsStockOpen}
                    // isStockOpen={isStockOpenInMobile}
                    dummyData={dummyData}
                    setDummyData={setDummyData}
                    marketName={marketName}
                    isDarkMode={isDarkMode}
                    handleBidAskClick={handleBidAskClick}
                    // setBuySellPopup={setBuySellPopup}
                    // buySellPopup={buySellPopup}
                    showToast={showToast}
                    handleStar={handleStar}
                    setRemoveMarket={setRemoveMarket}
                  />

                  :
                  <StockTable
                    searchText={searchText}
                    setIsStockOpen={setIsStockOpen}
                    setDummyData={setDummyData}
                    dummyData={dummyData}
                    marketName={marketName}
                    handleBidAskClick={handleBidAskClick}
                    // setBuySellPopup={setBuySellPopup}
                    // buySellPopup={buySellPopup}
                    showToast={showToast}
                    handleStar={handleStar}
                    setRemoveMarket={setRemoveMarket}
                  />}
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Box>

      <BackToTop />

      {/* <Navigate to="/app/dashboard/stock-details" state={{ stock: isStockOpenInMobile }} /> */}

      <Dialog open={!!isStockOpen} onClose={() => setIsStockOpen(null)} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{isStockOpen?.scriptName}</Typography>
            <Chip label="NSE" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }} />
          </Box>

          <Box>
            <Typography variant={isMobile ? "body1" : "h6"} color="green" fontWeight="bold">
              ₹164.85 ▲ +4.80 (+3.00%)
            </Typography>
          </Box>

        </DialogTitle>

        <DialogContent sx={{ px: 2 }}>
          {/* <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button variant="contained" color="success">BUY</Button>
            <Button variant="contained" color="error">SELL</Button>
          </Box> */}

          {/* Placeholder empty space */}
          <Box
            sx={{
              height: isMobile ? 'auto' : 350,
              border: '1px dashed #ccc',
              borderRadius: 2,
              backgroundColor: '#f9f9f9',
            }}
          ><ApexCharts name={isStockOpen?.scriptName} data={generateCandleData()} theme={theme} /></Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsStockOpen(null)}>Close</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={!!removeMarket}
        onClose={() => setRemoveMarket(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title" sx={{ mb: 2 }}>
          Confirm Removal
        </DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">
            Are you sure you want to remove <b>{removeMarket?.scriptName}</b> ?<br />
            {removeMarket.isFavorite && `Note : This stock will also removed from your favorites.`}
            {/* This action cannot be undone. */}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRemoveMarket(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={() => handleRemove(removeMarket, removeMarket?.idx)} variant="contained" color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster limit={3} />

      <BottomTradePopup
        open={Boolean(buySellPopup)}
        onClose={() => {
          setTabIndex(null);
          setBuySellPopup(null);
        }}
        stockData={buySellPopup}
        showToast={showToast}
        isMobile={isMobile}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
    </>
  );
}

export default Watchlist;