import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Grid, Button, useTheme, TextField, MenuItem } from '@mui/material'
import Marketnamefilter from '../filters/Marketnamefilter'
import ClientMasterBrokerFilter from '../filters/ClientMasterBrokerFilter'

const Stopfuturefilter = ({
    setEnd1_date,
    setStart1_date,
    setIs_deleted,
    setIs_updated,
    market,
    script,
    setScript,
    setMarket,
    master,
    setMaster,
}) => {
    const theme = useTheme()

    const [futureList, setFutureList] = useState([])
    const [selectedFuture, setSelectedFuture] = useState("")

    // ✅ Fetch Future names
    useEffect(() => {
        const fetchFutures = async () => {
            try {
                const dataStored = JSON.parse(sessionStorage.getItem("data")) || {}
                const response = await axios.post(
                    "http://128.199.126.171/~goldorg/ajaxfiles/get_future_name_search",
                    {
                        login_user_id: dataStored.user_id ?? "",
                        auth_key: dataStored.auth_key ?? "",
                        is_app: 1,
                    }
                )

                if (response.data?.results) {
                    setFutureList(response.data.results)
                }
            } catch (error) {
                console.error("Error fetching futures:", error)
                toast.error("Failed to load futures!", { autoClose: 3000 })
            }
        }
        fetchFutures()
    }, [])

    const handleAdd = async () => {
        const dataStored = JSON.parse(sessionStorage.getItem("data")) || {}

        const payload = {
            market_type_id: market?.id ?? market,
            script_id: script?.id ?? script,
            master_user_id: master?.id ?? master,
            future_id: selectedFuture, // ✅ include selected future
            is_app: 1,
            login_user_id: dataStored.user_id ?? "",
            auth_key: dataStored.auth_key ?? "",
        }

        console.log("Add Payload:", payload)

        try {
            const response = await axios.post(
                "http://128.199.126.171/~goldorg/ajaxfiles/setting/add_future_trading_block",
                payload
            )

            if (response.data?.status === "ok") {
                toast.success("Future block added successfully!", { autoClose: 3000 })
                handleClear() // ✅ reset after success
            } else {
                toast.error(response.data?.msg || "Failed to add future block!", { autoClose: 3000 })
            }
        } catch (error) {
            console.error("Error adding Future:", error)
            toast.error("Error adding future block!", { autoClose: 3000 })
        }
    }

    // ✅ Clear function
    const handleClear = () => {
        setMarket(null)
        setScript(null)
        setMaster(null)
        setSelectedFuture("")

    }

    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }}>
                <ClientMasterBrokerFilter master={master} setMaster={setMaster} />
                <Marketnamefilter market={market} setMarket={setMarket} />

                {/* Future Dropdown */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <TextField
                        select
                        label="Select Future"
                        value={selectedFuture}
                        onChange={(e) => setSelectedFuture(e.target.value)}
                        size="small"
                        fullWidth
                    >
                        {futureList.map((future) => (
                            <MenuItem key={future.id} value={future.id}>
                                {future.text}
                            </MenuItem>
                        ))}
                    </TextField>
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

export default Stopfuturefilter
