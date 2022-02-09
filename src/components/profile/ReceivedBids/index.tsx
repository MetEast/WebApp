import React, { useState } from 'react';
import { Stack, Grid, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { TypeSelectItem } from 'src/types/select-types';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import Select from 'src/components/Select';
import { SelectTitleBtn } from './styles';
import { Icon } from '@iconify/react';

export interface ComponentProps {}

const ReceivedBids: React.FC<ComponentProps> = (): JSX.Element => {
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

    const receivedBidsList = [
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
        { user: 'Nickname', date: '2022/02/28  10:00', price: 199 },
    ];

    const [sortby, setSortby] = useState<TypeSelectItem>();
    const [sortBySelectOpen, isSortBySelectOpen] = useState(false);
    const handleSortbyChange = (value: string) => {
        const item = sortbyOptions.find((option) => option.value === value);
        setSortby(item);
    };

    return (
        <Stack spacing={5} width={520}>
            <Stack direction="row" justifyContent="space-between">
                <DialogTitleTypo>Received bids</DialogTitleTypo>
                <Select
                    titlebox={
                        <SelectTitleBtn fullWidth isOpen={sortBySelectOpen ? 1 : 0}>
                            <Icon icon="ph:sort-ascending" fontSize={20} />
                            {sortby ? sortby.label : 'Sort by'}
                            <Icon icon="ph:caret-down" className="arrow-icon" style={{ marginBottom: 2 }} />
                        </SelectTitleBtn>
                    }
                    options={sortbyOptions}
                    isOpen={sortBySelectOpen ? 1 : 0}
                    setIsOpen={isSortBySelectOpen}
                    handleClick={handleSortbyChange}
                    width={160}
                />
            </Stack>
            <Stack spacing={3}>
                <Box>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                User
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Date
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography fontSize={14} fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Price
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container marginTop={2.5} rowGap={3} alignItems="center">
                        {receivedBidsList.map((item, index) => (
                            <>
                                <Grid item xs={3}>
                                    <Typography fontSize={16} fontWeight={700}>
                                        {item.user}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography fontSize={12} fontWeight={500}>
                                        {item.date}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <ELAPrice price_ela={item.price} price_ela_fontsize={14} />
                                </Grid>
                                <Grid item xs={3} display="flex" flexDirection="row" justifyContent="flex-end">
                                    <SecondaryButton
                                        size="small"
                                        sx={{
                                            height: 32,
                                            fontSize: 14,
                                            paddingX: 2,
                                            paddingTop: '12px',
                                            paddingBottom: '10px',
                                        }}
                                    >
                                        Accept
                                    </SecondaryButton>
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

export default ReceivedBids;
