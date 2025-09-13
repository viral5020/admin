import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Button, TextField, MenuItem, useTheme } from '@mui/material';
import Addexpirymarketfilter from '../filters/addexpirymarketfilter';

const Editexpiryfilter = ({
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
    const [expiryList, setExpiryList] = useState([]);
    const [selectedExpiry, setSelectedExpiry] = useState(null);

    const isNseMarket =
        market?.text?.toUpperCase() === 'NSEFUT' ||
        market?.text?.toUpperCase() === 'NSEOPT';

    // Fetch expiry list whenever market or script changes
    useEffect(() => {
        // Only fetch if market is selected and either it's NSE or script is selected
        if (!market || (!isNseMarket && !script)) {
            setExpiryList([]); // Clear expiry list if script/market is not selected
            setSelectedExpiry(null);
            return;
        }

        const fetchExpiryList = async () => {
            try {
                const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};
                const payload = {
                    market_type_id: market?.id ?? market,
                    script_id: isNseMarket ? 'All' : script?.id ?? script,
                    login_user_id: dataStored.user_id ?? '',
                    is_app: 1,
                    auth_key: dataStored.auth_key ?? '',
                };

                const response = await axios.post(
                    'http://128.199.126.171/~goldorg/ajaxfiles/fetch_expiry_list',
                    payload
                );

                if (response.data.status === 'ok' && response.data.data.length > 0) {
                    setExpiryList(response.data.data); // API returns [{script_expiry_id, expiry_date}]
                } else {
                    setExpiryList([]);
                    setSelectedExpiry(null);

                }
            } catch (error) {
                console.error('Error fetching expiry list:', error);
                toast.error('Failed to fetch expiry list.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        };

        fetchExpiryList();
    }, [market, script]);

    const handleEdit = async () => {
        if (!selectedExpiry) {
            toast.warning('Please select an expiry date to edit.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: isNseMarket ? 'All' : script?.id ?? script,
            script_expiry_id: selectedExpiry?.script_expiry_id,
            expiry_date: selectedExpiry?.expiry_date, // keep existing date
            is_app: 1,
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/edit_script_expiry',
                payload
            );

            if (response.data.success) {
                toast.success('Expiry date edited successfully!', {
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
                setSelectedExpiry(null);
                setExpiryList([]);
            } else {
                toast.error('Failed to edit expiry date. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error editing expiry date:', error);
            toast.error('An error occurred while editing expiry date.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

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

                {/* Expiry Date Dropdown */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        select
                        label="Select Expiry"
                        value={selectedExpiry?.script_expiry_id || ''}
                        onChange={(e) =>
                            setSelectedExpiry(
                                expiryList.find(
                                    (ex) => ex.script_expiry_id === e.target.value
                                )
                            )
                        }
                        size="small"
                        fullWidth
                    >
                        {expiryList.map((expiry) => (
                            <MenuItem
                                key={expiry.script_expiry_id}
                                value={expiry.script_expiry_id}
                            >
                                {expiry.expiry_date}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Expiry Date Disabled */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="Expiry Date"
                        type="date"
                        value={selectedExpiry?.expiry_date || ''}
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled
                    />
                </Grid>

                {/* Edit Button */}
                <Grid item xs={12} sm={6} md={2} lg={2}>
                    <Button
                        fullWidth
                        onClick={handleEdit}
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
                        Edit
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer />
        </>
    );
};

export default Editexpiryfilter;
