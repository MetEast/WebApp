import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';

export interface ComponentProps {}

const BlindBoxCreateSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Blind Box Created Successfully</DialogTitleTypo>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/blindbox-create-success.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={'0'} />
                <PrimaryButton fullWidth>Close</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BlindBoxCreateSuccess;
