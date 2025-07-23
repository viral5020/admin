import React, { useState } from 'react';
import {
    Typography, Tabs, Tab, Box, Grid, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import { keyframes } from '@emotion/react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const ledgerData = [
    { range: '07JUL-12JUL', date: '07-12-2025', market: 'MCX-NSE-NSEOPT-GLOBAL', amount: 540, pdf: '/pdfs/ledger1.pdf' },
    { range: '14JUL-19JUL', date: '07-19-2025', market: 'MCX-NSE-NSEOPT-GLOBAL', amount: -27005.68, pdf: '/pdfs/ledger2.pdf' }
];

const openingBalance = -732452.29;
const balanceAmount = -758917.97;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export default function LedgerPage() {
    const [tab, setTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:767px)');

    const bgPaper = theme.palette.background.paper;
    const bgDefault = theme.palette.background.default;
    const errorColor = theme.palette.error.main;
    const profitColor = theme.palette.success.main;
    const textColor = theme.palette.text.primary;
    const subtitleColor = theme.palette.text.secondary;
    const borderColor = theme.palette.divider;

    return (
        <Box sx={{ background: bgDefault, minHeight: '100vh' }}>
            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(e, val) => setTab(val)}
                variant="fullWidth"
                sx={{
                    borderBottom: `1px solid ${borderColor}`,
                    minHeight: '26px',
                    '& .MuiTabs-flexContainer': {
                        minHeight: '26px',
                    },
                    '& .MuiTab-root': {
                        minHeight: '26px',
                        padding: '2px 4px', // smaller padding
                        fontSize: '0.7rem', // slightly smaller text
                        fontWeight: 600,
                        color: textColor,
                        transition: 'all 0.3s ease-in-out',
                    },
                    '& .Mui-selected': {
                        color: '#fff !important',
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #21cbf3 100%)',
                        borderRadius: '4px 4px 0 0',
                    },
                    '& .MuiTabs-indicator': {
                        display: 'none', // optional: hide the default underline
                    }
                }}
            >
                <Tab disableRipple label="STOCK" />
                <Tab disableRipple label="FOREX" />
                <Tab disableRipple label="SPORTS" />
            </Tabs>



            <Box sx={{ textAlign: 'center', px: 1, py: 1 }}>
                {/* Net Balance */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        {balanceAmount < 0 ? (
                            <TrendingDownIcon sx={{ color: errorColor, fontSize: '1.2rem' }} />
                        ) : (
                            <TrendingUpIcon sx={{ color: profitColor, fontSize: '1.2rem' }} />
                        )}

                        <Box
                            component="span"
                            sx={{
                                px: 1,
                                py: 0.3,
                                borderRadius: 1,
                                backgroundColor: balanceAmount < 0 ? '#ffebee' : '#e8f5e9',
                                color: balanceAmount < 0 ? errorColor : profitColor,
                                fontSize: '1rem',
                                fontWeight: 700,
                                lineHeight: 1.5,
                            }}
                        >
                            {balanceAmount.toFixed(2)}
                        </Box>
                    </Box>
                </Box>


                {/* Opening Balance */}
                <Box
                    sx={{
                        backgroundColor: openingBalance < 0 ? '#ffebee' : '#e8f5e9', // light red or green
                        border: `2px solid ${openingBalance < 0 ? '#f44336' : '#4caf50'}`, // red or green border
                        px: 1.5,
                        py: 1,
                        mb: 1.5,
                        borderRadius: 1.5,
                        boxShadow: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap', // ensures responsiveness
                        gap: 1,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight={600} fontSize="0.8rem">
                            Opening Balance
                        </Typography>
                        <Typography variant="caption" sx={{ color: subtitleColor }}>
                            07-08-2025
                        </Typography>
                    </Box>

                    <Typography
                        fontWeight={700}
                        sx={{
                            color: openingBalance < 0 ? errorColor : profitColor,
                            fontSize: '0.9rem',
                        }}
                    >
                        {openingBalance.toFixed(2)}
                    </Typography>
                </Box>



                {/* Ledger Cards */}
                {ledgerData.map((item, idx) => {
                    const isProfit = item.amount > 0;
                    const borderGradient = isProfit
                        ? 'linear-gradient(to right, #00c6ff, #0072ff)'
                        : 'linear-gradient(to right, #f44336, #d32f2f)';

                    const cardStyle = {
                        mb: 0.5,
                        px: 1,
                        py: 1,
                        borderRadius: 2,
                        background: bgPaper,
                        border: '1px solid transparent',
                        backgroundImage: `linear-gradient(${bgPaper}, ${bgPaper}), ${borderGradient}`,
                        backgroundOrigin: 'padding-box, border-box',
                        backgroundClip: 'padding-box, border-box'
                    };

                    return (
                        <Box key={idx} sx={{ ...cardStyle, py: 0, my: 0.5, mb: 0 }}>
                            <Grid
                                container
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={0}
                                wrap="nowrap"
                            >
                                {/* Range + Date */}
                                <Grid item xs={3} sx={{ pl: 0, ml: 0, textAlign: 'left' }}>
                                    <Typography fontWeight={600} fontSize="0.8rem" lineHeight={1.3}>
                                        {item.range}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: subtitleColor, lineHeight: 1.3 }}
                                    >
                                        {item.date}
                                    </Typography>
                                </Grid>

                                {/* Market */}
                                <Grid item xs={5}>
                                    <Typography
                                        variant="body2"
                                        fontSize="0.75rem"
                                        lineHeight={1.3}
                                        sx={{ whiteSpace: 'nowrap' }}
                                    >
                                        {item.market}
                                    </Typography>
                                </Grid>

                                {/* P&L + Icon */}
                                <Grid
                                    item
                                    xs={4}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{
                                            color: isProfit ? profitColor : errorColor,
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        {isProfit ? `+${item.amount.toFixed(2)}` : `${item.amount.toFixed(2)}`}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(item.pdf, '_blank')}
                                    >
                                        <PictureAsPdfIcon sx={{ color: subtitleColor, fontSize: '1rem' }} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>

                    );
                })}
            </Box>
        </Box>
    );
}
