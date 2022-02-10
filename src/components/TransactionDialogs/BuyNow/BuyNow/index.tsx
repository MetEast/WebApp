import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { useDialogContext } from 'src/context/DialogContext';
import { AbiItem } from 'web3-utils';
import { STICKER_CONTRACT_ABI, STICKER_CONTRACT_ADDRESS } from 'src/components/ContractMethod/config';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { getDidUri } from 'src/services/essential';

export interface ComponentProps {};

const BuyNow: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const userInfo: UserTokenType = jwtDecode(tokenCookies.METEAST_TOKEN);
    const { did, name } = userInfo;

    const callBuyOrder = async (_orderId: number, _didUri: string, _price: string) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = STICKER_CONTRACT_ABI;
        let contractAddress = STICKER_CONTRACT_ADDRESS;
        let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

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

        stickerContract.methods
            .buyOrder(_orderId, _didUri)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
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
            });
    };

    const handleBuyNow = async () => {
        const _didUri = await getDidUri(did, '', name);
        console.log("didUri:----------", _didUri)
        console.log("orderId:---------", dialogState.buyNowOrderId)
        console.log("price:---------", BigInt(dialogState.buyNowPrice).toString())
        await callBuyOrder(
            dialogState.buyNowOrderId,
            _didUri,
            BigInt(dialogState.buyNowPrice).toString()
        );
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
                    Available: {dialogState.buyNowTxFee} ELA
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
                                buyNowOrderId: 0
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
    );
};

export default BuyNow;
