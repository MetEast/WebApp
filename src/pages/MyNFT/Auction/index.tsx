import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Box, Typography } from '@mui/material';
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
    TypeNFTHisotry,
} from 'src/types/product-types';
import { FETCH_CONFIG_JSON, getELA2USD, getMyFavouritesList } from 'src/services/fetch';
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
import AllBids from 'src/components/TransactionDialogs/AllBids/AllBids';
import AcceptBid from 'src/components/TransactionDialogs/AcceptBid/AcceptBid';
import SaleSuccess from 'src/components/TransactionDialogs/AcceptBid/SaleSuccess';
import NoBids from 'src/components/TransactionDialogs/AllBids/NoBids';
import { isInAppBrowser } from 'src/services/wallet';
import Container from 'src/components/Container';
import { blankNFTItem, blankNFTBid, blankMyNFTHistory, blankNFTTxs } from 'src/constants/init-constants';

const MyNFTAuction: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();
    const [bidSortBy, setBidSortBy] = useState<TypeSelectItem>();
    // const [myBidsList, setMyBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const [viewBidDlgOpened, setViewBidDlgOpened] = useState<boolean>(false);

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
        const prodDetail = dataProductDetail.data;
        var product: TypeProduct = { ...blankNFTItem };

        if (prodDetail !== undefined) {
            const itemObject: TypeProductFetch = prodDetail;
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
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
            product.author =
                itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
            product.authorDescription = itemObject.authorDescription || ' ';
            product.authorImg = product.image; // -- no proper value
            product.authorAddress = itemObject.royaltyOwner;
            product.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
            product.holder = itemObject.holder;
            product.tokenIdHex = itemObject.tokenIdHex;
            product.category = itemObject.category;
            product.royalties = parseInt(itemObject.royalties) / 1e4;
            product.orderId = itemObject.orderId;
            product.status = itemObject.status;
            let createTime = getUTCTime(itemObject.createTime);
            product.createTime = createTime.date + '' + createTime.time;
            if (itemObject.endTime) {
                let endTime = getTime(itemObject.endTime); // no proper value
                product.endTime = endTime.date + ' ' + endTime.time;
            } else {
                product.endTime = '';
            }
            product.isExpired = Math.round(new Date().getTime() / 1000) > parseInt(itemObject.endTime);
        }
        setProductDetail(product);
    };

    const getFetchData = async () => {
        getProductDetail(
            await getELA2USD(),
            await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid),
        );
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
            let _transaction: TypeNFTTransaction = { ...blankNFTTxs };
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

            if (itemObject.event === 'Mint' || itemObject.event === 'BuyOrder') {
                let _prodTrans: TypeNFTHisotry = { ...blankMyNFTHistory };
                _prodTrans.type =
                    itemObject.event === 'Mint'
                        ? 'Created'
                        : itemObject.to === signInDlgState.walletAccounts[0]
                        ? 'Bought From'
                        : 'Sold To';
                _prodTrans.price = parseInt(itemObject.price) / 1e18;
                _prodTrans.user = reduceHexAddress(
                    _prodTrans.type === 'Bought From' ? itemObject.from : itemObject.to,
                    4,
                ); // no proper data
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

    const getLatestBid = async () => {
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
            let _bid: TypeSingleNFTBid = { ...blankNFTBid };
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

    useEffect(() => {
        getLatestBid();
    }, [bidSortBy]);

    // change price tx fee
    const setChangePriceTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, changePriceTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setChangePriceTxFee();
    }, [dialogState.changePriceDlgStep]);

    // cancel sale tx fee
    const setCancelSaleTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, cancelSaleTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setCancelSaleTxFee();
    }, [dialogState.cancelSaleDlgStep]);

    // accept bid tx Fee
    const setAcceptBidTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, acceptBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setAcceptBidTxFee();
    }, [dialogState.acceptBidDlgStep]);

    const updateProductLikes = (type: string) => {
        let prodDetail: TypeProduct = { ...productDetail };
        if (type === 'inc') {
            prodDetail.likes += 1;
        } else if (type === 'dec') {
            prodDetail.likes -= 1;
        }
        setProductDetail(prodDetail);
    };

    const updateProductViews = (tokenId: string) => {
        if (signInDlgState.isLoggedIn && tokenId) {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
            const reqBody = {
                token: signInDlgState.token,
                tokenId: tokenId,
                did: signInDlgState.userDid,
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
            <Grid container marginTop={5} columnSpacing={5} rowGap={1}>
                <Grid item xs={12} md={6}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item xs={12} md={6}>
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
                        {productDetail.status !== 'HAS BIDS' && (
                            <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />
                        )}
                        {productDetail.isExpired ? (
                            <ProductBadge badgeType={enumBadgeType.SaleEnded} />
                        ) : (
                            <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.endTime} />
                        )}
                    </Stack>
                    <ELAPrice price_ela={productDetail.price_ela} price_usd={productDetail.price_usd} marginTop={3} />
                    {productDetail.status === 'HAS BIDS' && (
                        <PrimaryButton sx={{ marginTop: 3, width: '100%' }} onClick={() => setViewBidDlgOpened(true)}>
                            View Bids
                        </PrimaryButton>
                    )}
                    <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                        <PinkButton
                            disabled={productDetail.status === 'HAS BIDS'}
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
                            disabled={productDetail.status === 'HAS BIDS'}
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
                    {productDetail.isExpired && (
                        <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                            <SecondaryButton
                                sx={{ width: '100%', height: 40 }}
                                onClick={() => {
                                    if (signInDlgState.isLoggedIn) {
                                        setDialogState({
                                            ...dialogState,
                                            acceptBidDlgOpened: true,
                                            acceptBidDlgStep: 0,
                                            acceptBidName: bidsList[0].user,
                                            acceptBidOrderId: bidsList[0].orderId || '',
                                            acceptBidPrice: bidsList[0].price,
                                        });
                                    } else {
                                        setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                    }
                                }}
                            >
                                Settle Auction
                            </SecondaryButton>
                        </Stack>
                    )}
                </Grid>
            </Grid>
            <Grid container marginTop={5} columnSpacing={10} rowGap={5}>
                <Grid item xs={12} md={4}>
                    <Stack spacing={5}>
                        <ProductTransHistory historyList={prodTransHistory} />
                        <ProjectDescription description={productDetail.description} />
                        <Box>
                            <Grid container columnSpacing={10} rowGap={5}>
                                <Grid item xs={12} sm={6} md={12}>
                                    <AboutAuthor
                                        name={productDetail.author}
                                        description={productDetail.authorDescription}
                                        img={productDetail.authorImg}
                                        address={productDetail.authorAddress}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={12}>
                                    <ChainDetails
                                        tokenId={productDetail.tokenIdHex}
                                        ownerName={productDetail.holderName}
                                        ownerAddress={productDetail.holder}
                                        royalties={productDetail.royalties}
                                        createTime={productDetail.createTime}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Stack spacing={10}>
                        {bidsList.length !== 0 && <NFTBidTable bidsList={bidsList} />}
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
                open={dialogState.acceptBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, acceptBidDlgOpened: false });
                }}
            >
                {dialogState.acceptBidDlgStep === 0 && <AcceptBid />}
                {dialogState.acceptBidDlgStep === 1 && <SaleSuccess />}
            </ModalDialog>
            <ModalDialog
                open={viewBidDlgOpened}
                onClose={() => {
                    setViewBidDlgOpened(false);
                }}
            >
                {bidsList.length === 0 ? (
                    <NoBids onClose={() => setViewBidDlgOpened(false)} />
                ) : (
                    <ReceivedBids
                        bidsList={bidsList}
                        closeDlg={() => setViewBidDlgOpened(false)}
                        changeHandler={(value: TypeSelectItem | undefined) => setBidSortBy(value)}
                    />
                )}
            </ModalDialog>
            <ModalDialog
                open={dialogState.allBidDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, allBidDlgOpened: false });
                }}
            >
                {bidsList.length === 0 ? (
                    <NoBids
                        onClose={() => {
                            setDialogState({ ...dialogState, allBidDlgOpened: false });
                        }}
                    />
                ) : (
                    <AllBids
                        bidsList={bidsList}
                        myBidsList={[]}
                        changeHandler={(value: TypeSelectItem | undefined) => setBidSortBy(value)}
                    />
                )}
            </ModalDialog>
        </Container>
    );
};

export default MyNFTAuction;
