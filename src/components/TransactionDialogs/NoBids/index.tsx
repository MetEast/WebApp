import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import NoBids from './NoBids';

export interface ComponentProps {}

const NoBidsDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.noBidDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, noBidDlgOpened: false });
            }}
        >
            <NoBids
                onClose={() => {
                    setDialogState({ ...dialogState, noBidDlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default NoBidsDlgContainer;
