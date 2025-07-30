import React from "react";
import {
    Grid,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Box,
} from "@mui/material";
import { useTheme } from "@emotion/react";

const RadioFilter = ({
    label,
    options,
    value,
    onChange,
    flag = true,
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Grid item xs={flag && 12} sm={flag && 6} md={flag && 3} lg={flag && 2.4}>
            <Box
                sx={{
                    pr: 1,
                    borderRadius: 1,
                    backgroundColor: "transparent", // No background
                    boxShadow: "none",              // No shadow
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        mb: 0,
                        color: isDarkMode ? "#ccc" : "#333",
                    }}
                >
                    {label}
                </Typography>

                <RadioGroup
                    row
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    sx={{
                        gap: 2,
                        flexWrap: "wrap",
                        '& .MuiFormControlLabel-root': {
                            m: 0,
                        },
                    }}
                >
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={
                                <Radio
                                    size="small"
                                    sx={{
                                        p: 0.5,
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 16,
                                        },
                                        color: isDarkMode ? "#aaa" : "#666",
                                        '&.Mui-checked': {
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontSize: "0.8rem",
                                        color: isDarkMode ? "#ddd" : "#333",
                                    }}
                                >
                                    {option.label}
                                </Typography>
                            }
                        />
                    ))}
                </RadioGroup>
            </Box>
        </Grid>
    );
};

export default RadioFilter;


// import React, { useEffect } from "react";
// import {
//     Grid,
//     FormControl,
//     FormLabel,
//     RadioGroup,
//     FormControlLabel,
//     Radio,
// } from "@mui/material";
// import { getInputBoxStyle } from "./inputBoxStyle";
// import { useTheme } from "@emotion/react";

// const RadioFilter = ({
//     label,
//     options,
//     value,
//     onChange,
//     flag = true,
//     // gridProps = {},
// }) => {
//     const theme = useTheme();
//     const isDarkMode = theme.palette.mode === 'dark';

//     useEffect(() => {

//     }, [])

//     return (
//         <Grid item xs={flag && 12} sm={flag && 6} md={flag && 3} lg={flag && 2.4} >
//             <FormControl
//                 component="fieldset"
//                 fullWidth
//                 sx={{
//                     ...getInputBoxStyle(isDarkMode),
//                     px: 1.5,
//                     pl: 2.5,
//                     pt: 0.4,
//                     pb: 1,
//                     borderRadius: 1,
//                     border: isDarkMode ? '1px solid #444' : '1px solid #ccc',
//                     backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
//                     position: 'relative',
//                     top: '-6px',
//                 }}
//             >
//                 <FormLabel
//                     component="legend"
//                     sx={{
//                         fontSize: '0.8rem',
//                         color: isDarkMode ? '#aaa' : '#444',
//                         mb: 0,
//                     }}
//                 >
//                     {label}
//                 </FormLabel>

//                 <RadioGroup
//                     row
//                     value={value || ''}
//                     onChange={(e) => onChange(e.target.value)}
//                     sx={{
//                         gap: 3,
//                         alignItems: 'center',
//                         '& .MuiFormControlLabel-root': {
//                             my: 0,
//                             py: 0,
//                             height: 17,
//                             mr: 0,
//                         },
//                         '& .MuiRadio-root': {
//                             p: '2px',
//                         },
//                     }}
//                 >
//                     {options.map((option) => (
//                         <FormControlLabel
//                             key={option.value}
//                             value={option.value}
//                             control={<Radio
//                                 size="small"
//                                 sx={{
//                                     p: 0.5, // reduce padding around radio
//                                     '& .MuiSvgIcon-root': {
//                                         fontSize: 14, // smaller icon size (default is 20)
//                                     },
//                                 }}
//                             />}
//                             label={option.label}
//                             sx={{
//                                 '& .MuiFormControlLabel-label': {
//                                     fontSize: '0.8rem',
//                                     color: isDarkMode ? '#ddd' : '#333',
//                                     lineHeight: 1,
//                                 },
//                             }}
//                         />
//                     ))}
//                 </RadioGroup>
//             </FormControl>
//         </Grid>

//     );
// };

// export default RadioFilter;
