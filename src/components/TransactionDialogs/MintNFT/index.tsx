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

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const defaultValue: TypeMintInputForm = {
        name: '',
        description: '',
        author: '',
        category: { label: '', value: '' },
        file: new File([""], "")
    };
    const [dialogState, setDialogState] = useDialogContext();
    const [inputFormData, setInputFormData] = useState<TypeMintInputForm>(defaultValue);
    const [txFee, setTxFee] = useState<number>(0);
    const [txHash, setTxHash] = useState<string>('');

    const handleTxHash = (value: string) => {
        setTxHash(value);
    };

    // update later
    const getTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any); // HACK
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setTxFee(parseFloat(gasPrice) * 5000000 / 1e18);
    };

    useEffect(() => {
        getTxFee();
    }, []);

    // useEffect(()=>{
    //     console.log(dialogState.createNFTDlgStep, "-stage:      ", inputFormData)
    // }, [dialogState.createNFTDlgStep]);
    
    return (
        <ModalDialog
            open={dialogState.createNFTDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, createNFTDlgOpened: false });
            }}
        >
            {dialogState.createNFTDlgStep === 0 && <MintNFT inputData={inputFormData} setInputData={setInputFormData} txFee={txFee}/>}
            {dialogState.createNFTDlgStep === 1 && <CheckNFTDetails inputData={inputFormData} setInputData={setInputFormData} txFee={txFee} handleTxHash={handleTxHash} />}
            {dialogState.createNFTDlgStep === 2 && <NFTMinted txHash={txHash} />}
        </ModalDialog>
    );
};

export default MintNFTDlgContainer;
