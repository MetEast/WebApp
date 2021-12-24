import React from 'react';
import { TypeNavbarItem } from 'src/types/layout-types';
import NavbarItem from './components/NavbarItem';
import { Box } from '@mui/material';
import { Home24Filled, AppFolder24Filled, Box24Filled, Person24Filled } from '@fluentui/react-icons';
import { useLocation } from 'react-router-dom';

const navbarItemList: Array<TypeNavbarItem> = [
    {
        icon: Home24Filled,
        title: 'active',
        url: '/',
    },
    {
        icon: AppFolder24Filled,
        title: 'Gallery',
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
                width: '100%',
                position: 'fixed',
                bottom: 0,
                background: 'white',
                zIndex: 10,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: '2.25rem',
                    paddingRight: '2.25rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '1.5rem',
                }}
            >
                {navbarItemList.map((item, index) => (
                    <NavbarItem key={`navbaritem-${index}`} data={item} isSelected={item.url === location.pathname} />
                ))}
            </Box>
        </Box>
    );
};

export default Navbar;
