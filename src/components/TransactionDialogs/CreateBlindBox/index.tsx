import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';

export interface ComponentProps {}

const CreateBlindBoxDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <>
            <ModalDialog
                open={dialogState.createBlindBoxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, createBlindBoxDlgOpened: false, progressBar: 0 });
                }}
            >
                {dialogState.createBlindBoxDlgStep === 0 && <CreateBlindBox />}
                {dialogState.createBlindBoxDlgStep === 1 && <CheckBlindBoxDetails />}
                {dialogState.createBlindBoxDlgStep === 2 && <BlindBoxCreateSuccess />}
            </ModalDialog>
        </>
    );
};

export default CreateBlindBoxDlgContainer;
