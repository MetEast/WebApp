import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
// import { singleNFTProducts } from 'src/constants/dummyData';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants'; // sort options
import { SortOption } from 'src/types/select-types';
import { TypeProduct, TypeNewProduct, enumSingleNFTType } from 'src/types/product-types';
import { FilterItemTypography } from './styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getThumbnail, getTime } from 'src/services/sleep';

const ExplorePage: React.FC = (): JSX.Element => {
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [isOpen, setIsOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>("");

    // useEffect(() => {}, []);
    // const productList: Array<TypeProduct> = singleNFTProducts;
    const [productList, setProductList] = useState([]);
    var _singleProductList: any = [];
    useEffect(() => {
        const nDisplayCount = (productViewMode === 'grid1') ? 16 : 24;
        const apiUrl = (keyWord === "") ? `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listStickers?pageNum=1&pageSize=${nDisplayCount}` : `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/search?key=${keyWord}`;
        fetch(apiUrl).then(response => {
            response.json().then(jsonSingleProducts => {
                // console.log(jsonSingleProducts);
                _singleProductList = [];
                if (typeof jsonSingleProducts.data != 'undefined') {
                    jsonSingleProducts.data.result.forEach(function (itemObject: TypeNewProduct) {
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

    const handleCloseFilterModal = () => {
        setFilterModalOpen(false);
    };

    const handleClickFilterButton = () => {
        setFilterModalOpen(true);
    };

    const handleDoneFilterModal = (filters: Array<enmFilterOption>, filterRange: TypeFilterRange) => {
        setFilters(filters);
        setFilterRange(filterRange);
        setFilterModalOpen(false);
    };

    const handleClickFilterItem = (filter: enmFilterOption) => () => {
        if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    };

    return (
        <>
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {productList.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <ExploreGalleryItem product={product} onlyShowImage />
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
                    <Grid item xs={productViewMode === 'grid1' ? 6 : 4} md={productViewMode === 'grid1' ? 3 : 2} key={`explore-product-${index}`}>
                        <ExploreGalleryItem product={item} />
                    </Grid>
                ))}
            </Grid>
            <FilterModal
                open={filterModalOpen}
                onClose={handleCloseFilterModal}
                filters={filters}
                filterRange={filterRange}
                onDone={handleDoneFilterModal}
            />
        </>
    );
};

export default ExplorePage;
