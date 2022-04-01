import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import CancelBid from 'src/components/TransactionDialogs/CancelBid/CancelBid';
import CancelBidSuccess from 'src/components/TransactionDialogs/CancelBid/CancelBidSuccess';

export interface ComponentProps {}

const CancelBidDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.cancelBidDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    // cancelBidTxFee: 0,
                    cancelBidOrderId: '',
                    cancelBidTxHash: '',
                    cancelBidDlgOpened: false,
                    cancelBidDlgStep: 0,
                });
            }}
        >
            {dialogState.cancelBidDlgStep === 0 && <CancelBid />}
            {dialogState.cancelBidDlgStep === 1 && <CancelBidSuccess />}
        </ModalDialog>
    );
};

export default CancelBidDlgContainer;
