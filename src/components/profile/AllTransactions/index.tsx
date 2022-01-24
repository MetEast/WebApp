import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';

export interface ComponentProps {}

const AllTransactions: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={520}>
            <Stack>
                <DialogTitleTypo>All Transactions</DialogTitleTypo>
            </Stack>
            <Stack spacing={3}></Stack>
            <SecondaryButton fullWidth>Close</SecondaryButton>
        </Stack>
    );
};

export default AllTransactions;
