import React, { ReactNode } from 'react';
import { Dialog } from '@mui/material';

export interface ComponentProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

const ModalDialog: React.FC<ComponentProps> = ({ open, onClose, children }): JSX.Element => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ background: '#1890FF90' }}
            PaperProps={{ sx: { maxWidth: '100%', padding: 8, borderRadius: 8 } }}
        >
            {children}
        </Dialog>
    );
};

export default ModalDialog;
