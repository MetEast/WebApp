import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BuyNow from 'src/components/TransactionDialogs/BuyNow/BuyNow';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyNow/PurchaseSuccess';

export interface ComponentProps {}

const BuyNowDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.buyNowDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    buyNowDlgOpened: false,
                    buyNowDlgStep: 0,
                    buyNowPrice: 0,
                    buyNowName: '',
                    buyNowOrderId: '',
                    progressBar: 0,
                });
            }}
        >
            {dialogState.buyNowDlgStep === 0 && <BuyNow />}
            {dialogState.buyNowDlgStep === 1 && <PurchaseSuccess />}
        </ModalDialog>
    );
};

export default BuyNowDlgContainer;
