import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { TitleTypo, LabelTypo } from './styles';
import WarningTypo from '../../components/WarningTypo';

export interface ComponentProps {}

const OrderSummary: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Order Summary</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container width={200}>
                    <Grid item xs={6}>
                        <TitleTypo>Item</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>Product Title</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Unit Price</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>25.00 ELA</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Amount</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>2</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Subtotal</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>50.00 ELA</LabelTypo>
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
                        <LabelTypo>50.12 ELA</LabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 0.22 ELA
                </Typography>
                <Stack direction="row" spacing={2}>
                    <SecondaryButton sx={{ width: 152 }}>Back</SecondaryButton>
                    <PrimaryButton sx={{ width: 152 }}>Confirm</PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default OrderSummary;
