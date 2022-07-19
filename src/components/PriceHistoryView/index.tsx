import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import PriceHistoryToolTip from './tooltip';
import { renderToString } from 'react-dom/server';
import { TypeChartAxis, TypePriceHistoryFetch } from 'src/types/product-types';
import { TypeSelectItem } from 'src/types/select-types';
import { getChartTimestampList } from 'src/services/common';
import Select from 'src/components/Select';
import { SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { priceHistoryUnitSelectOptions } from 'src/constants/select-constants';
import ReactApexChart from 'react-apexcharts';
import { serverConfig } from 'src/config';

interface ComponentProps {
    createdTime: number;
    creator: string;
}

const PriceHistoryView: React.FC<ComponentProps> = ({ createdTime, creator }): JSX.Element => {
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
                username={w.globals.initialSeries[seriesIndex].data[dataPointIndex].username}
            />,
        );
    };

    const [priceHistoryUnit, setPriceHistoryUnit] = useState<TypeSelectItem | undefined>(
        priceHistoryUnitSelectOptions[1],
    );

    const series = [
        {
            data: [
                { x: 1640962800000, y: 10, username: '' },
                { x: 1640963000000, y: 5, username: '' },
            ],
        },
    ];

    const options = {
        chart: {
            id: 'area-datetime',
            type: 'area' as const,
            zoom: {
                autoScaleYaxis: true,
            },
        },
        annotations: {
            yaxis: [
                {
                    y: 30,
                    borderColor: '#999',
                    label: {
                        show: true,
                        text: 'Support',
                        style: {
                            color: '#fff',
                            background: '#00E396',
                        },
                    },
                },
            ],
            xaxis: [
                {
                    x: new Date('01 Jan 2022').getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Start',
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                    },
                },
            ],
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 0,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime' as const,
            labels: {
                datetimeUTC: false,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'dd MMM',
                    day: 'dd MMM',
                    hour: 'HH:mm'
                }
            },
            min: new Date('01 Mar 2022').getTime(),
            max: new Date().getTime() + 10000000,
            tickAmount: 6,
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy',
            },
            custom: tooltipBox,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100],
            },
        },
    };

    const [chartOptions] = useState(options);
    const [chartSeries, setChartSeries] = useState(series);
    const [priceHistoryUnitSelectOpen, setPriceHistoryUnitSelectOpen] = useState(false);

    const handlePriceHistoryUnitChange = (value: string) => {
        const item = priceHistoryUnitSelectOptions.find((option) => option.value === value);
        setPriceHistoryUnit(item);
        const timeRange = getChartTimestampList(item?.value || '');
        ApexCharts.exec('area-datetime', 'zoomX', timeRange.start, timeRange.end);
    };
    const params = useParams();

    useEffect(() => {
        let unmounted = false;
        fetch(`${serverConfig.assistServiceUrl}/api/v1/getTokenPriceHistory?tokenId=${params.id}`)
            .then((response) => {
                response.json().then((jsonPriceList) => {
                    if (!unmounted) {
                        const productPriceList: TypePriceHistoryFetch[] = jsonPriceList.data;
                        const _latestPriceList: Array<TypeChartAxis> = [];
                        _latestPriceList.push({ x: createdTime, y: 0, username: creator });
                        for (let i = 0; i < productPriceList.length; i++) {
                            _latestPriceList.push({
                                x: parseInt(productPriceList[i].updateTime) * 1000,
                                y: productPriceList[i].price / 1e18,
                                username: productPriceList[i].name,
                            });
                        }
                        const lastValue = _latestPriceList[_latestPriceList.length - 1];
                        _latestPriceList.push({
                            x: new Date().getTime(),
                            y: lastValue.y,
                            username: lastValue.username,
                        });
                        setChartSeries([{ data: _latestPriceList }]);
                        if (_latestPriceList.length > 2) handlePriceHistoryUnitChange('Weekly');
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            unmounted = true;
        };
    }, [params.id, createdTime, creator]);

    return (
        <>
            {chartSeries[0].data.length > 2 && (
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" zIndex={10}>
                        <Typography fontSize={22} fontWeight={700}>
                            Price History
                        </Typography>
                        <Select
                            titlebox={
                                <SelectBtn fullWidth isopen={priceHistoryUnitSelectOpen ? 1 : 0}>
                                    {priceHistoryUnit ? priceHistoryUnit.label : 'Select'}
                                    <Icon icon="ph:caret-down" className="arrow-icon" />
                                </SelectBtn>
                            }
                            selectedItem={priceHistoryUnit}
                            options={priceHistoryUnitSelectOptions}
                            isOpen={priceHistoryUnitSelectOpen ? 1 : 0}
                            handleClick={handlePriceHistoryUnitChange}
                            setIsOpen={setPriceHistoryUnitSelectOpen}
                            width={120}
                        />
                    </Stack>
                    <Box zIndex={0}>
                        <ReactApexChart options={chartOptions} series={chartSeries} type="area" />
                    </Box>
                </Stack>
            )}
        </>
    );
};

export default PriceHistoryView;
