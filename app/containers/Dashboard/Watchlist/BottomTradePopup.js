import React, { useEffect, useState } from 'react';
import {
    Drawer, Box, Typography, Grid, RadioGroup, FormControlLabel,
    Radio, TextField, MenuItem, Button, Divider,
    Avatar, IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { tradePlaceAPI } from '../API/API';

const marketOptions = ['NSE', 'BSE', 'MCX'];

const TabPanel = ({ children, value, index }) => {
    if (value !== index) return null;
    return (
        <Box sx={{ p: 2 }}>
            <Typography>{children}</Typography>
        </Box>
    );
};

function getTabIndex(val) {
    return val === 'bid' ? 0 : 1;
}

const BottomTradePopup = ({ open, onClose, stockData = {} }) => {
    const [tradeType, setTradeType] = useState('BUY');
    const [market, setMarket] = useState(marketOptions[0]);
    const [lot, setLot] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');
    const [isAllRequired, setIsAllRequired] = useState();

    const [tabIndex, setTabIndex] = useState(getTabIndex(stockData?.field));

    const handleChange = (_, newValue) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        console.log('&&& stockData', stockData);
        setTabIndex(getTabIndex(stockData?.field));
    }, [stockData])

    const isBuy = tabIndex === 0;

    const Icon = true ? ArrowDropUpIcon : ArrowDropDownIcon;

    function isValuesValidate() {
        if (market === '' || lot === '' || qty === '' || price === '') {
            setIsAllRequired(true);
            return false;
        } else {
            setIsAllRequired(false);
            return true;
        }
    }

    async function handleSubmit() {
        if (!isValuesValidate()) return;
        try {
            console.log('isBuy', isBuy);
            console.log('{market,lot,qty,price}', { market, lot, qty, price })
            const response = await tradePlaceAPI({ ...stockData, market, lot, qty, price, tradeType: tabIndex });
            // const response = await apiFunc({market,lot,qty,price})
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    width: 600,
                    mx: 'auto',
                    mb: 0,
                    // border: '5px solid #d32f2f'
                }
            }}
        >
            <Box p={3} pb={0}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
                        <Avatar
                            alt={stockData?.scriptName}
                            src="/path-to-your-logo.png"
                            variant="square"
                            sx={{ width: 35, height: 35, mr: 1, flexShrink: 0, borderRadius: 1 }}
                        />
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            // dangerouslySetInnerHTML={{ __html: selectedRow?.script_name }}
                            sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >{stockData?.scriptName || 'SCRIPT NAME'}</Typography>
                    </Box>
                    <IconButton size="large" onClick={onClose}>
                        <ArrowDropDownIcon />
                    </IconButton>
                </Box>
                {/* Script Title */}
                {/* <Typography variant="h6" align="center" gutterBottom>
                    {stockData?.scriptName || 'SCRIPT NAME'}
                </Typography> */}

                {/* Bid / Ask / LTP */}
                {/* <Grid container spacing={0} justifyContent="space-between">
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Bid</Typography>
                        <Typography color="success.main" fontWeight="bold">{stockData?.bid}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">Ask</Typography>
                        <Typography color="error.main" fontWeight="bold">{stockData?.ask}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2">LTP</Typography>
                        <Typography fontWeight="bold">{stockData?.ltp}</Typography>
                    </Grid>
                </Grid> */}

                {/* Change / % */}
                {/* <Grid container spacing={0} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2">Change</Typography>
                        <Typography color={stockData?.change >= 0 ? 'success.main' : 'error.main'}>
                            {stockData?.change}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle2">Change %</Typography>
                        <Typography color={stockData?.changePercent >= 0 ? 'success.main' : 'error.main'}>
                            {stockData?.changePercent}%
                        </Typography>
                    </Grid>
                </Grid> */}
                {/* <Grid container spacing={0} justifyContent="space-between">
                    <Grid item xs={2.5}>
                        <Typography variant="subtitle2">Bid</Typography>
                        <Typography color="success.main" fontWeight="bold">{stockData?.bid}</Typography>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Typography variant="subtitle2">Ask</Typography>
                        <Typography color="error.main" fontWeight="bold">{stockData?.ask}</Typography>
                    </Grid>
                    <Grid item xs={2.5}>
                        <Typography variant="subtitle2">LTP</Typography>
                        <Typography fontWeight="bold">{stockData?.ltp}</Typography>
                    </Grid>

                </Grid> */}

                <Grid container spacing={1} justifyContent="space-between">
                    <Grid item xs={4}>
                        <Box display="flex" alignItems="center" justifyContent="left" gap={1.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2, alignSelf: 'flex-end' }}>Bid</Typography> {/* this should bottom */}
                            <Typography variant="h6" >
                                {stockData?.bidRate}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box display="flex" alignItems="center" justifyContent="left" gap={1.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2, alignSelf: 'flex-end' }}>Ask</Typography>
                            <Typography variant="h6" >
                                {stockData?.askRate}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box display="flex" alignItems="center" justifyContent="left" gap={1.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2, alignSelf: 'flex-end' }}>LTP</Typography>
                            <Typography variant="h6">
                                {stockData?.ltp}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>


                {/* OHLC */}
                <Grid container spacing={1} mt={1}>
                    <Grid item xs={2}>
                        <Typography variant="subtitle2">Change</Typography>
                        <Typography color={stockData?.change >= 0 ? 'success.main' : 'error.main'}>
                            {stockData?.priceChange}
                        </Typography>
                    </Grid>
                    <Grid item xs={2.2}>
                        <Typography variant="subtitle2">Change %</Typography>
                        <Typography color={stockData?.changePercent >= 0 ? 'success.main' : 'error.main'}>
                            <Icon />{stockData?.priceChangePercent}%
                        </Typography>
                    </Grid>
                    <Grid item xs={1.9}>
                        <Typography variant="subtitle2">Open</Typography>
                        <Typography>{stockData?.open}</Typography>
                    </Grid>
                    <Grid item xs={1.9}>
                        <Typography variant="subtitle2">Close</Typography>
                        <Typography>{stockData?.close}</Typography>
                    </Grid>
                    <Grid item xs={1.9}>
                        <Typography variant="subtitle2">High</Typography>
                        <Typography>{stockData?.high}</Typography>
                    </Grid>
                    <Grid item xs={1.9}>
                        <Typography variant="subtitle2">Low</Typography>
                        <Typography>{stockData?.low}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Buy/Sell Radio */}
                <Box sx={{ mx: 'auto', mt: 0 }}>
                    {/* Tabs Header */}
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        // centered
                        TabIndicatorProps={{ style: { display: 'none' } }} // hide underline
                        sx={{ borderRadius: '0px' }}
                    >
                        <Tab
                            label="Buy"
                            sx={{
                                color: isBuy ? 'green' : 'gray',
                                // color: 'red',
                                fontWeight: 600,
                                border: isBuy ? '3px solid green' : '1px solid #ccc',
                                borderBottom: isBuy ? 'none' : '3px solid red',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                // borderBottomRightRadius: 8,
                                // borderBottomLeftRadius: 8,
                                // backgroundColor: isBuy ? 'green' : 'transparent',
                                minWidth: 100,
                                // mx: 1,
                                '&.Mui-selected': {
                                    color: 'green', // Active tab font color
                                    // color: 'white', // Active tab font color
                                },
                            }}
                        />
                        <Tab
                            label="Sell"
                            sx={{
                                color: !isBuy ? 'red' : 'gray',
                                fontWeight: 600,
                                border: !isBuy ? '3px solid red' : '1px solid #ccc',
                                borderBottom: !isBuy ? 'none' : '3px solid green',
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                // borderBottomRightRadius: 8,
                                // borderBottomLeftRadius: 8,
                                // backgroundColor: !isBuy ? 'red' : 'transparent',
                                minWidth: 100,
                                // mx: 1,
                                '&.Mui-selected': {
                                    color: 'red', // Active tab font color
                                    // color: 'white', // Active tab font color
                                },

                            }}
                        />
                        <Tab
                            label=""
                            sx={{
                                width: '100%',
                                borderBottom: !isBuy ? '3px solid red' : '3px solid green',
                                minWidth: 100,
                                '&.Mui-disabled': {
                                    opacity: 1,
                                },
                            }}
                            disabled // this should not reduct opacity of tab
                        />
                    </Tabs>

                    {/* Content Box */}
                    <Box
                        sx={{
                            border: `3px solid ${isBuy ? 'green' : 'red'}`,
                            borderTop: 'none',
                            // borderBottomWidth: '4px',
                            // borderBottomLeftRadius: 8,
                            // borderBottomRightRadius: 8,
                            p: 2,
                            // pb: 0,
                            // backgroundColor: isBuy ? '#e8f5e9' : '#ffebee',
                        }}
                    >
                        {/* Market Dropdown */}
                        <TextField
                            select
                            label="Market"
                            fullWidth
                            margin="dense"
                            value={market}
                            onChange={(e) => setMarket(e.target.value)}
                            required
                        >
                            {marketOptions.map(opt => (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Inputs: Lot, Qty, Price */}
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={4}>
                                <TextField
                                    label="Lot"
                                    type="number"
                                    value={lot}
                                    onChange={(e) => setLot(e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Qty"
                                    type="number"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    label="Price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Grid>
                        </Grid>

                        {/* Submit / Cancel */}
                        <Grid container spacing={3} mt={1} sx={{ position: 'relative' }}>
                            {isAllRequired && <Typography sx={{
                                color: 'red',
                                position: 'absolute',
                                left: '30px',
                                top: '-3px',
                                fontWeight: 600,
                                fontSize: '0.94rem'
                            }}>* All Fields Required.</Typography>}
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    color={isBuy ? 'success' : 'error'}
                                    onClick={() => handleSubmit()}
                                // sx={{
                                //     borderBottomLeftRadius: 0,
                                //     borderBottomRightRadius: 0,
                                // }}
                                >
                                    {isBuy ? 'Buy' : 'Sell'}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={onClose}
                                    sx={{
                                        borderColor: 'gray',
                                        color: 'gray',
                                        fontWeight: 600,
                                        // borderBottomLeftRadius: 0,
                                        // borderBottomRightRadius: 0,
                                        '&:hover': {
                                            borderColor: 'gray',
                                            backgroundColor: '#f5f5f5', // light gray hover
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Drawer >
    );
};

export default BottomTradePopup;