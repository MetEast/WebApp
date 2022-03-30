import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import DeleteProduct from 'src/components/TransactionDialogs/DeleteProduct/DeleteProduct';

export interface ComponentProps {}

const BurnNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.burnNFTDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    burnNFTDlgOpened: false,
                    burnTokenId: '',
                    burnTxFee: 0,
                });
            }}
        >
            <DeleteProduct
                onClose={() => {
                    setDialogState({
                        ...dialogState,
                        burnNFTDlgOpened: false,
                        burnTokenId: '',
                        burnTxFee: 0,
                    });
                }}
            />
        </ModalDialog>
    );
};

export default BurnNFTDlgContainer;
