import React from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo, PageNumberTypo, DetailedInfoTitleTypo, DetailedInfoLabelTypo } from '../../styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../components/WarningTypo';
import ELAPrice from 'src/components/ELAPrice';
import { useStyles, InfoItemWrapper } from './styles';

export interface ComponentProps {}

const CheckBlindBoxDetails: React.FC<ComponentProps> = (): JSX.Element => {
    const classes = useStyles();

    return (
        <Stack
            spacing={5}
            width={400}
            maxHeight={'60vh'}
            sx={{ overflowY: 'auto', overflowX: 'hidden' }}
            className={classes.container}
        >
            <Stack alignItems="center">
                <PageNumberTypo>2 of 2</PageNumberTypo>
                <DialogTitleTypo>Check Blind Box Details</DialogTitleTypo>
            </Stack>
            <Stack paddingX={6} paddingY={4} spacing={1} borderRadius={4} sx={{ background: '#F0F1F2' }}>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Title</DetailedInfoTitleTypo>
                    <Typography fontSize={20} fontWeight={500}>
                        Blind Box Title
                    </Typography>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Status</DetailedInfoTitleTypo>
                    <Typography
                        fontSize={14}
                        fontWeight={500}
                        sx={{
                            display: 'inline-block',
                            background: '#C9F5DC',
                            paddingX: 1,
                            paddingY: 0.5,
                            borderRadius: 2,
                        }}
                    >
                        Online
                    </Typography>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo># Of Copies</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>2000</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Price</DetailedInfoTitleTypo>
                    <ELAPrice ela_price={199} />
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Sale Begins</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>2022-06-18 08:50:00</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Sale Ends</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>2022-06-18 08:50:00</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Max num of purchases</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo>600</DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Description</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo textAlign="right">
                        Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet.
                    </DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Author Description</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo textAlign="right">
                        Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet.
                    </DetailedInfoLabelTypo>
                </InfoItemWrapper>
                <InfoItemWrapper>
                    <DetailedInfoTitleTypo>Items</DetailedInfoTitleTypo>
                    <DetailedInfoLabelTypo textAlign="right">
                        Item Name, Item Name, Item Name, Item Name, Item Name, Item Name
                    </DetailedInfoLabelTypo>
                </InfoItemWrapper>
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

export default CheckBlindBoxDetails;
