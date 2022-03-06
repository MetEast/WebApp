import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Grid, Typography, Skeleton } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import {
    enumBadgeType,
    enumSingleNFTType,
    TypeProductFetch,
    TypeNFTTransactionFetch,
    enumTransactionType,
    TypeFavouritesFetch,
} from 'src/types/product-types';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton, PinkButton } from 'src/components/Buttons/styles';
import ELAPrice from 'src/components/ELAPrice';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import SingleNFTMoreInfo from 'src/components/SingleNFTMoreInfo';
import { TypeNFTTransaction, TypeProduct } from 'src/types/product-types';
import {
    getImageFromAsset,
    getMintCategory,
    getTime,
    getUTCTime,
    reduceHexAddress,
    selectFromFavourites,
} from 'src/services/common';
import { FETCH_CONFIG_JSON, getELA2USD, getMyFavouritesList, getNFTItem } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import ModalDialog from 'src/components/ModalDialog';
import BuyNow from 'src/components/TransactionDialogs/BuyNow/BuyNow';
import PurchaseSuccess from 'src/components/TransactionDialogs/BuyNow/PurchaseSuccess';
import AllTransactions from 'src/components/profile/AllTransactions';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { TypeSelectItem } from 'src/types/select-types';
import ChangePrice from 'src/components/TransactionDialogs/ChangePrice/ChangePrice';
import PriceChangeSuccess from 'src/components/TransactionDialogs/ChangePrice/PriceChangeSuccess';
import CancelSale from 'src/components/TransactionDialogs/CancelSale/CancelSale';
import CancelSaleSuccess from 'src/components/TransactionDialogs/CancelSale/CancelSaleSuccess';
import { isInAppBrowser } from 'src/services/wallet';
import Container from 'src/components/Container';
import { blankNFTItem, blankNFTTxs } from 'src/constants/init-constants';

const SingleNFTFixedPrice: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [transactionSortBy, setTransactionSortBy] = useState<TypeSelectItem>();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const walletConnectWeb3 = new Web3(walletConnectProvider as any);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const _NFTItem = await getNFTItem(`tokenId=${params.id}`, ELA2USD, likeList);
            if (!unmounted) {
                setProductDetail(_NFTItem);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid]);

    // -------------- Fetch Data -------------- //
    
    const getLatestTransaction = async () => {
        const resLatestTransaction = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`,
            FETCH_CONFIG_JSON,
        );
        const dataLatestTransaction = await resLatestTransaction.json();
        const arrLatestTransaction = dataLatestTransaction.data;

        let _latestTransList: any = [];
        for (let i = 0; i < arrLatestTransaction.length; i++) {
            let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
            if (itemObject.event === 'Transfer') continue;
            var _transaction: TypeNFTTransaction = { ...blankNFTTxs };
            switch (itemObject.event) {
                case 'Mint':
                    _transaction.type = enumTransactionType.CreatedBy;
                    _transaction.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
                case 'CreateOrderForSale':
                    _transaction.type = enumTransactionType.ForSale;
                    _transaction.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'CreateOrderForAuction':
                    _transaction.type = enumTransactionType.OnAuction;
                    _transaction.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'BidOrder':
                    _transaction.type = enumTransactionType.Bid;
                    _transaction.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
                case 'ChangeOrderPrice':
                    _transaction.type = enumTransactionType.PriceChanged;
                    _transaction.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'CancelOrder':
                    _transaction.type = enumTransactionType.SaleCanceled;
                    _transaction.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                    break;
                case 'BuyOrder':
                    _transaction.type = enumTransactionType.SoldTo;
                    _transaction.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                    break;
                // case 'Transfer':
                //     _transaction.type = enumTransactionType.Transfer;
                //     break;
                case 'SettleBidOrder':
                    _transaction.type = enumTransactionType.SettleBidOrder;
                    _transaction.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
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

    const setBuyNowTxFee = async () => {
        const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
        setDialogState({ ...dialogState, buyNowTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
    };

    useEffect(() => {
        setBuyNowTxFee();
    }, [dialogState.buyNowDlgStep]);

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
        <Container>
            <ProductPageHeader />
            <Grid container marginTop={6} columnSpacing={5}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <ProductImageContainer product={productDetail} updateLikes={updateProductLikes} />
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography noWrap fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700}>
                        {productDetail.name ? (
                            productDetail.name
                        ) : (
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                sx={{ borderRadius: 4.5, bgcolor: '#E8F4FF' }}
                            />
                        )}
                    </Typography>
                    <ProductSnippets
                        nickname={productDetail.author}
                        likes={productDetail.likes}
                        views={productDetail.views}
                    />
                    <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                        <ProductBadge badgeType={enumBadgeType.BuyNow} />
                        <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                    </Stack>
                    <ELAPrice
                        price_ela={productDetail.price_ela}
                        price_usd={productDetail.price_usd}
                        detail_page={true}
                        marginTop={3}
                    />
                    {signInDlgState.walletAccounts !== [] &&
                    productDetail.holder !== signInDlgState.walletAccounts[0] ? (
                        <PrimaryButton
                            sx={{ marginTop: 3, width: '100%' }}
                            onClick={() => {
                                if (signInDlgState.isLoggedIn) {
                                    setDialogState({
                                        ...dialogState,
                                        buyNowDlgOpened: true,
                                        buyNowDlgStep: 0,
                                        buyNowPrice: productDetail.price_ela,
                                        buyNowName: productDetail.name,
                                        buyNowOrderId: productDetail.orderId || '',
                                    });
                                } else {
                                    setSignInDlgState({ ...signInDlgState, signInDlgOpened: true });
                                }
                            }}
                        >
                            buy now
                        </PrimaryButton>
                    ) : (
                        <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                            <PinkButton
                                sx={{ width: '100%' }}
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
                            <PrimaryButton
                                sx={{ width: '100%' }}
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
                            </PrimaryButton>
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
                        marginTop={5}
                        vertically={true}
                    />
                </Grid>
                <Grid item md={8} xs={12}>
                    <PriceHistoryView />
                    <NFTTransactionTable transactionsList={transactionsList} />
                </Grid>
            </Grid>
            <ModalDialog
                open={dialogState.buyNowDlgOpened}
                onClose={() => {
                    setDialogState({ ...dialogState, buyNowDlgOpened: false });
                }}
            >
                {dialogState.buyNowDlgStep === 0 && <BuyNow />}
                {dialogState.buyNowDlgStep === 1 && <PurchaseSuccess />}
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
        </Container>
    );
};

export default SingleNFTFixedPrice;
