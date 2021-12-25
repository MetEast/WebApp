import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const menuItemsList = [
    {
        title: 'Home',
        url: '/',
    },
    {
        title: 'Explore',
        url: '/explore',
    },
    {
        title: 'Blind Boxes',
        url: '/blind-box',
    },
];

const Header: React.FC = (): JSX.Element => {
    const location = useLocation();

    return (
        <Box
            sx={{
                width: '100%',
                position: 'fixed',
                top: 0,
                background: '#EEEEEE',
                zIndex: 10,
            }}
        >
            <Typography fontSize={32} fontWeight={500}>Meteast</Typography>
        </Box>
    );
};

export default Header;
