import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import AllTransactions from './AllTransactions';
import { blankNFTTxs } from 'src/constants/init-constants';

export interface ComponentProps {}

const AllTransactionsDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.allTxDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, allTxDlgOpened: false, allTxNFTCreation: blankNFTTxs });
            }}
        >
            <AllTransactions
                onClose={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false, allTxNFTCreation: blankNFTTxs });
                }}
            />
        </ModalDialog>
    );
};

export default AllTransactionsDlgContainer;
