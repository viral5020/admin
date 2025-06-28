// CandleChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const ApexCharts = ({ theme }) => {
    const series = [{
        data: [
            {
                x: new Date(2025, 5, 27),
                y: [51, 55, 48, 53],
            },
            {
                x: new Date(2025, 5, 28),
                y: [53, 56, 50, 52],
            },
            {
                x: new Date(2025, 5, 29),
                y: [52, 58, 51, 57],
            },
            {
                x: new Date(2025, 5, 30),
                y: [57, 60, 55, 59],
            },
        ],
    }];

    const options = {
        chart: {
            type: 'candlestick',
            height: 350,
            toolbar: { show: false },
        },
        theme: {
            mode: theme.palette.mode, // auto switches between 'light' or 'dark'
        },
        title: {
            text: `${name} Candlestick Chart`,
            align: 'left',
            style: {
                color: theme.palette.text.primary,
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        yaxis: {
            tooltip: { enabled: true },
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        tooltip: {
            theme: theme.palette.mode, // dark or light
        },
        legend: {
            labels: {
                colors: theme.palette.text.primary,
            },
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
        ],
    };


    return (
        <div>
            {/* CANDLE CHART */}
            <Chart options={options} series={series} type="candlestick" height={350} />
        </div>
    );
};

export default ApexCharts;
