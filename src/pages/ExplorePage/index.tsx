import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import FilterModal from 'src/components/modals/FilterModal';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { sortOptions } from 'src/constants/select-constants'; // sort options
import { SortOption } from 'src/types/select-types';
import { TypeProduct, TypeProductFetch, enumSingleNFTType, TypeFavouritesFetch } from 'src/types/product-types';
import { getImageFromAsset } from 'src/services/common';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { selectFromFavourites } from 'src/services/common';
import { getElaUsdRate, getMyFavouritesList } from 'src/services/fetch';
import { EmptyTitleGalleryItem, EmptyBodyGalleryItem } from './styles';

const ExplorePage: React.FC = (): JSX.Element => {
    const auth = useRecoilValue(authAtom);
    const [didCookies] = useCookies(["did"]);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<SortOption>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>("");
    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
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
        type: enumSingleNFTType.BuyNow,
        isLike: false 
    };

    const getSearchResult = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        var reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
        if (sortBy !== undefined) {
            alert(sortBy.label);
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
                if (item === 0) filterStatus += "ONAUCTION,";
                else if (item === 1) filterStatus += "BUYNOW,";
                else if (item === 2) filterStatus += "HASBID,";
                else if (item === 3) filterStatus += "NEW,";                
            });
            filterStatus.slice(0, filterStatus.length - 1);
            reqUrl += `&filter_status=${filterStatus}`;
        }

        const resSearchResult = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataSearchResult = await resSearchResult.json();
        const arrSearchResult = dataSearchResult.data.result;
        
        let _newProductList: any = [];
        for(let i = 0; i < arrSearchResult.length; i ++) {
            let itemObject: TypeProductFetch = arrSearchResult[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || 'No vaule'; 
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            _newProductList.push(product);
        }
        setProductList(_newProductList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(auth.isLoggedIn, didCookies.did);
        getSearchResult(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, [sortBy, filters, filterRange, keyWord, productViewMode]);

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

    const updateProductLikes = (id:number, type: string) => {
        let prodList : Array<TypeProduct> = [...productList];
        if(type === 'inc') {
            prodList[id].likes += 1;
        }
        else if(type === 'dec') {
            prodList[id].likes -= 1;
        }
        setProductList(prodList);
    };

    return (
        <>
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {productList.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <ExploreGalleryItem product={product} onlyShowImage={true} index={index} updateLikes={updateProductLikes} />
                        </SwiperSlide>
                    ))}
                    {productList.length === 0 && <EmptyTitleGalleryItem>No data to display</EmptyTitleGalleryItem>}
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
            {productList.length === 0 && <EmptyBodyGalleryItem >No listed products on marketplace</EmptyBodyGalleryItem>}
            <Grid container mt={2} spacing={4}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 6 : 4} md={productViewMode === 'grid1' ? 3 : 2} key={`explore-product-${index}`}>
                        <ExploreGalleryItem product={item} index={index} updateLikes={updateProductLikes} />
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
