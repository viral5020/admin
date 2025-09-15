import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import Addexpirymarketfilter from '../filters/addexpirymarketfilter';
import Timescrptmarketfilter from '../filters/timescrptmarketfilter';

const Timesettingfilter = ({
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
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const isNseMarket =
        market?.text?.toUpperCase() === 'NSEFUT' ||
        market?.text?.toUpperCase() === 'NSEOPT';

    const handleAdd = async () => {
        // Validation
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

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: isNseMarket ? 'All' : script?.id ?? script,
            start_time: startTime,
            end_time: endTime,
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        console.log('Add Payload:', payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/set_start_end_time_market',
                payload
            );
            console.log('API Response:', response.data);

            if (response.data.success) {
                toast.success('Time added successfully!', { position: 'top-right', autoClose: 3000 });

                // Reset form
                setStart1_date('');
                setEnd1_date('');
                setIs_updated(0);
                setIs_deleted(0);
                setMarket(null);
                setScript(null);
                setStartTime('');
                setEndTime('');
            } else {
                toast.error(response.data.message || 'Failed to add time. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error adding Time:', error);
            toast.error('An error occurred while adding time.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
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
                        inputProps={{ step: 300 }} // 5 min steps
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

export default Timesettingfilter;
