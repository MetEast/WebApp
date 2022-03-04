import React, { useState } from 'react';
import { Stack, Box, Grid, Typography, Button } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import { getImageFromAsset, reduceHexAddress } from 'src/services/common';
import { ProfileImageWrapper, ProfileImage, BannerBox } from './styles';
import CustomTextField from 'src/components/TextField';
import { TypeImageFile } from 'src/types/select-types';

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

    const [onProgress, setOnProgress] = useState<boolean>(false);
    const handleSubmit = () => {
        setOnProgress(true);
    };

    const [userAvatarURL, setUserAvatarURL] = useState<TypeImageFile>({
        preview: getImageFromAsset(userInfo.avatar),
        raw: '',
    });
    const [userCoverImageURL, setUserCoverImageURL] = useState<TypeImageFile>({ preview: '', raw: '' });
    const handleSelectAvatar = (e: any) => {
        if (e.target.files.length) {
            setUserAvatarURL({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleChangeCoverImage = (e: any) => {
        if (e.target.files.length) {
            setUserCoverImageURL({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleUpload = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', userAvatarURL.raw);

        await fetch('YOUR_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
    };

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
                    {userAvatarURL.preview !== '' ? (
                        <ProfileImage src={userAvatarURL.preview} />
                    ) : (
                        <Icon icon="ph:user" fontSize={40} color="#1890FF" />
                    )}
                    <label htmlFor="select-avatar-button">
                        <Stack className="hover_box_container">
                            <Icon icon="ph:pencil-simple" fontSize={14} color="white" />
                            <Stack fontSize={14} fontWeight={700} color="white">
                                Edit
                            </Stack>
                        </Stack>
                    </label>
                    <input
                        type="file"
                        id="select-avatar-button"
                        style={{ display: 'none' }}
                        onChange={handleSelectAvatar}
                    />
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
                            src={
                                userCoverImageURL.preview !== ''
                                    ? userCoverImageURL.preview
                                    : '/assets/images/blindbox/blindbox-nft-template1.png'
                            }
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
                            <PinkButton
                                size="small"
                                sx={{ width: 120 }}
                                onClick={() =>
                                    setUserCoverImageURL({
                                        preview: '',
                                        raw: '',
                                    })
                                }
                            >
                                <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                {`Delete`}
                            </PinkButton>
                            <label htmlFor="change-cover-image-button">
                                <SecondaryButton
                                    size="small"
                                    sx={{ width: 120 }}
                                    onClick={() => document.getElementById('change-cover-image-button')?.click()}
                                >
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Change`}
                                </SecondaryButton>
                            </label>
                            <input
                                type="file"
                                id="change-cover-image-button"
                                style={{ display: 'none' }}
                                onChange={handleChangeCoverImage}
                            />
                        </Stack>
                    </BannerBox>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={2} paddingTop={5}>
                <SecondaryButton fullWidth onClick={onClose} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Close
                </SecondaryButton>
                <PrimaryButton fullWidth disabled={onProgress} onClick={handleSubmit}>
                    CONFIRM
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditProfile;
