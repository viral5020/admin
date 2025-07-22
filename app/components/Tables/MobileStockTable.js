import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Divider,
    IconButton,
    Paper,
    Button,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { position } from 'stylis';
import { faTableCellsRowLock } from 'dan-vendor/@fortawesome/free-solid-svg-icons';
import {
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
    Type as ListType,
    LeadingActions
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import './listAnimation.css'; // Animation styles
import toast, { Toaster } from 'react-hot-toast';
import StarSharpIcon from '@mui/icons-material/StarSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useTheme } from '@emotion/react';

function splitScriptAndDate(fullText) {
    const parts = fullText.trim().split(' ');
    if (parts.length < 4) return { scriptName: fullText, date: '' };

    const date = parts.slice(-3).join(' ');
    const scriptName = parts.slice(0, -3).join(' ');

    return { scriptName, date };
}


const row2Top = '1.6rem';
const row3Top = '';

const toastBoxCss = {
    display: 'flex',
    alignItems: 'center',
    px: 2.5,
    py: 0.7,
    boxShadow: 3,
    minWidth: '80vw',
    justifyContent: 'space-between',
    borderRadius: '60px',
}

const boxCss = {
    borderRadius: '10%',
    py: 0,
    color: 'white',
    width: '22vw',
    // height: 'calc(100% + 1rem)',
    minHeight: '3.5rem',
    opacity: '0.9',
    // position: 'relative',
    top: '4px',
}

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
    top: row2Top,
    left: '4px'
}

const headerBgCss = {
    backgroundColor: '#3551533d',
    borderRadius: '10px 10px 0 0',
    px: '0.4rem'
}

