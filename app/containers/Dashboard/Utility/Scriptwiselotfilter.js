import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Grid, Button, TextField, useTheme } from '@mui/material'
import MarketScriptNameFilter from '../filters/MarketScriptNameFilter'

const Scriptwiselotfilter = ({
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
    const theme = useTheme()
    const [quantity, setQuantity] = useState("")   // ✅ new state for quantity

    const handleAdd = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {}

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: script?.id ?? script,
            script_lot_qty: quantity,   // ✅ use quantity in payload
            is_app: 1,
            login_user_id: dataStored.user_id ?? "",
            auth_key: dataStored.auth_key ?? "",
        }

        console.log("Add Payload:", payload)

        try {
            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_lot_qty_setting",
                payload
            )
            console.log("API Response:", response.data)

            toast.success("Quantity added successfully!", {
                position: "top-right",
                autoClose: 3000,
            })

            // Reset form
            setStart1_date("")
            setEnd1_date("")
            setIs_updated(0)
            setIs_deleted(0)
            setMarket(null)
            setScript(null)
            setQuantity("")   // ✅ reset quantity
        } catch (error) {
            console.error("Error adding Quantity:", error)
        }
    }

    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {/* Market & Script Filter */}
                <MarketScriptNameFilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                />

                {/* Quantity Input */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        label="Quantity"
                        type="number"   // ✅ numeric input
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Add Button */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
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
            </Grid>

            <ToastContainer />
        </>
    )
}

export default Scriptwiselotfilter
