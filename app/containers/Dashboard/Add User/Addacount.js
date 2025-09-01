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
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { RadioGroup } from "@mui/material";
import { Radio } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatArrPayload, MCXFUT_id } from "../helpers/utilFunc";
import BrokerFields from "./BrokerFields";
import McxScriptFields from "./McxScriptFields";
import { addAccountAPI, editAccountAPI, getMarketScriptForAddAccountAPI, getUserDetailsAPI } from "../API/API";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { useLocation, useParams } from "react-router-dom";
import ClientMasterBrokerFilter from "../filters/ClientMasterBrokerFilter";

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

  partnership: "",
  partnershipType: "",
  shortTradeAvoid: "",
  freshLimitAllowed: null,

  userLevel: [],
  markets: [],

  marketOptions: {},
  accountTypes: [],
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

  broker: [],
  lossAlert: "",
  closeAlert: "",
  lossAlertForex: "",
  closeAlertForex: "",
  addUserTradeAmount: null,
  short_trade_minutes: null,

  markets: [],
  userLevel: "",
}

const common = [
  { key: "marginLimit", label: "Margin Limit", type: "number" },
  { key: "nextMarginLimit", label: "Next Margin Limit", type: "number" }
]

const prctWise = [
  { key: "minPercentWise", label: "Min Percent Brokerage", type: "number" },
  { key: "maxPercentWise", label: "Max Percent Brokerage", type: "number" },
]

const lotWise = [
  { key: "minLotBrokerage", label: "Min Lot Brokerage", type: "number" },
  { key: "maxLotBrokerage", label: "Max Lot Brokerage", type: "number" },
]

const marketConfigForMaster = {
  NSEFUT: { fields: [...common, ...prctWise] },
  NSEOPT: { fields: [...common, ...lotWise] },
  NSEEQT: { fields: [...common, ...prctWise] },
  NSECDS: { fields: [...common, ...lotWise] },
  FOREX: { fields: [...common, ...lotWise] },
  COMEX: { fields: [...common, ...prctWise] },
  BINARY: { fields: [...common] },
  MCXFUT: { fields: [...common, ...prctWise, ...lotWise] },
  "GLOBAL FUTURES": { fields: [...common, ...prctWise] },
}

const commonField = [
  { key: "marginLimit", label: "Margin Limit", type: "number" },
  { key: "scriptLimit", label: "Script Limit", type: "number" },
  { key: "deliveryComm", label: "Delivery Commission", type: "number" },
  { key: "intraComm", label: "Intra Commission", type: "number" },
];

const commonBrokerage = [
  { key: "deliveryBrokerage", label: "Delivery Broker Commission", type: "number" },
  { key: "intraBrokerage", label: "Intraday Commission", type: "number" },
];

// helper: build fields with or without brokerage group
const getMasterMarketConfig = (includeBrokerage = true) => [
  ...commonField,
  includeBrokerage && {
    label: "Brokerage",
    type: "group",
    children: commonBrokerage,
  },
].filter(Boolean); // includeBrokerage = false -> aboveobject doesnt execute and remain null value in  final returned object, so, filter.(boolean) remove that nullish or falsy values from it

