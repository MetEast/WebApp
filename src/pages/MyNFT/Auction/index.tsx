import React from 'react';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType } from 'src/types/product-types';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, CancelSaleButton, SecondaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import PriceHistoryView from 'src/components/PriceHistoryView';
import ProductTransHistory from 'src/components/ProductTransHistory';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import { nftTransactions } from 'src/constants/dummyData';

const MyNFTAuction: React.FC = (): JSX.Element => {
    const transactionsList = nftTransactions;

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
                    <ProductSnippets nickname="Nickname" likes={88} views={4800} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.OnAuction} />
                        <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                        <ProductBadge badgeType={enumBadgeType.SaleEnds} content={`2022/02/28  10:00`} />
                    </Stack>
                    <ELAPrice ela_price={199} usd_price={480} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>View Bids</PrimaryButton>
                    <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                        <CancelSaleButton sx={{ width: '100%', height: 40 }}>Cancel Sale</CancelSaleButton>
                        <SecondaryButton sx={{ width: '100%', height: 40 }}>Change Price</SecondaryButton>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <AboutAuthor />
                        <PriceHistoryView />
                        <ProductTransHistory />
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <ProjectDescription />
                        <NFTTransactionTable transactionsList={transactionsList} />
                        <ChainDetails />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default MyNFTAuction;
