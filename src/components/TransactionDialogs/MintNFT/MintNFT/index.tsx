import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import Select from '../../components/Select';
import WarningTypo from '../../components/WarningTypo';
import { Icon } from '@iconify/react';
import { TypeSelectItem } from 'src/types/select-types';
import { useDialogContext } from 'src/context/DialogContext';

export interface ComponentProps {}

const MintNFT: React.FC<ComponentProps> = (): JSX.Element => {
    const categoryOptions: Array<TypeSelectItem> = [
        {
            label: 'Category1',
            value: 'Category1',
        },
        {
            label: 'Category2',
            value: 'Category2',
        },
        {
            label: 'Category3',
            value: 'Category3',
        },
        {
            label: 'Category4',
            value: 'Category4',
        },
        {
            label: 'Category5',
            value: 'Category5',
        },
    ];
    const [category, setCategory] = useState<TypeSelectItem>();

    const handleCategoryChange = (value: string) => {
        const item = categoryOptions.find((option) => option.value === value);
        setCategory(item);
    };
    const [dialogState, setDialogState] = useDialogContext();

    return (
        <Stack spacing={5} width={700}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Mint NFT</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <CustomTextField title="Project Title" placeholder="Placeholder Text" />
                        <CustomTextField
                            title="Project Introduction"
                            placeholder="Enter Introduction"
                            multiline
                            rows={3}
                        />
                        <Box>
                            <Typography fontSize={12} fontWeight={700}>
                                Source File
                            </Typography>
                            <Stack
                                width="100%"
                                height={112}
                                justifyContent="center"
                                alignItems="center"
                                marginTop={1}
                                borderRadius={2}
                                sx={{ background: '#E8F4FF', cursor: 'pointer' }}
                            >
                                <Icon icon="ph:cloud-arrow-up" fontSize={24} color="#1890FF" />
                                <Typography fontSize={14} fontWeight={500} color="#1890FF">
                                    Upload Image
                                </Typography>
                            </Stack>
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
                        />
                    </Grid>
                </Grid>
            </Box>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 0.22 ELA
                </Typography>
                <Stack width="100%" direction="row" spacing={2}>
                    <SecondaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({ ...dialogState, createNFTDlgOpened: false });
                        }}
                    >
                        close
                    </SecondaryButton>
                    <PrimaryButton
                        fullWidth
                        onClick={() => {
                            setDialogState({ ...dialogState, createNFTDlgStep: 1 });
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
