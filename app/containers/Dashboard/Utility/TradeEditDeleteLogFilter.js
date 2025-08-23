import React from 'react'
import DateFilter from '../filters/DateFilter'
import MarketScriptNameFilter from '../filters/MarketScriptNameFilter'
import ClientMasterBrokerFilter from '../filters/ClientMasterBrokerFilter'
import { Checkbox, FormControlLabel, FormGroup, Grid, Button, useTheme } from '@mui/material'

const TradeEditDeleteLogFilter = ({
    setEnd_date,
    setStart_date,
    end_date,
    start_date,
    setIs_deleted,
    is_deleted,
    is_updated,
    setIs_updated,
    market,
    script,
    setScript,
    setMarket,
    client,
    master,
    broker,
    setClient,
    setMaster,
    setBroker,
    isAdminOnly,
    setIsAdminOnly,
    onApply
}) => {
    const theme = useTheme();
    return (
        <>
            <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {setIs_deleted && setIs_updated &&
                    <Grid item xs={12} sm={6} md={3} lg={2.4}>
                        <FormGroup row sx={{ display: 'flex', alignItems: 'center' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={is_updated}
                                        onChange={(e) => setIs_updated(e.target.checked)}
                                    />
                                }
                                label="Update"
                                sx={{ mr: 2, ml: 0.5 }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={is_deleted}
                                        onChange={(e) => setIs_deleted(e.target.checked)}
                                    />
                                }
                                label="Delete"
                            />
                        </FormGroup>
                    </Grid>}

                <DateFilter
                    label="Trade After"
                    value={start_date}
                    onChange={setStart_date}
                />

                <DateFilter
                    label="Trade Before"
                    value={end_date}
                    onChange={setEnd_date}
                />

                <MarketScriptNameFilter
                    market={market}
                    script={script}
                    setMarket={setMarket}
                    setScript={setScript}
                    showMarket={Boolean(setMarket)}
                    showScript={Boolean(setScript)}
                />

                <ClientMasterBrokerFilter
                    client={client}
                    master={master}
                    broker={broker}
                    setClient={setClient}
                    setMaster={setMaster}
                    setBroker={setBroker}

                    showClient={Boolean(setClient)}
                    showBroker={Boolean(setBroker)}
                    showMaster={Boolean(setMaster)}
                />

                {setIsAdminOnly && <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={isAdminOnly}
                                onChange={(e) => setIsAdminOnly(e.target.checked)}
                            />
                        }
                        label="Show Admin Only"
                        sx={{ mr: 2, ml: 0.5 }}
                    />
                </Grid>
                }
                {/* Apply Button */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Button
                        fullWidth
                        onClick={() => onApply()}
                        sx={{
                            backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.secondary.contrastText,
                            padding: '6px 12px',
                            borderRadius: '4px',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.dark,
                            },
                        }}
                    >
                        Apply
                    </Button>
                </Grid>

            </Grid >
        </>
    )
}

export default TradeEditDeleteLogFilter
