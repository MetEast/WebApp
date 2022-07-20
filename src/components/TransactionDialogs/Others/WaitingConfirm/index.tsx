import React, { useEffect } from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from './WaitingConfirm';
import usePrevious from 'src/hooks/usePrevious';

export interface ComponentProps {}

const WaitingConfirmDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const dlgOpened = usePrevious(dialogState.waitingConfirmDlgOpened) ? true : false;

    useEffect(() => {
        if (dialogState.waitingConfirmDlgTimer && !dialogState.waitingConfirmDlgOpened && dlgOpened) {
            clearTimeout(dialogState.waitingConfirmDlgTimer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogState.waitingConfirmDlgOpened]);

    return (
        <ModalDialog
            open={dialogState.waitingConfirmDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, waitingConfirmDlgOpened: false, loadingDlgOpened: false });
            }}
        >
            <WaitingConfirm loadingDlg={dialogState.loadingDlgOpened} />
        </ModalDialog>
    );
};

export default WaitingConfirmDlgContainer;
