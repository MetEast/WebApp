import React from 'react';
import { Box, Stack } from '@mui/material';
import Product from 'src/components/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct } from 'src/types/product-types';
import { dummyProducts } from 'src/constants/dummyData';
import { H2Typography } from 'src/core/typographies';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const HomePage: React.FC = (): JSX.Element => {
    const products: Array<TypeProduct> = dummyProducts;

    const theme = useTheme();
    const matchUpsm = useMediaQuery(theme.breakpoints.up('sm'));
    const matchUplg = useMediaQuery(theme.breakpoints.up('lg'));

    const slidesPerView = matchUplg ? 4.5 : matchUpsm ? 3.5 : 2.5;

    return (
        <>
            <Stack direction="column">
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
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 4000 }} spaceBetween={8}>
                        {products.map((product, index) => (
                            <SwiperSlide key={`new-product-${index}`}>
                                <Product product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                <Box mt={4}>
                    <H2Typography mb={1}>Popular Collections</H2Typography>
                    <Swiper slidesPerView={slidesPerView} autoplay={{ delay: 3000 }} spaceBetween={8}>
                        {products.map((product, index) => (
                            <SwiperSlide key={`popular-collection-${index}`}>
                                <Product product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Stack>
        </>
    );
};

export default HomePage;
