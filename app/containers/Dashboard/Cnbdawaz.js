import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cnbdawaz = () => {
    const theme = useTheme();
    const [link, setLink] = useState('');

    const handleSubmit = async () => {
        if (!link) {
            toast.warning('Please enter a link.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            link,
            is_app: 1,
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        console.log('Payload:', payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/update_cnbc',
                payload
            );
            console.log('API Response:', response.data);

            if (response.data.success) {
                toast.success('Link updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setLink('');
            } else {
                toast.error('Failed to update link. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error updating link:', error);
            toast.error('An error occurred while updating link.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="flex-start"
                sx={{ mb: 2 }}
            >
                {/* Textbox for link */}
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <TextField
                        label="Enter Link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Submit button */}
                <Grid item xs={12} sm={4} md={2} lg={2}>
                    <Button
                        fullWidth
                        onClick={handleSubmit}
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
                        Submit
                    </Button>
                </Grid>
            </Grid>

            <ToastContainer />
        </>
    );
};

export default Cnbdawaz;
