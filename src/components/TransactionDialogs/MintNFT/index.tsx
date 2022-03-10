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
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useSignInContext } from 'src/context/SignInContext';

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const {library} = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );
    useEffect(() => {
        const setMintTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, mintTXFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        const setSaleTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, sellTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setMintTxFee();
        setSaleTxFee();
    }, [dialogState.createNFTDlgStep]);

    return (
        <>
            <ModalDialog
                open={dialogState.createNFTDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, createNFTDlgOpened: false, mintProgress: 0 });
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
                <ErrorMessage
                    onClose={() => {
                        setDialogState({ ...dialogState, errorMessageDlgOpened: false });
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default MintNFTDlgContainer;
