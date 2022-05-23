import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ViewOnExplorerButton from 'src/components/Buttons/ViewOnExplorerButton';
import { useDialogContext } from 'src/context/DialogContext';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const PurchaseSuccess: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Purchase Successful!</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Your can find your shiny new artwork in your profile
                </Typography>
            </Stack>
            <Stack>
                <img src="/assets/images/transactionsdlg/buynow-purchase-success.svg" height={240} alt="" />
            </Stack>
            <Stack alignItems="center" spacing={2}>
                <ViewOnExplorerButton txHash={dialogState.buyNowTxHash}/>
                <PrimaryButton 
                    fullWidth
                    onClick={() => {
                        setDialogState({ ...dialogState, buyNowDlgOpened: false });
                        document.cookie = 'METEAST_PROFILE=Owned; Path=/; SameSite=None; Secure';
                        navigate('/profile');
                    }}
                >
                    Go to profile
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default PurchaseSuccess;
