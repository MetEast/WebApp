import React, { useEffect } from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ModalDialog from 'src/components/ModalDialog';
import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';
import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';

export interface ComponentProps {}

const CreateBlindBoxDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    const setCreateBlindBoxTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, crtBlindTxFee: parseFloat(gasPrice) * 5000000 / 1e18 });
    };

    useEffect(() => {
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

export default CreateBlindBoxDlgContainer;
