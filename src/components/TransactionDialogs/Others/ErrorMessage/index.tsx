import React from 'react';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import ErrorMessage from './ErrorMessage';

export interface ComponentProps {}

const ErrorMessageDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.errorMessageDlgOpened}
            onClose={() => {
                setDialogState(defaultDlgState);
            }}
        >
            <ErrorMessage
                onClose={() => {
                    setDialogState(defaultDlgState);
                }}
            />
        </ModalDialog>
    );
};

export default ErrorMessageDlgContainer;
