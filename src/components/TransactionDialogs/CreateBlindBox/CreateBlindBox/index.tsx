import React, { useState } from 'react';
import { Stack, Typography, Grid, Box } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import Select from '../../components/Select';
import WarningTypo from '../../components/WarningTypo';
import { Icon } from '@iconify/react';
import { TypeSelectItem } from 'src/types/select-types';
import ELAPriceInput from '../../components/ELAPriceInput';

export interface ComponentProps {}

const CreateBlindBox: React.FC<ComponentProps> = (): JSX.Element => {
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

    const [blindboxItem, setBlindboxItem] = useState<TypeSelectItem>();
    const [blindboxStatus, setBlindboxStatus] = useState<'offline' | 'online'>('offline');
    const [saleBegins, setSaleBegins] = useState<TypeSelectItem>();
    const [saleEnds, setSaleEnds] = useState<TypeSelectItem>();

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

    return (
        <Stack spacing={5} width={700} maxHeight={'60vh'} sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <Stack alignItems="center">
                <PageNumberTypo>1 of 2</PageNumberTypo>
                <DialogTitleTypo>Create Blind Box</DialogTitleTypo>
            </Stack>
            <Box>
                <Grid container columnSpacing={4}>
                    <Grid item xs={6} display="flex" flexDirection="column" rowGap={3}>
                        <CustomTextField title="Blind Box Title" placeholder="Enter Blind Box Title" />
                        <CustomTextField
                            title="Blind Box Description"
                            placeholder="Is WYSIWYG is needed here?"
                            multiline
                            rows={3}
                        />
                        <CustomTextField
                            title="Author Description"
                            placeholder="Is WYSIWYG is needed here?"
                            multiline
                            rows={3}
                        />
                        <Stack spacing={1}>
                            <Typography fontSize={12} fontWeight={700}>
                                Blind Box Main Image
                            </Typography>
                            <img
                                src="/assets/images/blindbox/blindbox-nft-template2.png"
                                style={{ borderRadius: '18px' }}
                                alt=""
                            />
                            <Stack direction="row" spacing={1}>
                                <SecondaryButton
                                    fullWidth
                                    size="small"
                                    sx={{ background: '#FDEEEE', color: '#EB5757' }}
                                >
                                    <Icon icon="ph:trash" fontSize={20} style={{ marginBottom: 2, marginRight: 4 }} />
                                    {`Delete`}
                                </SecondaryButton>
                                <SecondaryButton fullWidth size="small">
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
                                options={blindboxItemsOptions}
                                selected={blindboxItem}
                                placeholder="Add  NFT to blind box"
                                handleClick={handleBlindboxItemChange}
                            />
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
                        <CustomTextField title="Number of copies" placeholder="es. 1000" />
                        <ELAPriceInput title="Price" />
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Sale Begins
                            </Typography>
                            <Select
                                options={saleBeginsOptions}
                                selected={saleBegins}
                                placeholder="Pick Date"
                                handleClick={handleSaleBeginsChange}
                            />
                        </Stack>
                        <Stack spacing={0.5}>
                            <Typography fontSize={12} fontWeight={700}>
                                Sale Ends
                            </Typography>
                            <Select
                                options={saleEndsOptions}
                                selected={saleEnds}
                                placeholder="Pick Date"
                                handleClick={handleSaleEndsChange}
                            />
                        </Stack>
                        <CustomTextField title="Number of favourites" placeholder="es. 1000" />
                        <CustomTextField title="Number of Views" placeholder="es. 1000" />
                        <CustomTextField title="Max Num of Purchases" placeholder="es. 1000" />
                    </Grid>
                </Grid>
            </Box>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 0.22 ELA
                </Typography>
                <Stack width="100%" direction="row" spacing={2}>
                    <SecondaryButton fullWidth>Back</SecondaryButton>
                    <PrimaryButton fullWidth>Confirm</PrimaryButton>
                </Stack>
                <WarningTypo width={260}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default CreateBlindBox;
