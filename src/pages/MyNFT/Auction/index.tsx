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
import {
    enumBadgeType,
    TypeProduct,
    TypeNFTTransaction,
    TypeSingleNFTBid,
    TypeNFTHisotry,
} from 'src/types/product-types';
import { getMyNFTItem, getELA2USD, getMyFavouritesList, getNFTLatestTxs, getNFTLatestBids } from 'src/services/fetch';
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
import { blankNFTItem } from 'src/constants/init-constants';

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

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const _MyNFTItem = await getMyNFTItem(params.id, ELA2USD, likeList);
            if (!unmounted) {
                setProductDetail(_MyNFTItem);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, params.id]);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _NFTTxs = await getNFTLatestTxs(params.id, signInDlgState.walletAccounts[0], 1, 5);
            if (!unmounted) {
                setTransactionsList(_NFTTxs.txs);
                setProdTransHistory(_NFTTxs.history);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [transactionSortBy, params.id, signInDlgState.walletAccounts]);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const _NFTBids = await getNFTLatestBids(params.id, signInDlgState.walletAccounts[0], 1, 5);
            if (!unmounted) {
                setBidsList(_NFTBids.others);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [bidSortBy, signInDlgState.walletAccounts, params.id]);

    // change price tx fee
    useEffect(() => {
        const setChangePriceTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, changePriceTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setChangePriceTxFee();
    }, [dialogState.changePriceDlgStep]);

    // cancel sale tx fee
    useEffect(() => {
        const setCancelSaleTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, cancelSaleTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
        setCancelSaleTxFee();
    }, [dialogState.cancelSaleDlgStep]);

    // accept bid tx Fee
    useEffect(() => {
        const setAcceptBidTxFee = async () => {
            const gasPrice: string = await walletConnectWeb3.eth.getGasPrice();
            setDialogState({ ...dialogState, acceptBidTxFee: (parseFloat(gasPrice) * 5000000) / 1e18 });
        };
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

    useEffect(() => {
        let unmounted = false;
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
                            if (!unmounted) {
                                setProductDetail((prevState: TypeProduct) => {
                                    const prodDetail: TypeProduct = { ...prevState };
                                    prodDetail.views += 1;
                                    return prodDetail;
                                });
                            }
                        } else {
                            console.log(data);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        };
        updateProductViews(productDetail.tokenId);
        return () => {
            unmounted = true;
        };
    }, [productDetail.tokenId, signInDlgState.token, signInDlgState.userDid]);

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
