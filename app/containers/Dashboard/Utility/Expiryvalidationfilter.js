import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Grid, Button, TextField, useTheme, Stack } from '@mui/material'
import Expirymarketscriptfilter from '../filters/Expirymarketscriptfilter'
import { getDefaultParams } from '../API/API'

const Expiryvalidationfilter = ({ setIsMarketAdded }) => {
    const theme = useTheme()

    const [market, setMarket] = useState('');
    const [script, setScript] = useState('');
    const [afterDays, setAfterDays] = useState("");
    const [beforeDays, setBeforeDays] = useState("");

    const handleAdd = async () => {
        const defaultParams = await getDefaultParams();

        const payload = {
            ...defaultParams,
            market_type_id: market?.id ?? market,
            script_id: market?.name === "NSEFUT" ? "All" : (script?.id ?? script),
            after_days: afterDays,
            before_days: beforeDays,
        }

        console.log("Add Payload:", payload)

        try {
            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_expiry_validation",
                payload
            )
            console.log("API Response:", response.data)
            if (response.data.status === 'ok') {
                toast.success("Expiry validation added successfully!", { containerId: "1234" })
                handleClear();
                setIsMarketAdded(true);
            } else {
                toast.error(response.data.message || "Some error occured.", { containerId: "1234" })
            }
        } catch (error) {
            console.error("Error adding expiry validation:", error)
            toast.error("Failed to add expiry validation!", { containerId: "1234" })
        }
    }

    // ✅ Clear function
    const handleClear = () => {
        setMarket(null)
        setScript(null)
        setAfterDays("")
        setBeforeDays("")
    }

    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {/* Market & Script Filter */}
                <Expirymarketscriptfilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                    hideScript={market?.name === "NSEFUT"} // ✅ hide script if NSEFUT
                />

                {/* After Days Input */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="After Days"
                        type="number"
                        value={afterDays}
                        onChange={(e) => setAfterDays(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Before Days Input */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="Before Days"
                        type="number"
                        value={beforeDays}
                        onChange={(e) => setBeforeDays(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Add Button */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button
                            fullWidth
                            onClick={handleAdd}
                            sx={{
                                backgroundColor: theme.palette.secondary.main,
                                color: "#fff",
                                borderRadius: "4px",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: theme.palette.secondary.dark,
                                },
                            }}
                        >
                            Add
                        </Button>

                        <Button
                            fullWidth
                            onClick={handleClear}
                            sx={{
                                backgroundColor: theme.palette.error.main,
                                color: "#fff",
                                borderRadius: "4px",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: theme.palette.error.dark,
                                },
                            }}
                        >
                            Clear
                        </Button>
                    </Stack>
                </Grid>

            </Grid>

            <ToastContainer containerId="1234" />
        </>
    )
}

export default Expiryvalidationfilter
