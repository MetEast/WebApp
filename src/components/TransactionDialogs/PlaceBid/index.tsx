import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import PlaceBid from 'src/components/TransactionDialogs/PlaceBid/PlaceBid';
import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';

export interface ComponentProps {}

const PlaceBidDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.placeBidDlgOpened}
            onClose={() => {
                setDialogState({
                    ...dialogState,
                    placeBidAmount: 0,
                    // placeBidExpire: { label: '', value: '' },
                    // placeBidTxFee: 0,
                    placeBidDlgOpened: false,
                    placeBidDlgStep: 0,
                    placeBidName: '',
                    placeBidTxHash: '',
                    placeBidOrderId: '',
                    placeBidMinLimit: 0,
                    placeBidLastBid: -1,
                });
                if (dialogState.placeBidDlgStep === 2) window.location.reload();
            }}
        >
            {dialogState.placeBidDlgStep === 0 && <PlaceBid />}
            {dialogState.placeBidDlgStep === 1 && <ReviewBidDetails />}
            {dialogState.placeBidDlgStep === 2 && <BidPlaceSuccess />}
        </ModalDialog>
    );
};

export default PlaceBidDlgContainer;
