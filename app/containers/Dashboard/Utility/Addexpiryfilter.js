import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import Addexpirymarketfilter from '../filters/Addexpirymarketfilter';



const Addexpiryfilter = ({
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
    const [expiryDate, setExpiryDate] = useState('');

    const isNseMarket =
        market?.text?.toUpperCase() === 'NSEFUT' ||
        market?.text?.toUpperCase() === 'NSEOPT';

    const handleAdd = async () => {
        // Validation
        if (!market) {
            toast.warning('Please select a market.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!isNseMarket && !script) {
            toast.warning('Please select a script.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        if (!expiryDate) {
            toast.warning('Please select an expiry date.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: isNseMarket ? 'All' : script?.id ?? script,
            expiry_date: expiryDate,
            is_app: 1,
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        console.log('Add Payload:', payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/add_script_expiry',
                payload
            );
            console.log('API Response:', response.data);

            if (response.data.success) {
                toast.success('Expiry date added successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });

                // Reset form
                setStart1_date('');
                setEnd1_date('');
                setIs_updated(0);
                setIs_deleted(0);
                setMarket(null);
                setScript(null);
                setExpiryDate('');
            } else {
                toast.error('Failed to add expiry date. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error adding Expiry Date:', error);
            toast.error('An error occurred while adding expiry date.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const handleClear = () => {
        setStart1_date && setStart1_date("")
        setEnd1_date && setEnd1_date("")
        setIs_updated && setIs_updated(0)
        setIs_deleted && setIs_deleted(0)
        setMarket && setMarket(null)
        setScript && setScript(null)
        setExpiryDate('');

    }


    return (
        <>
            <Grid
                container
                spacing={1}
                sx={{ mb: 1.5 }}
                alignItems="center"
                justifyContent="flex-start"
            >
                {/* Market & Script Filter */}
                <Addexpirymarketfilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                    showMarket={true}
                    showScript={!isNseMarket}
                />

                {/* Expiry Date Input */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="Expiry Date"
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {/* Add Button */}
                <Grid item xs="auto">
                    <Button
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            mr: 1,
                            '&:hover': { backgroundColor: theme.palette.secondary.dark },
                        }}
                    >
                        Add
                    </Button>
                </Grid>
                <Grid item xs="auto">
                    <Button
                        onClick={handleClear}
                        variant="contained"
                        color="error"
                        sx={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            ml: -1,
                        }}
                    >
                        Clear
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer />
        </>
    );
};

export default Addexpiryfilter;
