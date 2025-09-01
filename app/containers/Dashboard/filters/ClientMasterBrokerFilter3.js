import React, { useState, useEffect } from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import axiosInstance from '../API/axiosconfig';
import { getInputBoxStyle } from './inputBoxStyle';

const DownlineFilter = ({ accountValue, setAccountValue, toAccountValue, setToAccountValue }) => {
  const inputBoxStyle = getInputBoxStyle(false);
  const dataStored = JSON.parse(sessionStorage.getItem("data")) || {};

  const [options, setOptions] = useState([]);

  // Fetch all options once on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await axiosInstance.post(
          'http://128.199.126.171/~goldorg/ajaxfiles/get_my_downline1',
          {
            is_app: 1,
            login_user_id: dataStored.user_id,
            auth_key: dataStored.auth_key,
            term: "",
          }
        );

        // Map API data to { label, value } format for dropdown
        const mappedOptions = Array.isArray(data.data)
          ? data.data.map(item => ({
            label: item.user_full_name,   // what will show in dropdown
            value: item.user_id,          // unique id
          }))
          : [];

        setOptions(mappedOptions);
      } catch (err) {
        console.error('API error:', err);
        setOptions([]);
      }
    };

    fetchOptions();
  }, []);

  return (
    <Grid container spacing={2}>
      {/* Account Dropdown */}
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label || ""}
          value={accountValue}
          onChange={(e, val) => setAccountValue(val)}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label="Account"
              placeholder="Select account"
              size="small"
              sx={inputBoxStyle}
            />
          )}
          fullWidth
        />
      </Grid>

      {/* To Account Dropdown */}
      <Grid item xs={12} sm={6} md={4}>
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label || ""}
          value={toAccountValue}
          onChange={(e, val) => setToAccountValue(val)}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              label="To Account"
              placeholder="Select to account"
              size="small"
              sx={inputBoxStyle}
            />
          )}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default DownlineFilter;
