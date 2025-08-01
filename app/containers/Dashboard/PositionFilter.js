import React from 'react';
import RadioFilter from './filters/RadioFilterField';
import DateFilter from './filters/DateFilter';
import MarketScriptNameFilter from './filters/MarketScriptNameFilter';
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter';
import { Grid, Button, useTheme } from '@mui/material';

const PositionFilter = ({
    ClientWiseOptions,
    allOutstandingOptions,
    setExparyDate,
    exparyDate,
    setClient_wise_value,
    client_wise_value,
    setAll_outstanding,
    all_outstanding,
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
    onApply 
}) => {
    const theme = useTheme();

    return (
        <>
            <Grid container spacing={1} mt={1}>
                <RadioFilter
                    label="All Outstanding"
                    options={allOutstandingOptions}
                    value={all_outstanding}
                    onChange={setAll_outstanding}
                />
                <RadioFilter
                    label="Value"
                    options={ClientWiseOptions}
                    value={client_wise_value}
                    onChange={setClient_wise_value}
                    isLong={true}
                />
                <DateFilter
                    label="Expary date"
                    value={exparyDate}
                    onChange={setExparyDate}
                />
                <MarketScriptNameFilter
                    market={market}
                    script={script}
                    setScript={setScript}
                    setMarket={setMarket}
                />
                <ClientMasterBrokerFilter
                    client={client}
                    master={master}
                    broker={broker}
                    setClient={setClient}
                    setMaster={setMaster}
                    setBroker={setBroker}
                />

                {/* ✅ Apply Button */}
                <Grid item xs={12} sm={6} md={3} lg={2.4}>
                    <Button
                        fullWidth
                        onClick={onApply}
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
            </Grid>
        </>
    );
};

export default PositionFilter;
