import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, enumSingleNFTType, TypeNewProduct } from 'src/types/product-types';
// import { newNFTProducts } from 'src/constants/dummyData';
import { H2Typography } from 'src/core/typographies';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import { getThumbnail, getTime } from 'src/services/sleep';

const HomePage: React.FC = (): JSX.Element => {
    // const productList: Array<TypeProduct> = newNFTProducts;
    const [productList, setProductList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    var _newProductList: any = [];
    var _popularCollectionList: any = [];
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=1&pageSize=10`).then(response => {
            response.json().then(jsonNewProducts => {
                console.log(jsonNewProducts);
                jsonNewProducts.data.result.forEach(function (itemObject: TypeNewProduct) {
                    var product: TypeProduct = {id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, author: "", type: enumSingleNFTType.BuyNow, saleTime: ""};
                    product.id = itemObject.tokenId;
                    product.name = itemObject.name;
                    product.image = getThumbnail(itemObject.asset);
                    product.price_ela = itemObject.blockNumber % 1000; // -- no proper value
                    product.price_usd = product.price_ela * 3.44; // -- no proper value
                    product.likes = parseInt(itemObject.createTime) % 10000; // -- no proper value
                    product.author = "Author";
                    product.type = parseInt(itemObject.createTime) % 2 === 0 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                    let saleTime = getTime(itemObject.createTime);
                    product.saleTime = saleTime.date + " " + saleTime.time;  
                    _newProductList.push(product);
                });
                // console.log(_productList);
                setProductList(_newProductList);
            });
        }).catch(err => {
            console.log(err)
        });

        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=2&pageSize=10`).then(response => {
            response.json().then(jsonPopularCollections => {
                jsonPopularCollections.data.result.forEach(function (itemObject: TypeNewProduct) {
                    var collection: TypeProduct = {id: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, views: 0, author: "", type: enumSingleNFTType.BuyNow, saleTime: ""};
                    collection.id = itemObject.tokenId;
                    collection.name = itemObject.name;
                    collection.image = getThumbnail(itemObject.asset);
                    collection.price_ela = itemObject.blockNumber % 1000; // -- no proper value
                    collection.price_usd = collection.price_ela * 3.44; // -- no proper value
                    collection.likes = parseInt(itemObject.createTime) % 10000; // -- no proper value
                    collection.author = "Author";
                    collection.type = parseInt(itemObject.createTime) % 2 === 0 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                    let saleTime = getTime(itemObject.createTime);
                    collection.saleTime = saleTime.date + " " + saleTime.time;                    
                    _popularCollectionList.push(collection);
                });
                setCollectionList(_popularCollectionList);
            });
        }).catch(err => {
            console.log(err)
        });
    }, []);

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
                            <SwiperSlide key={`new-product-${index}`}>
                                <ExploreGalleryItem product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box mt={4}>
                    <H2Typography mb={1}>Popular Collections</H2Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 3000 }} spaceBetween={8}>
                        {collectionList.map((collection, index) => (
                            <SwiperSlide key={`popular-collection-${index}`}>
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
