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
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Chip, TableSortLabel, Popover, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery as useMUIQuery } from '@mui/material';
import { lighten, darken, alpha } from '@mui/material/styles';
import { maxWidth } from '@mui/system';
import StarSharpIcon from '@mui/icons-material/StarSharp';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, { Toaster } from 'react-hot-toast';


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


function StockTable({ searchText, setIsStockOpen, dummyData, isDarkMode, setDummyData }) {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));
  // const [openDialog, setOpenDialog] = useState(false);
  // const [selectedAction, setSelectedAction] = useState('');

  const [selectedScript, setSelectedScript] = useState('');
  const [hoveredRow, setHoveredRow] = useState('');

  const [showShadow, setShowShadow] = useState(false);
  const tableWrapperRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const longPressTimer = useRef(null);

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

  const removeItem = (id) => {
    console.log("remoe=veItem calledd...")
    setTimeout(() => {
      setDummyData((prev) => prev.filter((item) => item.id !== id));
    }, [500])
  };

  function showToast(msg, onUndo) {
    let didUndo = false;

    const toastId = toast.custom((t) => (
      <Box sx={{ ...toastBoxCss, background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', }}>
        <Typography sx={{ fontSize: '0.9rem' }}>
          {/* {scriptName} Removed */}
          {msg}
        </Typography>
        {onUndo && <Button
          size="small"
          sx={{ color: isDarkMode ? '#90caf9' : '#2196f3', ml: 2, textTransform: 'none', p: 0 }}
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
      id: msg, // optional: prevent duplicate toasts
      duration: 60000,
      position: 'bottom-center',
    });
  };

  const handleMouseEnter = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleTouchStart = (e) => {
    longPressTimer.current = setTimeout(() => {
      setAnchorEl(e.currentTarget);
    }, 500); // long press delay (adjust if needed)
  };

  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const open = Boolean(anchorEl);

  function handleRemove(stock, idx, isQty) {
    if (isQty) {
      showToast(`Cannot remove ${stock.scriptName} as it has quantity.`, false);
    } else {
      function onUndo() {
        setDummyData(prev => [
          ...prev.slice(0, idx),
          stock,
          ...prev.slice(idx)
        ]);
      }
      removeItem(stock.id);
      showToast(`${stock.scriptName} Removed `, onUndo);
    }
  }

  function handleStar(stock, isFavorite) {
    console.log("handle star called...");
    showToast(`${stock.scriptName} ${isFavorite ? 'removed from' : 'added in'} favorites.`);
  }

  const renderCell = (dataArray, keyArray) => keyArray.map((itemCell, index) => {
    const rowVal = dataArray.priceChangePercent; // ✅ main field to decide color
    const rowBgColor = getCellBgColor(rowVal);
    const rowBgColorFirstCol = getCellBgColorFisrtCol(rowVal);

    if (itemCell.id === 'scriptName') {
      const isQty = itemCell.qty > 0 ? true : false;
      const isFavorite = index % 3 == 0 ? true : false;

      return (
        <>
          <TableCell
            key={index.toString()}
            sx={{
              ...firstColumnStyle,
              backgroundColor: rowBgColorFirstCol,
              position: 'relative',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Box sx={{ position: 'relative' }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }} noWrap>
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
                background: showShadow
                  ? 'linear-gradient(to right, rgba(0,0,0,0.12), transparent)'
                  : 'linear-gradient(to right, rgba(0,0,0,0.03), transparent)',
                zIndex: 10,
              }}
            />

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  p: 1,
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  borderRadius: 1,
                },
              }}
            >
              <IconButton
                onClick={() => handleStar(item, isFavorite)}
                sx={{
                  backgroundColor: isDarkMode ? '#eca52e' : '#ffb63c',
                  '&:hover': { backgroundColor: isDarkMode ? '#d5942a' : '#e5a833' },
                  color: '#fff',
                }}
              >
                {isFavorite ? (
                  <RemoveCircleIcon sx={{ fontSize: '1.8rem' }} />
                ) : (
                  <StarSharpIcon sx={{ fontSize: '2rem' }} />
                )}
              </IconButton>

              <IconButton
                onClick={() => handleRemove(item, index, isQty)}
                sx={{
                  backgroundColor: isQty
                    ? isDarkMode ? '#696969' : '#797979'
                    : isDarkMode ? '#d73733' : '#e0362a',
                  '&:hover': {
                    backgroundColor: isQty
                      ? isDarkMode ? '#5a5a5a' : '#686868'
                      : isDarkMode ? '#c5312f' : '#c62f26',
                  },
                  color: '#fff',
                }}
              >
                <DeleteIcon sx={{ fontSize: '2rem' }} />
              </IconButton>
            </Popover>
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
              {dummyData.map(stock => {
                if (stock.scriptName.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                  return false;
                }
                return (
                  <TableRow
                    tabIndex={-1}
                    key={stock.id}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setIsStockOpen(stock)}
                  >
                    {renderCell(stock, columnData)}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </div>
      <Toaster limit={3} />
    </Paper>
  );
}

export default StockTable;