import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { AdminNFTItemType } from 'src/types/admin-table-data-types';
import { reduceHexAddress } from 'src/services/common';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {
    token2Remove: AdminNFTItemType;
    onClose: () => void;
}

const RemoveNFT: React.FC<ComponentProps> = ({ token2Remove, onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === enumAuthType.ElastosEssentials
            ? (walletConnectProvider as any)
            : (library?.provider as any),
    );

    const handleRmoveToken = () => {
        if (dialogState.adminTakedownTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        let unmounted = false;

        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.waitingConfirmDlgTimer = setTimeout(() => {
            setDialogState({
                ...defaultDlgState,
                errorMessageDlgOpened: true,
            });
        }, 120000);
        if (!unmounted) setDialogState(updatedState);

        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: enumMetEastContractType.METEAST_MARKET,
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
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        waitingConfirmDlgOpened: false,
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Remove Token error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                    });
                }
            })
            .finally(() => {
                setOnProgress(false);
                onClose();
            });
        return () => {
            unmounted = true;
        };
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
            <CustomTextField
                title="TOKEN ID"
                placeholder="TOKEN ID"
                inputValue={reduceHexAddress(token2Remove.token_id, 20)}
                disabled
            />
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    close
                </SecondaryButton>
                <PinkButton fullWidth disabled={onProgress} onClick={handleRmoveToken}>
                    Confirm
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default RemoveNFT;
