import React from 'react';
import ModalDialog from 'src/components/ModalDialog';
import RemoveDAO from './RemoveDAO';
import { useDialogContext } from 'src/context/DialogContext';
export interface ComponentProps {}

const RemoveDAODlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.removeDAODlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, removeDAODlgOpened: false, progressBar: 0 });
            }}
        >
            <RemoveDAO
                onClose={() => {
                    setDialogState({ ...dialogState, removeDAODlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default RemoveDAODlgContainer;
