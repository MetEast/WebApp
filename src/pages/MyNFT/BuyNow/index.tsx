import React from 'react';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType } from 'src/types/product-types';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, CancelSaleButton } from 'src/components/Buttons/styles';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import SingleNFTTransactionTable from 'src/components/SingleNFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { TypeSingleNFTTransaction, TypeSingleNFTBid } from 'src/types/product-types';
import { singleNFTTransactions, singleNFTBids } from 'src/constants/dummyData';

const MyNFTBuyNow: React.FC = (): JSX.Element => {
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl={'/assets/images/mynft/mynft-template2.png'} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets sold={24} instock={200} likes={88} views={4800} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.ForSale} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    <ELAPrice ela_price={199} usd_price={480} marginTop={3} />
                    <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                        <CancelSaleButton sx={{ width: '100%' }}>Cancel Sale</CancelSaleButton>
                        <PrimaryButton sx={{ width: '100%' }}>Buy Now</PrimaryButton>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default MyNFTBuyNow;
