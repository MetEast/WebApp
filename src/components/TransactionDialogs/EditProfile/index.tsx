import React, { useState } from 'react';
import { Stack, Box, Grid, Typography, Button } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { reduceHexAddress } from 'src/services/common';
import { ProfileImageWrapper, ProfileImage, BannerBox } from './styles';
import CustomTextField from 'src/components/TextField';

export interface ComponentProps {
    onClose: () => void;
}

const EditProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const userInfo: UserTokenType =
        tokenCookies.METEAST_TOKEN === undefined
            ? {
                  did: '',
                  name: '',
                  description: '',
                  avatar: '',
                  email: '',
                  exp: 0,
                  iat: 0,
                  type: '',
                  canManageAdmins: false,
              }
            : jwtDecode(tokenCookies.METEAST_TOKEN);

    // const [userAvatarURL, setUserAvatarURL] = useState<string>('/assets/images/avatar-template.png');
    const [userAvatarURL, setUserAvatarURL] = useState<string>('');

    return (
        <Stack
            spacing={4}
            width={{ md: 600 }}
            paddingY={{ xs: 4, sm: 0 }}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
            <SecondaryButton
                size="small"
                onClick={onClose}
                sx={{ width: 105, alignSelf: 'flex-start', display: { xs: 'flex', sm: 'none' } }}
            >
                <Icon
                    icon="ph:caret-left-bold"
                    fontSize={20}
                    color="#1890FF"
                    style={{ marginLeft: -4, marginRight: 8, marginBottom: 2 }}
                />
                Back
            </SecondaryButton>
            <Stack>
                <DialogTitleTypo sx={{ textAlign: 'center' }}>Edit Profile</DialogTitleTypo>
            </Stack>
            <Stack spacing={2}>
                <ProfileImageWrapper onClick={() => {}}>
                    {userAvatarURL !== '' ? (
                        <ProfileImage src={userAvatarURL} />
                    ) : (
                        <Icon icon="ph:user" fontSize={40} color="#1890FF" />
                    )}
                    <Box className="hover_box_container" onClick={() => {}}>
                        <Stack sx={{ alignItems: 'center' }}>
                            <Icon icon="ph:pencil-simple" fontSize={14} color="white" />
                            <Stack fontSize={14} fontWeight={700} color="white">
                                Edit
                            </Stack>
                        </Stack>
                    </Box>
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
                <SecondaryButton fullWidth onClick={onClose} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Close
                </SecondaryButton>
                <PrimaryButton fullWidth>CONFIRM</PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditProfile;
