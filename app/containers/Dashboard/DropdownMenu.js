import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    Button,
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const StyledDropdown = ({ selected, setSelected }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    // const [selected, setSelected] = useState('NCX');
    const theme = useTheme();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelect = (value) => {
        setSelected(value);
        setAnchorEl(null);
    };

    return (
        <Box>
            <Button
                onClick={handleClick}
                variant="outlined"
                endIcon={<ExpandMoreIcon />}
                sx={{
                    borderRadius: 3,
                    px: 2.5,
                    py: 1,
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? 'rgba(30, 30, 30, 0.4)'
                            : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    borderColor: 'transparent',
                    '&:hover': {
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? 'rgba(40, 40, 40, 0.6)'
                                : 'rgba(240, 240, 240, 0.6)',
                    },
                }}
            >
                {selected}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    elevation: 6,
                    sx: {
                        mt: 1,
                        borderRadius: 2,
                        minWidth: 100,
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)',
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? 'rgba(30, 30, 30, 0.4)'
                                : 'rgba(255, 255, 255, 0.5)',
                        transition: 'all 0.3s ease',
                    },
                }}
                MenuListProps={{
                    disablePadding: true,
                }}
            >
                {['NCX', 'NSE'].map((option) => (
                    <MenuItem
                        key={option}
                        selected={selected === option}
                        onClick={() => handleSelect(option)}
                        sx={{
                            fontWeight: selected === option ? 600 : 400,
                            px: 2.5,
                            py: 1.25,
                            transition: 'all 0.2s',
                            '&:hover': {
                                backgroundColor:
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'rgba(0,0,0,0.05)',
                            },
                        }}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default StyledDropdown;
