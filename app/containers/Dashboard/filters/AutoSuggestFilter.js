import React, { useEffect, useState } from "react";
import { Autocomplete, CircularProgress, Grid, TextField } from "@mui/material";
import { useTheme } from "@emotion/react"; // ✅ added
import { fetchOptionsAPI } from "../API/API";
import { useDebounce } from "@uidotdev/usehooks";
import { getInputBoxStyle } from "./inputBoxStyle";

const AutoSuggestFilter = ({
    isMultiSelect,
    label,
    field,
    setField,
    fieldName,
    options,
    setOptions, // ✅ parent will pass correct setter
    market, // ✅ required if fieldName === "script"
    setScript,// ✅ required if fieldName === "market"
    isScriptMultiSelect,
    setScriptOptions,
    isForex = false, // ✅ added default
    isLoading,
    setIsLoading
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    const [searchText, setSearchText] = useState('');
    const debouncedSearchText = useDebounce(searchText, 800);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleFetch(searchText, fieldName);
    }, [debouncedSearchText])

    const isMarketField = fieldName === 'market';
    const isScriptField = fieldName === 'script';

    const inputBoxStyle = {
        backgroundColor: isDarkMode ? "#263238" : "#fff",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
            height: 40,
            "& fieldset": {
                borderColor: "#c4c4c4",
            },
            "&:hover fieldset": {
                borderColor: "#000",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#000",
            },
        },
    };

    async function fetchOptions(url, params, setter) {
        setLoading(true);
        isMarketField && setIsLoading(true);

        const data = await fetchOptionsAPI(url, params, setter);
        setter(Array.isArray(data) ? data : []);

        setLoading(false);
        isMarketField && setIsLoading(false);
    }

    function handleFetch(term, field, val) {

        switch (field ?? fieldName) {
            case "market":
                !isForex &&
                    fetchOptions(`/ajaxfiles/get_market_name_search`, { term }, setOptions);
                break;
            case "script":
                isForex && !market && !val
                    ? setOptions([])
                    : fetchOptions(`/ajaxfiles/get_script_name_search`, { term, market: val?.id || market?.id }, setScriptOptions || setOptions);
                break;

            case "client":
                fetchOptions(`/ajaxfiles/get_client_name_search`, { term }, setOptions);
                break;
            case "master":
                fetchOptions(`/ajaxfiles/get_master_name_search`, { term }, setOptions);
                break;
            case "broker":
                fetchOptions(`/ajaxfiles/get_broker_name_search`, { term, term2: 2 }, setOptions);
                break;
            case "valan":
                fetchOptions(`/ajaxfiles/get_valan_name_search`, { term }, setOptions);
                break;
            default:
                break;
        }
    }

    return (
        <>
            {
                setField &&

                <Grid item xs={12} sm={6} md={3} lg={2.4} position="relative">
                    {/* {console.log('fieldName field', fieldName, field)} */}
                    <Autocomplete
                        // disabled={isDisable}
                        // filterSelectedOptions
                        loading={loading}
                        loadingText="Loading..."
                        disabled={isScriptField && isLoading}

                        multiple={isMultiSelect}
                        disableCloseOnSelect={isMultiSelect}
                        options={Array.isArray(options) ? options : []}
                        getOptionLabel={(option) =>
                            typeof option === "string" ? option : option?.text || ""
                        }


                        // remain this `value` prop as it is,
                        // bcs if no option selected then mui autocomplte 1.in multiselect want [] 2.in singleselec want null,
                        // in this project's code, 
                        // in some place default value of field prop remain '' or null or [] in both multi and single select
                        // which can cause run time error
                        value={
                            isMultiSelect
                                ? Array.isArray(field)
                                    ? (field && Object.keys(field).length > 0 ? field : [])
                                    : field ? [field] : []
                                : !Array.isArray(field)
                                    ? (field && Object.keys(field).length > 0 ? field : null)
                                    : (field.length > 0 ? field[0] : null)
                        }

                        onInputChange={(e, val, reason) => {
                            if (reason === "input") {
                                setSearchText(val);
                            }
                            isMarketField && setScript?.(isScriptMultiSelect ? [] : ''); // clear script when market changes
                        }}
                        onChange={(e, val) => {
                            setField(val);
                            isMarketField && handleFetch('', 'script', val);  // param `val` used, bcs market state take time to update
                        }}

                        renderOption={
                            isMultiSelect
                                ? (props, option) => {
                                    const optionText = typeof option === "string" ? option : option.text;
                                    const isSelected = Array.isArray(field)
                                        ? field.some(
                                            (item) =>
                                                (typeof item === "string" ? item : item.text) === optionText
                                        )
                                        : (typeof field === "string" ? field : field?.text) === optionText;

                                    return (
                                        <li
                                            {...props}
                                            style={{
                                                backgroundColor: isSelected
                                                    ? isDarkMode
                                                        ? "#333"
                                                        : "#e0f7fa"
                                                    : "inherit",
                                                color: isSelected ? "#999" : "inherit",
                                                pointerEvents: isSelected ? "none" : "auto",
                                                opacity: isSelected ? 0.6 : 1,
                                            }}
                                            aria-disabled={isSelected}
                                        >
                                            {optionText}
                                        </li>
                                    );
                                }
                                : undefined
                        }


                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Start typing to search..."
                                label={label}
                                size="small"
                                sx={inputBoxStyle}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loading ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}

                        noOptionsText={`No ${label} found`}
                        fullWidth
                        sx={{
                            ...getInputBoxStyle(isDarkMode),
                            "& .MuiAutocomplete-input": {
                                width: "auto !important",
                            },
                        }}

                    // isOptionEqualToValue={(option, value) => {
                    //   if (!value || Object.keys(value).length === 0) return false; // empty object case
                    //   return option?.text === value?.text;
                    // }}


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

                    />
                </Grid>
            }
        </>
    );
};

export default AutoSuggestFilter;
