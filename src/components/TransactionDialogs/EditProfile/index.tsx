import React from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { reduceHexAddress } from 'src/services/common';
import {
    essentialsConnector,
    isUsingEssentialsConnector
} from 'src/components/ConnectWallet/EssentialsConnectivity';
import { useLocation, useNavigate } from 'react-router-dom';
import { disconnect } from 'process';

export interface ComponentProps {
    onClose: () => void;
}

const EditProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const navigate = useNavigate();
    const location = useLocation();
    const userInfo: UserTokenType =
        tokenCookies.METEAST_TOKEN === undefined
            ? { did: '', email: '', exp: 0, iat: 0, name: '', type: '', canManageAdmins: false }
            : jwtDecode(tokenCookies.METEAST_TOKEN);
    const signOutWithEssentials = async () => {
        console.log('Signing out user. Deleting session info, auth token');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
        document.cookie += `METEAST_LINK=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_TOKEN=; Path=/; Expires=${new Date().toUTCString()};`;
        document.cookie += `METEAST_DID=; Path=/; Expires=${new Date().toUTCString()};`;
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                await essentialsConnector.getWalletConnectProvider().disconnect();
            }
        } catch (e) {
            console.log(e);
        }
        if (location.pathname.indexOf('/profile') !== -1 || location.pathname.indexOf('/mynft') !== -1) {
            navigate('/');
        }
        window.location.reload();
    };

    const disconnectEssentials = async () => {
        console.log('Disconnect wallet.');
        setSignInDlgState({ ...signInDlgState, isLoggedIn: false });
        try {
            if (isUsingEssentialsConnector() && essentialsConnector.hasWalletConnectSession()) {
                await essentialsConnector.disconnectWalletConnect();
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Stack
            spacing={4}
            width={{ md: 600 }}
            paddingY={{ xs: 4, sm: 0 }}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Edit Profile</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={3} rowSpacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Icon icon="ph:user" fontSize={20} color="black" />
                                    <Typography
                                        fontSize={14}
                                        fontWeight={700}
                                        color="black"
                                        sx={{ textTransform: 'uppercase' }}
                                    >
                                        Identity
                                    </Typography>
                                </Stack>
                                <PrimaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }} onClick={signOutWithEssentials}>
                                    sign out
                                </PrimaryButton>
                            </Stack>
                            <Typography fontSize={14} fontWeight={400} marginTop={3} alignSelf="flex-end">
                                {`did:elastos:${reduceHexAddress(didCookies.METEAST_DID, 5)}`}
                            </Typography>
                            <Typography fontSize={18} fontWeight={700} alignSelf="flex-end">
                                {userInfo.name}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack padding={3} borderRadius={6} sx={{ background: '#F0F1F2' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Icon icon="ph:wallet" fontSize={20} color="black" />
                                    <Typography
                                        fontSize={14}
                                        fontWeight={700}
                                        color="black"
                                        sx={{ textTransform: 'uppercase' }}
                                    >
                                        Wallet
                                    </Typography>
                                </Stack>
                                <PrimaryButton sx={{ height: 32, borderRadius: 2.5, fontSize: 14 }} onClick={disconnectEssentials}>
                                    Disconnect
                                </PrimaryButton>
                            </Stack>
                            <Typography fontSize={14} fontWeight={400} marginTop={3} alignSelf="flex-end">
                                {reduceHexAddress(signInDlgState.walletAccounts[0], 4)}
                            </Typography>
                            <Stack direction="row" alignItems="center" alignSelf="flex-end" spacing={0.25}>
                                <img src="/assets/icons/elatos-ela.svg" alt="" style={{ marginBottom: '2px' }} />
                                <Typography fontSize={18} fontWeight={700}>
                                    {`${signInDlgState.walletBalance} ELA`}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Avatar Picture
                            </Typography>
                            <Box height={156} borderRadius={5} overflow="hidden">
                                <img
                                    src="/assets/images/blindbox/blindbox-nft-template2.png"
                                    alt=""
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <PinkButton fullWidth size="small">
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </PinkButton>
                                <SecondaryButton fullWidth size="small">
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </SecondaryButton>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Cover Picture
                            </Typography>
                            <Box height={156} borderRadius={5} overflow="hidden">
                                <img
                                    src="/assets/images/blindbox/blindbox-nft-template3.png"
                                    alt=""
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <PinkButton fullWidth size="small">
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </PinkButton>
                                <SecondaryButton fullWidth size="small">
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </SecondaryButton>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <PrimaryButton fullWidth size="small">
                CONFIRM
            </PrimaryButton>
            <Stack direction="row" spacing={2}>
                <SecondaryButton fullWidth size="small" onClick={onClose}>
                    BACK
                </SecondaryButton>
                <PrimaryButton fullWidth size="small">
                    CONFIRM
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditProfile;
