import { Box } from '@mui/material';
import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';

const Layout: React.FC = ({ children }): JSX.Element => {
    return (
        <>
            <Header />
            <Box p={4} pb={16} display="flex" justifyContent="center">
                <Box width="100%" maxWidth="800px">
                    {children}
                </Box>
            </Box>
            <Navbar />
        </>
    );
};

export default Layout;
