import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const SaleSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Sale Successful!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Congratulations! Your artwork has been sold to {dialogState.acceptBidName} for {dialogState.acceptBidPrice}
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/acceptbid-sale-success.svg" alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.acceptBidTxHash} />
                <PrimaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, acceptBidDlgOpened: false });
                        navigate('/products');
                    }}
                >
                    Close
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default SaleSuccess;
