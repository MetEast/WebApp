import { TypeProduct, enumSingleNFTType, TypeProductFetch, TypeFavouritesFetch } from 'src/types/product-types';
import { useSignInContext } from 'src/context/SignInContext';
import { getImageFromAsset, reduceHexAddress } from 'src/services/common';
import { blankNFTItem } from 'src/constants/init-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';

export const FETCH_CONFIG_JSON = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

export const getELA2USD = async () => {
    try {
        const resElaUsdRate = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestElaPrice`,
            FETCH_CONFIG_JSON,
        );
        const dataElaUsdRate = await resElaUsdRate.json();
        if (dataElaUsdRate && dataElaUsdRate.data) return parseFloat(dataElaUsdRate.data);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const getMyFavouritesList = async (loginState: boolean, did: string) => {
    if (loginState) {
        try {
            const resFavouriteList = await fetch(
                `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getFavoritesCollectible?did=${did}`,
                FETCH_CONFIG_JSON,
            );
            const dataFavouriteList = await resFavouriteList.json();
            return dataFavouriteList.data.result;
        } catch (error) {
            return [];
        }
    } else return [];
};

// Home Page & Product Page
export const getNFTItemList = async (fetchParams: string, ELA2USD: number, likeList: Array<TypeFavouritesFetch>) => {
    const resNFTList = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/listMarketTokens?${fetchParams}`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTList = await resNFTList.json();
    const arrNFTList = jsonNFTList.data === undefined ? [] : jsonNFTList.data.result;

    let _arrNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrNFTList[i];
        let _NFT: TypeProduct = { ...blankNFTItem };
        _NFT.tokenId = itemObject.tokenId;
        _NFT.name = itemObject.name;
        _NFT.image = getImageFromAsset(itemObject.asset);
        _NFT.price_ela = itemObject.price / 1e18;
        _NFT.price_usd = _NFT.price_ela * ELA2USD;
        _NFT.author =
            itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
        _NFT.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
        _NFT.likes = itemObject.likes;
        _NFT.views = itemObject.views;
        _NFT.status = itemObject.status;
        _NFT.isLike =
            likeList.findIndex((value: TypeFavouritesFetch) => value.tokenId === itemObject.tokenId) === -1
                ? false
                : true;
        _arrNFTList.push(_NFT);
    }
    return _arrNFTList;
};

// Product Page
export const getSearchParams = (keyWord: string, sortBy: TypeSelectItem | undefined, filterRange: TypeFilterRange, filters: Array<enumFilterOption>) => {
    let searchParams = `pageNum=1&pageSize=${1000}&keyword=${keyWord}`;
    if (sortBy !== undefined) {
        switch (sortBy.value) {
            case 'low_to_high':
                searchParams += `&orderType=price_l_to_h`;
                break;
            case 'high_to_low':
                searchParams += `&orderType=price_h_to_l`;
                break;
            case 'most_viewed':
                searchParams += `&orderType=mostviewed`;
                break;
            case 'most_liked':
                searchParams += `&orderType=mostliked`;
                break;
            case 'most_recent':
                searchParams += `&orderType=mostrecent`;
                break;
            case 'oldest':
                searchParams += `&orderType=oldest`;
                break;
            case 'ending_soon':
                searchParams += `&orderType=endingsoon`;
                break;
            default:
                searchParams += `&orderType=mostrecent`;
                break;
        }
    }
    if (filterRange.min !== undefined) {
        searchParams += `&filter_min_price=${filterRange.min}`;
    }
    if (filterRange.max !== undefined) {
        searchParams += `&filter_max_price=${filterRange.max}`;
    }
    if (filters.length !== 0) {
        let filterStatus: string = '';
        filters.forEach((item) => {
            if (item === 0) filterStatus += 'ON AUCTION,';
            else if (item === 1) filterStatus += 'BUY NOW,';
            else if (item === 2) filterStatus += 'HAS BID,';
        });
        searchParams += `&filter_status=${filterStatus.slice(0, filterStatus.length - 1)}`;
    }
    return searchParams;
};

export const getTotalEarned = async (address: string) => {
    try {
        const resTotalEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedByWalletAddress?address=${address}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataTotalEarnedResult = await resTotalEarnedResult.json();
        if (dataTotalEarnedResult && dataTotalEarnedResult.data) return parseFloat(dataTotalEarnedResult.data);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const getTodayEarned = async (address: string) => {
    try {
        const resTodayEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTodayEarnedByWalletAddress?address=${address}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const dataTodayEarnedResult = await resTodayEarnedResult.json();
        if (dataTodayEarnedResult && dataTodayEarnedResult.data) return parseFloat(dataTodayEarnedResult.data);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const uploadUserProfile = (
    token: string,
    did: string,
    name: string,
    description: string,
    _urlAvatar: string,
    _urlCoverImage: string,
) =>
    new Promise((resolve, reject) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/updateUserProfile`;
        const reqBody = {
            token: token,
            did: did,
            name: name,
            description: description,
            avatar: _urlAvatar,
            coverImage: _urlCoverImage,
        };
        fetch(reqUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.code === 200) {
                    resolve(data.token);
                } else {
                    reject(data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
