import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import { enumBadgeType, enumSingleNFTType, enumTransactionType, TypeProduct, TypeProductFetch, TypeNFTTransactionFetch, TypeNFTTransaction, TypeSingleNFTBid, TypeSingleNFTBidFetch } from 'src/types/product-types'; 
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
import { getImageFromAsset, getTime, reduceHexAddress, getUTCTime } from 'src/services/common'; 
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const SingleNFTAuction: React.FC = (): JSX.Element => {
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
    const defaultTransactionValue: TypeNFTTransaction = {type: enumTransactionType.Bid, user: "", price: 0, time: "", txHash: ""};
    const defaultBidValue: TypeSingleNFTBid = {user: "", price: 0, time: ""};

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [ela_usd_rate, setElaUsdRate] = useState<number>(1);
    const burnAddress = "0x0000000000000000000000000000000000000000";

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

        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=10&keyword=${params.id}`, {
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
                product.authorAddress = itemObject.royaltyOwner; 
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

        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1$pageSize=5`).then(response => {
            let _latestTransList: any = [];
            response.json().then(jsonTransList => {
                jsonTransList.data.forEach((itemObject: TypeNFTTransactionFetch) => {
                    var _transaction: TypeNFTTransaction = {...defaultTransactionValue};
                    // no proper data
                    switch (itemObject.event) {
                        case "Mint":
                            _transaction.type = enumTransactionType.CreatedBy;
                            break;
                    }
                    _transaction.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4);  // no proper data
                    _transaction.price = itemObject.gasFee;  // no proper data
                    _transaction.txHash = itemObject.tHash;
                    let timestamp = getTime(itemObject.timestamp.toString());
                    _transaction.time = timestamp.date + " " + timestamp.time;
                    _latestTransList.push(_transaction);
                });
                setTransactionsList(_latestTransList);
            });
        }).catch(err => {
            console.log(err)
        });

        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${params.id}&pageNum=1&pageSize=5`).then(response => {
            let _latestBidsList: any = [];
            response.json().then(jsonBidsList => {
                jsonBidsList.data.forEach((itemObject: TypeSingleNFTBidFetch) => {
                    var _bid: TypeSingleNFTBid = {...defaultBidValue};
                    _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data
                    _bid.price = parseFloat(itemObject.price) / 1e18;
                    let timestamp = getTime(itemObject.timestamp);
                    _bid.time = timestamp.date + " " + timestamp.time;
                    _latestBidsList.push(_bid);
                });
                setBidsList(_latestBidsList);
            });
        }).catch(err => {
            console.log(err)
        });
        
    }, [ela_usd_rate, params.id]);

    // get your bids
    const context = useWeb3React<Web3Provider>();
    const { activate, active, error, library, chainId } = context;

    const getMyBids = async () => {    
        alert(active);
        if(library && active) {
            const accounts = await library.listAccounts();
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
    useEffect(() => {
        getMyBids();
    }, [active, chainId]);

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
                        isLoggedIn={active} 
                        myBidsList={myBidsList}
                        marginTop={5} 
                        vertically={true} />
                </Grid>
                <Grid item md={8} xs={12}>
                    <SingleNFTBidsTable isLoggedIn={active} myBidsList={myBidsList} bidsList={bidsList} />
                    <PriceHistoryView />
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
            </Grid>
        </>
    );
};

export default SingleNFTAuction;
