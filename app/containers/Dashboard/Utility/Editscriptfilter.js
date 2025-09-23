import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import Addexpirymarketfilter from '../filters/Addexpirymarketfilter';

const Editscriptfilter = ({
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
    const [newScriptName, setNewScriptName] = useState('');

    const isNseMarket =
        market?.text?.toUpperCase() === 'NSEFUT' ||
        market?.text?.toUpperCase() === 'NSEOPT';

    const handleEdit = async () => {
        // Validation
        if (!market) {
            toast.warning('Please select a market.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!script) {
            toast.warning('Please select a script.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        if (!newScriptName) {
            toast.warning('Please enter a new script name.', { position: 'top-right', autoClose: 3000 });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            script_id: script?.id ?? script,
            market_type_id: market?.id ?? market,
            script_name: newScriptName,
            is_app: 1,
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/script_edit',
                payload
            );

            if (response.data.success) {
                toast.success('Script name updated successfully!', { position: 'top-right', autoClose: 3000 });
                handleClear();
            } else {
                toast.error('Failed to update script name. Please try again.', { position: 'top-right', autoClose: 3000 });
            }
        } catch (error) {
            console.error('Error editing script:', error);
            toast.error('An error occurred while updating script name.', { position: 'top-right', autoClose: 3000 });
        }
    };

    const handleClear = () => {
        setStart1_date && setStart1_date('');
        setEnd1_date && setEnd1_date('');
        setIs_updated && setIs_updated(0);
        setIs_deleted && setIs_deleted(0);
        setMarket && setMarket(null);
        setScript && setScript(null);
        setNewScriptName('');
    };

    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }} alignItems="center" justifyContent="flex-start">
                {/* Market & Script Filter */}
                <Addexpirymarketfilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                    showMarket={true}
                    showScript={!isNseMarket}
                />

                {/* New Script Name Input */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        label="New Script Name"
                        type="text"
                        value={newScriptName}
                        onChange={(e) => setNewScriptName(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Edit Button */}
                <Grid item xs="auto">
                    <Button
                        onClick={handleEdit}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            mr: 1,
                            '&:hover': { backgroundColor: theme.palette.secondary.dark },
                        }}
                    >
                        Edit
                    </Button>
                </Grid>

                {/* Clear Button */}
                <Grid item xs="auto">
                    <Button
                        onClick={handleClear}
                        variant="contained"
                        color="error"
                        sx={{
                            padding: '8px 12px',
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

export default Editscriptfilter;
