import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { TypeSaleInputForm, TypeIpfsUploadInfo } from 'src/types/mint-types';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS, STICKER_CONTRACT_ABI, STICKER_CONTRACT_ADDRESS } from 'src/components/ContractMethod/config';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
// import { getRevertReason } from 'eth-revert-reason';

export interface ComponentProps {
    inputData: TypeSaleInputForm;
    setInputData: (value: TypeSaleInputForm) => void;
    handleTxHash: (value: string) => void;
}

const CheckSaleDetails: React.FC<ComponentProps> = ({inputData, setInputData, handleTxHash}): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const defaultValue: TypeSaleInputForm = {
        saleType: 'buynow',
        price: 0,
        royalty: '',
        minPirce: 0,
        saleEnds: {label: '', value: ''}
    };

    // const callGetData = async () => {
    //     const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
    //     const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    //     const accounts = await walletConnectWeb3.eth.getAccounts();
      
    //     let contractAbi = STICKER_CONTRACT_ABI;
    //     let contractAddress = STICKER_CONTRACT_ADDRESS; // Elastos Testnet
    //     let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

    //     let gasPrice = await walletConnectWeb3.eth.getGasPrice();
    //     console.log("Gas price:", gasPrice);
      
    //     console.log("Sending transaction with account address:", accounts[0]);
    //     let transactionParams = {
    //         from: accounts[0],
    //         gasPrice: gasPrice,
    //         gas: 5000000,
    //         value: 0
    //     };
    //     const version = await stickerContract.methods.getVersion().call();
    //     console.log("getVersion=", version);
    //     const magic = await stickerContract.methods.getMagic().call();
    //     console.log("getMagic=", magic);
    // };

    const callSetApprovalForAll = async (_operator: string, _approved: boolean, _tokenId: string) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();
      
        let contractAbi = METEAST_CONTRACT_ABI;
        let contractAddress = METEAST_CONTRACT_ADDRESS; // Elastos Testnet
        let meteastContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log("Gas price:", gasPrice);
      
        console.log("Sending transaction with account address:", accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0
        };

        // const isApprovalPlatform = await meteastContract.methods.isApprovedForAll(accounts[0], '0xF25F7A31d308ccf52b8EBCf4ee9FabdD8c8C5077').call();
        // console.log("isApprovalForAllPlatform=", isApprovalPlatform);
        // meteastContract.methods.setApprovalForAll('0xF25F7A31d308ccf52b8EBCf4ee9FabdD8c8C5077', true).send(transactionParams)
        //     .on('transactionHash', (hash: any) => {
        //         console.log("transactionHash", hash);
        //     })
        //     .on('receipt', (receipt: any) => {
        //         console.log("receipt", receipt);
        //         enqueueSnackbar('Set approval for all succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
        //     })
        //     .on('confirmation', (confirmationNumber: any, receipt: any) => {
        //         console.log("confirmation", confirmationNumber, receipt);
        //     })
        //     .on('error', (error: any, receipt: any) => {
        //         console.error("error", error);
        //         enqueueSnackbar('Set approval for all error!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} });
        //     })
        
        const isApproval = await meteastContract.methods.isApprovedForAll(accounts[0], _operator).call();
        console.log("isApprovalForAll=", isApproval);
        // const royaltyFee = await meteastContract.methods.tokenRoyaltyFee(_tokenId).call();
        // console.log("tokenId:", _tokenId, "---royaltyFee:", royaltyFee)

        if (isApproval === true) return;
        meteastContract.methods.setApprovalForAll(_operator, _approved).send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log("transactionHash", hash);
            })
            .on('receipt', (receipt: any) => {
                console.log("receipt", receipt);
                enqueueSnackbar('Set approval for all succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
            })
            .on('confirmation', (confirmationNumber: any, receipt: any) => {
                console.log("confirmation", confirmationNumber, receipt);
            })
            .on('error', (error: any, receipt: any) => {
                console.error("error", error);
                enqueueSnackbar('Set approval for all error!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} });
            })
    };

    const callCreateOrderForSale = async (_tokenId: string, _quoteToken: string, _price: number, _didUri: string) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();
      
        let contractAbi = STICKER_CONTRACT_ABI;
        let contractAddress = STICKER_CONTRACT_ADDRESS; 
        let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);

        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log("Gas price:", gasPrice);
      
        console.log("Sending transaction with account address:", accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0
        };
        /////////
        // const ret = await stickerContract.methods.getPlatformFee().call();
        // console.log("platform fee", ret);
        /////////
        stickerContract.methods.createOrderForSale(_tokenId, _quoteToken, _tokenId, _didUri).send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log("transactionHash", hash);
                handleTxHash(hash);
            })
            .on('receipt', (receipt: any) => {
                console.log("receipt", receipt);
                enqueueSnackbar('Order for sale succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
            })
            .on('confirmation', (confirmationNumber: any, receipt: any) => {
                console.log("confirmation", confirmationNumber, receipt);
            })
            .on('error', (error: any, receipt: any) => {
                console.error("error", error);
                enqueueSnackbar('Order for sale error!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} })
                setDialogState({ ...dialogState, createNFTDlgStep: 4 });
            });
        // console.log("RevReason------------------", await getRevertReason("0x09c394e4120cb1dab9f8c786d935c229ef640bf8f2b3746059059f68b88c6127"));

    }
    
    const callCreateOrderForAuction = async (_tokenId: string, _quoteToken: string, _minPrice: number, _endTime: number, _didUri: string) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const accounts = await walletConnectWeb3.eth.getAccounts();
      
        let contractAbi = STICKER_CONTRACT_ABI;
        let contractAddress = STICKER_CONTRACT_ADDRESS; // Elastos Testnet
        let stickerContract = new walletConnectWeb3.eth.Contract(contractAbi as AbiItem[], contractAddress);
      
        let gasPrice = await walletConnectWeb3.eth.getGasPrice();
        console.log("Gas price:", gasPrice);
      
        console.log("Sending transaction with account address:", accounts[0]);
        let transactionParams = {
            from: accounts[0],
            gasPrice: gasPrice,
            gas: 5000000,
            value: 0
        };
      
        stickerContract.methods.createOrderForAuction(_tokenId, _quoteToken, _minPrice, _endTime, _didUri).send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log("transactionHash", hash);
                handleTxHash(hash);
            })
            .on('receipt', (receipt: any) => {
                console.log("receipt", receipt);
                enqueueSnackbar('Order for auction succeed!', { variant: "success", anchorOrigin: {horizontal: "right", vertical: "top"} })
            })
            .on('confirmation', (confirmationNumber: any, receipt: any) => {
                console.log("confirmation", confirmationNumber, receipt);
            })
            .on('error', (error: any, receipt: any) => {
                console.error("error", error);
                enqueueSnackbar('Order for auction error!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} })
            });
    }

    const getRevertReason = async (txHash: any) => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const tx: any = await walletConnectWeb3.eth.getTransaction(txHash)
      
        var result = await walletConnectWeb3.eth.call(tx, tx.blockNumber)
      
        result = result.startsWith('0x') ? result : `0x${result}`
      
        if (result && result.substr(138)) {
      
          const reason = walletConnectWeb3.utils.toAscii(result.substr(138))
          console.log('Revert reason:', reason)
          return reason
      
        } else {
      
          console.log('Cannot get reason - No return value')
      
        }
      
    }
    
    const handleCreateOrder = async () => {
        // callGetData();
        const _quoteToken = '0x0000000000000000000000000000000000000000'; // ELA
        callSetApprovalForAll(STICKER_CONTRACT_ADDRESS, true, dialogState.mintNFTTokenId);
        // callSetApprovalForAll(METEAST_CONTRACT_ADDRESS, true);

        if(inputData.saleType === 'buynow') {
            console.log("tokenId", dialogState.mintNFTTokenId)
            console.log("_quoteToken", _quoteToken)
            console.log("_price", inputData.price)
            console.log("_didUri", dialogState.mintNFTDidUri)
            callCreateOrderForSale(dialogState.mintNFTTokenId, _quoteToken, inputData.price, dialogState.mintNFTDidUri);
        }
        else {
            let endTime = new Date().getSeconds();
            if(inputData.saleEnds.value === '1 month') endTime += 30 * 24 * 3600;
            else if(inputData.saleEnds.value === '1 week') endTime += 7 * 24 * 3600;
            else if(inputData.saleEnds.value === '1 day') endTime += 24 * 3600;
            callCreateOrderForAuction(dialogState.mintNFTTokenId, _quoteToken, inputData.minPirce, endTime, dialogState.mintNFTDidUri);
        }
        setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 5 });
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
                        <DetailedInfoLabelTypo>{inputData.saleType}</DetailedInfoLabelTypo>
                    </Grid>
                    {inputData.saleType === 'auction' && 
                    <>
                        <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Min Bid</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{inputData.minPirce} ELA</DetailedInfoLabelTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>in {inputData.saleEnds.value}</DetailedInfoLabelTypo>
                        </Grid>
                    </>}
                    {inputData.saleType === 'buynow' && 
                    <>
                        <Grid item xs={6}>
                            <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                        </Grid>
                        <Grid item xs={6}>
                            <DetailedInfoLabelTypo>{inputData.price} ELA</DetailedInfoLabelTypo>
                        </Grid>
                    </>}
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
                    Available: 0.22 ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton 
                        fullWidth 
                        onClick={() => {
                            setInputData(defaultValue);
                            setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 3 });
                        }}
                    >
                        Back
                    </SecondaryButton>
                    <PrimaryButton fullWidth onClick={handleCreateOrder}>Confirm</PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default CheckSaleDetails;
