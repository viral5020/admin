import React from 'react';
import { Helmet } from 'react-helmet';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import {
  Pie
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import brand from 'dan-api/dummy/brand';

ChartJS.register(ArcElement, Tooltip, Legend);

// Chart Data
const sectorData = {
  labels: ['Finance', 'Technology', 'Healthcare', 'Energy'],
  datasets: [
    {
      data: [400, 300, 200, 100],
      backgroundColor: ['#42a5f5', '#66bb6a', '#ffca28', '#ef5350'],
      borderColor: '#fff',
      borderWidth: 2,
    },
  ],
};

const stockData = {
  labels: ['Reliance', 'TCS', 'HDFC', 'Infosys'],
  datasets: [
    {
      data: [350, 250, 150, 100],
      backgroundColor: ['#ab47bc', '#29b6f6', '#ffee58', '#8d6e63'],
      borderColor: '#fff',
      borderWidth: 2,
    },
  ],
};

const assetData = {
  labels: ['Equity', 'Commodities', 'Currency', 'Derivatives'],
  datasets: [
    {
      data: [500, 200, 150, 100],
      backgroundColor: ['#26a69a', '#ef5350', '#ffa726', '#5c6bc0'],
      borderColor: '#fff',
      borderWidth: 2,
    },
  ],
};

function PersonalDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  const InfoCard = ({ title, icon, content }) => (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        minHeight: 180,
        borderRadius: 3,
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, #1e1e1e, #2a2a2a)'
          : 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        color: theme.palette.text.primary,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 12px rgba(0,0,0,0.4)'
          : '0 4px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
            borderRadius: '50%',
            p: 1.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <Box pl={0.5}>
        {content.map((line, index) => (
          <Typography key={index} variant="body2" color="text.secondary" sx={{ fontSize: 14, mb: 0.5 }}>
            {line}
          </Typography>
        ))}
      </Box>
    </Paper>
  );

 const ChartCard = ({ title, chartData }) => (
  <Paper
    elevation={0}
 sx={{
        p: 3,
        borderRadius: 3,
        background: theme.palette.background.paper,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 4px 12px rgba(0,0,0,0.4)'
          : '0 4px 10px rgba(0,0,0,0.1)',
      }}
  >
    <Typography variant="h6" fontWeight={600} mb={2} textAlign="center">
      {title}
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 350,
      }}
    >
      <Pie
        data={chartData}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              align: 'center',
              labels: {
                usePointStyle: true,
                color: theme.palette.mode === 'dark' ? '#ddd' : '#333',
              },
            },
          },
        }}
      />
    </Box>
  </Paper>
);

  return (
    <Box sx={{ padding: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>{brand.name} - Personal Dashboard</title>
      </Helmet>

      <Grid container spacing={3}>
        {/* Top Info Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Margin"
            icon={<AccountBalanceWalletIcon sx={{ color: '#1976d2' }} />}
            content={['NSE: ₹25,000', 'NCX: ₹15,000']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Trades"
            icon={<SwapHorizIcon sx={{ color: '#9c27b0' }} />}
            content={['Total: 120', 'Today: 5']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Positions"
            icon={<TrendingUpIcon sx={{ color: '#4caf50' }} />}
            content={['Active: 10', 'Closed: 50']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            title="Pending Trades"
            icon={<AccessTimeIcon sx={{ color: '#ff9800' }} />}
            content={['7']}
          />
        </Grid>

       <Grid item xs={12}>
  <Grid container spacing={2}>
    <Grid item xs={12} md={8}>
      <ChartCard title="Sector-wise Distribution" chartData={sectorData} />
    </Grid>
    <Grid item xs={12} md={4}>
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 3,
          height: '100%',
          background: theme.palette.background.paper,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0,0,0,0.4)'
            : '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
  Recent Login
</Typography>
<Divider sx={{ mb: 2 }} />

<Box display="flex" flexDirection="column" gap={2}>
  {/* Entry 1 */}
  <Box display="flex" alignItems="center" gap={2}>
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#1976d2',
      }}
    />
    <Box>
      <Typography variant="body2" fontWeight={500}>
        24 June 2025, 10:45 AM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Chrome Browser
      </Typography>
    </Box>
  </Box>

  {/* Entry 2 */}
  <Box display="flex" alignItems="center" gap={2}>
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#9c27b0',
      }}
    />
    <Box>
      <Typography variant="body2" fontWeight={500}>
        23 June 2025, 6:22 PM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Firefox Browser
      </Typography>
    </Box>
  </Box>

  {/* Entry 3 */}
  <Box display="flex" alignItems="center" gap={2}>
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#4caf50',
      }}
    />
    <Box>
      <Typography variant="body2" fontWeight={500}>
        22 June 2025, 9:10 AM
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Mobile App
      </Typography>
    </Box>
  </Box>
</Box>
      </Paper>
    </Grid>
  </Grid>
</Grid>



        {/* Asset-wise Chart BELOW sector + login */}
        <Grid item xs={12} md={12}>
          <ChartCard title="Asset-wise Distribution" chartData={assetData} />
        </Grid>
      </Grid>
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
