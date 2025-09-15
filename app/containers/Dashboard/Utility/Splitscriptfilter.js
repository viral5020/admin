import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Grid,
    Button,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    useTheme,
} from '@mui/material';
import Addexpirymarketfilter from '../filters/addexpirymarketfilter';
import Splitscriptmarketfilter from '../filters/Splitscriptmarketfilter';

const Splitscriptfilter = ({
    setEnd1_date,
    setStart1_date,
    end1_date,
    start1_date,
    setIs_deleted,
    is_deleted,
    is_updated,
    setIs_updated,
    market,
    script,
    setScript,
    setMarket,
}) => {
    const theme = useTheme();
    const [splitDate, setSplitDate] = useState('');
    const [newTrade, setNewTrade] = useState('0'); // default No
    const [splitNumber, setSplitNumber] = useState(''); // split number field

    const isNseMarket =
        market?.text?.toUpperCase() === 'NSEFUT' ||
        market?.text?.toUpperCase() === 'NSEOPT';

    const handleAdd = async () => {
        if (!market) {
            toast.warning('Please select a market.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!isNseMarket && !script) {
            toast.warning('Please select a script.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!splitDate) {
            toast.warning('Please select a split date.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!splitNumber) {
            toast.warning('Please enter a split number.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: isNseMarket ? 'All' : script?.id ?? script,
            date: splitDate,
            split_number: splitNumber,
            new_trade: newTrade, // Yes=1, No=0
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        console.log('Add Payload:', payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/trade_split',
                payload
            );
            console.log('API Response:', response.data);

            if (response.data.success) {
                toast.success('Split data added successfully!', { position: 'top-right', autoClose: 3000 });

                // reset fields
                setStart1_date('');
                setEnd1_date('');
                setIs_updated(0);
                setIs_deleted(0);
                setMarket(null);
                setScript(null);
                setSplitDate('');
                setSplitNumber('');
                setNewTrade('0');
            } else {
                toast.error(response.data.message || 'Failed to add split data.', { position: 'top-right', autoClose: 3000 });
            }
        } catch (error) {
            console.error('Error adding Split Data:', error);
            toast.error('An error occurred while adding split data.', { position: 'top-right', autoClose: 3000 });
        }
    };

    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }} alignItems="center" justifyContent="flex-start">
                {/* Market & Script Filter */}
                <Splitscriptmarketfilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                    showMarket={true}
                    showScript={!isNseMarket}
                />

                {/* Split Date Input */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="Split Date"
                        type="date"
                        value={splitDate}
                        onChange={(e) => setSplitDate(e.target.value)}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Split Number Input */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="Split Number"
                        type="number"
                        value={splitNumber}
                        onChange={(e) => setSplitNumber(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* New Trade Radio Button */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <FormLabel component="legend">New Trade</FormLabel>
                    <RadioGroup
                        row
                        value={newTrade}
                        onChange={(e) => setNewTrade(e.target.value)}
                    >
                        <FormControlLabel value="1" control={<Radio />} label="Yes" />
                        <FormControlLabel value="0" control={<Radio />} label="No" />
                    </RadioGroup>
                </Grid>

                {/* Add Button */}
                <Grid item xs={12} sm={6} md={2} lg={2}>
                    <Button
                        fullWidth
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.dark,
                            },
                        }}
                    >
                        Add
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer />
        </>
    );
};

export default Splitscriptfilter;
