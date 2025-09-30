import React from "react";
import { Grid, TextField } from "@mui/material";
import { getInputBoxStyle } from "./inputBoxStyle";
import { useTheme } from "@emotion/react";
import dayjs from 'dayjs';

const DateFilter = ({
    label,
    value = '',
    onChange,
    isMaxDateToday = true,
    gridProps = {},
}) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const today = dayjs().format('YYYY-MM-DD');

    return (
        <Grid item xs={12} sm={6} md={3} lg={2.4} {...gridProps}>
            <TextField
                label={label}
                type="date"
                size="small"
                // value={
                //     value
                //         ? (() => {
                //             const [dd, mm, yyyy] = value.split('-');
                //             return `${yyyy}-${mm}-${dd}`;
                //         })()
                //         : ''
                // }
                // onChange={(e) => {
                //     const [yyyy, mm, dd] = e.target.value.split('-');
                //     const formatted = `${dd}-${mm}-${yyyy}`;
                //     onChange(formatted);
                // }}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                InputProps={{ inputProps: isMaxDateToday && { max: today } }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={getInputBoxStyle(isDarkMode)}
            />
        </Grid>
    );
};

export default DateFilter;
