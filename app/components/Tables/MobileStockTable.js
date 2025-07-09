import React, { useState } from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Navigate, useNavigate } from 'react-router-dom';

const MobileStockTable = ({ searchText, isStockOpen, setIsStockOpen, watchList, isDarkMode }) => {

    return (
        <Box>
            {watchList.map((stock, idx) => {
                const isUp = stock.priceChange > 0;
                // const color = isUp ? '#00b894' : '#e17055'; // updated softer green/red
                const color = isDarkMode
                    ? isUp ? '#26a69a' : '#ef6d61'
                    : isUp ? '#388055' : '#BB3536';

                const textColor = isDarkMode ? '#e0e0e0' : '#1f1f1f';  // light gray vs dark gray
                // const textColor = isDarkMode ? '#e0e0e0' : '#444';
                const Icon = isUp ? ArrowDropUpIcon : ArrowDropDownIcon;

                if (stock.scriptName.toLowerCase().indexOf(searchText.toLowerCase()) === -1) {
                    return false;
                }

                return (
                    <React.Fragment key={stock.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 1.5,
                                py: 1,
                            }}
                            onClick={() => setIsStockOpen(stock)}
                        >
                            {/* LHS: Script Name */}
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {stock.scriptName}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'inline-block',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        borderRadius: '4px',
                                        // backgroundColor: isDarkMode === 'dark' ? '#2f3542' : '#e0e0e0',
                                        color: isDarkMode ? '#ccc' : '#666',
                                        // color: isDarkMode === 'dark' ? '#dfe4ea' : '#333',
                                        width: 'fit-content'
                                    }}
                                >
                                    {stock.exchange}
                                </Box>
                            </Box>


                            {/* RHS: LTP and Price Change */}
                            <Stack alignItems="flex-end">
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    sx={{ color, display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}
                                >
                                    ₹ {stock.ltp.toFixed(2)} <Icon fontSize="small" />
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: textColor, fontSize: '0.9rem' }}
                                >
                                    {stock.priceChange > 0 ? '+' : ''}
                                    {stock.priceChange.toFixed(2)} ({stock.priceChangePercent.toFixed(2)}%)
                                </Typography>
                            </Stack>
                        </Box>

                        {/* Divider after each item except last */}
                        {idx !== watchList.length - 1 && (
                            <Divider sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
                        )}
                    </React.Fragment>
                );
            })}
        </Box>
    );
};

export default MobileStockTable;
