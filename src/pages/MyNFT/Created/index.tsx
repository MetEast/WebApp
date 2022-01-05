import React from 'react';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType } from 'src/types/product-types';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import ProductTransHistory from 'src/components/ProductTransHistory';

const MyNFTCreated: React.FC = (): JSX.Element => {
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
                        <ProductBadge badgeType={enumBadgeType.Created} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    {/* <ELAPrice ela_price={199} usd_price={480} marginTop={3} /> */}
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>Sell</PrimaryButton>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <AboutAuthor />
                        <ProductTransHistory sold={false} bought={false} />
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack spacing={3}>
                        <ProjectDescription />
                        <ChainDetails />
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default MyNFTCreated;
