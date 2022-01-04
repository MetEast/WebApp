import React from 'react';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { enumBadgeType } from 'src/types/product-types';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import SingleNFTTransactionTable from 'src/components/SingleNFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { singleNFTTransactions } from 'src/constants/dummyData';
import { TypeSingleNFTTransaction } from 'src/types/product-types';

const SingleNFTFixedPrice: React.FC = (): JSX.Element => {
    const transactionsList: Array<TypeSingleNFTTransaction> = singleNFTTransactions;

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl={'/assets/images/explore/singlenft-template1.png'} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets sold={24} instock={200} likes={88} views={4800} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.BuyNow} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    <ELAPrice ela_price={199} usd_price={480} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>buy now</PrimaryButton>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <SingleNFTTransactionTable transactionsList={transactionsList} />
                </Grid>
                <Grid item xs={6}>
                    <PriceHistoryView />
                </Grid>
            </Grid>
        </>
    );
};

export default SingleNFTFixedPrice;
