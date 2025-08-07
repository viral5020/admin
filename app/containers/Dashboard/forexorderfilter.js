import React, { useEffect, useState } from 'react';
import {
  Grid, Autocomplete, TextField, Tooltip,
} from '@mui/material';
import axios from 'axios';
import { useTheme } from '@emotion/react';

const ForexComexScriptFilter = ({ selectedScripts, isScriptNameDisable, setSelectedScripts, selectedMarket, setSelectedMarket }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const [scriptOptions, setScriptOptions] = useState([]);
  const [isScriptDisabled, setIsScriptDisabled] = useState(true);

  const marketOptions = [
    { id: 6, text: 'FOREX' },
    { id: 7, text: 'COMEX' },
  ];

  useEffect(() => {
    if (!selectedMarket || !selectedMarket.id) {
      setSelectedScripts([]);
      setIsScriptDisabled(true);
    } else {
      fetchScripts('', selectedMarket.id);
      setIsScriptDisabled(false);
    }
  }, [selectedMarket]);

  const inputBoxStyle = {
    backgroundColor: isDarkMode ? '#263238' : '#fff',
    borderRadius: 1,
    '& .MuiOutlinedInput-root': {
      height: 40,
      '& fieldset': {
        borderColor: '#c4c4c4',
      },
      '&:hover fieldset': {
        borderColor: '#000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#000',
      },
    },
  };

  const fetchScripts = async (term = '', marketId) => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));

    const params = {
      is_app: 1,
      login_user_id: dataStored?.user_id,
      auth_key: dataStored?.auth_key,
      term,
      market: marketId,
    };

    try {
      const { data } = await axios.post(
        'http://128.199.126.171/~goldorg/ajaxfiles/get_script_name_search_forex',
        params
      );
      const results = data.results;
      setScriptOptions(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error('Error fetching script options:', error);
      setScriptOptions([]);
    }
  };

  return (
    <>
  {/* (5) Market Selector */}
  <Grid item xs={12} sm={6} md={3} lg={2.4}>
    <Autocomplete
      options={marketOptions}
      getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
      value={selectedMarket || null}
      inputValue={selectedMarket?.text || ''}
      onInputChange={(e, val, reason) => {
        if (reason === 'input') {
          setSelectedMarket({ text: val });
          handleFetch(val, 'market');
        }
      }}
      onChange={(e, val) => setSelectedMarket(val)}
      onBlur={() => {
        const matched = marketOptions.find((opt) =>
          (typeof opt === 'string' ? opt : opt?.text) === selectedMarket?.text
        );
        if (!matched) setSelectedMarket(null);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Market" size="small" sx={inputBoxStyle} />
      )}
      noOptionsText="No Market found"
      fullWidth
      sx={{
        ...inputBoxStyle,
        '& .MuiAutocomplete-input': {
          width: '100% !important',
        },
      }}
    />
  </Grid>

  {/* (6) Script Selector */}
  <Grid item xs={12} sm={6} md={3} lg={2.4}>
    <Tooltip
      arrow
      title={
        isScriptNameDisable
          ? 'First Select Market Name'
          : selectedScripts.map((item) => (typeof item === 'string' ? item : item.text)).join(', ')
      }
    >
      <Autocomplete
        multiple
        disabled={isScriptNameDisable}
        options={scriptOptions}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option?.text || ''
        }
        value={Array.isArray(selectedScripts) ? selectedScripts : []}
        filterSelectedOptions
        onInputChange={(e, val, reason) => {
          if (reason === 'input') {
            handleFetch(val, 'script');
          }
        }}
        onChange={(e, val) => setSelectedScripts(val)}
        renderOption={(props, option) => {
          const optionText = typeof option === 'string' ? option : option.text;
          const isSelected = selectedScripts.some(
            (item) =>
              (typeof item === 'string' ? item : item.text) === optionText
          );

          return (
            <li
              {...props}
              style={{
                backgroundColor: isSelected
                  ? isDarkMode
                    ? '#333'
                    : '#e0f7fa'
                  : 'inherit',
                color: isSelected ? '#999' : 'inherit',
                pointerEvents: isSelected ? 'none' : 'auto',
                opacity: isSelected ? 0.6 : 1,
              }}
              aria-disabled={isSelected}
            >
              {optionText}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Script"
            size="small"
            sx={inputBoxStyle}
          />
        )}
        noOptionsText="No Script found"
        fullWidth
        sx={{
          ...inputBoxStyle,
          '& .MuiAutocomplete-input': {
            width: 'auto !important',
          },
        }}
      />
    </Tooltip>
  </Grid>
</>
  );
};

export default ForexComexScriptFilter;
