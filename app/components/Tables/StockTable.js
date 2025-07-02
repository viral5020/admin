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
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery as useMUIQuery } from '@mui/material';

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
    label: 'Price Change'
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
    label: 'Max Order'
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
    qty: 160,
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

function StockTable({ searchText }) {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
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


  const firstColumnHeaderStyle = {
    position: 'sticky',         // ✅ fixes the column
    left: 0,                    // ✅ sticks to the left edge
    background: 'white',        // ✅ avoids overlap transparency
    zIndex: 3,                  // ✅ make sure it renders above
    // boxShadow: '4px 0 6px -2px rgba(0,0,0)', // ✅ right shadow
    whiteSpace: 'nowrap',
    minWidth: isMobile ? '120px' : '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    overflow: 'visible',
  }

  const tableCellStyle = {
    whiteSpace: 'nowrap',     // prevents breaking into multiple lines
    minWidth: 100,             // ensures enough space
    overflow: 'hidden',
    textOverflow: 'ellipsis'  //  adds "..." if still overflows
  }


  const { classes, cx } = useStyles();

  const getCondition = (val, showIcon) => {
    if (val > 0) {
      return (
        <span className={classes.up}>
          {showIcon && <TrendingUp />}
          &nbsp;
          {val}
          %
        </span>
      );
    }
    if (val < 0) {
      return (
        <span className={classes.down}>
          {showIcon && <TrendingDown />}
          &nbsp;
          {val}
          %
        </span>
      );
    }
    return (
      <span className={classes.flat}>
        {showIcon && <TrendingFlat />}
        &nbsp;0%
      </span>
    );
  };

  const renderCell = (dataArray, keyArray) => keyArray.map((itemCell, index) => {
    if (itemCell.id === 'scriptName') {
      return (
        <>
          <TableCell
            key={index.toString()}
            sx={firstColumnHeaderStyle}
          >
            <Box sx={{ position: 'relative' }}>
              <Typography variant="subtitle1">{dataArray.scriptName}</Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: isMobile ? '120px' : '160px',
                height: '100%',
                width: '26px',
                pointerEvents: 'none',
                background: showShadow ? 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.02), transparent)',
                zIndex: 10,
              }}
            />
          </TableCell>
        </>
      );
    }

    if (itemCell.id === 'priceChangePercent') {
      return (
        <TableCell padding="normal" align={itemCell.numeric ? 'right' : 'left'} key={index.toString()} sx={tableCellStyle}>
          {getCondition(dataArray[itemCell.id], true)}
        </TableCell>
      );
    }
    if (itemCell.id === 'priceChange') {
      return (
        <TableCell padding="normal" align={itemCell.numeric ? 'right' : 'left'} key={index.toString()} sx={tableCellStyle}>
          {getCondition(dataArray[itemCell.id], false)}
        </TableCell>
      );
    }

    return (
      <TableCell
        padding="normal"
        align={itemCell.numeric ? 'right' : 'left'}
        key={index.toString()}
        sx={tableCellStyle}>
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
          sx={{ position: 'relative' }}
        >
          {columnData.map((column) => (
            <TableCell
              key={column.id}
              align={column.numeric ? 'right' : 'left'}
              sx={column.id === 'scriptName' ? firstColumnHeaderStyle : null}
            >
              {column.label.toUpperCase()}

              {column.id === 'scriptName' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: isMobile ? '120px' : '160px',
                    height: '100%',
                    width: '26px',
                    pointerEvents: 'none',
                    background: showShadow ? 'linear-gradient(to right, rgba(0,0,0,0.08), transparent)' : 'linear-gradient(to right, rgba(0,0,0,0.04), transparent)',
                    zIndex: 10,
                  }}
                />
              )}
            </TableCell>
          ))}
        </TableRow>

      </TableHead >
    );
  };


  return (
    <Paper sx={{ margimTop: '0px' }}>
      <div className={classes.root_Table} style={{ margimTop: '0px' }}>
        <div className={classes.tableWrapper}  ref={tableWrapperRef} style={{ overflowX: 'auto', position: 'relative' }}>
          <Table className={cx(classes.table, classes.stripped, classes.hover)}>
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
                  >
                    {renderCell(data, columnData)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

        </div>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedAction} Order</DialogTitle>
        <DialogContent>
          <Typography>You selected to <strong>{selectedAction}</strong> <em>{selectedScript}</em>.</Typography>
          {/* Add your form here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default StockTable;
