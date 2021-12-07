import React from 'react';
import { Box } from '@mui/material';
import Product from 'src/components/Product';
import { TypeProduct } from 'src/types/product-types';
import { H3Typography } from 'src/core/typographies';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

const products: Array<TypeProduct> = [
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
    {
        image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2021/03/Advanced-NFT-Deployment---1-.png',
        name: 'Example product',
        price: 100,
        likes: 10,
    },
];

const HomePage: React.FC = (): JSX.Element => {
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
                <H3Typography mb={1}>New Products</H3Typography>
                <Swiper slidesPerView={2} autoplay={{ delay: 4000 }} spaceBetween={8}>
                    {products.map((product, index) => (
                        <SwiperSlide key={`new-product-${index}`}>
                            <Product product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <Box mt={4}>
                <H3Typography mb={1}>Popular Collections</H3Typography>
                <Swiper slidesPerView={2} autoplay={{ delay: 3000 }} spaceBetween={8}>
                    {products.map((product, index) => (
                        <SwiperSlide key={`popular-collection-${index}`}>
                            <Product product={product} onlyShowImage />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
        </>
    );
};

export default HomePage;
