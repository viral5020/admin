import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Grid, Button, TextField, useTheme } from '@mui/material'
import Expirymarketscriptfilter from '../filters/Expirymarketscriptfilter'

const Expiryvalidationfilter = ({
    setEnd1_date,
    setStart1_date,
    setIs_deleted,
    setIs_updated,
    market,
    script,
    setScript,
    setMarket,
}) => {
    const theme = useTheme()

    const [afterDays, setAfterDays] = useState("")
    const [beforeDays, setBeforeDays] = useState("")

    const handleAdd = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {}

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: market?.name === "NSEFUT" ? "All" : (script?.id ?? script),
            after_days: afterDays,
            before_days: beforeDays,
            login_user_id: dataStored.user_id ?? "",
            auth_key: dataStored.auth_key ?? "",
        }

        console.log("Add Payload:", payload)

        try {
            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_expiry_validation",
                payload
            )
            console.log("API Response:", response.data)

            toast.success("Expiry validation added successfully!", {
                position: "top-right",
                autoClose: 3000,
            })

            handleClear() // ✅ reset after success
        } catch (error) {
            console.error("Error adding expiry validation:", error)
            toast.error("Failed to add expiry validation!", {
                position: "top-right",
                autoClose: 3000,
            })
        }
    }

    // ✅ Clear function
    const handleClear = () => {
        setStart1_date("")
        setEnd1_date("")
        setIs_updated(0)
        setIs_deleted(0)
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
                <Grid item xs={6} sm={3} md={2} lg={2.4}>
                    <Button
                        fullWidth
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: '#fff',
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

                {/* Clear Button */}
                <Grid item xs={6} sm={3} md={2} lg={2.4}>
                    <Button
                        fullWidth
                        onClick={handleClear}
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.error.dark,
                            },
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

export default Expiryvalidationfilter
