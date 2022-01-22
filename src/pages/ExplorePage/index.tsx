import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import ExploreGalleryItem from 'src/components/ExploreGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { sortOptions } from 'src/constants/select-constants'; // sort options
import { SortOption } from 'src/types/select-types';
import { TypeProduct, TypeProductFetch, enumSingleNFTType, TypeFavouritesFetch, TypeVeiwsLikesFetch, TypeLikesFetchItem } from 'src/types/product-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getImageFromAsset } from 'src/services/common';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { selectFromLikes, selectFromFavourites } from 'src/services/common';


const ExplorePage: React.FC = (): JSX.Element => {
    const auth = useRecoilValue(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);
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

    const getMyFavouritesList = async () => {
        const did = auth.isLoggedIn ? didCookies.did : '------------------';
        const resFavouriteList = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getFavoritesCollectible?did=${did}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataFavouriteList = await resFavouriteList.json();
        return dataFavouriteList.data;
    };
    
    const getElaUsdRate = async () => {
        const resElaUsdRate = await fetch(`${process.env.REACT_APP_ELASTOS_LATEST_PRICE_API_URL}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataElaUsdRate = await resElaUsdRate.json();
        return parseFloat(dataElaUsdRate.result.coin_usd);
    };

    const getViewsAndLikes = async (tokenIds: Array<string>) => {
        const resViewsAndLikes = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getViewsLikesCountOfTokens?tokenIds=${tokenIds.join(",")}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataViewsAndLikes = await resViewsAndLikes.json();
        return dataViewsAndLikes.data;
    };

    const getSearchResult = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
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
        
        // get token list for likes
        let arrTokenIds: Array<string> = [];
        for(let i = 0; i < arrSearchResult.length; i ++) {
            arrTokenIds.push(arrSearchResult[i].tokenId);
        }
        const arrLikesList: TypeVeiwsLikesFetch = await getViewsAndLikes(arrTokenIds);

        let _newProductList: any = [];
        for(let i = 0; i < arrSearchResult.length; i ++) {
            let itemObject: TypeProductFetch = arrSearchResult[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = 'Author'; // -- no proper value
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            let curItem: TypeLikesFetchItem | undefined = arrLikesList.likes.find((value: TypeLikesFetchItem) => selectFromLikes(value, itemObject.tokenId));
            product.likes = curItem === undefined ? 0 : curItem.likes;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            _newProductList.push(product);
        }
        setProductList(_newProductList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList();
        getSearchResult(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, [sortBy, filters, filterRange, keyWord, productViewMode]);

    // useEffect(() => {
    //     var reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listTokens?pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
    //     if (sortBy !== undefined) {
    //         switch(sortBy.label) {
    //             case 'Price: LOW TO HIGH': 
    //                 reqUrl += `&orderType=price_l_to_h`;
    //                 break;
    //             case 'Price: HIGH TO LOW': 
    //                 reqUrl += `&orderType=price_h_to_l`;
    //                 break;
    //             case 'MOST VIEWED': 
    //                 reqUrl += `&orderType=mostviewed`;
    //                 break;
    //             case 'MOST LIKED': 
    //                 reqUrl += `&orderType=mostliked`;
    //                 break;
    //             case 'MOST RECENT': 
    //                 reqUrl += `&orderType=mostrecent`;
    //                 break;
    //             case 'OLDEST': 
    //                 reqUrl += `&orderType=oldest`;
    //                 break;
    //             case 'ENDING SOON': 
    //                 reqUrl += `&orderType=endingsoon`;
    //                 break;
    //             default: 
    //                 reqUrl += `&orderType=mostrecent`;
    //                 break;
    //         }
    //     }
    //     if (filterRange.min !== undefined) {
    //         reqUrl += `&filter_min_price=${filterRange.min}`;
    //     }
    //     if (filterRange.max !== undefined) {
    //         reqUrl += `&filter_min_price=${filterRange.max}`;
    //     } 
    //     if (filters) {
    //         let filterStatus: string = "";
    //         filters.forEach((item) => {
    //             if (item === 0) filterStatus += "ONAUCTION,";
    //             else if (item === 1) filterStatus += "BUYNOW,";
    //             else if (item === 2) filterStatus += "HASBID,";
    //             else if (item === 3) filterStatus += "NEW,";                
    //         });
    //         filterStatus.slice(0, filterStatus.length - 1);
    //         reqUrl += `&filter_status=${filterStatus}`;
    //     }
        
    //     fetch(`${process.env.REACT_APP_ELASTOS_LATEST_PRICE_API_URL}`, {
    //         headers : { 
    //           'Content-Type': 'application/json',
    //           'Accept': 'application/json'
    //          }}
    //     ).then(response => {
    //         response.json().then(jsonPrcieRate => {
    //             const ela_usd_rate = parseFloat(jsonPrcieRate.result.coin_usd);
    //             fetch(reqUrl, {
    //                 headers : { 
    //                   'Content-Type': 'application/json',
    //                   'Accept': 'application/json'
    //                 }
    //             }).then(response => {
    //                 response.json().then(jsonNewProducts => {
    //                     jsonNewProducts.data.result.forEach((itemObject: TypeProductFetch) => {
    //                         fetch(`${process.env.REACT_APP_BACKEND_URL}/getViewsLikesCountOfToken?tokenId=${itemObject.tokenId}`, {
    //                             headers: {
    //                                 'Content-Type': 'application/json',
    //                                 Accept: 'application/json',
    //                             },
    //                         }).then((res) => {
    //                             res.json()
    //                             .then((jsonViewsAndLikes) => {
    //                                 var product: TypeProduct = {...defaultValue};
    //                                 product.tokenId = itemObject.tokenId;
    //                                 product.name = itemObject.name;
    //                                 product.image = getImageFromAsset(itemObject.asset);
    //                                 product.price_ela = itemObject.price;
    //                                 product.price_usd = product.price_ela * ela_usd_rate;
    //                                 product.author = "Author"; // -- no proper value
    //                                 product.type = (itemObject.status == "NEW") ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
    //                                 product.likes = jsonViewsAndLikes.data.likes;
    //                                 let _newProductList = [...productList];
    //                                 _newProductList.push(product);
    //                                 console.log(_newProductList)
    //                                 setProductList(_newProductList);
    //                             }).catch((err) => {
    //                                 console.log(err);
    //                             });
    //                         }).catch((err) => {
    //                             console.log(err);
    //                         });
    //                     });
    //                 });
    //             }).catch(err => {
    //                 console.log(err)
    //             });
                
    //         });
    //     }).catch(err => {
    //         console.log(err)
    //     });
        
    // }, [sortBy, filters, filterRange, keyWord, productViewMode]);

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
        if(type === 'inc') {
            let prodList : Array<TypeProduct> = productList;
            prodList[id].likes += 1;
            setProductList(prodList);
        }
        else if(type === 'dec') {
            let prodList : Array<TypeProduct> = productList;
            prodList[id].likes -= 1;
            setProductList(prodList);
        }
    };
    console.log(productList.length)

    return (
        <>
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {productList.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <ExploreGalleryItem product={product} onlyShowImage={true}  index={index} updateLikes={updateProductLikes} />
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
