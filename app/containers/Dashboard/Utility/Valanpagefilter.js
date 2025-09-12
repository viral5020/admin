import React from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DateFilter from '../filters/DateFilter'
import Valanmarket from '../filters/Valanmarket'
import { Checkbox, FormControlLabel, FormGroup, Grid, Button, TextField, useTheme } from '@mui/material'

const Valanpagefilter = ({
    setEnd1_date,
    setStart1_date,
    end1_date,
    start1_date,
    setIs_deleted,
    is_deleted,
    is_updated,
    setIs_updated,
    market,
    setMarket,
    valanId,
    setValanId,
}) => {
    const theme = useTheme();

    const handleAdd = async () => {
        // Get user data from sessionStorage
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

        const payload = {
            start_date: start1_date,
            end_date: end1_date,
            valan_name: valanId,
            valan_status: is_updated,
            market_type_id: market?.id || market, // pass market ID

            // Add user/auth info
            is_app: 1,
            login_user_id: dataStored?.user_id || "",
            auth_key: dataStored?.auth_key || "",
        };

        console.log("Add Payload:", payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/set_valan_insert',
                payload
            );
            console.log('API Response:', response.data);

            toast.success('Valan added successfully!', {
                position: "top-right",
                autoClose: 3000,
            });

            // Reset form
            setStart1_date('');
            setEnd1_date('');
            setIs_updated(0);
            setIs_deleted(0);
            setMarket(null);
            setValanId('');

        } catch (error) {
            console.error('Error adding Valan:', error);

            toast.error('Failed to add Valan!', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };


    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {setIs_deleted && setIs_updated &&
                    <Grid item xs={12} sm={6} md={3} lg={2.4}>
                        <FormGroup row sx={{ display: 'flex', alignItems: 'center' }}>
                            {setIs_updated && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={is_updated === 1}
                                            onChange={(e) => {
                                                setIs_updated(e.target.checked ? 1 : 0);
                                                // If Open is checked, Close should be 0
                                                if (e.target.checked) setIs_deleted(0);
                                            }}
                                        />
                                    }
                                    label="Open"
                                    sx={{ mr: 2, ml: 0.5 }}
                                />
                            )}
                            {setIs_deleted && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={is_deleted === 1}
                                            onChange={(e) => {
                                                setIs_deleted(e.target.checked ? 1 : 0);
                                                // If Close is checked, Open should be 0
                                                if (e.target.checked) setIs_updated(0);
                                            }}
                                        />
                                    }
                                    label="Close"
                                />
                            )}
                        </FormGroup>
                    </Grid>

                }

                {setStart1_date && <DateFilter
                    label="Start Date"
                    value={start1_date}
                    onChange={setStart1_date}
                />}

                {setEnd1_date && <DateFilter
                    label="End Date"
                    value={end1_date}
                    onChange={setEnd1_date}
                />}

                <Valanmarket
                    market={market}
                    setMarket={setMarket}
                    showMarket={Boolean(setMarket)}
                />

                {/* Simple Text Box for Valan Name */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="Valan Name"
                        value={valanId}
                        onChange={(e) => setValanId(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Button
                        fullWidth
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: "#fff",
                            padding: '6px 12px',
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
    )
}

export default Valanpagefilter
