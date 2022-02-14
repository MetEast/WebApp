import React, { useEffect } from 'react';
import { Button, Box, Typography, Stack, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { TypeMenuItem } from 'src/types/layout-types';
import MenuItem from '../MenuItem';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useRecoilState } from 'recoil';
import authAtom from 'src/recoil/auth';
import { essentialsConnector } from '../ConnectWallet/EssentialConnectivity';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useCookies } from 'react-cookie';
import { NotificationTypo } from './styles';

interface ComponentProps {
    mobile?: boolean;
}

const Navbar: React.FC<ComponentProps> = ({ mobile = false }): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogState, setDialogState] = useDialogContext();
    const [auth, setAuth] = useRecoilState(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(['METEAST_DID']);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(['METEAST_TOKEN']);

    const menuItemsList: Array<TypeMenuItem> = [
        {
            title: 'Home',
            url: '/',
            icon: <Icon icon="ph:house" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
        {
            title: 'Products',
            url: '/products',
            icon: (
                <Icon icon="ph:image-square" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />
            ),
        },
        {
            title: 'Blind Boxes',
            url: '/blind-box',
            icon: <Icon icon="ph:cube" fontSize={20} style={{ marginRight: mobile ? 0 : 6, marginBottom: 2 }} />,
        },
    ];

    // check if essentials has disconnected from mobile app
    useEffect(() => {
        if (
            tokenCookies.METEAST_TOKEN !== undefined &&
            didCookies.METEAST_DID !== undefined &&
            !essentialsConnector.hasWalletConnectSession()
        ) {
            logOut();
        }
    }, [essentialsConnector.hasWalletConnectSession()]);

    const logOut = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setAuth({ isLoggedIn: false });
        removeTokenCookie('METEAST_TOKEN');
        removeDidCookie('METEAST_DID');
        await essentialsConnector.disconnectWalletConnect();
        navigate('/');
        window.location.reload();
    };

    const menuButtons = menuItemsList.map((item, index) => (
        <MenuItem key={`navbaritem-${index}`} data={item} isSelected={item.url === location.pathname} mobile={mobile} />
    ));

    const otherButtons = auth?.isLoggedIn ? (
        <>
            <Box position="relative">
                <IconButton>
                    <Icon icon="ph:chat-circle" fontSize={mobile ? 20 : 28} color="black" />
                </IconButton>
                <NotificationTypo mobile={mobile}>2</NotificationTypo>
            </Box>
            <IconButton
                onClick={() => {
                    navigate('/profile');
                }}
            >
                <Icon icon="ph:user" fontSize={mobile ? 20 : 28} color="black" />
            </IconButton>
            <IconButton onClick={logOut}>
                <Icon icon="ph:sign-out" fontSize={mobile ? 20 : 28} color="black" />
            </IconButton>
            <PrimaryButton
                size="small"
                onClick={() => {
                    if (auth.isLoggedIn)
                        setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                    else navigate('/login');
                }}
                sx={{ paddingX: mobile ? 0 : 2, minWidth: 40 }}
            >
                <Icon icon="ph:sticker" fontSize={20} color="white" style={{ marginBottom: 2 }} />
                {!mobile && (
                    <Typography fontWeight={700} color="white" marginLeft={0.5}>
                        Create NFT
                    </Typography>
                )}
            </PrimaryButton>
            <PrimaryButton
                size="small"
                sx={{ paddingX: 2 }}
                onClick={() => {
                    navigate('/admin/nfts');
                }}
            >
                {mobile ? 'admin' : 'admin area'}
                <Icon
                    icon="ph:arrow-square-out"
                    fontSize={20}
                    color="white"
                    style={{ marginLeft: 4, marginBottom: 4 }}
                />
            </PrimaryButton>
        </>
    ) : (
        <PrimaryButton size="small" sx={{ paddingX: 2 }}>
            <Icon icon="ph:sign-in" fontSize={20} color="white" style={{ marginRight: 4, marginBottom: 2 }} />
            Login
        </PrimaryButton>
    );

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            paddingTop={mobile ? 0.5 : 0}
            paddingBottom={mobile ? 1.5 : 0}
        >
            {!mobile && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <img src="/assets/images/header/logo.svg" alt="" />
                    <img src="/assets/images/header/meteast_label.svg" alt="" />
                </Stack>
            )}
            {mobile ? (
                menuButtons
            ) : (
                <Stack direction="row" spacing={3}>
                    {menuButtons}
                </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={2}>
                {otherButtons}
            </Stack>
        </Stack>
    );
};

export default Navbar;
