import React, { useState, useCallback } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import Select from '../../components/Select';
import WarningTypo from '../../components/WarningTypo';
import { TypeSelectItem } from 'src/types/select-types';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeMintInputForm } from 'src/types/mint-types';
import UploadSingleFile from 'src/components/Upload/UploadSingleFile';
import { useSnackbar } from 'notistack';


export interface ComponentProps {
    inputData: TypeMintInputForm;
    setInputData: (value: TypeMintInputForm) => void;
    txFee: number;
}

const MintNFT: React.FC<ComponentProps> = ({inputData, setInputData, txFee}): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    const categoryOptions: Array<TypeSelectItem> = [
        {
            label: 'Original',
            value: 'Original',
        },
        {
            label: 'Museum',
            value: 'Museum',
        },
        {
            label: 'Arts',
            value: 'Arts',
        },
        {
            label: 'Sports',
            value: 'Sports',
        },
        {
            label: 'Dimension',
            value: 'Dimension',
        },
        {
            label: 'Pets',
            value: 'Pets',
        },
        {
            label: 'Recreation',
            value: 'Recreation',
        },
        {
            label: 'Star',
            value: 'Star',
        },
        {
            label: 'Other',
            value: 'Other',
        }
    ];

    const [category, setCategory] = useState<TypeSelectItem>();
    const [title, setTitle] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [author, setAuthor] = useState<string>("");
    const [stateFile, setStateFile] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const defaultValue: TypeMintInputForm = {
        name: '',
        description: '',
        author: '',
        category: { label: '', value: '' },
        file: new File([""], "")
    };

    const handleCategoryChange = (value: string) => {
        const item = categoryOptions.find((option) => option.value === value);
        setCategory(item);
        if (item !== undefined) {
            let tempFormData: TypeMintInputForm = {...inputData}; 
            tempFormData.category = item;
            setInputData(tempFormData);
        }
    };

    const handleNameChange = (value: string) => {
        setTitle(value);
        let tempFormData: TypeMintInputForm = {...inputData}; 
        tempFormData.name = value;
        setInputData(tempFormData);
    };

    const handleDescriptionChange = (value: string) => {
        setIntroduction(value);
        let tempFormData: TypeMintInputForm = {...inputData}; 
        tempFormData.description = value;
        setInputData(tempFormData);
    };

    const handleAuthorChange = (value: string) => {
        setAuthor(value);
        let tempFormData: TypeMintInputForm = {...inputData}; 
        tempFormData.author = value;
        setInputData(tempFormData);
    };
    
    const handleFileChange = (files: Array<File>) => {
        handleDropSingleFile(files);
        if (files !== null && files.length > 0) {
            let tempFormData: TypeMintInputForm = {...inputData}; 
            tempFormData.file = files[0];
            setInputData(tempFormData);
        }
    }

    const handleDropSingleFile = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setStateFile({...file, preview: URL.createObjectURL(file)});
        }
    }, []);

    return (
        <Stack spacing={5} width={700}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Mint NFT</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <CustomTextField title="Project Title" placeholder="Placeholder Text" changeHandler={(value: string) => {handleNameChange(value)}} />
                        <CustomTextField
                            title="Project Introduction"
                            placeholder="Enter Introduction"
                            multiline
                            rows={3}
                            changeHandler={(value: string) => handleDescriptionChange(value)}                       
                        />
                        <Box>
                            <Typography fontSize={12} fontWeight={700}>
                                Source File
                            </Typography>
                            <UploadSingleFile 
                                file={stateFile} 
                                onDrop={handleFileChange}
                                sx={{ 
                                    width: "100%",
                                    height: "112px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "1rem",
                                    borderRadius: "2vw",
                                    background: '#E8F4FF', 
                                    cursor: 'pointer' 
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Category
                            </Typography>
                            <Select
                                options={categoryOptions}
                                selected={category}
                                placeholder="Select"
                                handleClick={handleCategoryChange}
                            />
                        </Stack>
                        <CustomTextField
                            title="About the author"
                            placeholder="Enter author introduction"
                            multiline
                            rows={3}
                            changeHandler={(value: string) => handleAuthorChange(value)}                       
                        />
                    </Grid>
                </Grid>
            </Box>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {txFee} ELA
                </Typography>
                <Stack width="100%" direction="row" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setInputData(defaultValue);
                            setDialogState({ ...dialogState, createNFTDlgOpened: false });
                        }}
                    >
                        close
                    </SecondaryButton>
                    <PrimaryButton
                        fullWidth
                        onClick={() => {
                            if (title !== "" && introduction !== "" && author !== "" && category !== undefined && category.label !== "" && category.value !== "" && stateFile !== null) {
                                setDialogState({ ...dialogState, createNFTDlgStep: 1 });
                            }
                            else enqueueSnackbar('Form validation failed!', { variant: "warning", anchorOrigin: {horizontal: "right", vertical: "top"} });
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
