import React from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuItem from '../MenuItem';
import { CreateNFTButton } from './styles';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useDialogContext } from 'src/context/DialogContext';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useRecoilState } from 'recoil';
import authAtom from 'src/recoil/auth';
import { essentialsConnector } from '../ConnectWallet/EssentialConnectivity';

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
    },
];

const Header: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dialogState, setDialogState] = useDialogContext();
    const [auth, setAuth] = useRecoilState(authAtom);

    const logOut = () => {
        essentialsConnector.disconnectWalletConnect();
        console.log("Signing out user. Deleting session info, auth token");
        localStorage.removeItem("token");
        localStorage.removeItem("did");
        setAuth({isLoggedIn: false});
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
            <Stack direction="row" spacing={1}>
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
                {auth?.isLoggedIn && <Button onClick={logOut}><LogoutOutlinedIcon sx={{color: '#000'}}>Log out</LogoutOutlinedIcon></Button>}
                <CreateNFTButton
                    onClick={() => {
                        setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                    }}
                >
                    Create NFT
                </CreateNFTButton>
            </Stack>
        </Stack>
    );
};

export default Header;
