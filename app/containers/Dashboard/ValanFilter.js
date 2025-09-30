import React, { useEffect, useState } from 'react';
import { Grid, TextField, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { getInputBoxStyle } from './filters/inputBoxStyle';
import { fetchValanNamesApi } from './API/API';

const ValanFilter = ({ valanId, setValanId, isDarkMode }) => {
  const [valanOptions, setValanOptions] = useState([]);
  const [loadingValan, setLoadingValan] = useState(false);
  const [inputValan, setInputValan] = useState('');

  const fetchValanNames = async (val) => {
    setLoadingValan(true);
    // const formatted = await fetchValanNamesApi(inputValan);
    const formatted = await fetchValanNamesApi(val);
    console.log('formatted', formatted);
    setValanOptions(formatted);
    setLoadingValan(false);
  };

  useEffect(() => {
    if (!inputValan || inputValan.trim().length < 1) {
      setValanOptions([]);
      return;
    }
    fetchValanNames();
    // const fetchValanNames = async () => {
    //   setLoadingValan(true);
    //   const formatted = await fetchValanNamesApi(inputValan);
    //   console.log('formatted', formatted);
    //   setValanOptions(formatted);
    //   setLoadingValan(false);
    // };

    const debounce = setTimeout(fetchValanNames, 400); // Slightly longer debounce
    return () => clearTimeout(debounce);
  }, [inputValan]);

  const selectedOption = valanOptions.find(opt => opt.value === valanId) || null;

  return (
    <Grid item xs={12} sm={6} md={4} lg={2.4}>
      <Autocomplete
        placeholder='asdasdsd'
        size="small"
        options={valanOptions}
        getOptionLabel={(option) => option.text || ''}
        loading={loadingValan}
        value={valanId || null}
        inputValue={valanId?.value || ''}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === 'input') {
            // console.log('newInputValue', newInputValue);
            // setInputValan(newInputValue)
            setValanId({ value: newInputValue });
            fetchValanNames(newInputValue);
          }
        }}

        onChange={(event, newValue) => {
          // console.log('newValue', newValue);
          setValanId(newValue || '')
        }}
        onBlur={() => {
          // console.log('TTT clientOptions', clientOptions);
          const matched = valanOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.value) === valanId?.value);
          (!matched) && setValanId(null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Start typing to search..."
            label="Valan ID"
            sx={{
              ...getInputBoxStyle(isDarkMode),
              "& .MuiAutocomplete-input": {
                width: "auto !important",
              },
            }}

            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingValan && (
                    <CircularProgress color="inherit" size={16} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        noOptionsText="No Option Found"
      />
    </Grid>
  );
};

export default ValanFilter;
