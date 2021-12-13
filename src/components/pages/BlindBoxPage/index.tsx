import React from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct } from 'src/types/product-types';
import { dummyProducts } from 'src/constants/dummyData';
import Product from 'src/components/Product';
import BlindBoxProduct from 'src/components/BlindBoxProduct';

const BlindBoxPage: React.FC = (): JSX.Element => {
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
            <Grid container mt={2.5} spacing={3}>
                {products.map((item, index) => (
                    <Grid item xs={12} key={`explore-product-${index}`}>
                        <BlindBoxProduct product={item} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default BlindBoxPage;
