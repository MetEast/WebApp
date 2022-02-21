import React, { useState, useCallback } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import RoyaltyInput from '../../components/RoyaltyInput';
import WarningTypo from '../../components/WarningTypo';
import { TypeSelectItem } from 'src/types/select-types';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import UploadSingleFile from 'src/components/Upload/UploadSingleFile';
import { useSnackbar } from 'notistack';
import Select from 'src/components/Select';
import { useStyles, SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { mintNFTCategoryOptions } from 'src/constants/select-constants';

export interface ComponentProps {}

const MintNFT: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [category, setCategory] = useState<TypeSelectItem>();
    const [categorySelectOpen, setCategorySelectOpen] = useState(false);
    const [title, setTitle] = useState<string>('');
    const [introduction, setIntroduction] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [mintFile, setMintFile] = useState<File>();
    const [stateFile, setStateFile] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const handleFileChange = (files: Array<File>) => {
        handleDropSingleFile(files);
        if (files !== null && files.length > 0) {
            setMintFile(files[0]);
        }
    };

    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStateFile({ ...file, preview: URL.createObjectURL(file) });
        }
    }, []);

    const classes = useStyles();

    return (
        <Stack
            spacing={5}
            minWidth={{ xs: 360, sm: 580, md: 700 }}
            paddingRight={{ xs: 2, sm: 0 }}
            marginRight={{ xs: -5, sm: 0 }}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            className={classes.container}
        >
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Mint NFT</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={3}>
                        <CustomTextField
                            title="Project Title"
                            placeholder="Placeholder Text"
                            changeHandler={(value: string) => setTitle(value)}
                        />
                        <CustomTextField
                            title="Project Introduction"
                            placeholder="Enter Introduction"
                            multiline
                            rows={3}
                            changeHandler={(value: string) => setIntroduction(value)}
                        />
                        <Box>
                            <Typography fontSize={12} fontWeight={700}>
                                Source File
                            </Typography>
                            <UploadSingleFile
                                file={stateFile}
                                onDrop={handleFileChange}
                                sx={{
                                    width: '100%',
                                    height: '112px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '1rem',
                                    borderRadius: '2vw',
                                    background: '#E8F4FF',
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Category
                            </Typography>
                            <Select
                                titlebox={
                                    <SelectBtn fullWidth isOpen={categorySelectOpen ? 1 : 0}>
                                        {category ? category.label : 'Select'}
                                        <Icon icon="ph:caret-down" className="arrow-icon" />
                                    </SelectBtn>
                                }
                                options={mintNFTCategoryOptions}
                                isOpen={categorySelectOpen ? 1 : 0}
                                handleClick={(value: string) => {
                                    const item = mintNFTCategoryOptions.find((option) => option.value === value);
                                    setCategory(item);
                                }}
                                setIsOpen={setCategorySelectOpen}
                            />
                        </Stack>
                        <CustomTextField
                            title="About the author"
                            placeholder="Enter author introduction"
                            multiline
                            rows={3}
                            changeHandler={(value: string) => setAuthor(value)}
                        />
                        <RoyaltyInput title="Royalties" placeholder="5" />
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
                                mintTitle: '',
                                mintAuthor: '',
                                mintIntroduction: '',
                                mintCategory: { label: '', value: '' },
                                mintFile: new File([''], ''),
                                mintTXFee: 0,
                                createNFTDlgOpened: false,
                            });
                        }}
                    >
                        close
                    </SecondaryButton>
                    <PrimaryButton
                        fullWidth
                        onClick={() => {
                            if (
                                title !== '' &&
                                introduction !== '' &&
                                author !== '' &&
                                category !== undefined &&
                                category.label !== '' &&
                                category.value !== '' &&
                                mintFile !== null &&
                                stateFile !== null
                            ) {
                                setDialogState({
                                    ...dialogState,
                                    mintTitle: title,
                                    mintAuthor: author,
                                    mintIntroduction: introduction,
                                    mintCategory: category || { label: '', value: '' },
                                    mintFile: mintFile,
                                    createNFTDlgOpened: true,
                                    createNFTDlgStep: 1,
                                });
                            } else
                                enqueueSnackbar('Form validation failed!', {
                                    variant: 'warning',
                                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                                });
                        }}
                    >
                        Next
                    </PrimaryButton>
                </Stack>
                <WarningTypo width={260}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default MintNFT;
