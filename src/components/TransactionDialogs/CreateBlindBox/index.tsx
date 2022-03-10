import React, { useEffect } from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ModalDialog from 'src/components/ModalDialog';
import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useSignInContext } from 'src/context/SignInContext';


export interface ComponentProps {}

const CreateBlindBoxDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );

    useEffect(() => {
        const setCreateBlindBoxTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, crtBlindTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setCreateBlindBoxTxFee();
    }, [dialogState.createBlindBoxDlgStep]);

    return (
        <>
            <ModalDialog
                open={dialogState.createBlindBoxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, createBlindBoxDlgOpened: false });
                }}
            >
                {dialogState.createBlindBoxDlgStep === 0 && <CreateBlindBox />}
                {dialogState.createBlindBoxDlgStep === 1 && <CheckBlindBoxDetails />}
                {dialogState.createBlindBoxDlgStep === 2 && <BlindBoxCreateSuccess />}
            </ModalDialog>
        </>
    );
};

export default CreateBlindBoxDlgContainer;
