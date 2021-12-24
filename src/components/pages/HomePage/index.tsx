import React from 'react';
import { Box } from '@mui/material';
import Product from 'src/components/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct } from 'src/types/product-types';
import { dummyProducts } from 'src/constants/dummyData';
import { H2Typography, H3Typography } from 'src/core/typographies';

const HomePage: React.FC = (): JSX.Element => {
    const products: Array<TypeProduct> = dummyProducts;

    return (
        <>
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {products.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Product product={product} onlyShowImage />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <Box mt={4}>
                <H2Typography mb={1}>New Products</H2Typography>
                <Swiper slidesPerView={2} autoplay={{ delay: 4000 }} spaceBetween={8}>
                    {products.map((product, index) => (
                        <SwiperSlide key={`new-product-${index}`}>
                            <Product product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <Box mt={4}>
                <H2Typography mb={1}>Popular Collections</H2Typography>
                <Swiper slidesPerView={2} autoplay={{ delay: 3000 }} spaceBetween={8}>
                    {products.map((product, index) => (
                        <SwiperSlide key={`popular-collection-${index}`}>
                            <Product product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </>
    );
};

export default HomePage;
