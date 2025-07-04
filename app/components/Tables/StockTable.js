import React, { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlat from '@mui/icons-material/TrendingFlat';
import { cryptoData } from 'dan-api/chart/chartMiniData';
import { BarChart, Bar } from 'recharts';
import PapperBlock from '../PapperBlock/PapperBlock';
import EnhancedTableToolbar from './tableParts/TableToolbar';
import EnhancedTableHead from './tableParts/TableHeader';
import useStyles from './tableStyle-jss';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Chip, TableSortLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery as useMUIQuery } from '@mui/material';
import { lighten, darken, alpha } from '@mui/material/styles';
import { maxWidth } from '@mui/system';

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

const columnData = [
  {
    id: 'scriptName',
    numeric: false,
    disablePadding: true,
    label: 'Script Name'
  },
  {
    id: 'bidRate',
    numeric: true,
    disablePadding: false,
    label: 'Bid Rate'
  },
  {
    id: 'askRate',
    numeric: true,
    disablePadding: false,
    label: 'Ask Rate'
  },
  {
    id: 'ltp',
    numeric: true,
    disablePadding: false,
    label: 'LTP'
  },
  {
    id: 'priceChangePercent',
    numeric: true,
    disablePadding: false,
    label: 'Change (%)'
  },
  {
    id: 'priceChange',
    numeric: true,
    disablePadding: false,
    label: 'Change'
  },
  {
    id: 'open',
    numeric: true,
    disablePadding: false,
    label: 'Open'
  },
  {
    id: 'close',
    numeric: true,
    disablePadding: false,
    label: 'Close'
  },
  {
    id: 'high',
    numeric: true,
    disablePadding: false,
    label: 'High'
  },
  {
    id: 'low',
    numeric: true,
    disablePadding: false,
    label: 'Low'
  },
  {
    id: 'qty',
    numeric: true,
    disablePadding: false,
    label: 'Qty'
  },
  {
    id: 'maxOrder',
    numeric: true,
    disablePadding: false,
    label: 'Max Or.'
  },
  {
    id: 'position',
    numeric: false,
    disablePadding: false,
    label: 'Position'
  },
  {
    id: 'lastChangedAt',
    numeric: false,
    disablePadding: false,
    label: 'Last Changed At'
  }
];

const dummyWatchlistData = [
  {
    id: '1',
    scriptName: 'RELIANCE',
    open: 2845.50,
    close: 2829.10,
    high: 2850.00,
    low: 2810.25,
    bidRate: 2828.90,
    askRate: 2829.30,
    ltp: 2829.10,
    priceChange: -16.40,
    priceChangePercent: -0.58,
    qty: 150,
    maxOrder: 1000,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:42:11'
  },
  {
    id: '2',
    scriptName: 'HDFCBANK',
    open: 1675.20,
    close: 1682.40,
    high: 1690.00,
    low: 1660.75,
    bidRate: 1682.30,
    askRate: 1682.60,
    ltp: 1682.40,
    priceChange: +7.20,
    priceChangePercent: +0.43,
    qty: 80,
    maxOrder: 800,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:43:08'
  },
  {
    id: '3',
    scriptName: 'INFY',
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
    maxOrder: 900,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:44:22'
  },
  {
    id: '4',
    scriptName: 'ITC',
    open: 435.60,
    close: 438.00,
    high: 439.10,
    low: 433.50,
    bidRate: 437.90,
    askRate: 438.10,
    ltp: 438.00,
    priceChange: +2.40,
    priceChangePercent: +0.55,
    qty: 250,
    maxOrder: 2000,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:45:01'
  },
  {
    id: '5',
    scriptName: 'TCS',
    open: 3830.00,
    close: 3825.75,
    high: 3845.00,
    low: 3800.00,
    bidRate: 3825.60,
    askRate: 3826.00,
    ltp: 3825.75,
    priceChange: -4.25,
    priceChangePercent: -0.11,
    qty: 70,
    maxOrder: 600,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:46:17'
  },
  {
    id: '6',
    scriptName: 'COALINDIA',
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
    maxOrder: 2500,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:47:33'
  },
  {
    id: '7',
    scriptName: 'SBIN',
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
    maxOrder: 1500,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:48:41'
  },
  {
    id: '8',
    scriptName: 'WIPRO',
    open: 475.00,
    close: 477.65,
    high: 479.00,
    low: 470.00,
    bidRate: 477.55,
    askRate: 477.75,
    ltp: 477.65,
    priceChange: +2.65,
    priceChangePercent: +0.56,
    qty: 130,
    maxOrder: 1200,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:49:30'
  },
  {
    id: '9',
    scriptName: 'JSWSTEEL',
    open: 840.00,
    close: 838.20,
    high: 845.00,
    low: 832.50,
    bidRate: 838.00,
    askRate: 838.40,
    ltp: 838.20,
    priceChange: -1.80,
    priceChangePercent: -0.21,
    qty: 140,
    maxOrder: 1100,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:50:20'
  },
  {
    id: '10',
    scriptName: 'HINDALCO',
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
    maxOrder: 1400,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:51:07'
  },
  {
    id: '11',
    scriptName: 'ONGC',
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
    maxOrder: 3000,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:51:59'
  },
  {
    id: '12',
    scriptName: 'HCLTECH',
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
    maxOrder: 850,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:52:45'
  },
  {
    id: '13',
    scriptName: 'NTPC',
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
    maxOrder: 1700,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:53:32'
  },
  {
    id: '14',
    scriptName: 'ASIANPAINT',
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
    maxOrder: 500,
    position: 'Sell',
    lastChangedAt: '2025-07-01 09:54:12'
  },
  {
    id: '15',
    scriptName: 'MARUTI',
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
    maxOrder: 400,
    position: 'Buy',
    lastChangedAt: '2025-07-01 09:54:55'
  }
];

