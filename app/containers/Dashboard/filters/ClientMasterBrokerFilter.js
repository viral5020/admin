import React, { useEffect, useState } from 'react';
import AutoSuggestFilter from './AutoSuggestFilter';

const ClientMasterBrokerFilter = ({
    client,
    master,
    broker,
    setClient,
    setMaster,
    setBroker,
    isMultipleBroker = false,
}) => {
    // useEffect(() => { console.log('client', client); }, [client]);
    // useEffect(() => { console.log('master', master); }, [master]);
    // useEffect(() => { console.log('broker', broker); }, [broker]);

    const [clientOptions, setClientOptions] = useState([]);
    const [masterOptions, setMasterOptions] = useState([]);
    const [brokerOptions, setBrokerOptions] = useState([]);

    const [userType, setUserType] = useState(0)

    useEffect(() => {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        setUserType(dataStored.user_type)
    }, []);

    return (
        <>
            {/* WHEN API WORKS, THEN MAKE IT FUNCTIONAL LIKE SCRIPT NAME'S AUTO COMPLETE */}

            {/* (7) Client Name */}
            {userType != 1 && setClient &&
                <AutoSuggestFilter
                    label='Client'
                    field={client}
                    setField={setClient}
                    fieldName='client'
                    options={clientOptions}
                    setOptions={setClientOptions}
                />}

            {/* (8) Master Name */}
            {userType != 1 && setMaster &&
                <AutoSuggestFilter
                    label='Master'
                    field={master}
                    setField={setMaster}
                    fieldName='master'
                    options={masterOptions}
                    setOptions={setMasterOptions}
                />}

            {/* (9) Broker Name */}
            {setBroker &&
                <AutoSuggestFilter
                    isMultiSelect={isMultipleBroker}
                    label="Broker"
                    fieldName="broker"
                    options={brokerOptions}
                    field={broker}
                    setField={setBroker}
                    setOptions={setBrokerOptions}
                />}
        </>
    )
}

export default ClientMasterBrokerFilter