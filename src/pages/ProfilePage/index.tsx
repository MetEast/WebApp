import { useEffect } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Typography, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useSignInContext } from 'src/context/SignInContext';
import FilterModal from 'src/components/modals/FilterModal';
import MyNFTGalleryItem from 'src/components/MyNFTGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants';
import { nftGalleryFilterBtnTypes, nftGalleryFilterButtons } from 'src/constants/nft-gallery-filter-buttons';
import { TypeSelectItem } from 'src/types/select-types';
import {
    FilterItemTypography,
    FilterButton,
    ProfileImageWrapper,
    ProfileImage,
    EmptyBodyGalleryItem,
    EmptyTitleGalleryItem,
} from './styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeProduct, TypeProductFetch, enumMyNFTType, TypeFavouritesFetch } from 'src/types/product-types';
import { getImageFromAsset } from 'src/services/common';
import { useCookies } from 'react-cookie';
import { selectFromFavourites } from 'src/services/common';
import { getElaUsdRate, getMyFavouritesList, getTotalEarned, getTodayEarned } from 'src/services/fetch';
import jwtDecode from 'jwt-decode';
import { getEssentialWalletAddress, getEssentialWalletBalance } from 'src/services/essential';

const ProfilePage: React.FC = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [didCookies] = useCookies(['METEAST_DID']);
    const [tokenCookies] = useCookies(['METEAST_TOKEN']);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<TypeSelectItem>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>('');
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        nftGalleryFilterBtnTypes.All,
    );
    const [dialogState, setDialogState] = useDialogContext();

    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [myNFTAll, setMyNFTAll] = useState<Array<TypeProduct>>([]);
    const [myNFTAcquired, setMyNFTAcquired] = useState<Array<TypeProduct>>([]);
    const [myNFTCreated, setMyNFTCreated] = useState<Array<TypeProduct>>([]);
    const [myNFTForSale, setMyNFTForSale] = useState<Array<TypeProduct>>([]);
    const [myNFTSold, setMyNFTSold] = useState<Array<TypeProduct>>([]);
    const [myNFTLiked, setMyNFTLiked] = useState<Array<TypeProduct>>([]);
    const [isOnLikedTab, setIsOnLikedTab] = useState<boolean>(false);
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;

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

    const userInfo: any = tokenCookies.METEAST_TOKEN === undefined ? '' : jwtDecode(tokenCookies.METEAST_TOKEN);
    const accounts: string[] = getEssentialWalletAddress();
    const [toatlEarned, setTotalEarned] = useState<number>(0);
    const [todayEarned, setTodayEarned] = useState<number>(0);

    const getMyNftList = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>, nTabId: number) => {
        var reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/`;
        switch (nTabId) {
            case 0:
                reqUrl += `getOwnCollectible?selfAddr=${accounts[0]}`;
                break;
            case 1:
                reqUrl += `getBoughtNotSoldCollectible?selfAddr=${accounts[0]}`;
                break;
            case 2:
                reqUrl += `getSelfCreateNotSoldCollectible?selfAddr=${accounts[0]}`;
                break;
            case 3:
                reqUrl += `getForSaleFixedPriceCollectible?selfAddr=${accounts[0]}`;
                break;
            case 4:
                reqUrl += `getSoldCollectibles?selfAddr=${accounts[0]}`;
                break;
            case 5:
                reqUrl += `getFavoritesCollectible?did=${didCookies.METEAST_DID}`;
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
            reqUrl += `&filter_min_price=${filterRange.max}`;
        }
        if (filters) {
            let filterStatus: string = '';
            filters.forEach((item) => {
                if (item === 0) filterStatus += 'ONAUCTION,';
                else if (item === 1) filterStatus += 'BUYNOW,';
                else if (item === 2) filterStatus += 'HASBID,';
                else if (item === 3) filterStatus += 'NEW,';
            });
            filterStatus.slice(0, filterStatus.length - 1);
            reqUrl += `&filter_status=${filterStatus}`;
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
            let itemObject: TypeProductFetch = arrSearchResult[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price / 1e18;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || '---';
            if (nTabId === 0 || nTabId === 5) {
                if (itemObject.status === 'NEW') {
                    if (itemObject.holder === itemObject.royaltyOwner) product.type = enumMyNFTType.Created;
                    else product.type = enumMyNFTType.Sold;
                } 
                else if (itemObject.status === 'BUY NOW' || itemObject.status === 'ON AUCTION') product.type = itemObject.status === 'BUY NOW' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
            }
            else if (nTabId === 1) product.type = enumMyNFTType.Sold;
            else if (nTabId === 2) product.type = enumMyNFTType.Created;
            else if (nTabId === 3) 
                product.type = itemObject.status === 'BUY NOW' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
            else if (nTabId === 4) product.type = enumMyNFTType.Sold;
            product.likes = itemObject.likes;
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
                break;
            case 1:
                setMyNFTAcquired(_myNftList);
                break;
            case 2:
                setMyNFTCreated(_myNftList);
                break;
            case 3:
                setMyNFTForSale(_myNftList);
                break;
            case 4:
                setMyNFTSold(_myNftList);
                break;
            case 5:
                setMyNFTLiked(_myNftList);
                break;
        }
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(true, didCookies.METEAST_DID);
        getMyNftList(ela_usd_rate, favouritesList, 0);
        getMyNftList(ela_usd_rate, favouritesList, 1);
        getMyNftList(ela_usd_rate, favouritesList, 2);
        getMyNftList(ela_usd_rate, favouritesList, 3);
        getMyNftList(ela_usd_rate, favouritesList, 4);
        getMyNftList(ela_usd_rate, favouritesList, 5);
    };

    const getPersonalData = async () => {
        let _totalEarned = await getTotalEarned(accounts[0]);
        let _todayEarned = await getTodayEarned(accounts[0]);
        setTotalEarned(_totalEarned);
        setTodayEarned(_todayEarned);
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

    useEffect(() => {
        getFetchData();
        getPersonalData();
        getEssentialWalletBalance();
    }, [sortBy, filters, filterRange, keyWord, productViewMode, nftGalleryFilterBtnSelected, isOnLikedTab]);
    
    // setProductList
    useEffect(() => {
        switch (nftGalleryFilterBtnSelected) {
            case nftGalleryFilterBtnTypes.All:
                setProductList(myNFTAll);
                break;
            case nftGalleryFilterBtnTypes.Acquired:
                setProductList(myNFTAcquired);
                break;
            case nftGalleryFilterBtnTypes.Created:
                setProductList(myNFTCreated);
                break;
            case nftGalleryFilterBtnTypes.ForSale:
                setProductList(myNFTForSale);
                break;
            case nftGalleryFilterBtnTypes.Sold:
                setProductList(myNFTSold);
                break;
            case nftGalleryFilterBtnTypes.Liked:
                setProductList(myNFTLiked);
                break;
        }

    }, [nftGalleryFilterBtnSelected, myNFTAll, myNFTAcquired, myNFTCreated, myNFTForSale, myNFTSold, myNFTLiked]);
    
    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
    };

    const handleChangeSortBy = (value: string) => {
        const item = sortOptions.find((option) => option.value === value);
        setSortBy(item);
    };

    const handleCloseFilterModal = () => {
        setFilterModalOpen(false);
    };

    const handleClickFilterButton = () => {
        setFilterModalOpen(true);
    };

    const handleDoneFilterModal = (filters: Array<enmFilterOption>, filterRange: TypeFilterRange) => {
        setFilters(filters);
        setFilterRange(filterRange);
        setFilterModalOpen(false);
    };

    const handleClickFilterItem = (filter: enmFilterOption) => () => {
        if (filters.includes(filter)) setFilters([...filters.filter((item) => item !== filter)]);
    };

    const updateProductLikes = (id: number, type: string) => {
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) {
            setIsOnLikedTab(!isOnLikedTab);
        }
        else {
            let prodList: Array<TypeProduct> = [...productList];
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

    const adBanners = [
        '/assets/images/adbanners/banner1.png',
        '/assets/images/adbanners/banner2.png',
        '/assets/images/adbanners/banner3.png',
    ];

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
                    {productList.length === 0 && <EmptyTitleGalleryItem>No data to display</EmptyTitleGalleryItem>}
                </Swiper>
            </Box>
            <Box>
                <ProfileImageWrapper>
                    <ProfileImage src="https://miro.medium.com/focal/58/58/50/50/0*sViPWB4sXg5xE1TT" />
                </ProfileImageWrapper>
                <Stack direction="row" justifyContent="space-between" marginTop={-6}>
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
                        <SecondaryButton size="small" sx={{ paddingX: 2.5 }}>
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
                        <SecondaryButton size="small" sx={{ paddingX: 2.5 }}>
                            Edit Profile
                        </SecondaryButton>
                    </Stack>
                </Stack>
            </Box>
            <Typography fontSize={42} fontWeight={700} marginTop={3}>
                your NFTs
            </Typography>
            <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent={'space-between'}
                spacing={2}
                marginTop={1}
            >
                <Grid
                    item
                    container
                    lg={7}
                    md={12}
                    sm={12}
                    xs={12}
                    order={{ lg: 1, md: 2, sm: 2, xs: 2 }}
                    direction="row"
                    spacing={1}
                    justifyContent={'space-between'}
                >
                    {nftGalleryFilterButtonsList.map((items, index) => (
                        <Grid item key={`profile-gallery-${index}`} xs={4} sm={2}>
                            <FilterButton
                                selected={items.label === nftGalleryFilterBtnSelected}
                                onClick={() => setNftGalleryFilterBtnSelected(items.label)}
                            >
                                {items.label}
                                <p>{getListCount(index)}</p>
                            </FilterButton>
                        </Grid>
                    ))}
                </Grid>
                <Grid item lg={5} md={12} sm={12} xs={12} order={{ lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <OptionsBar
                        handleKeyWordChange={handleKeyWordChange}
                        sortOptions={sortOptions}
                        sortSelected={sortBy}
                        handleSortChange={handleChangeSortBy}
                        handleClickFilterButton={handleClickFilterButton}
                        productViewMode={productViewMode}
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
            {productList.length === 0 && <EmptyBodyGalleryItem>No listed products on marketplace</EmptyBodyGalleryItem>}
            <Grid container mt={2} spacing={4}>
                {productList.map((item, index) => (
                    <Grid item xs={productViewMode === 'grid1' ? 6 : 3} key={`explore-product-${index}`}>
                        <MyNFTGalleryItem product={item} index={index} updateLikes={updateProductLikes} />
                    </Grid>
                ))}
            </Grid>
            <FilterModal
                open={filterModalOpen}
                onClose={handleCloseFilterModal}
                filters={filters}
                filterRange={filterRange}
                onDone={handleDoneFilterModal}
            />
        </>
    );
};

export default ProfilePage;
