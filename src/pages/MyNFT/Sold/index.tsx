import React from 'react';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { Stack, Grid, Typography } from '@mui/material';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType, enumSingleNFTType, TypeNewProduct } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';

const MyNFTSold: React.FC = (): JSX.Element => {
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl="/assets/images/mynft/mynft-template4.png" />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets nickname="Nickname" likes={88} views={4800} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Sold} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    <ELAPrice ela_price={199} usd_price={480} marginTop={3} />
                </Grid>
            </Grid>
        </>
    );
};

export default MyNFTSold;
