import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, enumSingleNFTType, TypeCollectible } from 'src/types/product-types';
import { newNFTProducts } from 'src/constants/dummyData';
import { H2Typography } from 'src/core/typographies';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import { getThumbnail } from 'src/services/sleep';

const HomePage: React.FC = (): JSX.Element => {
    // const productList: Array<TypeProduct> = newNFTProducts;
    const [productList, setProductList] = useState([]);
    var productsList: any = [];
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=1&pageSize=10`).then(response => {
            response.json().then(jsonCollectibles => {
                // console.log(jsonCollectibles)
                jsonCollectibles.data.result.forEach(function (itemObject: TypeCollectible, id: number) {
                    var product: TypeProduct = {id: "", name: "", image: "", price: 0, likes: 0, type: enumSingleNFTType.BuyNow, saleTime: ""};
                    product.id = id.toString();
                    product.name = itemObject.name;
                    product.image = getThumbnail(itemObject.thumbnail);
                    product.price = itemObject.blockNumber % 1000;
                    product.likes = itemObject.tokenIndex;
                    product.type = enumSingleNFTType.BuyNow;
                    productsList.push(product);
                });
                // console.log(productsList);
                setProductList(productsList);
            })
        }).catch(e => {
            console.log(e)
            // if(e.code !== e.ABORT_ERR)
            //     setLoadingTransactions(false);
        });
        // const resCollectibles = await fetch(`${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=1&pageSize=10`);
        // const jsonCollectibles = await resCollectibles.json();
        // const newCollectibles = jsonCollectibles.data.result;
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
                                <ExploreGalleryItem product={product} onlyShowImage />
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
                        {productList.map((product, index) => (
                            <SwiperSlide key={`popular-collection-${index}`}>
                                <ExploreGalleryItem product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Stack>
        </>
    );
};

export default HomePage;
