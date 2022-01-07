import React from 'react';
import { Stack, Grid, Typography, Box, Dialog } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { enumBadgeType } from 'src/types/product-types';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ModalDialog from 'src/components/ModalDialog';
import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';
import EnterSaleDetails from 'src/components/TransactionDialogs/ListNFT/EnterSaleDetails';
import CheckSaleDetails from 'src/components/TransactionDialogs/ListNFT/CheckSaleDetails';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const [openDlg, setOpenDlg] = React.useState(false);

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
                    <ELAPrice ela_price={199} usd_price={480} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }} onClick={() => setOpenDlg(true)}>
                        Buy Now
                    </PrimaryButton>
                </Grid>
            </Grid>
            <Box marginTop={5}>
                <img src="" alt="Blind Box Introduction"></img>
            </Box>
            <ModalDialog open={openDlg} onClose={() => setOpenDlg(false)}>
                <CheckSaleDetails />
            </ModalDialog>
        </>
    );
};

export default BlindBoxProduct;
