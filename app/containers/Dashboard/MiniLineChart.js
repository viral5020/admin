import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

const MiniLineChart = ({ data, isUp }) => {
  const theme = useTheme();

  const series = [{
    name: 'Price',
    data: data || [10, 12, 9, 14, 13, 15, 14], // fallback demo data
  }];

  const options = {
    chart: {
      type: 'line',
      height: 40,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: [
      isUp
        ? theme.palette.mode === 'dark' ? '#26a69a' : '#388e3c'
        : theme.palette.mode === 'dark' ? '#ef6d61' : '#d32f2f'
    ],
    tooltip: {
      enabled: false,
    },
  };

  return (
    <div style={{ width: 80, height: 40 }}>
      <ReactApexChart options={options} series={series} type="line" height={40} />
    </div>
  );
};

export default MiniLineChart;
