import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import AllBids from './AllBids';

export interface ComponentProps {}

const AllBidsDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.allBidDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, allBidDlgOpened: false });
            }}
        >
            <AllBids
                onClose={() => {
                    setDialogState({ ...dialogState, allBidDlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default AllBidsDlgContainer;
