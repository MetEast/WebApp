import React from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../Navbar/TopNavbar';
import BottomNavbar from '../Navbar/BottomNavbar';
import Footer from '../Footer';
import Container from '../Container';
import SignInDlgContainer from '../SignInDialog';
import ProgressBar from '../ProgressBar';
import { useDialogContext } from 'src/context/DialogContext';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import CreateBlindBoxDlgContainer from '../TransactionDialogs/CreateBlindBox';
import ManageProfileDlgContainer from '../ManageProfile';

interface ComponentProps {
    showFooter?: boolean;
}

const Layout: React.FC<ComponentProps> = ({ children, showFooter = true }): JSX.Element => {
    const [dialogState] = useDialogContext();
    return (
        <>
            <SignInDlgContainer />
            <ProgressBar
                isFinished={dialogState.mintProgress === 0 || dialogState.mintProgress === 100}
                progress={dialogState.mintProgress}
            />
            <Box
                sx={{
                    width: '100%',
                    paddingY: 3,
                    position: 'fixed',
                    top: 0,
                    background: '#FFFFFF',
                    zIndex: 20,
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                <Container sx={{ overflow: 'visible' }}>
                    <TopNavbar />
                </Container>
            </Box>
            <Box paddingTop={{ xs: 0, sm: 12 }} paddingBottom={{ xs: 9, sm: 2 }}>
                {children}
                {showFooter && (
                    <Container>
                        <Footer marginTop={5} />
                    </Container>
                )}
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    background: 'white',
                    zIndex: 20,
                    display: { xs: 'block', sm: 'none' },
                }}
            >
                <Container>
                    <BottomNavbar />
                </Container>
            </Box>
            <MintNFTDlgContainer />
            <CreateBlindBoxDlgContainer />
            <ManageProfileDlgContainer />
        </>
    );
};

export default Layout;
