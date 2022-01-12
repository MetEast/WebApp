import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography, Box, Dialog } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { TypeNewProduct, enumBadgeType, enumBlindBoxNFTType } from 'src/types/product-types';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ModalDialog from 'src/components/ModalDialog';
import BuyBlindBox from 'src/components/TransactionDialogs/BuyBlindBox/BuyBlindBox';
import OrderSummary from 'src/components/TransactionDialogs/BuyBlindBox/OrderSummary';
import CheckNFTDetails from 'src/components/TransactionDialogs/MintNFT/CheckNFTDetails';
import PlaceBid from 'src/components/TransactionDialogs/PlaceBid/PlaceBid';
import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';
import EnterSaleDetails from 'src/components/TransactionDialogs/ListNFT/EnterSaleDetails';
import CheckSaleDetails from 'src/components/TransactionDialogs/ListNFT/CheckSaleDetails';
import ArtworkIsNowForSale from 'src/components/TransactionDialogs/ListNFT/ArtworkIsNowForSale';
import AcceptBid from 'src/components/TransactionDialogs/AcceptBid/AcceptBid';
import SaleSuccess from 'src/components/TransactionDialogs/AcceptBid/SaleSuccess';
import BuyNow from 'src/components/TransactionDialogs/BuyNow/BuyNow';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyNow/PurchaseSuccess';
import WaitingConfirm from 'src/components/TransactionDialogs/Others/WaitingConfirm';
import ErrorMessage from 'src/components/TransactionDialogs/Others/ErrorMessage';
import CreateBlindBox from 'src/components/TransactionDialogs/CreateBlindBox/CreateBlindBox';
import CheckBlindBoxDetails from 'src/components/TransactionDialogs/CreateBlindBox/CheckBlindBoxDetails';
import BlindBoxCreateSuccess from 'src/components/TransactionDialogs/CreateBlindBox/BlindBoxCreateSuccess';
import CreateBanner from 'src/components/TransactionDialogs/CreateBanner/CreateBanner';
import { getThumbnail, getTime, getUTCTime, reduceHexAddress } from 'src/services/sleep'; 

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const [openDlg, setOpenDlg] = React.useState(false);
    // get product details from server
    const params = useParams(); // params.id
    const [productDetail, setProductDetail] = useState({id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, sold: 0, instock: 0, views: 0, author: {name: "", description: "", img: ""}, description: "", details: {tokenId: "", owner: "", createTime: "", royalties: ""}, type: enumBlindBoxNFTType.ComingSoon, saleTime: ""});
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.id}`).then(response => {
            response.json().then(jsonProductDetails => {
                // console.log(jsonProductDetails);
                var item: TypeNewProduct = jsonProductDetails.data;
                var product: any = {id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, sold: 0, instock: 0, author: {name: "", description: "", img: ""}, description: "", details: {tokenId: "", owner: "", createTime: "", royalties: ""}, type: enumBlindBoxNFTType.ComingSoon, saleTime: ""};
                product.id = item.tokenId;
                product.name = item.name;
                product.image = getThumbnail(item.asset);
                product.price_ela = item.blockNumber % 1000;
                product.price_usd = product.price_ela * 3.44;
                product.likes = parseInt(item.createTime) % 10000;
                product.views = parseInt(item.createTime) * 7 % 10000;
                product.sold = item.blockNumber % 4321;
                product.instock = item.blockNumber % 1234;
                product.author.name = item.name + "'s nickname";
                product.author.description = item.name + "one sentence description here";
                product.author.img = getThumbnail(item.asset);
                product.description = item.description;
                product.type = parseInt(item.createTime) % 3 === 0 ? enumBlindBoxNFTType.ComingSoon : (parseInt(item.createTime) % 3 === 1 ? enumBlindBoxNFTType.SaleEnds : enumBlindBoxNFTType.SaleEnded);
                let saleTime = getTime(item.createTime);
                product.saleTime = saleTime.date + " " + saleTime.time;
                product.details.tokenId = reduceHexAddress(item.tokenIdHex, 5);
                product.details.owner = reduceHexAddress(item.holder, 4);
                product.details.royalties = parseInt(item.royalties) / 1e4;
                let createTime = getUTCTime(item.createTime);
                product.details.createTime = createTime.date + "" + createTime.time;
                setProductDetail(product);
            });
        }).catch(err => {
            console.log(err)
        });
    }, []);
    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer imgurl={productDetail.image} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography fontSize={{md:56, sm:42, xs:32}} fontWeight={700}>{productDetail.name}</Typography>
                    <ProductSnippets sold={productDetail.sold} instock={200} likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        {/* <ProductBadge badgeType={enumBadgeType.ComingSoon} content="2022/02/28 10:00" /> */}
                        <ProductBadge badgeType={enumBadgeType.ComingSoon} content={productDetail.saleTime} />
                    </Stack>
                    <ELAPrice ela_price={productDetail.price_ela} usd_price={productDetail.price_usd} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }} onClick={() => setOpenDlg(true)}>
                        Buy Now
                    </PrimaryButton>
                </Grid>
            </Grid>
            <Box marginTop={5}>
                <img src="" alt="Blind Box Introduction"></img>
            </Box>
            <ModalDialog open={openDlg} onClose={() => setOpenDlg(false)}>
                <CreateBanner />
            </ModalDialog>
        </>
    );
};

export default BlindBoxProduct;
