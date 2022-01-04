import React from 'react';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductBadgeContainer from 'src/components/ProductBadgeContainer';
import { enmSaleStatus } from 'src/types/product-types';
import { Icon } from '@iconify/react';
import ProductImageContainer from 'src/components/ProductImageContainer';

const SingleNFTFixedPrice: React.FC = (): JSX.Element => {
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl={'/assets/images/explore/singlenft-template1.png'} />
                </Grid>
            </Grid>
        </>
    );
};

export default SingleNFTFixedPrice;
