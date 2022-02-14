import React from 'react';
import { TypeMenuItem } from 'src/types/layout-types';
import MenuItem from '../MenuItem';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const navbarItemList: Array<TypeMenuItem> = [
    {
        title: 'Home',
        url: '/',
    },
    {
        title: 'Products',
        url: '/products',
    },
    {
        title: 'Blind Boxes',
        url: '/blind-box',
    },
    {
        title: 'Profile',
        url: '/profile',
    },
];

const Navbar: React.FC = (): JSX.Element => {
    const location = useLocation();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // paddingLeft: '2.25rem',
                // paddingRight: '2.25rem',
                paddingTop: '0.5rem',
                paddingBottom: '1.5rem',
            }}
        >
            {navbarItemList.map((item, index) => (
                <MenuItem key={`navbaritem-${index}`} data={item} isSelected={item.url === location.pathname} />
            ))}
        </Box>
    );
};

export default Navbar;
