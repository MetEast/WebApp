import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const BlindBoxCreateSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Mystery Box Created Successfully</DialogTitleTypo>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/blindbox-create-success.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.crtBlindTxHash} />
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, createBlindBoxDlgOpened: false });
                        navigate('/blind-box');
                        window.location.reload();
                    }}
                >
                    Close
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BlindBoxCreateSuccess;
