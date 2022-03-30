import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from 'react';
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
import {
    getELA2USD,
    getMyFavouritesList,
    getNFTItemList,
    getPageBannerList,
    getSearchParams,
} from 'src/services/fetch';
import Container from 'src/components/Container';
import { blankNFTItem, blankPageBanners } from 'src/constants/init-constants';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import { useCookies } from 'react-cookie';

const ExplorePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [cookies, setCookies] = useCookies(['METEAST_PREVIEW']);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>(
        cookies.METEAST_PREVIEW === '1' ? 'grid1' : 'grid2',
    );
    const [sortBy, setSortBy] = useState<TypeSelectItem | undefined>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [category, setCategory] = useState<TypeSelectItem>();
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [productList, setProductList] = useState<Array<TypeProduct>>([
        blankNFTItem,
        blankNFTItem,
        blankNFTItem,
        blankNFTItem,
    ]);
    const [adBanners, setAdBanners] = useState<string[]>(blankPageBanners);
    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchBanners = async () => {
            const _adBanners = await getPageBannerList(2);
            if (!unmounted) {
                setAdBanners(_adBanners.length === 0 ? blankPageBanners : _adBanners);
            }
        };
        fetchBanners().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, []);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters, category);
            const _searchedNFTList = await getNFTItemList(searchParams, ELA2USD, likeList);
            if (!unmounted) {
                setProductList(_searchedNFTList);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, sortBy, filters, filterRange, keyWord, category]); //, productViewMode
    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
        setProductList([blankNFTItem, blankNFTItem, blankNFTItem, blankNFTItem]);
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
            let filters: Array<enumFilterOption> = [];
            if (status === 0) filters.push(enumFilterOption.buyNow);
            else if (status === 1) filters.push(enumFilterOption.onAuction);
            else if (status === 2) filters.push(enumFilterOption.hasBids);
            setFilters(filters);
            setFilterRange({
                min: minPrice === '' ? undefined : parseFloat(minPrice),
                max: maxPrice === '' ? undefined : parseFloat(maxPrice),
            });
            setCategory(category);
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
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {adBanners.map((item, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Box
                                overflow="hidden"
                                onClick={() => {}}
                                sx={{
                                    height: 330,
                                    maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                                    // cursor: 'pointer',
                                    backgroundColor: '#C3C5C8',
                                }}
                            >
                                {item !== '' && (
                                    <img
                                        src={item}
                                        alt=""
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 330 }}
                                    />
                                )}
                            </Box>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            <Container sx={{ overflow: 'visible' }}>
                <OptionsBar
                    sortOptions={sortOptions}
                    sortSelected={sortBy}
                    productViewMode={productViewMode}
                    emptyKeyword={emptyKeyword}
                    handleKeyWordChange={handleKeyWordChange}
                    handlerFilterChange={handlerFilterChange}
                    handleSortChange={handleChangeSortBy}
                    setProductViewMode={(value: 'grid1' | 'grid2') => {
                        setProductViewMode(value);
                        setCookies('METEAST_PREVIEW', value === 'grid1' ? '1' : '2', {
                            path: '/',
                            sameSite: 'none',
                            secure: true,
                        });
                    }}
                    marginTop={5}
                />
                {productList.length === 0 ? (
                    <LooksEmptyBox
                        bannerTitle="No Products Found For This Search"
                        buttonLabel="Back to all Items"
                        sx={{ marginTop: 6 }}
                        onBannerBtnClick={() => {
                            setEmptyKeyword(emptyKeyword + 1);
                            handleKeyWordChange('');
                        }}
                    />
                ) : (
                    <Grid container mt={2} spacing={4}>
                        {productList.map((item, index) => (
                            <Grid
                                item
                                xs={productViewMode === 'grid1' ? 12 : 6}
                                md={productViewMode === 'grid1' ? 6 : 4}
                                lg={productViewMode === 'grid1' ? 6 : 3}
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
                )}
            </Container>
        </Box>
    );
};

export default ExplorePage;
