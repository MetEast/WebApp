import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Stack, Grid, Box, Skeleton, Typography } from '@mui/material';
import ProductPageHeader from 'src/components/ProductPageHeader';
import ProductImageContainer from 'src/components/ProductImageContainer';
import ProductSnippets from 'src/components/ProductSnippets';
import ProductBadge from 'src/components/ProductBadge';
import ELAPrice from 'src/components/ELAPrice';
import { PrimaryButton } from 'src/components/Buttons/styles';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { enumBadgeType, enumBlindBoxNFTType, TypeProduct } from 'src/types/product-types';
import { getBBItem, getELA2USD, getNFTItems, checkBlindBoxLike } from 'src/services/fetch';
import Container from 'src/components/Container';
import { blankBBItem } from 'src/constants/init-constants';
import ProjectDescription from 'src/components/SingleNFTMoreInfo/ProjectDescription';
import AboutAuthor from 'src/components/SingleNFTMoreInfo/AboutAuthor';
import NFTPreview from 'src/components/NFTPreview';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import { reduceUserName } from 'src/services/common';
import { serverConfig } from 'src/config';

const BlindBoxProduct: React.FC = (): JSX.Element => {
    const params = useParams();
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [blindBoxDetail, setBlindBoxDetail] = useState<TypeProduct>(blankBBItem);
    const [pageType, setPageType] = useState<'details' | 'sold'>('details');
    const [nftSoldList, setNftSoldList] = useState<Array<TypeProduct>>([]);
    const location = useLocation();

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            if (!unmounted) setIsLoading(true);
            const ELA2USD = await getELA2USD();
            const _BBItem = await getBBItem(params.id, ELA2USD);
            // @ts-ignore
            if (signInDlgState.isLoggedIn) _BBItem.isLike = location.state && location.state?.isLoggedIn ? location.state.isLiked : await checkBlindBoxLike(params.id || '', signInDlgState.address);

            const _BBSoldNFTs = await getNFTItems(_BBItem.soldIds?.join(','));
            if (!unmounted) {
                setBlindBoxDetail(_BBItem);
                setNftSoldList(_BBSoldNFTs);
                setIsLoading(false);
            }
        };
        if ((signInDlgState.isLoggedIn && signInDlgState.address) || !signInDlgState.isLoggedIn)
            getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInDlgState.isLoggedIn, signInDlgState.address, params.id]);

    useEffect(() => {
        let unmounted = false;
        const updateBlindBoxViews = (tokenId: string) => {
            const reqUrl = `${serverConfig.metServiceUrl}/api/v1/incBlindBoxViews`;
            const reqBody = {
                blindBoxIndex: tokenId,
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
                            setBlindBoxDetail((prevState: TypeProduct) => {
                                const blindDetail: TypeProduct = { ...prevState };
                                blindDetail.views += 1;
                                return blindDetail;
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
        if (blindBoxDetail.tokenId && signInDlgState.isLoggedIn && signInDlgState.token && signInDlgState.address)
            updateBlindBoxViews(blindBoxDetail.tokenId);
        return () => {
            unmounted = true;
        };
    }, [blindBoxDetail.tokenId, signInDlgState.isLoggedIn, signInDlgState.token, signInDlgState.address]);

    return (
        <Container sx={{ paddingTop: { xs: 4, sm: 0 } }}>
            <ProductPageHeader />
            <Grid container marginTop={5} columnSpacing={5} rowGap={2}>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    {blindBoxDetail.tokenId === '' ? (
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
                            product={blindBoxDetail}
                            updateLikes={(type: string) => {
                                setBlindBoxDetail((prevState: TypeProduct) => {
                                    const blindDetail: TypeProduct = { ...prevState };
                                    if (type === 'inc') {
                                        blindDetail.likes++;
                                    } else if (type === 'dec') {
                                        blindDetail.likes--;
                                    }
                                    return blindDetail;
                                });
                            }}
                            isBlindBox={true}
                        />
                    )}
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                    {blindBoxDetail.tokenId === '' ? (
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
                            <Typography fontSize={{ md: 56, sm: 42, xs: 32 }} fontWeight={700} lineHeight={1}>
                                {blindBoxDetail.name.length > 40
                                    ? reduceUserName(blindBoxDetail.name, 20)
                                    : blindBoxDetail.name}
                            </Typography>
                            <ProductSnippets
                                nickname={blindBoxDetail.author}
                                sold={blindBoxDetail.sold}
                                instock={blindBoxDetail.instock}
                                likes={blindBoxDetail.likes}
                                views={blindBoxDetail.views}
                                sx={{ marginTop: 1 }}
                            />
                            <Stack direction="row" alignItems="center" spacing={1} marginTop={3}>
                                <ProductBadge
                                    badgeType={
                                        blindBoxDetail.type === enumBlindBoxNFTType.ComingSoon
                                            ? enumBadgeType.ComingSoon
                                            : blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds
                                            ? enumBadgeType.SaleEnds
                                            : enumBadgeType.SaleEnded
                                    }
                                    content={
                                        blindBoxDetail.type === enumBlindBoxNFTType.ComingSoon
                                            ? blindBoxDetail.endTime
                                            : ''
                                    }
                                />
                            </Stack>
                            <ELAPrice
                                price_ela={blindBoxDetail.price_ela}
                                price_usd={blindBoxDetail.price_usd}
                                marginTop={3}
                            />
                            {(!signInDlgState.address ||
                                (signInDlgState.address && blindBoxDetail.royaltyOwner !== signInDlgState.address)) &&
                                blindBoxDetail.type === enumBlindBoxNFTType.SaleEnds && (
                                    <PrimaryButton
                                        sx={{ marginTop: 3, width: '100%' }}
                                        onClick={() => {
                                            if (signInDlgState.isLoggedIn) {
                                                setDialogState({
                                                    ...dialogState,
                                                    buyBlindBoxDlgOpened: true,
                                                    buyBlindBoxDlgStep: 0,
                                                    buyBlindName: blindBoxDetail.name,
                                                    buyBlindPriceEla: blindBoxDetail.price_ela,
                                                    buyBlindPriceUsd: blindBoxDetail.price_usd,
                                                    buyBlindAmount: 1,
                                                    buyBlindBoxId: blindBoxDetail.tokenId,
                                                    buyBlindMaxPurchases: blindBoxDetail.maxPurchases
                                                        ? blindBoxDetail.maxPurchases
                                                        : 0,
                                                    buyBlindInstock: blindBoxDetail.instock
                                                        ? blindBoxDetail.instock
                                                        : 0,
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
                                        Buy Now
                                    </PrimaryButton>
                                )}
                        </>
                    )}
                </Grid>
            </Grid>
            {blindBoxDetail.tokenId === '' ? (
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
                <>
                    <Stack
                        direction="row"
                        width="fit-content"
                        borderRadius={3}
                        marginTop={5}
                        sx={{ background: '#e8f4ff' }}
                    >
                        <PrimaryButton
                            size="small"
                            btn_color={pageType === 'details' ? 'primary' : 'none'}
                            sx={{ width: 120 }}
                            onClick={() => setPageType('details')}
                        >
                            details
                        </PrimaryButton>
                        <PrimaryButton
                            size="small"
                            btn_color={pageType === 'sold' ? 'primary' : 'none'}
                            sx={{ width: 120 }}
                            onClick={() => setPageType('sold')}
                        >
                            NFTs SOLD
                        </PrimaryButton>
                    </Stack>
                    {pageType === 'details' && (
                        <Grid container marginTop={5} columnSpacing={10}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={5}>
                                    <ProjectDescription description={blindBoxDetail.description} />
                                    <AboutAuthor
                                        name={blindBoxDetail.author}
                                        description={blindBoxDetail.authorDescription}
                                        img={blindBoxDetail.authorImg}
                                        address={blindBoxDetail.royaltyOwner || ''}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                    {pageType === 'sold' &&
                        (nftSoldList.length === 0 ? (
                            <LooksEmptyBox bannerTitle="Looks Empty Here" sx={{ marginTop: 2 }} />
                        ) : (
                            <Grid container mt={2} spacing={4}>
                                {nftSoldList.map((item, index) => (
                                    <Grid item xs={6} md={3} key={`explore-product-${index}`}>
                                        <NFTPreview
                                            isLoading={isLoading}
                                            product={item}
                                            productType={3}
                                            index={index}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                </>
            )}
            {/* <BuyBlindBoxDlgContainer /> */}
        </Container>
    );
};

export default BlindBoxProduct;
