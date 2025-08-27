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
import { formatArrPayload, MCXFUT_id } from "./helpers/utilFunc";
import BrokerFields from "./Add User/BrokerFields";
import McxScriptFields from "./Add User/McxScriptFields";
import { addAccountAPI } from "./API/API";
import { Bounce, ToastContainer, toast } from 'react-toastify';

// 🔑 Map backend field prefixes
const marketKeyMap = {
  // NSECASH: "nseCash",
  NSEFUT: "nse",
  NSEOPT: "nseO",
  NSEEQT: "nseEqt",
  NSECDS: 'ncds',

  MCXFUT: "mcx",

  COMEX: 'comex',
  "GLOBAL FUTURES": 'global',
  FOREX: "forex",
  BINARY: "binary",
  CRICKET: "cricket",
  // add more if backend expects different prefixes
};

const masterFields = {
  userType: "",
  name: "",
  password: "",
  remarks: "",

  openingBalance: 0,
  balanceType: 0,

  userLevel: [],
  markets: [],
  partnership: "",
  shortTradeAvoid: "",
  freshLimitAllowed: null,
  brokerName: [], //

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

  nseLimit: "",
  nseLimit_max: "",
  nseMinPercentWise: "",
  nseMaxPercentWise: "",
  mcxLimit: "",
  mcxLimit_max: "",
}

const userFields = {
  userType: "",
  name: "",
  password: "",
  remarks: "",

  openingBalance: 0,
  balanceType: 0,

  highLow: null,
  applySquare: null,
  intraSquare: null,
  onlyPosition: null,
  mtmLinkedWithLedger: '',
  applySquareForex: '',

  broker: "",
  lossAlert: "",
  closeAlert: "",
  lossAlertForex: "",
  closeAlertForex: "",
  addUserTradeAmount: null,
  short_trade_minutes: null,

  markets: [],
  userLevel: "",  // ?

  // nseLimit: '',
  // nsescriptLimit: '',
  // nseFirstSell: '',
  // nseUnmatched: '',
  // nseScripts: [{ script: "all", deliveryComm: 0.001, intraComm: 0.001 }],

  // mcxLimit: '',
  // mcxscriptLimit: '',
  // mcxCommissionType: '',
  // mcxBrokerageType: '',
  // mcxScripts: [],
  // mcxFirstSell: false,
  // mcxUnmatched: false,
}

const numOrZero = (v) =>
  v !== "" && v !== null && v !== undefined ? Number(v) : 0;

