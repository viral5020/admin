import React from "react";
import {
    Grid,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import { getInputBoxStyle } from "./inputBoxStyle";
import { useTheme } from "@emotion/react";

const RadioFilter = ({
    label,
    options,
    value,
    onChange,
    // gridProps = {},
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <Grid item>
            <FormControl
                component="fieldset"
                fullWidth
                sx={{
                    ...getInputBoxStyle(isDarkMode),
                    px: 1.5,
                    pl: 3,
                    py: 1,
                    pb: 1,
                    borderRadius: 1,
                    border: isDarkMode ? '1px solid #444' : '1px solid #ccc',
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                }}
            >
                <FormLabel
                    component="legend"
                    sx={{
                        fontSize: '0.8rem',
                        color: isDarkMode ? '#aaa' : '#444',
                        mb: 0,
                    }}
                >
                    {label}
                </FormLabel>

                <RadioGroup
                    row
                    value={value?.value || ''}
                    onChange={(e) => {
                        const selected = options.find((opt) => opt.value === e.target.value);
                        onChange(selected);
                    }}
                    sx={{
                        gap: 3,
                        alignItems: 'center',
                        '& .MuiFormControlLabel-root': {
                            my: 0,
                            py: 0,
                            height: 16,
                            mr: 0,
                        },
                        '& .MuiRadio-root': {
                            p: '2px',
                        },
                    }}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio
                                size="small"
                                sx={{
                                    p: 0.5, // reduce padding around radio
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 14, // smaller icon size (default is 20)
                                    },
                                }}
                            />}
                            label={option.label}
                            sx={{
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '0.8rem',
                                    color: isDarkMode ? '#ddd' : '#333',
                                    lineHeight: 1,
                                },
                            }}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Grid>

    );
};

export default RadioFilter;
