import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, enumSingleNFTType, TypeProductFetch } from 'src/types/product-types';
// import { newNFTProducts } from 'src/constants/dummyData';
import { H2Typography } from 'src/core/typographies';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import { getImageFromAsset, getTime } from 'src/services/common';
import { XboxConsole24Filled } from '@fluentui/react-icons/lib/cjs/index';

const HomePage: React.FC = (): JSX.Element => {
    // const productList: Array<TypeProduct> = newNFTProducts;
    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [collectionList, setCollectionList] = useState<Array<TypeProduct>>([]);
    const [ela_usd_rate, setElaUsdRate] = useState<number>(1);
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
    };

    useEffect(() => {
        // "https://esc.elastos.io/api?module=stats&action=coinprice"
        // `${process.env.ELASTOS_LATEST_PRICE_API_URL}`
        fetch('https://esc.elastos.io/api?module=stats&action=coinprice', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((response) => {
                response.json().then((jsonPrcieRate) => {
                    setElaUsdRate(parseFloat(jsonPrcieRate.result.coin_usd));
                });
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=10`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((response) => {
                let _newProductList: any = [];
                response.json().then((jsonNewProducts) => {
                    jsonNewProducts.data.result.forEach((itemObject: TypeProductFetch) => {
                        var product: TypeProduct = { ...defaultValue };
                        product.tokenId = itemObject.tokenId;
                        product.name = itemObject.name;
                        product.image = getImageFromAsset(itemObject.asset);
                        product.price_ela = itemObject.price;
                        product.price_usd = product.price_ela * ela_usd_rate;
                        product.likes = itemObject.likes;
                        product.author = 'Author'; // -- no proper value
                        product.type =
                            itemObject.status == 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                        _newProductList.push(product);
                    });
                    setProductList(_newProductList);
                });
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=10&orderType=mostliked`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        )
            .then((response) => {
                let _popularCollectionList: any = [];
                response.json().then((jsonNewProducts) => {
                    jsonNewProducts.data.result.forEach((itemObject: TypeProductFetch) => {
                        var product: TypeProduct = { ...defaultValue };
                        product.tokenId = itemObject.tokenId;
                        product.name = itemObject.name;
                        product.image = getImageFromAsset(itemObject.asset);
                        product.price_ela = itemObject.price;
                        product.price_usd = product.price_ela * ela_usd_rate;
                        product.likes = itemObject.likes;
                        product.author = 'Author'; // -- no proper value
                        product.type =
                            itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                        _popularCollectionList.push(product);
                    });
                    setCollectionList(_popularCollectionList);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [ela_usd_rate]);

    const theme = useTheme();
    const matchUpsm = useMediaQuery(theme.breakpoints.up('sm'));
    const matchUplg = useMediaQuery(theme.breakpoints.up('lg'));

    const slidesPerView = matchUplg ? 4.5 : matchUpsm ? 3.5 : 2.5;

    return (
        <>
            <Stack direction="column">
                <Box>
                    <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                        {productList.map((product, index) => (
                            <SwiperSlide key={`banner-carousel-${index}`}>
                                <ExploreGalleryItem product={product} onlyShowImage={true} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box mt={4}>
                    <H2Typography mb={1}>New Products</H2Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 4000 }} spaceBetween={8}>
                        {productList.map((product, index) => (
                            <SwiperSlide key={`new-product-${index}`} style={{ height: 'auto' }}>
                                <ExploreGalleryItem product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box mt={8}>
                    <H2Typography mb={1}>Popular Collections</H2Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 3000 }} spaceBetween={8}>
                        {collectionList.map((collection, index) => (
                            <SwiperSlide key={`popular-collection-${index}`} style={{ height: 'auto' }}>
                                <ExploreGalleryItem product={collection} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Stack>
        </>
    );
};

export default HomePage;
