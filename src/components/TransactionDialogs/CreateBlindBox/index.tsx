import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

export interface ComponentProps {}

const CreateBlindBoxDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <>
            <ModalDialog
                open={dialogState.createBlindBoxDlgOpened}
                onClose={() => {
                    setDialogState({
                        ...dialogState,
                        createBlindBoxDlgOpened: false,
                        createBlindBoxDlgStep: 0,
                        crtBlindTitle: '',
                        crtBlindDescription: '',
                        crtBlindImage: new File([''], ''),
                        crtBlindTokenIds: '',
                        // crtBlindStatus: 'offline',
                        crtBlindQuantity: 0,
                        crtBlindPrice: 0,
                        crtBlindSaleBegin: '',
                        // crtBlindSaleEnd: '',
                        crtBlindPurchases: 0,
                        progressBar: 0,
                    });
                    if (dialogState.createBlindBoxDlgStep === 2) {
                        if (location.pathname.indexOf('/blind-box') !== -1) window.location.reload();
                        else navigate('/blind-box');
                    }
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
