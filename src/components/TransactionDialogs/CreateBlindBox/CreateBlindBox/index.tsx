import React, { useState, useCallback, useEffect } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { useStyles, DateTimeInput } from './styles';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import WarningTypo from '../../components/WarningTypo';
import ELAPriceInput from '../../components/ELAPriceInput';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import UploadSingleFile from 'src/components/Upload/UploadSingleFile';
import { useSnackbar } from 'notistack';
import ModalDialog from 'src/components/ModalDialog';
import SearchBlindBoxItems from '../SearchBlindBoxItems';

export interface ComponentProps {}

const CreateBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    const [blindboxTitle, setBlindboxTitle] = useState<string>('');
    const [blindboxDescription, setBlindboxDescription] = useState<string>('');
    const [blindboxImage, setBlindboxImage] = useState<File>();
    const [stateFile, setStateFile] = useState(null);
    const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>('offline');
    const [blindboxQuantity, setBlindboxQuantity] = useState<number>(0);
    const [blindboxPrice, setBlindboxPrice] = useState<number>(0);
    const [blindboxPurchases, setBlindboxPurchases] = useState<number>(0);
    const [saleBegins, setSaleBegins] = React.useState<string>('');
    const [saleEnds, setSaleEnds] = useState<string>('');
    const [selectDlgOpened, setSelectDlgOpened] = useState<boolean>(false);

    const handleFileChange = (files: Array<File>) => {
        handleDropSingleFile(files);
        if (files !== null && files.length > 0) {
            setBlindboxImage(files[0]);
        }
    };

    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStateFile({ ...file, preview: URL.createObjectURL(file) });
        }
    }, []);

    useEffect(() => {
        const tokenIds: string[] = dialogState.crtBlindTokenIds.split(';').filter((item: string) => item.length > 0);
        setBlindboxQuantity(tokenIds.length);
    }, [dialogState.crtBlindTokenIds]);

    return (
        <>
            <Stack
                spacing={5}
                minWidth={{ xs: 360, sm: 580, md: 700 }}
                maxHeight={{ xs: 'auto', md: '70vh' }}
                sx={{ overflowY: 'auto', overflowX: 'hidden' }}
                className={classes.container}
            >
                <Stack alignItems="center">
                    <PageNumberTypo>1 of 2</PageNumberTypo>
                    <DialogTitleTypo>Create Blind Box</DialogTitleTypo>
                </Stack>
                <Box>
                    <Grid container columnSpacing={4} rowGap={3}>
                        <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={3}>
                            <CustomTextField
                                title="Blind Box Title"
                                placeholder="Enter Blind Box Title"
                                changeHandler={(value: string) => setBlindboxTitle(value)}
                            />
                            <CustomTextField
                                title="Blind Box Description"
                                placeholder="Is WYSIWYG is needed here?"
                                multiline
                                rows={3}
                                changeHandler={(value: string) => setBlindboxDescription(value)}
                            />
                            <Stack height="100%" spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Blind Box Main Image
                                </Typography>
                                <UploadSingleFile
                                    file={stateFile}
                                    onDrop={handleFileChange}
                                    sx={{
                                        width: '100%',
                                        height: { xs: '200px', sm: '100%' },
                                        marginTop: '1rem',
                                        borderRadius: '8px',
                                        background: '#E8F4FF',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={2}>
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Blind box items
                                </Typography>
                                <PrimaryButton fullWidth size="small" onClick={() => setSelectDlgOpened(true)}>
                                    Choose NFTs to add
                                </PrimaryButton>
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <CustomTextField
                                    disabled
                                    inputValue={blindboxQuantity.toString() || ''}
                                    title="Number of NFT"
                                    placeholder="es. 1000"
                                    changeHandler={(value: string) => setBlindboxQuantity(parseInt(value))}
                                />
                                <CustomTextField
                                    title="Max Num of Purchases"
                                    placeholder="es. 1000"
                                    number={true}
                                    changeHandler={(value: string) => setBlindboxPurchases(parseInt(value))}
                                />
                            </Stack>
                            <Stack spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Blind Box Status
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <PrimaryButton
                                        fullWidth
                                        size="small"
                                        sx={{
                                            background: blindboxStatus === 'offline' ? 'auto' : '#E8F4FF',
                                            color: blindboxStatus === 'offline' ? 'auto' : '#1890FF',
                                        }}
                                        onClick={() => setBlindboxStatus('offline')}
                                    >
                                        Offline
                                    </PrimaryButton>
                                    <PrimaryButton
                                        fullWidth
                                        size="small"
                                        sx={{
                                            background: blindboxStatus === 'online' ? 'auto' : '#E8F4FF',
                                            color: blindboxStatus === 'online' ? 'auto' : '#1890FF',
                                        }}
                                        onClick={() => setBlindboxStatus('online')}
                                    >
                                        Online
                                    </PrimaryButton>
                                </Stack>
                            </Stack>
                            <ELAPriceInput title="Price" handleChange={setBlindboxPrice} />
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Begins
                                </Typography>
                                <DateTimeInput
                                    type="datetime-local"
                                    value={saleBegins}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSaleBegins(event.target.value);
                                    }}
                                ></DateTimeInput>
                            </Stack>
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Ends
                                </Typography>
                                <DateTimeInput
                                    type="datetime-local"
                                    value={saleEnds}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setSaleEnds(event.target.value);
                                    }}
                                ></DateTimeInput>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <Stack alignItems="center" spacing={1}>
                    <Typography fontSize={14} fontWeight={600}>
                        Available: {signInDlgState.walletBalance} ELA
                    </Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <SecondaryButton
                            fullWidth
                            onClick={() => {
                                setDialogState({ ...dialogState, createBlindBoxDlgOpened: false });
                            }}
                        >
                            Back
                        </SecondaryButton>
                        <PrimaryButton
                            fullWidth
                            onClick={() => {
                                if (
                                    dialogState.crtBlindTokenIds !== '' &&
                                    blindboxTitle !== '' &&
                                    blindboxDescription !== '' &&
                                    blindboxImage !== null &&
                                    blindboxQuantity > 0 &&
                                    blindboxPrice > 0 &&
                                    saleBegins !== '' &&
                                    saleEnds !== '' &&
                                    blindboxPurchases > 0
                                ) {
                                    setDialogState({
                                        ...dialogState,
                                        createBlindBoxDlgStep: 1,
                                        crtBlindTitle: blindboxTitle,
                                        crtBlindDescription: blindboxDescription,
                                        crtBlindImage: blindboxImage,
                                        crtBlindStatus: blindboxStatus,
                                        crtBlindQuantity: blindboxQuantity,
                                        crtBlindPrice: blindboxPrice,
                                        crtBlindSaleBegin: saleBegins,
                                        crtBlindSaleEnd: saleEnds,
                                        crtBlindPurchases: blindboxPurchases,
                                    });
                                } else {
                                    enqueueSnackbar('Form validation failed!', {
                                        variant: 'warning',
                                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                                    });
                                }
                            }}
                        >
                            Confirm
                        </PrimaryButton>
                    </Stack>
                    <WarningTypo width={260}>
                        In case of payment problems, please contact the official customer service
                    </WarningTypo>
                </Stack>
            </Stack>
            <ModalDialog
                open={selectDlgOpened}
                onClose={() => {
                    setSelectDlgOpened(false);
                }}
            >
                <SearchBlindBoxItems
                    onClose={() => {
                        setSelectDlgOpened(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default CreateBlindBox;
