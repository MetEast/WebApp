import React, { useState } from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { reduceHexAddress } from 'src/services/common';
import { essentialsConnector, isUsingEssentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import { useLocation, useNavigate } from 'react-router-dom';
import { disconnect } from 'process';
import { ProfileImageWrapper, ProfileImage } from './styles';
import CustomTextField from 'src/components/TextField';

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

    // const [userAvatarURL, setUserAvatarURL] = useState<string>('/assets/images/avatar-template.png');
    const [userAvatarURL, setUserAvatarURL] = useState<string>('');

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
            <Stack spacing={2}>
                <ProfileImageWrapper>
                    {userAvatarURL !== '' ? (
                        <ProfileImage src={userAvatarURL} />
                    ) : (
                        <Icon icon="ph:user" fontSize={40} color="#1890FF" />
                    )}
                </ProfileImageWrapper>
                <CustomTextField
                    title="Author name"
                    placeholder="Enter your name"
                    height={56}
                    sx={{ marginTop: 2.5 }}
                />
                <CustomTextField title="About the author" placeholder="Enter author introduction" multiline rows={5} />
                <Stack spacing={1}>
                    <Typography fontSize={12} fontWeight={700}>
                        Cover Picture
                    </Typography>
                    <Box
                        height={156}
                        borderRadius={4.5}
                        overflow="hidden"
                        sx={{
                            boxShadow: '0px 4px 2px -2px rgba(2, 14, 25, 0.2)',
                            filter: 'drop-shadow(0px 4px 8px rgba(7, 43, 76, 0.2))',
                        }}
                    >
                        <img
                            src="/assets/images/blindbox/blindbox-nft-template1.png"
                            width="100%"
                            height="100%"
                            alt=""
                        />
                    </Box>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={2} paddingTop={5}>
                <SecondaryButton fullWidth onClick={onClose}>
                    Close
                </SecondaryButton>
                <PrimaryButton fullWidth>CONFIRM</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditProfile;
