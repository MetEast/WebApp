import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const BidUpdateSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Bid Updated successfully!</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.updateBidTxHash} />
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, updateBidDlgOpened: false });
                        window.location.reload();
                    }}
                >
                    Close
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BidUpdateSuccess;