function StockTable({ searchText, setIsStockOpen }) {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedAction, setSelectedAction] = useState('');

  const [selectedScript, setSelectedScript] = useState('');
  const [hoveredRow, setHoveredRow] = useState('');

  const [showShadow, setShowShadow] = useState(false);
  const tableWrapperRef = useRef(null);

  const handleScroll = () => {
    if (tableWrapperRef.current) {
      const scrollLeft = tableWrapperRef.current.scrollLeft;
      setShowShadow(scrollLeft > 0);
    }
  };

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll);
      return () => wrapper.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const tableCellStyle = {
    // minWidth: 100,             // ensures enough space
    overflow: 'hidden',
    whiteSpace: 'nowrap',     // prevents breaking into multiple lines
    // textOverflow: 'ellipsis',  //  adds "..." if still overflows
    px: 1,
    py: 0.5,
    maxWidth: 'fit-content',
    lineHeight: 1.2,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    // fontSize: '0.75rem',
  }

  const firstColumnStyle = {
    ...tableCellStyle,
    position: 'sticky',         // ✅ fixes the column
    left: 0,                    // ✅ sticks to the left edge
    zIndex: 3,                  // ✅ make sure it renders above
    minWidth: isMobile ? '90px' : '100px',
    overflow: 'visible',
    px: 1,
  }

  const firstColumnHeaderStyle = {
    ...firstColumnStyle,
    color: "white",
    background: '#1976d2',
  }

  const { classes, cx } = useStyles();

  const getCellBgColor = (val) => {
    if (val > 0) return 'rgba(144, 199, 147, 0.15)'; // light green
    if (val < 0) return 'rgba(226, 162, 157, 0.15)'; // light red
    return 'rgba(158, 158, 158, 0.15)';             // neutral gray
  };

  const getCellBgColorFisrtCol = (val) => {
    if (val > 0) return theme.palette.mode === 'dark' ? '#3a433b' : '#eaf3eb'; // light green
    if (val < 0) return theme.palette.mode === 'dark' ? '#4e4443' : '#fbf1f0'; // light red
    return 'rgba(158, 158, 158)';             // neutral gray
  };

  const getCondition = (val, showIcon) => {
    const theme = useTheme();
    return (
      <Box
        component="span"
        sx={{
          color: val > 0 ? theme.palette.success.main : val < 0 ? theme.palette.error.main : theme.palette.text.secondary,
          backgroundColor: val > 0 ? 'rgba(76, 175, 80, 0.08)' : val < 0 ? 'rgba(244, 67, 54, 0.08)' : 'rgba(158, 158, 158, 0.08)',
          borderRadius: 0.5,
          borderRadius: 1,
          px: 0.6,
          py: 0.3,
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 600,
          // fontSize: '0.75rem',
          // lineHeight: 1.1,
        }}
      >
        {showIcon &&
          (val > 0 ? (
            <TrendingUp fontSize="inherit" sx={{ mr: 0.5 }} />
          ) : val < 0 ? (
            <TrendingDown fontSize="inherit" sx={{ mr: 0.5 }} />
          ) : (
            <TrendingFlat fontSize="inherit" sx={{ mr: 0.5 }} />
          ))}
        {val}%
      </Box>
    )
  };

  const renderCell = (dataArray, keyArray) => keyArray.map((itemCell, index) => {
    const rowVal = dataArray.priceChangePercent; // ✅ main field to decide color
    const rowBgColor = getCellBgColor(rowVal);
    const rowBgColorFirstCol = getCellBgColorFisrtCol(rowVal);

    if (itemCell.id === 'scriptName') {
      return (
        <>
          <TableCell
            key={index.toString()}
            sx={{
              ...firstColumnStyle,
              backgroundColor: rowBgColorFirstCol,
            }}
          // sortDirection={'desc'}
          >
            <Box sx={{ position: 'relative' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }} fontWeight={500} noWrap>
                {dataArray.scriptName}
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                height: '100%',
                right: '-36px',
                width: '36px',
                pointerEvents: 'none',
                background: showShadow ? 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)',
                zIndex: 10,
              }}
            />
          </TableCell>
        </>
      );
    }

    if (itemCell.id === 'priceChangePercent' || itemCell.id === 'priceChange') {
      return (
        <TableCell
          padding="normal"
          align={itemCell.numeric ? 'right' : 'left'}
          key={index.toString()}
          sx={{
            ...tableCellStyle,
            backgroundColor: rowBgColor,
          }}>
          {getCondition(dataArray[itemCell.id], itemCell.id === 'priceChangePercent')}
        </TableCell>
      );
    }

    return (
      <TableCell
        padding="normal"
        align={itemCell.numeric ? 'right' : 'left'}
        key={index.toString()}
        sx={{
          ...tableCellStyle,
          backgroundColor: rowBgColor, // ✅ Apply to all other cells too
        }}>
        {dataArray[itemCell.id]}
      </TableCell>
    );
  });

  const TableHeader = ({ columnData }) => {
    return (
      <TableHead>
        <TableRow
          tabIndex={-1}
          key={'column'}
          sx={{
            height: 36,
            '& th': {
              color: '#fff',
              background: theme.palette.mode === 'dark' ? 'linear-gradient(90deg, #134591, #154b97)' : 'linear-gradient(90deg, #3060aa, #3269b5)',
              // background: 'linear-gradient(90deg, #0d47a1d9, #0f4fa8d9)',
            },
          }}
        >
          {columnData.map((column) => (
            <TableCell
              key={column.id}
              align={column.numeric ? 'right' : 'left'}
              sx={column.id === 'scriptName' ?
                firstColumnHeaderStyle : { ...tableCellStyle, color: "white" }}
              // sortDirection={column.id === 'scriptName' ? 'desc' : null}
            >
              {/* <TableSortLabel active direction={"desc"}> */}
                {column.label.toUpperCase()}

                {column.id === 'scriptName' && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        height: '100%',
                        right: '-36px',
                        width: '36px',
                        pointerEvents: 'none',
                        background: showShadow ? 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)',
                        borderRadius: '10px 0px 0px 0px',
                        zIndex: 10,
                      }}
                    />
                  </>
                )}
              {/* </TableSortLabel> */}
            </TableCell>
          ))}
        </TableRow>
      </TableHead >
    );
  };


  return (
    <Paper sx={{ margimTop: '0px' }}>
      <div className={classes.root_Table} style={{ margimTop: '0px' }}>
        <Box
          className={classes.tableWrapper}
          ref={tableWrapperRef}
          sx={{
            overflowX: 'auto',
            position: 'relative',
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#aaa',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#777' : '#888',
            },
          }}
        >
          <Table className={cx(classes.table, classes.stripped, classes.hover)} sx={{ my: 0 }}>
            <TableHeader columnData={columnData} />
            <TableBody>
              {dummyWatchlistData.map(data => {
                if (data.scriptName.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                  return false;
                }
                return (
                  <TableRow
                    tabIndex={-1}
                    key={data.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setIsStockOpen(data)}
                  >
                    {renderCell(data, columnData)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </div>
    </Paper>
  );
}

export default StockTable;