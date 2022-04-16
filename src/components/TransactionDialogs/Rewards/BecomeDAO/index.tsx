import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BecomeDAO from './BecomeDAO';

export interface ComponentProps {}

const BecomeDAODlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.becomeDAODlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, becomeDAODlgOpened: false });
            }}
        >
            <BecomeDAO
                onClose={() => {
                    setDialogState({ ...dialogState, becomeDAODlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default BecomeDAODlgContainer;
