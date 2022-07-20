import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NFTPreview from 'src/components/NFTPreview';
import 'swiper/swiper-bundle.css';
import { useSignInContext } from 'src/context/SignInContext';
import { TypeProduct } from 'src/types/product-types';
import { getELA2USD, getMyFavouritesNFT, getNFTItemList, getPageBannerList } from 'src/services/fetch';
import { blankNFTItem } from 'src/constants/init-constants';
import Container from 'src/components/Container';

const HomePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [productList, setProductList] = useState<Array<TypeProduct>>(Array(5).fill(blankNFTItem));
    const [collectionList, setCollectionList] = useState<Array<TypeProduct>>(Array(5).fill(blankNFTItem));
    const [adBanners, setAdBanners] = useState<string[]>([]);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchBanners = async () => {
            const _adBanners = await getPageBannerList(1);
            if (!unmounted) setAdBanners(_adBanners);
        };
        fetchBanners().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, []);

    useEffect(() => {
        let unmounted = false;
        const fetchCollections = async () => {
            if (!unmounted) setIsLoading(true);
            const _newNFTList = await getNFTItemList({ pageNum: 1, pageSize: 10 }, undefined, undefined);
            const _popularNFTList = await getNFTItemList(
                { pageNum: 1, pageSize: 10, orderType: 'mostliked' },
                undefined,
                undefined,
            );
            if (!unmounted) {
                setProductList(_newNFTList.data);
                setCollectionList(_popularNFTList.data);
                setIsLoading(false);
            }
        };
        if ((signInDlgState.isLoggedIn && signInDlgState.address) || !signInDlgState.isLoggedIn)
            fetchCollections().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.address]);

    useEffect(() => {
        const updateTokenInfo = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesNFT(signInDlgState.isLoggedIn, signInDlgState.token);
            setProductList((prevState) => {
                return prevState.map((item) => {
                    item.isLike = likeList.includes(item.tokenId);
                    item.price_usd = item.price_ela * ELA2USD;
                    return item;
                });
            });
            setCollectionList((prevState) => {
                return prevState.map((item) => {
                    item.isLike = likeList.includes(item.tokenId);
                    item.price_usd = item.price_ela * ELA2USD;
                    return item;
                });
            });
        };
        setTimeout(updateTokenInfo, 5000);
    }, [signInDlgState.isLoggedIn, signInDlgState.token]);
    // -------------- Fetch Data -------------- //

    // -------------- Likes -------------- //
    const updateProductLikes = (id: number, type: string) => {
        let prodList: Array<TypeProduct> = [...productList];
        let colList: Array<TypeProduct> = [...collectionList];
        const colId = collectionList.findIndex((value: TypeProduct) => value.tokenId === productList[id].tokenId);
        if (type === 'inc') {
            prodList[id].likes += 1;
            if (colId !== -1) {
                colList[colId].likes += 1;
                colList[colId].isLike = true;
            }
        } else if (type === 'dec') {
            prodList[id].likes -= 1;
            if (colId !== -1) {
                colList[colId].likes -= 1;
                colList[colId].isLike = false;
            }
        }
        setProductList(prodList);
        setCollectionList(colList);
    };

    const updateCollectionLikes = (id: number, type: string) => {
        let colList: Array<TypeProduct> = [...collectionList];
        let prodList: Array<TypeProduct> = [...productList];
        const prodId = productList.findIndex((value: TypeProduct) => value.tokenId === collectionList[id].tokenId);
        if (type === 'inc') {
            colList[id].likes += 1;
            if (prodId !== -1) {
                prodList[prodId].likes += 1;
                prodList[prodId].isLike = true;
            }
        } else if (type === 'dec') {
            colList[id].likes -= 1;
            if (prodId !== -1) {
                prodList[prodId].likes -= 1;
                prodList[prodId].isLike = false;
            }
        }
        setProductList(prodList);
        setCollectionList(colList);
    };

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));

    const slidesPerView = matchUpLg ? 4.5 : matchUpMd ? 3.5 : 2.5;
    const spaceBetweenSlideItems = matchUpLg ? 32 : 16;

    return (
        <Stack direction="column" minHeight="75vh">
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8} touchStartPreventDefault={false}>
                    {adBanners.length ? (
                        adBanners.map((item, index) => (
                            <SwiperSlide key={`banner-carousel-${index}`}>
                                <Box
                                    overflow="hidden"
                                    onClick={() => {}}
                                    sx={{
                                        height: 330,
                                        maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                                        backgroundColor: '#C3C5C8',
                                    }}
                                >
                                    {item !== '' && (
                                        <img
                                            src={item}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                maxHeight: 330,
                                            }}
                                        />
                                    )}
                                </Box>
                            </SwiperSlide>
                        ))
                    ) : (
                        <Box
                            onClick={() => {}}
                            sx={{
                                height: 330,
                                maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                                backgroundColor: '#C3C5C8',
                            }}
                        />
                    )}
                </Swiper>
            </Box>
            <Container sx={{ maxWidth: matchDownSm ? '100% !important' : 'auto' }}>
                <Box mt={{ xs: 4, md: 8 }}>
                    <Typography
                        fontSize={{ xs: 26, sm: 28, md: 32 }}
                        fontWeight={700}
                        lineHeight={1.1}
                        marginBottom={1.5}
                        marginLeft={{ xs: 3, sm: 0 }}
                    >
                        New Products
                    </Typography>
                    <Swiper
                        slidesPerView={slidesPerView}
                        autoplay={{ delay: 4000 }}
                        spaceBetween={spaceBetweenSlideItems}
                    >
                        {productList.map((product, index) => (
                            <SwiperSlide key={`new-product-${index}`} style={{ height: 'auto' }}>
                                <NFTPreview
                                    isLoading={isLoading}
                                    product={product}
                                    productType={0}
                                    index={index}
                                    updateLikes={updateProductLikes}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box mt={{ xs: 4, md: 8 }}>
                    <Typography
                        fontSize={{ xs: 26, sm: 28, md: 32 }}
                        fontWeight={700}
                        lineHeight={1.1}
                        marginBottom={1.5}
                        marginLeft={{ xs: 3, sm: 0 }}
                    >
                        Popular Collections
                    </Typography>
                    <Swiper
                        slidesPerView={slidesPerView}
                        autoplay={{ delay: 3000 }}
                        spaceBetween={spaceBetweenSlideItems}
                    >
                        {collectionList.map((collection, index) => (
                            <SwiperSlide key={`popular-collection-${index}`} style={{ height: 'auto' }}>
                                <NFTPreview
                                    isLoading={isLoading}
                                    product={collection}
                                    productType={0}
                                    index={index}
                                    updateLikes={updateCollectionLikes}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Container>
        </Stack>
    );
};

export default HomePage;
