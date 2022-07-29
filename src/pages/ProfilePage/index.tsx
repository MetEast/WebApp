/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Typography, Stack, Skeleton } from '@mui/material';
import { useSignInContext } from 'src/context/SignInContext';
import MyNFTGalleryItem from 'src/components/MyNFTGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants';
import { nftGalleryFilterBtnTypes, nftGalleryFilterButtons } from 'src/constants/nft-gallery-filter-buttons';
import { TypeSelectItem } from 'src/types/select-types';
import { FilterItemTypography, FilterButton, ProfileImageWrapper, ProfileImage, NotificationTypo } from './styles';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeProduct, TypeYourEarning } from 'src/types/product-types';
import { getImageFromAsset, reduceHexAddress, reduceUserName } from 'src/services/common';
import {
    getELA2USD,
    getMyNFTItemList,
    getMyTodayEarned,
    getMyTotalEarned,
    getMyEarnedList,
    getSearchParams,
    getMyFavouritesNFT,
} from 'src/services/fetch';
import LooksEmptyBox from 'src/components/Profile/LooksEmptyBox';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from 'src/components/Container';
import { blankMyNFTItem } from 'src/constants/init-constants';
import { useNavigate } from 'react-router-dom';
// import EditProfileDlgContainer from 'src/components/Profile/EditProfile';
import YourEarningDlgContainer from 'src/components/Profile/YourEarnings';
import { Markup } from 'interweave';
import InfiniteScroll from 'react-infinite-scroll-component';

