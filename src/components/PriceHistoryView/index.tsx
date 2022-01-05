import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import PriceHistoryToolTip from './tooltip';
import { renderToString } from 'react-dom/server';

interface ComponentProps {}

const PriceHistoryView: React.FC<ComponentProps> = (): JSX.Element => {
    const tooltipBox = ({
        series,
        seriesIndex,
        dataPointIndex,
        w,
    }: {
        series: any;
        seriesIndex: any;
        dataPointIndex: any;
        w: any;
    }) => {
        return renderToString(
            <PriceHistoryToolTip
                price={series[seriesIndex][dataPointIndex]}
                timestamp={w.globals.seriesX[seriesIndex][dataPointIndex]}
            />,
        );
    };

    const options = {
        chart: {
            id: 'area-bar',
        },
        dataLabels: { enabled: false },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.9,
            },
        },
        xaxis: {
            type: 'datetime' as const,
            labels: {
                format: 'MMM',
            },
        },
        tooltip: {
            custom: tooltipBox,
        },
    };
    const series = [
        {
            data: [
                { x: '01/01/2021', y: 10 },
                { x: '01/21/2021', y: 60 },
                { x: '02/06/2021', y: 40 },
                { x: '03/06/2021', y: 30 },
                { x: '04/06/2021', y: 20 },
                { x: '04/17/2021', y: 30 },
                { x: '05/06/2021', y: 40 },
                { x: '06/06/2021', y: 60 },
                { x: '07/06/2021', y: 50 },
                { x: '08/06/2021', y: 40 },
                { x: '09/06/2021', y: 60 },
                { x: '10/06/2021', y: 80 },
                { x: '11/06/2021', y: 90 },
                { x: '12/06/2021', y: 70 },
            ],
        },
    ];

    const [chartOptions, setChartOptions] = useState(options);
    const [chartSeries, setChartSeries] = useState(series);

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={22} fontWeight={700}>
                    Price History
                </Typography>
            </Stack>
            <Chart options={chartOptions} series={chartSeries} type="area" />
        </Box>
    );
};

export default PriceHistoryView;
