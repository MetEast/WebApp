import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
import { useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const CancelSaleDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();
    
    return (
        <ModalDialog
            open={dialogState.cancelSaleDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    // cancelSaleTxFee: 0,
                    cancelSaleOrderId: '',
                    cancelSaleTxHash: '',
                    cancelSaleDlgOpened: false,
                    cancelSaleDlgStep: 0,
                });
                if (dialogState.cancelSaleDlgStep === 1) {
                    document.cookie = 'METEAST_PROFILE=Owned; Path=/; SameSite=None; Secure';
                    navigate('/profile');
                }
            }}
        >
            {dialogState.cancelSaleDlgStep === 0 && <CancelSale />}
            {dialogState.cancelSaleDlgStep === 1 && <CancelSaleSuccess />}
        </ModalDialog>
    );
};

export default CancelSaleDlgContainer;
