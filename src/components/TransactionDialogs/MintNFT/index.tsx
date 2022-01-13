import React from 'react';
import ModalDialog from 'src/components/ModalDialog';
import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <ModalDialog
            open={dialogState.createNFTDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, createNFTDlgOpened: false });
            }}
        >
            {dialogState.createNFTDlgStep === 0 && <MintNFT />}
            {dialogState.createNFTDlgStep === 1 && <CheckNFTDetails />}
            {dialogState.createNFTDlgStep === 2 && <NFTMinted />}
        </ModalDialog>
    );
};

export default MintNFTDlgContainer;