export default function AddAccountForm() {
  const [userType, setUserType] = useState("")
  const [commonFormData, setCommonFormData] = useState({ password: '', name: '', userType: '', remarks: '' });

  const [masterFormData, setMasterFormData] = useState(masterFields);
  const [userFormData, setUserFormData] = useState(userFields);
  const [brokerFormData, setBrokerFormData] = useState({ userType: '', password: '', name: '', remarks: '' })

  const [userLevels, setUserLevels] = useState([]);
  const [marketTypes, setMarketTypes] = useState([]);
  const [Mcxscript, setMcxscript] = useState([]);
  const [BrokerList, setBrokerList] = useState([]);

  const [errors, setErrors] = useState({});
  const [masterError, setMasterError] = useState({});
  const [userError, setUserError] = useState({});
  const [brokerError, setBrokerError] = useState({});

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userType == "1") {
      const { password, name, remarks } = userFormData;
      setCommonFormData(prev => ({ ...prev, password, name, remarks }));
    } else if (userType == "2") {
      const { password, name, remarks } = brokerFormData;
      setCommonFormData(prev => ({ ...prev, password, name, remarks }));
    } else if (userType == "3") {
      const { password, name, remarks } = masterFormData;
      setCommonFormData(prev => ({ ...prev, password, name, remarks }));
    }
  }, [userType])

  const valiadetCommonFields = () => {
    let newErrors = {};
    if (!commonFormData.userType) newErrors.userType = "User type is required";
    if (!masterFormData.name) newErrors.name = "Name is required";
    if (!masterFormData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  }

  const validateMasterForm = () => {
    let commonFieldError = valiadetCommonFields();
    let newErrors = {};
    if (masterFormData.userType == 3) {
      // if (!masterFormData.userType) newErrors.userType = "User type is required";
      // if (!masterFormData.name) newErrors.name = "Name is required";
      // if (!masterFormData.password) newErrors.password = "Password is required";
      if (!masterFormData.partnership) newErrors.partnership = "Partnership is required";
      if (!masterFormData.shortTradeAvoid) newErrors.shortTradeAvoid = "Short trade avoid time is required";
      if (!masterFormData.userLevel || masterFormData.userLevel.length === 0) {
        newErrors.userLevel = "Please select at least one user level";
      }
      if (!masterFormData.freshLimitAllowed || masterFormData.freshLimitAllowed.length === 0) {
        newErrors.freshLimitAllowed = "Fresh Limit Allowed is required";
      }

      if (!masterFormData.markets || masterFormData.markets.length === 0) {
        newErrors.markets = "Please select at least one market type";
      }

      // 2. Check fields for each selected market
      masterFormData.markets.forEach((marketId) => {
        const mkt = marketTypes.find((m) => m.market_type_id === marketId);
        const opts = masterFormData.marketOptions?.[marketId] || {};

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
        else if (["NSEFUT", "NSEOPT", "NSEEQT", "NSECDS", "MCXFUT", "GLOBAL FUTURES", "FOREX", "CRICKET", "BINARY", "COMEX"].includes(mkt?.market_type_name)) {
          ["marginLimit", "nextMarginLimit", "minLotBrokerage", "maxLotBrokerage"].forEach((field) => {
            if (!opts[field]) {
              newErrors[`market_${marketId}_${field}`] = `${field} is required`;
            }
          });
        }
      });
    }
    setMasterError(newErrors);

    return Object.keys(newErrors).length === 0 && Object.keys(commonFieldError).length === 0; // true if no errors
  };

  // useEffect(() => {
  //   console.log('userFormData', userFormData)
  //   buildPayload();
  // }, [userFormData])

  useEffect(() => {
    // console.log('userFormData.marketOptions?.MCXFUT', userFormData.marketOptions?.MCXFUT);
  }, [userFormData.marketOptions?.MCXFUT])


  // pass field's key : it will change all scripts that field value to common value of that field for all script 
  // (common filed means :  mcx market's common feild that appear above scripts list)
  // if key undifined : it change alls cripts feilds value to comon field value 
  function setMcxScriptsDefaultFieldValue(key) {
    let scriptList = userFormData?.marketOptions?.[MCXFUT_id]?.scripts || {};
    console.log('userFormData.marketOptions?.[MCXFUT_id]?.commissionType', userFormData.marketOptions?.[MCXFUT_id]?.commissionType);
    if (userFormData.marketOptions?.[MCXFUT_id]?.commissionType == 1) {
      Mcxscript.forEach(val => {
        scriptList = {
          ...scriptList,
          [val.script_id]: {
            ...scriptList?.[val.script_id],
            deliveryComm:
              key == 'deliveryComm' || !key
                ? userFormData?.marketOptions?.[MCXFUT_id]?.deliveryComm
                : scriptList?.[val.script_id]?.deliveryComm,
            intraComm:
              key == 'intraComm' || !key
                ? userFormData?.marketOptions?.[MCXFUT_id]?.intraComm
                : scriptList?.[val.script_id]?.intraComm,
            deliveryBrokerage:
              key == 'deliveryBrokerage' || !key
                ? userFormData?.marketOptions?.[MCXFUT_id]?.deliveryBrokerage
                : scriptList?.[val.script_id]?.deliveryBrokerage,
            intraBrokerage:
              key == 'intraBrokerage' || !key
                ? userFormData?.marketOptions?.[MCXFUT_id]?.intraBrokerage
                : scriptList?.[val.script_id]?.intraBrokerage,
          }
        }
      })
    } else {
      scriptList = {};
    }
    setUserFormData(prev => ({
      ...prev,
      marketOptions: {
        ...prev.marketOptions,
        [MCXFUT_id]: {
          ...prev.marketOptions?.[MCXFUT_id],
          scripts: scriptList,
        },
      },
    }))
  }

  useEffect(() => {
    setMcxScriptsDefaultFieldValue();
  }, [userFormData.marketOptions?.[MCXFUT_id]?.commissionType])

  useEffect(() => {
    setMcxScriptsDefaultFieldValue('deliveryComm');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.deliveryComm])

  useEffect(() => {
    setMcxScriptsDefaultFieldValue('intraComm');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.intraComm])

  useEffect(() => {
    setMcxScriptsDefaultFieldValue('deliveryBrokerage');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.deliveryBrokerage])

  useEffect(() => {
    setMcxScriptsDefaultFieldValue('intraBrokerage');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.intraBrokerage])

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setMasterFormData((prev) => ({ ...prev, [name]: value }));
  // };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (userType == '1') {
      setUserFormData((prev) => ({ ...prev, [name]: value }));
    } else if (userType == '2') {
      setBrokerFormData((prev) => ({ ...prev, [name]: value }));
    } else if (userType == '3') {
      setMasterFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (type, id, setter) => {
    setter((prev) => {
      const current = prev[type] || [];
      const updated =
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

  const marketConfig = {
    NSEFUT: {
      fields: [
        { key: "marginLimit", label: "NSEFUT Margin Limit", type: "number" },
        { key: "scriptLimit", label: "NSEFUT Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Percentage Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    NSEOPT: {
      fields: [
        { key: "marginLimit", label: "NSEOPT Margin Limit", type: "number" },
        { key: "scriptLimit", label: "NSEOPT Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Lot Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    NSEEQT: {
      fields: [
        { key: "marginLimit", label: "NSEEQT Margin Limit", type: "number" },
        { key: "scriptLimit", label: "NSEEQT Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Percentage Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    NSECDS: {
      fields: [
        { key: "marginLimit", label: "NSECDS Margin Limit", type: "number" },
        { key: "scriptLimit", label: "NSECDS Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Lot Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    MCXFUT: {
      fields: [
        { key: "marginLimit", label: "MCXFUT Margin Limit", type: "number" },
        { key: "scriptLimit", label: "MCXFUT Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "MCXFUT",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerageDropdown: true, // Brokerage Type (Lot Wise / Percentage Wise)
      hasScriptWiseOption: true, // Script Wise Value = 1
      hasMcxScripts: true,         // Fetch MCX Scripts
    },

    "GLOBAL FUTURES": {
      fields: [
        { key: "marginLimit", label: "GLOBAL FUTURES Margin Limit", type: "number" },
        { key: "scriptLimit", label: "GLOBAL FUTURES Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Percentage Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    FOREX: {
      fields: [
        { key: "marginLimit", label: "FOREX Margin Limit", type: "number" },
        { key: "scriptLimit", label: "FOREX Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Lot Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    COMEX: {
      fields: [
        { key: "marginLimit", label: "COMEX Margin Limit", type: "number" },
        { key: "scriptLimit", label: "COMEX Script Limit", type: "number" },
        { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        { key: "intraComm", label: "Intra Commission", type: "number" },
        {
          label: "NSE Option (Lot Wise)",
          type: "group",
          children: [
            // { key: "deliveryCommission", label: "Delivery Commission", type: "number" },
            // { key: "intradayCommission", label: "Intraday Commission", type: "number" },
            { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
            { key: "intraBrokerage", label: "Delivery Intraday Commission", type: "number" },
          ],
        },
      ],
      hasBrokerCheckbox: true,
    },

    BINARY: {
      fields: [
        { key: "marginLimit", label: "BINARY Margin Limit", type: "number" },
        { key: "scriptLimit", label: "BINARY Script Limit", type: "number" },
        // { key: "deliveryComm", label: "Delivery Commission", type: "number" },
        // { key: "intraComm", label: "Intra Commission", type: "number" },
      ],
      hasBrokerCheckbox: false,
    },
  };


  useEffect(() => {
    if (userType === "3" || userType === "1") {
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
  }, [userType]);



  // ✅ Initialize marketOptions based on mcxscript + defaultOptions
  useEffect(() => {
    if (!Array.isArray(Mcxscript)) return;

    const updatedOptions = Mcxscript.reduce((acc, sc) => {
      const key = String(sc.script_id);

      acc[key] = {
        // keep old values if any
        ...masterFormData.marketOptions?.[key],

        // fallback to defaultOptions if not set
        minPctComm: masterFormData.marketOptions?.[key]?.minPctComm ?? masterFormData.defaultOptions?.minPctComm ?? "",
        maxPctComm: masterFormData.marketOptions?.[key]?.maxPctComm ?? masterFormData.defaultOptions?.maxPctComm ?? "",
        minLotComm: masterFormData.marketOptions?.[key]?.minLotComm ?? masterFormData.defaultOptions?.minLotComm ?? "",
        maxLotComm: masterFormData.marketOptions?.[key]?.maxLotComm ?? masterFormData.defaultOptions?.maxLotComm ?? "",
        marginLimit: masterFormData.marketOptions?.[key]?.marginLimit ?? masterFormData.defaultOptions?.marginLimit ?? "",
        nextMarginLimit: masterFormData.marketOptions?.[key]?.nextMarginLimit ?? masterFormData.defaultOptions?.nextMarginLimit ?? "",
      };

      return acc;
    }, {});

    setMasterFormData((prev) => ({ ...prev, marketOptions: updatedOptions }));
  }, [Mcxscript, masterFormData.defaultOptions]);

  useEffect(() => {
    if (!Array.isArray(Mcxscript) || Mcxscript.length === 0) return;

    setMasterFormData((prev) => {
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
    masterFormData.defaultOptions?.minPctComm,
    masterFormData.defaultOptions?.maxPctComm,
    masterFormData.defaultOptions?.minLotComm,
    masterFormData.defaultOptions?.maxLotComm,
    masterFormData.defaultOptions?.marginLimit,
    masterFormData.defaultOptions?.nextMarginLimit,
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
    setMasterFormData((prev) => ({
      ...prev,
      marketOptions: {
        ...prev.marketOptions,
        [key]: { ...prev.marketOptions?.[key], [field]: value },
      },
    }));
  };


  const buildUserPayload = (payload) => {
    // ---------- General User Fields ----------
    const { userType, name, password, remarks, highLow, applySquare, intraSquare, onlyPosition, mtmLinkedWithLedger, applySquareForex, lossAlert, closeAlert, lossAlertForex, closeAlertForex, broker, addUserTradeAmount, short_trade_minutes, openingBalance, balanceType, userLevel, accountTypes, markets, marketOptions } = userFormData;
    const brokerArr = formatArrPayload(broker);

    payload.userType = numOrZero(commonFormData.userType);
    payload.name = name || "";
    payload.password = password || "";
    payload.remarks = remarks || "";

    payload.openingBalance = numOrZero(openingBalance);  // DEFAULT FIELD
    payload.balanceType = numOrZero(balanceType);  // DEFAULT FIELD

    payload.highLow = highLow ?? "";
    payload.applySquare = applySquare ?? "";
    payload.intraSquare = intraSquare ?? "";
    payload.onlyPosition = String(onlyPosition) || "";
    payload.mtmLinkedWithLedger = String(mtmLinkedWithLedger) || "";
    payload.applySquareForex = String(applySquareForex) || "";

    payload.lossAlert = String(lossAlert) || "";
    payload.closeAlert = String(closeAlert) || "";
    payload.lossAlertForex = String(lossAlertForex) || "";
    payload.closeAlertForex = String(closeAlertForex) || "";
    payload.addUserTradeAmount = addUserTradeAmount || "";
    payload.short_trade_minutes = short_trade_minutes || "";

    payload.broker = String(brokerArr) || "";

    // ---------- Dropdown Fields ----------
    if (markets?.length) payload.markets = markets.map(String);

    payload.accountType = accountTypes ?? userLevel;
    // payload.accountType = masterFormData.accountTypes?.length
    //   ? masterFormData.accountTypes
    //   : masterFormData.userLevel;


    // ---------- Market Specific Handling ----------
    // {/* MCX script checkboxes + individual text fields */}
    const mcxScripts = [];

    (markets || []).forEach((mktId) => {
      const opts = marketOptions?.[mktId] || {};
      const mkt = marketTypes.find((m) => m.market_type_id === mktId);
      if (!mkt) return;

      const prefix = marketKeyMap[mkt.market_type_name] ?? mkt.market_type_name;

      const isMCXFUT = mkt.market_type_name === "MCXFUT"
      const isNSEOPT = mkt.market_type_name === "NSEOPT"
      const isNotBinary = mkt.market_type_name != "BINARY"
      const isNotCricket = mkt.market_type_name != "CRICKET"

      payload[`${prefix}Unmatched`] = isNotCricket ? isMCXFUT ? false : 0 : undefined;
      payload[`${prefix}FirstSell`] =
        isNotCricket
          ? isMCXFUT
            ? false
            : isNSEOPT ? 1 : 0
          : undefined;

      console.log('opts', opts);

      switch (mkt.market_type_name) {
        case "MCXFUT":
          payload.mcxLimit = numOrZero(opts?.marginLimit);
          payload.mcxscriptLimit = numOrZero(opts?.scriptLimit);
          payload.mcxCommissionType = numOrZero(opts?.commissionType);
          payload.mcxBrokerageType = numOrZero(opts?.brokerageType);

          if (opts?.commissionType == 0) {
            mcxScripts.push({
              script: "all",
              deliveryComm: numOrZero(opts?.deliveryComm),
              deliveryBrokerage: opts?.deliveryBrokerage,
              intraComm: numOrZero(opts?.intraComm),
              intraBrokerage: opts?.intraBrokerage,
            });
          } else {
            (Mcxscript || []).forEach((sc) => {
              const scOpts = userFormData.marketOptions?.[mktId]?.scripts?.[sc.script_id] || {};
              mcxScripts.push({
                script: String(sc.script_id),
                deliveryComm: numOrZero(scOpts?.deliveryComm),
                deliveryBrokerage: scOpts?.deliveryBrokerage,
                intraComm: numOrZero(scOpts?.intraComm),
                intraBrokerage: scOpts?.intraBrokerage,
              });
            });
          }
          break;

        case "CRICKET":
          payload.cricketLimit = null
          break;

        case "NSEFUT":
        case "NSECDS":
        case "NSEEQT":
        case "NSEOPT":

        case "GLOBAL":
        case "FOREX":
        case "COMEX":
        case "BINARY":
        default:
          payload[`${prefix}Limit`] = numOrZero(opts?.marginLimit);
          payload[`${prefix}scriptLimit`] = numOrZero(opts?.scriptLimit);
          payload[`${prefix}Scripts`] = [{
            script: "all",
            deliveryComm: numOrZero(opts?.deliveryComm),
            intraBrokerage: isNotBinary && opts?.intraBrokerage,
            intraComm: numOrZero(opts?.intraComm),
            deliveryBrokerage: isNotBinary && opts?.deliveryBrokerage,
          }]
          break;
      }
    });

    if (mcxScripts.length) payload.mcxScripts = mcxScripts;

    return payload;
  }

  // useEffect(() => {
  //   console.log('@@ commonFormData', commonFormData);
  // }, [commonFormData])

  const buildMasterPayload = (payload) => {
    // ---------- General User Fields ----------
    // if ("userType" in masterFormData) payload.userType = numOrZero(masterFormData.userType);
    const { name, password, remarks, openingBalance, balanceType, shortTradeAvoid, partnership, partnershipType, markets, userLevel, accountTypes, marketOptions, defaultOptions } = masterFormData;

    payload.userType = numOrZero(commonFormData.userType);
    payload.name = name || "";
    payload.password = password || "";
    payload.remarks = remarks || "";

    payload.openingBalance = numOrZero(openingBalance);
    payload.balanceType = numOrZero(balanceType);

    payload.short_trade_minutes = numOrZero(shortTradeAvoid);
    payload.partnershipPercentage = numOrZero(partnership);
    payload.partnershipType = numOrZero(partnershipType);

    // ---------- Dropdown Fields ----------
    if (markets?.length)
      payload.markets = markets.map(String);

    if (accountTypes?.length || userLevel?.length) {
      payload.accountTypes = (accountTypes?.length
        ? accountTypes
        : userLevel
      ).map(String);
    }

    // ---------- Market Specific Handling ----------
    const mcxScripts = [];

    (markets || []).forEach((mktId) => {
      const opts = marketOptions?.[mktId] || {};
      const mkt = marketTypes.find((m) => m.market_type_id === mktId);
      if (!mkt) return;

      const prefix = marketKeyMap[mkt.market_type_name];

      switch (mkt.market_type_name) {
        case "MCXFUT":
          payload.mcxLimit = numOrZero(opts.marginLimit);
          payload.mcxLimit_max = numOrZero(opts.nextMarginLimit);
          payload.mcxMinPercentWise = numOrZero(opts.minLotBrokerage);
          payload.mcxMaxPercentWise = numOrZero(opts.maxLotBrokerage);

          // Per-script commissions
          (Mcxscript || []).forEach((sc) => {
            const scOpts = marketOptions?.[sc.script_id] || {};
            mcxScripts.push({
              script: String(sc.script_id),
              percentComm: numOrZero(scOpts.minPctComm ?? defaultOptions?.minPctComm),
              percentCommMax: numOrZero(scOpts.maxPctComm ?? defaultOptions?.maxPctComm),
              lotComm: numOrZero(scOpts.minLotComm ?? defaultOptions?.minLotComm),
              lotCommMax: numOrZero(scOpts.maxLotComm ?? defaultOptions?.maxLotComm),
            });
          });
          break;

        case "NSEFUT":
        case "NSECASH":
        case "BSEFUT":
        case "GLOBAL":
        case "FOREX":
        case "COMEX":
          payload[`${prefix}Limit`] = numOrZero(opts.marginLimit);
          payload[`${prefix}Limit_max`] = numOrZero(opts.nextMarginLimit);
          payload[`${prefix}MinPercentWise`] = numOrZero(opts.minLotBrokerage);
          payload[`${prefix}MaxPercentWise`] = numOrZero(opts.maxLotBrokerage);
          break;

        case "BINARY":
          payload[`${prefix}Limit`] = numOrZero(opts.MarginLimit);
          payload[`${prefix}Limit_max`] = numOrZero(opts.NextMarginLimit);
          payload[`${prefix}MinPercentWise`] = numOrZero(opts.minLotBrokerage);
          payload[`${prefix}MaxPercentWise`] = numOrZero(opts.maxLotBrokerage);
          break;

        case "CRICKET":
          payload[`${prefix}Limit`] =
            opts.casinoAllowed !== undefined ? (opts.casinoAllowed ? 1 : 0) : null;
          break;

        default:
          if (!prefix) return;
          "marginLimit" in opts ? payload[`${prefix}Limit`] = numOrZero(opts.marginLimit) : null;
          "nextMarginLimit" in opts ? payload[`${prefix}Limit_max`] = numOrZero(opts.nextMarginLimit) : null;
          "minLotBrokerage" in opts ? payload[`${prefix}MinLotWise`] = numOrZero(opts.minLotBrokerage) : null;
          "maxLotBrokerage" in opts ? payload[`${prefix}MaxLotWise`] = numOrZero(opts.maxLotBrokerage) : null;
          break;
      }


    });

    if (mcxScripts.length) payload.mcxScripts = mcxScripts;

    return payload;
  }


  const buildPayload = () => {
    let payload = {};
    if (userType == '3') payload = buildMasterPayload(payload);
    if (userType == '2') payload = { ...brokerFormData, userType: commonFormData.userType };
    if (userType == '1') payload = buildUserPayload(payload);

    // console.log('payload', payload);
    return payload;
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('@@@ masterFormData', masterFormData);
    console.log('@@@ userFormData', userFormData);
    console.log('@@@ brokerFormData', brokerFormData);

    // if (!validateMasterForm()) {
    //   console.log("Validation failed:", errors);
    //   return;
    // }
    const payload = await buildPayload();
    console.log("Payload", payload);

    const reponse = await addAccountAPI(payload);

    console.log('reponse', reponse);
    if (reponse.status == 'ok') {
      toast.success(`${reponse.message}`, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      resetForm();
    } else {
      toast.error(`${reponse.message}`, {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };


  const renderMcxSection = (mkt) => {

    if (Array.isArray(mkt.scripts) && mkt.scripts.length > 0) {
      return mkt.scripts.map((sc) => {
        const scriptId =
          (sc && (sc.script || sc.script_id || sc.id || sc.market_type_id)) ||
          sc ||
          null;
        const key = String(scriptId);
        const opts = masterFormData.marketOptions?.[key] || {};
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
    const opts = masterFormData.marketOptions?.[key] || {};
    return (
      <div key={key} style={{ marginLeft: 32, marginTop: 12 }}>
        <FormControlLabel
          control={<Checkbox size="small" checked disabled />}
          label={mkt.market_type_name}
        />
        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          <TextField
            type="number"
            label="minPctComm"
            size="small"
            value={opts.minPctComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "minPctComm", e.target.value)}
          />
          <TextField
            type="number"
            label="maxPctComm"
            size="small"
            value={opts.maxPctComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "maxPctComm", e.target.value)}
          />
          <TextField
            type="number"
            label="minLotComm"
            size="small"
            value={opts.minLotComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "minLotComm", e.target.value)}
          />
          <TextField
            type="number"
            label="maxLotComm"
            size="small"
            value={opts.maxLotComm || ""}
            onChange={(e) => handleMarketOptionChange(key, "maxLotComm", e.target.value)}
          />
        </div>
      </div>
    );
  };

  function resetForm() {
    setErrors({});
    if (userType == 1) setUserFormData(userFields);
    if (userType == 3) {
      setMasterFormData(masterFields);
      setMasterError({});
    }
  }

  function handleCancelClick() {

  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        padding: "20px",
        fontSize: "0.9rem",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={100000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <>
        {/* Basic Details */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Basic Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* User Type */}
          <Grid item xs={12} sm={4}>
            <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>User Type</Typography>
            <Select
              name="userType"
              value={commonFormData.userType}
              onChange={(e) => {
                handleChange(e);
                setCommonFormData(prev => ({ ...prev, userType: e.target.value }))
                setUserType(e.target.value);
              }}
              fullWidth
              size="small"
              displayEmpty
              error={!!errors.userType} // show red border if error
            >
              <MenuItem value=""><em>Select Type</em></MenuItem>
              <MenuItem value="1">User</MenuItem>
              <MenuItem value="2">Broker</MenuItem>
              <MenuItem value="3">Master</MenuItem>
            </Select>
            {errors.userType && (
              <Typography color="error" sx={{ fontSize: "0.75rem" }}>
                {errors.userType}
              </Typography>
            )}
          </Grid>

          {/* Name */}
          <Grid item xs={12} sm={4}>
            <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Name</Typography>
            <TextField
              required
              name="name"
              value={commonFormData.name}
              onChange={(e) => {
                // console.log('e.target.name, e.target.value', e.target.name, e.target.value);
                handleChange(e);
                setCommonFormData(prev => ({ ...prev, name: e.target.value }))
              }}
              placeholder="Enter Name"
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={4}>
            <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>Password</Typography>
            <TextField
              required
              type="password"
              name="password"
              value={commonFormData.password}
              onChange={(e) => {
                handleChange(e);
                setCommonFormData(prev => ({ ...prev, password: e.target.value }))
              }}
              placeholder="Enter Password"
              fullWidth
              size="small"
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
        </Grid>

      </>

      {/* ========== Master Options ============== */}
      {userType === "3" && (
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
                required
                type="number"
                name="partnership"
                inputProps={{ min: 0 }}
                value={masterFormData.partnership || ""}
                onChange={handleChange}
                placeholder="Enter %"
                fullWidth
                size="small"
                error={!!masterError.partnership}
                helperText={masterError.partnership}
              />
            </div>

            {/* Short Trade Avoid */}
            <div>
              <Typography sx={{ mb: 0.5, fontSize: "0.85rem" }}>
                Short Trade Avoid
              </Typography>
              <TextField
                required
                type="number"
                name="shortTradeAvoid"
                inputProps={{ min: 0 }}
                value={masterFormData.shortTradeAvoid || ""}
                onChange={handleChange}
                placeholder="Enter Minutes"
                fullWidth
                size="small"
                error={!!masterError.shortTradeAvoid}
                helperText={masterError.shortTradeAvoid}
              />
            </div>
          </div>


          <Divider sx={{ mb: 2 }} />

          {/* Fresh Limit */}
          <FormControl component="fieldset" fullWidth required>
            <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
              Fresh Limit Allowed
            </Typography>
            <RadioGroup
              row
              name="freshLimitAllowed"
              value={masterFormData.freshLimitAllowed}
              onChange={handleChange}
            // sx={{ mb: 2, "& .MuiFormControlLabel-root": { mr: 3 } }}
            >
              <FormControlLabel value={1} control={<Radio />} label="Yes" />
              <FormControlLabel value={0} control={<Radio inputProps={{ required: true }} />} label="No" />
            </RadioGroup>
            <Typography color="error" sx={{ fontSize: "0.75rem", mt: -1, mb: 1 }}>
              {masterError.freshLimitAllowed}
            </Typography>
          </FormControl>


          <Divider sx={{ mb: 2 }} />

          {/* User Level */}
          <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
            User Level
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>User Level</InputLabel>
            <Select
              required
              value={masterFormData.userLevel || ""}
              onChange={(e) => setMasterFormData({ ...masterFormData, userLevel: e.target.value })}
              multiple // optional, if you want multi-select
              // onOpen={() => setOpen(true)}
              // onClose={() => setOpen(false)}
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
          {masterError.userLevel && (
            <Typography color="error" sx={{ fontSize: "0.75rem", mt: -1, mb: 1 }}>
              {masterError.userLevel}
            </Typography>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* Market Type */}
          <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
            Market Type
          </Typography>

          {marketTypes.map((mkt) => {
            const isChecked = masterFormData.markets.includes(mkt.market_type_id);

            return (
              <div key={mkt.market_type_id} style={{ marginBottom: "16px" }}>
                {/* Main Market Type Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isChecked}
                      onChange={() =>
                        handleCheckboxChange("markets", mkt.market_type_id, setMasterFormData)
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
                )}
              </div>
            );
          })}


          {masterError.markets && (
            <Typography color="error" sx={{ fontSize: "0.75rem", mt: -1, mb: 1 }}>
              {masterError.markets}
            </Typography>
          )}

          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* Broker Options */}
      {userType === "2" && (
        <>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* ########## User Options ##########  */}
      {userType === "1" && (
        <>
          <Divider sx={{ mb: 2 }} />

          {/* ================= ACCOUNT DETAILS ================= */}
          <div style={{ padding: 12 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ACCOUNT DETAILS
            </Typography>


            <Grid container spacing={2}>
              {/* Order Outside of High Low */}
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl component="fieldset" fullWidth required>
                    <Typography>Order Outside of High Low</Typography>
                    <RadioGroup
                      row
                      name="highLow"
                      value={userFormData.highLow}
                      onChange={(e) =>
                        handleChange(e)
                      }
                    >
                      <FormControlLabel value={1} control={<Radio inputProps={{ required: true }} />} label="Yes" />
                      <FormControlLabel value={0} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Apply Auto Square */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Typography>Apply Auto Square</Typography>
                    <RadioGroup
                      row
                      name="applySquare"
                      value={userFormData.applySquare}
                      onChange={(e) => handleChange(e)}
                    >
                      <FormControlLabel value={1} control={<Radio inputProps={{ required: true }} />} label="Yes" />
                      <FormControlLabel value={0} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Intra Day Auto Square */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Typography>Intra Day Auto Square</Typography>
                    <RadioGroup
                      row
                      name="intraSquare"
                      value={userFormData.intraSquare}
                      onChange={(e) =>
                        handleChange(e)
                      }
                    >
                      <FormControlLabel value={1} control={<Radio inputProps={{ required: true }} />} label="Yes" />
                      <FormControlLabel value={0} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Only Position Squareoff */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Typography>Only Position Squareoff</Typography>
                    <RadioGroup
                      row
                      name="onlyPosition"
                      value={userFormData.onlyPosition}
                      onChange={(e) =>
                        handleChange(e)
                      }
                    >
                      <FormControlLabel value={1} control={<Radio inputProps={{ required: true }} />} label="Yes" />
                      <FormControlLabel value={0} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* MTM Linked with Ledger (Stock) */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Typography>MTM Linked with Ledger (Stock)</Typography>
                    <RadioGroup
                      row
                      name="mtmLinkedWithLedger"
                      value={userFormData.mtmLinkedWithLedger}
                      onChange={(e) => handleChange(e)}
                    >
                      <FormControlLabel value={'1'} control={<Radio inputProps={{ required: true }} />} label="Yes" />
                      <FormControlLabel value={'0'} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Apply Auto Square Forex/Comex */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <Typography>Apply Auto Square (Forex/Comex)</Typography>
                    <RadioGroup
                      required  // will it works ?
                      row
                      name="applySquareForex"
                      value={userFormData.applySquareForex}
                      onChange={(e) =>
                        handleChange(e)
                      }
                    >
                      <FormControlLabel value={'1'} control={<Radio inputProps={{ required: true }} />} label="Yes" />
                      <FormControlLabel value={'0'} control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </>
              <>
                {/* Other TextFields */}
                {/* Row 1 */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">  {/* sx={{ maxWidth: '300px' }} */}
                    <InputLabel>Broker Name</InputLabel>
                    <Select
                      multiple
                      name="broker"
                      value={userFormData.broker || []} // <-- make sure it's array
                      onChange={(e) =>
                        setUserFormData((prev) => ({
                          ...prev,
                          broker: e.target.value, // 👈 all selected brokers
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

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    inputProps={{ min: 0 }}
                    size="small"
                    label="Close Alert Margin (Forex/Comex)"
                    name="closeAlertForex"
                    value={userFormData.closeAlertForex}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                    label="Loss Alert Percentage (Forex/Comex)"
                    name="lossAlertForex"
                    value={userFormData.lossAlertForex}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                    label="Loss Alert Percentage"
                    name="lossAlert"
                    value={userFormData.lossAlert}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                    label="Close Alert Margin"
                    name="closeAlert"
                    value={userFormData.closeAlert}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                    label="Min Rate Stop Amount"
                    name="addUserTradeAmount"
                    value={userFormData.addUserTradeAmount}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                    label="Short Trade Avoid"
                    name="short_trade_minutes"
                    value={userFormData.short_trade_minutes}
                    onChange={(e) => handleChange(e)}
                  />
                </Grid>
              </>
            </Grid>
          </div>

          <Divider sx={{ my: 2 }} />

          {/* ================= ADDITIONAL DETAILS ================= */}
          <div style={{ padding: 12 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ADDITIONAL DETAILS
            </Typography>

            <Grid container spacing={2}>
              { }
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>User Level</InputLabel>
                  <Select
                    required
                    value={userFormData.userLevel || ""}
                    onChange={(e) => setUserFormData({ ...userFormData, userLevel: e.target.value })}
                    // onOpen={() => setOpen(true)}
                    // onClose={() => setOpen(false)}
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
                  const isChecked = userFormData.markets.includes(mkt.market_type_id);
                  const config = marketConfig[mkt.market_type_name];
                  const selectedBrokers = userFormData.broker || [];

                  return (
                    <div key={mkt.market_type_id} style={{ marginBottom: "16px" }}>
                      {/* Main Market Type Checkbox */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={isChecked}
                            onChange={() =>
                              handleCheckboxChange("markets", mkt.market_type_id, setUserFormData)
                            }
                          />
                        }
                        label={mkt.market_type_name}
                      />

                      {isChecked && config && (
                        <div style={{ marginLeft: "32px", marginTop: "12px" }}>
                          <Grid container spacing={2}>
                            {config.fields?.map((field, idx) => {
                              if (field.type === "group") {
                                return (
                                  <div key={field.label} style={{ marginTop: "12px", width: '100%' }}>
                                    <strong>{field.label}</strong>
                                    <BrokerFields
                                      selectedBrokers={selectedBrokers}
                                      BrokerList={BrokerList}
                                      field={field}
                                      mkt={mkt}
                                      userFormData={userFormData}
                                      setUserFormData={setUserFormData}
                                    />
                                    {userFormData.marketOptions?.[mkt.market_type_id]?.commissionType === 1 && config.hasMcxScripts &&
                                      <McxScriptFields
                                        userFormData={userFormData}
                                        setUserFormData={setUserFormData}
                                        config={config}
                                        Mcxscript={Mcxscript}

                                        selectedBrokers={selectedBrokers}
                                        BrokerList={BrokerList}
                                        field={field}
                                        mkt={mkt}
                                      />}
                                  </div>
                                );
                              }
                              return (
                                <>
                                  <Grid item xs={6}>
                                    <TextField
                                      required
                                      key={field.key}
                                      label={field.label}
                                      size="small"
                                      type={field.type}
                                      fullWidth
                                      value={
                                        userFormData.marketOptions?.[mkt.market_type_id]?.[field.key] || ""
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setUserFormData((prev) => ({
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
                                  </Grid>
                                  {mkt.market_type_name === "MCXFUT" && idx == 3 && config.hasBrokerageDropdown && config.hasScriptWiseOption && (
                                    <>
                                      <Grid item xs={6}>
                                        <FormControl fullWidth size="small">
                                          <InputLabel>Commission Type</InputLabel>
                                          <Select
                                            required
                                            value={userFormData.marketOptions?.[mkt.market_type_id]?.commissionType ?? ""}
                                            onChange={(e) =>
                                              setUserFormData((prev) => ({
                                                ...prev,
                                                marketOptions: {
                                                  ...prev.marketOptions,
                                                  [mkt.market_type_id]: {
                                                    ...prev.marketOptions?.[mkt.market_type_id],
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
                                            required
                                            value={userFormData.marketOptions?.[mkt.market_type_id]?.brokerageType ?? ""}
                                            onChange={(e) =>
                                              setUserFormData((prev) => ({
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

                                            <MenuItem value={2}>Percentage Wise</MenuItem>
                                            <MenuItem value={0}>MCX Lot Wise</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </>
                                  )}

                                </>
                              );

                            })}
                          </Grid>
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
        value={commonFormData.remarks}
        onChange={(e) => {
          setCommonFormData(prev => ({ ...prev, remarks: e.target.value }))
          handleChange(e);
        }}
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
            handleCancelClick();
            setMasterFormData({
              userType: "",
              name: "",
              password: "",
              remarks: "",
              userLevel: [],
              markets: [],
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
        <Button onClick={buildPayload}>Logs</Button>
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
