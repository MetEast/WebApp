import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BlindBoxContents from 'src/components/TransactionDialogs/BuyBlindBox/BlindBoxContents';
import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyBlindBox/PurchaseSuccess';

export interface ComponentProps {}

const BuyBlindBoxDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.buyBlindBoxDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    buyBlindBoxDlgOpened: false,
                    buyBlindBoxDlgStep: 0,
                    buyBlindName: '',
                    buyBlindPriceEla: 0,
                    buyBlindPriceUsd: 0,
                    buyBlindAmount: 1,
                    buyBlindBoxId: '',
                    buyBlindMaxPurchases: 0,
                    buyBlindInstock: 0,
                });
                if (dialogState.buyBlindBoxDlgStep >= 2) window.location.reload();
            }}
        >
            {dialogState.buyBlindBoxDlgStep === 0 && <BuyBlindBox />}
            {dialogState.buyBlindBoxDlgStep === 1 && <OrderSummary />}
            {dialogState.buyBlindBoxDlgStep === 2 && <PurchaseSuccess />}
            {dialogState.buyBlindBoxDlgStep === 3 && <BlindBoxContents />}
        </ModalDialog>
    );
};

export default BuyBlindBoxDlgContainer;
