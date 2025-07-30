import React from 'react'
import RadioFilter from './filters/RadioFilterField'
import DateFilter from './filters/DateFilter'
import MarketScriptNameFilter from './filters/MarketScriptNameFilter'
import ClientMasterBrokerFilter from './filters/ClientMasterBrokerFilter'
import { Grid } from '@mui/material'

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
}) => {
    return (
        <>
            <Grid container spacing={1} mt={1}>
                {/* <Grid item xs={24} sm={12} md={6} lg={5} > */}
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
                {/* </Grid> */}
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
            </Grid>
        </>
    )
}

export default PositionFilter