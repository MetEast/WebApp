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
import { ProfileImageWrapper, ProfileImage, BannerBox } from './styles';
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
                    <Stack className="hover_box_container">
                        <Icon icon="ph:pencil-simple" fontSize={14} color="white" />
                        <Typography fontSize={14} fontWeight={700} color="white">
                            Edit
                        </Typography>
                    </Stack>
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
                    <BannerBox>
                        <img
                            src="/assets/images/blindbox/blindbox-nft-template1.png"
                            width="100%"
                            height="100%"
                            alt=""
                        />
                        <Stack
                            className="hover_box_container"
                            direction="row"
                            justifyContent="flex-end"
                            padding={2}
                            spacing={1}
                        >
                            <PinkButton size="small" sx={{ width: 120 }}>
                                <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                {`Delete`}
                            </PinkButton>
                            <SecondaryButton size="small" sx={{ width: 120 }}>
                                <Icon
                                    icon="ph:pencil-simple"
                                    fontSize={20}
                                    style={{ marginBottom: 4, marginRight: 4 }}
                                />
                                {`Change`}
                            </SecondaryButton>
                        </Stack>
                    </BannerBox>
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
