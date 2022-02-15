import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { SecondaryButton, PinkButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const CancelSale: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center" marginTop={1}>
                    If you cancel the sale, nobody will be able to buy your amazing artwork.
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton fullWidth>Back</SecondaryButton>
                <PinkButton fullWidth>Cancel sale</PinkButton>
            </Stack>
        </Stack>
    );
};

export default CancelSale;
