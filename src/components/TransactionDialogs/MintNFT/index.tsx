import React, { useState, useEffect } from 'react';
import ModalDialog from 'src/components/ModalDialog';
import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeMintInputForm } from 'src/types/mint-types';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";

import EnterSaleDetails from '../ListNFT/EnterSaleDetails';
import CheckSaleDetails from '../ListNFT/CheckSaleDetails';
import ArtworkIsNowForSale from '../ListNFT/ArtworkIsNowForSale';
import { TypeSaleInputForm } from 'src/types/mint-types';

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const defaultMintValue: TypeMintInputForm = {
        name: '',
        description: '',
        author: '',
        category: { label: '', value: '' },
        file: new File([""], "")
    };
    const defaultSaleValue: TypeSaleInputForm = {
        saleType: 'buynow',
        price: '',
        royalty: '',
        minPirce: '',
        saleEnds: {label: '', value: ''}
    };
    const [dialogState, setDialogState] = useDialogContext();
    const [inputMintFormData, setInputMintFormData] = useState<TypeMintInputForm>(defaultMintValue);
    const [mintTxFee, setMintTxFee] = useState<number>(0);
    const [mintTxHash, setMintTxHash] = useState<string>('');
    const [inputSaleFormData, setInputSaleFormData] = useState<TypeSaleInputForm>(defaultSaleValue);
    const [saleTxHash, setSaleTxHash] = useState<string>('');

    const handleMintTxHash = (value: string) => {
        setMintTxHash(value);
    };

    const handleSaleTxHash = (value: string) => {
        setSaleTxHash(value);
    };

    // update later
    const getTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any); // HACK
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setMintTxFee(parseFloat(gasPrice) * 5000000 / 1e18);
    };

    useEffect(() => {
        getTxFee();
    }, []);

    useEffect(()=>{
        console.log(dialogState.createNFTDlgStep, "-stage:      ", inputMintFormData);
        console.log(dialogState.createNFTDlgStep, "-stage:      ", inputSaleFormData);
    }, [dialogState.createNFTDlgStep]);
    
    return (
        <ModalDialog
            open={dialogState.createNFTDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, createNFTDlgOpened: false });
            }}
        >
            {dialogState.createNFTDlgStep === 0 && <MintNFT inputData={inputMintFormData} setInputData={setInputMintFormData} txFee={mintTxFee}/>}
            {dialogState.createNFTDlgStep === 1 && <CheckNFTDetails inputData={inputMintFormData} setInputData={setInputMintFormData} txFee={mintTxFee} handleTxHash={handleMintTxHash} />}
            {dialogState.createNFTDlgStep === 2 && <NFTMinted txHash={mintTxHash} />}
            {dialogState.createNFTDlgStep === 3 && <EnterSaleDetails inputData={inputSaleFormData} setInputData={setInputSaleFormData}/>}
            {dialogState.createNFTDlgStep === 4 && <CheckSaleDetails inputData={inputSaleFormData} setInputData={setInputSaleFormData}  handleTxHash={handleSaleTxHash}/>}
            {dialogState.createNFTDlgStep === 5 && <ArtworkIsNowForSale txHash={saleTxHash}/>}
        </ModalDialog>
    );
};

export default MintNFTDlgContainer;
