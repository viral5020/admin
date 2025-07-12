import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Divider,
    IconButton,
    Paper,
    createTheme,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { position } from 'stylis';

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
    // width: '100%',   
    // height: 'calc(100% + 1rem)',
    height: '3.5rem',
    opacity: '0.9',
    position: 'relative',
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
    position: 'absolute',
    top: row2Top,
    left: '4px'
}

const headerBgCss = {
    width: '104.5%',
    height: '1.2rem',
    // backgroundColor: '#5d6d6e44',
    backgroundColor: '#3551533d',
    position: 'relative',
    left: '-9px',
    borderRadius: '10px 10px 0 0'
}

const MobileStockTable = ({ searchText, isStockOpen, setIsStockOpen, watchList, isDarkMode, onToggleFavorite, favorites }) => {
    const [spacing, setSpacing] = useState({ fontSize: '1rem' });
    const [isSmallMobile, setIsSmallMobile] = useState();
    const [textColor, setTextColor] = useState('');
    const [boxStyle, setBoxStyle] = useState(boxCss);
    // const [headerBoxStyle, setHeaderBoxStyle] = useState(headerBgCss);

    useEffect(() => {
        isDarkMode ? setTextColor('#e0e0e0') : setTextColor('#1f1f1f');
        // setHeaderBoxStyle(prev => ({ ...prev, backgroundColor: isDarkMode ? '#8383833d' : '#3551533d'}))
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
                width: '5.5rem',
                px: '0.17rem',
            }))
        } else if (window.innerWidth < 440) {
            setSpacing(prev => ({
                ...prev,
                width: '5.8rem',
                px: '0.34rem',
            }))
        } else {
            setSpacing(prev => ({
                ...prev,
                width: '6.5rem',
                px: '0.44rem',
                fontWeight: 600,
            }))
        }

        window.innerWidth < 405 ? setIsSmallMobile(true) : setIsSmallMobile(false);
    }

    useEffect(() => {
        setSpace();
        window.addEventListener('resize', setSpace); // 👂 add listener
        // requestAnimationFrame(() => {
        //     setTimeout(() => {
        //         setWrapStatus();
        //     }, [2000])
        // })

        return () => {
            window.removeEventListener('resize', setSpace); // 🧹 cleanup
        };
    }, [])

    useEffect(() => {
        setBoxStyle(prev => ({ ...prev, px: spacing.px }))
    }, [spacing])

    return (
        <Box>
            {watchList.map((stock, idx) => {
                const isUp = stock.priceChange > 0;
                const color = isDarkMode
                    ? isUp ? '#26a69a' : '#ef6d61'
                    : isUp ? '#388055' : '#BB3536';

                const Icon = isUp ? ArrowDropUpIcon : ArrowDropDownIcon;

                if (stock.scriptName.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                    return false;
                }

                return (
                    <React.Fragment key={stock.id}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '5rem',
                                // border: '1px solid red',
                                position: 'relative',
                                px: 1
                            }}
                            onClick={() => setIsStockOpen(stock)}
                        >
                            <Box sx={headerBgCss}></Box>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                    position: 'absolute',
                                    top: '0rem',
                                    // left: '0rem'
                                }}
                            >
                                Q{stock.qty}
                            </Typography>

                            {isSmallMobile && <Typography
                                variant="body2"
                                sx={{
                                    color,
                                    display: 'inline',
                                    fontWeight: 600,
                                    position: 'absolute',
                                    top: '0rem',
                                    left: '3.3rem'
                                }}
                            >
                                {stock.ltp.toFixed(2)}
                            </Typography>}

                            {/* Logo */}
                            <Box sx={{
                                ...logoCss,
                                backgroundColor: isDarkMode ? '#777' : '#ccc',
                                color: isDarkMode ? '#fff' : '#000'
                            }}
                            >
                                {stock.scriptName[0]}
                            </Box>

                            <Stack
                                direction="column"
                                justifyContent="space-between"
                                alignItems="left"
                                sx={{
                                    position: 'absolute',
                                    left: '2.5rem',
                                    top: row2Top,
                                }}>
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    sx={{ color: textColor, lineHeight: '1rem' }}
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

                            <Box sx={{ position: 'absolute', bottom: '0rem', left: '4px' }}>
                                <Box sx={{ position: 'relative', left: '1.9rem' }}>
                                    <Icon style={{ color, position: 'absolute', fontSize: '1.8rem', left: '-2.2rem', top: '-2px' }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: 'inline',
                                            fontSize: '0.83rem',
                                            fontWeight: 500,
                                            position: 'relative',
                                            left: '-0.8rem'
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
                                            position: 'relative',
                                            left: '-0.8rem'
                                        }}
                                    >
                                        {stock.ltp.toFixed(2)}
                                    </Typography>}
                                </Box>
                            </Box>

                            {/** 2nd column */}
                            <Stack direction='row' gap={0}
                                sx={{
                                    position: 'absolute',
                                    right: '4px',
                                    top: '0rem',
                                }}>
                                <Stack
                                    direction="column"
                                    justifyContent="space-between"
                                    alignItems="left"
                                    sx={{
                                        width: spacing.width,
                                    }}
                                >
                                    <Typography
                                        fontSize={'0.825rem'}
                                    >
                                        O: {stock.open}
                                        {/* H: {stock.high} */}
                                    </Typography>

                                    <Box
                                        sx={{ ...boxStyle, backgroundColor: color, textAlign: 'center' }}
                                    // ref={(el) => (bidBoxRef.current[idx] = el)} // assign ref dynamically
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, fontSize: spacing.fontSize }}
                                            pt={0.8}
                                        >
                                            {stock.bidRate}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontSize='0.8rem'
                                            fontWeight='600'
                                        >
                                            H: {stock.high}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack
                                    direction="column"
                                    justifyContent="space-between"
                                    alignItems="left"
                                    sx={{
                                        width: spacing.width,
                                    }}
                                >
                                    <Typography
                                        fontSize={'0.825rem'}
                                    >
                                        C: {stock.close}
                                        {/* L: {stock.low} */}
                                    </Typography>

                                    <Box
                                        sx={{ ...boxStyle, backgroundColor: color, textAlign: 'center' }}
                                    // ref={(el) => (askBoxRef.current[idx] = el)} // assign ref dynamically
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 700, fontSize: spacing.fontSize }}
                                            textAlign={'center'}
                                            pt={0.8}
                                        >
                                            {stock.askRate}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            fontSize='0.8rem'
                                            fontWeight='600'
                                            textAlign={'center'}
                                        >
                                            L: {stock.low}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Divider */}
                        {
                            idx !== watchList.length - 1 && (
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
                    </React.Fragment>
                );
            })}
        </Box >
    );
};

export default MobileStockTable;


/*
- scriptName
- Qty
- Date

- LTP
- price change / %

- bid/ask

- open/close
- high/low
*/