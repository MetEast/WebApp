import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { enumBadgeType, enumSingleNFTType, TypeProductFetch, TypeNFTTransactionFetch, enumTransactionType, TypeVeiwsLikesFetch, TypeFavouritesFetch } from 'src/types/product-types'; 
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import { TypeNFTTransaction, TypeProduct } from 'src/types/product-types';
import { getImageFromAsset, getTime, getUTCTime, reduceHexAddress, selectFromFavourites } from 'src/services/common';
import { getElaUsdRate, getViewsAndLikes, getMyFavouritesList } from 'src/services/fetch';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
// import ConnectWalletButton from 'src/components/ConnectWalletButton';

const SingleNFTFixedPrice: React.FC = (): JSX.Element => {
    const params = useParams(); // params.tokenId
    const auth = useRecoilValue(authAtom);
    const [didCookies] = useCookies(["did"]);
    const [tokenCookies] = useCookies(["token"]);
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
        type: enumSingleNFTType.BuyNow,
        isLike: false
    };
    const defaultTransactionValue: TypeNFTTransaction = {type: enumTransactionType.Bid, user: "", price: 0, time: "", txHash: ""};

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const burnAddress = "0x0000000000000000000000000000000000000000";

    const getProductDetail = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resProductDetail = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.id}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataProductDetail = await resProductDetail.json();
        const prodDetail = dataProductDetail.data;
        var product: TypeProduct = {...defaultValue};        

        if (prodDetail !== undefined) {
            // get token list for likes
            let arrTokenIds: Array<string> = [];
            arrTokenIds.push(prodDetail.tokenId);
            const arrLikesList: TypeVeiwsLikesFetch = await getViewsAndLikes(arrTokenIds);
            
            // get individual data
            const itemObject: TypeProductFetch = prodDetail;
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = 'No value'; // -- no proper value
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = (arrLikesList === undefined || arrLikesList.likes === undefined || arrLikesList.likes.length === 0) ? 0 : arrLikesList.likes[0].likes;
            product.views = (arrLikesList === undefined || arrLikesList.views === undefined || arrLikesList.views.length === 0) ? 0 : arrLikesList.views[0].views;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            product.description = itemObject.description;
            product.author = itemObject.authorName || "No value";
            product.authorDescription = itemObject.authorDescription || "No value";
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = "No value"; // -- no proper value 
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + "" + createTime.time;
        }
        setProductDetail(product);    
    }

    const getLatestTransaction = async () => {
        const resLatestTransaction = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataLatestTransaction = await resLatestTransaction.json();
        const arrLatestTransaction = dataLatestTransaction.data;
    
        let _latestTransList: any = [];
        for(let i = 0; i < arrLatestTransaction.length; i ++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            var _transaction: TypeNFTTransaction = {...defaultTransactionValue};
            switch (itemObject.event) {
                case "Mint":
                    _transaction.type = enumTransactionType.CreatedBy;
                    break;
                case "OrderForAuction":
                    _transaction.type = enumTransactionType.OnAuction;
                    break;
                case "Bid":
                    _transaction.type = enumTransactionType.Bid;
                    break;
                case "OrderFilled":
                    _transaction.type = enumTransactionType.SoldTo;
                    break;
                case "OrderForSale":
                    _transaction.type = enumTransactionType.ForSale;
                    break;
            }
            _transaction.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4);  // no proper data
            _transaction.price = itemObject.gasFee;  // no proper data
            _transaction.txHash = itemObject.tHash;
            let timestamp = getTime(itemObject.timestamp.toString());
            _transaction.time = timestamp.date + " " + timestamp.time;
            _latestTransList.push(_transaction);
        }
        setTransactionsList(_latestTransList);
    };

    const getFetchData = async () => {
        updateProductViews();
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(auth.isLoggedIn, didCookies.did);
        getProductDetail(ela_usd_rate, favouritesList);
        getLatestTransaction();
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const updateProductLikes = (type: string) => {
        let prodDetail : TypeProduct = {...productDetail};
        if(type === 'inc') {
            prodDetail.likes += 1;
        }
        else if(type === 'dec') {
            prodDetail.likes -= 1;
        }
        setProductDetail(prodDetail);
    };

    const updateProductViews = () => {
        if(auth.isLoggedIn) {
            let reqUrl = `${process.env.REACT_APP_BACKEND_URL}/incTokenViews`; 
            const reqBody = {"token": tokenCookies.token, "tokenId": productDetail.tokenId, "did": didCookies.did};
            fetch(reqUrl,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(reqBody)
              }).then(response => response.json()).then(data => {
                if (data.code === 200) {
                    let prodDetail : TypeProduct = {...productDetail};
                    prodDetail.views += 1;
                    setProductDetail(prodDetail);
                } else {
                  console.log(data);
                }
              }).catch((error) => {
                console.log(error);
            });
        }
    };

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={6} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12} >
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} >
                    <Typography noWrap fontSize={{md:56, sm:42, xs:32}} fontWeight={700}>{productDetail.name}</Typography>
                    <ProductSnippets nickname={productDetail.author} likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.BuyNow} />
                        <ProductBadge badgeType={enumBadgeType.Museum} />
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} detail_page={true} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }}>buy now</PrimaryButton>
                    {/* <ConnectWalletButton toAddress={productDetail.holder} value={productDetail.price_ela.toString()} sx={{ marginTop: 3, width: '100%' }}>buy now</ConnectWalletButton> */}
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
                    <PriceHistoryView />
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
            </Grid>
        </>
    );
};

export default SingleNFTFixedPrice;
