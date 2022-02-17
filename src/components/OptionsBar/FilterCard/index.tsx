import React, { useState } from 'react';
import { Grid, Stack, Typography, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { Container, StatusButton } from './styles';
import CustomTextField from 'src/components/TextField';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';

interface ComponentProps {}

const statusButtons = [
    { title: 'Buy Now', icon: 'ph:lightning' },
    { title: 'ON auction', icon: 'ph:scales' },
    { title: 'Is new', icon: 'ph:lightning' },
    { title: 'Has Bids', icon: 'ph:ticket' },
];

const FilterCard: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Container alignItems="flex-start" width={300}>
            <Typography fontSize={32} fontWeight={700} sx={{ textTransform: 'none' }}>
                Filters
            </Typography>
            <Typography fontSize={16} fontWeight={700} marginTop={3} sx={{ textTransform: 'uppercase' }}>
                Status
            </Typography>
            <Grid container rowGap={1} marginTop={1}>
                {statusButtons.map((item) => (
                    <Grid item xs={6}>
                        <StatusButton size="small">
                            <Icon icon={item.icon} style={{ marginBottom: 2, marginRight: 4 }} />
                            {item.title}
                        </StatusButton>
                    </Grid>
                ))}
            </Grid>
            <Typography fontSize={16} fontWeight={700} marginTop={2} sx={{ textTransform: 'uppercase' }}>
                price Range
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
                <CustomTextField placeholder="Min" />
                <Typography fontSize={14} fontWeight={400}>
                    to
                </Typography>
                <CustomTextField placeholder="Max" />
            </Stack>
            <SecondaryButton
                size="small"
                sx={{ width: 142, background: 'transparent', marginTop: 3, alignSelf: 'center' }}
            >
                Clear all
            </SecondaryButton>
            <Stack direction="row" alignItems="center" width="100%" spacing={1} marginTop={2}>
                <SecondaryButton fullWidth>close</SecondaryButton>
                <PrimaryButton fullWidth>apply</PrimaryButton>
            </Stack>
        </Container>
    );
};

export default FilterCard;
