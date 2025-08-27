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
import PapperBlock from '../../../components/PapperBlock/PapperBlock';
import EnhancedTableToolbar from '../../../components/Tables/tableParts/TableToolbar';
import EnhancedTableHead from '../../../components/Tables/tableParts/TableHeader';
import useStyles from '../../../components/Tables/tableStyle-jss';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Chip, TableSortLabel, Divider, IconButton } from '@mui/material';
import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import { Star, StarBorder, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery as useMUIQuery } from '@mui/material';
import { lighten, darken, alpha } from '@mui/material/styles';
import { maxWidth } from '@mui/system';
import toast, { Toaster } from 'react-hot-toast';
import BottomTradePopup from './BottomTradePopup';
import { roundToTwoIN } from '../helpers/utilFunc';
import { toastTime } from './constant';
import { favouriteActionAPI, removeMarketWatchAPI } from '../API/API';

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
    // numeric: false,
    disablePadding: true,
    label: 'Script Name'
  },
  {
    id: 'bidRate',
    // numeric: true,
    disablePadding: false,
    label: 'Bid Rate'
  },
  {
    id: 'askRate',
    // numeric: true,
    disablePadding: false,
    label: 'Ask Rate'
  },
  {
    id: 'ltp',
    // numeric: true,
    disablePadding: false,
    label: 'LTP'
  },
  {
    id: 'priceChangePercent',
    // numeric: true,
    disablePadding: false,
    label: 'Change (%)'
  },
  {
    id: 'priceChange',
    // numeric: true,
    disablePadding: false,
    label: 'Change'
  },
  {
    id: 'open',
    // numeric: true,
    disablePadding: false,
    label: 'Open'
  },
  {
    id: 'close',
    // numeric: true,
    disablePadding: false,
    label: 'Close'
  },
  {
    id: 'high',
    // numeric: true,
    disablePadding: false,
    label: 'High'
  },
  {
    id: 'low',
    // numeric: true,
    disablePadding: false,
    label: 'Low'
  },
  // {
  //   id: 'qty',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Qty'
  // },
  // {
  //   id: 'maxOrder',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Max Or.'
  // },
  // {
  //   id: 'position',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Position'
  // },
  // {
  //   id: 'lastChangedAt',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Last Changed At'
  // }
];

// padding: 0.45rem;
// margin - right: 8px;
// width: 1.7rem;

const logoCss = {
  width: '1.8rem',
  height: '1.8rem',
  borderRadius: '10%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  fontSize: '1rem',
  // position: 'absolute',
  // top: row2Top,
  left: '4px',
  display: 'inline-block',
  p: '0.45rem',
  mr: '8px',
  // width: '1.7rem',
}

