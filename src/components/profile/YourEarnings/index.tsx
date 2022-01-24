import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';

export interface ComponentProps {}

const YourEarnings: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={520}>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'left' }}>Your Earnings</DialogTitleTypo>
            </Stack>
            <Stack spacing={3}></Stack>
            <SecondaryButton fullWidth>Close</SecondaryButton>
        </Stack>
    );
};

export default YourEarnings;
