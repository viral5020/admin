import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = ({ size = 40, color = "white" }) => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.4)", // semi-transparent gray overlay
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1300, // above everything
            }}
        >
            <CircularProgress size={size} sx={{ color }} />
        </Box>
    );
};

export default Loader;
