/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import 'swiper/swiper-bundle.css';
import { TypeFilterRange } from 'src/types/filter-types';
import NFTPreview from 'src/components/NFTPreview';
import OptionsBar from 'src/components/OptionsBar';
import { sortOptions } from 'src/constants/select-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { TypeProduct } from 'src/types/product-types';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import {
    getELA2USD,
    getBBItemList,
    getPageBannerList,
    getSearchParams,
    getMyFavouritesBB,
} from 'src/services/fetch';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import Container from 'src/components/Container';
import { blankBBItem } from 'src/constants/init-constants';
import InfiniteScroll from 'react-infinite-scroll-component';

const MysteryBoxPage: React.FC = (): JSX.Element => {
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
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [clearOption, setClearOption] = useState<boolean>(false);
    const [adBanners, setAdBanners] = useState<string[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize] = useState<number>(20);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isLoadingNext, setIsLoadingNext] = useState<boolean>(true);
    const [blindBoxList, setBlindBoxList] = useState<Array<TypeProduct>>([]);
    const [ELA2USD, setELA2USD] = useState<number>(0);
    const [myFavorList, setMyFavorList] = useState<Array<string>>([]);
    let ELA2USDRate: number = 0;
    let likeList: Array<string> = [];
    const fillerItem = Array(pageSize).fill(blankBBItem);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchBanners = async () => {
            const _adBanners = await getPageBannerList(3);
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
            setBlindBoxList([]);
        }
        const getFetchData = async () => {
            if (!unmounted) setIsLoading(true);
            if (pageNum === 1) {
                ELA2USDRate = await getELA2USD();
                setELA2USD(ELA2USDRate);
                likeList = await getMyFavouritesBB(signInDlgState.isLoggedIn, signInDlgState.token);
                setMyFavorList(likeList);
            }
            const searchParams = getSearchParams(pageNum, pageSize, keyWord, sortBy, filterRange, [], undefined);
            const _searchedBBList = await getBBItemList(
                JSON.stringify(searchParams),
                ELA2USDRate ? ELA2USDRate : ELA2USD,
                likeList.length ? likeList : myFavorList,
            );
            if (!unmounted) {
                if (pageNum === 1) setBlindBoxList(_searchedBBList.data);
                else setBlindBoxList([...blindBoxList, ..._searchedBBList.data]);
                setIsLoading(false);
                setIsLoadingNext(false);
                if (Math.ceil(_searchedBBList.total / pageSize) > pageNum) setHasMore(true);
            }
        };
        if ((signInDlgState.isLoggedIn && signInDlgState.address) || !signInDlgState.isLoggedIn)
            getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.address, sortBy, filterRange, keyWord, pageNum]); //, productViewMode

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
            if (clearOption) setClearOption(false);
            setFilterRange({
                min: minPrice === '' ? undefined : parseFloat(minPrice),
                max: maxPrice === '' ? undefined : parseFloat(maxPrice),
            });
        }
    };
    // -------------- Option Bar -------------- //

    // -------------- Likes -------------- //
    const updateBlindBoxLikes = (id: number, type: string) => {
        let bbList: Array<TypeProduct> = [...blindBoxList];
        if (type === 'inc') {
            bbList[id].likes += 1;
        } else if (type === 'dec') {
            bbList[id].likes -= 1;
        }
        setBlindBoxList(bbList);
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
            <Container>
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
                    dataLength={blindBoxList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<></>}
                    endMessage={
                        <>
                            {!blindBoxList.length && !isLoading && (
                                <LooksEmptyBox
                                    bannerTitle={
                                        !(!keyWord && filterRange.min === undefined && filterRange.max === undefined)
                                            ? 'No Boxes Found For This Search'
                                            : 'Looks Empty Here'
                                    }
                                    buttonLabel={
                                        !(!keyWord && filterRange.min === undefined && filterRange.max === undefined)
                                            ? 'Back to all Items'
                                            : 'GET YOUR FIRST Mystery Box'
                                    }
                                    // sx={{ marginTop: { xs: 3, md: 5 } }}
                                    onBannerBtnClick={() => {
                                        if (
                                            !(
                                                !keyWord &&
                                                filterRange.min === undefined &&
                                                filterRange.max === undefined
                                            )
                                        ) {
                                            setIsLoading(true);
                                            setBlindBoxList([]);
                                            setEmptyKeyword(emptyKeyword + 1);
                                            handleKeyWordChange('');
                                            setClearOption(true);
                                        } else {
                                            setDialogState({
                                                ...dialogState,
                                                createBlindBoxDlgOpened: true,
                                                createBlindBoxDlgStep: 0,
                                            });
                                        }
                                    }}
                                />
                            )}
                        </>
                    }
                >
                    <Grid container marginTop={{ xs: 3, md: 5 }} columnSpacing={4} rowGap={4}>
                        {(isLoading ? [...blindBoxList, ...fillerItem] : blindBoxList).map((item, index) => (
                            <Grid
                                item
                                xs={productViewMode === 'grid1' ? 12 : 6}
                                md={productViewMode === 'grid1' ? 6 : 4}
                                lg={productViewMode === 'grid1' ? 6 : 3}
                                key={`explore-product-${index}`}
                            >
                                <NFTPreview
                                    isLoading={isLoading && index >= blindBoxList.length}
                                    product={item}
                                    productType={2}
                                    index={index}
                                    productViewMode={productViewMode}
                                    updateLikes={updateBlindBoxLikes}
                                    isBlindBox={true}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </Container>
        </Box>
    );
};

export default MysteryBoxPage;
