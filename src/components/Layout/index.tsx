import { Box } from '@mui/material';
import React from 'react';
import Navbar from './components/Navbar';

const Layout: React.FC = ({ children }): JSX.Element => {
    return (
        <>
            <Box padding={4} paddingBottom={16}>
                {children}
            </Box>
            <Navbar />
        </>
    );
};

export default Layout;
