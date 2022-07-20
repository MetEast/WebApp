import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { Icon } from '@iconify/react';
import { PrimaryButton, SecondaryButton, PinkButton } from 'src/components/Buttons/styles';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { getImageFromAsset } from 'src/services/common';
import { ProfileImageWrapper, ProfileImage, BannerBox, useStyles } from './styles';
import CustomTextField from 'src/components/TextField';
import { TypeImageFile } from 'src/types/select-types';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { uploadUserProfile } from 'src/services/fetch';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {
    onClose: () => void;
}

const EditProfile: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cookies, setCookies] = useCookies(['METEAST_TOKEN']);
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const [userAvatarURL, setUserAvatarURL] = useState<TypeImageFile>({
        preview: getImageFromAsset(signInDlgState.userAvatar),
        raw: new File([''], ''),
    });
    const [userCoverImageURL, setUserCoverImageURL] = useState<TypeImageFile>({
        preview: getImageFromAsset(signInDlgState.userCoverImage),
        raw: new File([''], ''),
    });
    const [userName, setUserName] = useState<string>(signInDlgState.userName);
    const [userDescription, setUserDescription] = useState<string>(signInDlgState.userDescription);
    const [avatarChanged, setAvatarChanged] = useState<boolean>(false);
    const [coverImageChanged, setCoverImageChanged] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === enumAuthType.ElastosEssentials
            ? (walletConnectProvider as any)
            : (library?.provider as any),
    );
    const classes = useStyles();
    const handleSelectAvatar = (e: any) => {
        if (e.target.files.length) {
            if (!avatarChanged) setAvatarChanged(true);
            setUserAvatarURL({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleChangeCoverImage = (e: any) => {
        if (e.target.files.length) {
            if (!coverImageChanged) setCoverImageChanged(true);
            setUserCoverImageURL({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleSignMessage = async (did: string, address: string) => {
        try {
            enqueueSnackbar('Sign with wallet.', {
                variant: 'info',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            const signature = await walletConnectWeb3.eth.personal.sign(`Update profile with ${did}`, address, '');
            return signature;
        } catch (err) {
            throw new Error('You need to sign the message to be able to edit profile.');
        }
    };

    const handleSubmit = async () => {
        setOnProgress(true);
        let urlAvatar: string = '';
        let urlCoverImage: string = '';
        uploadImage2Ipfs(avatarChanged ? userAvatarURL.raw : undefined)
            .then((added: any) => {
                setDialogState({ ...dialogState, progressBar: 20 });
                urlAvatar = avatarChanged ? `meteast:image:${added.origin.path}` : signInDlgState.userAvatar;
                return uploadImage2Ipfs(coverImageChanged ? userCoverImageURL.raw : undefined);
            })
            .then((added: any) => {
                setDialogState({ ...dialogState, progressBar: 40 });
                urlCoverImage = coverImageChanged
                    ? userCoverImageURL.preview
                        ? `meteast:image:${added.origin.path}`
                        : ''
                    : signInDlgState.userCoverImage;
                return handleSignMessage(signInDlgState.address, signInDlgState.walletAccounts[0]);
            })
            .then((signature: string) => {
                setDialogState({ ...dialogState, progressBar: 70 });
                return uploadUserProfile(
                    signInDlgState.token,
                    signInDlgState.walletAccounts[0],
                    signInDlgState.userDid,
                    userName ? userName : null,
                    userDescription ? userDescription : null,
                    urlAvatar ? urlAvatar : '',
                    urlCoverImage ? urlCoverImage : '',
                    signature,
                );
            })
            .then((token: any) => {
                setDialogState({ ...dialogState, progressBar: 100 });
                if (token) {
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.token = token;
                        _state.userName = userName ? userName : '';
                        _state.userDescription = userDescription ? userDescription : '';
                        _state.userAvatar = urlAvatar ? urlAvatar : '';
                        _state.userCoverImage = urlCoverImage ? urlCoverImage : '';
                        return _state;
                    });
                    setCookies('METEAST_TOKEN', token, { path: '/', sameSite: 'none', secure: true });
                    enqueueSnackbar('Saved!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                } else {
                    enqueueSnackbar('Error!', {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
                setOnProgress(false);
                onClose();
            })
            .catch((error) => {
                enqueueSnackbar('Update profile error.', {
                    variant: 'error',
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
                    limit={40}
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
                        {userCoverImageURL.preview && (
                            <img
                                src={userCoverImageURL.preview}
                                width="100%"
                                height="100%"
                                style={{ objectFit: 'cover' }}
                                alt=""
                            />
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
                                    if (!coverImageChanged) setCoverImageChanged(true);
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
