import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { TypeProduct, TypeProductFetch, enumBlindBoxNFTType } from 'src/types/product-types';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
// import { blindboxNFTProducts } from 'src/constants/dummyData';
import BlindBoxGalleryItem from 'src/components/BlindBoxGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import FilterModal from 'src/components/modals/FilterModal';
import { sortOptions } from 'src/constants/select-constants';
import { SortOption } from 'src/types/select-types';
import { getImageFromAsset, getTime } from 'src/services/common';

const BlindBoxPage: React.FC = (): JSX.Element => {
    const [sortBy, setSortBy] = useState<SortOption>();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [keyWord, setKeyWord] = useState<string>("");
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });

    // const productList: Array<TypeProduct> = blindboxNFTProducts;
    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [ela_usd_rate, setElaUsdRate] = useState<number>(1);
    const defaultValue : TypeProduct = { 
        tokenId: "", 
        name: "", 
        image: "",
        price_ela: 0, 
        price_usd: 0, 
        likes: 0,
        views: 0,
        author: "",
        authorDescription: "",
        authorImg: "",
        authorAddress: "",
        description: "",
        tokenIdHex: "",
        royalties: 0,
        createTime: "",
        holderName: "",
        holder: "",
        type: enumBlindBoxNFTType.ComingSoon, 
        isLike: false 
    };

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

        var reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
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
                    product.type = (itemObject.status == "ComingSoon") ? enumBlindBoxNFTType.ComingSoon : ((itemObject.status == "SaleEnded") ? enumBlindBoxNFTType.SaleEnded : enumBlindBoxNFTType.SaleEnds );
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

export default BlindBoxPage;
