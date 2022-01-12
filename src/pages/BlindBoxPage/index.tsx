import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct } from 'src/types/product-types';
import { blindboxNFTProducts } from 'src/constants/dummyData';
import BlindBoxGalleryItem from 'src/components/BlindBoxGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { sortOptions } from 'src/constants/select-constants';
import { SortOption } from 'src/types/select-types';

const BlindBoxPage: React.FC = (): JSX.Element => {
    const [sortBy, setSortBy] = useState<SortOption>();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');

    const productList: Array<TypeProduct> = blindboxNFTProducts;

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
                            <BlindBoxGalleryItem product={product} onlyShowImage />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            {/* <OptionsBar
                sortOptions={sortOptions}
                sortSelected={sortBy}
                handleSortChange={handleChangeSortBy}
                handleClickFilterButton={handleClickFilterButton}
                productViewMode={productViewMode}
                setProductViewMode={setProductViewMode}
                marginTop={5}
            /> */}
            <Grid container mt={2} spacing={4}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 6 : 3} key={`explore-product-${index}`}>
                        <BlindBoxGalleryItem product={item} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default BlindBoxPage;
