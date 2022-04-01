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
        // console.log(dialogState.waitingConfirmDlgTimer, '-------------', dialogState.waitingConfirmDlgOpened, '---------------', dlgOpened)
        if (dialogState.waitingConfirmDlgTimer && !dialogState.waitingConfirmDlgOpened && dlgOpened) {
            // console.log('+++++++++Timer: ', dialogState.waitingConfirmDlgTimer)
            clearTimeout(dialogState.waitingConfirmDlgTimer);
        }
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
