import { Box } from '@mui/material';
import React from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
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
