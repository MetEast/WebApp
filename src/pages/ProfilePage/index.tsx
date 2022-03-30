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
    getMyFavouritesList,
    getSearchParams,
    getMyNFTItemList,
    getMyTodayEarned,
    getMyTotalEarned,
    getMyEarnedList,
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
import { useCookies } from 'react-cookie';

const ProfilePage: React.FC = (): JSX.Element => {
    const navigate = useNavigate();
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [cookies, setCookies] = useCookies(['METEAST_PREVIEW_1']);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>(
        cookies.METEAST_PREVIEW_1 === '1' ? 'grid1' : 'grid2',
    );
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [category, setCategory] = useState<TypeSelectItem>();
    const [keyWord, setKeyWord] = useState<string>('');
    const [emptyKeyword, setEmptyKeyword] = useState<number>(0);
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        nftGalleryFilterBtnTypes.All,
    );
    const [reload, setReload] = useState<boolean>(false);
    const [toatlEarned, setTotalEarned] = useState<string>('0');
    const [todayEarned, setTodayEarned] = useState<string>('0');
    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const [myNFTList, setMyNFTList] = useState<Array<Array<TypeProduct>>>(Array(6).fill(Array(4).fill(blankMyNFTItem)));
    const [isLoadingAssets, setIsLoadingAssets] = useState<Array<boolean>>(Array(6).fill(true));
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;
    let firstLoading = true;

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
        const fetchAllTab = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters, category);
            Array(6)
                .fill(0)
                .forEach(async (_, i: number) => {
                    if (!unmounted) {
                        setLoadingState(i, true);
                    }
                    const _searchedMyNFTList = await getMyNFTItemList(
                        searchParams,
                        ELA2USD,
                        likeList,
                        i,
                        signInDlgState.walletAccounts[0],
                        signInDlgState.userDid,
                    );
                    if (!unmounted) {
                        setMyNFTData(i, _searchedMyNFTList);
                        setLoadingState(i, false);
                        if (i === 5) firstLoading = false;
                    }
                });
        };
        const fetchSingleTab = async () => {
            const nTabId = getSelectedTabIndex();
            // if (!unmounted) {
            //     setLoadingState(nTabId, true);
            // }
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters, category);
            const _searchedMyNFTList = await getMyNFTItemList(
                searchParams,
                ELA2USD,
                likeList,
                nTabId,
                signInDlgState.walletAccounts[0],
                signInDlgState.userDid,
            );
            if (!unmounted) {
                setMyNFTData(nTabId, _searchedMyNFTList);
                setLoadingState(nTabId, false);
            }
        };
        if (signInDlgState.isLoggedIn && signInDlgState.walletAccounts.length !== 0 && signInDlgState.userDid !== '') {
            if (firstLoading) fetchAllTab().catch(console.error);
            else fetchSingleTab().catch(console.error);
        } else if (!signInDlgState.isLoggedIn) {
            navigate('/');
        }
        return () => {
            unmounted = true;
        };
    }, [
        signInDlgState.isLoggedIn,
        signInDlgState.walletAccounts,
        signInDlgState.userDid,
        sortBy,
        filters,
        filterRange,
        keyWord,
        category,
        nftGalleryFilterBtnSelected,
        reload,
    ]); //, productViewMode

    //-------------- today earned, totoal earned, earned list -------------- //
    useEffect(() => {
        let unmounted = false;
        const fetchUserProfit = async () => {
            const _totalEarned = await getMyTotalEarned(signInDlgState.walletAccounts[0]);
            const _todayEarned = await getMyTodayEarned(signInDlgState.walletAccounts[0]);
            const _myEarnedList = await getMyEarnedList(signInDlgState.walletAccounts[0]);
            if (!unmounted) {
                setTotalEarned(_totalEarned);
                setTodayEarned(_todayEarned);
                setEarningList(_myEarnedList);
            }
        };
        if (signInDlgState.isLoggedIn) {
            fetchUserProfit().catch(console.error);
        } else {
            navigate('/');
        }
        return () => {
            unmounted = true;
        };
    }, [signInDlgState.isLoggedIn, signInDlgState.walletAccounts]);
    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
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

    const handleClickFilterItem = (filter: enumFilterOption) => () => {
        if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    };
    // -------------- Option Bar -------------- //

    // -------------- Views -------------- //
    const updateProductLikes = (id: number, type: string) => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) {
            setReload(!reload);
        } else {
            const _myNFTList: Array<Array<TypeProduct>> = [...myNFTList];
            const prodList: Array<TypeProduct> = _myNFTList[getSelectedTabIndex()];
            const likedList: Array<TypeProduct> = _myNFTList[5];
            if (type === 'inc') {
                prodList[id].likes += 1;
                prodList[id].isLike = true;
                likedList.push(prodList[id]);
            } else if (type === 'dec') {
                const idx = likedList.indexOf(prodList[id]);
                likedList.splice(idx, 1);
                prodList[id].isLike = false;
                prodList[id].likes -= 1;
            }
            setMyNFTData(id, prodList);
            setMyNFTData(5, likedList);
        }
    };

    const onBannerBtnClick = () => {
        if (keyWord === '') {
            setDialogState({
                ...dialogState,
                createNFTDlgOpened: true,
                createNFTDlgStep: 0,
            });
        } else {
            setEmptyKeyword(emptyKeyword + 1);
            handleKeyWordChange('');
        }
    };

    useEffect(() => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) setReload(!reload);
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
                    cursor: 'pointer',
                    backgroundColor: '#C3C5C8',
                }}
            >
                {signInDlgState.userCoverImage !== '' && (
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
                        {signInDlgState.userAvatar !== '' ? (
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
                                            : reduceHexAddress(signInDlgState.walletAccounts[0], 4)}
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
                                    {signInDlgState.userDescription}
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
                                        setNftGalleryFilterBtnSelected(items.label);
                                        setLoadingState(index, true);
                                        setMyNFTData(index, [
                                            blankMyNFTItem,
                                            blankMyNFTItem,
                                            blankMyNFTItem,
                                            blankMyNFTItem,
                                        ]);
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
                                            <p>{myNFTList[index].length}</p>
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
                            handleKeyWordChange={handleKeyWordChange}
                            handlerFilterChange={handlerFilterChange}
                            handleSortChange={handleChangeSortBy}
                            setProductViewMode={(value: 'grid1' | 'grid2') => {
                                setProductViewMode(value);
                                setCookies('METEAST_PREVIEW_1', value === 'grid1' ? '1' : '2', {
                                    path: '/',
                                    sameSite: 'none',
                                    secure: true,
                                });
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
                {!isLoadingAssets[getSelectedTabIndex()] && myNFTList[getSelectedTabIndex()].length === 0 && (
                    <LooksEmptyBox
                        bannerTitle={keyWord === '' ? 'Looks Empty Here' : 'No Products Found For This Search'}
                        buttonLabel={keyWord === '' ? 'GET YOUR FIRST NFT' : 'Back to all Items'}
                        sx={{ marginTop: 6 }}
                        onBannerBtnClick={onBannerBtnClick}
                    />
                )}
                <Grid container mt={{ xs: 2, md: 4 }} columnSpacing={4} rowGap={{ xs: 2, md: 4 }}>
                    {myNFTList[getSelectedTabIndex()].map((item, index) => (
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
                                isLoading={isLoadingAssets[getSelectedTabIndex()]}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <YourEarningDlgContainer earningList={earningList} />
            {/* <EditProfileDlgContainer /> */}
        </>
    );
};

export default ProfilePage;
