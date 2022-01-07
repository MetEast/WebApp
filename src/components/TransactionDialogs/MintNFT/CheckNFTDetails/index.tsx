import React from 'react';
import { Stack, Typography, Grid } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { TitleTypo, LabelTypo } from './styles';
import WarningTypo from '../../components/WarningTypo';

export interface ComponentProps {}

const CheckNFTDetails: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Check NFT Details</DialogTitleTypo>
            </Stack>
            <Stack alignItems="center" paddingX={6} paddingY={4} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <Grid container>
                    <Grid item xs={6}>
                        <TitleTypo>Item</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>Nickname</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Collection</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>Collection Name</LabelTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <TitleTypo>Tx Fees</TitleTypo>
                    </Grid>
                    <Grid item xs={6}>
                        <LabelTypo>0.22 ELA</LabelTypo>
                    </Grid>
                </Grid>
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: 0.22 ELA
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <SecondaryButton fullWidth>Close</SecondaryButton>
                    <PrimaryButton fullWidth>Confirm</PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default CheckNFTDetails;
