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
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

        const payload = {
            start_date: start1_date,
            end_date: end1_date,
            valan_name: valanId,
            valan_status: is_updated,
            market_type_id: market?.id || market,
            is_app: 1,
            login_user_id: dataStored?.user_id || "",
            auth_key: dataStored?.auth_key || "",
        };

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/set_valan_insert',
                payload
            );

            toast.success('Valan added successfully!', { position: "top-right", autoClose: 3000 });

            handleClear(); // Clear form after successful add
        } catch (error) {
            toast.error('Failed to add Valan!', { position: "top-right", autoClose: 3000 });
        }
    };

    const handleClear = () => {
        if (setStart1_date) setStart1_date('');
        if (setEnd1_date) setEnd1_date('');
        if (setIs_updated) setIs_updated(0);
        if (setIs_deleted) setIs_deleted(0);
        if (setMarket) setMarket(null);
        if (setValanId) setValanId('');
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

                {setStart1_date && <DateFilter label="Start Date" value={start1_date} onChange={setStart1_date} />}
                {setEnd1_date && <DateFilter label="End Date" value={end1_date} onChange={setEnd1_date} />}

                <Valanmarket market={market} setMarket={setMarket} showMarket={Boolean(setMarket)} />

                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="Valan Name"
                        value={valanId}
                        onChange={(e) => setValanId(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Add & Clear Buttons */}
                <Grid item xs="auto">
                    <Button
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: "#fff",
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
                            ml: -1
                        }}
                    >
                        Clear
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer />
        </>
    )
}

export default Valanpagefilter;
