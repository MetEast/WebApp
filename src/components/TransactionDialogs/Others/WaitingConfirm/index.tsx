import React, { useEffect } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import WaitingConfirm from './WaitingConfirm';
import usePrevious from 'src/hooks/usePrevious';
import { useSnackbar } from 'notistack';
import SnackMessage from 'src/components/SnackMessage';

export interface ComponentProps {}

const WaitingConfirmDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const dlgOpened = usePrevious(dialogState.waitingConfirmDlgOpened) ? true : false;

    const showChainErrorSnackBar = () => {
        enqueueSnackbar('', {
            anchorOrigin: { horizontal: 'right', vertical: 'top' },
            autoHideDuration: 3000,
            content: (key) => (
                <SnackMessage id={key} message="Wrong network, only Elastos Smart Chain is supported" variant="error" />
            ),
        });
    };

    // if(signInDlgState.chainId && !(signInDlgState.chainId === 20 || signInDlgState.chainId === 21)) showChainErrorSnackBar();

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
