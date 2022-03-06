import { Stack, Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import NFTPreview from 'src/components/NFTPreview';
import OptionsBar from 'src/components/OptionsBar';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { sortOptions } from 'src/constants/select-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { TypeProduct, TypeProductFetch, enumSingleNFTType, TypeFavouritesFetch } from 'src/types/product-types';
import { getImageFromAsset, reduceHexAddress } from 'src/services/common';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { selectFromFavourites } from 'src/services/common';
import { getELA2USD, getMyFavouritesList } from 'src/services/fetch';
import Container from 'src/components/Container';

const ExplorePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const defaultValue: TypeProduct = {
        tokenId: '',
        name: '',
        image: '',
        price_ela: 0,
        price_usd: 0,
        likes: 0,
        views: 0,
        author: '',
        authorDescription: '',
        authorImg: '',
        authorAddress: '',
        description: '',
        tokenIdHex: '',
        royalties: 0,
        createTime: '',
        holderName: '',
        holder: '',
        type: enumSingleNFTType.BuyNow,
        isLike: false,
    };
    const [productList, setProductList] = useState<Array<TypeProduct>>([
        defaultValue,
        defaultValue,
        defaultValue,
        defaultValue,
    ]);
    const adBanners = [
        '/assets/images/banners/banner1.png',
        '/assets/images/banners/banner2.png',
        '/assets/images/banners/banner3.png',
    ];

    // -------------- Fetch Data -------------- //
    const getSearchResult = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        var reqUrl = `${
            process.env.REACT_APP_SERVICE_URL
        }/sticker/api/v1/listMarketTokens?pageNum=1&pageSize=${1000}&keyword=${keyWord}`;

        if (sortBy !== undefined) {
            switch (sortBy.value) {
                case 'low_to_high':
                    reqUrl += `&orderType=price_l_to_h`;
                    break;
                case 'high_to_low':
                    reqUrl += `&orderType=price_h_to_l`;
                    break;
                case 'most_viewed':
                    reqUrl += `&orderType=mostviewed`;
                    break;
                case 'most_liked':
                    reqUrl += `&orderType=mostliked`;
                    break;
                case 'most_recent':
                    reqUrl += `&orderType=mostrecent`;
                    break;
                case 'oldest':
                    reqUrl += `&orderType=oldest`;
                    break;
                case 'ending_soon':
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
            reqUrl += `&filter_max_price=${filterRange.max}`;
        }
        if (filters.length !== 0) {
            let filterStatus: string = '';
            filters.forEach((item) => {
                if (item === 0) filterStatus += 'ON AUCTION,';
                else if (item === 1) filterStatus += 'BUY NOW,';
                else if (item === 2) filterStatus += 'HAS BID,';
            });
            reqUrl += `&filter_status=${filterStatus.slice(0, filterStatus.length - 1)}`;
        }
        const resSearchResult = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const dataSearchResult = await resSearchResult.json();
        const arrSearchResult = dataSearchResult.data === undefined ? [] : dataSearchResult.data.result;

        let _newProductList: any = [];
        for (let i = 0; i < arrSearchResult.length; i++) {
            let itemObject: TypeProductFetch = arrSearchResult[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author =
                itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
            product.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            product.likes = itemObject.likes;
            product.views = itemObject.views;
            product.status = itemObject.status;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            _newProductList.push(product);
        }
        setProductList(_newProductList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getELA2USD();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getSearchResult(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, [sortBy, filters, filterRange, keyWord, productViewMode, signInDlgState.isLoggedIn]);
    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
    };

    const handleChangeSortBy = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSortBy(item);
    };

    const handlerFilterChange = (status: number, minPrice: string, maxPrice: string, opened: boolean) => {
        if (opened) {
            let filters: Array<enumFilterOption> = [];
            if (status === 0) filters.push(enumFilterOption.buyNow);
            else if (status === 1) filters.push(enumFilterOption.onAuction);
            else if (status === 2) filters.push(enumFilterOption.hasBids);
            setFilters(filters);
            setFilterRange({
                min: minPrice === '' ? undefined : parseFloat(minPrice),
                max: maxPrice === '' ? undefined : parseFloat(maxPrice),
            });
        }
    };
    // -------------- Option Bar -------------- //

    // -------------- Views -------------- //
    const updateProductLikes = (id: number, type: string) => {
        let prodList: Array<TypeProduct> = [...productList];
        if (type === 'inc') {
            prodList[id].likes += 1;
        } else if (type === 'dec') {
            prodList[id].likes -= 1;
        }
        setProductList(prodList);
    };

    return (
        <Box minHeight="75vh">
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {adBanners.map((item, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Box overflow="hidden" onClick={() => {}} sx={{ cursor: 'pointer' }}>
                                <img src={item} alt="" style={{ minWidth: '100%' }} />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <Container>
                <OptionsBar
                    sortOptions={sortOptions}
                    sortSelected={sortBy}
                    productViewMode={productViewMode}
                    handleKeyWordChange={handleKeyWordChange}
                    handlerFilterChange={handlerFilterChange}
                    handleSortChange={handleChangeSortBy}
                    setProductViewMode={setProductViewMode}
                    marginTop={5}
                />
                {productList.length === 0 && (
                    <Stack justifyContent="center" alignItems="center" minHeight="50vh">
                        <img src="/assets/images/loading.gif" alt="" />
                    </Stack>
                )}
                <Grid container mt={2} spacing={4}>
                    {productList.map((item, index) => (
                        <Grid
                            item
                            xs={productViewMode === 'grid1' ? 12 : 6}
                            md={productViewMode === 'grid1' ? 6 : 3}
                            key={`explore-product-${index}`}
                        >
                            <NFTPreview
                                product={item}
                                productType={1}
                                index={index}
                                productViewMode={productViewMode}
                                updateLikes={updateProductLikes}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default ExplorePage;
