import React, { useState } from 'react';
import {
    Container, Typography, Tabs, Tab, Box, Button, Grid, Paper, IconButton, Divider, useTheme
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const ledgerData = [
    { range: '07JUL-12JUL', date: '07-12-2025', market: 'MCX-NSE-NSEOPT-GLOBAL', amount: 540 },
    { range: '14JUL-19JUL', date: '07-19-2025', market: 'MCX-NSE-NSEOPT-GLOBAL', amount: -27005.68 }
];

export default function LedgerPage() {
    const [tab, setTab] = useState(0);
    const theme = useTheme();

    const handleDownloadReport = () => {
        alert('Report Downloaded (Dummy Action)');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Ledger Master
            </Typography>

            <Tabs
                value={tab}
                onChange={(e, val) => setTab(val)}
                variant="fullWidth"
                sx={{
                    mb: 1,
                    borderRadius: '8px',
                    minHeight: '36px',
                    backgroundColor: '#f5f7fa',
                    '& .MuiTab-root': {
                        minHeight: '36px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    },
                    '& .Mui-selected': { color: '#fff !important', backgroundColor: theme.palette.primary.main }
                }}
            >
                <Tab label="STOCK" />
                <Tab label="FOREX" />
                <Tab label="SPORTS" />
            </Tabs>

            <Paper
                elevation={3}
                sx={{
                    p: 1,
                    mb: 1,
                    borderRadius: 2,
                    background: '#fff',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 700, fontSize: '1.2rem' }}>
                    -758917.97
                </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: 1.5, mb: 1, borderRadius: 2, background: '#fafafa' }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography fontWeight={600} fontSize="0.85rem">Opening Balance</Typography>
                        <Typography variant="caption" sx={{ color: 'gray' }}>07-08-2025</Typography>
                    </Grid>
                    <Grid item>
                        <Typography fontWeight={700} sx={{ color: '#f44336', fontSize: '1rem' }}>
                            -732452.29
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {ledgerData.map((item, idx) => (
                <Paper key={idx} elevation={2} sx={{ p: 1.5, mb: 1, borderRadius: 2 }}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={8}>
                            <Typography fontWeight={600} fontSize="0.85rem">{item.range}</Typography>
                            <Typography variant="caption" sx={{ color: 'gray' }}>{item.date}</Typography>
                            <Typography variant="body2" fontSize="0.75rem">{item.market}</Typography>
                        </Grid>

                        <Grid item xs={4} textAlign="right">
                            <IconButton size="small">
                                <PictureAsPdfIcon sx={{ color: '#555', fontSize: '1rem' }} />
                            </IconButton>
                            <Typography
                                variant="body1"
                                fontWeight={700}
                                sx={{
                                    color: item.amount > 0 ? '#4caf50' : '#f44336',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {item.amount > 0 ? `+${item.amount.toFixed(2)}` : `${item.amount.toFixed(2)}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleDownloadReport}
                sx={{ mt: 2, py: 1, fontSize: '0.85rem', fontWeight: 600, borderRadius: 2 }}
            >
                Download Report
            </Button>
        </Container>
    );
}
