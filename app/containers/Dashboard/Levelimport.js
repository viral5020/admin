import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Button, Paper, Typography, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Levelimport = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            toast.warning("Please choose a file.", { position: "top-right", autoClose: 3000 });
            return;
        }

        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

        try {
            const result = await uploadUserTypeQtyAPI({
                user_id: dataStored.user_id ?? "",
                auth_key: dataStored.auth_key ?? "",
                file: selectedFile,
            });

            if (result.success) {
                toast.success("File uploaded successfully!", { position: "top-right", autoClose: 3000 });
                setSelectedFile(null);
            } else {
                toast.error(result.message || "Upload failed.", { position: "top-right", autoClose: 3000 });
            }
        } catch (error) {
            toast.error("An error occurred during upload.", { position: "top-right", autoClose: 3000 });
        }
    };

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 1,
                    textAlign: 'center',
                    maxWidth: 500,
                    mx: 'auto',
                    mt: 4,
                }}
            >


                <Box display="flex" flexDirection="column" gap={2}>
                    {/* File Input */}
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{
                            borderRadius: 1,
                            py: 1.5,
                            fontWeight: 500,
                        }}
                    >
                        {selectedFile ? selectedFile.name : 'Choose File'}
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{
                            borderRadius: 1,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Paper>

            <ToastContainer />
        </>
    );
};

export default Levelimport;
