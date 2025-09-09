import { Autocomplete, Grid, TextField } from '@mui/material';
import React from 'react'
import { fetchOptionsAPI } from '../API/API';


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

// TEST THIS
const AutoSuggestFilter = ({
    isMultiSelect,
    options,
    label,
    field,
    setField,
    fieldName,
}) => {

    async function fetchOptions(url, params, setter) {
        const data = await fetchOptionsAPI(url, params);
        setter(Array.isArray(data) ? data : []);
    };


    function handleFetch(term, val) {
        const dataStored = JSON.parse(sessionStorage.getItem("data"));
        // if (!term) return;
        let params = {
            is_app: 1,
            login_user_id: dataStored?.user_id,
            auth_key: dataStored?.auth_key,
        }

        const url = 'http://128.199.126.171/~goldorg/ajaxfiles'

        switch (fieldName) {
            case 'market':
                !isForex ? fetchOptions(`${url}/get_market_name_search`, { ...params, term }, setMarketOptions) : null;
                break;
            case 'script':
                isForex && !market && !val ? setScriptOptions([]) : fetchOptions(`${url}/get_script_name_search`, { ...params, term, market: val?.id || market?.id, }, setScriptOptions);
                break;
            case 'client':
                // console.log('TTT term', term);
                fetchOptions(`${url}/get_client_name_search`, { ...params, term }, setClientOptions);
                break;
            case 'master':
                fetchOptions(`${url}/get_master_name_search`, { ...params, term }, setMasterOptions);
                break;
            case 'broker':
                fetchOptions(`${url}/get_broker_name_search`, { ...params, term, term2: 2 }, setBrokerOptions);
                break;
            default:
                break;
        }
    };

    return (
        <Grid item xs={12} sm={6} md={3} lg={2.4} position='relative'>
            <Autocomplete
                multiple={isMultiSelect}
                disableCloseOnSelect={isMultiSelect}
                options={options}
                getOptionLabel={(option) => typeof option === 'string' ? option : option?.text || ''}
                value={Array.isArray(field) ? field : (field || null)}

                onInputChange={(e, val, reason) => reason === 'input' && handleFetch(val)}

                onChange={(e, val) => {
                    setField(val);
                }}
                renderOption={(props, option) => {
                    const optionText = typeof option === 'string' ? option : option.text;
                    const isSelected = Array.isArray(field)
                        ? field.some(
                            (item) =>
                                (typeof item === 'string' ? item : item.text) === optionText
                        )
                        : (typeof field === 'string' ? field : field?.text) === optionText;

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
                        placeholder="Start typing to search..."
                        label={label}
                        size="small"
                        sx={inputBoxStyle}
                    />
                )}
                noOptionsText={`No ${label} found`}
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
        </Grid>
    )
}

export default AutoSuggestFilter