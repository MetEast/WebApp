import React, { useEffect } from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { TypeMenuItem } from 'src/types/layout-types';
import PageButton from './PageButton';
import { useNavigate } from 'react-router-dom';
import { useSignInContext } from 'src/context/SignInContext';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import { essentialsConnector } from '../ConnectWallet/EssentialConnectivity';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useCookies } from 'react-cookie';
import { NotificationTypo } from './styles';

interface ComponentProps {
    mobile?: boolean;
}

const Navbar: React.FC<ComponentProps> = ({ mobile = false }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogState, setDialogState] = useDialogContext();
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
            SignOutWithEssentials();
        }
    }, [essentialsConnector.hasWalletConnectSession()]);

    const SignOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        removeTokenCookie('METEAST_TOKEN');
        removeDidCookie('METEAST_DID');
        setSignInDlgState({...signInDlgState, isLoggedIn: false});
        try {
            await essentialsConnector.disconnectWalletConnect();
        }
        catch (e) {
            console.log(e);
        } 
        if(location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');   
        }
        window.location.reload();
    };

    const pageButtons = menuItemsList.map((item, index) => (
        <PageButton
            key={`navbaritem-${index}`}
            data={item}
            isSelected={item.url === location.pathname}
            mobile={mobile}
        />
    ));

    const menuButtons = signInDlgState.isLoggedIn ? (
        <>
            <Box position="relative">
                <IconButton>
                    <Icon icon="ph:chat-circle" fontSize={20} color="black" />
                </IconButton>
                <NotificationTypo>2</NotificationTypo>
            </Box>
            <IconButton
                onClick={() => {
                    navigate('/profile');
                }}
            >
                <Icon icon="ph:user" fontSize={20} color="black" />
            </IconButton>
            <IconButton onClick={SignOutWithEssentials}>
                <Icon icon="ph:sign-out" fontSize={20} color="black" />
            </IconButton>
            <PrimaryButton
                size="small"
                onClick={() => {
                    if (signInDlgState.isLoggedIn)
                        setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                    else setSignInDlgState({...signInDlgState, signInDlgOpened: true});

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
        <PrimaryButton
            size="small"
            sx={{ paddingX: 2 }}
            onClick={() => {
                setSignInDlgState({...signInDlgState, signInDlgOpened: true});
            }}
        >
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
                    <Box display={{ xs: 'none', lg: 'block' }}>
                        <img src="/assets/images/header/meteast_label.svg" alt="" />
                    </Box>
                </Stack>
            )}
            {mobile ? (
                pageButtons
            ) : (
                <Stack direction="row" spacing={3}>
                    {pageButtons}
                </Stack>
            )}
            {mobile ? (
                menuButtons
            ) : (
                <Stack direction="row" alignItems="center" spacing={2}>
                    {menuButtons}
                </Stack>
            )}
        </Stack>
    );
};

export default Navbar;
