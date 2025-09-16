import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Button, TextField, useTheme } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateCnbcLinkAPI } from './API/API';

const Cnbdawaz = () => {
    const theme = useTheme();
    const [link, setLink] = useState('');

    const handleSubmit = async () => {
        if (!link) {
            toast.warning("Please enter a link.", { position: "top-right", autoClose: 3000 });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

        try {
            const result = await updateCnbcLinkAPI({
                user_id: dataStored.user_id ?? "",
                auth_key: dataStored.auth_key ?? "",
                link,
            });

            console.log("API Response:", result);

            if (result.success) {
                toast.success("Link updated successfully!", { position: "top-right", autoClose: 3000 });
                setLink("");
            } else {
                toast.error("Failed to update link. Please try again.", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            toast.error("An error occurred while updating link.", { position: "top-right", autoClose: 3000 });
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
