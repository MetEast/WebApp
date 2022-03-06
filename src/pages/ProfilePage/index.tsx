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
import { useCookies } from 'react-cookie';
import { selectFromFavourites } from 'src/services/common';
import { getELA2USD, getMyFavouritesList, getTotalEarned, getTodayEarned, FETCH_CONFIG_JSON } from 'src/services/fetch';
import jwtDecode from 'jwt-decode';
import { UserTokenType } from 'src/types/auth-types';
import ModalDialog from 'src/components/ModalDialog';
import YourEarnings from 'src/components/TransactionDialogs/YourEarnings';
import EditProfile from 'src/components/TransactionDialogs/EditProfile';
import LooksEmptyBox from 'src/components/profile/LooksEmptyBox';
import { Icon } from '@iconify/react';
import UserAvatarBox from 'src/components/profile/UserAvatarBox';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Container from 'src/components/Container';

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
    const [earningsDlgOpen, setEarningsDlgOpen] = useState<boolean>(false);
    const [editProfileDlgOpen, setEditProfileDlgOpen] = useState<boolean>(false);

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
    const [reload, setReload] = useState<boolean>(false);

    const [toatlEarned, setTotalEarned] = useState<number>(0);
    const [todayEarned, setTodayEarned] = useState<number>(0);
    const [earningList, setEarningList] = useState<Array<TypeYourEarning>>([]);
    const [myNFTList, setMyNFTList] = useState<Array<Array<TypeProduct>>>(Array(6).fill(Array(4).fill(defaultValue)));
    const [isLoadingAssets, setIsLoadingAssets] = useState<Array<boolean>>(Array(6).fill(true));
    const apiNames = [
        'getAllCollectibleByAddress',
        'getOwnCollectible',
        'getSelfCreateNotSoldCollectible',
        'getForSaleCollectible',
        'getSoldCollectibles',
        'getFavoritesCollectible',
    ];
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;
    let userInfo: UserTokenType =
        tokenCookies.METEAST_TOKEN === undefined
            ? {
                  did: '',
                  name: '',
                  description: '',
                  avatar: '',
                  exp: 0,
                  iat: 0,
              }
            : jwtDecode(tokenCookies.METEAST_TOKEN);

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

    const addSortOptions = () => {
        let url = `&pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
        if (sortBy !== undefined) {
            switch (sortBy.value) {
                case 'low_to_high':
                    url += `&orderType=price_l_to_h`;
                    break;
                case 'high_to_low':
                    url += `&orderType=price_h_to_l`;
                    break;
                case 'most_viewed':
                    url += `&orderType=mostviewed`;
                    break;
                case 'most_liked':
                    url += `&orderType=mostliked`;
                    break;
                case 'most_recent':
                    url += `&orderType=mostrecent`;
                    break;
                case 'oldest':
                    url += `&orderType=oldest`;
                    break;
                case 'ending_soon':
                    url += `&orderType=endingsoon`;
                    break;
                default:
                    url += `&orderType=mostrecent`;
                    break;
            }
        }
        if (filterRange.min !== undefined) {
            url += `&filter_min_price=${filterRange.min}`;
        }
        if (filterRange.max !== undefined) {
            url += `&filter_max_price=${filterRange.max}`;
        }
        if (filters.length !== 0) {
            let filterStatus: string = '';
            filters.forEach((item) => {
                if (item === 0) filterStatus += 'ON AUCTION,';
                else if (item === 1) filterStatus += 'BUY NOW,';
                else if (item === 2) filterStatus += 'HAS BID,';
            });
            url += `&filter_status=${filterStatus.slice(0, filterStatus.length - 1)}`;
        }
        return url;
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
    const getAllNftLists = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        Array(6)
            .fill(0)
            .forEach((_, i: number) => {
                const fetchUrl =
                    `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/${apiNames[i]}?` +
                    (i === 5 ? `did=${didCookies.METEAST_DID}` : `selfAddr=${signInDlgState.walletAccounts[0]}`) +
                    addSortOptions();
                setLoadingState(i, true);
                fetch(fetchUrl, FETCH_CONFIG_JSON).then((response) =>
                    response.json().then((jsonAssets) => {
                        const arrSearchResult = jsonAssets.data === undefined ? [] : jsonAssets.data.result;

                        let _myNftList: any = [];
                        for (let j = 0; j < arrSearchResult.length; j++) {
                            const itemObject: TypeProductFetch = arrSearchResult[j];
                            let product: TypeProduct = { ...defaultValue };
                            product.tokenId = itemObject.tokenId;
                            product.name = itemObject.name;
                            product.image = getImageFromAsset(itemObject.asset);
                            product.price_ela = itemObject.status === 'NEW' ? 0 : itemObject.price / 1e18;
                            product.price_usd = product.price_ela * tokenPriceRate;
                            product.author =
                                itemObject.authorName === ''
                                    ? reduceHexAddress(itemObject.royaltyOwner, 4)
                                    : itemObject.authorName;
                            if (i === 0 || i === 5) {
                                // all = owned + sold
                                if (itemObject.status === 'NEW') {
                                    // not on market
                                    if (itemObject.holder === itemObject.royaltyOwner)
                                        product.type = enumMyNFTType.Created;
                                    else if (itemObject.holder !== signInDlgState.walletAccounts[0])
                                        product.type = enumMyNFTType.Sold;
                                    else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                                        product.type = enumMyNFTType.Purchased;
                                } else {
                                    if (itemObject.holder !== signInDlgState.walletAccounts[0])
                                        product.type = enumMyNFTType.Sold;
                                    else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                                        product.type = enumMyNFTType.Purchased;
                                    else
                                        product.type =
                                            itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                                }
                            } else if (i === 1) {
                                // owned = purchased + created + for sale
                                if (itemObject.status === 'NEW') {
                                    // not on market
                                    if (itemObject.holder === itemObject.royaltyOwner)
                                        product.type = enumMyNFTType.Created;
                                    else product.type = enumMyNFTType.Purchased;
                                } else {
                                    product.type =
                                        itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                                }
                            } else if (i === 2) {
                                if (itemObject.status === 'NEW') {
                                    // not on market
                                    product.type = enumMyNFTType.Created;
                                } else {
                                    product.type =
                                        itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                                }
                            } else if (i === 3)
                                product.type =
                                    itemObject.status === 'BUY NOW' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
                            else if (i === 4) product.type = enumMyNFTType.Sold;
                            product.likes = itemObject.likes;
                            product.status = itemObject.status;
                            product.isLike =
                                i === 5
                                    ? true
                                    : favouritesList.findIndex((value: TypeFavouritesFetch) =>
                                          selectFromFavourites(value, itemObject.tokenId),
                                      ) === -1
                                    ? false
                                    : true;
                            _myNftList.push(product);
                        }
                        setMyNFTData(i, _myNftList);
                        setLoadingState(i, false);
                    }),
                );
            });
    };

    const fetchAllData = async () => {
        const ELA2USD = await getELA2USD();
        const favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getAllNftLists(ELA2USD, favouritesList);
    };

    useEffect(() => {
        if (signInDlgState.walletAccounts.length) fetchAllData();
    }, [signInDlgState]);

    //-------------- get tab nft list -------------- //
    const getTabNftLists = async (
        tokenPriceRate: number,
        favouritesList: Array<TypeFavouritesFetch>,
        nTabId: number,
    ) => {
        const fetchUrl =
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/${apiNames[nTabId]}?` +
            (nTabId === 5 ? `did=${didCookies.METEAST_DID}` : `selfAddr=${signInDlgState.walletAccounts[0]}`) +
            addSortOptions();
        setLoadingState(nTabId, true);
        fetch(fetchUrl, FETCH_CONFIG_JSON).then((response) =>
            response.json().then((jsonAssets) => {
                const arrSearchResult = jsonAssets.data === undefined ? [] : jsonAssets.data.result;

                let _myNftList: any = [];
                for (let j = 0; j < arrSearchResult.length; j++) {
                    const itemObject: TypeProductFetch = arrSearchResult[j];
                    let product: TypeProduct = { ...defaultValue };
                    product.tokenId = itemObject.tokenId;
                    product.name = itemObject.name;
                    product.image = getImageFromAsset(itemObject.asset);
                    product.price_ela = itemObject.status === 'NEW' ? 0 : itemObject.price / 1e18;
                    product.price_usd = product.price_ela * tokenPriceRate;
                    product.author =
                        itemObject.authorName === ''
                            ? reduceHexAddress(itemObject.royaltyOwner, 4)
                            : itemObject.authorName;
                    if (nTabId === 0 || nTabId === 5) {
                        // all = owned + sold
                        if (itemObject.status === 'NEW') {
                            // not on market
                            if (itemObject.holder === itemObject.royaltyOwner) product.type = enumMyNFTType.Created;
                            else if (itemObject.holder !== signInDlgState.walletAccounts[0])
                                product.type = enumMyNFTType.Sold;
                            else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                                product.type = enumMyNFTType.Purchased;
                        } else {
                            if (itemObject.holder !== signInDlgState.walletAccounts[0])
                                product.type = enumMyNFTType.Sold;
                            else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                                product.type = enumMyNFTType.Purchased;
                            else
                                product.type =
                                    itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
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
                        nTabId === 5
                            ? true
                            : favouritesList.findIndex((value: TypeFavouritesFetch) =>
                                  selectFromFavourites(value, itemObject.tokenId),
                              ) === -1
                            ? false
                            : true;
                    _myNftList.push(product);
                }
                setMyNFTData(nTabId, _myNftList);
                setLoadingState(nTabId, false);
            }),
        );
    };

    const fetchTabData = async () => {
        const ELA2USD = await getELA2USD();
        const favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getTabNftLists(ELA2USD, favouritesList, getSelectedTabIndex());
    };

    useEffect(() => {
        if (signInDlgState.walletAccounts.length) fetchTabData();
    }, [sortBy, filters, filterRange, keyWord, productViewMode, nftGalleryFilterBtnSelected, reload, signInDlgState]);

    //-------------- today earned, totoal earned, earned list -------------- //
    const fetchPersonalData = async () => {
        let _totalEarned = await getTotalEarned(signInDlgState.walletAccounts[0]);
        let _todayEarned = await getTodayEarned(signInDlgState.walletAccounts[0]);
        setTotalEarned(_totalEarned);
        setTodayEarned(_todayEarned);
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
        if (signInDlgState.walletAccounts.length) fetchPersonalData();
    }, [signInDlgState]);
    // -------------- Fetch Data -------------- //

    // -------------- Option Bar -------------- //
    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
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

    const [userAvatarURL, setUserAvatarURL] = useState<string>(getImageFromAsset(userInfo.avatar));

    useEffect(() => {
        if (signInDlgState.isLoggedIn) {
            if (signInDlgState.loginType === '1') {
                userInfo =
                    tokenCookies.METEAST_TOKEN === undefined
                        ? {
                              did: '',
                              name: '',
                              description: '',
                              avatar: '',
                              exp: 0,
                              iat: 0,
                          }
                        : jwtDecode(tokenCookies.METEAST_TOKEN);
                setUserAvatarURL(userInfo.avatar);
            }
        }
    }, [signInDlgState]);

    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Box onClick={() => {}} sx={{ height: '254px', cursor: 'pointer', backgroundColor: '#C3C5C8' }}>
                {userInfo.avatar !== '' && <img src={userInfo.avatar} alt="" style={{ minWidth: '100%' }} />}
            </Box>
            <Container sx={{ overflow: 'visible' }}>
                <Stack alignItems="center">
                    <ProfileImageWrapper>
                        {userAvatarURL !== '' ? (
                            <ProfileImage src={userAvatarURL} />
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
                                {userInfo.name === ''
                                    ? reduceHexAddress(signInDlgState.walletAccounts[0], 4)
                                    : userInfo.name}
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
                            {userInfo.description}
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
