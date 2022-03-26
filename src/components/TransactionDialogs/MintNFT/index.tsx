import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import NFTMinted from 'src/components/TransactionDialogs/MintNFT/NFTMinted';
import EnterSaleDetails from '../ListNFT/EnterSaleDetails';
import CheckSaleDetails from '../ListNFT/CheckSaleDetails';
import ArtworkIsNowForSale from '../ListNFT/ArtworkIsNowForSale';

export interface ComponentProps {}

const MintNFTDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.createNFTDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    mintTitle: '',
                    mintIntroduction: '',
                    mintCategory: { label: '', value: '' },
                    mintFile: new File([''], ''),
                    mintTxFee: 0,
                    mintTxHash: '',
                    mintTokenId: '',
                    mintTokenUri: '',
                    mintDidUri: '',
                    progressBar: 0,
                    createNFTDlgOpened: false,
                    sellMinPrice: 0,
                    sellSaleEnds: { label: '', value: '' },
                    sellSaleType: 'buynow',
                    sellTxFee: 0,
                    sellTxHash: '',
                    sellPrice: 0,
                });
            }}
        >
            {dialogState.createNFTDlgStep === 0 && <MintNFT />}
            {dialogState.createNFTDlgStep === 1 && <CheckNFTDetails />}
            {dialogState.createNFTDlgStep === 2 && <NFTMinted />}
            {dialogState.createNFTDlgStep === 3 && <EnterSaleDetails />}
            {dialogState.createNFTDlgStep === 4 && <CheckSaleDetails />}
            {dialogState.createNFTDlgStep === 5 && <ArtworkIsNowForSale />}
        </ModalDialog>
    );
};

export default MintNFTDlgContainer;
