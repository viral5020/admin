import React, { useState } from 'react';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import useStyles from './dashboard-jss';
import StockTable from 'dan-components/Tables/StockTable';
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
import ApexCharts from './Apexcharts';
import { useTheme } from '@mui/material/styles';
import MarketPlaceWIdget from 'dan-components/Widget/MarketPlaceWIdget';
import MobileStockTable from 'dan-components/Tables/MobileStockTable';
import { Navigate } from 'react-router-dom';
import BackToTop from './BackToTop';


const generateCandleData = (name) => {
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


function Watchlist() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));

  const title = brand.name + ' - Cryptocurrency Dashboard';
  const description = brand.desc;
  const { classes } = useStyles();
  const [searchText, setSearchText] = useState('');
  const [isStockOpen, setIsStockOpen] = useState();
  const [isStockOpenInMobile, setIsStockOpenInMobile] = useState();
  const [dummyData, setDummyData] = useState(dummyWatchlistData)

  const sections = [
    { title: 'Nifty 50 Stocks', key: 'nifty' },
    { title: 'Banking Sector', key: 'banking' },
    { title: 'Commodities Market', key: 'commodities' },
    { title: 'Currency Derivatives', key: 'currency' }
  ];

  // Manage expanded state for all sections
  const [expanded, setExpanded] = useState(() => new Set(sections.map(s => s.key)));

  const toggleExpand = (key) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

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
      <FilterComponent searchText={searchText} setSearchText={setSearchText} isDarkMode={isDarkMode} isMobile={isMobile} />
      {/* <StockTable /> */}
      <Box>
        {sections.map((section, index) => (
          <Box key={section.key} mb={2} >
            <Accordion
              expanded={expanded.has(section.key)}
              onChange={() => toggleExpand(section.key)}
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
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {isMobile ?
                  // <WithOneAction/>
                  // <MobileStockTableFlexCss
                  <MobileStockTable
                    searchText={searchText}
                    setIsStockOpen={setIsStockOpenInMobile}
                    isStockOpen={isStockOpenInMobile}
                    dummyData={dummyData}
                    setDummyData={setDummyData}
                    isDarkMode={isDarkMode}
                  />
                  : <StockTable
                    searchText={searchText}
                    setIsStockOpen={setIsStockOpen}
                    watchList={dummyWatchlistData}
                  />}
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Box>

      <BackToTop />

      {isMobile ? isStockOpenInMobile && (
        <Navigate to="/app/dashboard/stock-details" state={{ stock: isStockOpenInMobile }} />
      )
        :
        <Dialog open={isStockOpen} onClose={() => setIsStockOpen(null)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">{isStockOpen?.scriptName}</Typography>
              <Chip label="NSE" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }} />
            </Box>
            <Box>
              <Typography variant="h6" color="green" fontWeight="bold">
                ₹164.85 ▲ +4.80 (+3.00%)
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Button variant="contained" color="success">BUY</Button>
              <Button variant="contained" color="error">SELL</Button>
            </Box>

            {/* Placeholder empty space */}
            <Box
              sx={{
                height: 350,
                border: '1px dashed #ccc',
                borderRadius: 2,
                backgroundColor: '#f9f9f9'
              }}
            ><ApexCharts name={isStockOpen?.scriptName} data={generateCandleData()} theme={theme} /></Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setIsStockOpen(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      }
    </>
  );
}

export default Watchlist;