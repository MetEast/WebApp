import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import YourEarnings from './YourEarnings';
import { TypeYourEarning } from 'src/types/product-types';

export interface ComponentProps {
    earningList: TypeYourEarning[];
}

const YourEarningDlgContainer: React.FC<ComponentProps> = ({ earningList }): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <ModalDialog
            open={dialogState.earningDlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, earningDlgOpened: false });
            }}
        >
            <YourEarnings
                earnings={earningList}
                onClose={() => {
                    setDialogState({ ...dialogState, earningDlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default YourEarningDlgContainer;
