import { Box } from '@mui/material';
import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import Container from '../Container';
import ModalDialog from 'src/components/ModalDialog';
import MintNFT from 'src/components/TransactionDialogs/MintNFT/MintNFT';
// import { useAppState } from 'src/context/AppContext';
import { useDialogContext } from 'src/context/DialogContext';

const Layout: React.FC = ({ children }): JSX.Element => {
    // const [appState, setAppState] = useAppState();
    const dialogContext = useDialogContext();

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    paddingY: 3,
                    position: 'fixed',
                    top: 0,
                    background: '#FFFFFF',
                    zIndex: 20,
                    display: { xs: 'none', md: 'block' },
                }}
            >
                <Container>
                    <Header />
                </Container>
            </Box>
            <Box paddingTop={{ xs: 4, md: 12 }} paddingBottom={{ xs: 12, md: 4 }}>
                <Container>{children}</Container>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    background: 'white',
                    zIndex: 20,
                    display: { md: 'none' },
                }}
            >
                <Container>
                    <Navbar />
                </Container>
            </Box>
            <ModalDialog
                open={dialogContext.createNFTDlgOpened}
                onClose={() => {
                    dialogContext.actions.setCreateNFTDlgOpen(false);
                }}
            >
                <MintNFT />
            </ModalDialog>
        </>
    );
};

export default Layout;
