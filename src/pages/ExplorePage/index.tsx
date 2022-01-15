import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { sortOptions } from 'src/constants/select-constants'; // sort options
import { SortOption } from 'src/types/select-types';
import { TypeProduct, TypeProductFetch, enumSingleNFTType } from 'src/types/product-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getImageFromAsset, getTime } from 'src/services/sleep';

const ExplorePage: React.FC = (): JSX.Element => {
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<SortOption>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>("");

    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [ela_usd_rate, setElaUsdRate] = useState<number>(1);
    const defaultValue : TypeProduct = { tokenId: "", name: "", image: "", price_ela: 0, price_usd: 0, likes: 0, author: "", type: enumSingleNFTType.BuyNow };

    useEffect(() => {
        fetch("https://esc.elastos.io/api?module=stats&action=coinprice", {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }}).then(response => {
            response.json().then(jsonPrcieRate => {
                setElaUsdRate(parseFloat(jsonPrcieRate.result.coin_usd));
            });
        }).catch(err => {
            console.log(err)
        });

        var reqUrl = `${process.env.REACT_APP_BACKEND_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
        if (sortBy !== undefined) {
            switch(sortBy.label) {
                case 'Price: LOW TO HIGH': 
                    reqUrl += `&orderType=price_l_to_h`;
                    break;
                case 'Price: HIGH TO LOW': 
                    reqUrl += `&orderType=price_h_to_l`;
                    break;
                case 'MOST VIEWED': 
                    reqUrl += `&orderType=mostviewed`;
                    break;
                case 'MOST LIKED': 
                    reqUrl += `&orderType=mostliked`;
                    break;
                case 'MOST RECENT': 
                    reqUrl += `&orderType=mostrecent`;
                    break;
                case 'OLDEST': 
                    reqUrl += `&orderType=oldest`;
                    break;
                case 'ENDING SOON': 
                    reqUrl += `&orderType=endingsoon`;
                    break;
                default: 
                    reqUrl += `&orderType=mostrecent`;
                    break;
            }
        }
        if (filterRange.min !== undefined) {
            reqUrl += `&filter_min_price=${filterRange.min}`;
        }
        if (filterRange.max !== undefined) {
            reqUrl += `&filter_min_price=${filterRange.max}`;
        } 
        if (filters) {
            let filterStatus: string = "";
            filters.forEach((item) => {
                if (item == 0) filterStatus += "ONAUCTION,";
                else if (item == 1) filterStatus += "BUYNOW,";
                else if (item == 2) filterStatus += "HASBID,";
                else if (item == 3) filterStatus += "NEW,";                
            });
            filterStatus.slice(0, filterStatus.length - 1);
            reqUrl += `&filter_status=${filterStatus}`;
        }
        
        console.log("filter", filters);
        fetch(reqUrl, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }})
        .then(response => {
            let _newProductList: any = [];
            response.json().then(jsonNewProducts => {
                jsonNewProducts.data.result.forEach((itemObject: TypeProductFetch) => {
                var product: TypeProduct = {...defaultValue};
                    product.tokenId = itemObject.tokenId;
                    product.name = itemObject.name;
                    product.image = getImageFromAsset(itemObject.asset);
                    product.price_ela = itemObject.price;
                    product.price_usd = product.price_ela * ela_usd_rate;
                    product.likes = itemObject.likes;
                    product.author = "Author"; // -- no proper value
                    product.type = (itemObject.status == "NEW") ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
                    _newProductList.push(product);
                });
                setProductList(_newProductList);
            });
        }).catch(err => {
            console.log(err)
        });
    }, [ela_usd_rate, sortBy, filters, filterRange, keyWord, productViewMode]);

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

    // const handleClickFilterItem = (filter: enmFilterOption) => () => {
    //     if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    // };

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
