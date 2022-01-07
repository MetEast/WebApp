import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { TitleTypo, LabelTypo } from './styles';
import WarningTypo from '../../components/WarningTypo';

export interface ComponentProps {}

const ReviewBidDetails: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Review Bid Details</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container rowSpacing={0.5}>
                    <Grid item xs={6}>
                        <TitleTypo>Item</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>Product Title</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Bid Amount</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>25.00 ELA</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Expires in</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>7 days</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Tx Fees</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>0.22 ELA</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Total</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo sx={{ fontWeight: 700 }}>50.00 ELA</LabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 0.22 ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton fullWidth>Back</SecondaryButton>
                    <PrimaryButton fullWidth>Confirm</PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default ReviewBidDetails;
