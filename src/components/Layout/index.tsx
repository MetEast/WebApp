import { Box } from '@mui/material';
import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';

const Layout: React.FC = ({ children }): JSX.Element => {
    return (
        <>
            <Header />
            <Box marginTop={14} pb={16} display="flex" justifyContent="center" sx={{ overflow: 'hidden', zIndex: 0 }}>
                <Box width="100%" maxWidth="800px">
                    {children}
                </Box>
            </Box>
            <Navbar />
        </>
    );
};

export default Layout;