const marketConfigForUser = {
  NSEFUT: { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  NSEOPT: { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  NSEEQT: { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  NSECDS: { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  FOREX: { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  COMEX: { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  BINARY: { fields: getMasterMarketConfig(false) },
  "GLOBAL FUTURES": { fields: getMasterMarketConfig(), hasBrokerCheckbox: true, },
  MCXFUT: {
    fields: getMasterMarketConfig(),
    hasBrokerageDropdown: true,
    hasScriptWiseOption: true,
    hasMcxScripts: true,
  },
}

const numOrZero = (v) =>
  v !== "" && v !== null && v !== undefined ? Number(v) : 0;

export default function AddAccountForm() {
  const location = useLocation();
  const { userId: editUserId } = location.state || {};
  const [isEditMode, setIsEditMode] = useState(false);


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
    console.log('masterFormData', masterFormData);
  }, [masterFormData])

  useEffect(() => {
    console.log('userFormData', userFormData);
  }, [userFormData])

  useEffect(() => {
    if (userType == "1") {
      const { password, name, remarks } = userFormData;
      setCommonFormData(prev => ({ ...prev, userType: userType, password, name, remarks }));
    } else if (userType == "2") {
      const { password, name, remarks } = brokerFormData;
      setCommonFormData(prev => ({ ...prev, userType: userType, password, name, remarks }));
    } else if (userType == "3") {
      const { password, name, remarks } = masterFormData;
      setCommonFormData(prev => ({ ...prev, userType: userType, password, name, remarks }));
    }
  }, [userType])

  // pass field's key : it will change all scripts that field value to common value of that field for all script 
  // (common filed means :  mcx market's common feild that appear above scripts list)
  // if key undifined : it change alls cripts feilds value to comon field value 
  function setMcxScriptsDefaultFieldForUser(key) {
    let scriptList = userFormData?.marketOptions?.[MCXFUT_id]?.scripts || {};
    // console.log('userFormData.marketOptions?.[MCXFUT_id]?.commissionType', userFormData.marketOptions?.[MCXFUT_id]?.commissionType);
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
    setMcxScriptsDefaultFieldForUser();
  }, [userFormData.marketOptions?.[MCXFUT_id]?.commissionType])

  useEffect(() => {
    setMcxScriptsDefaultFieldForUser('deliveryComm');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.deliveryComm])

  useEffect(() => {
    setMcxScriptsDefaultFieldForUser('intraComm');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.intraComm])

  useEffect(() => {
    setMcxScriptsDefaultFieldForUser('deliveryBrokerage');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.deliveryBrokerage])

  useEffect(() => {
    setMcxScriptsDefaultFieldForUser('intraBrokerage');
  }, [userFormData?.marketOptions?.[MCXFUT_id]?.intraBrokerage])



  // START FROM HERE MONDAY...
  // BELOW FUNC IS COPY OF ABOVE USER FUNC, BELOW CREATE FOR MASTER
  // GENERATE MASTER PAYLOAD
  // SET MASTER_DEATILS FROM VIEW_USER_DETAILS API TO masterFormData
  function setMcxScriptsDefaultFieldForMaster(key) {
    let scriptList = masterFormData?.mcxScripts;
    // console.log('userFormData.marketOptions?.[MCXFUT_id]?.commissionType', userFormData.marketOptions?.[MCXFUT_id]?.commissionType);
    Mcxscript.forEach(val => {
      scriptList = {
        ...scriptList,
        [val.script_id]: {
          ...scriptList?.[val.script_id],
          minPercentWise:
            key == 'minPercentWise'
              ? masterFormData?.marketOptions?.[MCXFUT_id]?.minPercentWise
              : scriptList?.[val.script_id]?.minPercentWise,
          maxPercentWise:
            key == 'maxPercentWise'
              ? masterFormData?.marketOptions?.[MCXFUT_id]?.maxPercentWise
              : scriptList?.[val.script_id]?.maxPercentWise,
          maxLotBrokerage:
            key == 'maxLotBrokerage'
              ? masterFormData?.marketOptions?.[MCXFUT_id]?.maxLotBrokerage
              : scriptList?.[val.script_id]?.maxLotBrokerage,
          minLotBrokerage:
            key == 'minLotBrokerage'
              ? masterFormData?.marketOptions?.[MCXFUT_id]?.minLotBrokerage
              : scriptList?.[val.script_id]?.minLotBrokerage,
        }
      }
    })

    setMasterFormData(prev => ({
      ...prev,
      mcxScripts: scriptList,
    }))
  }

  useEffect(() => {
    setMcxScriptsDefaultFieldForMaster('maxPercentWise');
  }, [masterFormData?.marketOptions?.[MCXFUT_id]?.maxPercentWise])

  useEffect(() => {
    setMcxScriptsDefaultFieldForMaster('minPercentWise');
  }, [masterFormData?.marketOptions?.[MCXFUT_id]?.minPercentWise])

  useEffect(() => {
    setMcxScriptsDefaultFieldForMaster('minLotBrokerage');
  }, [masterFormData?.marketOptions?.[MCXFUT_id]?.minLotBrokerage])

  useEffect(() => {
    setMcxScriptsDefaultFieldForMaster('maxLotBrokerage');
  }, [masterFormData?.marketOptions?.[MCXFUT_id]?.maxLotBrokerage])

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
    console.log('id', id);
    setter((prev) => {
      const current = prev[type] || [];
      console.log('current', current)
      console.log('id', id);
      const updated =
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      return { ...prev, [type]: updated };
    });
  };

  async function getMarketTypesAndMcxScript() {
    console.log("getMarketTypesAndMcxScript.........")
    const data = await getMarketScriptForAddAccountAPI();
    if (data) {
      setUserLevels(data.user_level || []);
      setMarketTypes(data.market_type || []);
      setMcxscript(data.mcx_script || []);
      setBrokerList(data.broker_list || []);
    }
  }

  useEffect(() => {
    console.log('editUserId', editUserId);
    // console.log('editUserType', editUserType);
    getMarketTypesAndMcxScript();

    const pathSegments = location.pathname.split("/");   // ["", "app", "dashboard", "Edit-Account", "1", "234"]
    const pageName = pathSegments[3]; // "Edit-Account" or "Add-Account"
    pageName.toLowerCase() === 'edit-account' ? setIsEditMode(true) : setIsEditMode(false);
  }, []);

  useEffect(() => {
    isEditMode && getUserDataForEdit();
    // setUserType(editUserType);
  }, [isEditMode])

  async function getUserDataForEdit() {
    const data = await getUserDetailsAPI(editUserId);
    const user_type = data?.fetch_get_user_data?.user_type;
    setUserType(user_type);

    user_type == '1' && setEdit_User_DataFunc(data.data);
    user_type == '2' && setEdit_Broker_DataFunc(data.data);
    user_type == '3' && setEdit_Master_DataFunc(data.data);
  }

  function setEdit_User_DataFunc(data) {
    const {
      user_id_key,
      user_id,
      maxQtyFile,
      user_name,
      remarks,
      percentage,
      partnershipType,
      order_high_low,
      apply_square_up,
      apply_square_up_forex,
      apply_intra_square,
      mtm_linked_with_ledger,
      only_position_square,
      // only_position_square1,
      close_margin_alert_forex,
      close_margin_alert,
      addUserTradeAmount,
      short_trade_minutes,
      loss_percentage_alert,
      loss_percentage_alert_forex,

      account_type,
      broker_id,
      markets,
      scripts
    } = data;

    let mcxScript = {};
    let marketOption = {};

    scripts.forEach(s => {
      if (s.selected) {
        mcxScript = {
          ...mcxScript,
          [s.script_id]: {
            deliveryComm: s.deliveryComm,
            intraComm: s.intraComm,
            deliveryBrokerage: s.deliveryBrokerage,
            intraBrokerage: s.intraBrokerage,
          }
        }
      }
    })

    markets.forEach(m => {
      if (m.selected) {
        const mId = m.market_type_id;
        marketOption = {
          ...marketOption,
          [mId]: {
            marginLimit: m.margin,
            scriptLimit: m.script_limit,
            intraComm: m.intraComm,
            deliveryComm: m.deliveryComm,
            intraBrokerage: m.intraBrokerage,
            deliveryBrokerage: m.deliveryBrokerage,
          }
        }
        if (mId == 1) {
          // console.log('m.brokerageType', m.brokerageType)
          // console.log('m.commissionType', m.commissionType)
          marketOption[mId] = {// is it ok ?
            ...marketOption[mId],
            commissionType: m.commission_type,
            brokerageType: m.brokerage_type,
            scripts: mcxScript,
          };
        }
      }
    });

    const userData = {
      // userType: 1,
      name: user_name,
      change_user_id: user_id_key,
      username: user_id,
      remarks: remarks,

      highLow: order_high_low,
      applySquare: apply_square_up,
      intraSquare: apply_intra_square,
      onlyPosition: only_position_square,
      mtmLinkedWithLedger: mtm_linked_with_ledger,
      applySquareForex: apply_square_up_forex,

      lossAlert: loss_percentage_alert,
      closeAlert: close_margin_alert,
      lossAlertForex: loss_percentage_alert_forex,
      closeAlertForex: close_margin_alert_forex,
      addUserTradeAmount: addUserTradeAmount,
      short_trade_minutes: short_trade_minutes,

      userLevel: account_type,

      broker: broker_id?.map(b => ({ broker_id: String(b.id), broker_name: b.name })),
      markets: markets?.map(m => {
        if (m.selected) {
          return m.market_type_id;
        }
      }),

      marketOptions: marketOption,
    }
    setUserFormData(userData);
  }

  function setEdit_Master_DataFunc(data) {
    const {
      user_id_key,
      user_id,
      maxQtyFile,
      user_name,
      remarks,

      percentage,
      partnershipType,
      short_trade_minutes,
      fresh_limit_allowed,

      selected_account_types,
      account_type,
      broker_id,
      markets,
      scripts,
    } = data;

    let mcxScript = {};
    let marketOption = {};

    scripts.forEach(s => {
      if (s.selected) {
        mcxScript = {
          ...mcxScript,
          [s.script_id]: {
            minPercentWise: s.editUserDeliveryPercentage,
            maxPercentWise: s.editUserDeliveryPercentageMax,
            maxLotBrokerage: s.editUserDeliveryLotMax,
            minLotBrokerage: s.editUserDeliveryLot,
          }
        }
      }
    })

    markets.forEach(m => {
      if (m.selected) {
        const mId = m.market_type_id;
        marketOption = {
          ...marketOption,
          [mId]: {
            marginLimit: m.margin,
            nextMarginLimit: m.margin_max,
            minLotBrokerage: m.min_lot ?? '',
            maxLotBrokerage: m.max_lot ?? '',
            minPercentWise: m.min_percent ?? '',
            maxPercentWise: m.max_percent ?? '',
          }
        }
        // if (mId == 1) {
        //   // console.log('m.brokerageType', m.brokerageType)
        //   // console.log('m.commissionType', m.commissionType)
        //   marketOption[mId] = {// is it ok ?
        //     ...marketOption[mId],
        //     commissionType: m.commission_type,
        //     brokerageType: m.brokerage_type,
        //     scripts: mcxScript,
        //   };
        // }
      }
    });

    const masterData = {
      // userType: 1,
      name: user_name,
      change_user_id: user_id_key,
      username: user_id,
      remarks: remarks,

      partnership: percentage,
      partnershipType: partnershipType,
      shortTradeAvoid: short_trade_minutes,
      freshLimitAllowed: fresh_limit_allowed,

      userLevel: selected_account_types.map(v => String(v.id)),

      markets: markets?.map(m => {
        if (m.selected) {
          return m.market_type_id;
        }
      }),

      marketOptions: marketOption,
      mcxScripts: mcxScript, // CHANGE SPELLING
    }

    setMasterFormData(masterData);
  }

  useEffect(() => {
    console.log('brokerFormData', brokerFormData)
  }, [brokerFormData])

  function setEdit_Broker_DataFunc(data) {
    const { user_name, remarks, user_id, user_id_key } = data;

    const brokerData = {
      name: user_name,
      change_user_id: user_id_key,
      username: user_id,
      remarks: remarks,
    }

    setBrokerFormData(brokerData);
  }

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
    console.log('userFormData', userFormData)
    const { userType, name, password, remarks, highLow, applySquare, intraSquare, onlyPosition, mtmLinkedWithLedger, applySquareForex, lossAlert, closeAlert, lossAlertForex, closeAlertForex, broker, addUserTradeAmount, short_trade_minutes, userLevel, accountTypes, markets, marketOptions, change_user_id, username } = userFormData;
    const brokerArr = formatArrPayload(broker);

    payload.userType = numOrZero(commonFormData.userType);
    payload.name = name ?? "";
    payload.remarks = remarks ?? "";
    !isEditMode ? payload.password = (password ?? "") : '';
    isEditMode ? payload.change_user_id = change_user_id : '';
    isEditMode ? payload.username = username : '';

    payload.openingBalance = 0;  // DEFAULT FIELD
    payload.balanceType = 0;  // DEFAULT FIELD

    payload.highLow = highLow ?? "";
    payload.applySquare = applySquare ?? "";
    payload.intraSquare = intraSquare ?? "";
    payload.onlyPosition = String(onlyPosition) ?? "";
    payload.mtmLinkedWithLedger = String(mtmLinkedWithLedger) ?? "";
    payload.applySquareForex = String(applySquareForex) ?? "";

    payload.lossAlert = String(lossAlert) ?? "";
    payload.closeAlert = String(closeAlert) ?? "";
    payload.lossAlertForex = String(lossAlertForex) ?? "";
    payload.closeAlertForex = String(closeAlertForex) ?? "";
    payload.addUserTradeAmount = addUserTradeAmount ?? "";
    payload.short_trade_minutes = short_trade_minutes ?? "";

    payload.broker = String(brokerArr) ?? "";

    const cleanMarketArr = markets.filter(item => item !== undefined);
    if (cleanMarketArr?.length) payload.markets = cleanMarketArr.map(String);
    console.log('markets', markets);
    console.log('cleanMarketArr', cleanMarketArr);

    payload.accountType = accountTypes ?? userLevel;

    // ---------- Market Specific Handling ----------
    const mcxScripts = [];

    (cleanMarketArr || []).forEach((mktId) => {
      // console.log("FFFFFFFF........")
      const opts = marketOptions?.[mktId] || {};
      const mkt = marketTypes.find((m) => m.market_type_id == mktId);
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
              const scOpts = marketOptions?.[mktId]?.scripts?.[sc.script_id] ?? {};
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

  const buildMasterPayload = (payload) => {
    // ---------- General User Fields ----------
    const { name, password, remarks, openingBalance, balanceType, shortTradeAvoid, partnership, partnershipType, freshLimitAllowed, markets, userLevel, accountTypes, marketOptions, mcxScripts, username, change_user_id } = masterFormData;

    payload.userType = numOrZero(commonFormData.userType);
    payload.name = name ?? "";
    payload.remarks = remarks ?? "";
    !isEditMode ? payload.password = (password ?? "") : '';
    isEditMode ? payload.change_user_id = change_user_id : '';
    isEditMode ? payload.username = username : '';

    payload.openingBalance = numOrZero(openingBalance);
    payload.balanceType = numOrZero(balanceType);
    payload.firstSell = null;

    payload.short_trade_minutes = numOrZero(shortTradeAvoid);
    payload.partnershipPercentage = numOrZero(partnership);
    payload.partnershipType = numOrZero(partnershipType);
    payload.freshLimitAllowed = numOrZero(freshLimitAllowed);
    // ---------- Dropdown Fields ----------
    const cleanMarketArr = markets.filter(item => item !== undefined);
    if (cleanMarketArr?.length) payload.markets = cleanMarketArr.map(String);
    console.log('markets', markets);
    console.log('cleanMarketArr', cleanMarketArr);

    if (cleanMarketArr?.length)
      payload.markets = cleanMarketArr.map(String);

    if (accountTypes?.length || userLevel?.length) {
      payload.accountTypes = (accountTypes?.length
        ? accountTypes
        : userLevel
      ).map(String);
    }

    // ---------- Market Specific Handling ----------
    const mcxScript = [];

    (cleanMarketArr || []).forEach((mktId) => {
      // get from masterFormData state
      const opts = marketOptions?.[mktId] || {};

      console.log('marketTypes', marketTypes);
      console.log('mktId', mktId);
      // output of above :
      // [
      //   {
      //     "market_type_name": "NSEOPT",
      //     "market_type_id": "5",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "NSEFUT",
      //     "market_type_id": "2",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "NSEEQT",
      //     "market_type_id": "8",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "NSECDS",
      //     "market_type_id": "9",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "MCXFUT",
      //     "market_type_id": "1",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "GLOBAL FUTURES",
      //     "market_type_id": "4",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "FOREX",
      //     "market_type_id": "6",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "CRICKET",
      //     "market_type_id": "3",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "COMEX",
      //     "market_type_id": "7",
      //     "selected": false
      //   },
      //   {
      //     "market_type_name": "BINARY",
      //     "market_type_id": "13",
      //     "selected": false
      //   }
      // ]
      // find market name from mrkId
      const { market_type_name: marketname } = marketTypes.find((m) => m.market_type_id == mktId);  // line : 853
      if (!marketname) return;

      const prefix = marketKeyMap[marketname] ?? marketname;

      switch (marketname) {
        case "MCXFUT":
          payload.mcxLimit = numOrZero(opts.marginLimit);
          payload.mcxLimit_max = numOrZero(opts.nextMarginLimit);

          (Mcxscript || []).forEach((sc) => {
            const scOpts = mcxScripts?.[sc.script_id] || {};
            mcxScript.push({
              script: String(sc.script_id),
              percentComm: numOrZero(scOpts?.minPercentWise),
              percentCommMax: numOrZero(scOpts?.maxPercentWise),
              lotComm: numOrZero(scOpts?.minLotBrokerage),
              lotCommMax: numOrZero(scOpts?.maxLotBrokerage),
            });
          });

          break;

        // case "NSECASH":
        // case "BSEFUT":
        case "FOREX":
        case "NSEOPT":
        case "NSECDS":
          payload[`${prefix}Limit`] = numOrZero(opts.marginLimit);
          payload[`${prefix}Limit_max`] = numOrZero(opts.nextMarginLimit);
          payload[`${prefix}MinLotWise`] = numOrZero(opts.minLotBrokerage);
          payload[`${prefix}MaxLotWise`] = numOrZero(opts.maxLotBrokerage);
          break;

        case "GLOBAL":
        case "NSEFUT":
        case "COMEX":
        case "NSEEQT":
          payload[`${prefix}Limit`] = numOrZero(opts.marginLimit);
          payload[`${prefix}Limit_max`] = numOrZero(opts.nextMarginLimit);
          payload[`${prefix}MinPercentWise`] = numOrZero(opts.minPercentWise);
          payload[`${prefix}MaxPercentWise`] = numOrZero(opts.maxPercentWise);
          break;

        case "BINARY":
          payload[`${prefix}Limit`] = numOrZero(opts.MarginLimit);
          payload[`${prefix}Limit_max`] = numOrZero(opts.NextMarginLimit);
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

    if (mcxScript.length) payload.mcxScripts = mcxScript;

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

    // ====
    const payload = await buildPayload();
    console.log("Payload", payload);

    const reponse = isEditMode ? await editAccountAPI(payload) : await addAccountAPI(payload);

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
          {!isEditMode && <Grid item xs={12} sm={4}>
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
          </Grid>}

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
          {!isEditMode && <Grid item xs={12} sm={4}>
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
          </Grid>}
        </Grid>

      </>

      {/* ========== Master Options ============== */}
      {userType == "3" && (
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
                inputProps={{ min: 0, step: "any" }}
                value={masterFormData.partnership ?? ""}
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
                inputProps={{ min: 0, step: "any" }}
                value={masterFormData.shortTradeAvoid ?? ""}
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
              value={masterFormData.userLevel ?? ""}
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
            const isChecked = masterFormData.markets.map(Number).includes(Number(mkt.market_type_id));
            const config = marketConfigForMaster[mkt.market_type_name];

            return (
              <div key={mkt.market_type_id} style={{ marginBottom: "16px" }}>
                {/* Main Market Type Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isChecked}
                      onChange={() =>
                        handleCheckboxChange("markets", Number(mkt.market_type_id), setMasterFormData)
                      }
                    />
                  }
                  label={mkt.market_type_name}
                />

                {/* Nested Options */}
                {isChecked && config && (
                  <>
                    <div style={{ marginLeft: "32px", marginTop: "12px" }}>
                      <Grid container spacing={1.5}>
                        {config.fields?.map((field, idx) => (
                          <>
                            <Grid item xs={12} sm={6} md={3}>
                              <TextField
                                sx={{ width: '100%' }}
                                required
                                key={field.key}
                                label={field.label}
                                size="small"
                                type={field.type}
                                inputProps={{ min: 0, step: "any" }}
                                value={masterFormData.marketOptions?.[mkt.market_type_id]?.[field.key] ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setMasterFormData((prev) => ({
                                    ...prev,
                                    marketOptions: {
                                      ...prev.marketOptions,
                                      [mkt.market_type_id]: {
                                        ...prev.marketOptions?.[mkt.market_type_id],
                                        [field.key]: value === "" ? "" : Number(value), // ✅ convert to number
                                      },
                                    },
                                  }));
                                }}
                              />
                            </Grid>
                          </>
                        )
                        )}
                      </Grid>

                      {/* MCX script checkboxes + individual text fields */}
                      {mkt.market_type_name === "MCXFUT" && Mcxscript.map((script) => (
                        <div key={script.script_id} style={{ marginLeft: "32px", marginTop: "12px" }}>
                          <FormControlLabel
                            control={<Checkbox size="small" checked={script.selected} disabled />}
                            label={script.script_name}
                          />

                          <Grid container spacing={1.5}>
                            {config.fields.slice(2)?.map((field, idx) => (
                              <>
                                <Grid item xs={12} sm={6} md={3}>
                                  <TextField
                                    sx={{ width: '100%' }}
                                    required
                                    key={field.key}
                                    label={field.label}
                                    size="small"
                                    type={field.type}
                                    inputProps={{ min: 0, step: "any" }}
                                    value={masterFormData.mcxScripts?.[script.script_id]?.[field.key] ?? ""}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setMasterFormData((prev) => ({
                                        ...prev,
                                        mcxScripts: {
                                          ...prev.mcxScripts,
                                          [script.script_id]: {
                                            ...prev.mcxScripts?.[script.script_id],
                                            [field.key]: value === "" ? "" : Number(value), // ✅ convert to number
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                </Grid>
                              </>
                            )
                            )}
                          </Grid>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {mkt.market_type_name === "CRICKET" && (
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
      {userType == "2" && (
        <>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      {/* ########## User Options ##########  */}
      {userType == "1" && (
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
                    {/* <InputLabel>Broker Name</InputLabel> */}
                    {/* <Select
                      multiple
                      name="broker"
                      value={userFormData.broker || []} // itsb value ['22','32] but option doesn't set
                      onChange={(e) =>
                        setUserFormData((prev) => ({
                          ...prev,
                          broker: e.target.value,
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
                    </Select> */}
                    <Autocomplete
                      multiple
                      disableCloseOnSelect
                      options={BrokerList}
                      getOptionLabel={(option) => option?.broker_name || ""}
                      value={userFormData.broker || []}
                      isOptionEqualToValue={(option, value) => option.broker_id == value.broker_id}
                      onChange={(e, val) =>
                        setUserFormData((prev) => ({
                          ...prev,
                          broker: val, // val = array of selected brokers
                        }))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Start typing to search..."
                          label="Broker Name"
                          size="small"
                        />
                      )}
                      renderOption={(props, option) => (
                        <li {...props} key={option.broker_id}>
                          {option.broker_name}
                        </li>
                      )}
                      noOptionsText="No Broker found"
                      fullWidth
                    />
                  </FormControl>
                </Grid>
                {/* <ClientMasterBrokerFilter
                  broker={userFormData.broker ?? []}
                  isMultipleBroker={true}
                  setBroker={(val) =>
                    setUserFormData((prev) => ({
                      ...prev,
                      broker: [...(prev.broker || []), val].flat(),
                    }))}
                /> */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    inputProps={{ min: 0, step: "any" }}
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
                    inputProps={{ min: 0, step: "any" }}
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
                    inputProps={{ min: 0, step: "any" }}
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
                    inputProps={{ min: 0, step: "any" }}
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
                    inputProps={{ min: 0, step: "any" }}
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
                    inputProps={{ min: 0, step: "any" }}
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
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>User Level</InputLabel>
                  <Select
                    required
                    value={userFormData.userLevel ?? ""}
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
                  const isChecked = userFormData.markets.map(Number).includes(Number(mkt.market_type_id));
                  const config = marketConfigForUser[mkt.market_type_name];
                  const selectedBrokers = userFormData.broker || [];
                  // console.log('userFormData.broker', userFormData.broker)

                  return (
                    <div key={mkt.market_type_id} style={{ marginBottom: "16px" }}>
                      {/* Main Market Type Checkbox */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={isChecked}
                            onChange={() =>
                              handleCheckboxChange("markets", Number(mkt.market_type_id), setUserFormData)
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
                                    {userFormData.marketOptions?.[mkt.market_type_id]?.commissionType == 1 && config.hasMcxScripts &&
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
                                  <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                      required
                                      key={field.key}
                                      label={field.label}
                                      size="small"
                                      type={field.type}
                                      fullWidth
                                      inputProps={{ min: 0, step: "any" }}
                                      value={
                                        userFormData.marketOptions?.[mkt.market_type_id]?.[field.key] ?? ""
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
              // defaultOptions: {
              //   minPctComm: "",
              //   maxPctComm: "",
              //   minLotComm: "",
              //   maxLotComm: "",
              //   marginLimit: false,
              //   nextMarginLimit: false,
              // },
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
        {/* <Button onClick={buildPayload}>Logs</Button> */}
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
