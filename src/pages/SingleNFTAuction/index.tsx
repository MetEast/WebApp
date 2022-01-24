import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType, enumSingleNFTType, enumTransactionType, TypeProduct, TypeProductFetch, TypeNFTTransactionFetch, TypeNFTTransaction, TypeVeiwsLikesFetch, TypeFavouritesFetch, TypeSingleNFTBid, TypeSingleNFTBidFetch } from 'src/types/product-types'; 
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
// import ConnectWalletButton from 'src/components/ConnectWalletButton';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { getImageFromAsset, getTime, reduceHexAddress, getUTCTime, selectFromFavourites } from 'src/services/common';
import { getElaUsdRate, getViewsAndLikes, getMyFavouritesList } from 'src/services/fetch';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialConnectivity';
import WalletConnectProvider from "@walletconnect/web3-provider";


const SingleNFTAuction: React.FC = (): JSX.Element => {
    const auth = useRecoilValue(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(["token"]);
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
        type: enumSingleNFTType.BuyNow,
        isLike: false 
    };
    const defaultTransactionValue: TypeNFTTransaction = {type: enumTransactionType.Bid, user: "", price: 0, time: "", txHash: ""};
    const defaultBidValue: TypeSingleNFTBid = {user: "", price: 0, time: ""};

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
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
            if(itemObject.endTime) {
                let endTime = getTime(itemObject.endTime); // no proper value
                product.endTime = endTime.date + " " + endTime.time;
            }
            else {
                product.endTime = "No value";
            }
            
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

    const getLatestBid = async () => {
        const resLatestBid = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${params.id}&pageNum=1&pageSize=5`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataLatestBid = await resLatestBid.json();
        const arrLatestBid = dataLatestBid.data;
    
        let _latestBidsList: any = [];
        for(let i = 0; i < arrLatestBid.length; i ++) {
            let itemObject: TypeSingleNFTBidFetch = arrLatestBid[i];
            var _bid: TypeSingleNFTBid = {...defaultBidValue};
            _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
            _bid.price = parseFloat(itemObject.price) / 1e18;
            let timestamp = getTime(itemObject.timestamp);
            _bid.time = timestamp.date + " " + timestamp.time;
            _latestBidsList.push(_bid);
        }
        setBidsList(_latestBidsList);
    }; 

    // get your bids
    const getMyBids = async () => {    
        if(auth.isLoggedIn) {
            const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
            // console.log("----------walletConnectProvider", walletConnectProvider);
            const accounts = await walletConnectProvider.accounts;
            console.log("----------accounts", accounts);

            fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${params.id}&pageNum=1&pageSize=5&owner=${accounts[0]}`).then(response => {
                let _latestBidsList: any = [];
                response.json().then(jsonBidsList => {
                    jsonBidsList.forEach((itemObject: TypeSingleNFTBidFetch) => {
                        var _bid: TypeSingleNFTBid = {...defaultBidValue};
                        _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data
                        _bid.price = parseFloat(itemObject.price) / 1e18;
                        let timestamp = getTime(itemObject.timestamp);
                        _bid.time = timestamp.date + " " + timestamp.time;
                        _latestBidsList.push(_bid);
                    });
                    setMyBidsList(_latestBidsList);
                });
            }).catch(err => {
                console.log(err)
            });
        }
        else setMyBidsList([]);
    };

    const getFetchData = async () => {
        await updateProductViews();
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(auth.isLoggedIn, didCookies.did);
        getProductDetail(ela_usd_rate, favouritesList);
        getLatestTransaction();
        getLatestBid();
        if(auth.isLoggedIn) getMyBids();
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
                                <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.endTime}  />
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
                        isLoggedIn={auth.isLoggedIn} 
                        myBidsList={myBidsList}
                        marginTop={5} 
                        vertically={true} />
                </Grid>
                <Grid item md={8} xs={12}>
                    <SingleNFTBidsTable isLoggedIn={auth.isLoggedIn} myBidsList={myBidsList} bidsList={bidsList} />
                    <PriceHistoryView />
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
            </Grid>
        </>
    );
};

export default SingleNFTAuction;
