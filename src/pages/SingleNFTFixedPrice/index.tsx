import React, { useState, useEffect } from 'react'; // ---
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography, Box } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { enumBadgeType, enumSingleNFTType, TypeNewProduct, TypeNewTransaction, enumTransactionType } from 'src/types/product-types'; // ---
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import { PrimaryButton } from 'src/components/Buttons/styles';
// import { nftTransactions } from 'src/constants/dummyData';
import { TypeNFTTransaction } from 'src/types/product-types';
import { getThumbnail, getTime, reduceHexAddress } from 'src/services/sleep'; // ---

const SingleNFTFixedPrice: React.FC = (): JSX.Element => {
    // const transactionsList: Array<TypeNFTTransaction> = nftTransactions;
    // get product details from server
    const params = useParams(); // params.id
    const [productDetail, setProductDetail] = useState({id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, author: {name: "", description: "", img: ""}, description: "", type: enumSingleNFTType.BuyNow, saleTime: ""});
    const [transactionsList, setTransactionsList] = useState([]);
    var _latestTransList: any = [];
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.id}`).then(response => {
            response.json().then(jsonProductDetails => {
                console.log(jsonProductDetails);
                var item: TypeNewProduct = jsonProductDetails.data;
                var product: any = {id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, author: {name: "", description: "", img: ""}, description: "", type: enumSingleNFTType.BuyNow, saleTime: ""};
                product.id = item.tokenId;
                product.name = item.name;
                product.image = getThumbnail(item.thumbnail);
                product.price_ela = item.blockNumber % 1000;
                product.price_usd = product.price_ela * 3.44;
                product.likes = parseInt(item.createTime) % 10000;
                product.views = parseInt(item.createTime) * 7 % 10000;
                product.author.name = item.name + "'s nickname";
                product.author.description = item.name + "one sentence description here";
                product.author.img = getThumbnail(item.thumbnail);
                product.description = item.description;
                product.type = parseInt(item.createTime) % 2 === 0 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                let saleTime = getTime(item.createTime);
                product.saleTime = saleTime.date + " " + saleTime.time;                
                setProductDetail(product);
            });
        }).catch(err => {
            console.log(err)
        });

        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1`).then(response => {
            response.json().then(jsonTransList => {
                // console.log(jsonTransList);
                jsonTransList.data.forEach(function (itemObject: TypeNewTransaction) {
                    var _transaction: TypeNFTTransaction = {type: enumTransactionType.Bid, user: "", price: 0, time: ""};
                     // no proper data
                    if(itemObject.event === "ChangeOrderPrice") _transaction.type = enumTransactionType.OnAuction;
                    else if(itemObject.event === "BuyOrder") _transaction.type = enumTransactionType.SoldTo;
                    else if(itemObject.event === "CreateOrderForSale") _transaction.type = enumTransactionType.ForSale;
                    else if(itemObject.event === "Mint") _transaction.type = enumTransactionType.CreatedBy;
                    else _transaction.type = enumTransactionType.Bid;
                    _transaction.user = reduceHexAddress(itemObject.from);  // no proper data
                    _transaction.price = parseInt(itemObject.price) / 1e15;  // no proper data
                    let saleTime = getTime(itemObject.timestamp);
                    _transaction.time = saleTime.date + " " + saleTime.time;
                    _latestTransList.push(_transaction);
                });
                setTransactionsList(_latestTransList);
            });
        }).catch(err => {
            console.log(err)
        });
    }, []);


    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer imgurl={productDetail.image} />
                    {/* <ProductImageContainer imgurl={'/assets/images/explore/singlenft-template1.png'} /> */}
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700}>{productDetail.name}</Typography>
                    <ProductSnippets nickname={productDetail.author.name} likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.BuyNow} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    <ELAPrice ela_price={productDetail.price_ela} usd_price={productDetail.price_usd} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>buy now</PrimaryButton>
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
                <Grid item xs={6}>
                    <PriceHistoryView />
                </Grid>
            </Grid>
            <SingleNFTMoreInfo author={productDetail.author} description={productDetail.description} marginTop={5} />
        </>
    );
};

export default SingleNFTFixedPrice;