function StockTable({ searchText, setIsStockOpen, dummyData, setDummyData, handleBidAskClick, showToast, handleStar, setRemoveMarket, marketName, }) {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';

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
    // minWidth: isMobile ? '90px' : '100px',
    overflow: 'visible',
    px: 1,
    // filter: 'blur(8px)',
    // '- webkit - filter': 'blur(8px)',
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

  const geFisrtColBgColor = (idx) => {
    if (isDarkMode) {
      return idx % 2 ? theme.palette.grey[900] : '#333';
    } else {
      return idx % 2 ? theme.palette.grey[100] : '#fff';
    }
  };

  const getCondition = (val, showIcon, showPR, changeVal) => {
    const roundedVal = roundToTwoIN(val);
    return (
      <Box
        component="span"
        sx={{
          color: changeVal > 0 ? theme.palette.success.main : changeVal < 0 ? theme.palette.error.main : theme.palette.text.secondary,
          backgroundColor: changeVal > 0 ? 'rgba(76, 175, 80, 0.08)' : changeVal < 0 ? 'rgba(244, 67, 54, 0.08)' : 'rgba(158, 158, 158, 0.08)',
          borderRadius: 0.5,
          borderRadius: 1,
          px: 0.6,
          py: 0.3,
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 600,
          mr: showIcon ? 1 : 0,
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
        {showPR ? roundedVal + '%' : roundedVal}
      </Box>
    )
  };

  const renderCell = (dataArray, keyArray, idx) => keyArray.map((itemCell, index) => {
    const rowVal = dataArray?.priceChangePercent; // ✅ main field to decide color
    // const rowBgColor = getCellBgColor(rowVal);
    // const rowBgColorFirstCol = getCellBgColorFisrtCol(rowVal);
    const rowBgColor = 'inherit';
    const rowBgColorFirstCol = 'inherit';
    // console.log('WWWWW dataArray', dataArray);

    if (itemCell.id === 'scriptName') {
      const val = dataArray[itemCell.id];
      // console.log('!!! dataArray[itemCell.id]', dataArray[itemCell.id]);
      return (
        <>
          <TableCell
            key={dataArray?.id + index.toString()}
            sx={{
              ...firstColumnStyle,
              // backgroundColor: rowBgColorFirstCol,
              backgroundColor: geFisrtColBgColor(idx),
              opacity: 1,
              cursor: 'pointer',
            }}
            onClick={() => setIsStockOpen(dataArray)}
          // sortDirection={'desc'}
          >
            <Box sx={{ position: 'relative' }}>
              <Box sx={{
                ...logoCss,
                backgroundColor: isDarkMode ? '#777' : '#ccc',
                color: isDarkMode ? '#fff' : '#000'
              }}
              >
                {dataArray?.scriptName ? dataArray?.scriptName[0] : ''}
              </Box>

              <Typography variant="body1" sx={{ fontWeight: 500, display: 'inline' }} noWrap>
                {dataArray?.scriptName}
              </Typography>
              {Boolean(dataArray?.quantity) && <Chip
                label={dataArray?.quantity}
                color="primary"
                variant="outlined"
                size="small"
                sx={{
                  fontWeight: '600',
                  ml: '6px',
                  padding: '0px',
                  height: 18,
                  fontSize: '0.7rem',
                  // minWidth: 'unset',
                  lineHeight: 1,
                  borderWidth: 2,
                }}
              />}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                height: '100%',
                right: '-36px',
                width: '36px',
                pointerEvents: 'none',
                background: showShadow
                  ? isDarkMode
                    ? 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)'
                    : 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)'
                  : isDarkMode
                    ? 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
                    : 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)',
                zIndex: 10,
              }}
            />
          </TableCell>
        </>
      );
    }

    return (
      <TableCell
        padding="normal"
        align={itemCell.numeric ? 'right' : 'left'}
        key={dataArray?.id + index.toString()}
        sx={{
          ...tableCellStyle,
          backgroundColor: rowBgColor, // ✅ Apply to all other cells too
          fontWeight: itemCell.id === 'ltp' ? 700 : null,
          cursor: (itemCell.id === 'askRate' || itemCell.id === 'bidRate') ? 'pointer' : '',
        }}
        onClick={() => handleBidAskClick(dataArray, itemCell.id)}
      >
        {itemCell.id === 'priceChangePercent' ? getCondition(dataArray[itemCell.id], true, true, dataArray?.priceChange)
          : (itemCell.id === 'priceChange' || itemCell.id === 'askRate' || itemCell.id === 'bidRate')
            ? getCondition(dataArray[itemCell.id], false, false, dataArray?.priceChange)
            : roundToTwoIN(dataArray[itemCell.id])}
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
              key={'aa' + column.id}
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
                  <Chip
                    label='Quantity'
                    variant="outlined"
                    // size="small"
                    sx={{
                      color: "#fff",
                      ml: '6px',
                      padding: '0px',    // shorthand for px
                      height: 18,          // smaller chip height
                      fontSize: '0.7rem',
                      // minWidth: 'unset',
                      lineHeight: 1,
                    }}
                  />
                </>
              )}
              {/* </TableSortLabel> */}
            </TableCell>
          ))}
          <TableCell></TableCell>
          <TableCell></TableCell>
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
              {dummyData?.map((stock, idx) => {
                // console.log('QQQ stock marketName', stock, marketName);
                // if (stock.market_type_name !== marketName)
                //   return false;

                if (stock.scriptName?.toLowerCase().indexOf(searchText.toLowerCase()) === -1 || stock.market_type_name !== marketName) {
                  return false;
                }
                return (
                  <TableRow
                    tabIndex={-1}
                    key={stock.id}
                  // key={idx}
                  // sx={{ cursor: 'pointer' }}
                  // onClick={() => setIsStockOpen(stock)}
                  >
                    {renderCell(stock, columnData, idx)}

                    {/* Star Icon */}
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()} key={'star' + stock.id}>
                      <IconButton onClick={(e) => handleStar(stock, e)} sx={{ pl: 2 }}>
                        {stock.isFavorite ? (
                          <Star sx={{ color: 'gold' }} />
                        ) : (
                          <StarBorder sx={{ color: 'gray' }} />
                        )}
                      </IconButton>
                    </TableCell>

                    {/* Delete Icon */}
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()} key={'delete' + stock.id}>
                      <IconButton
                        // onClick={() => handleRemove(stock, idx)}
                        onClick={() => setRemoveMarket({ ...stock, idx })}
                        sx={{ pl: 1.5 }}
                      >
                        <Delete sx={{ color: 'error.main' }} />
                      </IconButton>
                    </TableCell>
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