import React, { useState } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { AbiItem } from 'web3-utils';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

export interface ComponentProps {}

const BuyNow: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );
    
    const callBuyOrder = async (_orderId: string, _didUri: string, _price: string) => {
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_MARKET_CONTRACT_ABI;
        let contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
        let marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: _price,
        };
        let txHash = '';

        setLoadingDlgOpened(true);
        const timer = setTimeout(() => {
            setLoadingDlgOpened(false);
            setDialogState({ ...dialogState, errorMessageDlgOpened: true });
        }, 120000);
        marketContract.methods
            .buyOrder(_orderId, _didUri)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
                clearTimeout(timer);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Buy now succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({ ...dialogState, buyNowTxHash: txHash, buyNowDlgOpened: true, buyNowDlgStep: 1 });
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Buy now error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                clearTimeout(timer);
                setDialogState({ ...dialogState, buyNowDlgOpened: false, errorMessageDlgOpened: true });
            });
    };

    const handleBuyNow = async () => {
        await callBuyOrder(
            dialogState.buyNowOrderId,
            signInDlgState.didUri,
            BigInt(dialogState.buyNowPrice * 1e18).toString(),
        );
    };

    return (
        <>
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
                        <PrimaryButton fullWidth onClick={handleBuyNow}>
                            Confirm
                        </PrimaryButton>
                    </Stack>
                    <WarningTypo width={240}>
                        In case of payment problems, please contact the official customer service
                    </WarningTypo>
                </Stack>
            </Stack>
            <ModalDialog
                open={loadingDlgOpened}
                onClose={() => {
                    setLoadingDlgOpened(false);
                }}
            >
                <WaitingConfirm />
            </ModalDialog>
        </>
    );
};

export default BuyNow;
