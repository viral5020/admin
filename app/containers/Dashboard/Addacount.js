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
    {/* <Typography
      variant="subtitle2"
      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
    >
      Master Options
    </Typography> */}

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
    <FormGroup
      row
      sx={{
        mb: 2,
        "& .MuiFormControlLabel-root": {
          mr: 3, // spacing between checkboxes
        },
      }}
    >
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
        "& .MuiFormControlLabel-root": {
          mr: 3,
          minWidth: "160px", // keeps them aligned in neat columns
        },
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
    <FormGroup
      row
      sx={{
        mb: 2,
        "& .MuiFormControlLabel-root": {
          mr: 3,
          minWidth: "160px", // align neatly like a grid
        },
      }}
    >
      {marketTypes.map((mkt) => (
        <FormControlLabel
          key={mkt.market_type_id}
          control={
            <Checkbox
              size="small"
              checked={formData.marketType.includes(mkt.market_type_id)}
              onChange={() =>
                handleCheckboxChange("marketType", mkt.market_type_id)
              }
            />
          }
          label={mkt.market_type_name}
        />
      ))}
    </FormGroup>

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
