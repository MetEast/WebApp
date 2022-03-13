import React, {useState} from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { AbiItem } from 'web3-utils';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import ModalDialog from 'src/components/ModalDialog';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

export interface ComponentProps {
    tokenId: string;
    tokenTitle: string;
    tokenCreator: string;
    tokenIdHex: string;
    tokenImage: string;
    onClose: () => void;
}

const RemoveNFT: React.FC<ComponentProps> = ({
    tokenId,
    tokenTitle,
    tokenCreator,
    tokenIdHex,
    tokenImage,
    onClose,
}): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);
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
        const timer = setTimeout(() => {
            setLoadingDlgOpened(false);
            setDialogState({ ...dialogState, errorMessageDlgOpened: true });
        }, 120000);
        marketContract.methods
            .cancelOrder(_orderId)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
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
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Cancel sale error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                clearTimeout(timer);
                setDialogState({ ...dialogState, cancelSaleDlgOpened: false, errorMessageDlgOpened: true });
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
        <Stack spacing={4} width={520}>
            <Stack alignItems="center">
                <DialogTitleTypo>Are you Sure?</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400}>
                    You are deleting the following NFT:
                </Typography>
            </Stack>
            <Box borderRadius={2} width={180} height={120} overflow="hidden" alignSelf="center">
                <img src={tokenImage} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
            </Box>
            <CustomTextField title="NFT TITLE" placeholder="NFT TITLE" inputValue={tokenTitle} disabled />
            <CustomTextField title="NFT CREATOR" placeholder="NFT CREATOR" inputValue={tokenCreator} disabled />
            <CustomTextField title="TOKEN ID" placeholder="TOKEN ID" inputValue={tokenIdHex} disabled />
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth onClick={onClose}>
                    close
                </SecondaryButton>
                <PinkButton
                    fullWidth
                    onClick={() => {
                        alert(tokenId);
                    }}
                >
                    Confirm
                </PinkButton>
            </Stack>
        </Stack>
    );
};

export default RemoveNFT;
