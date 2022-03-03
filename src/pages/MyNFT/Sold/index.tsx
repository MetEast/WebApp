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
import {
    getImageFromAsset,
    getUTCTime,
    selectFromFavourites,
    reduceHexAddress,
    getTime,
    getMintCategory,
} from 'src/services/common';
import {
    enumBadgeType,
    enumSingleNFTType,
    TypeProduct,
    TypeProductFetch,
    enumTransactionType,
    TypeFavouritesFetch,
    TypeNFTTransaction,
    TypeNFTTransactionFetch,
    TypeNFTHisotry,
} from 'src/types/product-types';
import { FETCH_CONFIG_JSON, getELA2USD, getMyFavouritesList } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useCookies } from 'react-cookie';
import { TypeSelectItem } from 'src/types/select-types';
import ModalDialog from 'src/components/ModalDialog';
import AllTransactions from 'src/components/profile/AllTransactions';
import Container from 'src/components/Container';

const MyNFTSold: React.FC = (): JSX.Element => {
    const params = useParams(); // params.id
    const [signInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [dialogState, setDialogState] = useDialogContext();

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
        saleType: enumTransactionType.ForSale,
        txHash: '',
    };

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();

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
            product.author = itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
            product.authorDescription = itemObject.authorDescription || ' ';
            product.authorImg = product.image;
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            product.category = itemObject.category;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;
        }
        setProductDetail(product);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getELA2USD();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getProductDetail(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const getLatestTransaction = async () => {
        const resLatestTransaction = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`,
            FETCH_CONFIG_JSON,
        );
        const dataLatestTransaction = await resLatestTransaction.json();
        const arrLatestTransaction = dataLatestTransaction.data;

        let _latestTransList: Array<TypeNFTTransaction> = [];
        let _prodTransHistory: Array<TypeNFTHisotry> = [];
        for (let i = 0; i < arrLatestTransaction.length; i++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            if (itemObject.event === 'Transfer') continue;
            let _transaction: TypeNFTTransaction = { ...defaultTransactionValue };
            switch (itemObject.event) {
                case 'Mint':
                    _transaction.type = enumTransactionType.CreatedBy;
                    _transaction.user = reduceHexAddress(itemObject.to , 4);
                    break;
                case 'CreateOrderForSale':
                    _transaction.type = enumTransactionType.ForSale;
                    _transaction.user = reduceHexAddress(itemObject.from , 4);
                    break;
                case 'CreateOrderForAuction':
                    _transaction.type = enumTransactionType.OnAuction;
                    _transaction.user = reduceHexAddress(itemObject.from , 4);
                    break;
                case 'BidOrder':
                    _transaction.type = enumTransactionType.Bid;
                    _transaction.user = reduceHexAddress(itemObject.to , 4);
                    break;
                case 'ChangeOrderPrice':
                    _transaction.type = enumTransactionType.PriceChanged;
                    _transaction.user = reduceHexAddress(itemObject.from , 4);
                    break;
                case 'CancelOrder':
                    _transaction.type = enumTransactionType.SaleCanceled;
                    _transaction.user = reduceHexAddress(itemObject.from , 4);
                    break;
                case 'BuyOrder':
                    _transaction.type = enumTransactionType.SoldTo;
                    _transaction.user = reduceHexAddress(itemObject.to , 4);
                    break;
                // case 'Transfer':
                //     _transaction.type = enumTransactionType.Transfer;
                //     break;
                case 'SettleBidOrder':
                    _transaction.type = enumTransactionType.SettleBidOrder;
                    _transaction.user = reduceHexAddress(itemObject.to , 4);
                    break;
            }
            _transaction.price = parseInt(itemObject.price) / 1e18;
            _transaction.txHash = itemObject.tHash;
            let timestamp = getTime(itemObject.timestamp.toString());
            _transaction.time = timestamp.date + ' ' + timestamp.time;
            _latestTransList.push(_transaction);

            if (itemObject.event === 'Mint' || itemObject.event === 'BuyOrder') {
                let _prodTrans: TypeNFTHisotry = { ...defaultProdTransHisotryValue };
                _prodTrans.type =
                    itemObject.event === 'Mint'
                        ? 'Created'
                        : itemObject.to === signInDlgState.walletAccounts[0]
                        ? 'Bought From'
                        : 'Sold To';
                _prodTrans.price = parseInt(itemObject.price) / 1e18;
                _prodTrans.user = reduceHexAddress(_prodTrans.type === 'Bought From' ? itemObject.from : itemObject.to, 4); // no proper data
                let prodTransTimestamp = getTime(itemObject.timestamp.toString());
                _prodTrans.time = prodTransTimestamp.date + ' ' + prodTransTimestamp.time;
                if (itemObject.event === 'BuyOrder')
                    _prodTrans.saleType =
                        arrLatestTransaction[i + 2].event === 'CreateOrderForSale'
                            ? enumTransactionType.ForSale
                            : enumTransactionType.OnAuction;
                _prodTrans.txHash = itemObject.tHash;
                _prodTransHistory.push(_prodTrans);
            }
        }
        setTransactionsList(_latestTransList);
        setProdTransHistory(_prodTransHistory);
    };
    
    useEffect(() => {
        getLatestTransaction();
    }, [transactionSortBy]);

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
        <Container>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5}>
                <Grid item xs={6}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item xs={6}>
                    <Typography fontSize={56} fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                        Sculpting with the Heart
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.Sold} />
                        <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} marginTop={3} />
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
                <Grid item xs={4}>
                    <Stack spacing={5}>
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
                <Grid item xs={8}>
                    <Stack spacing={10}>
                        <NFTTransactionTable transactionsList={transactionsList} />
                        <PriceHistoryView />
                    </Stack>
                </Grid>
            </Grid>
            <ModalDialog
                open={dialogState.allTxDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allTxDlgOpened: false });
                }}
            >
                <AllTransactions
                    transactionList={transactionsList}
                    changeHandler={(value: TypeSelectItem | undefined) => setTransactionSortBy(value)}
                />
            </ModalDialog>
        </Container>
    );
};

export default MyNFTSold;
