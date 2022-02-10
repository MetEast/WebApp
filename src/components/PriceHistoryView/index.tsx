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
                { x: '01/01/2021', y: 0 },
                { x: '01/02/2021', y: 0 },
                { x: '01/03/2021', y: 0 },
                { x: '01/04/2021', y: 0 },
                { x: '01/05/2021', y: 0 },
                { x: '01/16/2021', y: 0 },
                { x: '01/07/2021', y: 0 },
                { x: '01/08/2021', y: 0 },
                { x: '01/09/2021', y: 0 },
                { x: '01/10/2021', y: 0 },
                { x: '01/11/2021', y: 0 },
                { x: '01/12/2021', y: 0 },
            ],
        },
    ];

    const [chartOptions, setChartOptions] = useState(options);
    const [chartSeries, setChartSeries] = useState(series);
    const [productPriceList, setProductPriceList] = useState<Array<TypePriceHistoryFetch>>([]); 
    const [priceHistoryUnit, setPriceHistoryUnit] = useState<TypeSelectItem | undefined>(
        priceHistoryUnitSelectOptions[1],
    );
    const [priceHistoryUnitSelectOpen, setPriceHistoryUnitSelectOpen] = useState(false);

    const handlePriceHistoryUnitChange = (value: string) => {
        const item = priceHistoryUnitSelectOptions.find((option) => option.value === value);
        setPriceHistoryUnit(item);
    };
    const getPriceValue = (value: string) => {
        const nItem = productPriceList.findIndex((option) => option.onlyDate === value);
        return nItem === -1 ? 0 : productPriceList[nItem].price;
    };
    const params = useParams();


    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getNftPriceByTokenId?tokenId=${params.id}`)
            .then((response) => {
                response.json().then((jsonPriceList) => {
                    setProductPriceList(jsonPriceList.data);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        let _latestPriceList: Array<TypeChartAxis> = [];
        console.log(new Date());
        let _dateList = getChartDateList(new Date(), priceHistoryUnit?.value || '');
        console.log("type: ", priceHistoryUnit?.value, " date list: ", _dateList);
        for (let i = 0; i < _dateList.length; i ++) {
            // let _price: TypeChartAxis = { x: _dateList[i].toString(), y: getPriceValue(_dateList[i].toString()) };
            // _price.y = itemObject.price / 1e18; // no proper data
            // let dateTime = getTime(itemObject.onlyDate);
            // _price.x = dateTime.date;
            _latestPriceList.push({ x: _dateList[i].toString(), y: getPriceValue(_dateList[i].toString()) });
            setChartSeries([{ data: _latestPriceList }]);
        }
    }, [priceHistoryUnit]);

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={5} zIndex={10}>
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
