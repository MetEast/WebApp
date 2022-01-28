import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';

export interface ComponentProps {}

const PurchaseSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Purchase Successful!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You have just received 1 Blind Box!
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/buyblindbox-purchase-success.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={'0'}/>
                <PrimaryButton fullWidth>Open Blind box</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default PurchaseSuccess;
