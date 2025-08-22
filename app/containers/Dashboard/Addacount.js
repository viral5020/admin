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
  Grid,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { RadioGroup } from "@mui/material";
import { Radio } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddAccountForm() {
  const [formData, setFormData] = useState({
    userType: "",
    name: "",
    password: "",
    remarks: "",
    userLevel: [], 
    marketType: [], 
     brokerName: [],
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

  const [userLevels, setUserLevels] = useState([]); 
  const [marketTypes, setMarketTypes] = useState([]); 
  const [Mcxscript, setMcxscript] = useState([]);
  const [BrokerList, setBrokerList] = useState([]);

  const [errors, setErrors] = useState({});

   const [open, setOpen] = useState(false);

  const validateForm = () => {
  let newErrors = {};

  if (!formData.userType) newErrors.userType = "User type is required";
  if (!formData.name) newErrors.name = "Name is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData.partnership) newErrors.partnership = "Partnership is required";
if (!formData.shortTradeAvoid) newErrors.shortTradeAvoid = "Short trade avoid time is required";
if (!formData.userLevel || formData.userLevel.length === 0) {
  newErrors.userLevel = "Please select at least one user level";
}
if (!formData.freshLimitAllowed || formData.freshLimitAllowed.length === 0) {
  newErrors.freshLimitAllowed = "Fresh Limit Allowed is required";
}

 if (!formData.marketType || formData.marketType.length === 0) {
    newErrors.marketType = "Please select at least one market type";
  }

  // 2. Check fields for each selected market
  formData.marketType.forEach((marketId) => {
    const mkt = marketTypes.find((m) => m.market_type_id === marketId);
    const opts = formData.marketOptions?.[marketId] || {};

    if (mkt?.market_type_name === "MCXFUT") {
      ["marginLimit", "nextMarginLimit", "minPctComm", "maxPctComm", "minLotComm", "maxLotComm"].forEach((field) => {
        if (!opts[field]) {
          newErrors[`market_${marketId}_${field}`] = `${field} is required`;
        }
      });
    } 
    else if (mkt?.market_type_name === "BINARY") {
      ["MarginLimit", "NextMarginLimit"].forEach((field) => {
        if (!opts[field]) {
          newErrors[`market_${marketId}_${field}`] = `${field} is required`;
        }
      });
    } 
    else if (["NSEFUT", "NSEOPT", "NSEEQT", "NSECDS", "MCXFUT","GLOBAL FUTURES", "FOREX","CRICKET","BINARY", "COMEX"].includes(mkt?.market_type_name)) {
      ["marginLimit", "nextMarginLimit", "minLotBrokerage", "maxLotBrokerage"].forEach((field) => {
        if (!opts[field]) {
          newErrors[`market_${marketId}_${field}`] = `${field} is required`;
        }
      });
    }
  });

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0; // true if no errors
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type, id) => {
    setFormData((prev) => {
      const current = prev[type] || [];
      const updated =
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

const marketConfig = {
  NSEFUT: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Percentage Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  NSEOPT: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Lot Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  NSEEQT: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Percentage Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  NSECDS: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Lot Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  "GLOBAL FUTURES": {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Percentage Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  FOREX: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Lot Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  COMEX: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
      {
        label: "NSE Option (Lot Wise)",
        type: "group",
        children: [
          { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
          { key: "intradayCommission", label: "Intraday Commission", type: "number" },
          { key: "deliveryBrokerCommission", label: "Delivery Broker Commission", type: "number" },
          { key: "deliveryIntradayCommission", label: "Delivery Intraday Commission", type: "number" },
        ],
      },
    ],
    hasBrokerCheckbox: true,
  },

  BINARY: {
    fields: [
      { key: "nseMarginLimit", label: "NSE Margin Limit", type: "number" },
      { key: "nseScriptLimit", label: "NSE Script Limit", type: "number" },
    ],
    hasBrokerCheckbox: false,
  },

  MCXFUT: {
    fields: [
      { key: "marginLimit", label: "Margin Limit", type: "number" },
      { key: "scriptLimit", label: "Script Limit", type: "number" },
    ],
    // hasBrokerageDropdown: true, // Brokerage Type (Lot Wise / Percentage Wise)
    // hasScriptWiseCheckbox: true, // Script Wise Value = 1
    hasMcxScripts: true,         // Fetch MCX Scripts
  },
};



  useEffect(() => {
    if (formData.userType === "3" || formData.userType === "1") {
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
            setUserLevels(res.data.user_level || []);
            setMarketTypes(res.data.market_type || []);
            setMcxscript(res.data.mcx_script || []);
            setBrokerList(res.data.broker_list || []);
          }
        })
        .catch((err) => console.error("API Error:", err));
    } else {
      setUserLevels([]);
      setMarketTypes([]);
       setMcxscript([]);
       setBrokerList([]);
    }
  }, [formData.userType]);
  


 // ✅ Initialize marketOptions based on mcxscript + defaultOptions
useEffect(() => {
  if (!Array.isArray(Mcxscript)) return;

  const updatedOptions = Mcxscript.reduce((acc, sc) => {
    const key = String(sc.script_id);

    acc[key] = {
      // keep old values if any
      ...formData.marketOptions?.[key],

      // fallback to defaultOptions if not set
      minPctComm: formData.marketOptions?.[key]?.minPctComm ?? formData.defaultOptions?.minPctComm ?? "",
      maxPctComm: formData.marketOptions?.[key]?.maxPctComm ?? formData.defaultOptions?.maxPctComm ?? "",
      minLotComm: formData.marketOptions?.[key]?.minLotComm ?? formData.defaultOptions?.minLotComm ?? "",
      maxLotComm: formData.marketOptions?.[key]?.maxLotComm ?? formData.defaultOptions?.maxLotComm ?? "",
      marginLimit: formData.marketOptions?.[key]?.marginLimit ?? formData.defaultOptions?.marginLimit ?? "",
      nextMarginLimit: formData.marketOptions?.[key]?.nextMarginLimit ?? formData.defaultOptions?.nextMarginLimit ?? "",
    };

    return acc;
  }, {});

  setFormData((prev) => ({ ...prev, marketOptions: updatedOptions }));
}, [Mcxscript, formData.defaultOptions]);

useEffect(() => {
  if (!Array.isArray(Mcxscript) || Mcxscript.length === 0) return;

  setFormData((prev) => {
    const updated = { ...prev.marketOptions };

    Mcxscript.forEach((sc) => {
      const key = String(
        sc?.script_id || sc?.id || sc?.script || sc?.market_type_id
      );

      updated[key] = {
        ...updated[key], // preserve user changes if already typed

        // Always pull defaults if available, else keep old, else blank
        minPctComm:
          prev.defaultOptions?.minPctComm ??
          updated[key]?.minPctComm ??
          "",
        maxPctComm:
          prev.defaultOptions?.maxPctComm ??
          updated[key]?.maxPctComm ??
          "",
        minLotComm:
          prev.defaultOptions?.minLotComm ??
          updated[key]?.minLotComm ??
          "",
        maxLotComm:
          prev.defaultOptions?.maxLotComm ??
          updated[key]?.maxLotComm ??
          "",
        marginLimit:
          prev.defaultOptions?.marginLimit ??
          updated[key]?.marginLimit ??
          false,
        nextMarginLimit:
          prev.defaultOptions?.nextMarginLimit ??
          updated[key]?.nextMarginLimit ??
          false,
      };
    });

    return { ...prev, marketOptions: updated };
  });
}, [
  Mcxscript,
  formData.defaultOptions?.minPctComm,
  formData.defaultOptions?.maxPctComm,
  formData.defaultOptions?.minLotComm,
  formData.defaultOptions?.maxLotComm,
  formData.defaultOptions?.marginLimit,
  formData.defaultOptions?.nextMarginLimit,
]);



  // useEffect(() => {
  //   const keys = Object.keys(formData.marketOptions || {});
  //   if (keys.length === 0) return;

  //   setFormData((prev) => {
  //     const updated = { ...prev.marketOptions };
  //     keys.forEach((k) => {
  //       updated[k] = {
  //         ...updated[k],
  //         minPctComm:
  //           prev.defaultOptions?.minPctComm !== "" ? prev.defaultOptions.minPctComm : updated[k].minPctComm,
  //         maxPctComm:
  //           prev.defaultOptions?.maxPctComm !== "" ? prev.defaultOptions.maxPctComm : updated[k].maxPctComm,
  //         minLotComm:
  //           prev.defaultOptions?.minLotComm !== "" ? prev.defaultOptions.minLotComm : updated[k].minLotComm,
  //         maxLotComm:
  //           prev.defaultOptions?.maxLotComm !== "" ? prev.defaultOptions.maxLotComm : updated[k].maxLotComm,
  //         marginLimit: prev.defaultOptions?.marginLimit ?? updated[k].marginLimit,
  //         nextMarginLimit: prev.defaultOptions?.nextMarginLimit ?? updated[k].nextMarginLimit,
  //       };
  //     });
  //     return { ...prev, marketOptions: updated };
  //   });
  // }, [formData.defaultOptions.minPctComm, formData.defaultOptions.maxPctComm, formData.defaultOptions.minLotComm, formData.defaultOptions.maxLotComm, formData.defaultOptions.marginLimit, formData.defaultOptions.nextMarginLimit]);
  
  // {useEffect(() => {
  //   if (!marketTypes) return;

  //   const updatedMarketOptions = marketTypes.reduce((acc, mkt) => {
  //     acc[mkt.market_type_id] = {
  //       minPctComm: formData.defaultOptions?.minPctComm || "",
  //       maxPctComm: formData.defaultOptions?.maxPctComm || "",
  //       minLotComm: formData.defaultOptions?.minLotComm || "",
  //       maxLotComm: formData.defaultOptions?.maxLotComm || "",
  //       ...formData.marketOptions?.[mkt.market_type_id],
  //     };
  //     return acc;
  //   }, {});

  //   setFormData((prev) => ({ ...prev, marketOptions: updatedMarketOptions }));
  // }, [formData.defaultOptions, marketTypes])}

 const handleMarketOptionChange = (key, field, value) => {
  setFormData((prev) => ({
    ...prev,
    marketOptions: {
      ...prev.marketOptions,
      [key]: { ...prev.marketOptions?.[key], [field]: value },
    },
  }));
};


const buildPayload = () => {
  const dataStored = JSON.parse(sessionStorage.getItem("data") || "{}");

  const numOrZero = (v) =>
    v !== "" && v !== null && v !== undefined ? Number(v) : 0;

  // 🔑 Map backend field prefixes
  const marketKeyMap = {
    NSEFUT: "nse",
    NSECASH: "nseCash",
    BSEFUT: "bse",
    FOREX: "forex",
    BINARY: "binary",
    CRICKET: "cricket",
    MCXFUT: "mcx", // but mcx has special script logic
    // add more if backend expects different prefixes
  };

  const payload = {
    is_app: 1,
    login_user_id: dataStored?.user_id,
    auth_key: dataStored?.auth_key,
    freshLimitAllowed: formData.freshLimitAllowed === "yes" ? 1 : 0,
  };

  // ---------- General User Fields ----------
  if ("userType" in formData) payload.userType = numOrZero(formData.userType);
  if ("name" in formData) payload.name = formData.name || "";
  if ("password" in formData) payload.password = formData.password || "";
  if ("openingBalance" in formData) payload.openingBalance = numOrZero(formData.openingBalance);
  if ("balanceType" in formData) payload.balanceType = numOrZero(formData.balanceType);
  if ("remarks" in formData) payload.remarks = formData.remarks || "";
  if ("shortTradeAvoid" in formData) payload.short_trade_minutes = numOrZero(formData.shortTradeAvoid);
  if ("partnership" in formData) payload.partnershipPercentage = numOrZero(formData.partnership);
  if ("partnershipType" in formData) payload.partnershipType = numOrZero(formData.partnershipType);

  // ---------- Dropdown Fields ----------
  if (formData.marketType?.length)
    payload.markets = formData.marketType.map(String);

  if (formData.accountTypes?.length || formData.userLevel?.length) {
    payload.accountTypes = (formData.accountTypes?.length
      ? formData.accountTypes
      : formData.userLevel
    ).map(String);
  }

  // ---------- Market Specific Handling ----------
  const mcxScripts = [];

  (formData.marketType || []).forEach((mktId) => {
    const opts = formData.marketOptions?.[mktId] || {};
    const mkt = marketTypes.find((m) => m.market_type_id === mktId);
    if (!mkt) return;

    const prefix = marketKeyMap[mkt.market_type_name];

 switch (mkt.market_type_name) {
  case "MCXFUT":
    // Top-level MCX limits
    if ("marginLimit" in opts)
      payload.mcxLimit = numOrZero(opts.marginLimit);
    if ("nextMarginLimit" in opts)
      payload.mcxLimit_max = numOrZero(opts.nextMarginLimit);

    // Commission % wise
    if ("minLotBrokerage" in opts)
      payload.mcxMinPercentWise = numOrZero(opts.minLotBrokerage);
    if ("maxLotBrokerage" in opts)
      payload.mcxMaxPercentWise = numOrZero(opts.maxLotBrokerage);

    // Per-script commissions
    (Mcxscript || []).forEach((sc) => {
      const scOpts = formData.marketOptions?.[sc.script_id] || {};
      mcxScripts.push({
        script: String(sc.script_id),
        percentComm: numOrZero(scOpts.minPctComm ?? formData.defaultOptions?.minPctComm),
        percentCommMax: numOrZero(scOpts.maxPctComm ?? formData.defaultOptions?.maxPctComm),
        lotComm: numOrZero(scOpts.minLotComm ?? formData.defaultOptions?.minLotComm),
        lotCommMax: numOrZero(scOpts.maxLotComm ?? formData.defaultOptions?.maxLotComm),
      });
    });
    break;

  case "NSEFUT":
  case "NSECASH":
  case "BSEFUT":
  case "GLOBAL":
  case "FOREX":
  case "COMEX":
    if ("marginLimit" in opts)
      payload[`${prefix}Limit`] = numOrZero(opts.marginLimit);
    if ("nextMarginLimit" in opts)
      payload[`${prefix}Limit_max`] = numOrZero(opts.nextMarginLimit);

    // Commission % wise
    if ("minLotBrokerage" in opts)
      payload[`${prefix}MinPercentWise`] = numOrZero(opts.minLotBrokerage);
    if ("maxLotBrokerage" in opts)
      payload[`${prefix}MaxPercentWise`] = numOrZero(opts.maxLotBrokerage);
    break;

  case "BINARY":
    if ("MarginLimit" in opts)
      payload[`${prefix}Limit`] = numOrZero(opts.MarginLimit);
    if ("NextMarginLimit" in opts)
      payload[`${prefix}Limit_max`] = numOrZero(opts.NextMarginLimit);

    // Commission % wise
    if ("minLotBrokerage" in opts)
      payload[`${prefix}MinPercentWise`] = numOrZero(opts.minLotBrokerage);
    if ("maxLotBrokerage" in opts)
      payload[`${prefix}MaxPercentWise`] = numOrZero(opts.maxLotBrokerage);
    break;

  case "CRICKET":
    payload[`${prefix}Limit`] =
      opts.casinoAllowed !== undefined ? (opts.casinoAllowed ? 1 : 0) : null;
    break;

  default:
    if (!prefix) return;
    if ("marginLimit" in opts)
      payload[`${prefix}Limit`] = numOrZero(opts.marginLimit);
    if ("nextMarginLimit" in opts)
      payload[`${prefix}Limit_max`] = numOrZero(opts.nextMarginLimit);

    // Default → lot wise commission
    if ("minLotBrokerage" in opts)
      payload[`${prefix}MinLotWise`] = numOrZero(opts.minLotBrokerage);
    if ("maxLotBrokerage" in opts)
      payload[`${prefix}MaxLotWise`] = numOrZero(opts.maxLotBrokerage);
    break;
}


  });

  if (mcxScripts.length) payload.mcxScripts = mcxScripts;

  return payload;
};

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

      if (!validateForm()) {
    console.log("Validation failed:", errors);
    return; // stop API call
  }
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


  const renderMcxSection = (mkt) => {
   
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
      error={!!errors.userType} // show red border if error
    >
      <MenuItem value="">
        <em>Select Type</em>
      </MenuItem>
      <MenuItem value="1">User</MenuItem>
      <MenuItem value="2">Broker</MenuItem>
      <MenuItem value="3">Master</MenuItem>
    </Select>
    {errors.userType && (
      <Typography color="error" sx={{ fontSize: "0.75rem" }}>
        {errors.userType}
      </Typography>
    )}
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
      error={!!errors.name}
      helperText={errors.name}
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
      error={!!errors.password}
      helperText={errors.password}
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
  {/* Partnership (%) */}
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
      error={!!errors.partnership}
      helperText={errors.partnership}
    />
  </div>

  {/* Short Trade Avoid */}
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
      error={!!errors.shortTradeAvoid}
      helperText={errors.shortTradeAvoid}
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
     <Typography color="error" sx={{ fontSize: "0.75rem", mt: -1, mb: 1 }}>
    {errors.freshLimitAllowed}
  </Typography>

    <Divider sx={{ mb: 2 }} />

    {/* User Level */}
    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
      User Level
    </Typography>
        <FormControl fullWidth size="small">
      <InputLabel>User Level</InputLabel>
      <Select
        value={formData.userLevel || ""}
        onChange={(e) => setFormData({ ...formData, userLevel: e.target.value })}
         multiple // optional, if you want multi-select
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        MenuProps={{
          PaperProps: {
            sx: {
              width: 300, // dropdown width
              maxHeight: 250,
              p: 1,
            },
          },
        }}
      >
        {/* Close Button on top */}
        {/* <MenuItem
          disabled
          sx={{ justifyContent: "flex-end", minHeight: "32px", pt: 0 }}
        >
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            sx={{ ml: "auto", mr: 0 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </MenuItem> */}

        {userLevels.map((lvl) => (
          <MenuItem key={lvl.user_level_id} value={lvl.user_level_id}>
            {lvl.user_level_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {errors.userLevel && (
  <Typography color="error" sx={{ fontSize: "0.75rem", mt: -1, mb: 1 }}>
    {errors.userLevel}
  </Typography>
)}

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
              <div style={{ display: "flex", gap: "12px", marginLeft: "32px", marginTop: "12px" }}>
                <TextField
                  label="Margin Limit"
                  size="small"
                  type="number"
                  value={formData.defaultOptions?.marginLimit || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultOptions: {
                        ...formData.defaultOptions,
                        marginLimit: e.target.value,  // keep as string for input
                      },
                    })
                  }
                />

<TextField
  label="Next Margin Limit"
  size="small"
  type="number"
  value={formData.defaultOptions?.nextMarginLimit || ""}
  onChange={(e) =>
    setFormData({
      ...formData,
      defaultOptions: {
        ...formData.defaultOptions,
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
                    key={key}
                    label={`Default ${key}`}
                    size="small"
                    value={formData.defaultOptions?.[key] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
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
                        key={key}
                        label={key}
                        size="small"
                        value={formData.marketOptions?.[script.script_id]?.[key] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
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
                        type="number"
                        value={formData.marketOptions?.[mkt.market_type_id]?.[key] ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => ({
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
                         error={!!errors[`market_${mkt.market_type_id}_${key}`]}
    helperText={errors[`market_${mkt.market_type_id}_${key}`]}
                      />
                    ))}

                  </div>


          )}
        </>
      )}
    </div>
  );
})}


{errors.marketType && (
  <Typography color="error" sx={{ fontSize: "0.75rem", mt: -1, mb: 1 }}>
    {errors.marketType}
  </Typography>
)}

    <Divider sx={{ mb: 2 }} />
  </>
)}

      {/* Broker Options */}
     {formData.userType === "2" && (
  <>
    <Divider sx={{ mb: 2 }} />
  </>
)}

{/* User Options */}
{formData.userType === "1" && (
  <>
    <Divider sx={{ mb: 2 }} />

    {/* ================= ACCOUNT DETAILS ================= */}
    <div style={{ padding: 12 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        ACCOUNT DETAILS
      </Typography>

     
<Grid container spacing={2}>
  {/* Order Outside of High Low */}
  <Grid item xs={4}>
    <FormControl fullWidth>
      <Typography>Order Outside of High Low</Typography>
      <RadioGroup
        row
        value={formData.orderOutsideHighLow}
        onChange={(e) =>
          handleChange("orderOutsideHighLow", e.target.value)
        }
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* Apply Auto Square */}
  <Grid item xs={4}>
    <FormControl fullWidth>
      <Typography>Apply Auto Square</Typography>
      <RadioGroup
        row
        value={formData.applyAutoSquare}
        onChange={(e) => handleChange("applyAutoSquare", e.target.value)}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* Intra Day Auto Square */}
  <Grid item xs={4}>
    <FormControl fullWidth>
      <Typography>Intra Day Auto Square</Typography>
      <RadioGroup
        row
        value={formData.intradayAutoSquare}
        onChange={(e) =>
          handleChange("intradayAutoSquare", e.target.value)
        }
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* Only Position Squareoff */}
  <Grid item xs={4}>
    <FormControl fullWidth>
      <Typography>Only Position Squareoff</Typography>
      <RadioGroup
        row
        value={formData.onlyPositionSquareoff}
        onChange={(e) =>
          handleChange("onlyPositionSquareoff", e.target.value)
        }
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* MTM Linked with Ledger (Stock) */}
  <Grid item xs={4}>
    <FormControl fullWidth>
      <Typography>MTM Linked with Ledger (Stock)</Typography>
      <RadioGroup
        row
        value={formData.mtmLinkedLedger}
        onChange={(e) => handleChange("mtmLinkedLedger", e.target.value)}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* Apply Auto Square Forex/Comex */}
  <Grid item xs={4}>
    <FormControl fullWidth>
      <Typography>Apply Auto Square (Forex/Comex)</Typography>
      <RadioGroup
        row
        value={formData.applyAutoSquareForex}
        onChange={(e) =>
          handleChange("applyAutoSquareForex", e.target.value)
        }
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* Other TextFields */}
    {/* Row 1 */}
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      size="small"
      label="Close Alert Margin (Forex/Comex)"
      value={formData.closeAlertMarginForex}
      onChange={(e) => handleChange("closeAlertMarginForex", e.target.value)}
    />
  </Grid>
  <Grid item xs={12} md={4}>
 <FormControl fullWidth size="small">
      <InputLabel>Broker Name</InputLabel>
      <Select
  multiple
  value={formData.brokerName || []} // <-- make sure it's array
  onChange={(e) =>
    setFormData((prev) => ({
      ...prev,
      brokerName: e.target.value, // 👈 all selected brokers
    }))
  }
  MenuProps={{
    disablePortal: true,
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
    PaperProps: { style: { maxHeight: 200 } },
  }}
