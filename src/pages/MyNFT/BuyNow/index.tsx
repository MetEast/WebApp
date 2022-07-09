import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Stack, Grid, Box, Skeleton, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton, PinkButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import PriceHistoryView from 'src/components/PriceHistoryView';
import ProductTransHistory from 'src/components/ProductTransHistory';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import { getMintCategory } from 'src/services/common';
import {
    enumBadgeType,
    TypeProduct,
    TypeNFTTransaction,
    TypeNFTHisotry,
    enumTransactionType,
} from 'src/types/product-types';
import { getMyNFTItem, getELA2USD, getMyFavouritesList, getNFTLatestTxs, getNFTLatestTxs2 } from 'src/services/fetch';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';
// import ChangePriceDlgContainer from 'src/components/TransactionDialogs/ChangePrice';
// import CancelSaleDlgContainer from 'src/components/TransactionDialogs/CancelSale';
import { reduceUserName } from 'src/services/common';
import { useSnackbar } from 'notistack';

const MyNFTBuyNow: React.FC = (): JSX.Element => {
    const params = useParams();
    const navigate = useNavigate();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
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
            _MyNFTItem.price_usd = product.price_usd

            if (!unmounted) {
                setProductDetail(_MyNFTItem);
            }
        };
        if (signInDlgState.isLoggedIn) {
            if (signInDlgState.address && signInDlgState.walletAccounts.length) fetchMyNFTItem().catch(console.error);
        } else navigate('/');
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.walletAccounts, signInDlgState.address, params.id]);

    useEffect(() => {
        let unmounted = false;
        const fetchLatestTxs = async () => {
            const _NFTTxs = await getNFTLatestTxs2(params.id);
            if (!unmounted) {
                let nftTx = _NFTTxs.slice(0, 5);
                nftTx.push({
                    type: enumTransactionType.CreatedBy,
                    user: productDetail.author,
                    price: 0,
                    time: productDetail.createTime,
                    txHash: ''
                })
                setTransactionsList(nftTx);
                const data: TypeNFTHisotry[] = [];
                _NFTTxs.map((tx: TypeNFTTransaction) => {
                    if(tx.type === enumTransactionType.SoldTo) {
                        data.push({saleType: tx.type, type: tx.type, user: tx.user, price: tx.price, time: tx.time, txHash: tx.txHash})
                    }
                })
                setProdTransHistory(data.slice(0, 5));
            }
        };
        if (signInDlgState.walletAccounts.length) fetchLatestTxs().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [params.id, signInDlgState.walletAccounts]);

    useEffect(() => {
        let unmounted = false;
        const updateProductViews = (tokenId: string) => {
            const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/incTokenViews`;
            const reqBody = {
                tokenId: tokenId,
                address: signInDlgState.address,
            };
            fetch(reqUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${signInDlgState.token}`,
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

    function ButtonGroup(product: TypeProduct) {
        if(product.orderId) {
            if(product.status === "1") {
                if(!product.isBlindbox) {
                    if(product.holder === signInDlgState.address) {
                        return (
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
                                            setSignInDlgState((prevState: SignInState) => {
                                                const _state = { ...prevState };
                                                _state.signInDlgOpened = true;
                                                return _state;
                                            });
                                        }
                                    }}
                                >
                                    Change Price
                                </PrimaryButton>
                            </Stack>
                        )
                    } else {
                        return (
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
                                        setSignInDlgState((prevState: SignInState) => {
                                            const _state = { ...prevState };
                                            _state.signInDlgOpened = true;
                                            return _state;
                                        });
                                    }
                                }}
                            >
                                buy now
                            </PrimaryButton>
                        )
                    }
                }
            } else if(product.status === "2" || product.status === "3") {
                if(product.holder === signInDlgState.address) {
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
                    )
                }
            }

            return (<></>)
        } else {
            if(product.royaltyOwner === signInDlgState.address) {
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
                    >Sell</PrimaryButton>
                )
            } else {
                return (<></>)
            }
        }
    }

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
                                {/*<ProductBadge badgeType={enumBadgeType.BuyNow} />*/}
                                <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                            </Stack>
                            <ELAPrice
                                price_ela={productDetail.price_ela}
                                price_usd={productDetail.price_usd}
                                marginTop={3}
                            />
                            <ButtonGroup {...productDetail} />
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
                            <PriceHistoryView
                                createdTime={productDetail.timestamp ? productDetail.timestamp : 1640962800}
                                creator={productDetail.author}
                            />
                            <NFTTransactionTable transactionsList={transactionsList} />
                        </Stack>
                    </Grid>
                </Grid>
            )}
            {/* <ChangePriceDlgContainer />
            <CancelSaleDlgContainer /> */}
        </Container>
    );
};

export default MyNFTBuyNow;
