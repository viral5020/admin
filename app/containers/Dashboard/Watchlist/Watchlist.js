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
  CircularProgress,
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
import { toastTime } from './constant';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import ReportIcon from '@mui/icons-material/Report';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import Loader from '../Components/Loader';
import { toastObj } from '../helpers/helper';
import { toast } from "react-toastify";


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
  const [oldDummyData, setOldDummyData] = useState();

  const [removeMarket, setRemoveMarket] = useState(false);

  const [socketData, setSocketData] = useState();
  const socketContext = useContext(SocketContext);
  // console.log('^^^ socketContext', socketContext);
  const socket = socketContext.socket;
  // console.log('socket', socket);
  const [buySellPopup, setBuySellPopup] = useState(null);
  const [tabIndex, setTabIndex] = useState(null);

  const [marketNames, setMarketNames] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

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
      setTabIndex(1);
    } else if (columnName === 'askRate') {
      setBuySellPopup({ ...dataArray });
      setTabIndex(0);
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
      // console.log(" data.data ", data.data);
      // console.log(" data ", data);
      const rawInstrumentId = data.InstrumentIdentifier ?? data.data?.InstrumentIdentifier;
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
    hasChanges(updatedData);
    // setDummyData(updatedData);
    // setDummyData(numWithCommasData);
  }

  useEffect(() => {
    addSocketDataToDummyData();
  }, [socketData])

  useEffect(() => {
    // console.log('dummyData', dummyData); // chatgpt : this is not logging with data
  }, [dummyData])

  function getTime(serverTime) {
    const date = new Date(serverTime * 1000); // convert to ms

    const timeOnly = date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // console.log(timeOnly); // 👉 "11:58:26"
    return timeOnly;
  }

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
    const time = getTime(dataItem.ServerTime);
    // console.log('time', time);

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
        serverTime: time,
        isBidUp: coinItem.isBidUp,
        isAskUp: coinItem.isAskUp,
      };
    };
  };

  async function getWatchListData() {
    setIsLoading(true);
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
      dd.forEach(script => {
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
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // window.location.reload();
    const path = location.pathname;
    const lastPart = path.split("/").pop();
    console.log('lastPart', lastPart);

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
    const toast_id = Date.now();

    const toastId = toast(
      <Box
      // sx={{
      //   ...toastBoxCss,
      //   background: isDarkMode ? "#333" : "#fff",
      //   color: isDarkMode ? "#fff" : "#000",
      // }}
      >
        {actionIcon === "removed" ? (
          <StarBorder sx={{ color: "gray", mr: 0.8 }} />
        ) : actionIcon === "added" ? (
          <Star sx={{ color: "gold", mr: 0.8 }} />
        ) : actionIcon === "delete" ? (
          <RemoveCircleSharpIcon sx={{ color: "error.main", mr: 0.8 }} />
        ) : actionIcon === "error" ? (
          <ReportIcon sx={{ color: "error.main", mr: 0.8 }} />
        ) : (
          ""
        )}

        <Typography sx={{ fontSize: "0.9rem", display: 'inline' }}>{msg}</Typography>

        {onUndo && (
          <Button
            size="small"
            sx={{
              color: isDarkMode ? "#90caf9" : "#2196f3",
              ml: 2,
              textTransform: "none",
              p: 0,
              backgroundColor: "#90caf933",
            }}
            onClick={() => {
              didUndo = true;
              onUndo();
              // toast.dismiss(toastId); // dismiss using react-toastify API
            }}
          >
            {didUndo ? 'Undone' : 'Undo'}
          </Button>
        )}
      </Box>,
      {
        // toastId, // ✅ use toastId here instead of `id`
        autoClose: toastTime, // ✅ react-toastify uses autoClose instead of duration
        position: "top-right",
        ...toastObj,
      }
    );
  }


  async function handleStar(stockData, e) {
    let starBtn;
    if (!!e) {
      starBtn = e?.currentTarget;
      starBtn.disabled = true; // chatgpt : this is not working
      // setTimeout(() => {
      //   starBtn.disabled = false; // re-enable after 2 seconds
      // }, 1500);
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
    starBtn.disabled = false;
    console.log('isError', isError);
    !isError ? setDummyData(prevData =>
      prevData.map(stock => {
        return stock.script_id === stockData.script_id
          ? { ...stock, isFavorite: !stock.isFavorite }
          : stock;
      })
    ) : null;
  }

  // useEffect(() => {
  //   console.log('dummyData', dummyData);
  // }, [dummyData]);


  function handleRemove(stock, idx) {
    let marketIndex;
    console.log('stock', stock);
    setRemoveMarket(false);
    if (stock.quantity > 0) {
      showToast(`Cannot remove ${stock.scriptName} as it has quantity.`, false);
    } else {
      let isNotLastScript = false; //it is not last script in its market in watchlist
      let isUndo = false;

      function onUndo() {
        isUndo = true;
        setDummyData(prev => prev.toSpliced(idx, 0, stock));
        !isNotLastScript && setMarketNames(prev => prev.toSpliced(marketIndex, 0, stock.market_type_name));
      }

      setTimeout(() => {
        console.log('setTimeout isUndo', isUndo);
        if (!isUndo) {
          removeMarketWatchAPI(stock.market_watch_id);
        }
      }, [toastTime + 500])

      dummyData.forEach(val => {
        if (val.market_type_name === stock.market_type_name && val.market_watch_id !== stock.market_watch_id) {
          // IF MARKET NAME IS SAME AND SCRIPT IS DIFFERENT 
          isNotLastScript = true;
        }
      })
      console.log('isNotLastScript', isNotLastScript);
      if (!isNotLastScript) {
        const market_names = marketNames.filter((val, index) => {
          if (val === stock.market_type_name) {
            marketIndex = index;
          }
          return val !== stock.market_type_name
        });
        setMarketNames(market_names);
      }

      setDummyData(prevData => prevData.filter(data => data.market_watch_id !== stock.market_watch_id));
      showToast(`${stock.scriptName} Removed `, onUndo, 'delete');
    }
  }
  // useEffect(() => {
  //   console.log('marketNames', marketNames);
  // }, [marketNames]);


  const keysToCheck = ["askRate", "bidRate", "ltp", "priceChange", "high", "low"];

  function hasChanges(newData) {
    if (!dummyData) {
      setDummyData(newData);
      return; // length changed = change
    }

    newData.forEach((newItem, i) => {
      const oldItem = dummyData[i];
      if (!oldItem) {
        newData[i].isChanged = true;
      }; // new item added

      if (newItem['bidRate'] !== oldItem['bidRate']) {
        newData[i].isBidChanged = true;
      } else {
        newData[i].isBidChanged = false;
      }

      if (newItem['askRate'] !== oldItem['askRate']) {
        newData[i].isAskChanged = true;
      } else {
        newData[i].isAskChanged = false;
      }

      if (newItem['bidRate'] > oldItem['bidRate']) {
        newData[i].isAskUp = true;
      } else if ((newItem['bidRate'] < oldItem['bidRate'])) {
        newData[i].isAskUp = false;
      }

      if (newItem['askRate'] > oldItem['askRate']) {
        newData[i].isBidUp = true;
      } else if (newItem['askRate'] < oldItem['askRate']) {
        newData[i].isBidUp = false;
      }


    });

    setDummyData(newData);
  }


  // function hasChanges(newData) {
  //   if (!oldDummyData || oldDummyData.length !== newData.length) {
  //     // Mark all as changed
  //     const updated = newData?.map(item => ({ ...item, isChanged: true }));
  //     setDummyData(updated);
  //     return;
  //   }

  //   const updated = newData.map((newItem, i) => {
  //     const oldItem = oldDummyData[i];
  //     if (!oldItem) {
  //       return { ...newItem, isChanged: true }; // New item
  //     }

  //     const changed = keysToCheck.some(
  //       (key) => newItem[key] !== oldItem[key]
  //     );

  //     return { ...newItem, isChanged: changed };
  //   });

  //   setDummyData(updated);
  // }




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
      {!isFavoritePage &&
        <FilterComponent
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
          setMarketNames={setMarketNames}
          marketNames={marketNames}
        />}
      {/* <StockTable /> */}
      {isLoading ?
        <Loader />
        : <Box>
          {marketNames.length === 0 ?
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              No stocks in {isForex ? 'Forex ' : ''}Watchlist {isFavoritePage ? 'Favorite' : ''}. Please add some.
            </Typography>

            :

            marketNames.map((marketName, index) => (
              <Box key={marketName} mb={1} mt={setisFavoritePage ? 1 : 0}>
                <Accordion
                  expanded={expanded.has(marketName)}
                  onChange={() => toggleExpand(marketName)}
                  sx={{
                    // border: '2px solid red',
                    // '& .MuiAccordionSummary-root': {
                    //   px: 1,
                    // },
                    '& .MuiAccordionDetails-root': {
                      px: 0,
                    }
                  }}
                  disableGutters
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      minHeight: 0, // remove default tall height
                      padding: '0 4px', // tighter horizontal padding
                      '&.Mui-expanded': {
                        minHeight: 0, // keep compact when expanded
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: 0, // remove extra margin
                        ml: 1,
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={0.5}>
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
        </Box >}

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
      {/* <Toaster limit={3} containerStyle={{ zIndex: 999999999 }} /> */}
    </>
  );
}

export default Watchlist;