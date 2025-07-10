import React, { useState } from 'react';
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
import MiniLineChart from '../../containers/Dashboard/MiniLineChart';

const soloTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            mobile: 480,
            // tablet: 768,
            // laptop: 1024,
            // desktop: 1280,
            // xl: 1536,
        },
    },
})

function splitScriptAndDate(fullText) {
    const parts = fullText.trim().split(' ');
    if (parts.length < 4) return { scriptName: fullText, date: '' };

    const date = parts.slice(-3).join(' ');
    const scriptName = parts.slice(0, -3).join(' ');

    return { scriptName, date };
}


const MobileStockTable = ({ searchText, isStockOpen, setIsStockOpen, watchList, isDarkMode, onToggleFavorite, favorites }) => {

    function apiSetFavrioute(e) {
        e.stopPropagation();
        console.log('inside apiSetFavrioute');
    }

    return (
        <Box>
            {watchList.map((stock, idx) => {
                const isUp = stock.priceChange > 0;
                const color = isDarkMode
                    ? isUp ? '#26a69a' : '#ef6d61'
                    : isUp ? '#388055' : '#BB3536';

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
                            <Stack spacing={0} alignItems="center">
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

                                {/* Star */}
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(stock.id);
                                    }}
                                    sx={{ mt: 0 }}  // is it applicable
                                >
                                    {stock.isFavorite ? (
                                        <StarIcon sx={{ color: '#fdd835', mt: 0 }} />
                                    ) : (
                                        <StarBorderIcon sx={{ color: isDarkMode ? '#aaa' : '#666', mt: 0 }} />
                                    )}
                                </IconButton>
                            </Stack>
                            
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0, width: '100%' }} gap={2}>
                                {/** 2nd column */}
                                <Stack direction="column" justifyContent="space-between" alignItems="left" >
                                    <Stack direction="row" justifyContent="space-between" alignItems="" sx={{ width: '30vw', gap: 1 }} >
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={600}
                                            sx={{ color: textColor }}
                                        >
                                            {splitScriptAndDate(stock.scriptName).scriptName}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontWeight={500}
                                            // fontSize={15}
                                            sx={{ color: textColor }}
                                        >
                                            {stock.qty}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: textColor, fontSize: '0.85rem' }}
                                    >
                                        {splitScriptAndDate(stock.scriptName).date}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color,
                                            fontWeight: 550,
                                            // fontSize: '0.9rem',
                                        }}
                                    >
                                        {stock.priceChange.toFixed(2)}  ({stock.priceChangePercent.toFixed(2)}%){' '}
                                        {stock.ltp.toFixed(2)}
                                        {/* {stock.priceChange > 0 ? '+' : ''} */}
                                    </Typography>
                                </Stack>

                                {/** 3rd column */}
                                <Stack direction="column" justifyContent="space-between" alignItems="left" >
                                    <Typography
                                        variant="body1"
                                        sx={{ color, fontWeight: 700 }}
                                        textAlign={'right'}
                                    >
                                        {stock.bidRate} / {stock.askRate}
                                    </Typography>
                                    <Stack direction="row" justifyContent="space-between" alignItems="left" sx={{ width: '9rem', gap: 0.7 }}>
                                        <Stack direction="column" justifyContent="space-between" alignItems="left">
                                            <Typography
                                                variant="body2"
                                                sx={{ color: textColor }}
                                            >
                                                H: {stock.high}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: textColor }}
                                            >
                                                O: {stock.open}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="column" justifyContent="space-between" alignItems="left">
                                            <Typography
                                                variant="body2"
                                                sx={{ color: textColor }}
                                            >
                                                L: {stock.low}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: textColor }}
                                            >
                                                C: {stock.close}
                                            </Typography>
                                        </Stack>
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