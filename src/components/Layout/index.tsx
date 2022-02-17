import { Box, Typography } from '@mui/material';
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Container from '../Container';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import generatedGitInfo from '../../generatedGitInfo.json';

const Layout: React.FC = ({ children }): JSX.Element => {
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
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                <Container>
                    <Header />
                </Container>
            </Box>
            <Box paddingTop={{ xs: 4, sm: 12 }} paddingBottom={{ xs: 12, sm: 4 }}>
                <Container>{children}</Container>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'fixed',
                    bottom: 0,
                    background: 'white',
                    zIndex: 20,
                    display: { sm: 'none' },
                }}
            >
                <Container>
                    <Footer />
                </Container>
            </Box>
            <Box position="fixed" bottom={10} right={10} padding={1} zIndex={100} sx={{ background: '#EEEEEE' }}>
                <Typography>v1 - {generatedGitInfo.gitCommitHash}</Typography>
            </Box>
            <MintNFTDlgContainer />
        </>
    );
};

export default Layout;
