import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';

export interface ComponentProps {}

const BidPlaceSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Bid placed successfully!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You've just bid 50 ELA for Project Name
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/placebid-success.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton />
                <PrimaryButton fullWidth>Close</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BidPlaceSuccess;
