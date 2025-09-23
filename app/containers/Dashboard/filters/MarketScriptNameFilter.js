import React, { useEffect, useMemo, useState } from 'react';
import {
  Grid, Autocomplete, TextField, Tooltip,
} from '@mui/material';
import AutocompleteFilter from './AutocompleteFilter';
import { useTheme } from '@emotion/react';
import { forex_comex_market } from '../helpers/utilFunc';
import axiosInstance from '../API/axiosconfig';
import { fetchOptionsAPI, getDefaultParams } from '../API/API';
import AutoSuggestFilter from './AutoSuggestFilter';


const MarketScriptNameFilter = ({
  script,
  setScript,
  setMarket,
  market,
  isScriptMultiSelect = false,
  isForex,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [marketOptions, setMarketOptions] = useState(isForex ? forex_comex_market : []);
  const [scriptOptions, setScriptOptions] = useState([]);

  const [isScriptNameDisable, setIsScriptNameDisable] = useState(true)

  // const memoizedMarket = useMemo(() => market, [market?.text]);

  useEffect(() => {
    console.log('market', market);
    // !!market ? setScript([]) : null;
    // setScript([]);
    // if (Object.keys(market || {}).length === 0) {
    //   setIsScriptNameDisable(true);
    // } else {
    // market?.id ? handleFetch('', 'script') : null;
    // handleFetch('', 'script')
    // setIsScriptNameDisable(false);
    // }
  }, [market])

  useEffect(() => {
    handleFetch('', "market");
    handleFetch('', 'script');
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
    const data = await fetchOptionsAPI(url, params);
    setter(Array.isArray(data) ? data : []);
  };


  async function handleFetch(term, type, val) {
    // if (!term) return;

    switch (type) {
      case 'market':
        !isForex ? fetchOptions(`/ajaxfiles/get_market_name_search`, { term }, setMarketOptions) : null;
        break;
      case 'script':
        isForex && !market && !val ? setScriptOptions([]) : fetchOptions(`/ajaxfiles/get_script_name_search`, { term, market: val?.id || market?.id, }, setScriptOptions);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    console.log('script', script);
  }, [script])

  return (
    <>
      {/* (5) Market Name */}
      {setMarket && <Grid item xs={12} sm={6} md={3} lg={2.4}>
        <Autocomplete
          options={marketOptions}
          getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
          value={market || null}
          // isOptionEqualToValue={(option, value) => {
          //   if (!value || Object.keys(value).length === 0) return false; // empty object case
          //   return option?.text === value?.text;
          // }}
          inputValue={market?.text || ''}//** */
          onInputChange={(e, val, reason) => {  //** */
            (reason === 'input') && setMarket({ text: val }); // tempararyly set market value
            handleFetch(val, 'market');
            setScript?.([]); // clear script when market changes
          }}
          onChange={(e, val) => {
            setMarket(val);
            handleFetch('', 'script', val);  // param `val` used, bcs market state take time to update
          }}
          onBlur={() => {  //** */ on focus out, if inputvalue don't match with any options then setMarket(null)
            const matched = marketOptions.find((opt) => (typeof opt === 'string' ? opt : opt?.text) === market?.text);
            (!matched) && setMarket(null);  // clear if unmatched
            // handleFetch('', 'market');
            handleFetch('', 'script');
          }}
          renderInput={(params) =>
            <TextField {...params}
              placeholder="Start typing to search..."
              label="Market"
              size="small"
              sx={inputBoxStyle}
            />}
          noOptionsText="No Market found"
          fullWidth
          sx={{
            ...inputBoxStyle,
            '& .MuiAutocomplete-input': {
              width: '100% !important',
            }
          }}
        />
      </Grid>
      }
      {/* (6) Script Name */}
      {setScript && <Grid item xs={12} sm={6} md={3} lg={2.4} position={'relative'}>
        {/* <Tooltip
          arrow
          title={isScriptNameDisable
            ? "First Select Market Name"
            : (Array.isArray(script) ? script : [script])
              .map((item) => (typeof item === 'string' ? item : item.text))
              .join(', ')
          }
        > */}
        <Autocomplete
          multiple={isScriptMultiSelect}
          // disabled={isScriptNameDisable}
          disableCloseOnSelect={isScriptMultiSelect}
          options={scriptOptions}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option?.text || ''
          }
          value={Array.isArray(script) ? script : (script || null)}
          // isOptionEqualToValue={(option, value) => {
          //   if (!value || Object.keys(value).length === 0) return false; // empty object case
          //   return option?.text === value?.text;
          // }}
          // filterSelectedOptions
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
            const isSelected = Array.isArray(script)
              ? script.some(
                (item) =>
                  (typeof item === 'string' ? item : item.text) === optionText
              )
              : (typeof script === 'string' ? script : script?.text) === optionText;

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
              placeholder="Start typing to search..."
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
            // height: 'auto',
            // '&:hover': {
            //   minHeight: 'max-content',
            //   position: 'absolute',
            //   border: '2px solid red'
            // }
          }}
        />
        {/* </Tooltip> */}
      </Grid>}

    </>
  )

  // return (
  //   <>
  //     <AutoSuggestFilter
  //       fieldName="market"
  //       label="Market"
  //       isMultiSelect={false}
  //       options={marketOptions}
  //       field={market}
  //       setField={setMarket}
  //       setOptions={setMarketOptions}
  //       isForex={isForex}
  //     />

  //     <AutoSuggestFilter
  //       fieldName="script"
  //       label="Script"
  //       isMultiSelect={isScriptMultiSelect}
  //       options={scriptOptions}
  //       field={script}
  //       setField={setScript}
  //       setOptions={setScriptOptions}
  //       isForex={isForex}
  //       market={market}
  //     />

  //   </>
  // )
}

export default MarketScriptNameFilter