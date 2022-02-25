import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { Stack, Grid, Typography } from '@mui/material';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import ProductTransHistory from 'src/components/ProductTransHistory';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { getImageFromAsset, getUTCTime, selectFromFavourites, reduceHexAddress, getTime, getMintCategory } from 'src/services/common';
import {
    enumBadgeType,
    enumSingleNFTType,
    TypeProduct,
    TypeProductFetch,
    enumTransactionType,
    TypeFavouritesFetch,
    TypeNFTTransaction,
    TypeNFTTransactionFetch,
    TypeNFTHisotry
} from 'src/types/product-types';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';

const MyNFTSold: React.FC = (): JSX.Element => {
    const params = useParams(); // params.id
    const [signInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const defaultValue: TypeProduct = {
        tokenId: '',
        name: '',
        image: '',
        price_ela: 0,
        price_usd: 0,
        likes: 0,
        views: 0,
        author: '',
        authorDescription: '',
        authorImg: '',
        authorAddress: '',
        description: '',
        tokenIdHex: '',
        royalties: 0,
        createTime: '',
        holderName: '',
        holder: '',
        type: enumSingleNFTType.BuyNow,
        isLike: false,
    };
    const defaultTransactionValue: TypeNFTTransaction = {
        type: enumTransactionType.Bid,
        user: '',
        price: 0,
        time: '',
        txHash: '',
    };
    const defaultProdTransHisotryValue: TypeNFTHisotry = {
        type: '',
        user: '',
        price: 0,
        time: '',
        saleType: ''
    };

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const burnAddress = '0x0000000000000000000000000000000000000000';

    const getProductDetail = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resProductDetail = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${params.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataProductDetail = await resProductDetail.json();
        const prodDetail = dataProductDetail.data;
        var product: TypeProduct = { ...defaultValue };

        if (prodDetail !== undefined) {
            const itemObject: TypeProductFetch = prodDetail;
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.views = itemObject.views;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            product.description = itemObject.description;
            product.author = itemObject.authorName || ' ';
            product.authorDescription = itemObject.authorDescription || ' ';
            product.authorImg = product.image;
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;
        }
        setProductDetail(product);
    };

    const getLatestTransaction = async () => {
        const resLatestTransaction = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataLatestTransaction = await resLatestTransaction.json();
        const arrLatestTransaction = dataLatestTransaction.data;

        let _latestTransList: Array<TypeNFTTransaction> = [];
        let _prodTransHistory: Array<TypeNFTHisotry> = [];
        for (let i = 0; i < arrLatestTransaction.length; i++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            var _transaction: TypeNFTTransaction = { ...defaultTransactionValue };
            switch (itemObject.event) {
                case 'Mint':
                    _transaction.type = enumTransactionType.CreatedBy;
                    break;
                case 'CreateOrderForSale':
                    _transaction.type = enumTransactionType.ForSale;
                    break;
                case 'CreateOrderForAuction':
                    _transaction.type = enumTransactionType.OnAuction;
                    break;
                case 'BidOrder':
                    _transaction.type = enumTransactionType.Bid;
                    break;
                case 'ChangeOrderPrice':
                        _transaction.type = enumTransactionType.ChangeOrder;
                        break;
                case 'CancelOrder':
                    _transaction.type = enumTransactionType.CancelOrder;
                    break;
                case 'BuyOrder':
                    _transaction.type = enumTransactionType.SoldTo;
                    break;
                case 'Transfer':
                    _transaction.type = enumTransactionType.Transfer;
                    break;
                // case 'SettleBidOrder':
                //     _transaction.type = enumTransactionType.SettleBidOrder;
                //     break;
            }
            _transaction.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4); // no proper data
            _transaction.price = parseInt(itemObject.price) / 1e18;
            _transaction.txHash = itemObject.tHash;
            let timestamp = getTime(itemObject.timestamp.toString());
            _transaction.time = timestamp.date + ' ' + timestamp.time;
            _latestTransList.push(_transaction);

            if (itemObject.event === 'Mint' || itemObject.event === 'BuyOrder') {
                let _prodTrans: TypeNFTHisotry = { ...defaultProdTransHisotryValue };
                _prodTrans.type = (itemObject.event === 'Mint') ? 'Created' : ((itemObject.royaltyOwner === signInDlgState.walletAccounts[0]) ? 'Sold To' : 'Brought From');
                _prodTrans.price = parseInt(itemObject.price) / 1e18;
                _prodTrans.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4); // no proper data
                let prodTransTimestamp = getTime(itemObject.timestamp.toString());
                _prodTrans.time = prodTransTimestamp.date + ' ' + prodTransTimestamp.time;
                // _prodTrans.saleType = (itemObject)
                _prodTransHistory.push(_prodTrans);
            }
        }
        setTransactionsList(_latestTransList);
        setProdTransHistory(_prodTransHistory);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getProductDetail(ela_usd_rate, favouritesList);
        getLatestTransaction();
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const updateProductLikes = (type: string) => {
        let prodDetail: TypeProduct = { ...productDetail };
        if (type === 'inc') {
            prodDetail.likes += 1;
        } else if (type === 'dec') {
            prodDetail.likes -= 1;
        }
        setProductDetail(prodDetail);
    };

    return (
        <>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets nickname={productDetail.author} likes={productDetail.likes} views={productDetail.views} />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Sold} />
                        <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} marginTop={3} />
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
                <Grid item xs={5}>
                    <Stack spacing={3}>
                        <ProductTransHistory historyList={prodTransHistory} />
                        <ProjectDescription description={productDetail.description} />
                        <AboutAuthor
                            name={productDetail.author}
                            description={productDetail.authorDescription}
                            img={productDetail.authorImg}
                            address={productDetail.authorAddress}
                        />
                        <ChainDetails
                            tokenId={productDetail.tokenIdHex}
                            ownerName={productDetail.holderName}
                            ownerAddress={productDetail.holder}
                            royalties={productDetail.royalties}
                            createTime={productDetail.createTime}
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
