import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Divider,
    IconButton,
    Paper,
    createTheme,
    Button,
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
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './listAnimation.css'; // Animation styles

const obj = {
    "status": "ok",
    "cnbc": "https://www.youtube.com/embed/TD0A7fHAxKw",
    "scripts": [
        {
            "market_watch_id": "7883718",
            "market_type_id": "1",
            "market_type_name": "MCXFUT",
            "script_id": "1",
            "script_name": "GOLD",
            "script_expiry_id": "27256",
            "script_expiry_date": "2025-08-05",
            "script_expiry_type": "I",
            "script_lot_qty": "100",
            "script_expiry_orginal_format": "05AUG2025",
            "min_order": "0",
            "max_order": "10",
            "position_limit": "25",
            "quantity": 0
        },
        {
            "market_watch_id": "7895546",
            "market_type_id": "4",
            "market_type_name": "GLOBAL FUTURES",
            "script_id": "177",
            "script_name": "NASDAQ",
            "script_expiry_id": "27287",
            "script_expiry_date": "2025-09-19",
            "script_expiry_type": "I",
            "script_lot_qty": "70",
            "script_expiry_orginal_format": "19SEP2025",
            "min_order": "0",
            "max_order": "3750",
            "position_limit": "7500",
            "quantity": 0
        },
        {
            "market_watch_id": "7898735",
            "market_type_id": "4",
            "market_type_name": "GLOBAL FUTURES",
            "script_id": "176",
            "script_name": "S&P 500",
            "script_expiry_id": "27288",
            "script_expiry_date": "2025-09-19",
            "script_expiry_type": "I",
            "script_lot_qty": "250",
            "script_expiry_orginal_format": "19SEP2025",
            "min_order": "0",
            "max_order": "9600",
            "position_limit": "19200",
            "quantity": 0
        },
        {
            "market_watch_id": "7906972",
            "market_type_id": "2",
            "market_type_name": "NSEFUT",
            "script_id": "3",
            "script_name": "NIFTY",
            "script_expiry_id": "27297",
            "script_expiry_date": "2025-07-31",
            "script_expiry_type": "I",
            "script_lot_qty": "75",
            "script_expiry_orginal_format": "31JUL2025",
            "min_order": "0",
            "max_order": "2000",
            "position_limit": "4000",
            "quantity": 0
        },
        {
            "market_watch_id": "7906973",
            "market_type_id": "2",
            "market_type_name": "NSEFUT",
            "script_id": "4",
            "script_name": "BANKNIFTY",
            "script_expiry_id": "27298",
            "script_expiry_date": "2025-07-31",
            "script_expiry_type": "I",
            "script_lot_qty": "35",
            "script_expiry_orginal_format": "31JUL2025",
            "min_order": "0",
            "max_order": "1000",
            "position_limit": "2000",
            "quantity": 0
        },
        {
            "market_watch_id": "7906998",
            "market_type_id": "4",
            "market_type_name": "GLOBAL FUTURES",
            "script_id": "1189",
            "script_name": "GIFT NIFTY",
            "script_expiry_id": "27743",
            "script_expiry_date": "2025-07-31",
            "script_expiry_type": "I",
            "script_lot_qty": "50",
            "script_expiry_orginal_format": "31JUL2025",
            "min_order": "0",
            "max_order": "1500",
            "position_limit": "3000",
            "quantity": 0
        },
        {
            "market_watch_id": "7909598",
            "market_type_id": "1",
            "market_type_name": "MCXFUT",
            "script_id": "2",
            "script_name": "SILVER",
            "script_expiry_id": "27745",
            "script_expiry_date": "2025-09-05",
            "script_expiry_type": "I",
            "script_lot_qty": "30",
            "script_expiry_orginal_format": "05SEP2025",
            "min_order": "1",
            "max_order": "5",
            "position_limit": "15",
            "quantity": 0
        },
        {
            "market_watch_id": "7914156",
            "market_type_id": "4",
            "market_type_name": "GLOBAL FUTURES",
            "script_id": "175",
            "script_name": "DOW JONES 30",
            "script_expiry_id": "27286",
            "script_expiry_date": "2025-09-19",
            "script_expiry_type": "I",
            "script_lot_qty": "30",
            "script_expiry_orginal_format": "19SEP2025",
            "min_order": "0",
            "max_order": "1750",
            "position_limit": "3500",
            "quantity": 0
        }
    ]
}

