import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from './WaitingConfirm';

export interface ComponentProps {}

const WaitingConfirmDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.waitingConfirmDlgOpened}
            onClose={() => {
                // if (dialogState.waitingConfirmDlgTimer) clearTimeout(dialogState.waitingConfirmDlgTimer);
                setDialogState({ ...dialogState, waitingConfirmDlgOpened: false, loadingDlgOpened: false });
            }}
        >
            <WaitingConfirm loadingDlg={dialogState.loadingDlgOpened} />
        </ModalDialog>
    );
};

export default WaitingConfirmDlgContainer;
