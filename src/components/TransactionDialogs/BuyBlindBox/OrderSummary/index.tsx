import React, { useState } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
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

const OrderSummary: React.FC<ComponentProps> = (): JSX.Element => {
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

    const sendSoldBlindBoxTokenIds = (txHash: string) => {
        let unmounted = false;
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/soldTokenFromBlindbox`;
        const reqBody = {
            token: signInDlgState.token,
            blindBoxId: dialogState.buyBlindBoxId,
            tokenIds: dialogState.buyBlindTokenIds,
            buyer: signInDlgState.walletAccounts[0],
            totalPrice: dialogState.buyBlindPriceEla * dialogState.buyBlindOrderIds.length,
        };
        fetch(reqUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    if (!unmounted) {
                        setOnProgress(false);
                        setDialogState({
                            ...dialogState,
                            buyBlindBoxDlgOpened: true,
                            buyBlindBoxDlgStep: 2,
                            buyBlindTxHash: txHash,
                        });
                    }
                } else {
                    console.log(data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        return () => {
            unmounted = true;
        };
    };

    const handleBuyBlindBox = () => {
        setOnProgress(true);
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true });
        const timer = setTimeout(() => {
            setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
        }, 120000);
        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 2,
            method: 'buyOrderBatch',
            price: BigInt(dialogState.buyBlindPriceEla * 1e18 * dialogState.buyBlindOrderIds.length).toString(),
            orderIds: dialogState.buyBlindOrderIds,
            didUri: signInDlgState.didUri,
        })
            .then((txHash: string) => {
                enqueueSnackbar('Buy Mystery Box succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({ ...dialogState, waitingConfirmDlgOpened: false });
                sendSoldBlindBoxTokenIds(txHash);
            })
            .catch((error) => {
                enqueueSnackbar(`Buy Mystery Box error: ${error}!`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    buyBlindBoxDlgOpened: false,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                clearTimeout(timer);
            });
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Order Summary</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container width={200}>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyBlindName}</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Unit Price</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyBlindPriceEla} ELA</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Amount</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyBlindAmount}</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Subtotal</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>
                            {(dialogState.buyBlindPriceEla * dialogState.buyBlindAmount).toFixed(2)} ELA
                        </DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.buyBlindTxFee} ELA</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Total</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>
                            {(
                                dialogState.buyBlindPriceEla * dialogState.buyBlindAmount +
                                dialogState.buyBlindTxFee
                            ).toFixed(2)}{' '}
                            ELA
                        </DetailedInfoLabelTypo>
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
                            setDialogState({ ...dialogState, buyBlindBoxDlgStep: 0, buyBlindBoxDlgOpened: true });
                        }}
                    >
                        Back
                    </SecondaryButton>
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleBuyBlindBox}>
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

export default OrderSummary;
