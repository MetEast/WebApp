import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { useSignInContext } from 'src/context/SignInContext';
import { AdminNFTItemType } from 'src/types/admin-table-data-types';
import { reduceHexAddress } from 'src/services/common';

export interface ComponentProps {
    token2Remove: AdminNFTItemType;
    handleTokenUpdate: (value: AdminNFTItemType) => void;
    onClose: () => void;
}

const RemoveNFT: React.FC<ComponentProps> = ({ token2Remove, handleTokenUpdate, onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );

    const handleRmoveToken = () => {
        if (dialogState.cancelSaleTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true });
        const timer = setTimeout(() => {
            setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
        }, 120000);
        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 2,
            method: 'takeDownOrder',
            price: '0',
            orderId: token2Remove.orderId,
        })
            .then((txHash: string) => {
                console.log(txHash);
                enqueueSnackbar('Remove Token succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    waitingConfirmDlgOpened: false,
                });
                handleTokenUpdate(token2Remove);
            })
            .catch((error) => {
                enqueueSnackbar(`Remove Token error: ${error}!`, {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                setOnProgress(false);
                clearTimeout(timer);
            });
    };

    const handleRmoveToken = () => {
        alert(token2Remove.tokenId);
        handleTokenUpdate(token2Remove);
    };

    const handleRmoveToken = () => {
        alert(token2Remove.tokenId);
        handleTokenUpdate(token2Remove);
    };

    const handleRmoveToken = () => {
        alert(token2Remove.tokenId);
        handleTokenUpdate(token2Remove);
    };

    return (
        <Stack spacing={4} width={520}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You are deleting the following NFT:
                </Typography>
            </Stack>
            <Box borderRadius={2} width={180} height={120} overflow="hidden" alignSelf="center">
                <img src={token2Remove.nft_image} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
            </Box>
            <CustomTextField title="NFT TITLE" placeholder="NFT TITLE" inputValue={token2Remove.nft_title} disabled />
            <CustomTextField
                title="NFT CREATOR"
                placeholder="NFT CREATOR"
                inputValue={token2Remove.nft_creator}
                disabled
            />
            <CustomTextField title="TOKEN ID" placeholder="TOKEN ID" inputValue={reduceHexAddress(token2Remove.token_id, 20)} disabled />
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    close
                </SecondaryButton>
                <PinkButton fullWidth onClick={handleRmoveToken}>
                    Confirm
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default RemoveNFT;