>
  {BrokerList.map((broker) => (
    <MenuItem key={broker.broker_id} value={broker.broker_id}>
      {broker.broker_name}
    </MenuItem>
  ))}
</Select>

    </FormControl>


  </Grid>
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      size="small"
      label="Loss Alert Percentage (Forex/Comex)"
      value={formData.lossAlertPercentageForex}
      onChange={(e) => handleChange("lossAlertPercentageForex", e.target.value)}
    />
  </Grid>

  {/* Row 2 */}
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      size="small"
      label="Loss Alert Percentage"
      value={formData.lossAlertPercentage}
      onChange={(e) => handleChange("lossAlertPercentage", e.target.value)}
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      size="small"
      label="Close Alert Margin"
      value={formData.closeAlertMargin}
      onChange={(e) => handleChange("closeAlertMargin", e.target.value)}
    />
  </Grid>
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      size="small"
      label="Min Rate Stop Amount"
      value={formData.minRateStopAmount}
      onChange={(e) => handleChange("minRateStopAmount", e.target.value)}
    />
  </Grid>

  {/* Row 3 */}
  <Grid item xs={12} md={4}>
    <TextField
      fullWidth
      size="small"
      label="Short Trade Avoid"
      value={formData.shortTradeAvoid}
      onChange={(e) => handleChange("shortTradeAvoid", e.target.value)}
    />
  </Grid>
