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
import Select from 'src/components/Select';
import { useStyles, SelectBtn } from './styles';
import { Icon } from '@iconify/react';
import { mintNFTCategoryOptions } from 'src/constants/select-constants';

export interface ComponentProps {}

const MintNFT: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [category, setCategory] = useState<TypeSelectItem>(dialogState.mintCategory);
    const [categoryError, setCategoryError] = useState(false);
    const [categorySelectOpen, setCategorySelectOpen] = useState(false);
    const [title, setTitle] = useState<string>(dialogState.mintTitle);
    const [titleError, setTitleError] = useState(false);
    const [introduction, setIntroduction] = useState<string>(dialogState.mintIntroduction);
    const [introductionError, setIntroductionError] = useState(false);
    const [mintFile, setMintFile] = useState<File>(dialogState.mintFile);
    const [mintFileError, setMintFileError] = useState(false);
    const [stateFile, setStateFile] = useState(
        dialogState.mintTitle === ''
            ? null
            : { raw: dialogState.mintFile, preview: URL.createObjectURL(dialogState.mintFile) },
    );
    const [royalties, setRoyalties] = useState<number>(
        dialogState.mintRoyalties === -1 ? 10 : dialogState.mintRoyalties,
    );
    const [royaltiesError, setRoyaltiesError] = useState(false);

    const handleFileChange = (files: Array<File>) => {
        if (files === null || files.length === 0) return;

        const file = files[0];
        if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif') return;

        handleDropSingleFile(file);

        setMintFile(file);
        setMintFileError(false);
    };

    const handleDropSingleFile = useCallback((file) => {
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
                <DialogTitleTypo>Create NFT</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4} rowGap={3}>
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column">
                        <CustomTextField
                            title="Project Title"
                            inputValue={title}
                            placeholder="Enter Title"
                            error={titleError}
                            errorText="Project title can not be empty."
                            changeHandler={(value: string) => setTitle(value)}
                        />
                        <CustomTextField
                            title="Project Introduction"
                            inputValue={introduction}
                            placeholder="Enter Introduction"
                            limit={450}
                            multiline
                            rows={3}
                            error={introductionError}
                            errorText="Project introduction can not be empty."
                            sx={{ marginTop: 3 }}
                            changeHandler={(value: string) => setIntroduction(value)}
                        />
                        <Stack spacing={0.5} marginTop={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Category
                            </Typography>
                            <Select
                                titlebox={
                                    <SelectBtn fullWidth isopen={categorySelectOpen ? 1 : 0}>
                                        {!!category.label ? (
                                            <>
                                                {category.icon && (
                                                    <Icon
                                                        icon={category.icon}
                                                        fontSize={16}
                                                        style={{ marginRight: 4 }}
                                                    />
                                                )}
                                                {category.label}
                                            </>
                                        ) : (
                                            'Select'
                                        )}
                                        <Icon icon="ph:caret-down" className="arrow-icon" />
                                    </SelectBtn>
                                }
                                selectedItem={category}
                                options={mintNFTCategoryOptions}
                                isOpen={categorySelectOpen ? 1 : 0}
                                error={categoryError}
                                errorText="Category should be selected."
                                handleClick={(value: string) => {
                                    const item = mintNFTCategoryOptions.find((option) => option.value === value);
                                    setCategory(item || { label: '', value: '' });
                                    setCategoryError(false);
                                }}
                                setIsOpen={setCategorySelectOpen}
                            />
                        </Stack>
                        <RoyaltyInput
                            title="Royalties"
                            inputValue={royalties.toString()}
                            placeholder="10"
                            error={royaltiesError}
                            errorText="Royalties should be between 0 and 30."
                            sx={{ marginTop: 3 }}
                            handleChange={(value: string) => {
                                setRoyalties(parseFloat(value));
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack height="100%" spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Source File
                            </Typography>
                            <UploadSingleFile
                                file={stateFile}
                                onDrop={handleFileChange}
                                sx={{
                                    width: '100%',
                                    height: { xs: '240px', sm: '100%' },
                                    marginTop: '1rem',
                                    borderRadius: '8px',
                                    background: stateFile === null ? '#E8F4FF' : 'transparent',
                                    cursor: 'pointer',
                                    boxSizing: 'border-box',
                                    border: mintFileError ? '2px solid #EB5757' : 'none',
                                }}
                            />
                            {mintFileError && (
                                <Typography fontSize={12} fontWeight={500} color="#EB5757">
                                    Source file should be selected.
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
                                mintTitle: '',
                                mintIntroduction: '',
                                mintCategory: { label: '', value: '' },
                                mintFile: new File([''], ''),
                                mintRoyalties: -1,
                                // mintTxFee: 0,
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
                                category !== undefined &&
                                category.label !== '' &&
                                category.value !== '' &&
                                mintFile !== null &&
                                stateFile !== null &&
                                royalties >= 0 &&
                                royalties <= 30 &&
                                isNaN(royalties) !== true
                            ) {
                                setDialogState({
                                    ...dialogState,
                                    mintTitle: title,
                                    mintIntroduction: introduction,
                                    mintCategory: category || { label: '', value: '' },
                                    mintFile: mintFile,
                                    mintRoyalties: royalties,
                                    createNFTDlgOpened: true,
                                    createNFTDlgStep: 1,
                                });
                            } else {
                                setTitleError(title === '');
                                setIntroductionError(introduction === '');
                                setRoyaltiesError(isNaN(royalties) || royalties < 0 || royalties > 30);
                                setCategoryError(category.label === '' && category.value === '');
                                setMintFileError(stateFile === null);
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
    );
};

export default MintNFT;
