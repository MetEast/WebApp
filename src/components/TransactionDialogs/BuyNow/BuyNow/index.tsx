import React, { useState } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';

export interface ComponentProps {}

const BuyNow: React.FC<ComponentProps> = (): JSX.Element => {
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

    const handleBuyNow = () => {
        setOnProgress(true);
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true, progressBar: 50 });
        const timer = setTimeout(() => {
            setDialogState({
                ...dialogState,
                errorMessageDlgOpened: true,
                waitingConfirmDlgOpened: false,
                progressBar: 0,
            });
        }, 120000);
        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 2,
            method: 'buyOrder',
            price: BigInt(dialogState.buyNowPrice * 1e18).toString(),
            orderId: dialogState.buyNowOrderId,
            didUri: signInDlgState.didUri,
        })
            .then((txHash: string) => {
                enqueueSnackbar('Buy now succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    waitingConfirmDlgOpened: false,
                    buyNowDlgOpened: true,
                    buyNowDlgStep: 1,
                    buyNowTxHash: txHash,
                    progressBar: 100,
                });
            })
            .catch((error) => {
                enqueueSnackbar(`Buy now error: ${error}!`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    buyNowDlgOpened: false,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                setOnProgress(false);
                clearTimeout(timer);
            });
    };

    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>Buy Now</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container rowSpacing={0.5}>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyNowName}</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyNowPrice || 0} ELA</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyNowTxFee} ELA</DetailedInfoLabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {signInDlgState.walletBalance} ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                buyNowDlgOpened: false,
                                buyNowPrice: 0,
                                buyNowName: '',
                                buyNowOrderId: '',
                            });
                        }}
                    >
                        close
                    </SecondaryButton>
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleBuyNow}>
                        Confirm
                    </PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default BuyNow;
