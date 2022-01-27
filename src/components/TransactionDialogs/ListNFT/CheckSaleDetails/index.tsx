import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import { TypeSellInputForm } from 'src/types/mint-types';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { METEAST_CONTRACT_ABI, METEAST_CONTRACT_ADDRESS, STICKER_CONTRACT_ABI, STICKER_CONTRACT_ADDRESS } from 'src/components/ContractMethod/config';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";

export interface ComponentProps {
    previousStep: () => void;
    nextStep: () => void;
    inputData: TypeSellInputForm;
    setInputData: (value: TypeSellInputForm) => void;
    handleTxHash: (value:string) => void;
}

const CheckSaleDetails: React.FC<ComponentProps> = ({previousStep, nextStep, inputData, setInputData, handleTxHash}): JSX.Element => {
    const defaultValue: TypeSellInputForm = {
        saleType: 'buynow',
        price: '',
        royalty: '',
        minPirce: '',
        saleEnds: {label: '', value: ''}
    };

    const callCreateOrderForSale = async (_tokenId: number, _quoteToken: string, _price: number, _didUri: string) => {
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
      
        stickerContract.methods.createOrderForSale(_tokenId, _quoteToken, _price, _didUri).send(transactionParams)
            .on('transactionHash', (hash: any) => {
                console.log("transactionHash", hash);
            })
            .on('receipt', (receipt: any) => {
                console.log("receipt", receipt);
            })
            .on('confirmation', (confirmationNumber: any, receipt: any) => {
                console.log("confirmation", confirmationNumber, receipt);
            })
            .on('error', (error: any, receipt: any) => {
                console.error("error", error);
            });
    }
      
    const callCreateOrderForAuction = async (_tokenId: number, _quoteToken: string, _minPrice: number, _endTime: number, _didUri: string) => {
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
            })
            .on('receipt', (receipt: any) => {
                console.log("receipt", receipt);
            })
            .on('confirmation', (confirmationNumber: any, receipt: any) => {
                console.log("confirmation", confirmationNumber, receipt);
                //
            })
            .on('error', (error: any, receipt: any) => {
                console.error("error", error);
            });
    }

    const handleCreateOrder = async () => {
        // if(inputData.saleType === 'buynow') {
        //     callCreateOrderForSale();
        // }
        // else {
        //     callCreateOrderForAuction();
        // }
        alert(1);
        nextStep();
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
                    <Grid item xs={6}>
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
                    </Grid>
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
                            previousStep();
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
