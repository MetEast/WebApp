import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ProductPageHeader from 'src/components/ProductPageHeader';
import { Stack, Grid, Box, Skeleton, Typography } from '@mui/material';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import { PrimaryButton } from 'src/components/Buttons/styles';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import ChainDetails from 'src/components/SingleNFTMoreInfo/ChainDetails';
import NFTTransactionTable from 'src/components/NFTTransactionTable';
import PriceHistoryView from 'src/components/PriceHistoryView';
import ProductTransHistory from 'src/components/ProductTransHistory';
import { getMintCategory } from 'src/services/common';
import {
    enumBadgeType,
    TypeProduct,
    TypeNFTTransaction,
    TypeNFTHisotry,
    enumTransactionType,
} from 'src/types/product-types';
import { getMyNFTItem, getNFTLatestTxs } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';
import { reduceUserName } from 'src/services/common';
import { serverConfig } from 'src/config';

const MyNFTCreated: React.FC = (): JSX.Element => {
    const params = useParams();
    const navigate = useNavigate();
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [productDetail, setProductDetail] = useState<TypeProduct>(blankNFTItem);
    const [prodTransHistory, setProdTransHistory] = useState<Array<TypeNFTHisotry>>([]);
    const [transactionsList, setTransactionsList] = useState<Array<TypeNFTTransaction>>([]);

    const location = useLocation();

    // @ts-ignore
    let product: TypeProduct = location.state.product;

    useEffect(() => {
        let unmounted = false;
        const fetchMyNFTItem = async () => {
            const _MyNFTItem = await getMyNFTItem(params.id);
            _MyNFTItem.isLike = product.isLike;
            _MyNFTItem.views = product.views;
            _MyNFTItem.likes = product.likes;
            _MyNFTItem.price_usd = product.price_usd;

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
                        _MyNFTItem.status === '0' &&
                        _MyNFTItem.royaltyOwner === signInDlgState.address
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
                                _MyNFTItem.status === '0' &&
                                _MyNFTItem.royaltyOwner === signInDlgState.address
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

    useEffect(() => {
        if (productDetail.tokenId) setDialogState({ ...dialogState, burnTokenId: productDetail.tokenId });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialogState.burnNFTDlgOpened, productDetail.tokenId]);

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
                                setProductDetail((prevState: TypeProduct) => {
                                    const prodDetail: TypeProduct = { ...prevState };
                                    if (type === 'inc') {
                                        prodDetail.likes++;
                                    } else if (type === 'dec') {
                                        prodDetail.likes--;
                                    }
                                    return prodDetail;
                                });
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
                                <ProductBadge badgeType={enumBadgeType.Created} />
                                <ProductBadge badgeType={getMintCategory(productDetail.category)} />
                            </Stack>
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
        </Container>
    );
};

export default MyNFTCreated;
