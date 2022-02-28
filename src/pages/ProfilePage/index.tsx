import { useEffect, useCallback } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Typography, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import MyNFTGalleryItem from 'src/components/MyNFTGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants';
import { nftGalleryFilterBtnTypes, nftGalleryFilterButtons } from 'src/constants/nft-gallery-filter-buttons';
import { TypeSelectItem } from 'src/types/select-types';
import { FilterItemTypography, FilterButton, ProfileImageWrapper, ProfileImage } from './styles';
import { Swiper, SwiperSlide } from 'swiper/react';
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
import { getImageFromAsset, getTime } from 'src/services/common';
import { useCookies } from 'react-cookie';
import { selectFromFavourites } from 'src/services/common';
import { getElaUsdRate, getMyFavouritesList, getTotalEarned, getTodayEarned } from 'src/services/fetch';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import ModalDialog from 'src/components/ModalDialog';
import YourEarnings from 'src/components/TransactionDialogs/YourEarnings';
import EditProfile from 'src/components/TransactionDialogs/EditProfile';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';
import { Icon } from '@iconify/react';
import UserAvatarBox from 'src/components/profile/UserAvatarBox';

const ProfilePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filters, setFilters] = useState<Array<enumFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        nftGalleryFilterBtnTypes.All,
    );

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
        type: enumMyNFTType.Created,
        isLike: false,
    };
    const defaultEarningValue: TypeYourEarning = {
        avatar: '',
        title: '',
        time: '',
        price: 0,
        badge: enumBadgeType.Other,
    };
    const [myNFTAll, setMyNFTAll] = useState<Array<TypeProduct>>([]);
    const [myNFTAcquired, setMyNFTAcquired] = useState<Array<TypeProduct>>([]);
    const [myNFTCreated, setMyNFTCreated] = useState<Array<TypeProduct>>([]);
    const [myNFTForSale, setMyNFTForSale] = useState<Array<TypeProduct>>([]);
    const [myNFTSold, setMyNFTSold] = useState<Array<TypeProduct>>([]);
    const [myNFTLiked, setMyNFTLiked] = useState<Array<TypeProduct>>([]);
    const [isLikedInfoChanged, setIsLikedInfoChanged] = useState<boolean>(false);
    const [isLoadingAll, setIsLoadingAll] = useState<boolean>(true);
    const [isLoadingAcquired, setIsLoadingAcquired] = useState<boolean>(true);
    const [isLoadingCreated, setIsLoadingCreated] = useState<boolean>(true);
    const [isLoadingForSale, setIsLoadingForSale] = useState<boolean>(true);
    const [isLoadingSold, setIsLoadingSold] = useState<boolean>(true);
    const [isLoadingLiked, setIsLoadingLiked] = useState<boolean>(true);
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;

    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const [earningsDlgOpen, setEarningsDlgOpen] = useState<boolean>(false);
    const [editProfileDlgOpen, setEditProfileDlgOpen] = useState<boolean>(false);

    const userInfo: UserTokenType =
        tokenCookies.METEAST_TOKEN === undefined
            ? { did: '', email: '', exp: 0, iat: 0, name: '', type: '', canManageAdmins: false }
            : jwtDecode(tokenCookies.METEAST_TOKEN);
    const [toatlEarned, setTotalEarned] = useState<number>(0);
    const [todayEarned, setTodayEarned] = useState<number>(0);
    let prodList: Array<TypeProduct> = [defaultValue, defaultValue, defaultValue, defaultValue];
    let prodLoading: boolean = true;

    const adBanners = [
        '/assets/images/banners/banner1.png',
        '/assets/images/banners/banner2.png',
        '/assets/images/banners/banner3.png',
    ];
    // -------------- Fetch Data -------------- //
    const getMyNftList = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>, nTabId: number) => {
        var reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/`;
        switch (nTabId) {
            case 0:
                reqUrl += `getAllCollectibleByAddress?selfAddr=${signInDlgState.walletAccounts[0]}`;
                setIsLoadingAll(true);
                break;
            case 1:
                reqUrl += `getOwnCollectible?selfAddr=${signInDlgState.walletAccounts[0]}`;
                setIsLoadingAcquired(true);
                break;
            case 2:
                reqUrl += `getSelfCreateNotSoldCollectible?selfAddr=${signInDlgState.walletAccounts[0]}`;
                setIsLoadingCreated(true);
                break;
            case 3:
                reqUrl += `getForSaleCollectible?selfAddr=${signInDlgState.walletAccounts[0]}`;
                setIsLoadingForSale(true);
                break;
            case 4:
                reqUrl += `getSoldCollectibles?selfAddr=${signInDlgState.walletAccounts[0]}`;
                setIsLoadingSold(true);
                break;
            case 5:
                reqUrl += `getFavoritesCollectible?did=${didCookies.METEAST_DID}`;
                setIsLoadingLiked(true);
                break;
        }
        reqUrl += `&pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
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

        const resSearchResult = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const dataSearchResult = await resSearchResult.json();
        const arrSearchResult = dataSearchResult.data === undefined ? [] : dataSearchResult.data.result;

        let _myNftList: any = [];
        for (let i = 0; i < arrSearchResult.length; i++) {
            const itemObject: TypeProductFetch = arrSearchResult[i];
            let product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.status === 'NEW' ? 0 : itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || ' ';
            if (nTabId === 0 || nTabId === 5) {
                // all = owned + sold
                if (itemObject.status === 'NEW') {
                    // not on market
                    if (itemObject.holder === itemObject.royaltyOwner) product.type = enumMyNFTType.Created;
                    else if (itemObject.holder !== signInDlgState.walletAccounts[0]) product.type = enumMyNFTType.Sold;
                    else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                        product.type = enumMyNFTType.Purchased;
                } else {
                    // if (itemObject.holder !== signInDlgState.walletAccounts[0]) product.type = enumMyNFTType.Sold;
                    // else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                    //     product.type = enumMyNFTType.Purchased;
                    // else
                    product.type = itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                }
            } else if (nTabId === 1) {
                // owned = purchased + created + for sale
                if (itemObject.status === 'NEW') {
                    // not on market
                    if (itemObject.holder === itemObject.royaltyOwner) product.type = enumMyNFTType.Created;
                    else product.type = enumMyNFTType.Purchased;
                } else {
                    product.type = itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                }
            } else if (nTabId === 2) {
                if (itemObject.status === 'NEW') {
                    // not on market
                    product.type = enumMyNFTType.Created;
                } else {
                    product.type = itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                }
            } else if (nTabId === 3)
                product.type = itemObject.status === 'BUY NOW' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
            else if (nTabId === 4) product.type = enumMyNFTType.Sold;
            product.likes = itemObject.likes;
            product.status = itemObject.status;
            product.isLike =
                favouritesList.findIndex((value: TypeFavouritesFetch) =>
                    selectFromFavourites(value, itemObject.tokenId),
                ) === -1
                    ? false
                    : true;
            _myNftList.push(product);
        }
        switch (nTabId) {
            case 0:
                setMyNFTAll(_myNftList);
                setIsLoadingAll(false);
                break;
            case 1:
                setMyNFTAcquired(_myNftList);
                setIsLoadingAcquired(false);
                break;
            case 2:
                setMyNFTCreated(_myNftList);
                setIsLoadingCreated(false);
                break;
            case 3:
                setMyNFTForSale(_myNftList);
                setIsLoadingForSale(false);
                break;
            case 4:
                setMyNFTSold(_myNftList);
                setIsLoadingSold(false);
                break;
            case 5:
                setMyNFTLiked(_myNftList);
                setIsLoadingLiked(false);
                break;
        }
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getMyNftList(ela_usd_rate, favouritesList, 0);
        getMyNftList(ela_usd_rate, favouritesList, 1);
        getMyNftList(ela_usd_rate, favouritesList, 2);
        getMyNftList(ela_usd_rate, favouritesList, 3);
        getMyNftList(ela_usd_rate, favouritesList, 4);
        getMyNftList(ela_usd_rate, favouritesList, 5);
    };

    const getListCount = (index: number) => {
        switch (index) {
            case 0:
                return myNFTAll.length;
            case 1:
                return myNFTAcquired.length;
            case 2:
                return myNFTCreated.length;
            case 3:
                return myNFTForSale.length;
            case 4:
                return myNFTSold.length;
            case 5:
                return myNFTLiked.length;
        }
    };

    const getPersonalData = async () => {
        let _totalEarned = await getTotalEarned(signInDlgState.walletAccounts[0]);
        let _todayEarned = await getTodayEarned(signInDlgState.walletAccounts[0]);
        setTotalEarned(_totalEarned);
        setTodayEarned(_todayEarned);
    };

    const getEarningList = async () => {
        const resEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedListByAddress?address=${signInDlgState.walletAccounts[0]}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataEarnedResult = await resEarnedResult.json();
        const arrEarnedResult = dataEarnedResult === undefined ? [] : dataEarnedResult.data;

        let _myEarningList: any = [];
        for (let i = 0; i < arrEarnedResult.length; i++) {
            const itemObject: TypeYourEarningFetch = arrEarnedResult[i];
            let _earning: TypeYourEarning = { ...defaultEarningValue };
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
        getFetchData();
        getPersonalData();
        getEarningList();
    }, [
        sortBy,
        filters,
        filterRange,
        keyWord,
        productViewMode,
        // nftGalleryFilterBtnSelected,
        isLikedInfoChanged,
        signInDlgState,
    ]);

    switch (nftGalleryFilterBtnSelected) {
        case nftGalleryFilterBtnTypes.All:
            if (isLoadingAll === false) {
                prodList = myNFTAll;
            }
            break;
        case nftGalleryFilterBtnTypes.Acquired:
            if (isLoadingAcquired === false) {
                prodList = myNFTAcquired;
            }
            break;
        case nftGalleryFilterBtnTypes.Created:
            if (isLoadingCreated === false) {
                prodList = myNFTCreated;
            }
            break;
        case nftGalleryFilterBtnTypes.ForSale:
            if (isLoadingForSale === false) {
                prodList = myNFTForSale;
            }
            break;
        case nftGalleryFilterBtnTypes.Sold:
            if (isLoadingSold === false) {
                prodList = myNFTSold;
            }
            break;
        case nftGalleryFilterBtnTypes.Liked:
            if (isLoadingLiked === false) {
                prodList = myNFTLiked;
            }
            break;
    }
    prodLoading = !(
        !isLoadingAll &&
        !isLoadingAcquired &&
        !isLoadingCreated &&
        !isLoadingForSale &&
        !isLoadingSold &&
        !isLoadingLiked
    );
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

    const handleClickFilterItem = (filter: enumFilterOption) => () => {
        if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    };
    // -------------- Option Bar -------------- //

    // -------------- Views -------------- //
    const updateProductLikes = (id: number, type: string) => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) {
            setIsLikedInfoChanged(!isLikedInfoChanged);
        } else {
            let prodList: Array<TypeProduct> = [];
            switch (nftGalleryFilterBtnSelected) {
                case nftGalleryFilterBtnTypes.All:
                    // setMyNFTAll(prodList);
                    prodList = [...myNFTAll];
                    break;
                case nftGalleryFilterBtnTypes.Acquired:
                    // setMyNFTAcquired(prodList);
                    prodList = [...myNFTAcquired];
                    break;
                case nftGalleryFilterBtnTypes.Created:
                    // setMyNFTCreated(prodList);
                    prodList = [...myNFTCreated];
                    break;
                case nftGalleryFilterBtnTypes.ForSale:
                    // setMyNFTForSale(prodList);
                    prodList = [...myNFTForSale];
                    break;
                case nftGalleryFilterBtnTypes.Sold:
                    // setMyNFTSold(prodList);
                    prodList = [...myNFTSold];
                    break;
            }
            let likedList: Array<TypeProduct> = [...myNFTLiked];
            if (type === 'inc') {
                prodList[id].likes += 1;
                likedList.push(prodList[id]);
            } else if (type === 'dec') {
                const idx = likedList.indexOf(prodList[id]);
                likedList.splice(idx, 1);
                prodList[id].likes -= 1;
            }

            switch (nftGalleryFilterBtnSelected) {
                case nftGalleryFilterBtnTypes.All:
                    setMyNFTAll(prodList);
                    break;
                case nftGalleryFilterBtnTypes.Acquired:
                    setMyNFTAcquired(prodList);
                    break;
                case nftGalleryFilterBtnTypes.Created:
                    setMyNFTCreated(prodList);
                    break;
                case nftGalleryFilterBtnTypes.ForSale:
                    setMyNFTForSale(prodList);
                    break;
                case nftGalleryFilterBtnTypes.Sold:
                    setMyNFTSold(prodList);
                    break;
            }
            setMyNFTLiked(likedList);
        }
    };

    const [userAvatarFile, setUserAvatarFile] = useState<File>();
    const [userAvatarStateFile, setUserAvatarStateFile] = useState(null);

    const handleUserAvatarFileChange = (files: Array<File>) => {
        handleUserAvatarStateFileChange(files);
        if (files !== null && files.length > 0) {
            setUserAvatarFile(files[0]);
        }
    };

    const handleUserAvatarStateFileChange = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUserAvatarStateFile({ ...file, preview: URL.createObjectURL(file) });
        }
    }, []);

    return (
        <>
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
            <Stack alignItems="center">
                {/* <ProfileImageWrapper>
                    <ProfileImage src="https://miro.medium.com/focal/58/58/50/50/0*sViPWB4sXg5xE1TT" />
                </ProfileImageWrapper> */}
                <UserAvatarBox
                    file={userAvatarStateFile}
                    onDrop={handleUserAvatarFileChange}
                    sx={{
                        width: '180px',
                        height: '180px',
                        marginTop: '-90px',
                        borderRadius: '50%',
                        background: '#E8F4FF',
                        overflow: 'hidden',
                        zIndex: 10,
                    }}
                />
                <Stack width="100%" direction="row" justifyContent="space-between" marginTop={-6}>
                    <Box>
                        <Typography fontSize={20} fontWeight={900}>
                            {toatlEarned}&nbsp;ELA
                        </Typography>
                        <Typography fontSize={16} fontWeight={400}>
                            Total Earned
                        </Typography>
                    </Box>
                    <Box>
                        <Typography fontSize={20} fontWeight={900}>
                            {todayEarned}&nbsp;ELA
                        </Typography>
                        <Typography fontSize={16} fontWeight={400}>
                            Earned Today
                        </Typography>
                    </Box>
                </Stack>
                <Stack alignItems="center">
                    <Typography fontSize={56} fontWeight={700}>
                        {userInfo.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} marginTop={2}>
                        <SecondaryButton
                            size="small"
                            sx={{ paddingX: 2.5 }}
                            onClick={() => {
                                setEarningsDlgOpen(true);
                            }}
                        >
                            Earnings
                        </SecondaryButton>
                        <PrimaryButton
                            sx={{ paddingX: 4 }}
                            onClick={() => {
                                setDialogState({ ...dialogState, createNFTDlgOpened: true, createNFTDlgStep: 0 });
                            }}
                        >
                            Create NFT
                        </PrimaryButton>
                        <PrimaryButton
                            sx={{ paddingX: 4 }}
                            onClick={() => {
                                setDialogState({ ...dialogState, createBlindBoxDlgOpened: true, createBlindBoxDlgStep: 0 });
                            }}
                        >
                            New Blind Box
                        </PrimaryButton>
                        <SecondaryButton
                            size="small"
                            sx={{ paddingX: 2.5 }}
                            onClick={() => {
                                setEditProfileDlgOpen(true);
                            }}
                        >
                            Edit Profile
                        </SecondaryButton>
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
                        flexWrap={{ xs: 'wrap', md: 'nowrap' }}
                        justifyContent={{ xs: 'center', md: 'flex-end' }}
                        spacing={2}
                    >
                        {nftGalleryFilterButtonsList.map((items, index) => (
                            <FilterButton
                                key={`filter-button-${index}`}
                                selected={items.label === nftGalleryFilterBtnSelected}
                                onClick={() => setNftGalleryFilterBtnSelected(items.label)}
                            >
                                {items.label}
                                <p>{getListCount(index)}</p>
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
                        {filterOptions[item]} <DismissCircle24Filled style={{ display: 'flex', marginLeft: '4px' }} />
                    </FilterItemTypography>
                ))}
            </Box>
            {!prodLoading && prodList.length === 0 && <LooksEmptyBox />}
            <Grid container mt={2} spacing={4}>
                {prodList.map((item, index) => (
                    <Grid
                        item
                        xs={productViewMode === 'grid1' ? 12 : 6}
                        md={productViewMode === 'grid1' ? 6 : 3}
                        key={`profile-product-${index}`}
                    >
                        <MyNFTGalleryItem
                            product={item}
                            index={index}
                            updateLikes={updateProductLikes}
                            isLoading={prodLoading}
                        />
                    </Grid>
                ))}
            </Grid>

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
