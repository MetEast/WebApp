import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { useSignInContext } from 'src/context/SignInContext';
import { getImageFromAsset } from 'src/services/common';
import { ProfileImageWrapper, ProfileImage, BannerBox, useStyles } from './styles';
import CustomTextField from 'src/components/TextField';
import { TypeImageFile } from 'src/types/select-types';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { uploadUserProfile } from 'src/services/fetch';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';

export interface ComponentProps {
    onClose: () => void;
}

const EditProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [cookies, setCookies] = useCookies(['METEAST_TOKEN']);
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const [userAvatarURL, setUserAvatarURL] = useState<TypeImageFile>({
        preview: signInDlgState.userAvatar === '' ? '' : getImageFromAsset(signInDlgState.userAvatar),
        raw: new File([''], ''),
    });
    const [userCoverImageURL, setUserCoverImageURL] = useState<TypeImageFile>({
        preview: signInDlgState.userCoverImage === '' ? '' : getImageFromAsset(signInDlgState.userCoverImage),
        raw: new File([''], ''),
    });
    const [userName, setUserName] = useState<string>(signInDlgState.userName);
    const [userDescription, setUserDescription] = useState<string>(signInDlgState.userDescription);
    const [avatarChanged, setAvatarChanged] = useState<boolean>(false);
    const [coverImageChanged, setCoverImageChanged] = useState<boolean>(false);
    const classes = useStyles();

    const handleSelectAvatar = (e: any) => {
        if (e.target.files.length) {
            if (avatarChanged === false) setAvatarChanged(true);
            setUserAvatarURL({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleChangeCoverImage = (e: any) => {
        if (e.target.files.length) {
            if (coverImageChanged === false) setCoverImageChanged(true);
            setUserCoverImageURL({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleSubmit = async () => {
        setOnProgress(true);
        let urlAvatar: string = '';
        let urlCoverImage: string = '';
        uploadImage2Ipfs(avatarChanged ? userAvatarURL.raw : undefined)
            .then((added: any) => {
                urlAvatar = avatarChanged ? `meteast:image:${added.path}` : signInDlgState.userAvatar;
                return uploadImage2Ipfs(coverImageChanged ? userCoverImageURL.raw : undefined);
            })
            .then((added: any) => {
                urlCoverImage = coverImageChanged ? `meteast:image:${added.path}` : signInDlgState.userCoverImage;
                return uploadUserProfile(
                    signInDlgState.token,
                    signInDlgState.userDid,
                    userName,
                    userDescription,
                    urlAvatar,
                    urlCoverImage,
                );
            })
            .then((token: any) => {
                if (token) {
                    setSignInDlgState({
                        ...signInDlgState,
                        token: token,
                        userName: userName,
                        userDescription: userDescription,
                        userAvatar: urlAvatar,
                        userCoverImage: urlCoverImage,
                    });
                    console.log('previous cookies: ', cookies);
                    setCookies('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                    enqueueSnackbar('Saved!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                } else {
                    enqueueSnackbar('Error!', {
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
                setOnProgress(false);
                onClose();
            })
            .catch((error) => {
                enqueueSnackbar('Error!', {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setOnProgress(false);
                onClose();
            });
    };

    return (
        <Stack
            spacing={4}
            width="100%"
            minWidth={{ xs: 360, sm: 520, md: 600 }}
            maxHeight={{ xs: 'auto', md: '70vh' }}
            paddingY={{ xs: 4, sm: 0 }}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            className={classes.container}
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
            <Stack width="100%" spacing={2}>
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
                    inputValue={userName}
                    changeHandler={(value: string) => setUserName(value)}
                />
                <CustomTextField
                    title="About the author"
                    placeholder="Enter author introduction"
                    multiline
                    rows={5}
                    limit={140}
                    inputValue={userDescription}
                    changeHandler={(value: string) => setUserDescription(value)}
                />
                <Stack spacing={1}>
                    <Typography fontSize={12} fontWeight={700}>
                        Cover Picture
                    </Typography>
                    <BannerBox sx={{ backgroundColor: '#C3C5C8' }}>
                        {userCoverImageURL.preview !== '' && (
                            <img src={userCoverImageURL.preview} width="100%" height="100%" alt="" />
                        )}
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
                                onClick={() => {
                                    if (coverImageChanged === false) setCoverImageChanged(true);
                                    setUserCoverImageURL({
                                        preview: '',
                                        raw: new File([''], ''),
                                    });
                                }}
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
                <PrimaryButton
                    fullWidth
                    disabled={onProgress}
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    CONFIRM
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditProfile;
