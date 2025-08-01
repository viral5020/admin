import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Grid } from '@mui/material';

const AutoCompleteFilter = ({ configs = [], isDarkMode = false }) => {
    return (
        <Grid container spacing={2}>
            {configs.map(({ label, value, onChange, options, getOptionLabel, hidden, isOptionEqualToValue, disabled }) => {
                const [inputValue, setInputValue] = useState(getOptionLabel(value));

                useEffect(() => {
                    setInputValue(getOptionLabel(value));
                }, [value]);

                const handleBlur = () => {
                    const isValid = options.some(
                        (opt) => getOptionLabel(opt).toLowerCase() === inputValue.toLowerCase()
                    );
                    if (!isValid) {
                        setInputValue(getOptionLabel(value));
                    }
                };

                if (hidden) return null; // 🔥 Prevent rendering if hidden

                return (
                    <Grid item xs={12} sm={6} md={2.4} key={label}>
                        <Autocomplete
                            value={value}
                            onChange={(_, newValue) => {
                                if (newValue) {
                                    onChange(newValue);
                                    setInputValue(getOptionLabel(newValue));
                                }
                            }}
                            inputValue={inputValue}
                            onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
                            onBlur={handleBlur}
                            options={Array.isArray(options) ? options : []}
                            getOptionLabel={getOptionLabel}
                            isOptionEqualToValue={isOptionEqualToValue}
                            getOptionDisabled={(option) => getOptionLabel(option) === 'Not Found'}
                            disabled={disabled}
                            renderOption={(props, option) => {
                                const optionLabel = getOptionLabel(option);
                                const isMatch = optionLabel.toLowerCase() === inputValue.toLowerCase();
                                return (
                                    <li
                                        {...props}
                                        style={{
                                            backgroundColor: isMatch
                                                ? isDarkMode
                                                    ? '#2e4354'
                                                    : '#c7eaf9'
                                                : 'inherit',
                                            fontWeight: isMatch ? 600 : 400,
                                        }}
                                    >
                                        {optionLabel}
                                    </li>
                                );
                            }}
                            renderInput={(params) => (
                                <TextField {...params} label={label} size="small" />
                            )}
                            fullWidth
                            slotProps={{
                                paper: {
                                    sx: {
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'dark' ? '#1e1e1e' : '#e0f7fa',
                                        '& .MuiAutocomplete-option': {
                                            backgroundColor: 'transparent',
                                            '&[aria-selected="true"]': {
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'dark' ? '#333' : '#e0f7fa',
                                            },
                                            '&:hover': {
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'dark' ? '#2c2c2c' : '#e3f2fd',
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
};


export default AutoCompleteFilter;



// options == 0
// options = 'NO FOund'
// setValue = ''
// diable autoCOmeplete