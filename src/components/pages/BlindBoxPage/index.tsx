import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct } from 'src/types/product-types';
import { dummyProducts } from 'src/constants/dummyData';
import Product from 'src/components/Product';
import BlindBoxProduct from 'src/components/BlindBoxProduct';
import OptionsBar from 'src/components/OptionsBar';
import { sortOptions } from 'src/constants/select-constants';
import { SortOption } from 'src/types/select-types';

const BlindBoxPage: React.FC = (): JSX.Element => {
    const [sortBy, setSortBy] = useState<SortOption>();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid1');

    const productList: Array<TypeProduct> = dummyProducts;

    const handleChangeSortBy = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSortBy(item);
    };

    const handleClickFilterButton = () => {};

    return (
        <>
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {productList.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Product product={product} onlyShowImage />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <OptionsBar
                sortOptions={sortOptions}
                sortSelected={sortBy}
                handleSortChange={handleChangeSortBy}
                handleClickFilterButton={handleClickFilterButton}
                productViewMode={productViewMode}
                setProductViewMode={setProductViewMode}
            />
            <Grid container mt={2} spacing={4}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 6 : 3} key={`explore-product-${index}`}>
                        <BlindBoxProduct product={item} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default BlindBoxPage;
