import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { ImageBox } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeImageFile } from 'src/types/select-types';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { addAdminBanner } from 'src/services/fetch';
import { useSnackbar } from 'notistack';
import { AdminBannersItemType } from 'src/types/admin-table-data-types';

export interface ComponentProps {
    bannerList: AdminBannersItemType[];
    handleBannerUpdates: () => void;
    onClose: () => void;
}

const CreateBanner: React.FC<ComponentProps> = ({ bannerList, handleBannerUpdates, onClose }): JSX.Element => {
    // const classes = useStyles();
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    // const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>('offline');
    const [location, setLocation] = useState<'home' | 'explore' | 'blindbox'>('home');
    // const [bannerUrl, setBannerUrl] = useState<string>('');
    const [sort, setSort] = useState<string>('10');
    const [bannerImage, setBannerImage] = useState<TypeImageFile>({
        preview: '',
        raw: new File([''], ''),
    });
    const handleBannerImageChanged = (e: any) => {
        if (e.target.files.length) {
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
                (item: AdminBannersItemType) => item.location === location && item.sort === parseInt(sort),
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
        uploadImage2Ipfs(bannerImage.raw)
            .then((added: any) => {
                url = `meteast:image:${added.path}`;
                return addAdminBanner(
                    signInDlgState.token,
                    signInDlgState.walletAccounts[0],
                    url,
                    pageLocation,
                    1,
                    parseInt(sort),
                );
            })
            .then((success: boolean) => {
                if (success) {
                    enqueueSnackbar('Added!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                } else {
                    enqueueSnackbar('Error', {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(error, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            })
            .finally(() => {
                setDialogState({ ...dialogState, waitingConfirmDlgOpened: false, loadingDlgOpened: false });
                setOnProgress(false);
                handleBannerUpdates();
                onClose();
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
                <DialogTitleTypo>Create Banner</DialogTitleTypo>
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
                                sx={{ width: '100%', paddingTop: '75%' }}
                            >
                                <ImageBox htmlFor="banner-image">
                                    <img
                                        src={
                                            bannerImage.preview === ''
                                                ? '/assets/images/blindbox/blindbox-nft-template2.png'
                                                : bannerImage.preview
                                        }
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

export default CreateBanner;
