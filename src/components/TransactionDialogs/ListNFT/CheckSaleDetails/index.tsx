import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import {
    METEAST_CONTRACT_ABI,
    METEAST_CONTRACT_ADDRESS,
    STICKER_CONTRACT_ABI,
    STICKER_CONTRACT_ADDRESS,
} from 'src/components/ContractMethod/config';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { getDidUri } from 'src/services/essential';

export interface ComponentProps {}

const CheckSaleDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const userInfo: UserTokenType = jwtDecode(tokenCookies.METEAST_TOKEN);
    const { did, name } = userInfo;

    const callSetApprovalForAll = async (_operator: string, _approved: boolean) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();

        let contractAbi = METEAST_CONTRACT_ABI;
        let contractAddress = METEAST_CONTRACT_ADDRESS; // Elastos Testnet
        let meteastContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        const isApproval = await meteastContract.methods.isApprovedForAll(accounts[0], _operator).call();
        const _quoteToken = '0x0000000000000000000000000000000000000000'; // ELA
        // const _quoteToken = '0xe6fd75ff38adca4b97fbcd938c86b98772431867';
        // const _quoteToken = '0xbFB8e279AA787b1A11d38B76b9723Af5aFd3Cace';

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
            meteastContract.methods
                .setApprovalForAll(_operator, _approved)
                .send(transactionParams)
                .on('transactionHash', (hash: any) => {
                    console.log('transactionHash', hash);
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
                });
        }
    };

    const callCreateOrderForSale = async (_tokenId: string, _quoteToken: string, _price: string, _didUri: string) => {
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
            value: 0,
        };
        let txHash = '';
        stickerContract.methods
            .createOrderForSale(_tokenId, _quoteToken, _price, _didUri)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
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

        let contractAbi = STICKER_CONTRACT_ABI;
        let contractAddress = STICKER_CONTRACT_ADDRESS; // Elastos Testnet
        let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

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
        stickerContract.methods
            .createOrderForAuction(_tokenId, _quoteToken, _minPrice, _endTime, _didUri)
            .send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash', hash);
                txHash = hash;
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
            });
    };

    const createOrder = async (_quoteToken: string) => {
        // console.log("saleType: --------", dialogState.sellSaleType);
        // console.log("price: --------", dialogState.sellPrice);
        // console.log("minPrice: --------", dialogState.sellMinPrice);
        // console.log("saleEnds: --------", dialogState.sellSaleEnds);
        // console.log("---------- tokenId: --------", dialogState.mintTokenId);
        // console.log("quoteToken: --------", _quoteToken);
        // console.log("price: --------", BigInt(dialogState.sellPrice * 1e18).toString());
        const didUri = dialogState.mintDidUri === '' ? await getDidUri(did, '', name) : dialogState.mintDidUri;
        // console.log("didUri: --------", didUri);
        // console.log(dialogState.mintTokenId)
        alert(didUri)
        alert(dialogState.mintTokenId)

        if (dialogState.sellSaleType === 'buynow') {
            await callCreateOrderForSale(
                dialogState.mintTokenId,
                _quoteToken,
                BigInt(dialogState.sellPrice * 1e18).toString(),
                didUri,
            );
        } else {
            const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
            const walletConnectWeb3 = new Web3(walletConnectProvider as any);
            const currentBlock = await walletConnectWeb3.eth.getBlock("latest");
            let auctionTime: number = typeof currentBlock.timestamp === 'string' ? parseInt(currentBlock.timestamp) : currentBlock.timestamp;
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
        callSetApprovalForAll(STICKER_CONTRACT_ADDRESS, true);
    };

    return (
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
                    Available: {dialogState.sellTxFee} ELA
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
    );
};

export default CheckSaleDetails;
