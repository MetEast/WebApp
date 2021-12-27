import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../MenuItem';
import { CreateNFTButton } from './styles';
import Container from '../Container';

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
                paddingY: 3,
                position: 'fixed',
                top: 0,
                background: '#FFFFFF',
                zIndex: 10,
            }}
        >
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography fontSize={32} fontWeight={900} sx={{ textTransform: 'uppercase' }}>
                        Meteast
                    </Typography>
                    <Stack direction="row" spacing={4}>
                        {menuItemsList.map((item, index) => (
                            <MenuItem
                                key={`navbaritem-${index}`}
                                data={item}
                                isSelected={item.url === location.pathname}
                            />
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
            </Container>
        </Box>
    );
};

export default Header;
