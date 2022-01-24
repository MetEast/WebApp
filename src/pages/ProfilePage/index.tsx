import { useEffect } from 'react';
import { DismissCircle24Filled } from '@fluentui/react-icons';
import { Box, Grid, Typography, Stack } from '@mui/material';
import React, { useState } from 'react';
import FilterModal from 'src/components/modals/FilterModal';
import MyNFTGalleryItem from 'src/components/MyNFTGalleryItem';
import OptionsBar from 'src/components/OptionsBar';
// import { myNFTProducts } from 'src/constants/dummyData';
import { enmFilterOption, TypeFilterRange } from 'src/types/filter-types';
import { filterOptions } from 'src/constants/filter-constants';
import { sortOptions } from 'src/constants/select-constants';
import { nftGalleryFilterBtnTypes, nftGalleryFilterButtons } from 'src/constants/nft-gallery-filter-buttons';
import { SortOption } from 'src/types/select-types';
import { FilterItemTypography, FilterButton, ProfileImageWrapper, ProfileImage } from './styles';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PrimaryButton, SecondaryButton } from 'src/components/Buttons/styles';
import { useDialogContext } from 'src/context/DialogContext';
import { TypeProduct, TypeProductFetch, enumSingleNFTType, TypeFavouritesFetch, TypeVeiwsLikesFetch, TypeLikesFetchItem } from 'src/types/product-types';
import { getImageFromAsset } from 'src/services/common';
import { useRecoilValue } from 'recoil';
import authAtom from 'src/recoil/auth';
import { useCookies } from "react-cookie";
import { selectFromLikes, selectFromFavourites } from 'src/services/common';
import { getElaUsdRate, getViewsAndLikes, getMyFavouritesList, getTotalEarned, getTodayEarned } from 'src/services/fetch';
import jwtDecode from 'jwt-decode';
import { getEssentialWalletAddress } from 'src/services/essential';


