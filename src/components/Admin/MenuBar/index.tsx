import React, { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import { BackToPublicBtn } from './styles';
import { useNavigate, useLocation } from 'react-router-dom';

interface IMenuItem {
    title: string;
    icon?: ReactNode;
    url: string;
    submenu?: IMenuItem[];
}

const MenuItem = (item: IMenuItem, index: number, depth: number): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Stack spacing={0.5} key={index}>
            <Stack
                direction="row"
                alignItems="center"
                paddingLeft={depth * 4 + 1}
                paddingY={1}
                spacing={1.5}
                color={location.pathname === item.url ? '#1890FF' : 'white'}
                sx={{
                    cursor: 'pointer',
                    background: location.pathname === item.url ? 'white' : 'auto',
                    ':hover': { background: location.pathname === item.url ? 'auto' : '#46A6FF' },
                }}
                borderRadius={3}
                onClick={() => {
                    navigate(item.url);
                }}
            >
                {item.icon}
                <Typography
                    color={location.pathname === item.url ? '#1890FF' : 'white'}
                    fontSize={16}
                    fontWeight={depth === 0 ? 700 : 400}
                >
                    {item.title}
                </Typography>
            </Stack>
            {item.submenu?.map((item, index) => MenuItem(item, index, depth + 1))}
        </Stack>
    );
};

const MenuBar: React.FC = (): JSX.Element => {
    const menu: IMenuItem[] = [
        {
            title: 'Banned NFTS',
            icon: <Icon icon="ph:image-square" fontSize={20} />,
            url: '/admin/nfts',
        },
        {
            title: 'USERS',
            icon: <Icon icon="ph:user" fontSize={20} />,
            url: '',
            submenu: [
                { title: 'Admins', url: '/admin/users/admins' },
                { title: 'Moderators', url: '/admin/users/moderators' },
                { title: 'Banned Users', url: '/admin/users/bannedusers' },
            ],
        },
        // { title: 'BLIND BOXES', icon: <Icon icon="ph:cube" fontSize={20} />, url: '/admin/blindboxes' },
        // {
        //     title: 'HOME',
        //     icon: <Icon icon="ph:house" fontSize={20} />,
        //     url: '',
        //     submenu: [
        //         { title: 'Popular', url: '/admin/home-popular' },
        //         { title: 'Upcoming', url: '/admin/home-upcoming' },
        //     ],
        // },
        // {
        //     title: 'ORDERS',
        //     icon: <Icon icon="ph:leaf" fontSize={20} />,
        //     url: '',
        //     submenu: [
        //         { title: 'NFTs', url: '/admin/orders-nfts' },
        //         { title: 'Mystery Boxes', url: '/admin/orders-blindboxes' },
        //     ],
        // },
        // { title: 'BIDS', icon: <Icon icon="ph:ticket" fontSize={20} />, url: '/admin/bids' },
        { title: 'BANNERS', icon: <Icon icon="ph:mountains" fontSize={20} />, url: '/admin/banners' },
        // { title: 'NOTIFICATIONS', icon: <Icon icon="ph:chat-circle" fontSize={20} />, url: '/admin/notifications' },
    ];

    const navigate = useNavigate();

    return (
        <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <img src="/assets/images/header/logo-white.svg" width={33} height={30} alt="" />
                <img src="/assets/images/header/meteast_label-white.svg" width={153} height={18} alt="" />
            </Stack>
            <BackToPublicBtn
                onClick={() => {
                    navigate('/');
                }}
            >
                <Icon icon="ph:caret-left-bold" color="#1ea557" style={{ marginBottom: 2, marginRight: 4 }} />
                {`Back to public`}
            </BackToPublicBtn>
            <Stack spacing={1}>{menu.map((item, index) => MenuItem(item, index, 0))}</Stack>
        </Stack>
    );
};

export default MenuBar;
