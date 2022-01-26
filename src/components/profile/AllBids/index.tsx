import React from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { TypeSelectItem } from 'src/types/select-types';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from '../Select';

export interface ComponentProps {}

const AllBids: React.FC<ComponentProps> = (): JSX.Element => {
    const sortbyOptions: Array<TypeSelectItem> = [
        {
            label: 'Option1',
            value: 'Option1',
        },
        {
            label: 'Option2',
            value: 'Option2',
        },
        {
            label: 'Option3',
            value: 'Option3',
        },
    ];

    const allBidsList = [
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
    ];

    const [sortby, setSortby] = React.useState<TypeSelectItem>();
    const handleSortbyChange = (value: string) => {
        const item = sortbyOptions.find((option) => option.value === value);
        setSortby(item);
    };

    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>All Bids</DialogTitleTypo>
                <Select
                    options={sortbyOptions}
                    selected={sortby}
                    placeholder="Sort by"
                    handleClick={handleSortbyChange}
                    width={160}
                />
            </Stack>
            <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack>
                        <Typography fontSize={16} fontWeight={700}>
                            Your Bid
                        </Typography>
                        <Typography fontSize={14} fontWeight={400}>
                            2022/02/28 10:00
                        </Typography>
                    </Stack>
                    <ELAPrice price_ela={199} />
                </Stack>
                <Stack direction="row" spacing={1}>
                    <PrimaryButton
                        fullWidth
                        size="small"
                        sx={{ background: '#FDEEEE', color: '#EB5757', '&:hover': { background: '#FFDEDE' } }}
                    >
                        Cancel Bid
                    </PrimaryButton>
                    <PrimaryButton fullWidth size="small">
                        Update bid
                    </PrimaryButton>
                </Stack>
                <Box>
                    <Grid container>
                        <Grid item xs={4}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                User
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Date
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Price
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                        {allBidsList.map((item, index) => (
                            <>
                                <Grid item xs={4}>
                                    <Typography fontSize={16} fontWeight={700}>
                                        {item.user}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography fontSize={12} fontWeight={500}>
                                        {item.date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <ELAPrice price_ela={item.price} />
                                </Grid>
                            </>
                        ))}
                    </Grid>
                </Box>
            </Stack>
            <SecondaryButton fullWidth>Close</SecondaryButton>
        </Stack>
    );
};

export default AllBids;
