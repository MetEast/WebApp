import React, { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const NoBids: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={3} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>No Bids Yet</DialogTitleTypo>
            </Stack>
        </Stack>
    );
};

export default NoBids;
