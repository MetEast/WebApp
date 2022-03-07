import React, { useEffect } from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ModalDialog from 'src/components/ModalDialog';
import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
import EnterSaleDetails from '../ListNFT/EnterSaleDetails';
import CheckSaleDetails from '../ListNFT/CheckSaleDetails';
import ArtworkIsNowForSale from '../ListNFT/ArtworkIsNowForSale';
import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
import { isInAppBrowser } from 'src/services/wallet';

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);
    // update later
    const setMintTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, mintTXFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };
    const setSaleTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, sellTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setMintTxFee();
        setSaleTxFee();
    }, [dialogState.createNFTDlgStep]);

    return (
        <>
            <ModalDialog
                open={dialogState.createNFTDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, createNFTDlgOpened: false });
                }}
            >
                {dialogState.createNFTDlgStep === 0 && <MintNFT />}
                {dialogState.createNFTDlgStep === 1 && <CheckNFTDetails />}
                {dialogState.createNFTDlgStep === 2 && <NFTMinted />}
                {dialogState.createNFTDlgStep === 3 && <EnterSaleDetails />}
                {dialogState.createNFTDlgStep === 4 && <CheckSaleDetails />}
                {dialogState.createNFTDlgStep === 5 && <ArtworkIsNowForSale />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.errorMessageDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, errorMessageDlgOpened: false });
                }}
            >
                <ErrorMessage onClose={() => {
                    setDialogState({ ...dialogState, errorMessageDlgOpened: false });
                }} />
            </ModalDialog>
        </>
    );
};

export default MintNFTDlgContainer;
