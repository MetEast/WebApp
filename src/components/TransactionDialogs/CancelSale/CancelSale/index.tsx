import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import { SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
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

export interface ComponentProps {}

const CancelSale: React.FC<ComponentProps> = (): JSX.Element => {
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

    const callCancelOrder = async (_orderId: string) => {
        const accounts = await walletConnectWeb3.eth.getAccounts();
        const contractAbi = METEAST_MARKET_CONTRACT_ABI;
        const contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
        const marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
        const gasPrice = await walletConnectWeb3.eth.getGasPrice();
        const transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };
        let txHash = '';

        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true });
        const timer = setTimeout(() => {
            setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
        }, 120000);
        marketContract.methods
            .cancelOrder(_orderId)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setDialogState({ ...dialogState, waitingConfirmDlgOpened: false });
                clearTimeout(timer);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Cancel sale succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    cancelSaleDlgOpened: true,
                    cancelSaleDlgStep: 1,
                    cancelSaleTxHash: txHash,
                });
            })
            .on('error', (error: any) => {
                console.error('error', error);
                enqueueSnackbar('Cancel sale error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                clearTimeout(timer);
                setDialogState({
                    ...dialogState,
                    cancelSaleDlgOpened: false,
                    errorMessageDlgOpened: true,
                    waitingConfirmDlgOpened: false,
                });
            });
    };

    const handleCancelSale = () => {
        if (dialogState.cancelSaleTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        callCancelOrder(dialogState.cancelSaleOrderId);
    };

    return (
        <Stack spacing={5} width={320}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center" marginTop={1}>
                    If you cancel the sale, nobody will be able to buy your amazing artwork.
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <SecondaryButton
                    fullWidth
                    onClick={() => {
                        setDialogState({
                            ...dialogState,
                            cancelSaleTxFee: 0,
                            cancelSaleOrderId: '',
                            cancelSaleTxHash: '',
                            cancelSaleDlgOpened: false,
                            cancelSaleDlgStep: 0,
                        });
                    }}
                >
                    Back
                </SecondaryButton>
                <PinkButton fullWidth onClick={handleCancelSale}>
                    Cancel sale
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default CancelSale;
