import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../../../MenuItem';
import { CreateNFTButton } from './styles';

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
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={32} fontWeight={500}>
                    Meteast
                </Typography>
                <Stack direction="row" spacing={4}>
                    {menuItemsList.map((item, index) => (
                        <MenuItem key={`navbaritem-${index}`} data={item} isSelected={item.url === location.pathname} />
                    ))}
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button>
                        <img src="/assets/icons/notification.svg" alt="" />
                    </Button>
                    <Button>
                        <img src="/assets/icons/profile.svg" alt="" />
                    </Button>
                    <CreateNFTButton>Create NFT</CreateNFTButton>
                </Stack>
            </Stack>
        </Box>
    );
};

export default Header;
