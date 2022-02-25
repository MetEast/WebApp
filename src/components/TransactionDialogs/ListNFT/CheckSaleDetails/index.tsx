import React, { useState } from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS } from 'src/contracts/MET';
import { METEAST_MARKET_CONTRACT_ABI, METEAST_MARKET_CONTRACT_ADDRESS } from 'src/contracts/METMarket';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from '../../Others/WaitingConfirm';

export interface ComponentProps {}

const CheckSaleDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [loadingDlgOpened, setLoadingDlgOpened] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();

    const callSetApprovalForAll = async (_operator: string, _approved: boolean) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_CONTRACT_ABI;
        let contractAddress = METEAST_CONTRACT_ADDRESS; // Elastos Testnet
        let meteastContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const isApproval = await meteastContract.methods.isApprovedForAll(accounts[0], _operator).call();
        const _quoteToken = '0x0000000000000000000000000000000000000000'; // ELA

        if (isApproval === true) {
            console.log('Operator', _operator, ' is already approved');
            await createOrder(_quoteToken);
        } else {
            let gasPrice = await walletConnectWeb3.eth.getGasPrice();
            console.log('Gas price:', gasPrice);
            console.log('Sending transaction with account address:', accounts[0]);
            let transactionParams = {
                from: accounts[0],
                gasPrice: gasPrice,
                gas: 5000000,
                value: 0,
            };
            setLoadingDlgOpened(true);
            meteastContract.methods
                .setApprovalForAll(_operator, _approved)
                .send(transactionParams)
                .on('transactionHash', (hash: any) => {
                    console.log('transactionHash', hash);
                    setLoadingDlgOpened(false);
                })
                .on('receipt', (receipt: any) => {
                    console.log('receipt', receipt);
                    enqueueSnackbar('Set approval for all succeed!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    createOrder(_quoteToken);
                })
                .on('error', (error: any, receipt: any) => {
                    console.error('error', error);
                    enqueueSnackbar('Set approval for all error!', {
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    setLoadingDlgOpened(false);
                    setDialogState({ ...dialogState, createNFTDlgOpened: false, errorMessageDlgOpened: true });
                });
        }
    };

    const callCreateOrderForSale = async (
        _tokenId: string,
        _quoteToken: string,
        _price: string,
        _didUri: string,
        _isBlindBox: boolean,
    ) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
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
            value: 0,
        };
        let txHash = '';
        setLoadingDlgOpened(true);
        marketContract.methods
            .createOrderForSale(_tokenId, _quoteToken, _price, _didUri, _isBlindBox)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Order for sale succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({ ...dialogState, sellTxHash: txHash, createNFTDlgOpened: true, createNFTDlgStep: 5 });
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Order for sale error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                setDialogState({ ...dialogState, createNFTDlgOpened: false, errorMessageDlgOpened: true });
            });
    };

    const callCreateOrderForAuction = async (
        _tokenId: string,
        _quoteToken: string,
        _minPrice: string,
        _endTime: string,
        _didUri: string,
    ) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_MARKET_CONTRACT_ABI;
        let contractAddress = METEAST_MARKET_CONTRACT_ADDRESS; // Elastos Testnet
        let marketContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log('Gas price:', gasPrice);

        console.log('Sending transaction with account address:', accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0,
        };

        let txHash = '';
        setLoadingDlgOpened(true);
        marketContract.methods
            .createOrderForAuction(_tokenId, _quoteToken, _minPrice, _endTime, _didUri)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
                setLoadingDlgOpened(false);
            })
            .on('receipt', (receipt: any) => {
                console.log('receipt', receipt);
                enqueueSnackbar('Order for auction succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({ ...dialogState, sellTxHash: txHash, createNFTDlgStep: 5 });
            })
            .on('error', (error: any, receipt: any) => {
                console.error('error', error);
                enqueueSnackbar('Order for auction error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setLoadingDlgOpened(false);
                setDialogState({ ...dialogState, createNFTDlgOpened: false, errorMessageDlgOpened: true });
            });
    };

    const createOrder = async (_quoteToken: string) => {
        const didUri = dialogState.mintDidUri === '' ? signInDlgState.didUri : dialogState.mintDidUri;
        if (dialogState.sellSaleType === 'buynow') {
            await callCreateOrderForSale(
                dialogState.mintTokenId,
                _quoteToken,
                BigInt(dialogState.sellPrice * 1e18).toString(),
                didUri,
                false,
            );
        } else {
            const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
            const walletConnectWeb3 = new Web3(walletConnectProvider as any);
            const currentBlock = await walletConnectWeb3.eth.getBlock('latest');
            let auctionTime: number =
                typeof currentBlock.timestamp === 'string' ? parseInt(currentBlock.timestamp) : currentBlock.timestamp;
            if (dialogState.sellSaleEnds.value === '1 month') auctionTime += 30 * 24 * 3600;
            else if (dialogState.sellSaleEnds.value === '1 week') auctionTime += 7 * 24 * 3600;
            else if (dialogState.sellSaleEnds.value === '1 day') auctionTime += 24 * 3600;

            await callCreateOrderForAuction(
                dialogState.mintTokenId,
                _quoteToken,
                `0x${BigInt(dialogState.sellMinPrice * 1e18).toString(16)}`,
                auctionTime.toString(),
                didUri,
            );
        }
    };

    const handleSell = () => {
        if (dialogState.sellTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'warning',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        callSetApprovalForAll(METEAST_MARKET_CONTRACT_ADDRESS, true);
    };

    return (
        <>
            <Stack spacing={5} width={340}>
                <Stack alignItems="center">
                    <PageNumberTypo>2 of 2</PageNumberTypo>
                    <DialogTitleTypo>Check Sale Details</DialogTitleTypo>
                </Stack>
                <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                    <Grid container rowSpacing={0.5}>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Sale type</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{dialogState.sellSaleType}</DetailedInfoLabelTypo>
                        </Grid>
                        {dialogState.sellSaleType === 'auction' && (
                            <>
                                <Grid item xs={6}>
                                    <DetailedInfoTitleTypo>Min Bid</DetailedInfoTitleTypo>
                                </Grid>
                                <Grid item xs={6}>
                                    <DetailedInfoLabelTypo>{dialogState.sellMinPrice} ELA</DetailedInfoLabelTypo>
                                </Grid>
                                <Grid item xs={6}>
                                    <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                                </Grid>
                                <Grid item xs={6}>
                                    <DetailedInfoLabelTypo>in {dialogState.sellSaleEnds.value}</DetailedInfoLabelTypo>
                                </Grid>
                            </>
                        )}
                        {dialogState.sellSaleType === 'buynow' && (
                            <>
                                <Grid item xs={6}>
                                    <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                                </Grid>
                                <Grid item xs={6}>
                                    <DetailedInfoLabelTypo>{dialogState.sellPrice} ELA</DetailedInfoLabelTypo>
                                </Grid>
                            </>
                        )}
                        {/* <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Royalties</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>{inputData.royalty}%</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>0.22 ELA</DetailedInfoLabelTypo>
                    </Grid> */}
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
                                setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 3 });
                            }}
                        >
                            Back
                        </SecondaryButton>
                        <PrimaryButton fullWidth onClick={handleSell}>
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

export default CheckSaleDetails;
