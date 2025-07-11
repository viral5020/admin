import React, { useEffect, useState } from 'react';
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

function splitScriptAndDate(fullText) {
    const parts = fullText.trim().split(' ');
    if (parts.length < 4) return { scriptName: fullText, date: '' };

    const date = parts.slice(-3).join(' ');
    const scriptName = parts.slice(0, -3).join(' ');

    return { scriptName, date };
}


const MobileStockTable = ({ searchText, isStockOpen, setIsStockOpen, watchList, isDarkMode, onToggleFavorite, favorites }) => {
    const [boxStyle, setBoxStyle] = useState();
    const [spacing, setSpacing] = useState({});

    function apiSetFavrioute(e) {
        e.stopPropagation();
        console.log('inside apiSetFavrioute');
    }

    useEffect(() => {
        if (window.innerWidth < 370) {
            setSpacing({
                gap: '1vw',
                width: '4.6rem',
                px: '0.15rem'
            })
        } else if (window.innerWidth < 405) {
            setSpacing({
                gap: '2vw',
                width: '4.8rem',
                px: '0.2rem'
            })
        } else {
            setSpacing({
                gap: '3vw',
                width: '5.5rem',
                px: '0.4rem'
            })
        }
    }, [])

    useEffect(() => {
        setBoxStyle({
            borderRadius: '10%',
            px: spacing.px,
            py: 0,
            color: 'white',
            width: '100%',
            opacity: '0.9'
        })
    }, [spacing])

    return (
        <Box>
            {watchList.map((stock, idx) => {
                const isUp = stock.priceChange > 0;
                const color = isDarkMode
                    ? isUp ? '#26a69a' : '#ef6d61'
                    : isUp ? '#388055' : '#BB3536';

                // setBoxStyle(prev => ({ ...prev, backgroundColor: color }))

                const textColor = isDarkMode ? '#e0e0e0' : '#1f1f1f';
                const Icon = isUp ? ArrowDropUpIcon : ArrowDropDownIcon;

                if (stock.scriptName.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                    return false;
                }

                return (
                    <React.Fragment key={stock.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                px: 0.8,
                                py: 0.3,
                                alignItems: 'center',
                                gap: 0.9,
                            }}
                            onClick={() => setIsStockOpen(stock)}
                        >
                            {/* Logo & Star Section */}
                            <Stack alignItems="flex-start" direction='column'>
                                {/* Logo */}
                                <Box
                                    sx={{
                                        width: '2.2rem',
                                        height: '2.2rem',
                                        borderRadius: '10%',
                                        backgroundColor: isDarkMode ? '#777' : '#ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        color: isDarkMode ? '#fff' : '#000',
                                    }}
                                >
                                    {stock.scriptName[0]}
                                </Box>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0, width: '100%' }} gap={2}>
                                {/** 1st column */}
                                <Stack direction="column" justifyContent="space-between" alignItems="left" >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color,
                                            fontWeight: 550,
                                            // fontSize: '0.9rem',
                                        }}
                                    >
                                        {stock.priceChange.toFixed(2)}  ({stock.priceChangePercent.toFixed(2)}%){' '}
                                    </Typography>

                                    <Stack direction="row" justifyContent="space-between" alignItems="" sx={{ width: '30vw', gap: 1 }} >
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            sx={{ color: textColor, lineHeight: '1rem' }}
                                        >
                                            {splitScriptAndDate(stock.scriptName).scriptName}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: textColor, fontSize: '0.85rem' }}
                                    >
                                        {splitScriptAndDate(stock.scriptName).date}
                                    </Typography>

                                    {/* <Stack direction='row' gap={1}>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: textColor }}
                                        >
                                            O: {stock.open}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: textColor }}
                                        >
                                            C: {stock.close}
                                        </Typography>
                                    </Stack> */}
                                </Stack>
                                {/** 2nd column */}
                                <Stack direction="row" justifyContent="space-between" alignItems="left" gap={spacing.gap}>
                                    <Stack direction="column" justifyContent="space-between" alignItems="left" sx={{ width: spacing.width }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                            sx={{ color: textColor }}
                                        >
                                            Q : {stock.qty}
                                        </Typography>

                                        <Box sx={{ ...boxStyle, backgroundColor: color }}>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 600 }}
                                                textAlign={'center'}
                                            >
                                                {stock.bidRate}
                                            </Typography>

                                            <Stack direction="column" justifyContent="space-between" alignItems="left">
                                                <Typography
                                                    variant="body2"
                                                >
                                                    H: {stock.high}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                >
                                                    O: {stock.open}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    <Stack direction="column" justifyContent="space-between" alignItems="left" sx={{ width: spacing.width }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="left">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color,
                                                    fontWeight: 550,
                                                    // fontSize: '0.9rem',
                                                }}
                                            >
                                                {stock.ltp.toFixed(2)}
                                            </Typography>

                                            {/* Star */}
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleFavorite(stock.id);
                                                }}
                                                sx={{ p: 0, pb: 0.5, position: 'relative', bottom: '3px' }}
                                            >
                                                {stock.isFavorite ? (
                                                    <StarIcon sx={{ color: '#fdd835' }} />
                                                ) : (
                                                    <StarBorderIcon sx={{ color: isDarkMode ? '#aaa' : '#666' }} />
                                                )}
                                            </IconButton>
                                        </Stack>

                                        <Box sx={{ ...boxStyle, backgroundColor: color }}>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 700 }}
                                                textAlign={'center'}
                                            >
                                                {stock.bidRate}
                                            </Typography>
                                            <Stack direction="row" justifyContent="space-between" alignItems="left" sx={{ gap: 0.7 }}>
                                                <Stack direction="column" justifyContent="space-between" alignItems="left">
                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        L: {stock.low}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        C: {stock.close}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Divider */}
                        {
                            idx !== watchList.length - 1 && (
                                <Divider
                                    sx={{
                                        my: 0.8,
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