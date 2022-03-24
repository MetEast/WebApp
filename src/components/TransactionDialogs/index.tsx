import React from 'react';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import CreateBlindBoxDlgContainer from '../TransactionDialogs/CreateBlindBox';
import ManageProfileDlgContainer from '../ManageProfile';
import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
import WaitingConfirm from 'src/components/TransactionDialogs/Others/WaitingConfirm';
import AllTransactions from 'src/components/profile/AllTransactions';
import AllBids from './AllBids/AllBids';
import NoBids from './AllBids/NoBids';

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
                    if(dialogState.waitingConfirmDlgTimer) clearTimeout(dialogState.waitingConfirmDlgTimer);
                    setDialogState({ ...dialogState, waitingConfirmDlgOpened: false, loadingDlgOpened: false });
                }}
            >
                <WaitingConfirm loadingDlg={dialogState.loadingDlgOpened} />
            </ModalDialog>
            <ModalDialog
                open={dialogState.allTxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false });
                }}
            >
                <AllTransactions />
            </ModalDialog>
            <ModalDialog
                open={dialogState.allBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allBidDlgOpened: false });
                }}
            >
                <AllBids
                    onClose={() => {
                        setDialogState({ ...dialogState, allBidDlgOpened: false });
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={dialogState.noBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, noBidDlgOpened: false });
                }}
            >
                <NoBids
                    onClose={() => {
                        setDialogState({ ...dialogState, noBidDlgOpened: false });
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default TransactionDlgContainer;
