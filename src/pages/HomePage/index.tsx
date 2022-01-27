import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, enumSingleNFTType, TypeProductFetch, TypeFavouritesFetch } from 'src/types/product-types';
import { H2Typography } from 'src/core/typographies';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { selectFromFavourites, getImageFromAsset } from 'src/services/common';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';
import { EmptyTitleGalleryItem, EmptyBodyGalleryItem } from './styles';
import { useNavigate } from 'react-router-dom';

// import { XboxConsole24Filled } from '@fluentui/react-icons/lib/cjs/index';

const HomePage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const auth = useRecoilValue(authAtom);
    const [didCookies] = useCookies(['did']);
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

    const getNewProducts = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resNewProduct = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=10`,
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
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || "---"; 
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            _newProductList.push(product);
        }
        setProductList(_newProductList);
    };

    const getPopularCollection = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        const resPopularCollection = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=10&orderType=mostliked`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );

        const dataPopularCollection = await resPopularCollection.json();
        const arrPopularCollection = dataPopularCollection.data.result;

        let _popularCollectionList: any = [];
        for (let i = 0; i < arrPopularCollection.length; i++) {
            const itemObject = arrPopularCollection[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || "---"; // -- no proper value
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            _popularCollectionList.push(product);
        }
        setCollectionList(_popularCollectionList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(auth.isLoggedIn, didCookies.did);
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
                        {productList.map((product, index) => (
                            <SwiperSlide key={`banner-carousel-${index}`}>
                                <Box onClick={() => navigate(getUrl(product))} sx={{ cursor: 'pointer' }}>
                                    <img src={product.image} alt="" width="100%" height={320} />
                                </Box>
                            </SwiperSlide>
                        ))}
                        {productList.length === 0 && <EmptyTitleGalleryItem>No data to display</EmptyTitleGalleryItem>}
                    </Swiper>
                </Box>
                <Box mt={4}>
                    <H2Typography mb={1}>New Products</H2Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 4000 }} spaceBetween={8}>
                        {productList.map((product, index) => (
                            <SwiperSlide key={`new-product-${index}`} style={{ height: 'auto' }}>
                                <ExploreGalleryItem product={product} index={index} updateLikes={updateProductLikes} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {productList.length === 0 && (
                        <EmptyBodyGalleryItem>No listed products on marketplace</EmptyBodyGalleryItem>
                    )}
                </Box>
                <Box mt={8}>
                    <H2Typography mb={1}>Popular Collections</H2Typography>
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
                    {productList.length === 0 && (
                        <EmptyBodyGalleryItem>No listed products on marketplace</EmptyBodyGalleryItem>
                    )}
                </Box>
            </Stack>
        </>
    );
};

export default HomePage;
