import React from 'react';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import SaleStatusBadge from 'src/components/SaleStatusBadge';
import { ProductImageContainer, LikeBtn, BuyNowBtn } from './styles';
import { enmSaleStatus } from 'src/types/product-types';
import { Icon } from '@iconify/react';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer>
                        <img src={'/assets/images/blindbox/blindbox-nft-template2.png'} alt="" />
                        <LikeBtn>
                            <img src="/assets/icons/like.svg" alt="" />
                        </LikeBtn>
                    </ProductImageContainer>
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        Sculpting with the Heart
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:handshake" />
                            <Typography fontWeight={500} fontSize={12}>
                                24 Sold
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:storefront" />
                            <Typography fontWeight={500} fontSize={12}>
                                200 In Stock
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:heart" />
                            <Typography fontWeight={500} fontSize={12}>
                                88 likes
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Icon icon="ph:eye" />
                            <Typography fontWeight={500} fontSize={12}>
                                4800 Views
                            </Typography>
                        </Stack>
                    </Stack>
                    <SaleStatusBadge saleStatus={enmSaleStatus.ComingSoon} content="2022/02/28  10:00" marginTop={3} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <img src="/assets/icons/elatos-ela.svg" alt="" />
                        <Typography fontSize={20} fontWeight={500}>
                            199.00 ELA
                        </Typography>
                        <Typography fontSize={12} fontWeight={400}>
                            ~$480.00
                        </Typography>
                    </Stack>
                    <BuyNowBtn sx={{ marginTop: 3, width: '100%' }}>buy now</BuyNowBtn>
                </Grid>
            </Grid>
            <Box marginTop={5}>
                <img src="" alt="Blind Box Introduction"></img>
            </Box>
        </>
    );
};

export default BlindBoxProduct;
