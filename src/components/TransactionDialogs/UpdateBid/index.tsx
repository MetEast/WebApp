import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import UpdateBid from 'src/components/TransactionDialogs/UpdateBid/UpdateBid';
import BidUpdateSuccess from 'src/components/TransactionDialogs/UpdateBid/BidUpdateSuccess';

export interface ComponentProps {}

const UpdateBidDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.updateBidDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    updateBidPrice: 0,
                    // updateBidTxFee: 0,
                    updateBidOrderId: '',
                    updateBidTxHash: '',
                    updateBidDlgOpened: false,
                    updateBidDlgStep: 0,
                });
            }}
        >
            {dialogState.updateBidDlgStep === 0 && <UpdateBid />}
            {dialogState.updateBidDlgStep === 1 && <BidUpdateSuccess />}
        </ModalDialog>
    );
};

export default UpdateBidDlgContainer;
