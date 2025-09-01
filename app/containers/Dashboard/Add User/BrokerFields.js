import React from "react";
import { Grid, TextField } from "@mui/material";

const BrokerFields = ({
    selectedBrokers,
    BrokerList,
    field,
    mkt,
    userFormData,
    setUserFormData,
    script,
    isMcxScriptWiseBroker
}) => {

    console.log('selectedBrokers', selectedBrokers);
    return (
        <>
            {selectedBrokers.map(({ broker_id: brokerId }, brokerIndex) => {
                const brokerName =
                    BrokerList.find((b) => b.broker_id === brokerId)?.broker_name ||
                    `Broker ${brokerIndex + 1}`;

                return (
                    <div
                        key={brokerId}
                        style={{ marginLeft: "24px", marginTop: "8px" }}
                    >
                        <h5>{brokerName}</h5>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            <Grid container spacing={2}>
                                {field.children.map((child) => {
                                    const value =
                                        !isMcxScriptWiseBroker
                                            ? userFormData.marketOptions?.[mkt.market_type_id]?.[child.key]?.[brokerId]
                                            : userFormData.marketOptions?.[mkt.market_type_id]?.scripts?.[script.script_id]?.[child.key]?.[brokerId];

                                    return (
                                        <Grid item xs={6} key={`${child.key}_${brokerId}`}>
                                            <TextField
                                                required
                                                label={`${child.label} (${brokerName})`}
                                                size="small"
                                                type={child.type}
                                                value={value}
                                                fullWidth
                                                onChange={(e) => {
                                                    !isMcxScriptWiseBroker
                                                        ? setUserFormData((prev) => ({
                                                            ...prev,
                                                            marketOptions: {
                                                                ...prev.marketOptions,
                                                                [mkt.market_type_id]: {
                                                                    ...prev.marketOptions?.[mkt.market_type_id],
                                                                    [child.key]: {
                                                                        ...prev.marketOptions?.[mkt.market_type_id]?.[child.key],
                                                                        [Number(brokerId)]: Number(e.target.value),
                                                                    },
                                                                },
                                                            },
                                                        }))

                                                        : setUserFormData((prev) => ({
                                                            ...prev,
                                                            marketOptions: {
                                                                ...prev.marketOptions,
                                                                [mkt.market_type_id]: {
                                                                    ...prev.marketOptions?.[mkt.market_type_id],

                                                                    scripts: {
                                                                        ...prev.marketOptions?.[mkt.market_type_id]?.scripts,

                                                                        [script.script_id]: {
                                                                            ...prev.marketOptions?.[mkt.market_type_id]?.scripts?.[script.script_id],

                                                                            [child.key]: {
                                                                                ...prev.marketOptions?.[mkt.market_type_id]?.scripts?.[script.script_id]?.[child.key],
                                                                                [Number(brokerId)]: Number(e.target.value),
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        }));
                                                }}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default BrokerFields;
