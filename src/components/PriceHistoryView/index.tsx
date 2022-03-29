import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import PriceHistoryToolTip from './tooltip';
import { renderToString } from 'react-dom/server';
import { TypePriceHistoryFetch, TypeChartAxis } from 'src/types/product-types';
import { TypeSelectItem } from 'src/types/select-types';
import { getChartDateList, getChartTimestampList, getTime } from 'src/services/common';
import Select from 'src/components/Select';
import { SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { priceHistoryUnitSelectOptions } from 'src/constants/select-constants';
import ReactApexChart from 'react-apexcharts';

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
                username={''}
            />,
        );
    };

    // const options = {
    //     chart: {
    //         id: 'area-bar',
    //         type:'area',
    //         zoom: {
    //             autoScaleYaxis: true
    //         }
    //     },
    //     dataLabels: { enabled: false },
    //     grid: {
    //         show: true,
    //         xaxis: {
    //             lines: {
    //                 show: true,
    //             },
    //         },
    //         yaxis: {
    //             lines: {
    //                 show: true,
    //             },
    //         },
    //     },
    //     fill: {
    //         type: 'gradient',
    //         gradient: {
    //             shadeIntensity: 1,
    //             opacityFrom: 0.5,
    //             opacityTo: 0.9,
    //         },
    //     },
    //     xaxis: {
    //         type: 'datetime' as const,
    //         labels: {
    //             format: 'MMM dd',
    //         },
    //     },
    //     tooltip: {
    //         custom: tooltipBox,
    //     },
    // };

    const series = [
        {
            data: [
                [1640962800000, 0],
                [1640963000000, 0],
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
                format: 'MMM dd',
            },
            min: new Date('01 Mar 2022').getTime(),
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
    const [priceHistoryUnit, setPriceHistoryUnit] = useState<TypeSelectItem | undefined>(
        priceHistoryUnitSelectOptions[1],
    );
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
        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getNftPriceByTokenId?tokenId=${params.id}`)
            .then((response) => {
                response.json().then((jsonPriceList) => {
                    if (!unmounted) {
                        const productPriceList: TypePriceHistoryFetch[] = jsonPriceList.data;
                        const _latestPriceList: number[][] = [];
                        _latestPriceList.push([new Date('01 Jan 2022').getTime(), 0]);
                        if (productPriceList.length)
                            _latestPriceList.push([(parseInt(productPriceList[0].updateTime) - 100) * 1000, 0]);
                        for (let i = 0; i < productPriceList.length; i++) {
                            _latestPriceList.push([
                                parseInt(productPriceList[i].updateTime) * 1000,
                                productPriceList[i].price / 1e18,
                            ]);
                        }
                        const lastValue = _latestPriceList[_latestPriceList.length - 1];
                        _latestPriceList.push([new Date().getTime(), lastValue[1]]);
                        setChartSeries([{ data: _latestPriceList }]);
                        handlePriceHistoryUnitChange('Weekly');
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            unmounted = true;
        };
    }, [params.id]);

    return (
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
                {/* <Chart options={chartOptions} series={chartSeries} type="area" /> */}
                <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} />
            </Box>
        </Stack>
    );
};

export default PriceHistoryView;
