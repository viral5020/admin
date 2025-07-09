import React from 'react';
import {
    Box,
    Typography,
    Divider,
    useTheme,
    Grid,
    Paper,
    IconButton,
    Slide,
    AppBar,
    Button,
    Toolbar,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ApexCharts from './Apexcharts'; // Adjust path to your actual component

const StockDetailMobile = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();
    const location = useLocation();
    const isStockOpen = location.state?.stock;

    if (!isStockOpen) {
        return <Typography variant="body1" sx={{ p: 2 }}>No stock data available</Typography>;
    }

    const { scriptName, exchange, open, close, high, low, bidRate, askRate, ltp, priceChange, priceChangePercent, qty, maxOrder, position, lastChangedAt } = isStockOpen;

    console.log('priceChange > 0', priceChange > 0)
    const isUp = priceChange > 0;
    // const priceColor = isUp ? '#00b894' : '#e17055';
    const icon = isUp ? <ArrowDropUpIcon fontSize="small" /> : <ArrowDropDownIcon fontSize="small" />;
    const color = isDarkMode
        ? isUp ? '#26a69a' : '#ef6d61'
        : isUp ? '#388055' : '#BB3536';

    return (
        <Slide direction="up" in mountOnEnter unmountOnExit>
            <Box sx={{ overflowY: 'auto', bgcolor: theme.palette.background.default, scrollbarWidth: 'none' }}>
                <AppBar
                    position="fixed"
                    color="default"
                    sx={{
                        top: '56px',
                        zIndex: (theme) => theme.zIndex.appBar + 1,
                        p: 1,
                    }}
                >
                    <Toolbar sx={{ minHeight: '48px', px: 1 }}>
                        <IconButton onClick={() => navigate(-1)} edge="start" size="small">
                            <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>

                        <Box ml={1} flexGrow={1}>
                            <Typography variant="subtitle1" fontWeight={700} lineHeight={1}>
                                {scriptName}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ opacity: 0.8 }}
                            >
                                {exchange}
                            </Typography>
                        </Box>

                        {/* LTP and Change info */}
                        <Box textAlign="right">
                            <Typography
                                variant="subtitle1"
                                fontWeight={550}
                                lineHeight={1}
                                color={color}
                            >
                                ₹{ltp.toFixed(2)} {icon}
                            </Typography>
                            <Typography variant="body2" fontWeight={500} color={color}>
                                {priceChange > 0 ? '+' : ''}
                                {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Chart */}
                <Paper elevation={2} sx={{ m: 2, mt: '60px', p: 0, borderRadius: 3 }}>
                    <ApexCharts
                        name={scriptName}
                        data={generateCandleData()}
                        theme={theme}
                    />
                </Paper>

                <Divider sx={{ mx: 2, mb: 2 }} />

                {/* Stats */}
                <Grid container spacing={1} px={2}>
                    {[
                        { label: 'Open', value: open },
                        { label: 'Close', value: close },
                        { label: 'High', value: high },
                        { label: 'Low', value: low },
                        { label: 'Bid', value: bidRate },
                        { label: 'Ask', value: askRate },
                        { label: 'Qty', value: qty },
                        { label: 'Max Order', value: maxOrder },
                        { label: 'Position', value: position },
                        { label: 'Updated At', value: lastChangedAt },
                    ].map(({ label, value }) => (
                        <Grid item xs={6} key={label}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 1.2,
                                    borderRadius: 2,
                                    backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color={isDarkMode ? '#bbb' : '#666'}
                                    fontWeight={500}
                                >
                                    {label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color={isDarkMode ? 'white' : 'black'}
                                >
                                    {typeof value === 'number' ? `₹${value}` : value}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Buy Sell Btn */}
                <Box
                    sx={{
                        position: 'fixed',          // <— fixed to viewport
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        px: 2,
                        py: 1.3,
                        zIndex: 1400,              // ensure it's above everything
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#00b894', // Buy color
                            color: '#fff',
                            py: 1,
                            mr: 1,
                            '&:hover': {
                                backgroundColor: '#00a36c',
                            },
                        }}
                    >
                        Buy
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#d63031', // Sell color
                            color: '#fff',
                            py: 1,
                            ml: 1,
                            '&:hover': {
                                backgroundColor: '#c0392b',
                            },
                        }}
                    >
                        Sell
                    </Button>
                </Box>

                {/* Buy Sell Btn  */}
                <Box sx={{ visibility: 'hidden', width: '100%', px: 2, py: 1.5, }}>
                    <Button>xxx</Button>
                    <Button>xxx</Button>
                </Box>
            </Box>
        </Slide>
    );
};

export default StockDetailMobile;

function generateCandleData() {
    return [
        {
            x: new Date(),
            y: [2840, 2850, 2810, 2829],
        },
    ];
}
