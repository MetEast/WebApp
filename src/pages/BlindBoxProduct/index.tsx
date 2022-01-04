import React from 'react';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { BuyNowBtn } from './styles';
import { enumBadgeType } from 'src/types/product-types';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl={'/assets/images/blindbox/blindbox-nft-template2.png'} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets sold={24} instock={200} likes={88} views={4800} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.ComingSoon} content="2022/02/28 10:00" />
                    </Stack>
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
