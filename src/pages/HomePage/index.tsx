import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, enumSingleNFTType, TypeProductFetch, TypeFavouritesFetch } from 'src/types/product-types';
import { H2Typography } from 'src/core/typographies';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { selectFromFavourites, getImageFromAsset } from 'src/services/common';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';

// import { XboxConsole24Filled } from '@fluentui/react-icons/lib/cjs/index';

const HomePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [collectionList, setCollectionList] = useState<Array<TypeProduct>>([]);
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

    const adBanners = [
        '/assets/images/adbanners/banner1.png',
        '/assets/images/adbanners/banner2.png',
        '/assets/images/adbanners/banner3.png',
    ];

    const getNewProducts = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resNewProduct = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listMarketTokens?pageNum=1&pageSize=10`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataNewProduct = await resNewProduct.json();
        const arrNewProduct = dataNewProduct.data.result;

        let _newProductList: any = [];
        for (let i = 0; i < arrNewProduct.length; i++) {
            let itemObject: TypeProductFetch = arrNewProduct[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || '---';
            product.type = itemObject.status === 'BUY NOW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            _newProductList.push(product);
        }
        setProductList(_newProductList);
    };

    const getPopularCollection = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resPopularCollection = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listMarketTokens?pageNum=1&pageSize=10&orderType=mostliked`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );

        const dataPopularCollection = await resPopularCollection.json();
        const arrPopularCollection =
            dataPopularCollection.data.result === undefined ? [] : dataPopularCollection.data.result;

        let _popularCollectionList: any = [];
        for (let i = 0; i < arrPopularCollection.length; i++) {
            const itemObject = arrPopularCollection[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || '---'; // -- no proper value
            product.type = itemObject.status === 'BUY NOW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            _popularCollectionList.push(product);
        }
        setCollectionList(_popularCollectionList);
    };

    const getFetchData = async () => {
        const ela_usd_rate = await getElaUsdRate();
        const favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getNewProducts(ela_usd_rate, favouritesList);
        getPopularCollection(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const updateProductLikes = (id: number, type: string) => {
        let prodList: Array<TypeProduct> = [...productList];
        if (type === 'inc') {
            prodList[id].likes += 1;
        } else if (type === 'dec') {
            prodList[id].likes -= 1;
        }
        setProductList(prodList);
    };

    const theme = useTheme();
    const matchUpsm = useMediaQuery(theme.breakpoints.up('sm'));
    const matchUplg = useMediaQuery(theme.breakpoints.up('lg'));

    const slidesPerView = matchUplg ? 4.5 : matchUpsm ? 3.5 : 2.5;

    const getUrl = (product: TypeProduct) => {
        if (product.type === enumSingleNFTType.BuyNow) return `/products/fixed-price/${product.tokenId}`;
        else if (product.type === enumSingleNFTType.OnAuction) return `/products/auction/${product.tokenId}`;
        else return `/`;
    };

    return (
        <>
            <Stack direction="column">
                <Box>
                    <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                        {adBanners.map((item, index) => (
                            <SwiperSlide key={`banner-carousel-${index}`}>
                                <Box borderRadius={2.5} overflow="hidden" onClick={() => {}} sx={{ cursor: 'pointer' }}>
                                    <img src={item} alt="" style={{ minWidth: '100%' }} />
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* {productList.length === 0 && (
                        <Stack justifyContent="center" alignItems="center" minHeight={320}>
                            <img src="/assets/images/loading.gif" alt="" />
                        </Stack>
                    )} */}
                </Box>
                <Box mt={4}>
                    <Typography fontSize={{ xs: 26, sm: 28, md: 32 }} fontWeight={700} lineHeight={1.1} mb={1}>
                        New Products
                    </Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 4000 }} spaceBetween={8}>
                        {productList.map((product, index) => (
                            <SwiperSlide key={`new-product-${index}`} style={{ height: 'auto' }}>
                                <ExploreGalleryItem product={product} index={index} updateLikes={updateProductLikes} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {productList.length === 0 && (
                        <Stack justifyContent="center" alignItems="center" minHeight={200}>
                            <img src="/assets/images/loading.gif" alt="" />
                        </Stack>
                    )}
                </Box>
                <Box mt={8}>
                    <Typography fontSize={{ xs: 26, sm: 28, md: 32 }} fontWeight={700} lineHeight={1.1} mb={1}>
                        Popular Collections
                    </Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 3000 }} spaceBetween={8}>
                        {collectionList.map((collection, index) => (
                            <SwiperSlide key={`popular-collection-${index}`} style={{ height: 'auto' }}>
                                <ExploreGalleryItem
                                    product={collection}
                                    index={index}
                                    updateLikes={updateProductLikes}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {collectionList.length === 0 && (
                        <Stack justifyContent="center" alignItems="center" minHeight={200}>
                            <img src="/assets/images/loading.gif" alt="" />
                        </Stack>
                    )}
                </Box>
            </Stack>
        </>
    );
};

export default HomePage;
