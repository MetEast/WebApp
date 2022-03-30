import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';

export interface ComponentProps {}

const CancelSaleDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.cancelSaleDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    cancelSaleTxFee: 0,
                    cancelSaleOrderId: '',
                    cancelSaleTxHash: '',
                    cancelSaleDlgOpened: false,
                    cancelSaleDlgStep: 0,
                });
            }}
        >
            {dialogState.cancelSaleDlgStep === 0 && <CancelSale />}
            {dialogState.cancelSaleDlgStep === 1 && <CancelSaleSuccess />}
        </ModalDialog>
    );
};

export default CancelSaleDlgContainer;