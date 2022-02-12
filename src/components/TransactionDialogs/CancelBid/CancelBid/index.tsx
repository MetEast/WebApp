import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { SecondaryButton, PinkButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const CancelBid: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} marginTop={1}>
                    Do you really want to cancel your bid?
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton fullWidth>Back</SecondaryButton>
                <PinkButton fullWidth>Cancel Bid</PinkButton>
            </Stack>
        </Stack>
    );
};

export default CancelBid;
