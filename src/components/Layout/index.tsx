import React from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../Navbar/TopNavbar';
import BottomNavbar from '../Navbar/BottomNavbar';
import Footer from '../Footer';
import Container from '../Container';
import SignInDlgContainer from '../SignInDialog';
import ProgressBar from '../ProgressBar';
import { useDialogContext } from 'src/context/DialogContext';
import { useLocation } from 'react-router-dom';
import AdminPage from 'src/pages/Admin';
import TransactionDlgContainer from '../TransactionDialogs';
import WebSocketContainer from '../Websocket';
import GotoTop from '../GotoTop';

interface ComponentProps {
    showFooter?: boolean;
}

const Layout: React.FC<ComponentProps> = ({ children, showFooter = true }): JSX.Element => {
    const location = useLocation();
    const [dialogState] = useDialogContext();

    return (
        <>
            <SignInDlgContainer />
            <ProgressBar
                isFinished={dialogState.progressBar === 0 || dialogState.progressBar === 100}
                progress={dialogState.progressBar}
            />
            {location.pathname.indexOf('/admin') === -1 ? (
                <>
                    <Box
                        sx={{
                            width: '100%',
                            paddingY: 3,
                            position: 'fixed',
                            top: 0,
                            background: 'white',
                            zIndex: 20,
                            display: { xs: 'none', sm: 'block' },
                        }}
                    >
                        <Container sx={{ overflow: 'visible' }}>
                            <TopNavbar />
                        </Container>
                    </Box>
                    <Box paddingTop={{ xs: 0, sm: 12 }} paddingBottom={{ xs: 9, sm: 0 }} sx={{ background: 'white' }}>
                        {children}
                        {showFooter && (
                            <Box
                                marginTop={{ xs: 6, sm: 10 }}
                                paddingY={{ xs: 0, sm: 6 }}
                                sx={{ background: { xs: 'white', sm: '#E7E7E7' } }}
                            >
                                <Container>
                                    <Footer />
                                </Container>
                            </Box>
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
                </>
            ) : (
                <AdminPage>{children}</AdminPage>
            )}
            <TransactionDlgContainer />
            <WebSocketContainer />
            <GotoTop />
        </>
    );
};

export default Layout;
