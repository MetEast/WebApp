import React, { ReactNode, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { BackToPublicBtn } from './styles';

interface MenuItem {
    title: string;
    icon?: ReactNode;
    url: string;
    submenu?: MenuItem[];
}

const menuItem = (item: MenuItem, depth: number): JSX.Element => {
    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.5} color="white" sx={{ cursor: 'pointer' }}>
                {item.icon}
                <Typography marginLeft={depth * 4} color="white" fontSize={16} fontWeight={depth === 0 ? 700 : 400}>
                    {item.title}
                </Typography>
            </Stack>
            {item.submenu?.map((item) => menuItem(item, depth + 1))}
        </Stack>
    );
};

const MenuBar: React.FC = (): JSX.Element => {
    const menu: MenuItem[] = [
        {
            title: 'NFTS',
            icon: <Icon icon="ph:image-square" fontSize={20} />,
            url: '',
        },
        { title: 'BLIND BOXES', icon: <Icon icon="ph:cube" fontSize={20} />, url: '' },
        {
            title: 'HOME',
            icon: <Icon icon="ph:house" fontSize={20} />,
            url: '',
            submenu: [
                { title: 'Popular', url: '' },
                { title: 'Upcoming', url: '' },
            ],
        },
        {
            title: 'ORDERS',
            icon: <Icon icon="ph:leaf" fontSize={20} />,
            url: '',
            submenu: [
                { title: 'NFTs', url: '' },
                { title: 'Blind Boxes', url: '' },
            ],
        },
        { title: 'BIDS', icon: <Icon icon="ph:ticket" fontSize={20} />, url: '' },
        { title: 'BANNERS', icon: <Icon icon="ph:mountains" fontSize={20} />, url: '' },
        { title: 'NOTIFICATIONS', icon: <Icon icon="ph:chat-circle" fontSize={20} />, url: '' },
    ];

    return (
        <Stack spacing={3}>
            <Typography
                fontSize={32}
                fontWeight={900}
                color="white"
                textAlign="center"
                sx={{ textTransform: 'uppercase' }}
            >
                Meteast
            </Typography>
            <BackToPublicBtn>
                <Icon icon="ph:caret-left-bold" color="#1ea557" style={{ marginBottom: 2, marginRight: 4 }} />
                {`Back to public`}
            </BackToPublicBtn>
            <Stack spacing={3}>{menu.map((item) => menuItem(item, 0))}</Stack>
        </Stack>
    );
};

export default MenuBar;
