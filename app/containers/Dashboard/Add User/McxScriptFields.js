import React from "react";
import {
    Grid,
    TextField,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import BrokerFields from "./BrokerFields";

const McxScriptFields = ({
    userFormData,
    setUserFormData,
    config,
    Mcxscript,

    selectedBrokers,
    BrokerList,
    field,
    mkt,
}) => {
    // if (
    //     userFormData.marketOptions?.MCXFUT?.commissionType !== 1 ||
    //     !config.hasMcxScripts
    // ) {
    //     return null;
    // }

    const labelMap = {
        deliveryComm: "Delivery Commission",
        intraComm: "Intraday Commission",
        deliveryBrokerage: "Delivery Broker Commission",
        intraBrokerage: "Intraday Broker Commission",
    };

    return (
        <>
            {Mcxscript.map((script) => (
                <Grid
                    item
                    xs={12}
                    key={script.script_id}
                    style={{ marginBottom: "12px" }}
                >
                    {/* Script Name */}
                    <FormControlLabel
                        control={<Checkbox size="small" checked disabled />}
                        label={script.script_name}
                    />

                    {/* Commission fields */}
                    <Grid
                        container
                        spacing={2}
                        style={{ marginTop: "8px", marginLeft: "24px" }}
                    >
                        {["deliveryComm", "intraComm"].map((key) => {
                            const value =
                                userFormData.marketOptions?.[mkt.market_type_id]?.scripts?.[script.script_id]?.[key] || "";

                            return (
                                <Grid item xs={6} key={key}>
                                    <TextField
                                        required
                                        label={labelMap[key]}
                                        size="small"
                                        type="number"
                                        fullWidth
                                        value={value}
                                        // InputProps={
                                        //     key === "deliveryComm" ? { readOnly: true } : {}
                                        // }
                                        onChange={
                                            // key === "deliveryComm"
                                            //     ? undefined
                                            //     :
                                            (e) =>
                                                setUserFormData((prev) => ({
                                                    ...prev,
                                                    marketOptions: {
                                                        ...prev.marketOptions,
                                                        [mkt.market_type_id]: {
                                                            ...prev.marketOptions?.[mkt.market_type_id],
                                                            scripts: {
                                                                ...prev.marketOptions?.[mkt.market_type_id]?.scripts,
                                                                [script.script_id]: {
                                                                    ...prev.marketOptions?.[mkt.market_type_id]?.scripts?.[script.script_id],
                                                                    [key]: e.target.value,
                                                                },
                                                            },
                                                        },
                                                    },
                                                }))
                                        }
                                    />
                                </Grid>
                            );
                        })}

                        <BrokerFields
                            selectedBrokers={selectedBrokers}
                            BrokerList={BrokerList}
                            field={field}
                            mkt={mkt}
                            userFormData={userFormData}
                            setUserFormData={setUserFormData}
                            script={script}
                            isMcxScriptWiseBroker={true}
                        />
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

export default McxScriptFields;
