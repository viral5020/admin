
const mstaerPayload = {
    userType: 3,
    name: "testanasbid",
    password: "Abcd1234",
    remarks: "test",

    openingBalance: 0,
    balanceType: 0,

    freshLimitAllowed: 1,
    short_trade_minutes: 2,
    partnershipPercentage: 5,
    partnershipType: 0,

    markets: ["5", "2", "8", "9", "1", "4", "6", "3", "7", "13"],
    accountTypes: ["5", "4", "3", "2", "1"],

    nseOLimit: 5,
    nseOLimit_max: 5,
    nseOMinLotWise: 1,
    nseOMaxLotWise: 1,
    firstSell: null,

    nseLimit: 5,
    nseLimit_max: 6,
    nseMinPercentWise: 0.005,
    nseMaxPercentWise: 0.005,

    nseEqtLimit: 5,
    nseEqtLimit_max: 5,
    nseEqtMinLotWise: 0.001,
    nseEqtMaxLotWise: 0.001,

    ncdsLimit: 5,
    ncdsLimit_max: 5,
    ncdsMinPercentWise: 1,

    mcxLimit: 5,
    mcxLimit_max: 5,
    mcxScripts: [
        {
            script: "1",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "2",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "146",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "149",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "151",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "154",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "157",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "158",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "161",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "162",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "163",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "1179",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "1180",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "1181",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
        {
            script: "1182",
            percentComm: 0.001,
            percentCommMax: 0.001,
            lotComm: 1,
            lotCommMax: 1,
        },
    ],

    globalLimit: 5,
    globalLimit_max: null,
    globalMinPercentWise: 0.001,
    globalMaxPercentWise: 0.01,

    forexLimit: 5,
    forexLimit_max: 5,
    forexMinPercentWise: 1,
    forexMaxPercentWise: 1,

    cricketLimit: null,

    comexLimit: 5,
    comexLimit_max: 5,
    comexMinPercentWise: 10,
    comexMaxPercentWise: 10,
};


const MINE_MASTER_PAYLOAD = {
    "userType": 3,
    "name": "testanasbid",
    "remarks": "",
    "password": "aaaa",
    "openingBalance": 0,
    "balanceType": 0,
    "firstSell": null,
    "short_trade_minutes": 44,
    "partnershipPercentage": 22,
    "partnershipType": 0,
    "freshLimitAllowed": 1,
    "markets": [
        "5",
        "4",
        "3",
        "1",
        "13"
    ],
    "accountTypes": [
        "5",
        "1",
        "661"
    ],
    "nseOLimit": 2,
    "nseOLimit_max": 3,
    "nseOMinLotWise": 2,
    "nseOMaxLotWise": 4,
    "globalLimit": 3,
    "globalLimit_max": 4,
    "cricketLimit": 1,
    "mcxLimit": 2,
    "mcxLimit_max": 3,
    "binaryLimit": 0,
    "binaryLimit_max": 0,
    "mcxScripts": [
        {
            "script": "1",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "2",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "146",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "149",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "151",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "154",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "157",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "158",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "161",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "162",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "163",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "1179",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "1180",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "1181",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        },
        {
            "script": "1182",
            "percentComm": 7,
            "percentCommMax": 46,
            "lotComm": 71,
            "lotCommMax": 9
        }
    ]
}

const MINE_MASTER_PAYLOAD_edit = {
    "userType": 3,
    "name": "746680",
    "remarks": "",
    "change_user_id": 67580,
    "username": "439354",
    "openingBalance": 0,
    "balanceType": 0,
    "firstSell": null,
    "short_trade_minutes": 0,
    "partnershipPercentage": 10,
    "partnershipType": 0,
    "freshLimitAllowed": 1,

    "markets": [
        "5",
        "2",
        "1"
    ],
    "accountTypes": [
        "5",
        "4",
        "2",
        "1"
    ],

    "nseOLimit": 100000,
    "nseOLimit_max": 500000,
    "nseOMinLotWise": 20,
    "nseOMaxLotWise": 100,

    "nseLimit": 10000000,
    "nseLimit_max": 50000000,
    "nseMinPercentWise": 0.01,
    "nseMaxPercentWise": 0.03,

    "mcxLimit": 10000000,
    "mcxLimit_max": 50000000,
    "mcxScripts": [
        {
            "script": "1",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "2",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "146",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "149",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "151",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "154",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "157",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "158",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "161",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "162",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "163",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "1179",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "1180",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "1181",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        },
        {
            "script": "1182",
            "percentComm": 0.01,
            "percentCommMax": 0.03,
            "lotComm": 100,
            "lotCommMax": 200
        }
    ]
}
// NOPT lot
// NSEC LOT
// FOREX LOT

// comex pr
// NFUT Pr
// NSEEQT Pr
// GLBAL PR

// MCX MIN PR COMMI, MIN LOT COMM


// > ADD USER
// MCX DEFAULT FIELD AND SCRIPTVISE FIEL;D

// LOTWISE AND PERC ENTWISE

// CRICKERT CASINO ALLOWED
// BINARY 2 FILED , HAVE 4 IN PAYLOAD

{
    isChecked && (
        <>
            {/* -------------------- MCXFUT -------------------- */}
            {mkt.market_type_name === "MCXFUT" ? (
                <>
                    <div style={{ display: "flex", gap: "12px", marginLeft: "32px", marginTop: "12px" }}>
                        <TextField
                            required
                            label="Margin Limit"
                            size="small"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={masterFormData.defaultOptions?.marginLimit || ""}
                            onChange={(e) =>
                                setMasterFormData({
                                    ...masterFormData,
                                    defaultOptions: {
                                        ...masterFormData.defaultOptions,
                                        marginLimit: e.target.value,  // keep as string for input
                                    },
                                })
                            }
                        />

                        <TextField
                            required
                            label="Next Margin Limit"
                            size="small"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={masterFormData.defaultOptions?.nextMarginLimit || ""}
                            onChange={(e) =>
                                setMasterFormData({
                                    ...masterFormData,
                                    defaultOptions: {
                                        ...masterFormData.defaultOptions,
                                        nextMarginLimit: e.target.value,
                                    },
                                })
                            }
                        />

                    </div>


                    {/* Default commission text fields */}
                    <div style={{ display: "flex", gap: "12px", marginLeft: "32px", marginTop: "12px" }}>
                        {["minPctComm", "maxPctComm", "minLotComm", "maxLotComm"].map((key) => (
                            <TextField
                                required
                                type="number"
                                key={key}
                                label={`Default ${key}`}
                                inputProps={{ min: 0 }}
                                size="small"
                                value={masterFormData.defaultOptions?.[key] || ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setMasterFormData((prev) => ({
                                        ...prev,
                                        defaultOptions: { ...prev.defaultOptions, [key]: value },
                                        // Apply to all MCX scripts instead of market types
                                        marketOptions: prev.mcxscript?.reduce((acc, script) => {
                                            acc[script.script_id] = {
                                                ...prev.marketOptions?.[script.script_id],
                                                [key]: value,
                                            };
                                            return acc;
                                        }, {}),
                                    }));
                                }}
                            />
                        ))}
                    </div>

                    {/* MCX script checkboxes + individual text fields */}
                    {Mcxscript.map((script) => (
                        <div key={script.script_id} style={{ marginLeft: "32px", marginTop: "12px" }}>
                            <FormControlLabel
                                control={<Checkbox size="small" checked={script.selected} disabled />}
                                label={script.script_name}
                            />

                            {/* Commission fields per script */}
                            <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                                {["minPctComm", "maxPctComm", "minLotComm", "maxLotComm"].map((key) => (
                                    <TextField
                                        required
                                        key={key}
                                        label={key}
                                        inputProps={{ min: 0 }}
                                        type="number"
                                        size="small"
                                        value={masterFormData.marketOptions?.[script.script_id]?.[key] || ""}
                                        onChange={(e) =>
                                            setMasterFormData((prev) => ({
                                                ...prev,
                                                marketOptions: {
                                                    ...prev.marketOptions,
                                                    [script.script_id]: {
                                                        ...prev.marketOptions?.[script.script_id],
                                                        [key]: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            ) : mkt.market_type_name === "CRICKET" ? (
                /* -------------------- Cricket -------------------- */
                <FormGroup
                    row
                    sx={{
                        ml: 4,
                        mt: 1,
                        "& .MuiFormControlLabel-root": { mr: 3, minWidth: "200px" },
                    }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={
                                    masterFormData.marketOptions?.[mkt.market_type_id]
                                        ?.casinoAllowed || false
                                }
                                onChange={(e) =>
                                    setMasterFormData({
                                        ...masterFormData,
                                        marketOptions: {
                                            ...masterFormData.marketOptions,
                                            [mkt.market_type_id]: {
                                                ...masterFormData.marketOptions?.[mkt.market_type_id],
                                                casinoAllowed: e.target.checked,
                                            },
                                        },
                                    })
                                }
                            />
                        }
                        label="Casino Allowed"
                    />
                </FormGroup>
            ) : mkt.market_type_name === "BINARY" ? (
                /* -------------------- Binary -------------------- */

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginLeft: "32px",
                        marginTop: "12px",
                    }}
                >
                    {["Margin Limit", "Next Margin Limit"].map((key) => (
                        <TextField
                            required
                            inputProps={{ min: 0 }}
                            key={key}
                            type="number"
                            label={key}                 // Label appears inside the text box
                            size="small"
                            variant="outlined"
                            sx={{ minWidth: "150px" }}  // same width as your other fields
                            value={masterFormData.marketOptions?.[mkt.market_type_id]?.[key.replace(/ /g, "")] || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setMasterFormData((prev) => ({
                                    ...prev,
                                    marketOptions: {
                                        ...prev.marketOptions,
                                        [mkt.market_type_id]: {
                                            ...prev.marketOptions?.[mkt.market_type_id],
                                            [key.replace(/ /g, "")]: value,
                                        },
                                    },
                                }));
                            }}
                        />
                    ))}
                </div>



            ) : (
                /* -------------------- Default Markets -------------------- */

                <div style={{ display: "flex", gap: "12px", marginLeft: "32px", marginTop: "12px" }}>
                    {["marginLimit", "nextMarginLimit", "minLotBrokerage", "maxLotBrokerage"].map((key) => (
                        <TextField
                            required
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1")} // Adds space before capital letters
                            size="small"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={masterFormData.marketOptions?.[mkt.market_type_id]?.[key] ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setMasterFormData((prev) => ({
                                    ...prev,
                                    marketOptions: {
                                        ...prev.marketOptions,
                                        [mkt.market_type_id]: {
                                            ...prev.marketOptions?.[mkt.market_type_id],
                                            [key]: value === "" ? "" : Number(value), // ✅ convert to number
                                        },
                                    },
                                }));
                            }}
                            error={!!masterError[`market_${mkt.market_type_id}_${key}`]}
                            helperText={masterError[`market_${mkt.market_type_id}_${key}`]}
                        />
                    ))}

                </div>


            )}
        </>
    )
}


const masterFormdata = {
    "userType": "",
    "name": "testanasbid",
    "password": "QQQQQQ",
    "remarks": "SDDDADADSDADASDS",
    "openingBalance": 0,
    "balanceType": 0,
    "partnership": "22",
    "partnershipType": "",
    "shortTradeAvoid": "44",
    "freshLimitAllowed": "1",

    "userLevel": [
        "4",
        "35",
        "43"
    ],
    "markets": [
        2,
        8,
        1,
        3,
        13
    ],
    "marketOptions": {
        "1": {
            "marginLimit": 3,
            "nextMarginLimit": 5,
            "maxPercentWise": 61,
            "minPercentWise": 7,
            "minLotBrokerage": 6,
            "maxLotBrokerage": 6
        },
        "2": {
            "marginLimit": 2,
            "nextMarginLimit": 3,
            "maxPercentWise": 1,
            "minPercentWise": 5
        },
        "8": {
            "marginLimit": 3,
            "nextMarginLimit": 8,
            "maxPercentWise": 5,
            "minPercentWise": 1
        },
        "13": {
            "marginLimit": 22,
            "nextMarginLimit": 44
        }
    },
    "accountTypes": [],
    "mcxScipts": {
        "1": {
            "minPercentWise": "722",
            "maxPercentWise": "6111",
            "maxLotBrokerage": "62",
            "minLotBrokerage": "63"
        },
        "2": {
            "minPercentWise": "76",
            "maxPercentWise": "614",
            "maxLotBrokerage": "65",
            "minLotBrokerage": 6
        },
        "146": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "149": {
            "minPercentWise": "70",
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "151": {
            "minPercentWise": 7,
            "maxPercentWise": "618",
            "maxLotBrokerage": 6,
            "minLotBrokerage": "67"
        },
        "154": {
            "minPercentWise": 7,
            "maxPercentWise": "618",
            "maxLotBrokerage": "66",
            "minLotBrokerage": "64"
        },
        "157": {
            "minPercentWise": "73",
            "maxPercentWise": 61,
            "maxLotBrokerage": "65",
            "minLotBrokerage": 6
        },
        "158": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "161": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "162": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "163": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "1179": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "1180": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "1181": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        },
        "1182": {
            "minPercentWise": 7,
            "maxPercentWise": 61,
            "maxLotBrokerage": 6,
            "minLotBrokerage": 6
        }
    }
}


