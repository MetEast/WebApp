import React, { useState, useCallback, useEffect } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { useStyles } from './styles';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import WarningTypo from '../../components/WarningTypo';
import ELAPriceInput from '../../components/ELAPriceInput';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import UploadSingleFile from 'src/components/Upload/UploadSingleFile';
import ModalDialog from 'src/components/ModalDialog';
import SearchBlindBoxItems from '../SearchBlindBoxItems';
import { getBBCandiatesList } from 'src/services/fetch';
import DateTimePicker from 'src/components/DateTimePicker/DateTimePicker';

export interface ComponentProps {}

const CreateBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const classes = useStyles();

    const [blindboxTitle, setBlindboxTitle] = useState<string>(dialogState.crtBlindTitle);
    const [blindboxTitleError, setBlindboxTitleError] = useState(false);
    const [blindboxDescription, setBlindboxDescription] = useState<string>(dialogState.crtBlindDescription);
    const [blindboxDescriptionError, setBlindboxDescriptionError] = useState(false);
    const [blindboxImage, setBlindboxImage] = useState<File>(dialogState.crtBlindImage);
    const [blindboxImageError, setBlindboxImageError] = useState(false);
    const [blindboxCandidateCount, setBlindboxCandidateCount] = useState<number>(0);
    const [blindboxCandidateError, setBlindboxCandidateError] = useState(false);

    const [stateFile, setStateFile] = useState(
        dialogState.crtBlindTitle === ''
            ? null
            : { raw: dialogState.crtBlindImage, preview: URL.createObjectURL(dialogState.crtBlindImage) },
    );
    // const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>(dialogState.crtBlindStatus);
    const [blindboxQuantity, setBlindboxQuantity] = useState<number>(dialogState.crtBlindQuantity);
    const [blindboxQuantityError, setBlindboxQuantityError] = useState(-1);
    const [blindboxPrice, setBlindboxPrice] = useState<number>(dialogState.crtBlindPrice);
    const [blindboxPriceError, setBlindBoxPriceError] = useState(false);
    const [blindboxPurchases, setBlindboxPurchases] = useState<number>(dialogState.crtBlindPurchases);
    const [blindboxPurchasesError, setBlindboxPurchasesError] = useState<boolean>(false);
    const [saleBegins, setSaleBegins] = React.useState<string>(dialogState.crtBlindSaleBegin);
    const [saleBeginsError, setSaleBeginsError] = useState<number>(0); // 0: no error, 1: not selected, 2: not valid
    // const [saleEnds, setSaleEnds] = useState<string>(dialogState.crtBlindEnd);
    // const [saleEndsError, setSaleEndsError] = useState(false);
    const [selectDlgOpened, setSelectDlgOpened] = useState<boolean>(false);
    const [maxLimit] = useState<number>(15);
    const [selectImageButtonDisable, setSelectImageButtonDisable] = useState<boolean>(true);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _BBCandidatesList = await getBBCandiatesList(signInDlgState.address, '', signInDlgState.token);
            // let count = 0;
            // for (let i = 0; i < _BBCandidatesList.length; i++) {
            //     const itemObject: TypeProductFetch = _BBCandidatesList[i];
            //     if (itemObject.status !== 'DELETED') count++;
            // }
            if (!unmounted) {
                setBlindboxCandidateCount(_BBCandidatesList.length);
            }
        };
        if (signInDlgState.address)
            getFetchData()
                .then(() => {
                    setSelectImageButtonDisable(false);
                })
                .catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.address, signInDlgState.token]);

    const handleFileChange = (files: Array<File>) => {
        if (files === null || files.length === 0) return;

        const file = files[0];
        if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif') return;

        handleDropSingleFile(file);

        setBlindboxImage(file);
        setBlindboxImageError(false);
    };

    const handleDropSingleFile = useCallback((file) => {
        if (file) {
            setStateFile({ ...file, preview: URL.createObjectURL(file) });
        }
    }, []);

    useEffect(() => {
        const tokenIds: string[] = dialogState.crtBlindTokenIds.split(';').filter((item: string) => item.length > 0);
        setBlindboxQuantity(tokenIds.length);
        if (blindboxQuantityError >= 0) {
            setBlindboxQuantityError(tokenIds.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogState.crtBlindTokenIds]);

    useEffect(() => {
        setBlindboxPurchases(blindboxPurchases > blindboxQuantity ? blindboxQuantity : blindboxPurchases);
    }, [blindboxQuantity, blindboxPurchases]);

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
                    <DialogTitleTypo>Create Mystery Box</DialogTitleTypo>
                </Stack>
                <Box>
                    <Grid container columnSpacing={4} rowGap={3}>
                        <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={2}>
                            <CustomTextField
                                title="Title"
                                inputValue={blindboxTitle}
                                placeholder="Enter Title"
                                error={blindboxTitleError}
                                errorText="Title can not be empty."
                                changeHandler={(value: string) => setBlindboxTitle(value)}
                            />
                            <CustomTextField
                                title="Description"
                                inputValue={blindboxDescription}
                                placeholder="Enter Description"
                                limit={450}
                                error={blindboxDescriptionError}
                                errorText="Description can not be empty."
                                multiline
                                rows={4}
                                changeHandler={(value: string) => setBlindboxDescription(value)}
                            />
                            <Stack height="100%" spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Main Image
                                </Typography>
                                <UploadSingleFile
                                    file={stateFile}
                                    onDrop={handleFileChange}
                                    sx={{
                                        width: '100%',
                                        height: { xs: '200px' },
                                        marginTop: '1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        boxSizing: 'border-box',
                                        border: blindboxImageError ? '2px solid #EB5757' : 'none',
                                    }}
                                />
                                {blindboxImageError && (
                                    <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                        Image file should be selected.
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={2}>
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Items
                                </Typography>
                                <PrimaryButton
                                    disabled={selectImageButtonDisable}
                                    fullWidth
                                    size="small"
                                    onClick={() => {
                                        if (blindboxCandidateCount) {
                                            setBlindboxCandidateError(false);
                                            setSelectDlgOpened(true);
                                        } else setBlindboxCandidateError(true);
                                    }}
                                >
                                    Choose NFTs to add
                                </PrimaryButton>
                                {blindboxCandidateError && (
                                    <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                        No NFT to select
                                    </Typography>
                                )}
                            </Stack>
                            <Stack direction="row" spacing={3}>
                                <CustomTextField
                                    disabled
                                    title="Number of NFT"
                                    inputValue={blindboxQuantity.toString() || ''}
                                    number={true}
                                    placeholder="es. 1000"
                                    error={blindboxQuantityError === 0 || blindboxQuantityError > maxLimit}
                                    errorText={
                                        blindboxQuantityError === 0
                                            ? 'Select at least 1 NFT'
                                            : `Cannot select NFTs more than ${maxLimit}`
                                    }
                                    changeHandler={(value: string) => setBlindboxQuantity(parseInt(value))}
                                />
                                <CustomTextField
                                    title="Max Num of Purchases"
                                    inputValue={blindboxPurchases.toString()}
                                    number={true}
                                    placeholder="es. 1000"
                                    error={blindboxPurchasesError}
                                    errorText="Max number of Purchases cannot be empty"
                                    changeHandler={(value: string) => {
                                        setBlindboxPurchases(isNaN(parseInt(value)) ? 0 : parseInt(value));
                                    }}
                                />
                            </Stack>
                            {/* <Stack spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Status
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
                            </Stack> */}
                            <ELAPriceInput
                                title="Price"
                                inputValue={blindboxPrice.toString()}
                                error={blindboxPriceError}
                                errorText="The price is invalid."
                                handleChange={setBlindboxPrice}
                            />
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Begins
                                </Typography>
                                <DateTimePicker
                                    onChangeDate={(value: Date) => {
                                        setSaleBegins(parseInt((value.getTime() / 1e3).toString()).toString());
                                        setSaleBeginsError(0);
                                    }}
                                    value={!isNaN(parseInt(saleBegins)) ? parseInt(saleBegins) : 0}
                                    error={saleBeginsError > 0}
                                />
                                {saleBeginsError > 0 && (
                                    <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                        {saleBeginsError === 1
                                            ? 'Sale Begins should be selected.'
                                            : 'Sale Begins should be selected after the current time.'}
                                    </Typography>
                                )}
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
                                setDialogState({
                                    ...dialogState,
                                    createBlindBoxDlgOpened: false,
                                    createBlindBoxDlgStep: 0,
                                    crtBlindTitle: '',
                                    crtBlindDescription: '',
                                    crtBlindImage: new File([''], ''),
                                    crtBlindTokenIds: '',
                                    // crtBlindStatus: 'offline',
                                    crtBlindQuantity: 0,
                                    crtBlindPrice: 0,
                                    crtBlindSaleBegin: '',
                                    // crtBlindSaleEnd: '',
                                    crtBlindPurchases: 0,
                                });
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
                                    stateFile !== null &&
                                    blindboxQuantity > 0 &&
                                    blindboxQuantity <= maxLimit &&
                                    blindboxPrice > 0 &&
                                    saleBegins &&
                                    parseInt(saleBegins) * 1e3 > new Date().getTime() &&
                                    blindboxPurchases <= blindboxQuantity &&
                                    blindboxPurchases > 0
                                ) {
                                    setDialogState({
                                        ...dialogState,
                                        createBlindBoxDlgStep: 1,
                                        crtBlindTitle: blindboxTitle,
                                        crtBlindDescription: blindboxDescription,
                                        crtBlindImage: blindboxImage,
                                        // crtBlindStatus: blindboxStatus,
                                        crtBlindQuantity: blindboxQuantity,
                                        crtBlindPrice: blindboxPrice,
                                        crtBlindSaleBegin: saleBegins,
                                        crtBlindPurchases: blindboxPurchases,
                                    });
                                } else {
                                    setBlindboxTitleError(blindboxTitle === '');
                                    setBlindboxDescriptionError(blindboxDescription === '');
                                    setBlindboxPurchasesError(blindboxPurchases === 0 || isNaN(blindboxPurchases));
                                    setSaleBeginsError(
                                        !saleBegins ? 1 : parseInt(saleBegins) * 1e3 <= new Date().getTime() ? 2 : 0,
                                    );
                                    setBlindboxImageError(stateFile === null);
                                    setBlindBoxPriceError(isNaN(blindboxPrice) || blindboxPrice === 0);
                                    setBlindboxQuantityError(blindboxQuantity);
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
                    maxSelect={maxLimit}
                    onClose={() => {
                        setSelectDlgOpened(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default CreateBlindBox;
