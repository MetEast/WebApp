import React from 'react';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { Stack, Grid, Typography } from '@mui/material';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { enumBadgeType } from 'src/types/product-types';
import ELAPrice from 'src/components/ELAPrice';
import ProductTransHistory from 'src/components/ProductTransHistory';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import { nftTransactions } from 'src/constants/dummyData';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';

const MyNFTSold: React.FC = (): JSX.Element => {
    const transactionsList = nftTransactions;
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl="/assets/images/mynft/mynft-template4.png" />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets nickname="Nickname" likes={88} views={4800} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Sold} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    <ELAPrice price_ela={199} price_usd={480} marginTop={3} />
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
                <Grid item xs={5}>
                    <Stack spacing={3}>
                        <ProductTransHistory />
                        <ProjectDescription
                            description={`Project Description. Control can sometimes be an illusion. But sometimes you need illusions to gain control. Fantasy is an easy way to give meaning to the world. To cloak our harsh reality with escapist comfort`}
                        />
                        <AboutAuthor
                            name={`Luke Mac Quayle`}
                            description={`One Sentence Introduction. Fantasy is an easy way to give meaning to the world.`}
                            img={'/assets/images/avatar-template.png'}
                            address={'0xdssssssssssssddddddd'}
                        />
                        <ChainDetails
                            tokenId={`0x0548d...13667d`}
                            ownerName={'owner'}
                            ownerAddress={`0x3e9b...FA4b7`}
                            royalties={5}
                            createTime={`07 Jan 2022 at 02:20 UTC`}
                        />
                    </Stack>
                </Grid>
                <Grid item xs={7}>
                    <Stack spacing={3}>
                        <NFTTransactionTable transactionsList={transactionsList} />
                        <PriceHistoryView />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default MyNFTSold;
