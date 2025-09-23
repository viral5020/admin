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
    const [quantity, setQuantity] = useState("")   // ✅ state for quantity

    const handleAdd = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {}

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: script?.id ?? script,
            script_lot_qty: quantity,
            is_app: 1,
            login_user_id: dataStored.user_id ?? "",
            auth_key: dataStored.auth_key ?? "",
        }

        try {
            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/set_lot_qty_setting",
                payload
            )

            toast.success("Quantity added successfully!", {
                position: "top-right",
                autoClose: 3000,
            })

            handleClear() // Reset form after add
        } catch (error) {
            console.error("Error adding Quantity:", error)
            toast.error("Failed to add Quantity!", { position: "top-right", autoClose: 3000 })
        }
    }

    const handleClear = () => {
        setStart1_date && setStart1_date("")
        setEnd1_date && setEnd1_date("")
        setIs_updated && setIs_updated(0)
        setIs_deleted && setIs_deleted(0)
        setMarket && setMarket(null)
        setScript && setScript(null)
        setQuantity("") // Reset quantity
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
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Grid>

                {/* Add Button */}
                <Grid item xs="auto">
                    <Button
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            mr: 1,
                            '&:hover': { backgroundColor: theme.palette.secondary.dark },
                        }}
                    >
                        Add
                    </Button>
                </Grid>

                {/* Clear Button */}
                <Grid item xs="auto">
                    <Button
                        onClick={handleClear}
                        variant="contained"
                        color="error"
                        sx={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            ml: -1,
                            textTransform: 'none',
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

export default Scriptwiselotfilter
