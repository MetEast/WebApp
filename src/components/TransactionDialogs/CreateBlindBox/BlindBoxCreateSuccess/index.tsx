import React from 'react';
import { Stack } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';
import { useLocation, useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const BlindBoxCreateSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();
    const location = useLocation();

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
                        setDialogState({
                            ...dialogState,
                            createBlindBoxDlgOpened: false,
                            createBlindBoxDlgStep: 0,
                            crtBlindTitle: '',
                            crtBlindDescription: '',
                            crtBlindImage: new File([''], ''),
                            crtBlindTokenIds: '',
                            // crtBlindStatus: 'offline',
                            crtBlindQuantity: 0,
                            crtBlindPrice: 0,
                            crtBlindSaleBegin: '',
                            // crtBlindSaleEnd: '',
                            crtBlindPurchases: 0,
                            progressBar: 0,
                        });
                        if (location.pathname.indexOf('/blind-box') !== -1) window.location.reload();
                        else navigate('/blind-box');
                    }}
                >
                    Close
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BlindBoxCreateSuccess;
