import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import NFTPreview from 'src/components/NFTPreview';
import OptionsBar from 'src/components/OptionsBar';
import FilterModal from 'src/components/modals/FilterModal';
import { sortOptions } from 'src/constants/select-constants';
import { TypeSelectItem } from 'src/types/select-types';
import {
    TypeProduct,
    TypeProductFetch,
    enumSingleNFTType,
    TypeFavouritesFetch,
    enumBlindBoxNFTType,
} from 'src/types/product-types';
import { getImageFromAsset } from 'src/services/common';
import { useSignInContext } from 'src/context/SignInContext';
import { useCookies } from 'react-cookie';
import { selectFromFavourites, getTime } from 'src/services/common';
import { getELA2USD, getMyFavouritesList } from 'src/services/fetch';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';

const BlindBoxPage: React.FC = (): JSX.Element => {
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
        sold: 0,
        instock: 0,
    };
    const [blindBoxList, setBlindBoxList] = useState<Array<TypeProduct>>([
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
    const getBlindBoxList = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        let reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/SearchBlindBox?pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
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

        const resBlindBoxList = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const dataBlindBoxList = await resBlindBoxList.json();
        const arrBlindBoxList = dataBlindBoxList.data === undefined ? [] : dataBlindBoxList.data.result;

        let _blindBoxList: Array<TypeProduct> = [];
        for (let i = 0; i < arrBlindBoxList.length; i++) {
            let itemObject: TypeProductFetch = arrBlindBoxList[i];
            let blindboxItem: TypeProduct = { ...defaultValue };
            blindboxItem.tokenId = itemObject.blindBoxIndex.toString();
            blindboxItem.name = itemObject.name;
            blindboxItem.image = getImageFromAsset(itemObject.asset);
            blindboxItem.price_ela = parseInt(itemObject.blindPrice);
            blindboxItem.price_usd = blindboxItem.price_ela * tokenPriceRate;
            // blindboxItem.author = itemObject.authorName || ' ';
            let curTimestamp = new Date().getTime() / 1000;
            blindboxItem.type =
                parseInt(itemObject.saleBegin) > curTimestamp
                    ? enumBlindBoxNFTType.ComingSoon
                    : parseInt(itemObject.saleEnd) >= curTimestamp
                    ? enumBlindBoxNFTType.SaleEnds
                    : enumBlindBoxNFTType.SaleEnded;

            blindboxItem.likes = itemObject.likes;
            blindboxItem.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            blindboxItem.sold = itemObject.sold || 0;
            blindboxItem.instock = itemObject.instock || 0;
            if (itemObject.saleEnd) {
                let endTime = getTime(itemObject.saleEnd); // no proper value
                blindboxItem.endTime = endTime.date + ' ' + endTime.time;
            } else {
                blindboxItem.endTime = '';
            }
            _blindBoxList.push(blindboxItem);
        }
        setBlindBoxList(_blindBoxList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getELA2USD();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getBlindBoxList(ela_usd_rate, favouritesList);
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
    const updateBlindBoxLikes = (id: number, type: string) => {
        let prodList: Array<TypeProduct> = [...blindBoxList];
        if (type === 'inc') {
            prodList[id].likes += 1;
        } else if (type === 'dec') {
            prodList[id].likes -= 1;
        }
        setBlindBoxList(prodList);
    };

    return (
        <Box minHeight="75vh">
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {adBanners.map((item, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Box borderRadius={2.5} overflow="hidden" onClick={() => {}} sx={{ cursor: 'pointer' }}>
                                <img src={item} alt="" style={{ minWidth: '100%' }} />
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
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
            {blindBoxList.length === 0 && (
                <Stack mt={6}>
                    <LooksEmptyBox />
                </Stack>
            )}
            <Grid container mt={2} spacing={4}>
                {blindBoxList.map((item, index) => (
                    <Grid
                        item
                        xs={productViewMode === 'grid1' ? 12 : 6}
                        md={productViewMode === 'grid1' ? 6 : 3}
                        key={`explore-product-${index}`}
                    >
                        <NFTPreview product={item} productType={2} index={index} updateLikes={updateBlindBoxLikes} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BlindBoxPage;
