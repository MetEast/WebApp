import React, { ReactNode } from 'react';
import { Dialog } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ComponentProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

const ModalDialog: React.FC<ComponentProps> = ({ open, onClose, children }): JSX.Element => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={matchDownMd}
            open={open}
            onClose={onClose}
            sx={{ background: '#1890FF90' }}
            PaperProps={{
                sx: { display: 'grid', placeContent: 'center', maxWidth: '100%', padding: 8, borderRadius: 8 },
            }}
        >
            {children}
        </Dialog>
    );
};

export default ModalDialog;
