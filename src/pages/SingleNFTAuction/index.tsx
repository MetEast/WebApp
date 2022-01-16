import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType, enumSingleNFTType, enumTransactionType, TypeProductFetch, TypeNFTTransactionFetch, TypeNFTTransaction, TypeSingleNFTBid } from 'src/types/product-types'; 
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ConnectWalletButton from 'src/components/ConnectWalletButton';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { singleNFTBids } from 'src/constants/dummyData';
import { TypeProduct } from 'src/types/product-types';
import { getImageFromAsset, getTime, reduceHexAddress, getUTCTime } from 'src/services/sleep'; 

const SingleNFTAuction: React.FC = (): JSX.Element => {
    const bidsList: Array<TypeSingleNFTBid> = singleNFTBids;
    // get product details from server
    const params = useParams(); // params.tokenId
    const defaultValue: TypeProduct = { 
        tokenId: "", 
        name: "", 
        image: "",
        price_ela: 0, 
        price_usd: 0, 
        likes: 0,
        views: 0,
        author: "",
        authorDescription: "",
        authorImg: "",
        authorAddress: "",
        description: "",
        tokenIdHex: "",
        royalties: 0,
        createTime: "",
        holderName: "",
        holder: "",
        type: enumSingleNFTType.BuyNow };
    const defaultTransactionValue: TypeNFTTransaction = {type: enumTransactionType.Bid, user: "", price: 0, time: ""};

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [ela_usd_rate, setElaUsdRate] = useState<number>(1);
    const burnAddress = "0x686c626E48bfC5DC98a30a9992897766fed4Abd3";

    useEffect(() => {
        fetch("https://esc.elastos.io/api?module=stats&action=coinprice", {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }})
        .then(response => {
            response.json().then(jsonPrcieRate => {
                setElaUsdRate(parseFloat(jsonPrcieRate.result.coin_usd));
            });
        }).catch(err => {
            console.log(err)
        });

        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=10&keyword=${params.id}`, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }})
        .then(response => {
            response.json().then(jsonProductDetails => {
                var itemObject: TypeProductFetch = jsonProductDetails.data.result[0];
                var product: TypeProduct = defaultValue;
                product.tokenId = itemObject.tokenId;
                product.name = itemObject.name;
                product.image = getImageFromAsset(itemObject.asset);
                product.price_ela = itemObject.price;
                product.price_usd = product.price_ela * ela_usd_rate;
                product.likes = itemObject.likes;
                product.views = itemObject.views;
                product.author = "Author"; // -- no proper value
                product.authorDescription = "Author description here"; // -- no proper value
                product.authorImg = product.image; // -- no proper value
                product.authorAddress = itemObject.holder; // -- no proper value
                product.description = itemObject.description;
                product.holderName = "Full Name"; // -- no proper value 
                product.holder = itemObject.holder;
                product.tokenIdHex = itemObject.tokenIdHex;
                product.royalties = parseInt(itemObject.royalties) / 1e4;
                let createTime = getUTCTime(itemObject.createTime);
                product.createTime = createTime.date + "" + createTime.time;
                product.type = (itemObject.status === "BuyNow") ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                let saleTime = getTime(itemObject.updateTime); // no proper value
                product.saleTime = saleTime.date + " " + saleTime.time;
                setProductDetail(product);
            });
        }).catch(err => {
            console.log(err)
        });

        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/tokenTrans?tokenId=${params.id}`).then(response => {
            let _latestTransList: any = [];
            response.json().then(jsonTransList => {
                jsonTransList.forEach(function (itemObject: TypeNFTTransactionFetch) {
                    var _transaction: TypeNFTTransaction = {...defaultTransactionValue};
                    _transaction.type = enumTransactionType.Bid;  // no proper data
                    _transaction.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4);  // no proper data
                    _transaction.price = itemObject.value / 1e18;  // no proper data
                    let saleTime = getTime(itemObject.timestamp);
                    _transaction.time = saleTime.date + " " + saleTime.time;
                    _latestTransList.push(_transaction);
                });
                setTransactionsList(_latestTransList);
            });
        }).catch(err => {
            console.log(err)
        });
    }, [ela_usd_rate, params.id]);

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={6} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12} >
                    <ProductImageContainer imgurl={productDetail.image} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} >
                    <Typography fontSize={{md:56, sm:42, xs:32}} fontWeight={700}>{productDetail.name}</Typography>
                    <ProductSnippets nickname={productDetail.author} likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <Grid container spacing={1}>
                            <Grid item xs={'auto'}>
                                <ProductBadge badgeType={enumBadgeType.OnAuction} />
                            </Grid>
                            <Grid item xs={'auto'}>
                                <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                            </Grid>
                            <Grid item xs={12} sm={'auto'}>
                                <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.saleTime}  />
                            </Grid>    
                        </Grid>
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} detail_page={true} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>Place Bid</PrimaryButton>
                    {/* <ConnectWalletButton toAddress={productDetail.holder} value={productDetail.price_ela.toString()} sx={{ marginTop: 3, width: '100%' }}>Place Bid</ConnectWalletButton> */}
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item md={4} xs={12}>
                    <SingleNFTMoreInfo 
                        author={productDetail.author} 
                        authorDescription={productDetail.authorDescription} 
                        authorImg={productDetail.authorImg} 
                        authorAddress={productDetail.authorAddress} 
                        description={productDetail.description}
                        detailTokenIdHex={productDetail.tokenIdHex} 
                        detailOwnerName={productDetail.holderName}
                        detailOwnerAddress={productDetail.holder}
                        detailRoyalties={productDetail.royalties}
                        detailCreateTime={productDetail.createTime}
                        marginTop={5} 
                        vertically={true} />
                </Grid>
                <Grid item md={8} xs={12}>
                    <SingleNFTBidsTable bidsList={bidsList} />
                    <PriceHistoryView />
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
            </Grid>
        </>
    );
};

export default SingleNFTAuction;
