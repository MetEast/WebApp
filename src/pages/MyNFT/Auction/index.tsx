import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, PinkButton, SecondaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import PriceHistoryView from 'src/components/PriceHistoryView';
import ProductTransHistory from 'src/components/ProductTransHistory';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import NFTBidTable from 'src/components/NFTBidTable';
import { getImageFromAsset, getUTCTime, getTime, reduceHexAddress, selectFromFavourites } from 'src/services/common';
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
    TypeNFTHisotry
} from 'src/types/product-types';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';
import { useCookies } from 'react-cookie';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ModalDialog from 'src/components/ModalDialog';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
import ReceivedBids from 'src/components/profile/ReceivedBids';
import { TypeSelectItem } from 'src/types/select-types';
import AllTransactions from 'src/components/profile/AllTransactions';
import { singleNFTBids } from 'src/constants/dummyData';

const MyNFTAuction: React.FC = (): JSX.Element => {
    const params = useParams(); // params.id
    const [signInDlgState, setSignInDlgState] = useSignInContext();
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
        txHash: ''
    };

    const [productDetail, setProductDetail] = useState<TypeProduct>(defaultValue);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();
    const [bidSortBy, setBidSortBy] = useState<TypeSelectItem>();
    // const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [viewBidDlgOpened, setViewBidDlgOpened] = useState<boolean>(false);
    const [dummyBidsList, setdummyBidsList] = useState<Array<TypeSingleNFTBid>>(singleNFTBids);

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
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.category = itemObject.category;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            product.orderId = itemObject.orderId;
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
            if (itemObject.event === 'Transfer') continue;
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
                // case 'Transfer':
                //     _transaction.type = enumTransactionType.Transfer;
                //     break;
                case 'SettleBidOrder':
                    _transaction.type = enumTransactionType.SettleBidOrder;
                    break;
            }
            _transaction.user = reduceHexAddress(itemObject.event === 'BuyOrder' ? itemObject.to : (itemObject.from === burnAddress ? itemObject.to : itemObject.from), 4); // no proper data
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
                if (itemObject.event === 'BuyOrder') _prodTrans.saleType = arrLatestTransaction[i + 2].event === "CreateOrderForSale" ? enumTransactionType.ForSale : enumTransactionType.OnAuction;
                _prodTrans.txHash = itemObject.tHash;  
                _prodTransHistory.push(_prodTrans);
            }
        }
        setTransactionsList(_latestTransList);
        setProdTransHistory(_prodTransHistory);
    };

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

        // let _myLatestBidsList: any = [];
        // for (let i = 0; i < arrLatestBid.yours.length; i++) {
        //     let itemObject: TypeSingleNFTBidFetch = arrLatestBid.yours[i];
        //     let _bid: TypeSingleNFTBid = { ...defaultBidValue };
        //     _bid.user = reduceHexAddress(itemObject.buyerAddr, 4); // no proper data username
        //     _bid.price = parseFloat(itemObject.price) / 1e18;
        //     _bid.orderId = itemObject.orderId;
        //     let timestamp = getTime(itemObject.timestamp);
        //     _bid.time = timestamp.date + ' ' + timestamp.time;
        //     _myLatestBidsList.push(_bid);
        // }
        // setMyBidsList(_myLatestBidsList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getProductDetail(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, []);

    useEffect(() => {
        getLatestTransaction();
    }, [transactionSortBy]);

    useEffect(() => {
        getLatestBid();
    }, [bidSortBy]);

    // change price tx fee
    const setChangePriceTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, changePriceTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setChangePriceTxFee();
    }, [dialogState.changePriceDlgStep]);

    // cancel sale tx fee
    const setCancelSaleTxFee = async () => {
        const walletConnectProvider: WalletConnectProvider = essentialsConnector.getWalletConnectProvider();
        const walletConnectWeb3 = new Web3(walletConnectProvider as any);
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, cancelSaleTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setCancelSaleTxFee();
    }, [dialogState.cancelSaleDlgStep]);

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
                    <Typography fontSize={56} fontWeight={700}>
                        {productDetail.name}
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.OnAuction} />
                        <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                        <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.endTime} />
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} marginTop={3} />
                    <PrimaryButton sx={{ marginTop: 3, width: '100%' }} onClick={() => setViewBidDlgOpened(true)}>
                        View Bids
                    </PrimaryButton>
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
                        <NFTBidTable bidsList={dummyBidsList} />
                        <NFTTransactionTable transactionsList={transactionsList} />
                        <PriceHistoryView />
                    </Stack>
                </Grid>
            </Grid>
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
            <ModalDialog
                open={viewBidDlgOpened}
                onClose={() => {
                    setViewBidDlgOpened(false);
                }}
            >
                {bidsList.length === 0 && (
                    <ReceivedBids
                        bidsList={bidsList}
                        closeDlg={() => setViewBidDlgOpened(false)}
                        changeHandler={(value: TypeSelectItem | undefined) => setBidSortBy(value)}
                    />
                )}
                {bidsList.length !== 0 && (
                    <ReceivedBids
                        bidsList={bidsList}
                        closeDlg={() => setViewBidDlgOpened(false)}
                        changeHandler={(value: TypeSelectItem | undefined) => setBidSortBy(value)}
                    />
                )}
            </ModalDialog>
        </>
    );
};

export default MyNFTAuction;
