import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { SaleTypeButton } from './styles';
import ELAPriceInput from '../../components/ELAPriceInput';
import Select from '../../components/Select';
import { TypeSelectItem } from 'src/types/select-types';

export interface ComponentProps {}

const EnterSaleDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const saleEndsOptions: Array<TypeSelectItem> = [
        {
            label: '1 month',
            value: '7 month',
        },
        {
            label: '1 week',
            value: '1 week',
        },
        {
            label: '1 day',
            value: '1 day',
        },
    ];

    const [saleType, setSaleType] = useState<'buynow' | 'auction'>('buynow');
    const [saleEnds, setSaleEnds] = useState<TypeSelectItem>();

    const handleSaleEndsChange = (value: string) => {
        const item = saleEndsOptions.find((option) => option.value === value);
        setSaleEnds(item);
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Enter sale details</DialogTitleTypo>
            </Stack>
            <Stack spacing={1}>
                <Stack direction="row" spacing={2}>
                    <SaleTypeButton fullWidth selected={saleType === 'buynow'} onClick={() => setSaleType('buynow')}>
                        Buy now
                    </SaleTypeButton>
                    <SaleTypeButton fullWidth selected={saleType === 'auction'} onClick={() => setSaleType('auction')}>
                        auction
                    </SaleTypeButton>
                </Stack>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Your item will be automatically sold to the first buyer
                </Typography>
                {saleType === 'buynow' && (
                    <>
                        <ELAPriceInput title="Price" />
                        <ELAPriceInput title="Royalties" />
                    </>
                )}
                {saleType === 'auction' && (
                    <>
                        <ELAPriceInput title="Minimum Price" />
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Sale Ends
                            </Typography>
                            <Select
                                options={saleEndsOptions}
                                selected={saleEnds}
                                placeholder="Select"
                                handleClick={handleSaleEndsChange}
                            />
                        </Stack>
                    </>
                )}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton fullWidth>close</SecondaryButton>
                <PrimaryButton fullWidth>Next</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EnterSaleDetails;
