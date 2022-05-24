import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
// import { useStyles } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';
import { AdminBannersItemType } from 'src/types/admin-table-data-types';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeImageFile } from 'src/types/select-types';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { updateAdminBanner } from 'src/services/fetch';
import { useSnackbar } from 'notistack';
import { getAssetFromImage } from 'src/services/common';
import { ImageBox } from '../CreateBanner/styles';

export interface ComponentProps {
    bannerList: AdminBannersItemType[];
    banner2Edit: AdminBannersItemType;
    handleBannerUpdates: () => void;
    onClose: () => void;
}

const EditBanner: React.FC<ComponentProps> = ({
    bannerList,
    banner2Edit,
    handleBannerUpdates,
    onClose,
}): JSX.Element => {
    // const classes = useStyles();

    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    // const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>(banner2Edit.status === 'offline' ? 'offline' : 'online');
    const [location, setLocation] = useState<'home' | 'explore' | 'blindbox'>(
        banner2Edit.location === 'home' ? 'home' : banner2Edit.location === 'explore' ? 'explore' : 'blindbox',
    );
    // const [bannerUrl, setBannerUrl] = useState<string>('');
    const [sort, setSort] = useState<string>(banner2Edit.sort.toString());
    const [bannerImage, setBannerImage] = useState<TypeImageFile>({
        preview: banner2Edit.url,
        raw: new File([''], ''),
    });
    const [imageChanged, setImageChanged] = useState<boolean>(false);

    const handleBannerImageChanged = (e: any) => {
        if (e.target.files.length) {
            if (imageChanged === false) setImageChanged(true);
            setBannerImage({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0],
            });
        }
    };

    const handleSubmit = () => {
        if (bannerImage.preview === '' || isNaN(parseInt(sort))) return;
        if (
            bannerList.findIndex(
                (item: AdminBannersItemType) =>
                    item.location === location && item.sort === parseInt(sort) && item.id !== banner2Edit.id,
            ) !== -1
        ) {
            enqueueSnackbar('Same sort exist!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true, loadingDlgOpened: true });
        let url: string = '';
        const pageLocation = location === 'home' ? 1 : location === 'explore' ? 2 : 3;
        // const status = blindboxStatus === 'offline' ? 0 : 1;
        uploadImage2Ipfs(imageChanged ? bannerImage.raw : undefined)
            .then((added: any) => {
                url = imageChanged ? `meteast:image:${added.origin.path}` : getAssetFromImage(banner2Edit.url);
                return updateAdminBanner(signInDlgState.token, banner2Edit.id, url, pageLocation, 1, parseInt(sort));
            })
            .then((returnCode: number) => {
                if (returnCode === 200) {
                    enqueueSnackbar('Edited!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    setDialogState({ ...dialogState, waitingConfirmDlgOpened: false, loadingDlgOpened: false });
                    handleBannerUpdates();
                    onClose();
                } else {
                    enqueueSnackbar('Same sort exist!', {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    setDialogState({ ...dialogState, waitingConfirmDlgOpened: false });
                }
            })
            .catch((error) => {
                enqueueSnackbar('Edit banner error.', {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({ ...dialogState, waitingConfirmDlgOpened: false, loadingDlgOpened: false });
                handleBannerUpdates();
                onClose();
            })
            .finally(() => {
                setOnProgress(false);
            });
    };

    return (
        <Stack
            spacing={5}
            width={720}
            // maxHeight={'60vh'}
            // sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            // className={classes.container}
        >
            <Stack alignItems="center">
                <DialogTitleTypo>Edit Banner</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Image
                            </Typography>
                            <Box
                                position="relative"
                                borderRadius={4.5}
                                overflow="hidden"
                                sx={{
                                    width: '100%',
                                    paddingTop: '75%',
                                    height: { xs: '240px', sm: '100%' },
                                    marginTop: '1rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <ImageBox htmlFor="banner-image">
                                    <img
                                        src={
                                            bannerImage.preview === ''
                                                ? '/assets/images/blindbox/blindbox-nft-template2.png'
                                                : bannerImage.preview
                                        }
                                        style={{ borderRadius: '18px' }}
                                        alt=""
                                    />
                                    <input
                                        type="file"
                                        id="banner-image"
                                        style={{ display: 'none' }}
                                        onChange={handleBannerImageChanged}
                                    />
                                </ImageBox>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    btn_color="pink"
                                    fullWidth
                                    size="small"
                                    onClick={() => {
                                        setBannerImage({
                                            preview: '',
                                            raw: new File([''], ''),
                                        });
                                    }}
                                >
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </PrimaryButton>
                                <PrimaryButton
                                    btn_color="secondary"
                                    fullWidth
                                    size="small"
                                    onClick={() => document.getElementById('banner-image')?.click()}
                                >
                                    <Icon
                                        icon="ph:pencil-simple"
                                        fontSize={20}
                                        style={{ marginBottom: 4, marginRight: 4 }}
                                    />
                                    {`Edit`}
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        {/* <CustomTextField
                            title="URL"
                            placeholder="Enter Banner URL"
                            changeHandler={(value: string) => setBannerUrl(value)}
                        /> */}
                    </Grid>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Location
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_color={location === 'home' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('home')}
                                >
                                    Home
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_color={location === 'explore' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('explore')}
                                >
                                    Explore
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_color={location === 'blindbox' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('blindbox')}
                                >
                                    Mystery Box
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        {/* <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Banner Status
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_color={blindboxStatus === 'offline' ? 'primary' : 'secondary'}
                                    onClick={() => setBlindboxStatus('offline')}
                                >
                                    Offline
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_color={blindboxStatus === 'online' ? 'primary' : 'secondary'}
                                    onClick={() => setBlindboxStatus('online')}
                                >
                                    Online
                                </PrimaryButton>
                            </Stack>
                        </Stack> */}
                        <CustomTextField
                            title="Sort"
                            inputValue={sort}
                            placeholder="10"
                            changeHandler={(value: string) => setSort(value)}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Stack width="100%" direction="row" spacing={2}>
                <PrimaryButton btn_color="secondary" fullWidth onClick={onClose}>
                    close
                </PrimaryButton>
                <PrimaryButton fullWidth disabled={onProgress} onClick={handleSubmit}>
                    Confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default EditBanner;
