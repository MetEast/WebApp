import { Box } from '@mui/material';
import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Container from '../Container';

const Layout: React.FC = ({ children }): JSX.Element => {
    return (
        <>
            <Header />
            <Container>
                <Box paddingY={16}>
                    {children}
                </Box>
            </Container>
            <Navbar />
        </>
    );
};

export default Layout;
