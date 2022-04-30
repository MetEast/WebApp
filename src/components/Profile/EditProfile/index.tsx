import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import EditProfile from './EditProfile';

export interface ComponentProps {}

const EditProfileDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.editProfileDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, editProfileDlgOpened: false, progressBar: 0 });
            }}
        >
            <EditProfile
                onClose={() => {
                    setDialogState({ ...dialogState, editProfileDlgOpened: false, progressBar: 0 });
                }}
            />
        </ModalDialog>
    );
};

export default EditProfileDlgContainer;