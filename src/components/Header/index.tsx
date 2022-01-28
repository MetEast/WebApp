import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../MenuItem';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useRecoilState } from 'recoil';
import authAtom from 'src/recoil/auth';
import { essentialsConnector } from '../ConnectWallet/EssentialConnectivity';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { useCookies } from "react-cookie";

const menuItemsList = [
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
    }
];

const Header: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogState, setDialogState] = useDialogContext();
    const [auth, setAuth] = useRecoilState(authAtom);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(["token"]);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);

    const logOut = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setAuth({ isLoggedIn: false });
        removeTokenCookie("token");
        removeDidCookie("did");
        console.log("Connector--------------:" , essentialsConnector.hasWalletConnectSession());
        console.log("walletConnector isconnecting--------------:", essentialsConnector.getWalletConnectProvider().isConnecting);
        console.log("walletConnector connected--------------:", essentialsConnector.getWalletConnectProvider().connected);
        console.log("walletConnector connected--------------:", essentialsConnector.getWalletConnectProvider().chainId);
        console.log("walletConnector connected--------------:", essentialsConnector.getWalletConnectProvider().rpcUrl);
        // await (await essentialsConnector.getWalletConnectProvider().getWalletConnector()).killSession();
        await essentialsConnector.disconnectWalletConnect();
        navigate('/');
    };

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography fontSize={32} fontWeight={900} sx={{ textTransform: 'uppercase' }}>
                Meteast
            </Typography>
            <Stack direction="row" spacing={4}>
                {menuItemsList.map((item, index) => (
                    <MenuItem key={`navbaritem-${index}`} data={item} isSelected={item.url === location.pathname} />
                ))}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Button>
                    <Icon icon="ph:chat-circle" fontSize={24} color="black" />
                </Button>
                <Button
                    onClick={() => {
                        navigate('/profile');
                    }}
                >
                    <Icon icon="ph:user" fontSize={24} color="black" />
                </Button>
                {auth?.isLoggedIn && (
                    <Button onClick={logOut}>
                        <LogoutOutlinedIcon sx={{ color: '#000' }}>Log out</LogoutOutlinedIcon>
                    </Button>
                )}
                <PrimaryButton
                    size="small"
                    onClick={() => {
                        if(auth.isLoggedIn) setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                        else navigate('/login');
                    }}
                    sx={{ paddingX: 2 }}
                >
                    Create NFT
                </PrimaryButton>
                <PrimaryButton
                    size="small"
                    sx={{ paddingX: 2 }}
                    onClick={() => {
                        navigate('/admin/nfts');
                    }}
                >
                    admin area
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default Header;
