import React, { useState, useCallback } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { DialogTitleTypo } from '../../../TransactionDialogs/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { Icon } from '@iconify/react';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { uploadImage2Ipfs } from 'src/services/ipfs';
import { addAdminBanner } from 'src/services/fetch';
import { useSnackbar } from 'notistack';
import { AdminBannersItemType } from 'src/types/admin-table-data-types';
import UploadSingleFile from 'src/components/Upload/UploadSingleFile';

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
    const [sort, setSort] = useState<number>(10);
    const [sortError, setSortError] = useState(false);

    const [stateFile, setStateFile] = useState(null);

    const [bannerImgFile, setBannerImgFile] = useState<File>();
    const [bannerImgFileError, setBannerImgFileError] = useState(false);

    const handleFileChange = (files: Array<File>) => {
        if (files === null || files.length === 0) return;

        const file = files[0];
        if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif') return;

        handleDropSingleFile(file);

        setBannerImgFile(file);
        setBannerImgFileError(false);
    };

    const handleDropSingleFile = useCallback((file) => {
        if (file) {
            setStateFile({ ...file, preview: URL.createObjectURL(file) });
        }
    }, []);

    const handleSubmit = () => {
        if (stateFile === null || isNaN(sort)) {
            setBannerImgFileError(stateFile === null);
            setSortError(isNaN(sort));
            return;
        }

        if (
            bannerList.findIndex((item: AdminBannersItemType) => item.location === location && item.sort === sort) !==
            -1
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
        uploadImage2Ipfs(bannerImgFile)
            .then((added: any) => {
                url = `meteast:image:${added.origin.path}`;
                return addAdminBanner(signInDlgState.token, url, pageLocation, 1, sort);
            })
            .then((returnCode: number) => {
                if (returnCode === 200) {
                    enqueueSnackbar('Added!', {
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
                enqueueSnackbar('Create banner error.', {
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
                <DialogTitleTypo>Create Banner</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Image
                            </Typography>
                            <UploadSingleFile
                                file={stateFile}
                                onDrop={handleFileChange}
                                sx={{
                                    width: '100%',
                                    height: { xs: '300px' },
                                    marginTop: '1rem',
                                    borderRadius: '8px',
                                    background: stateFile === null ? '#E8F4FF' : 'transparent',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box',
                                    border: bannerImgFileError ? '2px solid #EB5757' : 'none',
                                }}
                            />
                            {bannerImgFileError && (
                                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                    Source file should be selected.
                                </Typography>
                            )}
                            <Stack direction="row" spacing={1}>
                                <PrimaryButton
                                    btn_color="pink"
                                    fullWidth
                                    size="small"
                                    onClick={() => {
                                        setBannerImgFile(new File([''], ''));
                                        setStateFile(null);
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
                            inputValue={sort.toString()}
                            number
                            error={sortError}
                            errorText="Sort value can not be empty."
                            placeholder="10"
                            changeHandler={(value: string) => setSort(value === '' ? NaN : parseInt(value))}
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
