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
                sx: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: '100%',
                    padding: { xs: 4, md: 8 },
                    borderRadius: { xs: 0, md: 15 },
                },
            }}
        >
            {children}
        </Dialog>
    );
};

export default ModalDialog;
