import React from 'react';
import { TypeMenuItem } from 'src/types/layout-types';
import MenuItem from '../MenuItem';
import { Box } from '@mui/material';
import { Home24Filled, AppFolder24Filled, Box24Filled, Person24Filled } from '@fluentui/react-icons';
import { useLocation } from 'react-router-dom';

const navbarItemList: Array<TypeMenuItem> = [
    {
        icon: Home24Filled,
        title: 'Home',
        url: '/',
    },
    {
        icon: AppFolder24Filled,
        title: 'Explore',
        url: '/explore',
    },
    {
        icon: Box24Filled,
        title: 'Blind Box',
        url: '/blind-box',
    },
    {
        icon: Person24Filled,
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
