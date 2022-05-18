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
import { getELA2USD, getSearchParams, getBBItemList, getPageBannerList } from 'src/services/fetch';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import Container from 'src/components/Container';
import { blankBBItem } from 'src/constants/init-constants';
import { useCookies } from 'react-cookie';

const MysteryBoxPage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [cookies, setCookies] = useCookies(['METEAST_PREVIEW']);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>(
        cookies.METEAST_PREVIEW === '1' ? 'grid1' : 'grid2',
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [clearOption, setClearOption] = useState<boolean>(false);
    const [blindBoxList, setBlindBoxList] = useState<Array<TypeProduct>>(Array(4).fill(blankBBItem));
    const [adBanners, setAdBanners] = useState<string[]>([]);

    // -------------- Fetch Data -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchBanners = async () => {
            const _adBanners = await getPageBannerList(3);
            if (!unmounted) {
                setAdBanners(_adBanners);
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
            if (!unmounted) setIsLoading(true);
            const ELA2USD = await getELA2USD();
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, [], undefined);
            const _searchedBBList = await getBBItemList(
                searchParams,
                ELA2USD,
                signInDlgState.isLoggedIn,
                signInDlgState.userDid,
            );
            if (!unmounted) {
                setBlindBoxList(_searchedBBList);
                setIsLoading(false);
            }
        };
        if ((signInDlgState.isLoggedIn && signInDlgState.userDid) || !signInDlgState.isLoggedIn)
            getFetchData().catch(console.error);
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.userDid, sortBy, filterRange, keyWord]); //, productViewMode
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
                        setCookies('METEAST_PREVIEW', value === 'grid1' ? '1' : '2', {
                            path: '/',
                            sameSite: 'none',
                            secure: true,
                        });
                    }}
                    marginTop={{ xs: 3, md: 5 }}
                />
                {blindBoxList.length === 0 ? (
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
                        sx={{ marginTop: { xs: 3, md: 5 } }}
                        onBannerBtnClick={() => {
                            if (!(!keyWord && filterRange.min === undefined && filterRange.max === undefined)) {
                                setIsLoading(true);
                                setBlindBoxList(Array(4).fill(blankBBItem));
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
                ) : (
                    <Grid container marginTop={{ xs: 3, md: 5 }} columnSpacing={4} rowGap={4}>
                        {blindBoxList.map((item, index) => (
                            <Grid
                                item
                                xs={productViewMode === 'grid1' ? 12 : 6}
                                md={productViewMode === 'grid1' ? 6 : 4}
                                lg={productViewMode === 'grid1' ? 6 : 3}
                                key={`explore-product-${index}`}
                            >
                                <NFTPreview
                                    isLoading={isLoading}
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

export default MysteryBoxPage;
