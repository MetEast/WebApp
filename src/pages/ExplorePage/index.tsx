/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import NFTPreview from 'src/components/NFTPreview';
import OptionsBar from 'src/components/OptionsBar';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { sortOptions } from 'src/constants/select-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { TypeProduct } from 'src/types/product-types';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import {
    getELA2USD,
    getMyFavouritesNFT,
    getNFTItemList,
    getPageBannerList,
    getSearchParams,
} from 'src/services/fetch';
import Container from 'src/components/Container';
import { blankNFTItem } from 'src/constants/init-constants';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import InfiniteScroll from 'react-infinite-scroll-component';

const ExplorePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>(
        (document.cookie
            .split('; ')
            .find((row) => row.startsWith('METEAST_PREVIEW='))
            ?.split('=')[1] || '') === '1'
            ? 'grid1'
            : 'grid2',
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<TypeSelectItem | undefined>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [category, setCategory] = useState<TypeSelectItem>();
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [clearOption, setClearOption] = useState<boolean>(false);
    const [adBanners, setAdBanners] = useState<string[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize] = useState<number>(20);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isLoadingNext, setIsLoadingNext] = useState<boolean>(true);
    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [ELA2USD, setELA2USD] = useState<number>(0);
    const [myFavorList, setMyFavorList] = useState<Array<string>>([]);
    let ELA2USDRate: number = 0;
    let likeList: Array<string> = [];
    const fillerItem = Array(pageSize).fill(blankNFTItem);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchBanners = async () => {
            const _adBanners = await getPageBannerList(2);
            if (!unmounted) setAdBanners(_adBanners);
        };
        fetchBanners().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, []);

    useEffect(() => {
        let unmounted = false;
        // reset pageNum when search param has changed
        if (!unmounted && !isLoadingNext) {
            setPageNum(1);
            setProductList([]);
        }
        const getFetchData = async () => {
            if (!unmounted) setIsLoading(true);
            if (pageNum === 1) {
                ELA2USDRate = await getELA2USD();
                setELA2USD(ELA2USDRate);
                likeList = await getMyFavouritesNFT(signInDlgState.isLoggedIn, signInDlgState.token);
                setMyFavorList(likeList);
            }
            const searchParams = getSearchParams(pageNum, pageSize, keyWord, sortBy, filterRange, filters, category);
            const _searchedNFTList = await getNFTItemList(
                searchParams,
                ELA2USDRate ? ELA2USDRate : ELA2USD,
                likeList.length ? likeList : myFavorList,
            );
            if (!unmounted) {
                if (pageNum === 1) setProductList(_searchedNFTList.data);
                else setProductList([...productList, ..._searchedNFTList.data]);
                setIsLoading(false);
                setIsLoadingNext(false);
                if (Math.ceil(_searchedNFTList.total / pageSize) > pageNum) setHasMore(true);
            }
        };
        if ((signInDlgState.isLoggedIn && signInDlgState.address) || !signInDlgState.isLoggedIn)
            getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.address, sortBy, filters, filterRange, keyWord, category, pageNum]); //, productViewMode

    const fetchMoreData = () => {
        if (!isLoadingNext) {
            setIsLoadingNext(true);
            setPageNum(pageNum + 1);
            setHasMore(false);
        }
    };

    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
        if (keyWord === value) return;
        setKeyWord(value);
    };

    const handleChangeSortBy = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSortBy(item);
    };

    const handlerFilterChange = (
        status: number,
        minPrice: string,
        maxPrice: string,
        category: TypeSelectItem | undefined,
        opened: boolean,
    ) => {
        if (opened) {
            let _filters: Array<enumFilterOption> = [];
            if (status === 0) _filters.push(enumFilterOption.buyNow);
            else if (status === 1) _filters.push(enumFilterOption.onAuction);
            else if (status === 2) _filters.push(enumFilterOption.hasBids);
            setFilters(_filters);
            setFilterRange({
                min: minPrice === '' ? undefined : parseFloat(minPrice),
                max: maxPrice === '' ? undefined : parseFloat(maxPrice),
            });
            setCategory(category);
            if (clearOption) setClearOption(false);
        }
    };
    // -------------- Option Bar -------------- //

    // -------------- Likes -------------- //
    const updateProductLikes = (id: number, type: string) => {
        let prodList: Array<TypeProduct> = [...productList];
        if (type === 'inc') {
            prodList[id].likes += 1;
        } else if (type === 'dec') {
            prodList[id].likes -= 1;
        }
        setProductList(prodList);
    };

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box minHeight="75vh">
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8} touchStartPreventDefault={false}>
                    {adBanners.length ? (
                        adBanners.map((item, index) => (
                            <SwiperSlide key={`banner-carousel-${index}`}>
                                <Box
                                    overflow="hidden"
                                    onClick={() => {}}
                                    sx={{
                                        height: 330,
                                        maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                                        backgroundColor: '#C3C5C8',
                                    }}
                                >
                                    {item !== '' && (
                                        <img
                                            src={item}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                maxHeight: 330,
                                            }}
                                        />
                                    )}
                                </Box>
                            </SwiperSlide>
                        ))
                    ) : (
                        <Box
                            onClick={() => {}}
                            sx={{
                                height: 330,
                                maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                                backgroundColor: '#C3C5C8',
                            }}
                        />
                    )}
                </Swiper>
            </Box>
            <Container sx={{ overflow: 'visible' }}>
                <OptionsBar
                    sortOptions={sortOptions}
                    sortSelected={sortBy}
                    productViewMode={productViewMode}
                    emptyKeyword={emptyKeyword}
                    clearOption={clearOption}
                    handleKeyWordChange={handleKeyWordChange}
                    handlerFilterChange={handlerFilterChange}
                    handleSortChange={handleChangeSortBy}
                    setProductViewMode={(value: 'grid1' | 'grid2') => {
                        setProductViewMode(value);
                        document.cookie = `METEAST_PREVIEW=${
                            value === 'grid1' ? '1' : '2'
                        }; Path=/; SameSite=None; Secure`;
                    }}
                    marginTop={{ xs: 3, md: 5 }}
                />
                <InfiniteScroll
                    dataLength={productList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<></>}
                    endMessage={
                        <>
                            {!productList.length && !isLoading && (
                                <LooksEmptyBox
                                    bannerTitle={
                                        !(
                                            !keyWord &&
                                            filterRange.min === undefined &&
                                            filterRange.max === undefined &&
                                            !filters.length &&
                                            !category?.value
                                        )
                                            ? 'No Products Found For This Search'
                                            : 'Looks Empty Here'
                                    }
                                    buttonLabel={
                                        !(
                                            !keyWord &&
                                            filterRange.min === undefined &&
                                            filterRange.max === undefined &&
                                            !filters.length &&
                                            !category?.value
                                        )
                                            ? 'Back to all Items'
                                            : 'GET YOUR FIRST NFT'
                                    }
                                    // sx={{ marginTop: { xs: 3, md: 5 } }}
                                    onBannerBtnClick={() => {
                                        if (
                                            !(
                                                !keyWord &&
                                                filterRange.min === undefined &&
                                                filterRange.max === undefined &&
                                                !filters.length &&
                                                !category?.value
                                            )
                                        ) {
                                            setIsLoading(true);
                                            setProductList([]);
                                            setEmptyKeyword(emptyKeyword + 1);
                                            handleKeyWordChange('');
                                            setClearOption(true);
                                        } else {
                                            setDialogState({
                                                ...dialogState,
                                                createNFTDlgOpened: true,
                                                createNFTDlgStep: 0,
                                            });
                                        }
                                    }}
                                />
                            )}
                        </>
                    }
                >
                    <Grid container marginTop={{ xs: 3, md: 5 }} columnSpacing={4} rowGap={4}>
                        {(isLoading ? [...productList, ...fillerItem] : productList).map((item, index) => (
                            <Grid
                                item
                                xs={productViewMode === 'grid1' ? 12 : 6}
                                md={productViewMode === 'grid1' ? 6 : 4}
                                lg={productViewMode === 'grid1' ? 6 : 3}
                                key={`explore-product-${index}`}
                            >
                                <NFTPreview
                                    isLoading={isLoading && index >= productList.length}
                                    product={item}
                                    productType={1}
                                    index={index}
                                    productViewMode={productViewMode}
                                    updateLikes={updateProductLikes}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </Container>
        </Box>
    );
};

export default ExplorePage;
