import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import RemoveDAO from './RemoveDAO';

export interface ComponentProps {}

const RemoveDAODlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.removeDAODlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, removeDAODlgOpened: false });
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
