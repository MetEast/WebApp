import React, { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const NoBids: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={3} width={280} alignItems="center">
            <Stack alignItems="center">
                <DialogTitleTypo>No Bids Yet</DialogTitleTypo>
            </Stack>
            <img
                src="/assets/images/transactionsdlg/no-bids-yet.svg"
                alt="Looks Empty Here"
                style={{ width: 180, height: 160 }}
            />
            <PrimaryButton fullWidth>Close</PrimaryButton>
        </Stack>
    );
};

export default NoBids;
