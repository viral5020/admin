import React, { useEffect, useState } from 'react';
import {
  Grid, Autocomplete, TextField, Tooltip,
} from '@mui/material';
import axios from 'axios';
import AutocompleteFilter from './AutocompleteFilter';
import { useTheme } from '@emotion/react';

const MarketScriptNameFilter = ({ script, setScript, setMarket, market }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [marketOptions, setMarketOptions] = useState([]);
  const [scriptOptions, setScriptOptions] = useState([]);

  const [isScriptNameDisable, setIsScriptNameDisable] = useState(true)

  useEffect(() => {
    console.log('market', market);
    if (Object.keys(market || {}).length === 0) {
      setScript([]);
      setIsScriptNameDisable(true);
    } else {
      market.id ? handleFetch('', 'script') : null;
      setIsScriptNameDisable(false);
    }
  }, [market])

  useEffect(() => {
    handleFetch('', "market");
  }, []);

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

  async function fetchOptions(url, params, setter) {
    try {
      const { data } = await axios.post(url, params); // POST request with body
      const results = data.results;
      setter(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(`Error fetching from ${url}`, err);
      setter([]);
    }
  };


  function handleFetch(term, type) {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    // if (!term) return;
    let params = {
      is_app: 1,
      login_user_id: dataStored?.user_id,
      auth_key: dataStored?.auth_key,
    }

    const url = 'http://128.199.126.171/~goldorg/ajaxfiles'

    switch (type) {
      case 'market':
        fetchOptions(`${url}/get_market_name_search`, { ...params, term }, setMarketOptions);
        break;
      case 'script':
        fetchOptions(`${url}/get_script_name_search`, { ...params, term, market: market.id }, setScriptOptions);
        break;
      // case 'client':
      //   fetchOptions(`${url}/get_client_name_search`, { term: 1 }, setClientOptions);
      //   break;
      // case 'master':
      //   fetchOptions(`${url}/get_master_name_search`, { term: 1 }, setMasterOptions);
      //   break;
      // case 'broker':
      //   fetchOptions(`${url}/get_broker_name_search`, { term: 1, term2: 2 }, setBrokerOptions);
      //   break;
      default:
        break;
    }
  };

  return (
    <>
      {/* (5) Market Name */}
      <Grid item xs={12} sm={6} md={3} lg={2.4}>
        <Autocomplete
          options={marketOptions}
          getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
          value={market || null}
          inputValue={market?.text || ''}
          onInputChange={(e, val, reason) => {
            (reason === 'input') && setMarket({ text: val }); // tempararyly set market value
            handleFetch(val, 'market');
          }}
          onChange={(e, val) => setMarket(val)}
          onBlur={() => {  // on focus out, if inputvalue don't match with any options then setMarket(null)
            const matched = marketOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === market?.text);
            (!matched) && setMarket(null);  // clear if unmatched
            // handleFetch('', 'market');
          }}
          renderInput={(params) => <TextField {...params} label="Market" size="small" sx={inputBoxStyle} />}
          noOptionsText="No Market found"
          fullWidth
          sx={{
            ...inputBoxStyle,
            '& .MuiAutocomplete-input': {
              width: '100% !important', // override dynamic width
            }
          }}
        />
      </Grid>

      {/* (6) Script Name */}
      <Grid item xs={12} sm={6} md={3} lg={2.4} position={'relative'}>
        <Tooltip
          arrow
          // disableHoverListener={!isScriptNameDisable}
          title={isScriptNameDisable ?
            "First Select Market Name"
            : script.map((item) => (typeof item === 'string' ? item : item.text)).join(', ')}
        >
          <Autocomplete
            multiple
            disabled={isScriptNameDisable}
            options={scriptOptions}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option?.text || ''
            }
            value={Array.isArray(script) ? script : []}
            filterSelectedOptions
            onInputChange={(e, val, reason) => {
              if (reason === 'input') {
                handleFetch(val, 'script');
              }
            }}
            onChange={(e, val) => {
              setScript(val);
            }}
            renderOption={(props, option) => {
              const optionText = typeof option === 'string' ? option : option.text;
              const isSelected = script.some(
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
            // onBlur={() => {
            //     // Filter only those scripts which exist in scriptOptions
            //     const validScripts = script.filter((selectedItem) =>
            //         scriptOptions.some((opt) =>
            //             (typeof opt === 'string' ? opt : opt?.text) === selectedItem?.text
            //         )
            //     );
            //     console.log('validScripts', validScripts);
            //     setScript(validScripts);
            // }}
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
                width: 'auto !important', // override dynamic width
              },
              // height: 'auto',
              // '&:hover': {
              //   minHeight: 'max-content',
              //   position: 'absolute',
              //   border: '2px solid red'
              // }
            }}
          />

        </Tooltip>
      </Grid>

      {/* <Grid item xs={12} sm={6} md={3} lg={2.4}>
        <AutocompleteFilter
          label="Market"
          options={marketOptions}
          value={market}
          setValue={setMarket}
          handleFetch={handleFetch}
          isDarkMode={isDarkMode}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3} lg={2.4}>
        <AutocompleteFilter
          label="Script"
          options={scriptOptions}
          value={script}
          setValue={setScript}
          handleFetch={handleFetch}
          isDisabled={isScriptNameDisable}
          isDarkMode={isDarkMode}
          disableSelected={true}  // Only script disables selected options
        />
      </Grid> */}
    </>
  )
}

export default MarketScriptNameFilter