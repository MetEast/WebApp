import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import {
    enumBadgeType,
    enumSingleNFTType,
    enumTransactionType,
    TypeProduct,
    TypeProductFetch,
    TypeNFTTransactionFetch,
    TypeNFTTransaction,
    TypeFavouritesFetch,
    TypeSingleNFTBid,
    TypeSingleNFTBidFetch,
} from 'src/types/product-types';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import SingleNFTBidsTable from 'src/components/SingleNFTBidsTable';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import { getImageFromAsset, getTime, reduceHexAddress, getUTCTime, selectFromFavourites } from 'src/services/common';
import { getELA2USD, getMyFavouritesList } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import PlaceBid from 'src/components/TransactionDialogs/PlaceBid/PlaceBid';
import ReviewBidDetails from 'src/components/TransactionDialogs/PlaceBid/ReviewBidDetails';
import BidPlaceSuccess from 'src/components/TransactionDialogs/PlaceBid/BidPlaceSuccess';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
import AllTransactions from 'src/components/profile/AllTransactions';
import AllBids from 'src/components/TransactionDialogs/AllBids/AllBids';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { TypeSelectItem } from 'src/types/select-types';
import NoBids from 'src/components/TransactionDialogs/AllBids/NoBids';
import { isInAppBrowser } from 'src/services/wallet';
import Container from 'src/components/Container';