const ProfilePage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
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
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [category, setCategory] = useState<TypeSelectItem>();
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [clearOption, setClearOption] = useState<boolean>(false);
    const selectedTab = () => {
        switch (
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('METEAST_PROFILE='))
                ?.split('=')[1] ||
            ''
        ) {
            case 'Owned':
                return nftGalleryFilterBtnTypes.Acquired;
            case 'Created':
                return nftGalleryFilterBtnTypes.Created;
            case 'For Sale':
                return nftGalleryFilterBtnTypes.ForSale;
            case 'Sold':
                return nftGalleryFilterBtnTypes.Sold;
            case 'Liked':
                return nftGalleryFilterBtnTypes.Liked;
            default:
                return nftGalleryFilterBtnTypes.All;
        }
    };
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        selectedTab(),
    );
    const [reload, setReload] = useState<boolean>(false);
    const [toatlEarned, setTotalEarned] = useState<string>('0');
    const [todayEarned, setTodayEarned] = useState<string>('0');
    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize] = useState<number>(20);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [isLoadingNext, setIsLoadingNext] = useState<boolean>(true);
    const [myNFTList, setMyNFTList] = useState<Array<Array<TypeProduct>>>(Array(6).fill([]));
    const [myNFTCount, setMyNFTCount] = useState<Array<number>>(Array(6).fill(0));
    const [isLoadingAssets, setIsLoadingAssets] = useState<Array<boolean>>(Array(6).fill(true));
    const [ELA2USD, setELA2USD] = useState<number>(0);
    const [myFavorList, setMyFavorList] = useState<Array<String>>([]);
    const fillerItem = Array(pageSize).fill(blankMyNFTItem);
    let ELA2USDRate: number = 0;
    let likeList: Array<String> = [];

    // -------------- Fetch Data -------------- //
    const setLoadingState = (id: number, state: boolean) => {
        setIsLoadingAssets((prevState) => {
            const _isLoadingAssets = [...prevState];
            _isLoadingAssets[id] = state;
            return _isLoadingAssets;
        });
    };

    const setMyNFTData = (id: number, myNFT: Array<TypeProduct>) => {
        if (!myNFT) return;
        setMyNFTList((prevState) => {
            const _myNFTList = [...prevState];
            _myNFTList[id] = myNFT;
            return _myNFTList;
        });
    };

    const setMyNFTTotal = (id: number, count: number) => {
        setMyNFTCount((prevState) => {
            const _myNFTCount = [...prevState];
            _myNFTCount[id] = count;
            return _myNFTCount;
        });
    };

    const getSelectedTabIndex = () => {
        switch (nftGalleryFilterBtnSelected) {
            case nftGalleryFilterBtnTypes.All:
                return 0;
            case nftGalleryFilterBtnTypes.Acquired:
                return 1;
            case nftGalleryFilterBtnTypes.Created:
                return 2;
            case nftGalleryFilterBtnTypes.ForSale:
                return 3;
            case nftGalleryFilterBtnTypes.Sold:
                return 4;
            case nftGalleryFilterBtnTypes.Liked:
                return 5;
        }
    };
    //-------------- get My NFT List -------------- //
    useEffect(() => {
        let unmounted = false;
        const nTabId = getSelectedTabIndex();
        // reset pageNum when search param has changed
        if (!unmounted && !isLoadingNext) {
            setPageNum(1);
            setMyNFTData(nTabId, []);
        }
        const getFetchData = async () => {
            Array(6)
                .fill(0)
                .forEach(async (_, i: number) => {
                    if (!(pageNum !== 1 && i !== nTabId)) {
                        if (!unmounted) {
                            setLoadingState(i, true);
                        }
                        if (pageNum === 1 && i === nTabId) {
                            ELA2USDRate = await getELA2USD();
                            setELA2USD(ELA2USDRate);
                            likeList = await getMyFavouritesNFT(signInDlgState.isLoggedIn, signInDlgState.token);
                            setMyFavorList(likeList);
                        }
                        const searchParams = getSearchParams(
                            i === nTabId ? pageNum : 1,
                            i === nTabId ? pageSize : 1,
                            keyWord,
                            sortBy,
                            filterRange,
                            filters,
                            category,
                        );
                        const _searchedMyNFTList = await getMyNFTItemList(
                            JSON.stringify({ ...searchParams, address: signInDlgState.address }),
                            ELA2USDRate ? ELA2USDRate : ELA2USD,
                            likeList.length ? likeList : myFavorList,
                            i,
                            signInDlgState.address,
                            signInDlgState.token,
                        );
                        if (!unmounted) {
                            if (pageNum === 1) setMyNFTData(i, _searchedMyNFTList.data);
                            else setMyNFTData(i, [...myNFTList[i], ..._searchedMyNFTList.data]);
                            setMyNFTTotal(i, _searchedMyNFTList.total);
                            setLoadingState(i, false);
                            setIsLoadingNext(false);
                            if (i === nTabId && Math.ceil(_searchedMyNFTList.total / pageSize) > pageNum)
                                setHasMore(true);
                        }
                    }
                });
        };
        if (signInDlgState.isLoggedIn && signInDlgState.address && signInDlgState.token) {
            getFetchData().catch(console.error);
        } else if (!signInDlgState.isLoggedIn) {
            navigate('/');
        }
        return () => {
            unmounted = true;
        };
    }, [
        signInDlgState.isLoggedIn,
        signInDlgState.address,
        signInDlgState.token,
        sortBy,
        filters,
        filterRange,
        keyWord,
        category,
        nftGalleryFilterBtnSelected,
        reload,
        pageNum,
    ]); //, productViewMode

    //-------------- today earned, totoal earned, earned list -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchUserProfit = async () => {
            const _totalEarned = await getMyTotalEarned(signInDlgState.address);
            const _todayEarned = await getMyTodayEarned(signInDlgState.address);
            const _myEarnedList = await getMyEarnedList(signInDlgState.address);
            if (!unmounted) {
                setTotalEarned(_totalEarned);
                setTodayEarned(_todayEarned);
                setEarningList(_myEarnedList);
            }
        };
        if (signInDlgState.isLoggedIn) {
            if (signInDlgState.address) fetchUserProfit().catch(console.error);
        } else navigate('/');

        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInDlgState.isLoggedIn, signInDlgState.address]);

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
        setIsLoadingAssets(Array(6).fill(true));
        setMyNFTList(Array(6).fill(Array(4).fill(blankMyNFTItem)));
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
        }
    };

    const handleClickFilterItem = (filter: enumFilterOption) => () => {
        if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    };
    // -------------- Option Bar -------------- //

    // -------------- Likes -------------- //
    const updateProductLikes = (id: number, type: string) => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) {
            setReload(!reload);
        } else {
            const _myNFTList: Array<Array<TypeProduct>> = [...myNFTList];
            const prodList: Array<TypeProduct> = _myNFTList[getSelectedTabIndex()];
            let change = 0;
            // const likedList: Array<TypeProduct> = _myNFTList[5];
            if (type === 'inc') {
                prodList[id].likes = (prodList[id].likes ? prodList[id].likes : 0) + 1;
                prodList[id].isLike = true;
                // likedList.push(prodList[id]);
                change++;
            } else if (type === 'dec') {
                // const idx = likedList.indexOf(prodList[id]);
                // likedList.splice(idx, 1);
                prodList[id].isLike = false;
                prodList[id].likes -= 1;
                change--;
            }
            setMyNFTData(id, prodList);
            setMyNFTTotal(5, myNFTCount[5] + change);
            // setMyNFTData(5, likedList);
        }
    };

    const onBannerBtnClick = () => {
        if (
            !keyWord &&
            filterRange.min === undefined &&
            filterRange.max === undefined &&
            !filters.length &&
            !category?.value
        ) {
            setDialogState({
                ...dialogState,
                createNFTDlgOpened: true,
                createNFTDlgStep: 0,
            });
        } else {
            setEmptyKeyword(emptyKeyword + 1);
            handleKeyWordChange('');
            setClearOption(true);
        }
    };

    useEffect(() => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) setReload(!reload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftGalleryFilterBtnSelected]);

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <>
            <Box
                onClick={() => {}}
                sx={{
                    height: 330,
                    maxHeight: matchUpMd ? 330 : matchDownSm ? 178 : 330,
                    backgroundColor: '#C3C5C8',
                }}
            >
                {signInDlgState.userCoverImage && (
                    <img
                        src={getImageFromAsset(signInDlgState.userCoverImage)}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 330 }}
                    />
                )}
            </Box>
            <Container sx={{ overflow: 'visible' }}>
                <Stack alignItems="center">
                    <ProfileImageWrapper display={signInDlgState.userAvatar !== '' ? 'flex' : 'grid'}>
                        {signInDlgState.userAvatar ? (
                            <ProfileImage src={getImageFromAsset(signInDlgState.userAvatar)} />
                        ) : (
                            <Icon icon="ph:user" fontSize={matchUpMd ? 80 : matchDownSm ? 40 : 60} color="#1890FF" />
                        )}
                    </ProfileImageWrapper>
                    <Stack
                        width="100%"
                        direction="row"
                        justifyContent="space-between"
                        marginTop={-6}
                        display={{ xs: 'none', sm: 'flex' }}
                    >
                        <SecondaryButton
                            size="small"
                            sx={{ paddingX: 2.5 }}
                            onClick={() => {
                                setDialogState({ ...dialogState, earningDlgOpened: true });
                            }}
                        >
                            <Icon
                                icon="ph:coin"
                                fontSize={20}
                                color="#1890FF"
                                style={{ marginBottom: 1, marginRight: 4 }}
                            />
                            Earnings
                        </SecondaryButton>
                        <SecondaryButton
                            size="small"
                            sx={{ paddingX: 2.5 }}
                            onClick={() => {
                                setDialogState({ ...dialogState, editProfileDlgOpened: true });
                            }}
                        >
                            <Icon
                                icon="ph:magic-wand"
                                fontSize={20}
                                color="#1890FF"
                                style={{ marginBottom: 1, marginRight: 4 }}
                            />
                            Edit Profile
                        </SecondaryButton>
                    </Stack>
                    <Grid container>
                        <Grid
                            item
                            xs={12}
                            display={{ xs: 'none', sm: 'flex' }}
                            order={{ sm: 1, lg: 0 }}
                            marginTop={{ sm: -7, lg: 2 }}
                        >
                            <Stack width="100%" direction="row" justifyContent="space-between">
                                <Stack>
                                    <Typography fontSize={20} fontWeight={900}>
                                        {toatlEarned}&nbsp;ELA
                                    </Typography>
                                    <Typography fontSize={16} fontWeight={400}>
                                        Total Earned
                                    </Typography>
                                </Stack>
                                <Stack alignItems="flex-end">
                                    <Typography fontSize={20} fontWeight={900}>
                                        {todayEarned}&nbsp;ELA
                                    </Typography>
                                    <Typography fontSize={16} fontWeight={400}>
                                        Earned Today
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} order={{ sm: 0, lg: 1 }} marginTop={{ xs: 3, sm: 5, lg: -4 }}>
                            <Stack alignItems="center">
                                <Stack alignItems="center" width="100%">
                                    <Typography
                                        width={{ lg: '80%' }}
                                        fontSize={{ xs: 32, sm: 40 }}
                                        fontWeight={700}
                                        textAlign="center"
                                        lineHeight={1.1}
                                    >
                                        {signInDlgState.userName
                                            ? signInDlgState.userName.length > 40
                                                ? reduceUserName(signInDlgState.userName, 4)
                                                : signInDlgState.userName
                                            : reduceHexAddress(signInDlgState.address, 4)}
                                    </Typography>
                                    <SecondaryButton
                                        sx={{
                                            height: 24,
                                            fontSize: 14,
                                            fontWeight: 500,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            display: { xs: 'none', sm: 'none' },
                                            alignItems: 'center',
                                        }}
                                        onClick={() => {
                                            navigate('/admin/nfts');
                                        }}
                                    >
                                        <Icon
                                            icon="ph:user"
                                            fontSize={16}
                                            color="#1890FF"
                                            style={{ marginBottom: 1, marginRight: 4 }}
                                        />
                                        Admin
                                    </SecondaryButton>
                                </Stack>
                                <Typography
                                    width={{ xs: '90%', sm: '80%', md: '60%' }}
                                    fontSize={{ xs: 14, sm: 16, md: 18 }}
                                    fontWeight={400}
                                    textAlign="center"
                                    marginTop={1}
                                >
                                    <Markup content={signInDlgState.userDescription} />
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 2 }} marginTop={3.5}>
                                    <SecondaryButton
                                        size="small"
                                        sx={{ minWidth: 54, display: { xs: 'none', sm: 'none' } }}
                                    >
                                        <Icon icon="ph:chat-circle" fontSize={20} color="black" />
                                        <NotificationTypo>2</NotificationTypo>
                                    </SecondaryButton>
                                    <PrimaryButton
                                        btn_color="secondary"
                                        size="small"
                                        sx={{ minWidth: 40, display: { sm: 'none' }, marginRight: '10px !important' }}
                                        onClick={() => {
                                            setDialogState({ ...dialogState, manageProfileDlgOpened: true });
                                        }}
                                    >
                                        <Icon icon="ci:settings-future" fontSize={24} />
                                    </PrimaryButton>
                                    <PrimaryButton
                                        size={matchDownSm ? 'small' : undefined}
                                        sx={{ paddingX: { xs: 2, sm: 4 }, fontSize: { xs: 14, sm: 18 } }}
                                        onClick={() => {
                                            setDialogState({
                                                ...dialogState,
                                                createNFTDlgOpened: true,
                                                createNFTDlgStep: 0,
                                            });
                                        }}
                                    >
                                        Create NFT
                                    </PrimaryButton>
                                    <PrimaryButton
                                        size={matchDownSm ? 'small' : undefined}
                                        sx={{
                                            paddingX: { xs: 2, sm: 4 },
                                            fontSize: { xs: 14, sm: 18 },
                                            background: '#A453D6',
                                            '&:hover': { background: '#A463D6' },
                                        }}
                                        onClick={() => {
                                            setDialogState({
                                                ...dialogState,
                                                createBlindBoxDlgOpened: true,
                                                createBlindBoxDlgStep: 0,
                                            });
                                        }}
                                    >
                                        New Mystery Box
                                    </PrimaryButton>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
                <Grid container marginTop={4} alignItems="center" rowSpacing={2.5}>
                    <Grid item xs={12} md={3} order={0}>
                        <Typography fontSize={{ xs: 28, sm: 32, md: 42 }} fontWeight={700} lineHeight={1.1}>
                            Your NFTs
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                        <Stack
                            direction="row"
                            justifyContent={{ xs: 'auto', md: 'flex-end' }}
                            spacing={0.5}
                            paddingBottom={{ xs: 1, sm: 0 }}
                            sx={{ overflowY: 'hidden', overflowX: 'auto' }}
                        >
                            {nftGalleryFilterButtonsList.map((items, index) => (
                                <FilterButton
                                    key={`filter-button-${index}`}
                                    selected={items.label === nftGalleryFilterBtnSelected}
                                    loading={isLoadingAssets[index] ? 1 : 0}
                                    onClick={() => {
                                        if (items.label === nftGalleryFilterBtnSelected) setReload(!reload);
                                        else {
                                            setNftGalleryFilterBtnSelected(items.label);
                                            document.cookie = `METEAST_PROFILE=${items.label}; Path=/; SameSite=None; Secure`;
                                        }
                                        setLoadingState(index, true);
                                        setMyNFTData(index, []);
                                    }}
                                >
                                    {items.label}
                                    <Stack className="itemcount__box">
                                        {isLoadingAssets[index] ? (
                                            <Skeleton
                                                variant="rectangular"
                                                animation="wave"
                                                width="100%"
                                                height="100%"
                                                sx={{
                                                    bgcolor:
                                                        items.label === nftGalleryFilterBtnSelected
                                                            ? '#C8D4DF'
                                                            : '#E8F4FF',
                                                }}
                                            />
                                        ) : (
                                            <p>{myNFTCount[index]}</p>
                                        )}
                                    </Stack>
                                </FilterButton>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} order={{ xs: 1, md: 2 }}>
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
                        />
                    </Grid>
                </Grid>
                {filters.length > 0 && (
                    <Box display="flex" mt={2}>
                        {filters.map((item, index) => (
                            <FilterItemTypography key={`filter-option-${index}`} onClick={handleClickFilterItem(item)}>
                                {filterOptions[item]}{' '}
                                <DismissCircle24Filled style={{ display: 'flex', marginLeft: '4px' }} />
                            </FilterItemTypography>
                        ))}
                    </Box>
                )}
                <InfiniteScroll
                    dataLength={myNFTList[getSelectedTabIndex()].length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<></>}
                    endMessage={
                        <>
                            {!isLoadingAssets[getSelectedTabIndex()] &&
                                myNFTList[getSelectedTabIndex()].length === 0 && (
                                    <LooksEmptyBox
                                        bannerTitle={
                                            !keyWord &&
                                            filterRange.min === undefined &&
                                            filterRange.max === undefined &&
                                            !filters.length &&
                                            !category?.value
                                                ? 'Looks Empty Here'
                                                : 'No Products Found For This Search'
                                        }
                                        buttonLabel={
                                            !keyWord &&
                                            filterRange.min === undefined &&
                                            filterRange.max === undefined &&
                                            !filters.length &&
                                            !category?.value
                                                ? 'GET YOUR FIRST NFT'
                                                : 'Back to all Items'
                                        }
                                        sx={{ marginTop: 2 }}
                                        onBannerBtnClick={onBannerBtnClick}
                                    />
                                )}
                        </>
                    }
                >
                    <Grid container mt={{ xs: 2, md: 4 }} columnSpacing={4} rowGap={{ xs: 2, md: 4 }}>
                        {(isLoadingAssets[getSelectedTabIndex()]
                            ? [...myNFTList[getSelectedTabIndex()], ...fillerItem]
                            : myNFTList[getSelectedTabIndex()]
                        ).map((item, index) => (
                            <Grid
                                item
                                xs={productViewMode === 'grid1' ? 12 : 6}
                                md={productViewMode === 'grid1' ? 6 : 4}
                                lg={productViewMode === 'grid1' ? 6 : 3}
                                key={`profile-product-${index}`}
                            >
                                <MyNFTGalleryItem
                                    product={item}
                                    index={index}
                                    productViewMode={productViewMode}
                                    updateLikes={updateProductLikes}
                                    isLoading={
                                        isLoadingAssets[getSelectedTabIndex()] &&
                                        index >= myNFTList[getSelectedTabIndex()].length
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            </Container>
            <YourEarningDlgContainer earningList={earningList} />
            {/* <EditProfileDlgContainer /> */}
        </>
    );
};

export default ProfilePage;
