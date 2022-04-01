import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';

export interface ComponentProps {}

const ChangePriceDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.changePriceDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    changePriceCurPrice: 0,
                    // changePriceTxFee: 0,
                    changePriceOrderId: '',
                    changePriceTxHash: '',
                    changePriceDlgOpened: false,
                    changePriceDlgStep: 0,
                });
                if (dialogState.changePriceDlgStep === 1) window.location.reload();
            }}
        >
            {dialogState.changePriceDlgStep === 0 && <ChangePrice />}
            {dialogState.changePriceDlgStep === 1 && <PriceChangeSuccess />}
        </ModalDialog>
    );
};

export default ChangePriceDlgContainer;