const MobileStockTable = ({
    searchText,
    isStockOpen,
    setIsStockOpen,
    dummyData,
    isDarkMode,
    onToggleFavorite,
    favorites,
    setDummyData
}) => {

    const theme = createTheme({
        palette: {
            star: '#fff', // Don't think, Just remain this as it is
        },
    });

    const [spacing, setSpacing] = useState({ fontSize: '0.95rem' });
    const [isSmallMobile, setIsSmallMobile] = useState();
    const [textColor, setTextColor] = useState('');
    const [boxStyle, setBoxStyle] = useState(boxCss);
    const [headerBoxStyle, setHeaderBoxStyle] = useState(headerBgCss);

    useEffect(() => {
        isDarkMode ? setTextColor('#e0e0e0') : setTextColor('#1f1f1f');
        setHeaderBoxStyle(prev => ({ ...prev, backgroundColor: isDarkMode ? '#8383833d' : '#3551533d' }))
    }, [isDarkMode])

    useEffect(() => {
        setBoxStyle(prev => ({ ...prev, border: `1.7px solid ${textColor}` }))
    }, [textColor]);

    function apiSetFavrioute(e) {
        e.stopPropagation();
        console.log('inside apiSetFavrioute');
    }

    function setSpace() {
        if (window.innerWidth < 417) {
            setSpacing(prev => ({
                ...prev,
                // width: '5.6rem',
                px: '0.17rem',
            }))
        } else if (window.innerWidth < 440) {
            setSpacing(prev => ({
                ...prev,
                // width: '5.9rem',
                px: '0.34rem',
            }))
        } else {
            setSpacing(prev => ({
                ...prev,
                // width: '6.6rem',
                px: '0.44rem',
                fontWeight: 600,
            }))
        }

        window.innerWidth < 405 ? setIsSmallMobile(true) : setIsSmallMobile(false);
    }

    useEffect(() => {
        setSpace();
        window.addEventListener('resize', setSpace); // 👂 add listener

        return () => {
            window.removeEventListener('resize', setSpace); // 🧹 cleanup
        };
    }, [])

    useEffect(() => {
        isSmallMobile ? setBoxStyle(prev => ({ ...prev, width: '27vw' })) : setBoxStyle(prev => ({ ...prev, width: '23vw' }));
    }, [isSmallMobile])

    useEffect(() => {
        setBoxStyle(prev => ({ ...prev, px: spacing.px }))
    }, [spacing])

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

    const renderActions = (item, idx, isQty, isFavorite) => ({
        leading: (
            <LeadingActions>
                <SwipeAction
                    // destructive={true}
                    onClick={() => handleStar(item, isFavorite)}
                >
                    <ThemeProvider theme={theme}>
                        <Button
                            variant="contained"
                            color="star"
                            sx={{
                                backgroundColor: isDarkMode ? '#eca52e' : '#ffb63c',
                                height: '100%',
                                borderRadius: 0,
                                minWidth: '80px',
                                fontSize: '0.85rem',
                                color: '#fff',
                            }}
                        >
                            {/* Star */}
                            {isFavorite ? <RemoveCircleIcon sx={{ fontSize: '1.8rem' }} /> : <StarSharpIcon sx={{ fontSize: '2rem' }} />}
                        </Button>
                    </ThemeProvider>
                </SwipeAction >
            </LeadingActions >
        ),
        trailing: (
            <TrailingActions>
                <SwipeAction
                    destructive={isQty ? false : true}
                    onClick={() => handleRemove(item, idx, isQty)}
                >
                    <Button
                        variant="contained"
                        color={isQty ? "inherit" : "error"}
                        sx={{
                            backgroundColor: isQty ?
                                isDarkMode ? '#696969' : '#797979'
                                : isDarkMode ? '#d73733' : '#e0362a',
                            height: '100%',
                            borderRadius: 0,
                            minWidth: '80px',
                            color: '#fff',
                            fontSize: '0.85rem'
                        }}
                    >
                        {/* Remove */}
                        <DeleteIcon sx={{ fontSize: '2rem' }} />
                    </Button>
                </SwipeAction>
            </TrailingActions>
        )
    });

    return (
        <>
            <SwipeableList type={ListType.IOS}>
                {dummyData.map((stock, idx) => {
                    const isUp = stock.priceChange > 0;
                    const color = isDarkMode
                        ? isUp ? '#26a69a' : '#ef6d61'
                        : isUp ? '#388055' : '#BB3536';

                    const Icon = isUp ? ArrowDropUpIcon : ArrowDropDownIcon;
                    const time = new Date(stock.time).toLocaleString();

                    if (stock.scriptName.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                        return false;
                    }

                    const isQty = stock.qty > 0 ? true : false;
                    const isFavorite = idx % 3 == 0 ? true : false;
                    const { leading, trailing } = renderActions(stock, idx, isQty, isFavorite);

                    return (
                        <SwipeableListItem
                            key={stock.id}
                            leadingActions={leading}
                            trailingActions={trailing}
                        // fullSwipe={false}
                        // threshold={0.5}
                        >
                            <Box sx={{ width: '100%', px: 0.2 }} onClick={() => setIsStockOpen(stock)}>
                                {/* Header line */}
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={headerBoxStyle}
                                >
                                    {isSmallMobile && <Typography
                                        variant="body2"
                                        sx={{
                                            color,
                                            display: 'inline',
                                            fontWeight: 600,
                                            top: '0rem',
                                            width: '5rem'
                                        }}
                                    >
                                        {Number(stock.ltp.toFixed(2)).toLocaleString('en-IN')}
                                    </Typography>}

                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        {isSmallMobile ? 'Q : ' : 'Qty : '}{stock.qty?.toLocaleString('en-IN')}
                                    </Typography>

                                    <Typography sx={{ fontSize: '0.84rem' }}>{time}</Typography>
                                </Stack>

                                {/* Below Header */}
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        px: '0.2rem',
                                        mt: '0.3rem'
                                    }}
                                >
                                    {/* LHS section */}
                                    <Stack
                                        direction="column"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                    >
                                        {/* Logo and scriptname */}
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={0.75}
                                        >
                                            {/* Logo */}
                                            <Box sx={{
                                                ...logoCss,
                                                backgroundColor: isDarkMode ? '#777' : '#ccc',
                                                color: isDarkMode ? '#fff' : '#000'
                                            }}
                                            >
                                                {stock.scriptName[0]}
                                            </Box>


                                            {/* scriptName and Date */}
                                            <Stack
                                                direction="column"
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                            >
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={600}
                                                    sx={{
                                                        color: textColor, lineHeight: '1rem',
                                                        // border: '1px solid blue'
                                                    }}
                                                >
                                                    {splitScriptAndDate(stock.scriptName).scriptName}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: textColor, fontSize: '0.75rem', transform: 'skewX(-10deg)' }}
                                                >
                                                    {splitScriptAndDate(stock.scriptName).date}
                                                </Typography>
                                            </Stack>
                                        </Stack>

                                        {/* change % and LTP */}
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                left: '1rem',
                                                // height: '1rem',
                                                // border: '1px solid red',
                                                top: '-0.19rem',
                                                mr: '14px',
                                                width: !isSmallMobile ? '40vw' : 'auto',
                                            }}
                                        >
                                            <Icon style={{
                                                color, fontSize: '1.8rem',
                                                position: 'absolute',
                                                left: '-1.3rem',
                                                top: '-2px'
                                            }} />
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        display: 'inline',
                                                        fontSize: '0.83rem',
                                                        fontWeight: 500,
                                                        // position: 'relative',
                                                        // left: '-0.8rem'
                                                        // border: '1px solid green',
                                                        // lineHeight: '0rem',
                                                    }}
                                                >
                                                    {stock.priceChange.toFixed(2)} ({stock.priceChangePercent.toFixed(2)}%) {' '}
                                                </Typography>
                                                {!isSmallMobile && <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color,
                                                        display: 'inline',
                                                        fontWeight: 600,
                                                        // position: 'relative',
                                                        // left: '-0.8rem'
                                                    }}
                                                >
                                                    {Number(stock.ltp.toFixed(2)).toLocaleString('en-IN')}
                                                </Typography>}
                                            </Box>
                                        </Box>
                                    </Stack>


                                    {/* RHS section */}
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        {/* Bid Box */}
                                        <Stack
                                            direction="column"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box
                                                sx={{ ...boxStyle, backgroundColor: color, textAlign: 'center' }}
                                            >
                                                <Typography
                                                    sx={{ fontWeight: 700, fontSize: spacing.fontSize }}
                                                    pt={0.6}
                                                >
                                                    {stock.bidRate.toLocaleString('en-IN')}
                                                </Typography>

                                                <Typography
                                                    fontSize='0.71rem'
                                                    fontWeight='600'
                                                    pt={0.5}
                                                >
                                                    H: {stock.high.toLocaleString('en-IN')}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        {/* Ask Box */}
                                        <Stack
                                            direction="column"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box
                                                sx={{ ...boxStyle, backgroundColor: color, textAlign: 'center' }}
                                            >
                                                <Typography
                                                    sx={{ fontWeight: 700, fontSize: spacing.fontSize }}
                                                    pt={0.6}
                                                >
                                                    {stock.askRate.toLocaleString('en-IN')}
                                                </Typography>

                                                <Typography
                                                    fontSize='0.71rem'
                                                    fontWeight='600'
                                                    pt={0.5}
                                                >
                                                    L: {stock.low.toLocaleString('en-IN')}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                {/* Divider */}
                                {
                                    idx !== dummyData.length - 1 && (
                                        <Divider
                                            sx={{
                                                my: 0.9,
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? 'rgba(255,255,255,0.08)'
                                                        : 'rgba(0,0,0,0.08)',
                                                mx: 1,
                                            }}
                                        />
                                    )
                                }
                            </Box>
                        </SwipeableListItem>
                    );
                })}
            </SwipeableList>
            <Toaster limit={3} />
        </>
    );
};

export default MobileStockTable;

// remark
// date
// 