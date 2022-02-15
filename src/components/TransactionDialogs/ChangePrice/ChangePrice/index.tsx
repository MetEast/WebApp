import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPriceInput from '../../components/ELAPriceInput';

export interface ComponentProps {}

const ChangePrice: React.FC<ComponentProps> = (): JSX.Element => {
    const [bidAmount, setBidAmount] = useState(0);

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Change Price</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} marginTop={1}>
                    Current Price: 16.8 ELA
                </Typography>
            </Stack>
            <Stack spacing={2.5}>
                <ELAPriceInput
                    title="New Price"
                    handleChange={(value) => {
                        setBidAmount(value);
                    }}
                />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton fullWidth>close</SecondaryButton>
                <PrimaryButton fullWidth>Confirm</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default ChangePrice;