</Grid>
    </div>

    <Divider sx={{ my: 2 }} />

    {/* ================= ADDITIONAL DETAILS ================= */}
    <div style={{ padding: 12 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        ADDITIONAL DETAILS
      </Typography>

 <Grid container spacing={2}>
  {/* Account Type Dropdown */}
  <Grid item xs={6}>
    <FormControl fullWidth size="small">
      <InputLabel>User Level</InputLabel>
      <Select
        value={formData.userLevel || ""}
        onChange={(e) => setFormData({ ...formData, userLevel: e.target.value })}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        MenuProps={{
          PaperProps: {
            sx: {
              width: 300,
              maxHeight: 250,
              p: 1,
            },
          },
        }}
      >
        {userLevels.map((lvl) => (
          <MenuItem key={lvl.user_level_id} value={lvl.user_level_id}>
            {lvl.user_level_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  {/* Market Type Section */}
  <Grid item xs={12}>
    <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
      Market Type
    </Typography>

    {marketTypes.map((mkt) => {
      const isChecked = formData.marketType.includes(mkt.market_type_id);
      const config = marketConfig[mkt.market_type_name];
      const selectedBrokers = formData.brokerName || [];

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

          {isChecked && config && (
            <div style={{ marginLeft: "32px", marginTop: "12px" }}>
              {/* === MCXFUT-specific section === */}
              {mkt.market_type_name === "MCXFUT" && (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Margin Limit"
                      size="small"
                      type="number"
                      fullWidth
                      value={formData.marketOptions?.MCXFUT?.marginLimit || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          marketOptions: {
                            ...prev.marketOptions,
                            MCXFUT: {
                              ...prev.marketOptions?.MCXFUT,
                              marginLimit: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Script Limit"
                      size="small"
                      type="number"
                      fullWidth
                      value={formData.marketOptions?.MCXFUT?.scriptLimit || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          marketOptions: {
                            ...prev.marketOptions,
                            MCXFUT: {
                              ...prev.marketOptions?.MCXFUT,
                              scriptLimit: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Commission Type</InputLabel>
                      <Select
                        value={formData.marketOptions?.MCXFUT?.commissionType || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            marketOptions: {
                              ...prev.marketOptions,
                              MCXFUT: {
                                ...prev.marketOptions?.MCXFUT,
                                commissionType: e.target.value,
                              },
                            },
                          }))
                        }
                      >
                        <MenuItem value={1}>Script Wise (1)</MenuItem>
                        <MenuItem value={0}>Same for All (0)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Brokerage Type</InputLabel>
                      <Select
                        value={formData.marketOptions?.MCXFUT?.brokerageType || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            marketOptions: {
                              ...prev.marketOptions,
                              MCXFUT: {
                                ...prev.marketOptions?.MCXFUT,
                                brokerageType: e.target.value,
                              },
                            },
                          }))
                        }
                      >
                        <MenuItem value={2}>Percentage Wise</MenuItem>
                        <MenuItem value={0}>MCX Lot Wise</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Global Commission Fields */}
                  {["deliveryCommission", "intradayCommission", "deliveryBrokerCommission", "intradayBrokerCommission"].map(
                    (key) => (
                      <Grid item xs={6} key={key}>
                        <TextField
                          label={{
                            deliveryCommission: "Delivery Commission",
                            intradayCommission: "Intraday Commission",
                            deliveryBrokerCommission: "Delivery Broker Commission",
                            intradayBrokerCommission: "Intraday Broker Commission",
                          }[key]}
                          size="small"
                          type="number"
                          fullWidth
                          value={formData.marketOptions?.MCXFUT?.[key] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              marketOptions: {
                                ...prev.marketOptions,
                                MCXFUT: {
                                  ...prev.marketOptions?.MCXFUT,
                                  [key]: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </Grid>
                    )
                  )}

                  {/* Script-wise MCX commissions */}
                  {formData.marketOptions?.MCXFUT?.commissionType === 1 &&
                    config.hasMcxScripts &&
                    Mcxscript.map((script) => (
                      <Grid item xs={12} key={script.script_id} style={{ marginBottom: "12px" }}>
                        <FormControlLabel
                          control={<Checkbox size="small" checked disabled />}
                          label={script.script_name}
                        />
                        <Grid container spacing={2} style={{ marginTop: "8px", marginLeft: "24px" }}>
                          {["deliveryCommission", "intradayCommission", "deliveryBrokerCommission", "intradayBrokerCommission"].map(
                            (key) => (
                              <Grid item xs={6} key={key}>
                                <TextField
                                  label={{
                                    deliveryCommission: "Delivery Commission",
                                    intradayCommission: "Intraday Commission",
                                    deliveryBrokerCommission: "Delivery Broker Commission",
                                    intradayBrokerCommission: "Intraday Broker Commission",
                                  }[key]}
                                  size="small"
                                  type="number"
                                  fullWidth
                                  value={formData.marketOptions?.MCXFUT?.[key] || ""}
                                  InputProps={key === "deliveryCommission" ? { readOnly: true } : {}}
                                  onChange={
                                    key === "deliveryCommission"
                                      ? undefined
                                      : (e) =>
                                          setFormData((prev) => ({
                                            ...prev,
                                            marketOptions: {
                                              ...prev.marketOptions,
                                              MCXFUT: {
                                                ...prev.marketOptions?.MCXFUT,
                                                [key]: e.target.value,
                                              },
                                            },
                                          }))
                                  }
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              )}

              {/* === Generic fields for other markets === */}
              {mkt.market_type_name !== "MCXFUT" && config.fields?.map((field) => {
                if (field.type === "group") {
                  return (
                    <div key={field.label} style={{ marginTop: "12px" }}>
                      <strong>{field.label}</strong>
                      {selectedBrokers.map((brokerId, brokerIndex) => {
                        const brokerName = BrokerList.find((b) => b.broker_id === brokerId)?.broker_name || `Broker ${brokerIndex + 1}`;
                        return (
                          <div key={brokerId} style={{ marginLeft: "24px", marginTop: "8px" }}>
                            <h4>{brokerName}</h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                              {field.children.map((child, childIndex) => {
                                const isReadOnly = brokerIndex > 0 && childIndex < 2;
                                const value = isReadOnly
                                  ? formData.marketOptions?.[mkt.market_type_id]?.[`${field.children[childIndex].key}_${selectedBrokers[0]}`] || ""
                                  : formData.marketOptions?.[mkt.market_type_id]?.[`${child.key}_${brokerId}`] || "";
                                return (
                                  <TextField
                                    key={`${child.key}_${brokerId}`}
                                    label={`${child.label} (${brokerName})`}
                                    size="small"
                                    type={child.type}
                                    value={value}
                                    InputProps={{ readOnly: isReadOnly }}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setFormData((prev) => ({
                                        ...prev,
                                        marketOptions: {
                                          ...prev.marketOptions,
                                          [mkt.market_type_id]: {
                                            ...prev.marketOptions?.[mkt.market_type_id],
                                            [`${child.key}_${brokerId}`]: newValue,
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return (
                  <TextField
                    key={field.key}
                    label={field.label}
                    size="small"
                    type={field.type}
                    value={formData.marketOptions?.[mkt.market_type_id]?.[field.key] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        marketOptions: {
                          ...prev.marketOptions,
                          [mkt.market_type_id]: {
                            ...prev.marketOptions?.[mkt.market_type_id],
                            [field.key]: value,
                          },
                        },
                      }));
                    }}
                  />
                );
              })}

              {/* Optional Brokerage dropdown */}
              {config.hasBrokerageDropdown && (
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Brokerage Type</InputLabel>
                  <Select
                    value={formData.marketOptions?.[mkt.market_type_id]?.brokerageType || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        marketOptions: {
                          ...prev.marketOptions,
                          [mkt.market_type_id]: {
                            ...prev.marketOptions?.[mkt.market_type_id],
                            brokerageType: e.target.value,
                          },
                        },
                      }))
                    }
                  >
                    <MenuItem value="2">Percentage Wise</MenuItem>
                    <MenuItem value="0">Lot Wise</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Optional Script-wise checkbox */}
              {config.hasScriptWiseCheckbox && (
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Script Wise Value = 1"
                  style={{ display: "block", marginTop: "12px" }}
                />
              )}

         
            </div>
          )}
        </div>
      );
    })}
  </Grid>
</Grid>


    </div>
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
