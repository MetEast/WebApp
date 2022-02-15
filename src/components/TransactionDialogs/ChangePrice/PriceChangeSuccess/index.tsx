import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const PriceChangeSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Price Changed Successfully!</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.placeBidTxHash} />
                <PrimaryButton fullWidth>Close</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default PriceChangeSuccess;
