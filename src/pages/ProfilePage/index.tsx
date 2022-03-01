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
import { getELA2USD, getMyFavouritesList, getTotalEarned, getTodayEarned, FETCH_CONFIG_JSON } from 'src/services/fetch';
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
    const [isLikedInfoChanged, setIsLikedInfoChanged] = useState<boolean>(false);

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
                  email: '',
                  exp: 0,
                  iat: 0,
                  type: '',
                  canManageAdmins: false,
              }
            : jwtDecode(tokenCookies.METEAST_TOKEN);

    const adBanners = [
        '/assets/images/banners/banner1.png',
        '/assets/images/banners/banner2.png',
        '/assets/images/banners/banner3.png',
    ];

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

    const getMyNftLists = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
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
                        for (let i = 0; i < arrSearchResult.length; i++) {
                            const itemObject: TypeProductFetch = arrSearchResult[i];
                            let product: TypeProduct = { ...defaultValue };
                            product.tokenId = itemObject.tokenId;
                            product.name = itemObject.name;
                            product.image = getImageFromAsset(itemObject.asset);
                            product.price_ela = itemObject.status === 'NEW' ? 0 : itemObject.price / 1e18;
                            product.price_usd = product.price_ela * tokenPriceRate;
                            product.author = itemObject.authorName || ' ';
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
                                    // if (itemObject.holder !== signInDlgState.walletAccounts[0]) product.type = enumMyNFTType.Sold;
                                    // else if (itemObject.royaltyOwner !== signInDlgState.walletAccounts[0])
                                    //     product.type = enumMyNFTType.Purchased;
                                    // else
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
                                favouritesList.findIndex((value: TypeFavouritesFetch) =>
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

    const getFetchData = async () => {
        const ELA2USD = await getELA2USD();
        const favouritesList = await getMyFavouritesList(signInDlgState.isLoggedIn, didCookies.METEAST_DID);
        getMyNftLists(ELA2USD, favouritesList);
    };

    useEffect(() => {
        if (signInDlgState.walletAccounts.length) getFetchData();
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
    //-------------- today earned, totoal earned, earned list -------------- //
    const getPersonalData = async () => {
        let _totalEarned = await getTotalEarned(signInDlgState.walletAccounts[0]);
        let _todayEarned = await getTodayEarned(signInDlgState.walletAccounts[0]);
        setTotalEarned(_totalEarned);
        setTodayEarned(_todayEarned);
        getEarningList();
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
        if (signInDlgState.walletAccounts.length) getPersonalData();
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
            let prodList: Array<TypeProduct> = myNFTList[id];
            let likedList: Array<TypeProduct> = myNFTList[5];
            if (type === 'inc') {
                prodList[id].likes += 1;
                likedList.push(prodList[id]);
            } else if (type === 'dec') {
                const idx = likedList.indexOf(prodList[id]);
                likedList.splice(idx, 1);
                prodList[id].likes -= 1;
            }
            setMyNFTData(id, prodList);
            setMyNFTData(5, likedList);
        }
    };

    // const [userAvatarURL, setUserAvatarURL] = useState<string>('/assets/images/avatar-template.png');
    const [userAvatarURL, setUserAvatarURL] = useState<string>(userInfo.avatar);

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
                              email: '',
                              exp: 0,
                              iat: 0,
                              type: '',
                              canManageAdmins: false,
                          }
                        : jwtDecode(tokenCookies.METEAST_TOKEN);
                setUserAvatarURL(userInfo.avatar);
            }
        }
    }, [signInDlgState]);

    // const [userAvatarFile, setUserAvatarFile] = useState<File>();
    // const [userAvatarStateFile, setUserAvatarStateFile] = useState(null);

    // const handleUserAvatarFileChange = (files: Array<File>) => {
    //     handleUserAvatarStateFileChange(files);
    //     if (files !== null && files.length > 0) {
    //         setUserAvatarFile(files[0]);
    //     }
    // };

    // const handleUserAvatarStateFileChange = useCallback((acceptedFiles) => {
    //     const file = acceptedFiles[0];
    //     if (file) {
    //         setUserAvatarStateFile({ ...file, preview: URL.createObjectURL(file) });
    //     }
    // }, []);

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
                <ProfileImageWrapper>
                    {userAvatarURL !== '' ? (
                        <ProfileImage src={userAvatarURL} />
                    ) : (
                        <Icon icon="ph:user" fontSize={80} color="#1890FF" />
                    )}
                </ProfileImageWrapper>
                {/* <UserAvatarBox
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
                /> */}
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
                                setDialogState({
                                    ...dialogState,
                                    createBlindBoxDlgOpened: true,
                                    createBlindBoxDlgStep: 0,
                                });
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
                        {filterOptions[item]} <DismissCircle24Filled style={{ display: 'flex', marginLeft: '4px' }} />
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
                            updateLikes={updateProductLikes}
                            isLoading={isLoadingAssets[getSelectedTabIndex()]}
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
