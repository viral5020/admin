import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const AutocompleteFilter = ({
    label,
    options = [],
    value = [],
    setValue,
    handleFetch,
    isDisabled = false,
    isDarkMode = false,
    disableSelected = false,
    inputBoxStyle = {},
}) => {
    const getText = (opt) => typeof opt === 'string' ? opt : opt?.text || '';

    return (
        <Autocomplete
            multiple
            disabled={isDisabled}
            options={options}
            getOptionLabel={getText}
            value={Array.isArray(value) ? value : []}
            filterSelectedOptions={!disableSelected}
            onInputChange={(e, val, reason) => {
                if (reason === 'input') handleFetch(val, label.toLowerCase());
            }}
            onChange={(e, val) => setValue(val)}
            renderOption={(props, option) => {
                const optionText = getText(option);
                const isSelected = disableSelected && value.some(
                    (item) => getText(item) === optionText
                );

                return (
                    <li
                        {...props}
                        style={{
                            backgroundColor: isSelected
                                ? isDarkMode ? '#333' : '#e0f7fa'
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
                <TextField {...params} label={label} size="small" sx={inputBoxStyle} />
            )}
            noOptionsText={`No ${label} found`}
            fullWidth
            sx={{
                ...inputBoxStyle,
                '& .MuiAutocomplete-input': {
                    width: '100% !important',
                },
            }}
        />
    );
};

export default AutocompleteFilter;
