import React, { useState } from 'react';
import {
    Box, Typography, IconButton, TextField, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, useTheme, useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ValanFilter from './ValanFilter';
import TradeEditDeleteLogFilter from './Utility/TradeEditDeleteLogFilter';
import FilterBtn from './filters/FilterBtn';
import { post } from './API/API'; // You can create a post wrapper around fetch/axios

const Brokrageref = ({ filterShow = true }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const rawData = sessionStorage.getItem("data");

    // 2. Initialize parsedData safely
    let parsedData = null;
    if (rawData) {
        try {
            parsedData = JSON.parse(rawData);
        } catch (error) {
            console.error("Failed to parse session data:", error);
        }
    }

    // 3. Extract user_type and deletePopup safely
    let userType = null;
    let deletePopup = 0; // default to 0 if not set

    if (parsedData) {
        // Convert user_type to integer if available
        if (parsedData.user_type !== undefined) {
            userType = parseInt(parsedData.user_type, 10);
            if (isNaN(userType)) {
                console.warn("user_type is not a valid number");
                userType = null;
            }
        }

        // Convert deletePopup to integer if available
        if (parsedData.deletePopup !== undefined) {
            deletePopup = parseInt(parsedData.deletePopup, 10);
            if (isNaN(deletePopup)) {
                console.warn("deletePopup is not a valid number");
                deletePopup = 0;
            }
        }
    }

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [valanId, setValanId] = useState(null);
    const [client, setClient] = useState({});
    const [master, setMaster] = useState({});
    const [broker, setBroker] = useState({});

    const [dialogOpen, setDialogOpen] = useState(false);
    const [password, setPassword] = useState("");

    const needsPassword = userType === 4;

    const toggleDrawer = (open) => () => setDrawerOpen(open);

    const onFilterApply = () => {
        setDialogOpen(true); // open confirmation dialog
    };

    const confirmTrade = async () => {
        const payload = {
            is_app: 1,
            login_user_id: parsedData?.user_id,
            auth_key: parsedData?.auth_key,
            broker_id: broker?.id || "",
            master_id: master?.id || "",
            user_id: client?.id || '',
            valan_id: valanId?.id || "",
            password: password
        };

        try {
            const response = await fetch("http://128.199.126.171/~goldorg/ajaxfiles/brokerage_refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("API Response:", data);
            setDialogOpen(false);
        } catch (err) {
            console.error("Error calling API:", err);
        }
    };

    return (
        <Box sx={{ p: 2 }}>

            {/* Desktop Filters */}
            {filterShow && (
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
                    <Box sx={{ width: 348, mb: 1 }}>
                        <ValanFilter valanId={valanId} setValanId={setValanId} />
                    </Box>
                    <TradeEditDeleteLogFilter
                        setClient={setClient}
                        setMaster={setMaster}
                        setBroker={setBroker}
                        client={client}
                        master={master}
                        broker={broker}
                        userType={userType}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            mt: 2,
                            borderRadius: 1, // bigger border radius
                            padding: '8px 24px', // optional: makes button a bit bigger
                            fontWeight: 'bold' // optional: makes text stand out
                        }}
                        onClick={onFilterApply}
                    >
                        Apply
                    </Button>
                </Box>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Trade</DialogTitle>
                <DialogContent>
                    <Typography>
                        {needsPassword
                            ? "Enter password to confirm trade."
                            : "Are you sure you want to submit this trade?"}
                    </Typography>
                    {needsPassword && (
                        <TextField
                            type="password"
                            label="Password"
                            fullWidth
                            sx={{ mt: 2 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={confirmTrade}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Brokrageref;
