import React, { useState, useCallback } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { useStyles, SelectBtn } from './styles';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import WarningTypo from '../../components/WarningTypo';
import { Icon } from '@iconify/react';
import { TypeSelectItem } from 'src/types/select-types';
import ELAPriceInput from '../../components/ELAPriceInput';
import Select from 'src/components/Select';
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

    const blindboxItemsOptions: Array<TypeSelectItem> = [
        {
            label: 'Item1',
            value: 'Item1',
        },
        {
            label: 'Item2',
            value: 'Item2',
        },
        {
            label: 'Item3',
            value: 'Item3',
        },
    ];

    const saleBeginsOptions: Array<TypeSelectItem> = [
        {
            label: 'Begin Date 1',
            value: 'Begin Date 1',
        },
        {
            label: 'Begin Date 2',
            value: 'Begin Date 2',
        },
        {
            label: 'Begin Date 3',
            value: 'Begin Date 3',
        },
    ];

    const saleEndsOptions: Array<TypeSelectItem> = [
        {
            label: 'End Date 1',
            value: 'End Date 1',
        },
        {
            label: 'End Date 2',
            value: 'End Date 2',
        },
        {
            label: 'End Date 3',
            value: 'End Date 3',
        },
    ];

    const sortOptions: Array<TypeSelectItem> = [
        {
            label: 'Sort Option 1',
            value: 'Sort Option 1',
        },
        {
            label: 'Sort Option 2',
            value: 'Sort Option 2',
        },
        {
            label: 'Sort Option 3',
            value: 'Sort Option 3',
        },
    ];

    const [blindboxTitle, setBlindboxTitle] = useState<string>('');
    const [blindboxDescription, setBlindboxDescription] = useState<string>('');
    const [blindboxAuthorDes, setBlindboxAuthorDesc] = useState<string>('');
    const [blindboxImage, setBlindboxImage] = useState<File>();
    const [stateFile, setStateFile] = useState(null);
    const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>('offline');
    const [blindboxQuantity, setblindboxQuantity] = useState<number>(0);
    const [blindboxPrice, setBlindboxPrice] = useState<number>(0);
    const [blindboxLikes, setBlindboxLikes] = useState<number>(0);
    const [blindboxViews, setBlindboxViews] = useState<number>(0);
    const [blindboxPurchases, setBlindboxPurchases] = useState<number>(0);

    const [blindboxItem, setBlindboxItem] = useState<TypeSelectItem>();
    const [blindboxItemSelectOpen, setBlindboxItemSelectOpen] = useState(false);

    const [saleBegins, setSaleBegins] = useState<TypeSelectItem>();
    const [saleBeginsSelectOpen, setSaleBeginsSelectOpen] = useState(false);

    const [saleEnds, setSaleEnds] = useState<TypeSelectItem>();
    const [saleEndsSelectOpen, setSaleEndsSelectOpen] = useState(false);

    const [sort, setSort] = useState<TypeSelectItem>();
    const [sortSelectOpen, setSortSelectOpen] = useState(false);
    const [selectDlgOpened, setSelectDlgOpened] = useState<boolean>(false);

    const handleBlindboxItemChange = (value: string) => {
        const item = blindboxItemsOptions.find((option) => option.value === value);
        setBlindboxItem(item);
    };

    const handleSaleBeginsChange = (value: string) => {
        const item = saleBeginsOptions.find((option) => option.value === value);
        setSaleBegins(item);
    };

    const handleSaleEndsChange = (value: string) => {
        const item = saleEndsOptions.find((option) => option.value === value);
        setSaleEnds(item);
    };

    const handleSortChange = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSort(item);
    };

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

    return (
        <>
            <Stack
                spacing={5}
                width={720}
                maxHeight={'60vh'}
                sx={{ overflowY: 'auto', overflowX: 'hidden' }}
                className={classes.container}
            >
                <Stack alignItems="center">
                    <PageNumberTypo>1 of 2</PageNumberTypo>
                    <DialogTitleTypo>Create Blind Box</DialogTitleTypo>
                </Stack>
                <Box>
                    <Grid container columnSpacing={4}>
                        <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
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
                            <CustomTextField
                                title="Author Description"
                                placeholder="Is WYSIWYG is needed here?"
                                multiline
                                rows={3}
                                changeHandler={(value: string) => setBlindboxAuthorDesc(value)}
                            />
                            <Stack spacing={1}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Blind Box Main Image
                                </Typography>
                                {/* <img
                                src="/assets/images/blindbox/blindbox-nft-template2.png"
                                style={{ borderRadius: '18px' }}
                                alt=""
                            /> */}
                                <UploadSingleFile
                                    file={stateFile}
                                    onDrop={handleFileChange}
                                    sx={{
                                        // width: '100%',
                                        // height: '112px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: '1rem',
                                        borderRadius: '2vw',
                                        background: '#E8F4FF',
                                        cursor: 'pointer',
                                    }}
                                />
                                <Stack direction="row" spacing={1}>
                                    <SecondaryButton
                                        fullWidth
                                        size="small"
                                        sx={{ background: '#FDEEEE', color: '#EB5757' }}
                                        onClick={() => {}}
                                    >
                                        <Icon
                                            icon="ph:trash"
                                            fontSize={20}
                                            style={{ marginBottom: 2, marginRight: 4 }}
                                            onClick={() => {}}
                                        />
                                        {`Delete`}
                                    </SecondaryButton>
                                    <SecondaryButton fullWidth size="small" onClick={() => {}}>
                                        <Icon
                                            icon="ph:pencil-simple"
                                            fontSize={20}
                                            style={{ marginBottom: 4, marginRight: 4 }}
                                        />
                                        {`Edit`}
                                    </SecondaryButton>
                                </Stack>
                            </Stack>
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Blind box items
                                </Typography>
                                <Select
                                    titlebox={
                                        <SelectBtn fullWidth isOpen={blindboxItemSelectOpen ? 1 : 0}>
                                            {blindboxItem ? blindboxItem.label : 'Add  NFT to blind box'}
                                            <Icon icon="ph:caret-down" className="arrow-icon" />
                                        </SelectBtn>
                                    }
                                    options={blindboxItemsOptions}
                                    isOpen={blindboxItemSelectOpen ? 1 : 0}
                                    setIsOpen={setBlindboxItemSelectOpen}
                                    handleClick={handleBlindboxItemChange}
                                />
                                <PrimaryButton fullWidth size="small" onClick={() => setSelectDlgOpened(true)}>
                                    Choose NFTs to add
                                </PrimaryButton>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
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
                            <CustomTextField
                                title="Number of copies"
                                placeholder="es. 1000"
                                changeHandler={(value: string) => setblindboxQuantity(parseInt(value))}
                            />
                            <ELAPriceInput title="Price" handleChange={setBlindboxPrice} />
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Begins
                                </Typography>
                                <Select
                                    titlebox={
                                        <SelectBtn fullWidth isOpen={saleBeginsSelectOpen ? 1 : 0}>
                                            {saleBegins ? saleBegins.label : 'Pick Date'}
                                            <Icon icon="ph:caret-down" className="arrow-icon" />
                                        </SelectBtn>
                                    }
                                    options={saleBeginsOptions}
                                    isOpen={saleBeginsSelectOpen ? 1 : 0}
                                    setIsOpen={setSaleBeginsSelectOpen}
                                    handleClick={handleSaleBeginsChange}
                                />
                            </Stack>
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sale Ends
                                </Typography>
                                <Select
                                    titlebox={
                                        <SelectBtn fullWidth isOpen={saleEndsSelectOpen ? 1 : 0}>
                                            {saleEnds ? saleEnds.label : 'Pick Date'}
                                            <Icon icon="ph:caret-down" className="arrow-icon" />
                                        </SelectBtn>
                                    }
                                    options={saleEndsOptions}
                                    isOpen={saleEndsSelectOpen ? 1 : 0}
                                    setIsOpen={setSaleEndsSelectOpen}
                                    handleClick={handleSaleEndsChange}
                                />
                            </Stack>
                            <CustomTextField
                                title="Number of favourites"
                                placeholder="es. 1000"
                                changeHandler={(value: string) => setBlindboxLikes(parseInt(value))}
                            />
                            <CustomTextField
                                title="Number of Views"
                                placeholder="es. 1000"
                                changeHandler={(value: string) => setBlindboxViews(parseInt(value))}
                            />
                            <CustomTextField
                                title="Max Num of Purchases"
                                placeholder="es. 1000"
                                changeHandler={(value: string) => setBlindboxPurchases(parseInt(value))}
                            />
                            <Stack spacing={0.5}>
                                <Typography fontSize={12} fontWeight={700}>
                                    Sort
                                </Typography>
                                <Select
                                    titlebox={
                                        <SelectBtn
                                            fullWidth
                                            isOpen={sortSelectOpen ? 1 : 0}
                                            sx={{ justifyContent: 'space-between' }}
                                        >
                                            <Icon icon="ph:sort-ascending" fontSize={20} />
                                            {sort ? sort.label : 'Select'}
                                            <Icon icon="ph:caret-down" className="arrow-icon" />
                                        </SelectBtn>
                                    }
                                    options={sortOptions}
                                    isOpen={sortSelectOpen ? 1 : 0}
                                    setIsOpen={setSortSelectOpen}
                                    handleClick={handleSortChange}
                                />
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
                                    blindboxAuthorDes !== '' &&
                                    blindboxImage !== null &&
                                    blindboxItem?.value !== '' &&
                                    blindboxQuantity > 0 &&
                                    blindboxPrice > 0 &&
                                    saleBegins?.value !== '' &&
                                    saleEnds?.value !== '' &&
                                    blindboxLikes > 0 &&
                                    blindboxViews > 0 &&
                                    blindboxPurchases > 0 &&
                                    sort?.value !== ''
                                ) {
                                    setDialogState({
                                        ...dialogState,
                                        createBlindBoxDlgStep: 1,
                                        crtBlindTitle: blindboxTitle,
                                        crtBlindDescription: blindboxDescription,
                                        crtBlindAuthorDescription: blindboxAuthorDes,
                                        crtBlindImage: blindboxImage,
                                        crtBlindStatus: blindboxStatus,
                                        crtBlindQuantity: blindboxQuantity,
                                        crtBlindPrice: blindboxPrice,
                                        crtBlindSaleBegin: saleBegins || { label: '', value: '' },
                                        crtBlindSaleEnd: saleEnds || { label: '', value: '' },
                                        crtBlindLikes: blindboxLikes,
                                        crtBlindViews: blindboxViews,
                                        crtBlindPurchases: blindboxPurchases,
                                        crtBlindSort: sort || { label: '', value: '' },
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
                <SearchBlindBoxItems onClose={() => setSelectDlgOpened(false)} />
            </ModalDialog>
        </>
    );
};

export default CreateBlindBox;
