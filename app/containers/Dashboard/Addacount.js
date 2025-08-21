import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";

export default function AddAccountForm() {
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    password: "",
    remarks: "",
    userLevel: [], // selected user level ids
    marketType: [], // selected market type ids
    // extra fields used in UI/payload
    partnership: "",
    shortTradeAvoid: "",
    freshLimitAllowed: null, // "yes" | "no" | null
    // defaults and per-market/script options
    defaultOptions: {
      // keys: minPctComm, maxPctComm, minLotComm, maxLotComm, marginLimit, nextMarginLimit
      minPctComm: "",
      maxPctComm: "",
      minLotComm: "",
      maxLotComm: "",
      marginLimit: false,
      nextMarginLimit: false,
    },
    marketOptions: {}, // keyed by market_type_id or script id depending on API response
    accountTypes: [], // optional; fallback to userLevel if left empty
    // balance & limits that may be required by API
    openingBalance: 0,
    balanceType: 0,
    nseLimit: "",
    nseLimit_max: "",
    nseMinPercentWise: "",
    nseMaxPercentWise: "",
    mcxLimit: "",
    mcxLimit_max: "",
  });

  const [userLevels, setUserLevels] = useState([]); // fetched list
  const [marketTypes, setMarketTypes] = useState([]); // fetched list (may include scripts)

  // Basic generic handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Checkbox handler for arrays (userLevel, marketType, accountTypes, etc.)
  const handleCheckboxChange = (type, id) => {
    setFormData((prev) => {
      const current = prev[type] || [];
      const updated =
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

  // Fetch user levels & market types when userType === "3"
  useEffect(() => {
    if (formData.userType === "3") {
      const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");
      const payload = {
        is_app: 1,
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
      };

      axios
        .post(
          "http://128.199.126.171/~goldorg/ajaxfiles/get_mcx_script_type",
          payload,
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          if (res.data) {
            // store whatever API returns
            setUserLevels(res.data.user_level || []);
            setMarketTypes(res.data.market_type || []);
          }
        })
        .catch((err) => console.error("API Error:", err));
    } else {
      // clear fetched lists when not master
      setUserLevels([]);
      setMarketTypes([]);
    }
  }, [formData.userType]);
  

  // Initialize marketOptions when marketTypes change (or if defaultOptions change we propagate)
  useEffect(() => {
    if (!Array.isArray(marketTypes)) return;

    // Build keys:
    // - If marketTypes item includes a 'scripts' array, create entries per script (keyed by script id)
    // - Otherwise create an entry keyed by market_type_id
    const newMarketOptions = { ...formData.marketOptions };

    marketTypes.forEach((mkt) => {
      if (Array.isArray(mkt.scripts) && mkt.scripts.length > 0) {
        // mkt.scripts may contain objects; derive a string id for each
        mkt.scripts.forEach((sc) => {
          // robust key detection (fallback to string conversion)
          const scriptId =
            (sc && (sc.script || sc.script_id || sc.id || sc.market_type_id)) ||
            sc ||
            null;
          const key = String(scriptId);
          if (!newMarketOptions[key]) {
            newMarketOptions[key] = {
              minPctComm: formData.defaultOptions?.minPctComm || "",
              maxPctComm: formData.defaultOptions?.maxPctComm || "",
              minLotComm: formData.defaultOptions?.minLotComm || "",
              maxLotComm: formData.defaultOptions?.maxLotComm || "",
              marginLimit: formData.defaultOptions?.marginLimit || false,
              nextMarginLimit: formData.defaultOptions?.nextMarginLimit || false,
            };
          }
        });
      } else {
        // fallback to market_type_id as a key
        const key = String(mkt.market_type_id);
        if (!newMarketOptions[key]) {
          newMarketOptions[key] = {
            minPctComm: formData.defaultOptions?.minPctComm || "",
            maxPctComm: formData.defaultOptions?.maxPctComm || "",
            minLotComm: formData.defaultOptions?.minLotComm || "",
            maxLotComm: formData.defaultOptions?.maxLotComm || "",
            marginLimit: formData.defaultOptions?.marginLimit || false,
            nextMarginLimit: formData.defaultOptions?.nextMarginLimit || false,
          };
        }
      }
    });

    setFormData((prev) => ({ ...prev, marketOptions: newMarketOptions }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketTypes]);

  // When defaultOptions change, propagate values to existing marketOptions keys (but don't overwrite other custom fields)
  useEffect(() => {
    const keys = Object.keys(formData.marketOptions || {});
    if (keys.length === 0) return;

    setFormData((prev) => {
      const updated = { ...prev.marketOptions };
      keys.forEach((k) => {
        updated[k] = {
          ...updated[k],
          minPctComm:
            prev.defaultOptions?.minPctComm !== "" ? prev.defaultOptions.minPctComm : updated[k].minPctComm,
          maxPctComm:
            prev.defaultOptions?.maxPctComm !== "" ? prev.defaultOptions.maxPctComm : updated[k].maxPctComm,
          minLotComm:
            prev.defaultOptions?.minLotComm !== "" ? prev.defaultOptions.minLotComm : updated[k].minLotComm,
          maxLotComm:
            prev.defaultOptions?.maxLotComm !== "" ? prev.defaultOptions.maxLotComm : updated[k].maxLotComm,
          marginLimit: prev.defaultOptions?.marginLimit ?? updated[k].marginLimit,
          nextMarginLimit: prev.defaultOptions?.nextMarginLimit ?? updated[k].nextMarginLimit,
        };
      });
      return { ...prev, marketOptions: updated };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.defaultOptions.minPctComm, formData.defaultOptions.maxPctComm, formData.defaultOptions.minLotComm, formData.defaultOptions.maxLotComm, formData.defaultOptions.marginLimit, formData.defaultOptions.nextMarginLimit]);

    {/* Automatically populate MCX fields when component mounts or defaults change */}
  {useEffect(() => {
    if (!marketTypes) return;

    const updatedMarketOptions = marketTypes.reduce((acc, mkt) => {
      acc[mkt.market_type_id] = {
        minPctComm: formData.defaultOptions?.minPctComm || "",
        maxPctComm: formData.defaultOptions?.maxPctComm || "",
        minLotComm: formData.defaultOptions?.minLotComm || "",
        maxLotComm: formData.defaultOptions?.maxLotComm || "",
        ...formData.marketOptions?.[mkt.market_type_id],
      };
      return acc;
    }, {});

    setFormData((prev) => ({ ...prev, marketOptions: updatedMarketOptions }));
  }, [formData.defaultOptions, marketTypes])}
  // helper to update a specific market/script option
  const handleMarketOptionChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      marketOptions: {
        ...prev.marketOptions,
        [key]: { ...prev.marketOptions?.[key], [field]: value },
      },
    }));
  };

  // Build the API payload from formData
  const buildPayload = () => {
    const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");

    // markets array: convert ids to strings (API sample shows strings)
    const markets = (formData.marketType || []).map(String);

    // accountTypes fallback to selected userLevel if not explicitly provided
    const accountTypes =
      (formData.accountTypes && formData.accountTypes.length > 0)
        ? formData.accountTypes.map(String)
        : (formData.userLevel || []).map(String);

    // Build mcxScripts:
    // Two approaches:
    // 1) If marketTypes contains an item named "MCXFUT" with a scripts array, use that scripts array to build entries
    // 2) Otherwise, fallback to keys in marketOptions (which we initialized earlier)
    const mcxScripts = [];

    // find MCX market entry (if exists)
    const mcxMarket = (marketTypes || []).find(
      (m) => String(m.market_type_name).toUpperCase() === "MCXFUT"
    );

    if (mcxMarket && Array.isArray(mcxMarket.scripts) && mcxMarket.scripts.length > 0) {
      mcxMarket.scripts.forEach((sc) => {
        const scriptId =
          (sc && (sc.script || sc.script_id || sc.id || sc.market_type_id)) ||
          sc ||
          null;
        const key = String(scriptId);
        const opts = formData.marketOptions?.[key] || {};
        // Map to API naming: percentComm, percentCommMax, lotComm, lotCommMax
        mcxScripts.push({
          script: key,
          percentComm: parseFloat(opts.minPctComm || 0) || 0,
          percentCommMax: parseFloat(opts.maxPctComm || 0) || 0,
          lotComm: parseFloat(opts.minLotComm || 0) || 0,
          lotCommMax: parseFloat(opts.maxLotComm || 0) || 0,
        });
      });
    } else {
      // fallback: use keys in marketOptions (only include numeric-like keys to avoid picking up non-script keys)
      Object.keys(formData.marketOptions || {}).forEach((key) => {
        // optionally filter keys that are selected markets
        const opts = formData.marketOptions[key];
        if (!opts) return;
        mcxScripts.push({
          script: String(key),
          percentComm: parseFloat(opts.minPctComm || 0) || 0,
          percentCommMax: parseFloat(opts.maxPctComm || 0) || 0,
          lotComm: parseFloat(opts.minLotComm || 0) || 0,
          lotCommMax: parseFloat(opts.maxLotComm || 0) || 0,
        });
      });
    }

    const payload = {
      // session/auth fields (many endpoints expect them)
      is_app: 1,
      login_user_id: dataStored?.user_id,
      auth_key: dataStored?.auth_key,

      // main data fields as requested
      userType: Number(formData.userType) || 0,
      name: formData.name || "",
      password: formData.password || "",
      openingBalance: Number(formData.openingBalance) || 0,
      balanceType: Number(formData.balanceType) || 0,
      remarks: formData.remarks || "",
      freshLimitAllowed: formData.freshLimitAllowed === "yes" ? 1 : 0,
      short_trade_minutes: Number(formData.shortTradeAvoid) || 0,
      partnershipPercentage: Number(formData.partnership) || 0,
      partnershipType: Number(formData.partnershipType) || 0,
      markets: markets,
      accountTypes: accountTypes,
      nseLimit: Number(formData.nseLimit) || 0,
      nseLimit_max: Number(formData.nseLimit_max) || 0,
      nseMinPercentWise: parseFloat(formData.nseMinPercentWise || 0) || 0,
      nseMaxPercentWise: parseFloat(formData.nseMaxPercentWise || 0) || 0,
      mcxLimit: Number(formData.mcxLimit) || 0,
      mcxLimit_max: Number(formData.mcxLimit_max) || 0,
      // mcxScripts built above
      mcxScripts: mcxScripts,
    };

    return payload;
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = buildPayload();
    console.log("Payload to send:", payload);

    axios
      .post("http://128.199.126.171/~goldorg/ajaxfiles/create_user", payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log("Create user response:", res.data);
        // handle success UI as needed
      })
      .catch((err) => {
        console.error("Create user error:", err);
        // handle error UI as needed
      });
  };

  // helper render: show per-market/script commission fields for MCXFUT (mirrors your previous UI)
  const renderMcxSection = (mkt) => {
    // We'll render either per-script fields if scripts exist; otherwise render single group
    if (Array.isArray(mkt.scripts) && mkt.scripts.length > 0) {
      return mkt.scripts.map((sc) => {
        const scriptId =
          (sc && (sc.script || sc.script_id || sc.id || sc.market_type_id)) ||
          sc ||
          null;
        const key = String(scriptId);
        const opts = formData.marketOptions?.[key] || {};
        return (
          <div key={key} style={{ marginLeft: 32, marginTop: 12 }}>
            <FormControlLabel
              control={<Checkbox size="small" checked disabled />}
              label={sc && (sc.script_name || sc.name || String(key))}
            />
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <TextField
                label="percentComm"
                size="small"
                value={opts.minPctComm || ""}
                onChange={(e) => handleMarketOptionChange(key, "minPctComm", e.target.value)}
              />
              <TextField
                label="percentCommMax"
                size="small"
                value={opts.maxPctComm || ""}
                onChange={(e) => handleMarketOptionChange(key, "maxPctComm", e.target.value)}
              />
              <TextField
                label="lotComm"
                size="small"
                value={opts.minLotComm || ""}
                onChange={(e) => handleMarketOptionChange(key, "minLotComm", e.target.value)}
              />
              <TextField
                label="lotCommMax"
                size="small"
                value={opts.maxLotComm || ""}
                onChange={(e) => handleMarketOptionChange(key, "maxLotComm", e.target.value)}
              />
            </div>
          </div>
        );
      });
    }

    // fallback: single market entry keyed by market_type_id
    const key = String(mkt.market_type_id);
    const opts = formData.marketOptions?.[key] || {};
    return (
      <div key={key} style={{ marginLeft: 32, marginTop: 12 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked disabled />}
          label={mkt.market_type_name}
        />
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          <TextField
            label="minPctComm"
            size="small"
            value={opts.minPctComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "minPctComm", e.target.value)}
          />
          <TextField
            label="maxPctComm"
            size="small"
            value={opts.maxPctComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "maxPctComm", e.target.value)}
          />
          <TextField
            label="minLotComm"
            size="small"
            value={opts.minLotComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "minLotComm", e.target.value)}
          />
          <TextField
            label="maxLotComm"
            size="small"
            value={opts.maxLotComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "maxLotComm", e.target.value)}
          />
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        padding: "20px",
        fontSize: "0.9rem",
      }}
    >
      {/* Basic Details */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        Basic Details
      </Typography>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {/* User Type */}
        <div>
          <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>User Type</Typography>
          <Select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            fullWidth
            size="small"
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Type</em>
            </MenuItem>
            <MenuItem value="1">User</MenuItem>
            <MenuItem value="2">Broker</MenuItem>
            <MenuItem value="3">Master</MenuItem>
          </Select>
        </div>

        {/* Name */}
        <div>
          <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Name</Typography>
          <TextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
            fullWidth
            size="small"
          />
        </div>

        {/* Password */}
        <div>
          <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Password</Typography>
          <TextField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            fullWidth
            size="small"
          />
        </div>
      </div>

      {/* Master Options */}
     {formData.userType === "3" && (
  <>
    {/* Partnership + Short Trade */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      <div>
        <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>
          Partnership (%)
        </Typography>
        <TextField
          name="partnership"
          value={formData.partnership || ""}
          onChange={handleChange}
          placeholder="Enter %"
          fullWidth
          size="small"
        />
      </div>

      <div>
        <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>
          Short Trade Avoid
        </Typography>
        <TextField
          name="shortTradeAvoid"
          value={formData.shortTradeAvoid || ""}
          onChange={handleChange}
          placeholder="Enter Minutes"
          fullWidth
          size="small"
        />
      </div>
    </div>

    <Divider sx={{ mb: 2 }} />

    {/* Fresh Limit */}
    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
      Fresh Limit Allowed
    </Typography>
    <FormGroup row sx={{ mb: 2, "& .MuiFormControlLabel-root": { mr: 3 } }}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={formData.freshLimitAllowed === "yes"}
            onChange={() =>
              setFormData({ ...formData, freshLimitAllowed: "yes" })
            }
          />
        }
        label="Yes"
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={formData.freshLimitAllowed === "no"}
            onChange={() =>
              setFormData({ ...formData, freshLimitAllowed: "no" })
            }
          />
        }
        label="No"
      />
    </FormGroup>

    <Divider sx={{ mb: 2 }} />

    {/* User Level */}
    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
      User Level
    </Typography>
    <FormGroup
      row
      sx={{
        mb: 2,
        "& .MuiFormControlLabel-root": { mr: 3, minWidth: "160px" },
      }}
    >
      {userLevels.map((lvl) => (
        <FormControlLabel
          key={lvl.user_level_id}
          control={
            <Checkbox
              size="small"
              checked={formData.userLevel.includes(lvl.user_level_id)}
              onChange={() =>
                handleCheckboxChange("userLevel", lvl.user_level_id)
              }
            />
          }
          label={lvl.user_level_name}
        />
      ))}
    </FormGroup>

    <Divider sx={{ mb: 2 }} />

    {/* Market Type */}
   <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
  Market Type
</Typography>

{marketTypes.map((mkt) => {
  const isChecked = formData.marketType.includes(mkt.market_type_id);

  return (
    <div key={mkt.market_type_id} style={{ marginBottom: "16px" }}>
      {/* Main Market Type Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={isChecked}
            onChange={() =>
              handleCheckboxChange("marketType", mkt.market_type_id)
            }
          />
        }
        label={mkt.market_type_name}
      />

      {/* Nested Options */}
      {isChecked && (
        <>
          {/* -------------------- MCXFUT -------------------- */}
          {mkt.market_type_name === "MCXFUT" ? (
<>
  {/* Top checkboxes */}
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
          checked={formData.defaultOptions?.marginLimit || false}
          onChange={(e) =>
            setFormData({
              ...formData,
              defaultOptions: {
                ...formData.defaultOptions,
                marginLimit: e.target.checked,
              },
            })
          }
        />
      }
      label="Margin Limit"
    />
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={formData.defaultOptions?.nextMarginLimit || false}
          onChange={(e) =>
            setFormData({
              ...formData,
              defaultOptions: {
                ...formData.defaultOptions,
                nextMarginLimit: e.target.checked,
              },
            })
          }
        />
      }
      label="Next Margin Limit"
    />
  </FormGroup>

  {/* Default commission text fields */}
  <div style={{ display: "flex", gap: "12px", marginLeft: "32px", marginTop: "12px" }}>
    {["minPctComm", "maxPctComm", "minLotComm", "maxLotComm"].map((key) => (
      <TextField
        key={key}
        label={`Default ${key}`}
        size="small"
        value={formData.defaultOptions?.[key] || ""}
        onChange={(e) => {
          const value = e.target.value;
          setFormData((prev) => ({
            ...prev,
            defaultOptions: { ...prev.defaultOptions, [key]: value },
            // Apply to all MCX items
            marketOptions: prev.marketTypes?.reduce((acc, mkt) => {
              acc[mkt.market_type_id] = {
                ...prev.marketOptions?.[mkt.market_type_id],
                [key]: value,
              };
              return acc;
            }, {}),
          }));
        }}
      />
    ))}
  </div>

  {/* MCX Checkboxes + individual text fields */}
  {marketTypes.map((mcx) => (
    <div key={mcx.market_type_id} style={{ marginLeft: "32px", marginTop: "12px" }}>
      <FormControlLabel
        control={<Checkbox size="small" checked disabled />}
        label={mcx.market_type_name}
      />

      {/* MCX commission fields */}
      <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
        {["minPctComm", "maxPctComm", "minLotComm", "maxLotComm"].map((key) => (
          <TextField
            key={key}
            label={key}
            size="small"
            value={formData.marketOptions?.[mcx.market_type_id]?.[key] || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                marketOptions: {
                  ...prev.marketOptions,
                  [mcx.market_type_id]: {
                    ...prev.marketOptions?.[mcx.market_type_id],
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
                      formData.marketOptions?.[mkt.market_type_id]
                        ?.casinoAllowed || false
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketOptions: {
                          ...formData.marketOptions,
                          [mkt.market_type_id]: {
                            ...formData.marketOptions?.[mkt.market_type_id],
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
      key={key}
      label={key}                 // Label appears inside the text box
      size="small"
      variant="outlined"
      sx={{ minWidth: "150px" }}  // same width as your other fields
      value={formData.marketOptions?.[mkt.market_type_id]?.[key.replace(/ /g, "")] || ""}
      onChange={(e) => {
        const value = e.target.value;
        setFormData((prev) => ({
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
      key={key}
      label={key.replace(/([A-Z])/g, " $1")} // Adds space before capital letters
      size="small"
      value={formData.marketOptions?.[mkt.market_type_id]?.[key] || ""}
      onChange={(e) => {
        const value = e.target.value;
        setFormData((prev) => ({
          ...prev,
          marketOptions: {
            ...prev.marketOptions,
            [mkt.market_type_id]: {
              ...prev.marketOptions?.[mkt.market_type_id],
              [key]: value,
            },
          },
        }));
      }}
    />
  ))}
</div>


          )}
        </>
      )}
    </div>
  );
})}


    <Divider sx={{ mb: 2 }} />
  </>
)}

      {/* Remarks */}
      <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>Remarks</Typography>
      <TextField
        name="remarks"
        value={formData.remarks}
        onChange={handleChange}
        placeholder="Remarks"
        fullWidth
        multiline
        rows={3}
        size="small"
        sx={{ mb: 3 }}
      />

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <Button
          type="button"
          variant="contained"
          size="small"
          sx={{
            bgcolor: "error.main",
            "&:hover": { bgcolor: "error.dark" },
            textTransform: "none",
          }}
          onClick={() => {
            // simple reset - adjust behaviour as needed
            setFormData({
              userType: "",
              name: "",
              password: "",
              remarks: "",
              userLevel: [],
              marketType: [],
              partnership: "",
              shortTradeAvoid: "",
              freshLimitAllowed: null,
              defaultOptions: {
                minPctComm: "",
                maxPctComm: "",
                minLotComm: "",
                maxLotComm: "",
                marginLimit: false,
                nextMarginLimit: false,
              },
              marketOptions: {},
              accountTypes: [],
              openingBalance: 0,
              balanceType: 0,
              nseLimit: "",
              nseLimit_max: "",
              nseMinPercentWise: "",
              nseMaxPercentWise: "",
              mcxLimit: "",
              mcxLimit_max: "",
            });
            setUserLevels([]);
            setMarketTypes([]);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="small"
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            textTransform: "none",
          }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
