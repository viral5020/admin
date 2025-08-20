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
    userLevel: [],
    marketType: [],
  });

  const [userLevels, setUserLevels] = useState([]);
  const [marketTypes, setMarketTypes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (type, id) => {
    setFormData((prev) => {
      const current = prev[type] || [];
      return {
        ...prev,
        [type]: current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id],
      };
    });
  };

  useEffect(() => {
    if (formData.userType === "3") {
      const dataStored = JSON.parse(sessionStorage.getItem("data"));

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
          }
        })
        .catch((err) => console.error("API Error:", err));
    }
  }, [formData.userType]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submit:", formData);
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
            <FormGroup
              row
              sx={{
                ml: 4,
                mt: 1,
                "& .MuiFormControlLabel-root": { mr: 3, minWidth: "200px" },
              }}
            >
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Margin Limit"
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Next Margin Limit"
              />
            </FormGroup>
          ) : (
            /* -------------------- Default Markets -------------------- */
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
                        ?.marginLimit || false
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketOptions: {
                          ...formData.marketOptions,
                          [mkt.market_type_id]: {
                            ...formData.marketOptions?.[mkt.market_type_id],
                            marginLimit: e.target.checked,
                          },
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
                    checked={
                      formData.marketOptions?.[mkt.market_type_id]
                        ?.nextMarginLimit || false
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketOptions: {
                          ...formData.marketOptions,
                          [mkt.market_type_id]: {
                            ...formData.marketOptions?.[mkt.market_type_id],
                            nextMarginLimit: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="Next Margin Limit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={
                      formData.marketOptions?.[mkt.market_type_id]
                        ?.minLotBrokerage || false
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketOptions: {
                          ...formData.marketOptions,
                          [mkt.market_type_id]: {
                            ...formData.marketOptions?.[mkt.market_type_id],
                            minLotBrokerage: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="Minimum Lot Wise Brokerage"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={
                      formData.marketOptions?.[mkt.market_type_id]
                        ?.maxLotBrokerage || false
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marketOptions: {
                          ...formData.marketOptions,
                          [mkt.market_type_id]: {
                            ...formData.marketOptions?.[mkt.market_type_id],
                            maxLotBrokerage: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="Max Lot Wise Brokerage"
              />
            </FormGroup>
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
      <Typography sx={{ mb: 0.5, fontSize: "0.85rem", fontWeight: 500 }}>
        Remarks
      </Typography>
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
