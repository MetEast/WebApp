import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
// import { useStyles } from './styles';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';
import { useSignInContext } from 'src/context/SignInContext';
import { TypeImageFile } from 'src/types/select-types';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { addAdminBanner } from 'src/services/fetch';
import { useSnackbar } from 'notistack';

export interface ComponentProps {
    handleBannerUpdates: () => void;
    onClose: () => void;
}

const CreateBanner: React.FC<ComponentProps> = ({ handleBannerUpdates, onClose }): JSX.Element => {
    // const classes = useStyles();
    const [signInDlgState] = useSignInContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>('offline');
    const [location, setLocation] = useState<'home' | 'explore' | 'blindbox'>('home');
    const [bannerUrl, setBannerUrl] = useState<string>('');
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

    const handleSubmit = async () => {
        if ((bannerImage.preview === '' && bannerUrl === '') || isNaN(parseInt(sort))) return;
        setOnProgress(true);
        let url: string = '';
        const pageLocation = location === 'home' ? 1 : location === 'explore' ? 2 : 3;
        const status = blindboxStatus === 'offline' ? 0 : 1;
        uploadImage2Ipfs(bannerImage.raw)
            .then((added: any) => {
                url = `meteast:image:${added.path}`;
                console.log(
                    signInDlgState.token,
                    signInDlgState.walletAccounts[0],
                    url === '' ? bannerUrl : url,
                    pageLocation,
                    status,
                    parseInt(sort),
                );
                return addAdminBanner(
                    signInDlgState.token,
                    signInDlgState.walletAccounts[0],
                    url === '' ? bannerUrl : url,
                    pageLocation,
                    status,
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
                        variant: 'warning',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                }
            })
            .catch((error) => {
                enqueueSnackbar(error, {
                    variant: 'warning',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
            })
            .finally(() => {
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
                            <img
                                src={
                                    bannerImage.preview === ''
                                        ? '/assets/images/blindbox/blindbox-nft-template2.png'
                                        : bannerImage.preview
                                }
                                style={{ borderRadius: '18px' }}
                                alt=""
                            />
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    btn_type="pink"
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
                                <label htmlFor="banner-image" style={{ width: '100%' }}>
                                    <PrimaryButton
                                        btn_type="secondary"
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
                                </label>
                                <input
                                    type="file"
                                    id="banner-image"
                                    style={{ display: 'none' }}
                                    onChange={handleBannerImageChanged}
                                />
                            </Stack>
                        </Stack>
                        <CustomTextField
                            title="URL"
                            placeholder="Enter Banner URL"
                            changeHandler={(value: string) => setBannerUrl(value)}
                        />
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
                                    btn_type={location === 'home' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('home')}
                                >
                                    Home
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={location === 'explore' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('explore')}
                                >
                                    Explore
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={location === 'blindbox' ? 'primary' : 'secondary'}
                                    onClick={() => setLocation('blindbox')}
                                >
                                    Blind Box
                                </PrimaryButton>
                            </Stack>
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Banner Status
                            </Typography>
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={blindboxStatus === 'offline' ? 'primary' : 'secondary'}
                                    onClick={() => setBlindboxStatus('offline')}
                                >
                                    Offline
                                </PrimaryButton>
                                <PrimaryButton
                                    fullWidth
                                    size="small"
                                    btn_type={blindboxStatus === 'online' ? 'primary' : 'secondary'}
                                    onClick={() => setBlindboxStatus('online')}
                                >
                                    Online
                                </PrimaryButton>
                            </Stack>
                        </Stack>
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
                <PrimaryButton btn_type="secondary" fullWidth onClick={onClose}>
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
