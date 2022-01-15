import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, TypeProductFetch, enumBlindBoxNFTType } from 'src/types/product-types';
// import { blindboxNFTProducts } from 'src/constants/dummyData';
import BlindBoxGalleryItem from 'src/components/BlindBoxGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { sortOptions } from 'src/constants/select-constants';
import { SortOption } from 'src/types/select-types';
import { getImageFromAsset, getTime } from 'src/services/sleep';

const BlindBoxPage: React.FC = (): JSX.Element => {
    const [sortBy, setSortBy] = useState<SortOption>();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [keyWord, setKeyWord] = useState<string>("");

    // const productList: Array<TypeProduct> = blindboxNFTProducts;
    const [productList, setProductList] = useState([]);
    var _singleProductList: any = [];
    useEffect(() => {
        const nDisplayCount = (productViewMode === 'grid1') ? 16 : 24;
        const apiUrl = (keyWord === "") ? `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=5&pageSize=${nDisplayCount}` : `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/search?key=${keyWord}`;
        fetch(apiUrl).then(response => {
            response.json().then(jsonSingleProducts => {
                // console.log(jsonSingleProducts);
                _singleProductList = [];
                if (typeof jsonSingleProducts.data != 'undefined') {
                    jsonSingleProducts.data.result.forEach(function (itemObject: TypeProductFetch) {
                        var product: TypeProduct = {tokenId: "", name: "", image: "", price_ela: 0, price_usd: 0, sold: 0, likes: 0, views: 0, author: "", type: enumBlindBoxNFTType.ComingSoon, saleTime: ""};
                        product.tokenId = itemObject.tokenId;
                        product.name = itemObject.name;
                        product.image = getImageFromAsset(itemObject.asset);
                        product.price_ela = itemObject.blockNumber % 1000; // -- no proper value
                        product.price_usd = product.price_ela * 3.44; // -- no proper value
                        product.sold = itemObject.blockNumber % 4321;
                        product.likes = parseInt(itemObject.createTime) % 10000; // -- no proper value
                        product.author = "Author";
                        product.type = parseInt(itemObject.createTime) % 3 === 0 ? enumBlindBoxNFTType.ComingSoon : (parseInt(itemObject.createTime) % 3 === 1 ? enumBlindBoxNFTType.SaleEnds : enumBlindBoxNFTType.SaleEnded);
                        let saleTime = getTime(itemObject.createTime);
                        product.saleTime = saleTime.date + " " + saleTime.time;  
                        _singleProductList.push(product);
                    });
                    // console.log(_productList);
                    setProductList(_singleProductList);
                }
            });
        }).catch(err => {
            console.log(err)
        });
    }, [keyWord, productViewMode]);

    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
    }

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
            <OptionsBar
                handleKeyWordChange={handleKeyWordChange}
                sortOptions={sortOptions}
                sortSelected={sortBy}
                handleSortChange={handleChangeSortBy}
                handleClickFilterButton={handleClickFilterButton}
                productViewMode={productViewMode}
                setProductViewMode={setProductViewMode}
                marginTop={5}
            />
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
