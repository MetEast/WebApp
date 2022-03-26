import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import AcceptBid from 'src/components/TransactionDialogs/AcceptBid/AcceptBid';
import SaleSuccess from 'src/components/TransactionDialogs/AcceptBid/SaleSuccess';

export interface ComponentProps {}

const AcceptBidDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.acceptBidDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    acceptBidDlgOpened: false,
                    acceptBidDlgStep: 0,
                    acceptBidPrice: 0,
                    acceptBidOrderId: '',
                    acceptBidName: '',
                    acceptBidTxFee: 0,
                    acceptBidTxHash: '',
                });
            }}
        >
            {dialogState.acceptBidDlgStep === 0 && <AcceptBid />}
            {dialogState.acceptBidDlgStep === 1 && <SaleSuccess />}
        </ModalDialog>
    );
};

export default AcceptBidDlgContainer;