const ProfilePage: React.FC = (): JSX.Element => {
    const auth = useRecoilValue(authAtom);
    const [didCookies, setDidCookie, removeDidCookie] = useCookies(["did"]);
    const [tokenCookies, setTokenCookie, removeTokenCookie] = useCookies(["token"]);
    const [productViewMode, setProductViewMode] = useState<'grid1' | 'grid2'>('grid2');
    const [sortBy, setSortBy] = useState<SortOption>();
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<Array<enmFilterOption>>([]);
    const [filterRange, setFilterRange] = useState<TypeFilterRange>({ min: undefined, max: undefined });
    const [keyWord, setKeyWord] = useState<string>("");
    const [nftGalleryFilterBtnSelected, setNftGalleryFilterBtnSelected] = useState<nftGalleryFilterBtnTypes>(
        nftGalleryFilterBtnTypes.All,
    );
    const [dialogState, setDialogState] = useDialogContext();

    const [productList, setProductList] = useState<Array<TypeProduct>>([]);
    const [countList, setCountList] = useState<Array<number>>([0, 0, 0, 0, 0, 0]);
    const nftGalleryFilterButtonsList = nftGalleryFilterButtons;

    const defaultValue : TypeProduct = { 
        tokenId: "", 
        name: "", 
        image: "",
        price_ela: 0, 
        price_usd: 0, 
        likes: 0,
        views: 0,
        author: "",
        authorDescription: "",
        authorImg: "",
        authorAddress: "",
        description: "",
        tokenIdHex: "",
        royalties: 0,
        createTime: "",
        holderName: "",
        holder: "",
        type: enumSingleNFTType.BuyNow,
        isLike: false 
    };

    const userInfo:any = jwtDecode(tokenCookies.token);
    // const accounts: string[] = getEssentialWalletAddress();
    const accounts: string[] = ["0x7Dfd88bD287bc0541C96C8686BDB13C80c4c26D0"];
    const toatlEarned = 0; //getTotalEarned(accounts[0]);
    const todayEarned = 0; //getTodayEarned(accounts[0]);

    const getResultCount = async () => {
        let newCountList: number[] = [1, 2, 3, 4, 5, 6];
        setCountList(newCountList);
    } 

    const getSearchResult = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        var reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/`;
        let nSelected = 0;
        switch (nftGalleryFilterBtnSelected) {
            case nftGalleryFilterBtnTypes.All:
                reqUrl += `getOwnCollectible?address=${accounts[0]}`;
                nSelected = 0;
                break;
            case nftGalleryFilterBtnTypes.Acquired:
                reqUrl += `getBoughtNotSoldCollectible?selfAddr=${accounts[0]}`;
                nSelected = 1;
                break;
            case nftGalleryFilterBtnTypes.Created:
                reqUrl += `getSelfCreateNotSoldCollectible?address=${accounts[0]}`;
                nSelected = 2;
                break;
            case nftGalleryFilterBtnTypes.ForSale:
                reqUrl += `getForSaleFixedPriceCollectible?selfAddr=${accounts[0]}`;
                nSelected = 3;
                break;
            case nftGalleryFilterBtnTypes.Sold:
                reqUrl += `getSoldCollectibles?selfAddr=${accounts[0]}`;
                nSelected = 4;
                break;
        }
        reqUrl += `&pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
        if (sortBy !== undefined) {
            switch(sortBy.label) {
                case 'Price: LOW TO HIGH': 
                    reqUrl += `&orderType=price_l_to_h`;
                    break;
                case 'Price: HIGH TO LOW': 
                    reqUrl += `&orderType=price_h_to_l`;
                    break;
                case 'MOST VIEWED': 
                    reqUrl += `&orderType=mostviewed`;
                    break;
                case 'MOST LIKED': 
                    reqUrl += `&orderType=mostliked`;
                    break;
                case 'MOST RECENT': 
                    reqUrl += `&orderType=mostrecent`;
                    break;
                case 'OLDEST': 
                    reqUrl += `&orderType=oldest`;
                    break;
                case 'ENDING SOON': 
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
            let filterStatus: string = "";
            filters.forEach((item) => {
                if (item === 0) filterStatus += "ONAUCTION,";
                else if (item === 1) filterStatus += "BUYNOW,";
                else if (item === 2) filterStatus += "HASBID,";
                else if (item === 3) filterStatus += "NEW,";                
            });
            filterStatus.slice(0, filterStatus.length - 1);
            reqUrl += `&filter_status=${filterStatus}`;
        }

        const resSearchResult = await fetch(reqUrl, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataSearchResult = await resSearchResult.json();
        const arrSearchResult = dataSearchResult.data.result;
        const nSearchResult = dataSearchResult.data.total;

        // get token list for likes
        let arrTokenIds: Array<string> = [];
        for(let i = 0; i < arrSearchResult.length; i ++) {
            arrTokenIds.push(arrSearchResult[i].tokenId);
        }
        const arrLikesList: TypeVeiwsLikesFetch = await getViewsAndLikes(arrTokenIds);

        let _myNftList: any = [];
        for(let i = 0; i < arrSearchResult.length; i ++) {
            let itemObject: TypeProductFetch = arrSearchResult[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || 'No vaule'; 
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            let curItem: TypeLikesFetchItem | undefined = arrLikesList.likes.find((value: TypeLikesFetchItem) => selectFromLikes(value, itemObject.tokenId));
            product.likes = curItem === undefined ? 0 : curItem.likes;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            _myNftList.push(product);
        }
        setProductList(_myNftList);
        let _cntList = [...countList];
        _cntList[nSelected] = nSearchResult;
        setCountList(_cntList);
    };

    const getFavouritesCollectible = async (tokenPriceRate: number, favouritesList: Array<TypeFavouritesFetch>) => {
        let arrFavList : string[] = [];
        for (let i = 0; i < favouritesList.length; i ++) {
            arrFavList.push(favouritesList[i].tokenId);
        }

        const resFavouritesResult = await fetch(`${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectiblesByTokenIds?tokenIds=${arrFavList.join(",")}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
        const dataFavouritesResult = await resFavouritesResult.json();
        const arrFavouritesResult = dataFavouritesResult.data.result;
        const nFavouritesResult = dataFavouritesResult.data.total;

        // get token list for likes
        let arrTokenIds: Array<string> = [];
        for(let i = 0; i < arrFavouritesResult.length; i ++) {
            arrTokenIds.push(arrFavouritesResult[i].tokenId);
        }
        const arrLikesList: TypeVeiwsLikesFetch = await getViewsAndLikes(arrTokenIds);

        let _myNftList: any = [];
        for(let i = 0; i < arrFavouritesResult.length; i ++) {
            let itemObject: TypeProductFetch = arrFavouritesResult[i];
            var product: TypeProduct = { ...defaultValue };
            product.tokenId = itemObject.tokenId;
            product.name = itemObject.name;
            product.image = getImageFromAsset(itemObject.asset);
            product.price_ela = itemObject.price;
            product.price_usd = product.price_ela * tokenPriceRate;
            product.author = itemObject.authorName || 'No vaule'; 
            product.type = itemObject.status === 'NEW' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            let curItem: TypeLikesFetchItem | undefined = arrLikesList.likes.find((value: TypeLikesFetchItem) => selectFromLikes(value, itemObject.tokenId));
            product.likes = curItem === undefined ? 0 : curItem.likes;
            product.isLike = favouritesList.findIndex((value: TypeFavouritesFetch) => selectFromFavourites(value, itemObject.tokenId)) === -1 ? false : true;
            _myNftList.push(product);
        }
        setProductList(_myNftList);
        let _cntList = [...countList];
        _cntList[5] = nFavouritesResult;
        setCountList(_cntList);
    };

    const getFetchData = async () => {
        let ela_usd_rate = await getElaUsdRate();
        let favouritesList = await getMyFavouritesList(auth.isLoggedIn, didCookies.did);
        if (nftGalleryFilterBtnSelected === nftGalleryFilterBtnTypes.Liked) getFavouritesCollectible(ela_usd_rate, favouritesList);
        else getSearchResult(ela_usd_rate, favouritesList);
    };

    useEffect(() => {
        getFetchData();
    }, [sortBy, filters, filterRange, keyWord, productViewMode, nftGalleryFilterBtnSelected]);

    const handleKeyWordChange = (value: string) => {
        setKeyWord(value);
    }

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

    const updateProductLikes = (id:number, type: string) => {
        let prodList : Array<TypeProduct> = [...productList];
        if(type === 'inc') {
            prodList[id].likes += 1;
        }
        else if(type === 'dec') {
            prodList[id].likes -= 1;
        }
        setProductList(prodList);
    };

    return (
        <>
            <Box>
                <Swiper autoplay={{ delay: 5000 }} spaceBetween={8}>
                    {productList.map((product, index) => (
                        <SwiperSlide key={`banner-carousel-${index}`}>
                            <MyNFTGalleryItem product={product} onlyShowImage index={index} updateLikes={updateProductLikes} />
                        </SwiperSlide>
                    ))}
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
            <Grid container direction="row" alignItems="center" justifyContent={"space-between"} spacing={2} marginTop={1}>
                <Grid item container lg={8} md={12} sm={12} xs={12} order={{lg: 1, md: 2, sm:2, xs: 2}} direction="row" spacing={1} justifyContent={"space-between"}>
                    {nftGalleryFilterButtonsList.map((items, index) => (
                        <Grid item xs={4} sm={2}>
                            <FilterButton
                                selected={items.label === nftGalleryFilterBtnSelected}
                                onClick={() => setNftGalleryFilterBtnSelected(items.label)}
                            >
                                {items.label}
                                <p>{countList[index]}</p>
                            </FilterButton>
                        </Grid>
                    ))}
                </Grid>
                <Grid item lg={4} md={12} sm={12} xs={12} order={{lg: 2, md: 1, sm:1, xs: 1}}>
                    <OptionsBar
                        handleKeyWordChange={handleKeyWordChange}
                        sortOptions={sortOptions} 
                        sortSelected={sortBy}
                        handleSortChange={handleChangeSortBy}
                        handleClickFilterButton={handleClickFilterButton}
                        productViewMode={productViewMode}
                        setProductViewMode={setProductViewMode}
                        // filterBtnHidden
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
