import React from 'react';
import ModalDialog from 'src/components/ModalDialog';
import BecomeDAO from './BecomeDAO';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const BecomeDAODlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    
    return (
        <ModalDialog
            open={dialogState.becomeDAODlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, becomeDAODlgOpened: false, progressBar: 0 });
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
