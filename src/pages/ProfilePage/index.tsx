import React, { useState, useEffect } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Typography, Stack } from '@mui/material';
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
import {
    TypeProduct,
    TypeProductFetch,
    enumMyNFTType,
    TypeFavouritesFetch,
    enumBadgeType,
    TypeYourEarning,
    TypeYourEarningFetch,
} from 'src/types/product-types';
import { getImageFromAsset, getTime, reduceHexAddress } from 'src/services/common';
import { selectFromFavourites } from 'src/services/common';
import {
    getELA2USD,
    getMyFavouritesList,
    getSearchParams,
    getMyNFTItemList,
    getTotalEarned,
    getTodayEarned,
    FETCH_CONFIG_JSON,
} from 'src/services/fetch';
import ModalDialog from 'src/components/ModalDialog';
import YourEarnings from 'src/components/TransactionDialogs/YourEarnings';
import EditProfile from 'src/components/TransactionDialogs/EditProfile';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';
import { Icon } from '@iconify/react';
import UserAvatarBox from 'src/components/profile/UserAvatarBox';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from 'src/components/Container';
import { borderRadius } from '@mui/system';
import { blankMyEarning, blankMyNFTItem } from 'src/constants/init-constants';

const ProfilePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        nftGalleryFilterBtnTypes.All,
    );
    const [earningsDlgOpen, setEarningsDlgOpen] = useState<boolean>(false);
    const [editProfileDlgOpen, setEditProfileDlgOpen] = useState<boolean>(false);
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
    //-------------- get all nft list -------------- //
    useEffect(() => {
        let unmounted = false;
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters);
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
        if (signInDlgState.isLoggedIn && firstLoading) getFetchData().catch(console.error);

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
        nftGalleryFilterBtnSelected,
        reload,
    ]); //, productViewMode

    //-------------- get tab nft list -------------- //
    useEffect(() => {
        let unmounted = false;
        const nTabId = getSelectedTabIndex();
        const getFetchData = async () => {
            const ELA2USD = await getELA2USD();
            const likeList = await getMyFavouritesList(signInDlgState.isLoggedIn, signInDlgState.userDid);
            if (!unmounted) {
                setLoadingState(nTabId, true);
            }
            const searchParams = getSearchParams(keyWord, sortBy, filterRange, filters);
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
        if (signInDlgState.isLoggedIn && !firstLoading) getFetchData().catch(console.error);
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
        nftGalleryFilterBtnSelected,
        reload,
    ]); //, productViewMode

    //-------------- today earned, totoal earned, earned list -------------- //
    const fetchPersonalData = async () => {
        setTotalEarned(await getTotalEarned(signInDlgState.walletAccounts[0]));
        setTodayEarned(await getTodayEarned(signInDlgState.walletAccounts[0]));
        getEarningList();
    };

    const getEarningList = async () => {
        const resEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedListByAddress?address=${signInDlgState.walletAccounts[0]}`,
            FETCH_CONFIG_JSON,
        );
        const dataEarnedResult = await resEarnedResult.json();
        const arrEarnedResult = dataEarnedResult === undefined ? [] : dataEarnedResult.data;

        let _myEarningList: any = [];
        for (let i = 0; i < arrEarnedResult.length; i++) {
            const itemObject: TypeYourEarningFetch = arrEarnedResult[i];
            let _earning: TypeYourEarning = { ...blankMyEarning };
            // _earning.tokenId = itemObject.tokenId;
            _earning.title = itemObject.name;
            _earning.avatar = getImageFromAsset(itemObject.thumbnail);
            _earning.price = itemObject.iEarned / 1e18;
            let timestamp = getTime(itemObject.updateTime);
            _earning.time = timestamp.date + ' ' + timestamp.time;
            _earning.badge = itemObject.Badge === 'Badge' ? enumBadgeType.Sale : enumBadgeType.Royalties;
            _myEarningList.push(_earning);
        }
        setEarningList(_myEarningList);
    };

    useEffect(() => {
        if (signInDlgState.walletAccounts.length) fetchPersonalData();
    }, [signInDlgState]);
    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
        setMyNFTList(Array(6).fill(Array(4).fill(blankMyNFTItem)));
    };

    const handleChangeSortBy = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSortBy(item);
    };

    const handlerFilterChange = (status: number | undefined, minPrice: string, maxPrice: string, opened: boolean) => {
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

    useEffect(() => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) setReload(!reload);
    }, [nftGalleryFilterBtnSelected]);

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Box
                onClick={() => {}}
                sx={{ height: '254px', maxHeight: '254px', cursor: 'pointer', backgroundColor: '#C3C5C8' }}
            >
                {signInDlgState.userCoverImage !== '' && (
                    <img
                        src={getImageFromAsset(signInDlgState.userCoverImage)}
                        alt=""
                        style={{ minWidth: '100%', maxHeight: '254px' }}
                    />
                )}
            </Box>
            <Container sx={{ overflow: 'visible' }}>
                <Stack alignItems="center">
                    <ProfileImageWrapper>
                        {signInDlgState.userAvatar !== '' ? (
                            <ProfileImage
                                src={getImageFromAsset(signInDlgState.userAvatar)}
                                style={{ borderRadius: '50%', width: 'inherit', height: 'inherit' }}
                            />
                        ) : (
                            <Icon icon="ph:user" fontSize={80} color="#1890FF" />
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
                                setEarningsDlgOpen(true);
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
                                setEditProfileDlgOpen(true);
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
                    <Stack
                        width="100%"
                        direction="row"
                        justifyContent="space-between"
                        marginTop={{ sm: 24, md: 2 }}
                        display={{ xs: 'none', sm: 'flex' }}
                    >
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
                    <Stack alignItems="center" marginTop={{ sm: -29, md: -7 }}>
                        <Stack alignItems="center">
                            <Typography fontSize={{ xs: 32, sm: 56 }} fontWeight={700}>
                                {signInDlgState.userName === ''
                                    ? reduceHexAddress(signInDlgState.walletAccounts[0], 4)
                                    : signInDlgState.userName}
                            </Typography>
                            <SecondaryButton
                                sx={{
                                    height: 32,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    display: { xs: 'flex', sm: 'none' },
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
                        <Stack direction="row" alignItems="center" spacing={2} marginTop={3.5}>
                            <SecondaryButton size="small" sx={{ minWidth: 54, display: { xs: 'flex', sm: 'none' } }}>
                                <Icon icon="ph:chat-circle" fontSize={20} color="black" />
                                <NotificationTypo>2</NotificationTypo>
                            </SecondaryButton>
                            <PrimaryButton
                                size={matchDownSm ? 'small' : undefined}
                                sx={{ paddingX: { xs: 2, sm: 4 } }}
                                onClick={() => {
                                    setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                                }}
                            >
                                Create NFT
                            </PrimaryButton>
                            <PrimaryButton
                                size={matchDownSm ? 'small' : undefined}
                                sx={{
                                    paddingX: { xs: 2, sm: 4 },
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
                                New Blind Box
                            </PrimaryButton>
                        </Stack>
                    </Stack>
                </Stack>
                <Grid container marginTop={4} alignItems="center" rowSpacing={2.5}>
                    <Grid item xs={12} md={3} order={0}>
                        <Typography fontSize={42} fontWeight={700} lineHeight={1.1}>
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
                                    onClick={() => setNftGalleryFilterBtnSelected(items.label)}
                                >
                                    {items.label}
                                    <p>{myNFTList[index].length}</p>
                                </FilterButton>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} order={{ xs: 1, md: 2 }}>
                        <OptionsBar
                            sortOptions={sortOptions}
                            sortSelected={sortBy}
                            productViewMode={productViewMode}
                            handleKeyWordChange={handleKeyWordChange}
                            handlerFilterChange={handlerFilterChange}
                            handleSortChange={handleChangeSortBy}
                            setProductViewMode={setProductViewMode}
                        />
                    </Grid>
                </Grid>
                <Box display="flex" mt={3}>
                    {filters.map((item, index) => (
                        <FilterItemTypography key={`filter-option-${index}`} onClick={handleClickFilterItem(item)}>
                            {filterOptions[item]}{' '}
                            <DismissCircle24Filled style={{ display: 'flex', marginLeft: '4px' }} />
                        </FilterItemTypography>
                    ))}
                </Box>
                {!isLoadingAssets[getSelectedTabIndex()] && myNFTList[getSelectedTabIndex()].length === 0 && (
                    <LooksEmptyBox />
                )}
                <Grid container mt={2} spacing={4}>
                    {myNFTList[getSelectedTabIndex()].map((item, index) => (
                        <Grid
                            item
                            xs={productViewMode === 'grid1' ? 12 : 6}
                            md={productViewMode === 'grid1' ? 6 : 3}
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
            <ModalDialog
                open={earningsDlgOpen}
                onClose={() => {
                    setEarningsDlgOpen(false);
                }}
            >
                <YourEarnings
                    earnings={earningList}
                    onClose={() => {
                        setEarningsDlgOpen(false);
                    }}
                />
            </ModalDialog>
            <ModalDialog
                open={editProfileDlgOpen}
                onClose={() => {
                    setEditProfileDlgOpen(false);
                }}
            >
                <EditProfile
                    onClose={() => {
                        setEditProfileDlgOpen(false);
                    }}
                />
            </ModalDialog>
        </>
    );
};

export default ProfilePage;
