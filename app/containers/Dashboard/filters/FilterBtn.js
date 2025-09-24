import { useTheme } from '@emotion/react';
import { Button } from '@mui/material';
import React from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';


const FilterBtn = ({ setFilterOpen, Icon, onClick }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <>
            <Button
                variant="outlined"
                size="small"
                startIcon={Icon ? Icon : <FilterListIcon sx={{ position: 'relative', left: '4px' }} />}
                onClick={() => onClick ? onClick() : setFilterOpen(true)}
                sx={{
                    // p: '9px',
                    height: '100%',
                    backgroundColor: isDarkMode ? '#263238' : '#fff',
                    borderColor: isDarkMode ? '#90a4ae' : '#607d8b',
                    color: isDarkMode ? '#cfd8dc' : '#607d8b',
                    borderRadius: '9px',
                    // px: 0,
                    // py: 0,
                    minHeight: '10px',
                    minWidth: '35px',
                    maxWidth: '40px',
                    '& .MuiButton-startIcon': {
                        marginRight: '6px', // Adjust icon spacing if needed
                    },
                    '&:hover': {
                        borderColor: isDarkMode ? '#b0bec5' : '#546e7a',
                        backgroundColor: isDarkMode ? '#37474f' : '#f0f4f7',
                        color: isDarkMode ? '#eceff1' : '#546e7a',
                    },
                }}
            />
        </>
    )
}

export default FilterBtn

//        application.js   <Route path="dashboard/forex-watchlist" element={<Watchlist />} />
// import Forex_position, Summary_report,