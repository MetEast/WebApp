import React, { useState } from 'react';
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
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';

export interface ComponentProps {}

const CancelBid: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const callCancelOrder = async (_orderId: string) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        const contractAbi = METEAST_MARKET_CONTRACT_ABI;
        const contractAddress = METEAST_MARKET_CONTRACT_ADDRESS;
        const marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        const transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };
        let txHash = '';

        setLoadingDlgOpened(true);
        marketContract.methods
            .cancelOrder(_orderId)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Cancel bid succeed!', {
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
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Cancel bid error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            });
    };

    const handleCancelBid = () => {
        if (dialogState.cancelBidTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        callCancelOrder(dialogState.cancelBidOrderId);
    };

    return (
        <>
            <Stack spacing={5} width={320}>
                <Stack alignItems="center">
                    <DialogTitleTypo>Are you sure?</DialogTitleTypo>
                    <Typography fontSize={16} fontWeight={400} marginTop={1}>
                        Do you really want to cancel your bid?
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({
                                ...dialogState,
                                cancelBidTxFee: 0,
                                cancelBidOrderId: '',
                                cancelBidTxHash: '',
                                cancelBidDlgOpened: false,
                                cancelBidDlgStep: 0,
                            });
                        }}
                    >
                        Back
                    </SecondaryButton>
                    <PinkButton fullWidth onClick={handleCancelBid}>
                        Cancel Bid
                    </PinkButton>
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

export default CancelBid;