function splitScriptAndDate(fullText) {
    const parts = fullText.trim().split(' ');
    if (parts.length < 4) return { scriptName: fullText, date: '' };

    const date = parts.slice(-3).join(' ');
    const scriptName = parts.slice(0, -3).join(' ');

    return { scriptName, date };
}


const row2Top = '1.6rem';
const row3Top = '';

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
    // wordBreak: 'break-word',
    // whiteSpace: 'normal',
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
    // width: '104.5%',
    // height: '1.2rem',
    // backgroundColor: '#5d6d6e44',
    backgroundColor: '#3551533d',
    // position: 'relative',
    // left: '-9px',
    borderRadius: '10px 10px 0 0',
    px: '0.4rem'
}

const MobileStockDesignWithRemove = ({ searchText, isStockOpen, setIsStockOpen, dummyData, isDarkMode, onToggleFavorite, favorites, setDummyData }) => {
    const [spacing, setSpacing] = useState({ fontSize: '0.95rem' });
    const [isSmallMobile, setIsSmallMobile] = useState();
    const [textColor, setTextColor] = useState('');
    const [boxStyle, setBoxStyle] = useState(boxCss);
    const [headerBoxStyle, setHeaderBoxStyle] = useState(headerBgCss);

    const refs = useRef({});
    // const [openItem, setOpenItem] = useState(null);

    // const handleSwipeStart = (id) => {
    //     if (openItem && openItem !== id) {
    //         setOpenItem(null);
    //     }
    //     setOpenItem(id);
    // };

    // const handleAction = (id) => {
    //     // refs.current[id]?.close();
    //     setOpenItem(null);
    //     setTimeout(() => {
    //         setDummyData((prev) => prev.filter((item) => item.id !== id));
    //     }, 300);
    // };
    const [openItem, setOpenItem] = useState(null);

    const handleSwipeStart = (id) => {
        setOpenItem(id);
    };

    const handleAction = (id) => {
        setDummyData((prev) => prev.filter((item) => item.id !== id));
        setOpenItem(null);
    };



    // const removeItem = (id) => {
    //     setTimeout(() => {
    //         setDummyData((prev) => prev.filter((item) => item.id !== id));
    //     }, [500])
    // };

    const renderActions = (item) => ({
        leading: (
            <LeadingActions>
                <SwipeAction
                    destructive={true}
                    onClick={() => removeItem(item.id)}
                >
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            height: '100%',
                            borderRadius: 0,
                            minWidth: '80px',
                            fontSize: '0.85rem'
                        }}
                        onClick={() => handleAction(item.id)}
                    >
                        Remove
                    </Button>
                </SwipeAction >
            </LeadingActions >
        ),
        trailing: (
            <TrailingActions>
                <SwipeAction
                    destructive={true}
                    onClick={() => removeItem(item.id)}
                >
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            height: '100%',
                            borderRadius: 0,
                            minWidth: '80px',
                            fontSize: '0.85rem'
                        }}
                    >
                        Remove
                    </Button>
                </SwipeAction>
            </TrailingActions>
        )
    });

    useEffect(() => {
        isDarkMode ? setTextColor('#e0e0e0') : setTextColor('#1f1f1f');
        setHeaderBoxStyle(prev => ({ ...prev, backgroundColor: isDarkMode ? '#8383833d' : '#3551533d' }))
    }, [isDarkMode])

    useEffect(() => {
        setBoxStyle(prev => ({ ...prev, border: `1.7px solid ${textColor}` }))
    }, [textColor]);
    // const askBoxRef = useRef([]);
    // const bidBoxRef = useRef([]);
    // const [askWrapStatus, setAskWrapStatus] = useState([]);
    // const [bidWrapStatus, setBidWrapStatus] = useState([]);

    function apiSetFavrioute(e) {
        e.stopPropagation();
        console.log('inside apiSetFavrioute');
    }

    // const checkWrap = (el) => {
    //     // console.log('el.offsetHeight', el.offsetHeight)
    //     // // return el.offsetHeight;
    //     // console.log('el.scrollHeight', el.scrollHeight);
    //     // console.log('el.clientHeight', el.clientHeight);
    //     return el.scrollHeight > el.clientHeight;
    // };

    // function setWrapStatus() {
    //     const bid = bidBoxRef.current.map((el) => el && checkWrap(el));  // line: 86
    //     const ask = askBoxRef.current.map((el) => el && checkWrap(el));
    //     setBidWrapStatus(bid);
    //     setAskWrapStatus(ask);
    //     console.log('bid', bid);
    //     console.log('ask', ask)
    // }

    function setSpace() {
        // if (window.innerWidth < 385) {
        //     setSpacing(prev => ({
        //         ...prev,
        //         width: '5.5rem',
        //         px: '0.17rem'

        //     }))
        // } else 
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

    return (
        <SwipeableList type={ListType.IOS}>
            {/* <TransitionGroup component={null}> */}
            <Box>
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
                    const { leading, trailing } = renderActions(stock);
                    const isOpen = openItem === stock.id;

                    return (
                        <React.Fragment key={stock.id}>
                            {/* <CSSTransition
                                    key={stock.id}
                                    timeout={1000}
                                    classNames="fade-slide"
                                > */}
                            <SwipeableListItem
                                key={stock.id}
                                swipeLeft={{
                                    content: (
                                        openItem === stock.id ? (
                                            <SwipeAction destructive>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{
                                                        height: '100%',
                                                        borderRadius: 0,
                                                        minWidth: '80px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAction(stock.id);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </SwipeAction>
                                        ) : <Box sx={{ width: '80px' }} /> // keep spacing consistent
                                    ),
                                    action: () => setOpenItem(stock.id),
                                    keepOpen: true,
                                }}
                                swipeRight={{
                                    content: (
                                        openItem === stock.id ? (
                                            <SwipeAction destructive>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{
                                                        height: '100%',
                                                        borderRadius: 0,
                                                        minWidth: '80px',
                                                        fontSize: '0.85rem'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAction(stock.id);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </SwipeAction>
                                        ) : <Box sx={{ width: '80px' }} />
                                    ),
                                    action: () => setOpenItem(stock.id),
                                    keepOpen: true,
                                }}
                                onSwipeStart={() => handleSwipeStart(stock.id)}
                                onSwipeEnd={() => { }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        // height: '5rem',
                                        // border: '1px solid red',
                                        // position: 'relative',
                                        px: 0.2
                                    }}
                                    onClick={() => setIsStockOpen(stock)}
                                >
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
                                                // position: 'absolute',
                                                top: '0rem',
                                                // left: '3.3rem'
                                                width: '5rem'
                                            }}
                                        >
                                            {Number(stock.ltp.toFixed(2)).toLocaleString('en-IN')}
                                        </Typography>}

                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                            sx={{
                                                // position: 'absolute',
                                                // top: '0rem',
                                                // left: '0rem'
                                            }}
                                        >
                                            {isSmallMobile ? 'Q : ' : 'Qty : '}{stock.qty.toLocaleString('en-IN')}
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
                                                // ref={(el) => (bidBoxRef.current[idx] = el)} // assign ref dynamically
                                                >
                                                    <Typography
                                                        // variant="h6"
                                                        sx={{ fontWeight: 700, fontSize: spacing.fontSize }}
                                                        pt={0.6}
                                                    >
                                                        {stock.bidRate.toLocaleString('en-IN')}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        fontSize='0.75rem'
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
                                                // ref={(el) => (askBoxRef.current[idx] = el)} // assign ref dynamically
                                                >
                                                    <Typography
                                                        // variant="h6"
                                                        sx={{ fontWeight: 700, fontSize: spacing.fontSize }}
                                                        pt={0.6}
                                                    >
                                                        {stock.askRate.toLocaleString('en-IN')}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        fontSize='0.75rem'
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
                            {/* </CSSTransition> */}
                        </React.Fragment>
                    );
                })}
            </Box>
            {/* </TransitionGroup> */}
        </SwipeableList>
    );
};

export default MobileStockDesignWithRemove;
