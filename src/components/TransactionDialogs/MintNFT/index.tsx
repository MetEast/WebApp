import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
import EnterSaleDetails from '../ListNFT/EnterSaleDetails';
import CheckSaleDetails from '../ListNFT/CheckSaleDetails';
import ArtworkIsNowForSale from '../ListNFT/ArtworkIsNowForSale';
import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
import WaitingConfirm from '../Others/WaitingConfirm';

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <>
            <ModalDialog
                open={dialogState.createNFTDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, createNFTDlgOpened: false, mintProgress: 0 });
                }}
            >
                {dialogState.createNFTDlgStep === 0 && <MintNFT />}
                {dialogState.createNFTDlgStep === 1 && <CheckNFTDetails />}
                {dialogState.createNFTDlgStep === 2 && <NFTMinted />}
                {dialogState.createNFTDlgStep === 3 && <EnterSaleDetails />}
                {dialogState.createNFTDlgStep === 4 && <CheckSaleDetails />}
                {dialogState.createNFTDlgStep === 5 && <ArtworkIsNowForSale />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.errorMessageDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, errorMessageDlgOpened: false });
                }}
            >
                <ErrorMessage
                    onClose={() => {
                        setDialogState({ ...dialogState, errorMessageDlgOpened: false });
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={dialogState.waitingConfirmDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, waitingConfirmDlgOpened: false });
                }}
            >
                <WaitingConfirm />
            </ModalDialog>
        </>
    );
};

export default MintNFTDlgContainer;
