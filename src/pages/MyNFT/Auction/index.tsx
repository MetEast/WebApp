import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PinkButton, PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import PriceHistoryView from 'src/components/PriceHistoryView';
import ProductTransHistory from 'src/components/ProductTransHistory';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import NFTBidTable from 'src/components/NFTBidTable';
import {
    enumBadgeType,
    enumTransactionType,
    TypeNFTHisotry,
    TypeNFTTransaction,
    TypeProduct,
    TypeSingleNFTBid,
} from 'src/types/product-types';
import { getMyNFTItem, getNFTLatestBids, getNFTLatestTxs } from 'src/services/fetch';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';
// import ChangePriceDlgContainer from 'src/components/TransactionDialogs/ChangePrice';
// import CancelSaleDlgContainer from 'src/components/TransactionDialogs/CancelSale';
// import AcceptBidDlgContainer from 'src/components/TransactionDialogs/AcceptBid';
// import ReceivedBidsDlgContainer from 'src/components/TransactionDialogs/ReceivedBids';
import { reduceHexAddress, reduceUserName } from 'src/services/common';
import { useSnackbar } from 'notistack';
import { serverConfig } from 'src/config';

const MyNFTAuction: React.FC = (): JSX.Element => {
    const params = useParams();
    const navigate = useNavigate();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [bidsList, setBidsList] = useState<Array<TypeSingleNFTBid>>([]);
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    // @ts-ignore
    let product: TypeProduct = location.state.product;

    useEffect(() => {
        let unmounted = false;
        const fetchMyNFTItem = async () => {
            const _MyNFTItem = await getMyNFTItem(params.id);
            _MyNFTItem.isLike = product.isLike;
            _MyNFTItem.views = product.views ? product.views : 0;
            _MyNFTItem.likes = product.likes ? product.likes : 0;
            _MyNFTItem.price_usd = product.price_usd;
            console.log(_MyNFTItem);

            const _NFTTxs = await getNFTLatestTxs(params.id);
            _NFTTxs.push({
                type: enumTransactionType.CreatedBy,
                user: _MyNFTItem.author,
                price: 0,
                time: _MyNFTItem.createTime,
                txHash: _MyNFTItem.txHash || '',
                saleType: enumTransactionType.CreatedBy,
            });
            const data: TypeNFTHisotry[] = [];
            _NFTTxs.map((tx: TypeNFTTransaction) => {
                if (
                    tx.type === enumTransactionType.SoldTo ||
                    tx.type === enumTransactionType.SettleBidOrder ||
                    tx.type === enumTransactionType.CreatedBy
                ) {
                    data.push({
                        saleType: tx.saleType,
                        type: tx.type,
                        user: tx.user,
                        price: tx.price,
                        time: tx.time,
                        txHash: tx.txHash,
                    });
                }
                return data;
            });

            if (!unmounted) {
                if (
                    !(
                        signInDlgState.address &&
                        _MyNFTItem.holder === signInDlgState.address &&
                        _MyNFTItem.status === '2'
                    )
                ) {
                    navigate(-1);
                    // detect previous path is null
                    const timer = setTimeout(() => {
                        clearTimeout(timer);
                        if (
                            !(
                                signInDlgState.address &&
                                _MyNFTItem.holder === signInDlgState.address &&
                                _MyNFTItem.status === '2'
                            )
                        ) {
                            navigate('/');
                        }
                    }, 100);
                } else {
                    setProductDetail(_MyNFTItem);
                    setDialogState({ ...dialogState, burnTokenId: _MyNFTItem.tokenId });
                    setTransactionsList(_NFTTxs);
                    setProdTransHistory(data.slice(0, 5));
                }
            }
        };
        if (signInDlgState.isLoggedIn) {
            if (signInDlgState.address) fetchMyNFTItem().catch(console.error);
        } else navigate('/');
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInDlgState.isLoggedIn, signInDlgState.address, params.id]);

    useEffect(() => {
        let unmounted = false;
        const fetchNFTLatestBids = async () => {
            const _NFTBids = await getNFTLatestBids(params.id, signInDlgState.address, 1, 5);
            if (!unmounted) {
                setBidsList(_NFTBids.all);
            }
        };
        if (signInDlgState.address) fetchNFTLatestBids().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.address, params.id]);

    useEffect(() => {
        let unmounted = false;
        const updateProductViews = (tokenId: string) => {
            const reqUrl = `${serverConfig.metServiceUrl}/api/v1/incTokenViews`;
            const reqBody = {
                tokenId: tokenId,
                address: signInDlgState.address,
            };
            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${signInDlgState.token}`,
                },
                body: JSON.stringify(reqBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === 200) {
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
        };
        if (productDetail.tokenId && signInDlgState.isLoggedIn && signInDlgState.token && signInDlgState.address)
            updateProductViews(productDetail.tokenId);
        return () => {
            unmounted = true;
        };
    }, [productDetail.tokenId, signInDlgState.isLoggedIn, signInDlgState.token, signInDlgState.address]);

    const OperationButtons = (product: TypeProduct) => {
        if (product.holder === signInDlgState.address) {
            if (product.status === '2') {
                if (!product.isExpired) {
                    if (product.bids === 0) {
                        return (
                            <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                                <PinkButton
                                    disabled={productDetail.bids > 0}
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
                                            setSignInDlgState((prevState: SignInState) => {
                                                const _state = { ...prevState };
                                                _state.signInDlgOpened = true;
                                                return _state;
                                            });
                                        }
                                    }}
                                >
                                    Cancel Sale
                                </PinkButton>
                                <SecondaryButton
                                    disabled={productDetail.bids > 0}
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
                                            setSignInDlgState((prevState: SignInState) => {
                                                const _state = { ...prevState };
                                                _state.signInDlgOpened = true;
                                                return _state;
                                            });
                                        }
                                    }}
                                >
                                    Change Price
                                </SecondaryButton>
                            </Stack>
                        );
                    } else {
                        return (
                            <PrimaryButton
                                sx={{ marginTop: 3, width: '100%' }}
                                onClick={() => {
                                    if (signInDlgState.isLoggedIn) {
                                        if (bidsList.length) {
                                            setDialogState({
                                                ...dialogState,
                                                receivedBidDlgOpened: true,
                                            });
                                        } else {
                                            setDialogState({
                                                ...dialogState,
                                                noBidDlgOpened: true,
                                            });
                                        }
                                    } else {
                                        setSignInDlgState((prevState: SignInState) => {
                                            const _state = { ...prevState };
                                            _state.signInDlgOpened = true;
                                            return _state;
                                        });
                                    }
                                }}
                            >
                                View Bids
                            </PrimaryButton>
                        );
                    }
                } else {
                    return (
                        <Stack direction="row" alignItems="center" spacing={2} marginTop={3}>
                            <SecondaryButton
                                sx={{ width: '100%', height: 40 }}
                                onClick={() => {
                                    if (signInDlgState.isLoggedIn) {
                                        const topBid = bidsList.length ? bidsList[0].price : 0;
                                        const bidPrice = topBid > 0 ? topBid : 0;
                                        const biderName =
                                            topBid > 0
                                                ? bidsList[0].user
                                                : productDetail.holderName
                                                ? productDetail.holderName
                                                : reduceHexAddress(productDetail.holder, 4);
                                        const bidOrderId =
                                            topBid > 0 ? bidsList[0].orderId : productDetail.orderId || '';
                                        setDialogState({
                                            ...dialogState,
                                            acceptBidDlgOpened: true,
                                            acceptBidDlgStep: 0,
                                            acceptBidName: biderName,
                                            acceptBidOrderId: bidOrderId,
                                            acceptBidPrice: bidPrice,
                                            progressBar: 0,
                                        });
                                    } else {
                                        setSignInDlgState((prevState: SignInState) => {
                                            const _state = { ...prevState };
                                            _state.signInDlgOpened = true;
                                            return _state;
                                        });
                                    }
                                }}
                            >
                                Settle Auction
                            </SecondaryButton>
                        </Stack>
                    );
                }
            } else if (product.status === '2' || product.status === '3') {
                return (
                    <PrimaryButton
                        sx={{ marginTop: 3, width: '100%' }}
                        onClick={() => {
                            if (productDetail.status === 'DELETED') {
                                enqueueSnackbar(`This NFT is taken down by admin!`, {
                                    variant: 'error',
                                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                                });
                            } else {
                                setDialogState({
                                    ...dialogState,
                                    mintTokenId: productDetail.tokenIdHex,
                                    createNFTDlgOpened: true,
                                    createNFTDlgStep: 3,
                                });
                            }
                        }}
                    >
                        Sell
                    </PrimaryButton>
                );
            }
        }
        return <></>;
    };

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5} rowGap={1}>
                <Grid item xs={12} md={6}>
                    {productDetail.tokenId === '' ? (
                        <Box
                            position="relative"
                            borderRadius={4}
                            overflow="hidden"
                            sx={{ width: '100%', paddingTop: '75%' }}
                        >
                            <Box position="absolute" sx={{ inset: 0 }}>
                                <Skeleton
                                    variant="rectangular"
                                    animation="wave"
                                    width="100%"
                                    height="100%"
                                    sx={{ bgcolor: '#E8F4FF' }}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <ProductImageContainer
                            product={productDetail}
                            updateLikes={(type: string) => {
                                let prodDetail: TypeProduct = { ...productDetail };
                                if (type === 'inc') {
                                    prodDetail.likes += 1;
                                } else if (type === 'dec') {
                                    prodDetail.likes -= 1;
                                }
                                setProductDetail(prodDetail);
                            }}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    {productDetail.tokenId === '' ? (
                        <>
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={45}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF' }}
                            />
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={45}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF', marginTop: 2 }}
                            />
                            <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height={56}
                                sx={{ borderRadius: 2, bgcolor: '#E8F4FF', marginTop: 3 }}
                            />
                        </>
                    ) : (
                        <>
                            <Typography fontSize={56} fontWeight={700} lineHeight={1}>
                                {productDetail.name.length > 40
                                    ? reduceUserName(productDetail.name, 20)
                                    : productDetail.name}
                            </Typography>
                            <ProductSnippets
                                nickname={productDetail.author}
                                likes={productDetail.likes}
                                views={productDetail.views}
                                sx={{ marginTop: 1 }}
                            />
                            <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                                <ProductBadge badgeType={enumBadgeType.OnAuction} />
                                {/*{productDetail.bids > 0 && (*/}
                                {/*    <ProductBadge badgeType={enumBadgeType.ReservePriceNotMet} />*/}
                                {/*)}*/}
                                {productDetail.isExpired ? (
                                    <ProductBadge badgeType={enumBadgeType.SaleEnded} />
                                ) : (
                                    <ProductBadge badgeType={enumBadgeType.SaleEnds} content={productDetail.endTime} />
                                )}
                            </Stack>
                            <ELAPrice
                                price_ela={productDetail.price_ela}
                                price_usd={productDetail.price_usd}
                                marginTop={3}
                            />
                            <OperationButtons {...productDetail} />
                        </>
                    )}
                </Grid>
            </Grid>
            {productDetail.tokenId === '' ? (
                <Box position="relative" marginTop={5} sx={{ width: '100%', paddingTop: '75%' }}>
                    <Box position="absolute" sx={{ inset: 0 }}>
                        <Skeleton
                            variant="rectangular"
                            animation="wave"
                            width="100%"
                            height="100%"
                            sx={{ borderRadius: 4, bgcolor: '#E8F4FF' }}
                        />
                    </Box>
                </Box>
            ) : (
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
                            <PriceHistoryView
                                createdTime={productDetail.timestamp ? productDetail.timestamp : 1640962800}
                                creator={productDetail.author}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            )}
            {/* <ChangePriceDlgContainer />
            <CancelSaleDlgContainer />
            <AcceptBidDlgContainer />
            <ReceivedBidsDlgContainer /> */}
        </Container>
    );
};

export default MyNFTAuction;
