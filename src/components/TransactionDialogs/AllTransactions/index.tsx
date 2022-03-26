import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import AllTransactions from './AllTransactions';

export interface ComponentProps {}

const AllTransactionsDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.allTxDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, allTxDlgOpened: false });
            }}
        >
            <AllTransactions
                onClose={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default AllTransactionsDlgContainer;
