import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';

export interface ComponentProps {}

const WaitingConfirm: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center" spacing={3}>
                <img src="/assets/images/loading.gif" alt="" />
                <DialogTitleTypo>Waiting For confirmation...</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Please confirm this transaction with your wallet to continue.
                </Typography>
            </Stack>
        </Stack>
    );
};

export default WaitingConfirm;