const SingleNFTAuction: React.FC = (): JSX.Element => {
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [dialogState, setDialogState] = useDialogContext();
    const params = useParams();
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
        isExpired: true,
    };
    const defaultTransactionValue: TypeNFTTransaction = {
        type: enumTransactionType.Bid,
        user: '',
        price: 0,
        time: '',
        txHash: '',
    };

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);

    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();
    const [bidSortBy, setBidSortBy] = useState<TypeSelectItem>();

    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

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
        const itemObject: TypeProductFetch = dataProductDetail.data;
        if (itemObject !== undefined) {
            const product: TypeProduct = { ...productDetail };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author =
                itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
            product.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.views = itemObject.views;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            product.description = itemObject.description;
            product.authorDescription = itemObject.authorDescription || '';
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holder = itemObject.holder;
            product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            product.orderId = itemObject.orderId;
            product.category = itemObject.category;
            product.status = itemObject.status;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;
            if (itemObject.endTime) {
                let endTime = getTime(itemObject.endTime); // no proper value
                product.endTime = endTime.date + ' ' + endTime.time;
            } else {
                product.endTime = ' ';
            }
            product.isExpired = Math.round(new Date().getTime() / 1000) > parseInt(itemObject.endTime);
            setProductDetail(product);
        }
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getELA2USD();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getProductDetail(ela_usd_rate, favouritesList);
        getLatestTransaction();
    };

    useEffect(() => {
        getFetchData();
    }, []);

    // bid
    const getLatestBid = async () => {
        const defaultBidValue: TypeSingleNFTBid = { user: '', price: 0, time: '', orderId: '' };
        const resLatestBid = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${params.id}&address=${signInDlgState.walletAccounts[0]}&pageNum=1&pageSize=5`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataLatestBid = await resLatestBid.json();
        const arrLatestBid = dataLatestBid.data;

        let _latestBidsList: any = [];
        for (let i = 0; i < arrLatestBid.others.length; i++) {
            let itemObject: TypeSingleNFTBidFetch = arrLatestBid.others[i];
            let _bid: TypeSingleNFTBid = { ...defaultBidValue };
            _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
            _bid.price = parseFloat(itemObject.price) / 1e18;
            _bid.orderId = itemObject.orderId;
            let timestamp = getTime(itemObject.timestamp);
            _bid.time = timestamp.date + ' ' + timestamp.time;
            _latestBidsList.push(_bid);
        }
        setBidsList(_latestBidsList);

        let _myLatestBidsList: any = [];
        for (let i = 0; i < arrLatestBid.yours.length; i++) {
            let itemObject: TypeSingleNFTBidFetch = arrLatestBid.yours[i];
            let _bid: TypeSingleNFTBid = { ...defaultBidValue };
            _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
            _bid.price = parseFloat(itemObject.price) / 1e18;
            _bid.orderId = itemObject.orderId;
            let timestamp = getTime(itemObject.timestamp);
            _bid.time = timestamp.date + ' ' + timestamp.time;
            _myLatestBidsList.push(_bid);
        }
        setMyBidsList(_myLatestBidsList);
    };

    useEffect(() => {
        getLatestBid();
    }, [bidSortBy]);

    // transaction

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

        let _latestTransList: any = [];
        for (let i = 0; i < arrLatestTransaction.length; i++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            if (itemObject.event === 'Transfer') continue;
            var _transaction: TypeNFTTransaction = { ...defaultTransactionValue };
            switch (itemObject.event) {
                case 'Mint':
                    _transaction.type = enumTransactionType.CreatedBy;
                    _transaction.user =
                        itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
                case 'CreateOrderForSale':
                    _transaction.type = enumTransactionType.ForSale;
                    _transaction.user =
                        itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'CreateOrderForAuction':
                    _transaction.type = enumTransactionType.OnAuction;
                    _transaction.user =
                        itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'BidOrder':
                    _transaction.type = enumTransactionType.Bid;
                    _transaction.user =
                        itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
                case 'ChangeOrderPrice':
                    _transaction.type = enumTransactionType.PriceChanged;
                    _transaction.user =
                        itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'CancelOrder':
                    _transaction.type = enumTransactionType.SaleCanceled;
                    _transaction.user =
                        itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'BuyOrder':
                    _transaction.type = enumTransactionType.SoldTo;
                    _transaction.user =
                        itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
                // case 'Transfer':
                //     _transaction.type = enumTransactionType.Transfer;
                //     break;
                case 'SettleBidOrder':
                    _transaction.type = enumTransactionType.SettleBidOrder;
                    _transaction.user =
                        itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
            }
            _transaction.price = parseInt(itemObject.price) / 1e18;
            _transaction.txHash = itemObject.tHash;
            let timestamp = getTime(itemObject.timestamp.toString());
            _transaction.time = timestamp.date + ' ' + timestamp.time;
            _latestTransList.push(_transaction);
        }
        setTransactionsList(_latestTransList);
    };

    useEffect(() => {
        getLatestTransaction();
    }, [transactionSortBy]);

    const setPlaceBidTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, placeBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setPlaceBidTxFee();
    }, [dialogState.placeBidDlgStep]);

    const updateProductLikes = (type: string) => {
        setProductDetail((prevState: TypeProduct) => {
            const prodDetail: TypeProduct = { ...prevState };
            if (type === 'inc') {
                prodDetail.likes++;
            } else if (type === 'dec') {
                prodDetail.likes--;
            }
            return prodDetail;
        });
    };

    const updateProductViews = (tokenId: string) => {
        if (signInDlgState.isLoggedIn && tokenId) {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
            const reqBody = {
                token: tokenCookies.METEAST_TOKEN,
                tokenId: tokenId,
                did: didCookies.METEAST_DID,
            };
            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 200) {
                        setProductDetail((prevState: TypeProduct) => {
                            const prodDetail: TypeProduct = { ...prevState };
                            prodDetail.views += 1;
                            return prodDetail;
                        });
                    } else {
                        console.log(data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        updateProductViews(productDetail.tokenId);
    }, [productDetail.tokenId]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={6} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <Grid container spacing={1}>
                            <Grid item xs={'auto'}>
                                <ProductBadge badgeType={enumBadgeType.OnAuction} />
                            </Grid>
                            {productDetail.status !== 'HAS BIDS' && (
                                <Grid item xs={'auto'}>
                                    <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={'auto'}>
                                {productDetail.isExpired ? (
                                    <ProductBadge badgeType={enumBadgeType.SaleEnded} />
                                ) : (
                                    <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.endTime} />
                                )}
                            </Grid>
                        </Grid>
                    </Stack>
                    <ELAPrice
                        price_ela={productDetail.price_ela}
                        price_usd={productDetail.price_usd}
                        detail_page={true}
                        marginTop={3}
                    />
                    {signInDlgState.walletAccounts !== [] &&
                        productDetail.holder !== signInDlgState.walletAccounts[0] &&
                        !productDetail.isExpired && (
                            <PrimaryButton
                                sx={{ marginTop: 3, width: '100%' }}
                                onClick={() => {
                                    if (signInDlgState.isLoggedIn) {
                                        setDialogState({
                                            ...dialogState,
                                            placeBidDlgOpened: true,
                                            placeBidDlgStep: 0,
                                            placeBidName: productDetail.name,
                                            placeBidOrderId: productDetail.orderId || '',
                                            placeBidMinLimit: productDetail.price_ela,
                                        });
                                    } else {
                                        setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                    }
                                }}
                            >
                                Place Bid
                            </PrimaryButton>
                        )}
                    {signInDlgState.walletAccounts !== [] &&
                        productDetail.holder === signInDlgState.walletAccounts[0] &&
                        bidsList.length === 0 && (
                            <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                                <PinkButton
                                    sx={{ width: '100%', height: 40 }}
                                    onClick={() => {
                                        if (signInDlgState.isLoggedIn) {
                                            setDialogState({
                                                ...dialogState,
                                                cancelSaleDlgOpened: true,
                                                cancelSaleDlgStep: 0,
                                                cancelSaleOrderId: productDetail.orderId || '',
                                            });
                                        } else {
                                            setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                        }
                                    }}
                                >
                                    Cancel Sale
                                </PinkButton>
                                <SecondaryButton
                                    sx={{ width: '100%', height: 40 }}
                                    onClick={() => {
                                        if (signInDlgState.isLoggedIn) {
                                            setDialogState({
                                                ...dialogState,
                                                changePriceDlgOpened: true,
                                                changePriceDlgStep: 0,
                                                changePriceCurPrice: productDetail.price_ela,
                                                changePriceOrderId: productDetail.orderId || '',
                                            });
                                        } else {
                                            setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                        }
                                    }}
                                >
                                    Change Price
                                </SecondaryButton>
                            </Stack>
                        )}
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10}>
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
                        isLoggedIn={signInDlgState.isLoggedIn}
                        myBidsList={myBidsList}
                        marginTop={5}
                        vertically={true}
                    />
                </Grid>
                <Grid item md={8} xs={12}>
                    <SingleNFTBidsTable
                        isLoggedIn={signInDlgState.isLoggedIn}
                        myBidsList={myBidsList}
                        bidsList={bidsList}
                    />
                    <PriceHistoryView />
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
            </Grid>
            <ModalDialog
                open={dialogState.placeBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, placeBidDlgOpened: false });
                }}
            >
                {dialogState.placeBidDlgStep === 0 && <PlaceBid />}
                {dialogState.placeBidDlgStep === 1 && <ReviewBidDetails />}
                {dialogState.placeBidDlgStep === 2 && <BidPlaceSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.changePriceDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, changePriceDlgOpened: false });
                }}
            >
                {dialogState.changePriceDlgStep === 0 && <ChangePrice />}
                {dialogState.changePriceDlgStep === 1 && <PriceChangeSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.cancelSaleDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, cancelSaleDlgOpened: false });
                }}
            >
                {dialogState.cancelSaleDlgStep === 0 && <CancelSale />}
                {dialogState.cancelSaleDlgStep === 1 && <CancelSaleSuccess />}
            </ModalDialog>
            <ModalDialog
                open={dialogState.allBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allBidDlgOpened: false });
                }}
            >
                {bidsList.length === 0 && myBidsList.length === 0 ? (
                    <NoBids
                        onClose={() => {
                            setDialogState({ ...dialogState, allBidDlgOpened: false });
                        }}
                    />
                ) : (
                    <AllBids
                        bidsList={bidsList}
                        myBidsList={myBidsList}
                        changeHandler={(value: TypeSelectItem | undefined) => setBidSortBy(value)}
                    />
                )}
            </ModalDialog>
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

export default SingleNFTAuction;
