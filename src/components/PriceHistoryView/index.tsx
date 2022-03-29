import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import PriceHistoryToolTip from './tooltip';
import { renderToString } from 'react-dom/server';
import { TypePriceHistoryFetch, TypeChartAxis } from 'src/types/product-types';
import { TypeSelectItem } from 'src/types/select-types';
import { getChartDateList, getTime } from 'src/services/common';
import Select from 'src/components/Select';
import { SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { priceHistoryUnitSelectOptions } from 'src/constants/select-constants';

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
                username={w.globals.initialSeries[seriesIndex].data[dataPointIndex].username}
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
                format: 'dd MMM',
            },
        },
        tooltip: {
            custom: tooltipBox,
        },
    };

    const series = [
        {
            data: [
                { x: '01/01/2021', y: 0, username: 'user1' },
                { x: '01/02/2021', y: 0, username: 'user2' },
                { x: '01/03/2021', y: 0, username: 'user3' },
                { x: '01/04/2021', y: 0, username: 'user4' },
                { x: '01/05/2021', y: 0, username: 'user5' },
                { x: '01/06/2021', y: 0, username: 'user6' },
                { x: '01/07/2021', y: 0, username: 'user7' },
                { x: '01/08/2021', y: 0, username: 'user8' },
                { x: '01/09/2021', y: 0, username: 'user9' },
            ],
        },
    ];

    const [chartOptions] = useState(options);
    const [chartSeries, setChartSeries] = useState(series);
    const [priceHistoryUnit, setPriceHistoryUnit] = useState<TypeSelectItem | undefined>(
        priceHistoryUnitSelectOptions[1],
    );
    const [priceHistoryUnitSelectOpen, setPriceHistoryUnitSelectOpen] = useState(false);

    const handlePriceHistoryUnitChange = (value: string) => {
        const item = priceHistoryUnitSelectOptions.find((option) => option.value === value);
        setPriceHistoryUnit(item);
    };
    const params = useParams();

    useEffect(() => {
        let unmounted = false;
        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getNftPriceByTokenId?tokenId=${params.id}`)
            .then((response) => {
                response.json().then((jsonPriceList) => {
                    if (!unmounted) {
                        const productPriceList: TypePriceHistoryFetch[] = jsonPriceList.data;
                        const getPriceValue = (value: string) => {
                            const nItem = productPriceList.findIndex((option) => {
                                const dateTime = option.updateTime
                                    ? getTime(option.updateTime)
                                    : { date: '', time: '' };
                                return (
                                    value === (dateTime.date + ' ' + dateTime.time).replaceAll('/', '-').slice(0, 10)
                                );
                            });
                            return nItem === -1 ? 0 : productPriceList[nItem].price / 1e18;
                        };
                        const _latestPriceList: Array<TypeChartAxis> = [];
                        let _dateList = getChartDateList(new Date(), priceHistoryUnit?.value || '');
                        for (let i = 0; i < _dateList.length; i++) {
                            _latestPriceList.push({
                                x: getTime((_dateList[i].getTime() / 1000).toString()).date,
                                y: getPriceValue(
                                    getTime((_dateList[i].getTime() / 1000).toString()).date.replaceAll('/', '-'),
                                ),
                                username: `user${i}`,
                            });
                        }
                        setChartSeries([{ data: _latestPriceList }]);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            unmounted = true;
        };
    }, [priceHistoryUnit, params.id]);

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
                <Chart options={chartOptions} series={chartSeries} type="area" />
            </Box>
        </Stack>
    );
};

export default PriceHistoryView;
