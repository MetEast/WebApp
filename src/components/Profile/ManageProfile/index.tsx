import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import ManageProfile from './ManageProfile';

export interface ComponentProps {}

const ManageProfileDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.manageProfileDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, manageProfileDlgOpened: false });
            }}
        >
            <ManageProfile
                onClose={() => {
                    setDialogState({ ...dialogState, manageProfileDlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default ManageProfileDlgContainer;
