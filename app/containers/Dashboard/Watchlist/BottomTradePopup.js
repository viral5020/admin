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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { tradePlaceAPI } from '../API/API';
import ClientMasterBrokerFilter from '../filters/ClientMasterBrokerFilter';
import toast from 'react-hot-toast';
import { roundToTwoIN } from '../helpers/utilFunc';

const marketOptions = [
    { label: "market", value: 0 },
    { label: "lot", value: 1 },
    { label: "Stock Loss", value: 2 }
]

const BottomTradePopup = ({ open, onClose, stockData = {}, isMobile, tabIndex, setTabIndex }) => {
    const [tradeType, setTradeType] = useState('BUY');
    const [market, setMarket] = useState(marketOptions[0].value);
    const [lot, setLot] = useState('');
    const [qty, setQty] = useState('');
    const [price, setPrice] = useState('');
    const [isAllRequired, setIsAllRequired] = useState();
    const [client, setClient] = useState();


    const [userType, setUserType] = useState('');

    const handleChange = (_, newValue) => {
        setTabIndex(newValue);
    };

    function resetAllState() {
        setMarket(marketOptions[0].value);
        setLot('');
        setQty('');
        setPrice('');
        setIsAllRequired();
    }

    useEffect(() => {
        // console.log('&&& stockData', stockData);
        !!stockData && resetAllState()
        // : setTabIndex(getTabIndex(stockData?.field));
    }, [Boolean(stockData)])

    useEffect(() => {
        // console.log('&&& stockData', stockData);
        // setPrice(tabIndex)
    }, [stockData])

    useEffect(() => {
        // console.log('tabIndex', tabIndex);
        market == 0 && (tabIndex === 0 ? setPrice(stockData?.bidRate) : setPrice(stockData?.askRate));
    }, [tabIndex, stockData])

    const isBuy = tabIndex === 0;

    const Icon = stockData?.priceChange > 0 ? ArrowDropUpIcon : ArrowDropDownIcon;

    function isValuesValidate() {
        if (market === '' || lot === '' || qty === '' || (market != 0 && price === '')) {
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
            const response = await tradePlaceAPI({ ...stockData, market, lot, qty, price, tradeType: tabIndex, client });
            response.status === 'ok'
                ? toast.success(`Trade added successfullt for ${stockData?.scriptName} of Qty ${qty} at ${price}.`, { duration: 5000 })
                : toast.error(`${response.message}.`, { duration: 15000 });
            resetAllState();
        } catch (error) {
            console.log('error', error)
            toast.error(error.message || "Some error occured.");
        }
    }

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem('data'));
        setUserType(data.user_type);
    }, [])

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    width: isMobile ? '100%' : 600, // full width on mobile
                    mx: isMobile ? 0 : 'auto',
                    mb: 0,
                    maxHeight: isMobile ? '90vh' : '80vh', // make sure mobile view fits screen
                    overflowY: 'auto',
                }
            }}
        >
            <Box p={isMobile ? 2 : 3} pb={0}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: 'row', // stack on mobile
                        justifyContent: "space-between",
                        alignItems: isMobile ? "flex-start" : "center",
                        mb: 1,
                        gap: isMobile ? 1 : 0
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
                            variant={isMobile ? "subtitle1" : "h6"}
                            fontWeight={700}
                            sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                            {stockData?.scriptName || 'SCRIPT NAME'}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ p: 0 }}>
                        <KeyboardArrowDownIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
                    </IconButton>
                </Box>

                {/* Bid / Ask / LTP row */}
                <Grid container spacing={1} justifyContent="space-between">
                    <Grid item xs={isMobile ? 12 : 4}>
                        <Box display="flex" alignItems="center" justifyContent={isMobile ? "space-between" : "left"} gap={1.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2 }}>Bid</Typography>
                            <Typography variant="h6">{roundToTwoIN(stockData?.bidRate)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 4}>
                        <Box display="flex" alignItems="center" justifyContent={isMobile ? "space-between" : "left"} gap={1.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2 }}>Ask</Typography>
                            <Typography variant="h6">{roundToTwoIN(stockData?.askRate)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 4}>
                        <Box display="flex" alignItems="center" justifyContent={isMobile ? "space-between" : "left"} gap={1.5}>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2 }}>LTP</Typography>
                            <Typography variant="h6">{roundToTwoIN(stockData?.ltp)}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* %change change OHLC */}
                <Grid container spacing={1} mt={1}>
                    {[
                        { label: 'Change', value: roundToTwoIN(stockData?.priceChange), color: stockData?.change >= 0 ? 'success.main' : 'error.main' },
                        { label: 'Change %', value: <><Icon />{roundToTwoIN(stockData?.priceChangePercent)}%</>, color: stockData?.changePercent >= 0 ? 'success.main' : 'error.main' },
                        { label: 'Open', value: roundToTwoIN(stockData?.open) },
                        { label: 'Close', value: roundToTwoIN(stockData?.close) },
                        { label: 'High', value: roundToTwoIN(stockData?.high) },
                        { label: 'Low', value: roundToTwoIN(stockData?.low) },
                    ].map((item, index) => (
                        <Grid
                            item
                            xs={6}  // On mobile: 2 columns
                            sm={2}  // On desktop: original layout
                            key={index}
                        >
                            <Typography variant="subtitle2">{item.label}</Typography>
                            <Typography color={item.color ?? 'inherit'}>
                                {item.value}
                            </Typography>
                        </Grid>
                    ))}
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

                        <Grid container spacing={1}>
                            {/* Market Dropdown */}
                            <Grid item xs={6}>
                                <TextField
                                    select
                                    label="Market"
                                    fullWidth
                                    margin="dense"
                                    value={market}
                                    onChange={(e) => setMarket(e.target.value)}
                                    required
                                >
                                    {marketOptions.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {userType != 1 && userType != 2 &&
                                <Grid item xs={6} sx={{
                                    ".mui-style-ltr-fseu8t-MuiGrid-root": {
                                        maxWidth: "100%",
                                    },
                                    position: 'relative',
                                    top: '10px'
                                }}>
                                    <ClientMasterBrokerFilter
                                        client={client}
                                        setClient={setClient}
                                        showClient={true}
                                        showBroker={false}
                                        showMaster={false}
                                    />
                                </Grid>
                            }
                        </Grid>


                        {/* Inputs: Lot, Qty, Price */}
                        <Grid container spacing={2} mt={0}>
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
                                    disabled={market == 0}
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
        </Drawer>

    );
};

export default BottomTradePopup;