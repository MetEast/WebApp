import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { AbiItem } from 'web3-utils';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';

export interface ComponentProps {}

const AcceptBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );

    // const callSettleAuctionOrder = async (_orderId: string) => {
    //     const accounts = await walletConnectWeb3.eth.getAccounts();
    //     const contractAbi = METEAST_MARKET_CONTRACT_ABI;
    //     const contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
    //     const marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
    //     const gasPrice = await walletConnectWeb3.eth.getGasPrice();
    //     const transactionParams = {
    //         from: accounts[0],
    //         gasPrice: gasPrice,
    //         gas: 5000000,
    //         value: 0,
    //     };
    //     let txHash = '';
    //     setDialogState({ ...dialogState, waitingConfirmDlgOpened: false });
    //     const timer = setTimeout(() => {
    //         setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
    //     }, 120000);
    //     marketContract.methods
    //         .settleAuctionOrder(_orderId)
    //         .send(transactionParams)
    //         .on('transactionHash', (hash: any) => {
    //             console.log('transactionHash', hash);
    //             txHash = hash;
    //             clearTimeout(timer);
    //         })
    //         .on('receipt', (receipt: any) => {
    //             console.log('receipt', receipt);
    //             enqueueSnackbar('Accept bid succeed!', {
    //                 variant: 'success',
    //                 anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //             });
    //             setDialogState({
    //                 ...dialogState,
    //                 acceptBidDlgOpened: true,
    //                 acceptBidDlgStep: 2,
    //                 acceptBidTxHash: txHash,
    //                 waitingConfirmDlgOpened: false,
    //             });
    //         })
    //         .on('error', (error: any) => {
    //             console.error('error', error);
    //             enqueueSnackbar('Accept bid error!', {
    //                 variant: 'warning',
    //                 anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //             });
    //             clearTimeout(timer);
    //             setDialogState({ ...dialogState, acceptBidDlgOpened: false, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
    //         });
    // };

    const handleAcceptBid = () => {
        // callSettleAuctionOrder(dialogState.acceptBidOrderId);
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true });
        const timer = setTimeout(() => {
            setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
        }, 120000);
        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 2,
            method: 'settleAuctionOrder',
            price: 0,
            orderId: dialogState.acceptBidOrderId,
        })
            .then((txHash) => {
                enqueueSnackbar('Accept bid succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    acceptBidDlgOpened: true,
                    acceptBidDlgStep: 2,
                    acceptBidTxHash: new String(txHash).toString(),
                    waitingConfirmDlgOpened: false,
                });
            })
            .catch((error) => {
                enqueueSnackbar('Accept bid error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    acceptBidDlgOpened: false,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                clearTimeout(timer);
            });
    };

    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>Accept Bid</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container rowSpacing={0.5}>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Sell To</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.acceptBidName}</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Sale Price</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.acceptBidPrice} ELA</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{dialogState.acceptBidTxFee} ELA</DetailedInfoLabelTypo>
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
                                acceptBidDlgOpened: false,
                                acceptBidDlgStep: 0,
                                acceptBidPrice: 0,
                                acceptBidOrderId: '',
                                acceptBidName: '',
                                acceptBidTxFee: 0,
                                acceptBidTxHash: '',
                            });
                        }}
                    >
                        close
                    </SecondaryButton>
                    <PrimaryButton fullWidth onClick={handleAcceptBid}>
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

export default AcceptBid;
