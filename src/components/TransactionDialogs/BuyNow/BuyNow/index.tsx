import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';

export interface ComponentProps {}

const BuyNow: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>Buy Now</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container rowSpacing={0.5}>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Item</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>Product Title</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>86.00 ELA</DetailedInfoLabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoTitleTypo>Tx Fees</DetailedInfoTitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <DetailedInfoLabelTypo>0.22 ELA</DetailedInfoLabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 0.22 ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton fullWidth>close</SecondaryButton>
                    <PrimaryButton fullWidth>Confirm</PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default BuyNow;
