import React from 'react';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import CreateBlindBoxDlgContainer from '../TransactionDialogs/CreateBlindBox';
import ManageProfileDlgContainer from '../ManageProfile';
import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
import WaitingConfirm from 'src/components/TransactionDialogs/Others/WaitingConfirm';

export interface ComponentProps {}

const TransactionDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <>
            <MintNFTDlgContainer />
            <CreateBlindBoxDlgContainer />
            <ManageProfileDlgContainer />
            <ModalDialog
                open={dialogState.errorMessageDlgOpened}
                onClose={() => {
                    setDialogState(defaultDlgState);
                }}
            >
                <ErrorMessage
                    onClose={() => {
                        setDialogState(defaultDlgState);
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={dialogState.waitingConfirmDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, waitingConfirmDlgOpened: false });
                }}
            >
                <WaitingConfirm />
            </ModalDialog>
        </>
    );
};

export default TransactionDlgContainer;
