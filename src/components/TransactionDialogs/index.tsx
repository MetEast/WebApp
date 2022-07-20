import React, { useEffect } from 'react';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import CreateBlindBoxDlgContainer from '../TransactionDialogs/CreateBlindBox';
import ManageProfileDlgContainer from '../Profile/ManageProfile';
import AllBidsDlgContainer from './AllBids';
import NoBidsDlgContainer from './NoBids';
import AllTransactionsDlgContainer from 'src/components/TransactionDialogs/AllTransactions';
import ErrorMessageDlgContainer from './Others/ErrorMessage';
import WaitingConfirmDlgContainer from './Others/WaitingConfirm';
import ChangePriceDlgContainer from 'src/components/TransactionDialogs/ChangePrice';
import CancelSaleDlgContainer from 'src/components/TransactionDialogs/CancelSale';
import AcceptBidDlgContainer from 'src/components/TransactionDialogs/AcceptBid';
import ReceivedBidsDlgContainer from 'src/components/TransactionDialogs/ReceivedBids';
import EditProfileDlgContainer from 'src/components/Profile/EditProfile';
import PlaceBidDlgContainer from 'src/components/TransactionDialogs/PlaceBid';
import BuyNowDlgContainer from 'src/components/TransactionDialogs/BuyNow';
import BuyBlindBoxDlgContainer from 'src/components/TransactionDialogs/BuyBlindBox';
import BecomeDAODlgContainer from 'src/components/TransactionDialogs/Rewards/BecomeDAO';
import RemoveDAODlgContainer from 'src/components/TransactionDialogs/Rewards/RemoveDAO';
// import CancelBidDlgContainer from '../TransactionDialogs/CancelBid';
// import UpdateBidDlgContainer from '../TransactionDialogs/UpdateBid';
import { useSignInContext } from 'src/context/SignInContext';
// import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import Web3 from 'web3';
// import { useWeb3React } from '@web3-react/core';
// import { Web3Provider } from '@ethersproject/providers';
// import { isInAppBrowser, getChainGasPrice } from 'src/services/wallet';
import BurnNFTDlgContainer from './DeleteProduct';
import { useSnackbar } from 'notistack';
import SnackMessage from 'src/components/SnackMessage';
import { isSupportedNetwork } from 'src/services/wallet';

export interface ComponentProps {}

const TransactionDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    // const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
    //     ? window.elastos.getWeb3Provider()
    //     : essentialsConnector.getWalletConnectProvider();
    // const { library } = useWeb3React<Web3Provider>();
    // const walletConnectWeb3 = new Web3(
    //     signInDlgState.loginType === enumAuthType.ElastosEssentials ? (walletConnectProvider as any) : (library?.provider as any),
    // );
    // useEffect(() => {
    //     if (signInDlgState.loginType === enumAuthType.ElastosEssentials || (library && signInDlgState.loginType === enumAuthType.MetaMask)) {
    //         getChainGasPrice(walletConnectWeb3, 5000000).then((gasPrice: number) => {
    //             setDialogState({
    //                 ...dialogState,
    //                 mintTxFee: gasPrice,
    //                 burnTxFee: gasPrice,
    //                 sellTxFee: gasPrice,
    //                 buyNowTxFee: gasPrice,
    //                 changePriceTxFee: gasPrice,
    //                 cancelSaleTxFee: gasPrice,
    //                 acceptBidTxFee: gasPrice,
    //                 placeBidTxFee: gasPrice,
    //                 updateBidTxFee: gasPrice,
    //                 cancelBidTxFee: gasPrice,
    //                 crtBlindTxFee: gasPrice,
    //                 buyBlindTxFee: gasPrice,
    //                 adminTakedownTxFee: gasPrice,
    //                 adminUserBannedTxFee: gasPrice,
    //                 adminUserModeratorTxFee: gasPrice,
    //                 becomeDAOTxFee: gasPrice,
    //                 removeDAOTxFee: gasPrice,
    //                 withdrawRewardTxFee: gasPrice,
    //             });
    //         });
    //     }
    // }, [library, signInDlgState.loginType]);

    const showChainErrorSnackBar = () => {
        enqueueSnackbar('', {
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
            autoHideDuration: 5000,
            content: (key) => (
                <SnackMessage id={key} message="Wrong network, only Elastos Smart Chain is supported" variant="error" />
            ),
        });
    };

    useEffect(() => {
        if (
            signInDlgState.chainId &&
            !isSupportedNetwork(signInDlgState.chainId) &&
            (dialogState.errorMessageDlgOpened ||
                dialogState.createNFTDlgOpened ||
                dialogState.burnNFTDlgOpened ||
                dialogState.buyNowDlgOpened ||
                dialogState.changePriceDlgOpened ||
                dialogState.cancelSaleDlgOpened ||
                dialogState.placeBidDlgOpened ||
                dialogState.acceptBidDlgOpened ||
                dialogState.createBlindBoxDlgOpened ||
                dialogState.buyBlindBoxDlgOpened ||
                dialogState.becomeDAODlgOpened ||
                dialogState.removeDAODlgOpened)
        ) {
            showChainErrorSnackBar();
            setDialogState({ ...defaultDlgState });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        dialogState.errorMessageDlgOpened,
        dialogState.createNFTDlgOpened,
        dialogState.burnNFTDlgOpened,
        dialogState.buyNowDlgOpened,
        dialogState.changePriceDlgOpened,
        dialogState.cancelSaleDlgOpened,
        dialogState.placeBidDlgOpened,
        dialogState.acceptBidDlgOpened,
        dialogState.createBlindBoxDlgOpened,
        dialogState.buyBlindBoxDlgOpened,
        dialogState.becomeDAODlgOpened,
        dialogState.removeDAODlgOpened,
    ]);

    return (
        <>
            <WaitingConfirmDlgContainer />
            {dialogState.errorMessageDlgOpened && <ErrorMessageDlgContainer />}
            {dialogState.createNFTDlgOpened && <MintNFTDlgContainer />}
            {dialogState.burnNFTDlgOpened && <BurnNFTDlgContainer />}
            {dialogState.buyNowDlgOpened && <BuyNowDlgContainer />}
            {dialogState.changePriceDlgOpened && <ChangePriceDlgContainer />}
            {dialogState.cancelSaleDlgOpened && <CancelSaleDlgContainer />}
            {dialogState.placeBidDlgOpened && <PlaceBidDlgContainer />}
            {/* {dialogState.updateBidDlgOpened && <UpdateBidDlgContainer />} */}
            {/* {dialogState.cancelBidDlgOpened && <CancelBidDlgContainer />} */}
            {dialogState.acceptBidDlgOpened && <AcceptBidDlgContainer />}
            {dialogState.createBlindBoxDlgOpened && <CreateBlindBoxDlgContainer />}
            {dialogState.buyBlindBoxDlgOpened && <BuyBlindBoxDlgContainer />}
            {dialogState.allTxDlgOpened && <AllTransactionsDlgContainer />}
            {dialogState.allBidDlgOpened && <AllBidsDlgContainer />}
            {dialogState.receivedBidDlgOpened && <ReceivedBidsDlgContainer />}
            {dialogState.noBidDlgOpened && <NoBidsDlgContainer />}
            {dialogState.manageProfileDlgOpened && <ManageProfileDlgContainer />}
            {dialogState.editProfileDlgOpened && <EditProfileDlgContainer />}
            {dialogState.becomeDAODlgOpened && <BecomeDAODlgContainer />}
            {dialogState.removeDAODlgOpened && <RemoveDAODlgContainer />}
        </>
    );
};

export default TransactionDlgContainer;
