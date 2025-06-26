import React, { useMemo } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Paper, Typography, Box, Divider, useMediaQuery as useMUIQuery,
} from '@mui/material';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import brand from 'dan-api/dummy/brand';

ChartJS.register(ArcElement, Tooltip, Legend);

const rawSectorData = {
  labels: ['Finance', 'Technology', 'Healthcare', 'Energy'],
  datasets: [{
    data: [400, 300, 200, 100],
    backgroundColor: ['#42a5f5', '#66bb6a', '#ffca28', '#ef5350'],
    borderColor: '#fff',
    borderWidth: 2,
  }],
};

const rawAssetData = {
  labels: ['Equity', 'Commodities', 'Currency', 'Derivatives'],
  datasets: [{
    data: [500, 200, 150, 100],
    backgroundColor: ['#26a69a', '#ef5350', '#ffa726', '#5c6bc0'],
    borderColor: '#fff',
    borderWidth: 2,
  }],
};

const boxHeight = 300;

function PersonalDashboard() {
  const theme = useTheme();
  const isMobile = useMUIQuery(theme.breakpoints.down('sm'));

  const [openModal, setOpenModal] = useState({ nse: false, ncx: false });
  const [expanded, setExpanded] = useState({ nse: false, ncx: false });

  const sectorData = useMemo(() => rawSectorData, []);
  const assetData = useMemo(() => rawAssetData, []);

  const glassStyles = {
    p: 3,
    borderRadius: 4,
    backdropFilter: 'blur(10px)',
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(30, 30, 30, 0.4)'
      : 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: theme.shadows[6],
  };

  const handleMoreClick = (type) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleClose = (type) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const toggleExpand = (type) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const InfoCard = ({ title, icon, content }) => (
    <Paper elevation={0} sx={{ ...glassStyles, minHeight: 170, display: 'flex', alignItems: 'center' }}>
      <Box sx={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        p: 1.5,
        mr: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 64,
        minHeight: 64,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>{title}</Typography>
        <Divider sx={{ width: '40%', mb: 1 }} />
        {content.map((line, i) => (
          <Typography key={i} variant="body2" color="text.secondary">{line}</Typography>
        ))}
      </Box>
    </Paper>
  );

  const ChartCard = ({ title, chartData }) => (
    <Paper elevation={0} sx={glassStyles}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={2}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ height: 300 }}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: theme.palette.text.primary,
                  usePointStyle: true,
                  padding: 20,
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
      <Helmet>
        <title>{brand.name} - Personal Dashboard</title>
      </Helmet>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Margin"
            icon={<AccountBalanceWalletIcon sx={{ color: '#1976d2', fontSize: 30 }} />}
            content={[
              <>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => toggleExpand('nse')}
                >
                  NSE: ₹25,000
                </Typography>
                {expanded.nse && (
                  <Box pl={2} pt={1}>
                    <Typography variant="body2">• Initial Margin: ₹15,000</Typography>
                    <Typography variant="body2">• Exposure Margin: ₹10,000</Typography>
                    <Typography variant="body2">• Total Margin: ₹25,000</Typography>
                    <Typography variant="body2">• Leverage: 5x</Typography>
                  </Box>
                )}
              </>,
              <>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => toggleExpand('ncx')}
                >
                  NCX: ₹15,000
                </Typography>
                {expanded.ncx && (
                  <Box pl={2} pt={1}>
                    <Typography variant="body2">• Commodity Margin: ₹10,000</Typography>
                    <Typography variant="body2">• Currency Margin: ₹5,000</Typography>
                    <Typography variant="body2">• Total Margin: ₹15,000</Typography>
                    <Typography variant="body2">• Leverage: 3x</Typography>
                  </Box>
                )}
              </>,
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Trades"
            icon={<SwapHorizIcon sx={{ color: '#9c27b0', fontSize: 30 }} />}
            content={['Total: 120', 'Today: 5']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Positions"
            icon={<TrendingUpIcon sx={{ color: '#4caf50', fontSize: 30 }} />}
            content={['Active: 10', 'Closed: 50']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Pending Trades"
            icon={<AccessTimeIcon sx={{ color: '#ff9800', fontSize: 30 }} />}
            content={['7']}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <ChartCard title="Sector-wise Distribution" chartData={sectorData} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ ...glassStyles, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Recent Login</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              {[
                { color: '#1976d2', date: '24 June 2025, 10:45 AM', device: 'Chrome Browser' },
                { color: '#9c27b0', date: '23 June 2025, 6:22 PM', device: 'Firefox Browser' },
                { color: '#4caf50', date: '22 June 2025, 9:10 AM', device: 'Mobile App' },
              ].map((login, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: login.color }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{login.date}</Typography>
                    <Typography variant="caption" color="text.secondary">{login.device}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Asset-wise Distribution" chartData={assetData} />
        </Grid>

        {/* Trending, Gainers, Losers */}
        <Grid item xs={12}>
  <Grid container spacing={1}>
    {['Scripts in Trend', 'Top Gainers', 'Top Losers'].map((title, index) => {
      const headerColor = index === 1 ? 'green' : index === 2 ? 'red' : theme.palette.primary.main;
      const gradientBg =
        index === 1
          ? 'linear-gradient(to right, #e6f4ea, #d0f0d2)'
          : index === 2
          ? 'linear-gradient(to right, #fdecea, #f8d7da)'
          : 'linear-gradient(to right, #e3f2fd, #bbdefb)';

      return (
        <Grid key={index} item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              ...glassStyles,
              height: boxHeight,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              borderRadius: 3,
              boxShadow: theme.shadows[6],
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              mb={2}
              sx={{
                position: 'sticky',
                top: 0,
                background: gradientBg,
                backdropFilter: 'blur(8px)',
                zIndex: 1,
                pb: 1.2,
                pt: 1,
                px: 2,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottom: `1px solid ${theme.palette.divider}`,
                color: headerColor,
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
              }}
            >
              {title}
            </Typography>
                  {(index === 0 ? [
                    { name: 'RELIANCE', ltp: '₹2,485.50', change: '+1.2%' },
                    { name: 'TCS', ltp: '₹3,265.75', change: '-0.5%' },
                    { name: 'INFY', ltp: '₹1,542.30', change: '+0.8%' },
                    { name: 'HDFC', ltp: '₹1,923.90', change: '-1.1%' },
                  ] : index === 1 ? [
                    { name: 'ADANIPORTS', ltp: '₹845.30', change: '+4.2%' },
                    { name: 'TATAMOTORS', ltp: '₹892.75', change: '+3.9%' },
                    { name: 'BHARTIARTL', ltp: '₹1024.10', change: '+3.5%' },
                  ] : [
                    { name: 'WIPRO', ltp: '₹412.40', change: '-₹12.50' },
                    { name: 'TECHM', ltp: '₹492.75', change: '-₹9.80' },
                    { name: 'SBIN', ltp: '₹581.25', change: '-₹8.25' },
                  ]).map((stock, idx) => (
                    <Box key={idx} display="flex" alignItems="center" mb={1.5}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          mr: 1.5,
                          backgroundColor:
                            index === 1
                              ? theme.palette.success.main
                              : index === 2
                                ? theme.palette.error.main
                                : '#ccc',
                        }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{stock.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          LTP: {stock.ltp} | <span style={{ color: index === 2 ? 'red' : 'green' }}>{stock.change}</span>
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Grid>
              );
})}
          </Grid>
        </Grid>
      </Grid>

      {/* NSE Modal */}
      <Dialog open={openModal.nse} onClose={() => handleClose('nse')}>
        <DialogTitle>NSE Margin Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            • Initial Margin: ₹15,000<br />
            • Exposure Margin: ₹10,000<br />
            • Total Margin: ₹25,000<br />
            • Leverage: 5x
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('nse')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* NCX Modal */}
      <Dialog open={openModal.ncx} onClose={() => handleClose('ncx')}>
        <DialogTitle>NCX Margin Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            • Commodity Margin: ₹10,000<br />
            • Currency Margin: ₹5,000<br />
            • Total Margin: ₹15,000<br />
            • Leverage: 3x
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('ncx')}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalDashboard;

// function PersonalDashboard() {
//   // const title = brand.name + ' - Personal Dashboard';
//   // const description = brand.desc;

//   // const lgDown = useMediaQuery(theme => theme.breakpoints.down('lg'));
//   // const { classes } = useStyles();

//   // return (
//   //   <div>
//   //     <Helmet>
//   //       <title>{title}</title>
//   //       <meta name="description" content={description} />
//   //       <meta property="og:title" content={title} />
//   //       <meta property="og:description" content={description} />
//   //       <meta property="twitter:title" content={title} />
//   //       <meta property="twitter:description" content={description} />
//   //     </Helmet>
//   //     {/* 1st Section */}
//   //     {/* <Grid container spacing={3} className={classes.root}>
//   //       <Grid item md={6} xs={12}>
//   //         <CounterIconsWidget />
//   //       </Grid>
//   //       <Grid item md={6} sm={12} xs={12}>
//   //         <div className={classes.sliderWrap}>
//   //           <SliderWidget />
//   //         </div>
//   //       </Grid>
//   //     </Grid> */}
//   //     <Divider className={classes.divider} />
//   //     {/* 2nd Section */}
//   //     <Grid container spacing={2} className={classes.root}>
//   //       <Grid item xs={12}>
//   //         <PerformanceChartWidget />
//   //       </Grid>
//   //     </Grid>
//   //     {/* 3rd Section */}
//   //     <Grid container spacing={3} className={classes.root}>
//   //       <Grid item md={6} xs={12}>
//   //         <Divider className={classes.divider} />
//   //         <ContactWidget />
//   //         <Divider className={classes.divider} />
//   //         <TaskWidget />
//   //       </Grid>
//   //       <Grid item md={6} xs={12}>
//   //         {!lgDown && (
//   //           <Divider className={classes.divider} />
//   //         )}
//   //         <WeatherWidget />
//   //         <Divider className={classes.divider} />
//   //         <DateWidget />
//   //         <Divider className={classes.divider} />
//   //         <TimelineWidget />
//   //       </Grid>
//   //     </Grid>
//   //     <Divider className={classes.divider} />
//   //     <FilesWidget />
//   //   </div>
//   // );
// }
