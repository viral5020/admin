import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import Timescrptmarketfilter from '../filters/Timescrptmarketfilter';
import { getDefaultParams } from '../API/API';

const Timesettingfilter = ({ }) => {
    const theme = useTheme();

    const [market, setMarket] = useState('');
    const [script, setScript] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [isNseMarket, setIsNseMarket] = useState(false);
    const [isGlobalFutMarket, setisGlobalFutMarket] = useState(false);

    // ✅ Only GLOBAL FUTURES needs script selection
    useEffect(() => {
        setIsNseMarket(market?.text?.toUpperCase() === 'NSEFUT' || market?.text?.toUpperCase() === 'NSEOPT');
        setisGlobalFutMarket(market?.text?.toUpperCase() === 'GLOBAL FUTURES');
    }, [market]);


    const handleAdd = async () => {
        if (!market) {
            toast.warning('Please select a market.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!isNseMarket && !script) {
            toast.warning('Please select a script.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!startTime || !endTime) {
            toast.warning('Please select both start and end time.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const defaultParams = await getDefaultParams();

        const payload = {
            ...defaultParams,
            market_type_id: market?.id ?? market,
            script_id: isNseMarket ? 'All' : script?.id ?? script,
            start_time: startTime,
            end_time: endTime,
        };

        console.log('Add Payload:', payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/set_start_end_time_market',
                payload
            );
            console.log('API Response:', response.data);

            if (response.data.status === 'ok') {
                toast.success('Time added successfully!', { containerId: "1234" });
                handleClear();
            } else {
                toast.error(response.data.message || 'Failed to add time. Please try again.', { containerId: "1234" });
            }
        } catch (error) {
            console.error('Error adding Time:', error);
            toast.error('An error occurred while adding time.', { containerId: "1234" });
        }
    };

    // ✅ Clear function
    const handleClear = () => {
        setMarket(null);
        setScript(null);
        setStartTime('');
        setEndTime('');
    };


    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }} alignItems="center" justifyContent="flex-start">
                {/* Market & Script Filter */}
                <Timescrptmarketfilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                    showMarket={true}
                    showScript={!isNseMarket}
                    isGlobalFutMarket={isGlobalFutMarket}
                />

                {/* Start Time Input */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="Start Time"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                    />
                </Grid>

                {/* End Time Input */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="End Time"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                    />
                </Grid>

                {/* Add Button */}
                <Grid item xs={6} sm={3} md={2} lg={2}>
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

                {/* Clear Button */}
                <Grid item xs={6} sm={3} md={2} lg={2}>
                    <Button
                        fullWidth
                        onClick={handleClear}
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark,
                            },
                        }}
                    >
                        Clear
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer containerId="1234" />
        </>
    );
};

export default Timesettingfilter;
