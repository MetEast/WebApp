import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import 'swiper/swiper-bundle.css';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import NFTPreview from 'src/components/NFTPreview';
import OptionsBar from 'src/components/OptionsBar';
import { sortOptions } from 'src/constants/select-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { TypeProduct } from 'src/types/product-types';
import { useSignInContext } from 'src/context/SignInContext';
import { getELA2USD, getSearchParams, getBBItemList, getPageBannerList } from 'src/services/fetch';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';
import Container from 'src/components/Container';
import { blankBBItem, blankPageBanners } from 'src/constants/init-constants';

const BlindBoxPage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [blindBoxList, setBlindBoxList] = useState<Array<TypeProduct>>([
        blankBBItem,
        blankBBItem,
        blankBBItem,
        blankBBItem,
    ]);
    const [adBanners, setAdBanners] = useState<string[]>(blankPageBanners);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchBanners = async () => {
            const _adBanners = await getPageBannerList(signInDlgState.walletAccounts[0], 3);
            if (!unmounted) {
                setAdBanners(_adBanners.length === 0 ? blankPageBanners : _adBanners);
            }
        };
        if (signInDlgState.walletAccounts.length) fetchBanners().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.walletAccounts]);

    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters, undefined);
            const _searchedBBList = await getBBItemList(
                searchParams,
                ELA2USD,
                signInDlgState.isLoggedIn,
                signInDlgState.userDid,
            );
            if (!unmounted) {
                setBlindBoxList(_searchedBBList);
            }
        };
        getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, sortBy, filters, filterRange, keyWord]); //, productViewMode
    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
        setBlindBoxList([blankBBItem, blankBBItem, blankBBItem, blankBBItem]);
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
        }
    };
    // -------------- Option Bar -------------- //

    // -------------- Views -------------- //
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
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {adBanners.map((item, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <Box
                                overflow="hidden"
                                onClick={() => {}}
                                sx={{
                                    height: 330,
                                    maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                                    cursor: 'pointer',
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
            <Container>
                <OptionsBar
                    sortOptions={sortOptions}
                    sortSelected={sortBy}
                    productViewMode={productViewMode}
                    emptyKeyword={emptyKeyword}
                    handleKeyWordChange={handleKeyWordChange}
                    handlerFilterChange={handlerFilterChange}
                    handleSortChange={handleChangeSortBy}
                    setProductViewMode={setProductViewMode}
                    marginTop={5}
                />
                {blindBoxList.length === 0 ? (
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
                        {blindBoxList.map((item, index) => (
                            <Grid
                                item
                                xs={productViewMode === 'grid1' ? 12 : 6}
                                md={productViewMode === 'grid1' ? 6 : 4}
                                lg={productViewMode === 'grid1' ? 6 : 3}
                                key={`explore-product-${index}`}
                            >
                                <NFTPreview
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
                )}
            </Container>
        </Box>
    );
};

export default BlindBoxPage;
