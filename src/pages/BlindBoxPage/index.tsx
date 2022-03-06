import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import NFTPreview from 'src/components/NFTPreview';
import OptionsBar from 'src/components/OptionsBar';
import { sortOptions } from 'src/constants/select-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { TypeProduct } from 'src/types/product-types';
import { useSignInContext } from 'src/context/SignInContext';
import { getELA2USD, getSearchParams, getBBItemList } from 'src/services/fetch';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';
import Container from 'src/components/Container';
import { blankBBItem } from 'src/constants/init-constants';

const BlindBoxPage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');

    const [blindBoxList, setBlindBoxList] = useState<Array<TypeProduct>>([
        blankBBItem,
        blankBBItem,
        blankBBItem,
        blankBBItem,
    ]);

    const adBanners = [
        '/assets/images/banners/banner1.png',
        '/assets/images/banners/banner2.png',
        '/assets/images/banners/banner3.png',
    ];

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters);
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
        let bbList: Array<TypeProduct> = [...blindBoxList];
        if (type === 'inc') {
            bbList[id].likes += 1;
        } else if (type === 'dec') {
            bbList[id].likes -= 1;
        }
        setBlindBoxList(bbList);
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
                            <NFTPreview
                                product={item}
                                productType={2}
                                index={index}
                                updateLikes={updateBlindBoxLikes}
                                isBlindBox={true}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default BlindBoxPage;
