import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Marquee = () => {
    const theme = useTheme();

    const [message, setmessage] = useState('');

    const handleSubmit = async () => {
        if (!message) {
            toast.warning('Please enter a message.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem('data')) || {};

        const payload = {
            message,
            is_app: 1,
            login_user_id: dataStored.user_id ?? '',
            auth_key: dataStored.auth_key ?? '',
        };

        console.log('Payload:', payload);

        try {
            const response = await axios.post(
                'http://128.199.126.171/~goldorg/ajaxfiles/setting/marquee_add',
                payload
            );
            console.log('API Response:', response.data);

            if (response.data.success) {
                toast.success('message updated successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                setmessage('');
            } else {
                toast.error('Failed to update message. Please try again.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error('Error updating message:', error);
            toast.error('An error occurred while updating message.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {/* Textbox for message */}
                <Grid item xs={12}>
                    <TextField
                        label="Enter message"
                        multiline
                        rows={3}
                        value={message}
                        onChange={(e) => setmessage(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Submit button */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: '#fff',
                            padding: '8px 16px',
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

export default Marquee