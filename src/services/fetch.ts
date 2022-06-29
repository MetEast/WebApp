import {
    enumBadgeType,
    enumBlindBoxNFTType,
    enumMyNFTType,
    enumSingleNFTType,
    enumTransactionType,
    OrderEventType,
    TypeBlindBoxSelectItem,
    TypeFavouritesFetch,
    TypeNFTHisotry,
    TypeNFTTransaction,
    TypeNFTTransactionFetch,
    TypeProduct,
    TypeProductFetch,
    TypeProductFetch2,
    TypeSingleNFTBid,
    TypeSingleNFTBidFetch,
    TypeYourEarning,
    TypeYourEarningFetch,
} from 'src/types/product-types';
import { NotificationParams, TypeNotification, TypeNotificationFetch } from 'src/types/notification-types';
import { getImageFromAsset, getTime, reduceHexAddress } from 'src/services/common';
import {
    blankAdminBannerItem,
    blankAdminNFTItem,
    blankAdminUserItem,
    blankBBCandidate,
    blankBBItem,
    blankMyEarning,
    blankMyNFTHistory,
    blankMyNFTItem,
    blankNFTBid,
    blankNFTItem,
    blankNFTTxs,
    blankNotification,
    blankUserInfo,
} from 'src/constants/init-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import {
    AdminBannersItemFetchType,
    AdminBannersItemType,
    AdminNFTItemType,
    AdminUsersItemFetchType,
    AdminUsersItemType,
} from 'src/types/admin-table-data-types';
import { UserInfoType } from 'src/types/auth-types';
import { VerifiablePresentation } from '@elastosfoundation/did-js-sdk/typings';
import { addressZero } from './wallet';

const fetchMyNFTAPIs = [
    'listAllMyTokens',
    'listOwnedTokensByAddress',
    'listCreatedTokensByAddress',
    'listSaleTokensByAddress',
    'listSoldTokensByAddress',
    'listFavoritesTokens',
];

export const FETCH_CONFIG_JSON = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

export const login = (loginType: number, address: string, presentation?: VerifiablePresentation) =>
    new Promise((resolve: (value: string) => void, reject: (value: string) => void) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/login`;
        const reqBody =
            loginType === 1
                ? {
                      address,
                      presentation: presentation ? presentation.toJSON() : '',
                  }
                : {
                      address,
                      isMetaMask: 1,
                      name: '',
                      avatar: '',
                      description: '',
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
                if (data.status === 200) {
                    resolve(data.data.access_token);
                } else {
                    resolve('');
                }
            })
            .catch((error) => {
                reject('');
            });
    });

export const getUserRole = async (address: string) => {
    const resUserRole = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/meteast/api/v1/getDidByAddress?address=${address}`,
        FETCH_CONFIG_JSON,
    );
    const jsonUserRole = await resUserRole.json();
    const dataUserRole: UserInfoType = jsonUserRole.data ? jsonUserRole.data : blankUserInfo;
    return dataUserRole.role;
};

export const updateUserToken = async (address: string, did: string) => {
    const resUserToken = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/userByAddress?address=${address}&did=${did}`,
        FETCH_CONFIG_JSON,
    );
    const jsonUserToken = await resUserToken.json();
    const dataUserToken: string = jsonUserToken.token ? jsonUserToken.token : '';
    return dataUserToken;
};

export const getNotificationList = async (token: string) => {
    const resNotificationList = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/getNotifications`,
        {headers: {Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers}},
    );
    const jsonNotificationList = await resNotificationList.json();
    const arrNotificationList = jsonNotificationList.data;

    const _arrNotificationList: Array<TypeNotification> = [];
    for (let i = 0; i < arrNotificationList.length; i++) {
        const itemObject: TypeNotificationFetch = arrNotificationList[i];
        const _Note: TypeNotification = { ...blankNotification };
        _Note._id = itemObject._id;
        _Note.title = itemObject.type === 1 ? 'New sale!' : 'Royalties Received!';
        _Note.content = getNotificationCount(itemObject.type, itemObject.params);
        _Note.type = itemObject.type;
        _Note.params = itemObject.params;
        const timestamp = getTime(itemObject.date.toString());
        _Note.date = timestamp.date + ' ' + timestamp.time;
        _Note.isRead = itemObject.read === 1 ? true : false;
        _arrNotificationList.push(_Note);
    }
    return _arrNotificationList;
};

export const getNotificationCount = (type: number, params: NotificationParams) => {
    switch (type) {
        case 1:
            return `Your <b>${params.tokenName}</b> project has been sold to <b>${params.buyer}</b> for <b>${params.price ? params.price/1e18: 0} ELA</b>`;
        case 2:
            return `You have received <b>${params.royaltyFee? params.royaltyFee/1e18: 0} ELA</b> in Roylties from the sale of the <b>${params.tokenName}</b> project.`;
    }
}

export const markNotificationsAsRead = (token: string, ids: string) =>
    new Promise((resolve: (value: boolean) => void, reject: (value: boolean) => void) => {
        const reqUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/readNotifications`;
        const reqBody = {
            token: token,
            ids: ids,
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
                if (data.status === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(false);
            });
    });

export const removeNotifications = async (ids: string) => {
    const resRead = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/removeNotifications?ids=${ids}`,
        FETCH_CONFIG_JSON,
    );
    const jsonRead = await resRead.json();
    return jsonRead.code === 200;
};

export const getShorternUrl = async (url: string) => {
    try {
        const resShorternUrl = await fetch(
            `${process.env.REACT_APP_SHORTERN_SERVICE_URL}/api/v2/action/shorten?key=2b495b2175ec5470d35482f524ac87&url=${url}&is_secret=false`,
        );
        return resShorternUrl.text();
    } catch (error) {
        return '';
    }
};

export const getELA2USD = async () => {
    try {
        const resElaUsdRate = await fetch(
            `https://assist.trinity-feeds.app/feeds/api/v1/price`,
            FETCH_CONFIG_JSON,
        );
        const dataElaUsdRate = await resElaUsdRate.json();
        if (dataElaUsdRate) return parseFloat(dataElaUsdRate.ELA);
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

export const getMyFavouritesList2 = async (loginState: boolean, token: string) => {
    if (loginState) {
        try {
            const resFavouriteList = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/api/v1/getFavoritesCollectible`,
                {
                    method: 'POST',
                    headers: {Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers},
                    body: JSON.stringify({pageSize: 100, pageNum: 1}),
                },
            );
            const dataFavouriteList = await resFavouriteList.json();
            let arrFavouriteList: Array<string> = [];
            dataFavouriteList.data.map((item: { tokenId: string }) => {arrFavouriteList.push(item.tokenId)});
            return arrFavouriteList;
        } catch (error) {
            return [];
        }
    } else return [];
};

export const getPageBannerList = async (location: number) => {
    const resPageBannerList = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/listBanner?location=${location}`,
        FETCH_CONFIG_JSON,
    );
    const jsonPageBannerList = await resPageBannerList.json();
    const arrPageBannerList = jsonPageBannerList.data ? jsonPageBannerList.data : [];
    const _arrPageBannerList: Array<string> = [];
    for (let i = 0; i < arrPageBannerList.length; i++) {
        const itemObject: AdminBannersItemFetchType = arrPageBannerList[i];
        _arrPageBannerList.push(
            itemObject.image.split(':').length === 3 ? getImageFromAsset(itemObject.image) : itemObject.image,
        );
    }
    return _arrPageBannerList;
};

// Home Page & Product Page
export const getNFTItemList = async (fetchParams: string, ELA2USD: number, likeList: Array<TypeFavouritesFetch>) => {
    const resNFTList = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/api/v1/listMarketTokens?${fetchParams}`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTList = await resNFTList.json();
    const totalCount: number = jsonNFTList.data.total;
    const arrNFTList = jsonNFTList.data ? jsonNFTList.data.result : [];

    const _arrNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrNFTList[i];
        const _NFT: TypeProduct = { ...blankNFTItem };
        _NFT.tokenId = itemObject.tokenId;
        _NFT.name = itemObject.name;
        _NFT.image = getImageFromAsset(itemObject.thumbnail);
        _NFT.price_ela = itemObject.price / 1e18;
        _NFT.price_usd = _NFT.price_ela * ELA2USD;
        _NFT.author = itemObject.authorName ? itemObject.authorName : reduceHexAddress(itemObject.royaltyOwner, 4);
        _NFT.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
        _NFT.likes = itemObject.likes;
        _NFT.views = itemObject.views;
        _NFT.status = itemObject.status;
        _NFT.isExpired = Math.round(new Date().getTime() / 1000) > parseInt(itemObject.endTime);
        _NFT.isLike =
            likeList.findIndex((value: TypeFavouritesFetch) => value.tokenId === itemObject.tokenId) === -1
                ? false
                : true;
        _arrNFTList.push(_NFT);
    }
    return { total: totalCount, data: _arrNFTList };
};

export const getNFTItemList2 = async (
    body: {pageSize: number, pageNum: number, orderType?: string, filterStatus?: string, minPrice?: number, maxPrice?: number, category?: string},
    ELA2USD: number | undefined,
    likeList: Array<String> | undefined,
) => {
    const resNFTList = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/listMarketTokens`,
        {
            method: 'POST',
            ...FETCH_CONFIG_JSON,
            body: JSON.stringify(body),
        }
    );
    const jsonNFTList = await resNFTList.json();
    const totalCount: number = jsonNFTList.data.total;
    const arrNFTList = jsonNFTList.data ? jsonNFTList.data.data : [];

    const _arrNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrNFTList.length; i++) {
        const itemObject: TypeProductFetch2 = arrNFTList[i];
        const _NFT: TypeProduct = { ...blankNFTItem };
        _NFT.tokenId = itemObject.tokenId;
        _NFT.name = itemObject.token.name;
        _NFT.image = getImageFromAsset(itemObject.token.thumbnail);
        _NFT.price_ela = itemObject.orderPrice / 1e18;
        _NFT.price_usd = ELA2USD ? _NFT.price_ela * ELA2USD : 0;
        _NFT.author = reduceHexAddress(itemObject.token.royaltyOwner, 4)
        _NFT.type = itemObject.orderType === 1 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
        _NFT.likes = itemObject.token.likes ? itemObject.token.likes : 0;
        _NFT.views = itemObject.token.views ? itemObject.token.views : 0;
        // _NFT.status = itemObject.status;
        // _NFT.isExpired = Math.round(new Date().getTime() / 1000) > parseInt(itemObject.endTime);
        _NFT.isLike = likeList ? likeList.includes(itemObject.tokenId ) : false;
        _arrNFTList.push(_NFT);
    }
    return { total: totalCount, data: _arrNFTList };
};

// Product Page
export const getSearchParams = (
    pageNum: number,
    pageSize: number,
    keyWord: string,
    sortBy: TypeSelectItem | undefined,
    filterRange: TypeFilterRange,
    filters: Array<enumFilterOption>,
    category: TypeSelectItem | undefined,
) => {
    let searchParams = `pageNum=${pageNum}&pageSize=${pageSize}&keyword=${keyWord}`;
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
            else if (item === 2) filterStatus += 'HAS BIDS,';
        });
        searchParams += `&filter_status=${filterStatus.slice(0, filterStatus.length - 1)}`;
    }
    if (category !== undefined) {
        searchParams += `&category=${category.value}`;
    }
    return searchParams;
};

export const getSearchParams2 = (
    pageNum: number,
    pageSize: number,
    keyWord: string,
    sortBy: TypeSelectItem | undefined,
    filterRange: TypeFilterRange,
    filters: Array<enumFilterOption>,
    category: TypeSelectItem | undefined,
) => {
    let orderType, filterStatus, minPrice, maxPrice;
    if (sortBy !== undefined) {
        switch (sortBy.value) {
            case 'low_to_high':
                orderType = 'price_l_to_h';
                break;
            case 'high_to_low':
                orderType = `price_h_to_l`;
                break;
            case 'most_viewed':
                orderType = `mostviewed`;
                break;
            case 'most_liked':
                orderType = `mostliked`;
                break;
            case 'most_recent':
                orderType = `mostrecent`;
                break;
            case 'oldest':
                orderType = `oldest`;
                break;
            default:
                orderType = `mostrecent`;
                break;
        }
    }
    if (filterRange.min !== undefined) {
        minPrice = filterRange.min * 1e18;
    }
    if (filterRange.max !== undefined) {
        maxPrice = filterRange.max * 1e18;
    }
    if (filters.length !== 0) {
        filters.forEach((item) => {
            if (item === 0) filterStatus = 'ON AUCTION';
            else if (item === 1) filterStatus = 'BUY NOW';
        });
    }

    return {pageNum, pageSize, keyword: keyWord, orderType, filterStatus, minPrice, maxPrice, category: category?.value};
};

// Mystery Box Page
export const getBBItemList = async (body: string, ELA2USD: number) => {
    const curTimestamp = new Date().getTime() / 1000;
    const resBBList = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/listMarketBlindBoxes`,
        {
            method: 'POST',
            ...FETCH_CONFIG_JSON,
            body: body,
        }
    );
    const jsonBBList = await resBBList.json();
    const totalCount: number = jsonBBList.data.total;
    const arrBBList = jsonBBList.data ? jsonBBList.data.data : [];

    const _arrBBList: Array<TypeProduct> = [];
    for (let i = 0; i < arrBBList.length; i++) {
        const itemObject: TypeProductFetch = arrBBList[i];
        const _BBItem: TypeProduct = { ...blankBBItem };
        _BBItem.tokenId = itemObject._id;
        _BBItem.name = itemObject.name;
        _BBItem.image = getImageFromAsset(itemObject.thumbnail ? itemObject.thumbnail : itemObject.asset);
        _BBItem.price_ela = parseFloat(itemObject.blindPrice);
        _BBItem.price_usd = _BBItem.price_ela * ELA2USD;
        _BBItem.type =
            itemObject.tokenIds?.length === 0
                ? enumBlindBoxNFTType.SoldOut
                : parseInt(itemObject.saleBegin) > curTimestamp
                ? enumBlindBoxNFTType.ComingSoon
                : enumBlindBoxNFTType.SaleEnds;
        _BBItem.likes = itemObject.likes;
        _BBItem.views = itemObject.views;
        _BBItem.author = itemObject.createdName
            ? itemObject.createdName
            : reduceHexAddress(itemObject.address, 4);
        _BBItem.royaltyOwner = itemObject.address;
        // _BBItem.isLike = loginState
        //     ? itemObject.list_likes.findIndex((value: TypeBlindListLikes) => value.did === did) === -1
        //         ? false
        //         : true
        //     : false;
        _BBItem.sold = itemObject.soldTokenIds?.length || 0;
        _BBItem.instock = itemObject.tokenIds?.length || 0;
        if (itemObject.saleBegin) {
            const endTime = getTime(itemObject.saleBegin);
            _BBItem.endTime = endTime.date + ' ' + endTime.time;
        } else {
            _BBItem.endTime = '';
        }
        _arrBBList.push(_BBItem);
    }
    return { total: totalCount, data: _arrBBList };
};

// SingleNFTFixedPrice & SingleNFTAuction
export const getNFTItem = async (
    tokenId: string | undefined,
    ELA2USD: number,
    // likeList: Array<TypeFavouritesFetch>,
) => {
    const resNFTItem = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/getMarketTokenByTokenId?tokenId=${tokenId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTItem = await resNFTItem.json();
    const itemObject: TypeProductFetch = jsonNFTItem.data;

    const resNFTItem2 = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/api/v1/getCollectibleByTokenId?tokenId=${tokenId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTItem2 = await resNFTItem2.json();
    const itemObject2: TypeProductFetch = jsonNFTItem2.data;

    const _NFTItem: TypeProduct = { ...blankNFTItem };
    if (itemObject !== undefined) {
        _NFTItem.tokenId = itemObject2.tokenId;
        _NFTItem.name = itemObject.name;
        _NFTItem.image = getImageFromAsset(itemObject2.data.image);
        _NFTItem.price_ela = itemObject.order?.orderPrice / 1e18;
        _NFTItem.price_usd = _NFTItem.price_ela * ELA2USD;
        _NFTItem.type = itemObject.order === undefined ? enumSingleNFTType.NotOnSale :
            itemObject.order.orderType === 1 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
            // itemObject.status === 'NEW'
            //     ? enumSingleNFTType.NotOnSale
            //     : itemObject.endTime === '0'
            //     ? enumSingleNFTType.BuyNow
            //     : enumSingleNFTType.OnAuction;
        _NFTItem.likes = itemObject.likes;
        _NFTItem.views = itemObject.views;
        // _NFTItem.isLike =
        //     likeList.findIndex((value: TypeFavouritesFetch) => value.tokenId === itemObject.tokenId) === -1
        //         ? false
        //         : true;
        _NFTItem.description = itemObject.description;
        _NFTItem.author = itemObject2.creator?.name || reduceHexAddress(itemObject2.royaltyOwner, 4);
        _NFTItem.authorDescription = itemObject2.creator?.description || '';
        _NFTItem.authorImg = itemObject.authorAvatar ? getImageFromAsset(itemObject.authorAvatar) : 'default';
        _NFTItem.authorAddress = itemObject.royaltyOwner;
        _NFTItem.holder = itemObject2.tokenOwner;
        _NFTItem.holderName =
            itemObject.holder === itemObject.royaltyOwner
                ? _NFTItem.author
                : itemObject.holderName
                ? itemObject.holderName
                : reduceHexAddress(itemObject.holder, 4);
        _NFTItem.orderId = itemObject.order.orderId + '';
        _NFTItem.tokenIdHex = itemObject2.tokenIdHex;
        _NFTItem.royalties = itemObject.royaltyFee / 1e4;
        _NFTItem.category = itemObject.category;
        _NFTItem.timestamp = parseInt(itemObject.createTime) * 1000;
        const createTime = getTime(itemObject.createTime);
        _NFTItem.createTime = createTime.date + ' ' + createTime.time;
        _NFTItem.status = itemObject.status;
        _NFTItem.endTimestamp = itemObject.endTime ? itemObject.order.endTime * 1000 : 0;
        if (itemObject.endTime) {
            const endTime = getTime(itemObject.endTime);
            _NFTItem.endTime = endTime.date + ' ' + endTime.time;
        } else {
            _NFTItem.endTime = ' ';
        }
        _NFTItem.isExpired = Math.round(new Date().getTime() / 1000) > parseInt(itemObject.endTime);
        _NFTItem.isBlindbox = itemObject.order?.isBlindBox;
    }
    return _NFTItem;
};

// BB sold product
export const getNFTItems = async (tokenIds: string | undefined) => {
    const resNFTItems = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/getTokenByIds`,
        {
            method: 'POST',
            ...FETCH_CONFIG_JSON,
            body: JSON.stringify(tokenIds?.split(',')),
        }
    );
    const jsonNFTItems = await resNFTItems.json();
    const arrNFTItems = await jsonNFTItems.data;
    const _NFTItems: Array<TypeProduct> = [];
    for (let i = 0; i < arrNFTItems.length; i++) {
        const itemObject: TypeProductFetch = arrNFTItems[i];
        const _NFT: TypeProduct = { ...blankNFTItem };
        _NFT.tokenId = itemObject.tokenId;
        _NFT.name = itemObject.name;
        _NFT.image = getImageFromAsset(itemObject.thumbnail);
        _NFTItems.push(_NFT);
    }
    return _NFTItems;
};

export const getNFTLatestTxs = async (
    tokenId: string | undefined,
    address: string,
    pageNum: number,
    pageSize: number,
    sortBy?: string,
) => {
    let fetchUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${tokenId}&pageNum=${pageNum}&pageSize=${pageSize}`;
    switch (sortBy) {
        case 'low_to_high':
            fetchUrl += `&orderType=price_l_to_h`;
            break;
        case 'high_to_low':
            fetchUrl += `&orderType=price_h_to_l`;
            break;
        case 'most_recent':
            fetchUrl += `&orderType=mostrecent`;
            break;
        case 'oldest':
            fetchUrl += `&orderType=oldest`;
            break;
        default:
            fetchUrl += `&orderType=mostrecent`;
            break;
    }
    const resNFTTxs = await fetch(fetchUrl, FETCH_CONFIG_JSON);
    const jsonNFTTxs = await resNFTTxs.json();
    const arrNFTTxs = jsonNFTTxs.data;

    const _NFTTxList: Array<TypeNFTTransaction> = [];
    const _NFTTxHistoryList: Array<TypeNFTHisotry> = [];
    for (let i = 0; i < arrNFTTxs.length; i++) {
        const itemObject: TypeNFTTransactionFetch = arrNFTTxs[i];
        if (itemObject.event === 'Transfer') continue;
        const _NFTTx: TypeNFTTransaction = { ...blankNFTTxs };
        switch (itemObject.event) {
            case 'Mint':
                _NFTTx.type = enumTransactionType.CreatedBy;
                _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
                break;
            case 'CreateOrderForSale':
                _NFTTx.type = enumTransactionType.ForSale;
                _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
                break;
            case 'CreateOrderForAuction':
                _NFTTx.type = enumTransactionType.OnAuction;
                _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
                break;
            case 'BidOrder':
                _NFTTx.type = enumTransactionType.Bid;
                _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
                break;
            case 'ChangeOrderPrice':
                _NFTTx.type = enumTransactionType.PriceChanged;
                _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
                break;
            case 'CancelOrder':
                _NFTTx.type = enumTransactionType.SaleCanceled;
                _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
                break;
            case 'BuyOrder':
                _NFTTx.type = enumTransactionType.SoldTo;
                _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
                break;
            // case 'Transfer':
            //     _NFTTx.type = enumTransactionType.Transfer;
            //     break;
            case 'SettleBidOrder':
                _NFTTx.type = enumTransactionType.SettleBidOrder;
                _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
                break;
        }
        _NFTTx.price = parseInt(itemObject.price) / 1e18;
        _NFTTx.txHash = itemObject.tHash;
        const timestamp = getTime(itemObject.timestamp.toString());
        _NFTTx.time = timestamp.date + ' ' + timestamp.time;
        _NFTTxList.push(_NFTTx);
        // for my nft history
        if (address !== '' && (itemObject.event === 'Mint' || itemObject.event === 'BuyOrder')) {
            const _NFTTxHistory: TypeNFTHisotry = { ...blankMyNFTHistory };
            _NFTTxHistory.type =
                itemObject.event === 'Mint' ? 'Created' : itemObject.to === address ? 'Bought From' : 'Sold To';
            _NFTTxHistory.price = parseInt(itemObject.price) / 1e18;
            _NFTTxHistory.user =
                _NFTTxHistory.type === 'Bought From'
                    ? itemObject.fromName
                        ? itemObject.fromName
                        : reduceHexAddress(itemObject.from, 4)
                    : itemObject.toName
                    ? itemObject.toName
                    : reduceHexAddress(itemObject.to, 4);
            const prodTransTimestamp = getTime(itemObject.timestamp.toString());
            _NFTTxHistory.time = prodTransTimestamp.date + ' ' + prodTransTimestamp.time;
            if (itemObject.event === 'BuyOrder')
                _NFTTxHistory.saleType =
                    arrNFTTxs[i + 1].event === 'CreateOrderForSale'
                        ? enumTransactionType.ForSale
                        : enumTransactionType.OnAuction;
            _NFTTxHistory.txHash = itemObject.tHash;
            _NFTTxHistoryList.push(_NFTTxHistory);
        }
    }
    return { txs: _NFTTxList, history: _NFTTxHistoryList };
};

export const getNFTLatestTxs2 = async (
    tokenId: string | undefined,
) => {
    console.log(tokenId);
    let fetchUrl = `${process.env.REACT_APP_SERVICE_URL}/api/v1/getTransHistoryByTokenId?tokenId=${tokenId}`;

    const resNFTTxs = await fetch(fetchUrl, FETCH_CONFIG_JSON);
    const jsonNFTTxs = await resNFTTxs.json();
    const arrNFTTxs = jsonNFTTxs.data;

    const _NFTTxList: Array<TypeNFTTransaction> = [];
    for (let i = 0; i < arrNFTTxs.length; i++) {
        const itemObject: TypeNFTTransactionFetch = arrNFTTxs[i];
        // if (itemObject.event === 'Transfer') continue;
        const _NFTTx: TypeNFTTransaction = { ...blankNFTTxs };
        const lastEvent  = itemObject.events[itemObject.events.length - 1];
        switch (lastEvent.eventType) {
            // case 'Mint':
            //     _NFTTx.type = enumTransactionType.CreatedBy;
            //     _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
            //     break;
            case OrderEventType.OrderForSale:
                _NFTTx.type = enumTransactionType.ForSale;
                _NFTTx.user = itemObject.sellerInfo ? itemObject.sellerInfo.name : reduceHexAddress(itemObject.sellerAddr, 4);
                break;
            case OrderEventType.OrderForAuction:
                _NFTTx.type = enumTransactionType.OnAuction;
                _NFTTx.user = itemObject.sellerInfo ? itemObject.sellerInfo.name : reduceHexAddress(itemObject.sellerAddr, 4);
                break;
            // case OrderEventType.OrderBid:
            //     _NFTTx.type = enumTransactionType.Bid;
            //     _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
            //     break;
            // case 'ChangeOrderPrice':
            //     _NFTTx.type = enumTransactionType.PriceChanged;
            //     _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
            //     break;
            case OrderEventType.OrderCancelled:
                _NFTTx.type = enumTransactionType.SaleCanceled;
                _NFTTx.user = itemObject.sellerInfo ? itemObject.sellerInfo.name : reduceHexAddress(itemObject.sellerAddr, 4);
                break;
            case OrderEventType.OrderFilled:
                _NFTTx.type = enumTransactionType.SoldTo;
                _NFTTx.user = itemObject.buyerInfo ? itemObject.buyerInfo.name : reduceHexAddress(itemObject.buyerAddr, 4);
                break;
            // case 'Transfer':
            //     _NFTTx.type = enumTransactionType.Transfer;
            //     break;
            // case 'SettleBidOrder':
            //     _NFTTx.type = enumTransactionType.SettleBidOrder;
            //     _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
            //     break;
        }
        _NFTTx.price = lastEvent.price ? lastEvent.price / 1e18 : 0;
        _NFTTx.txHash = lastEvent.transactionHash;
        const timestamp = getTime(lastEvent.timestamp.toString());
        _NFTTx.time = timestamp.date + ' ' + timestamp.time;
        _NFTTxList.push(_NFTTx);
    }
    return _NFTTxList;
};


export const getNFTLatestBids = async (
    tokenId: string | undefined,
    userAddress: string,
    pageNum: number,
    pageSize: number,
    sortBy?: string,
) => {
    let fetchUrl = `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${tokenId}&address=${userAddress}&pageNum=${pageNum}&pageSize=${pageSize}`;
    switch (sortBy) {
        case 'low_to_high':
            fetchUrl += `&orderType=price_l_to_h`;
            break;
        case 'high_to_low':
            fetchUrl += `&orderType=price_h_to_l`;
            break;
        case 'most_recent':
            fetchUrl += `&orderType=mostrecent`;
            break;
        case 'oldest':
            fetchUrl += `&orderType=oldest`;
            break;
        default:
            fetchUrl += `&orderType=mostrecent`;
            break;
    }
    const resNFTBids = await fetch(fetchUrl, FETCH_CONFIG_JSON);
    const jsonNFTBids = await resNFTBids.json();
    const arrNFTBids = jsonNFTBids.data;

    const _otherNFTBidList: Array<TypeSingleNFTBid> = [];
    if (arrNFTBids !== undefined && arrNFTBids.others !== undefined) {
        for (let i = 0; i < arrNFTBids.others.length; i++) {
            const itemObject: TypeSingleNFTBidFetch = arrNFTBids.others[i];
            const _otherNFTBid: TypeSingleNFTBid = { ...blankNFTBid };
            _otherNFTBid.user = itemObject.buyerName ? itemObject.buyerName : reduceHexAddress(itemObject.buyerAddr, 4);
            _otherNFTBid.address = itemObject.buyerAddr;
            _otherNFTBid.price = parseFloat(itemObject.price) / 1e18;
            _otherNFTBid.orderId = itemObject.orderId;
            const timestamp = getTime(itemObject.timestamp);
            _otherNFTBid.time = timestamp.date + ' ' + timestamp.time;
            _otherNFTBidList.push(_otherNFTBid);
        }
    }

    const _myNFTBidList: Array<TypeSingleNFTBid> = [];
    if (arrNFTBids !== undefined && arrNFTBids.yours !== undefined) {
        for (let i = 0; i < arrNFTBids.yours.length; i++) {
            const itemObject: TypeSingleNFTBidFetch = arrNFTBids.yours[i];
            const _myNFTBid: TypeSingleNFTBid = { ...blankNFTBid };
            _myNFTBid.user = itemObject.buyerName ? itemObject.buyerName : reduceHexAddress(itemObject.buyerAddr, 4);
            _myNFTBid.address = itemObject.buyerAddr;
            _myNFTBid.price = parseFloat(itemObject.price) / 1e18;
            _myNFTBid.orderId = itemObject.orderId;
            const timestamp = getTime(itemObject.timestamp);
            _myNFTBid.time = timestamp.date + ' ' + timestamp.time;
            _myNFTBidList.push(_myNFTBid);
        }
    }
    return { mine: _myNFTBidList, others: _otherNFTBidList };
};

// BlindBoxProduct Page
export const getBBItem = async (blindBoxId: string | undefined, ELA2USD: number) => {
    const resBBItem = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/getBlindBoxById?id=${blindBoxId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonBBItem = await resBBItem.json();
    const itemObject: TypeProductFetch = jsonBBItem.data;
    const _BBItem: TypeProduct = { ...blankBBItem };

    const curTimestamp = new Date().getTime() / 1000;
    if (itemObject !== undefined) {
        _BBItem.tokenId = itemObject._id;
        _BBItem.name = itemObject.name;
        _BBItem.image = getImageFromAsset(itemObject.asset);
        _BBItem.price_ela = parseFloat(itemObject.blindPrice);
        _BBItem.price_usd = _BBItem.price_ela * ELA2USD;
        _BBItem.type =
            itemObject.tokenIds.length === 0
                ? enumBlindBoxNFTType.SoldOut
                : parseInt(itemObject.saleBegin) > curTimestamp
                ? enumBlindBoxNFTType.ComingSoon
                : enumBlindBoxNFTType.SaleEnds;
        _BBItem.likes = itemObject.likes;
        _BBItem.views = itemObject.views;
        _BBItem.author = itemObject.createdName
            ? itemObject.createdName
            : reduceHexAddress(itemObject.address, 4);
        _BBItem.royaltyOwner = itemObject.address;
        _BBItem.authorDescription = itemObject.createdDescription ? itemObject.createdDescription : '';
        _BBItem.authorImg = itemObject.createdAvatar ? getImageFromAsset(itemObject.createdAvatar) : 'default';
        // _BBItem.isLike =
        //     // itemObject.list_likes.findIndex((value: TypeBlindListLikes) => value.did === userDid) === -1 ? false : true;
        _BBItem.description = itemObject.description;
        _BBItem.instock = itemObject.tokenIds.length || 0;
        _BBItem.sold = itemObject.soldTokenIds?.length || 0;
        if (itemObject.saleBegin) {
            const endTime = getTime(itemObject.saleBegin);
            _BBItem.endTime = endTime.date + ' ' + endTime.time;
        } else {
            _BBItem.endTime = '';
        }
        // _BBItem.status = itemObject.status;
        _BBItem.state = itemObject.state;
        _BBItem.maxPurchases = parseInt(itemObject.maxPurchases);
        _BBItem.maxQuantity = parseInt(itemObject.maxQuantity);
        _BBItem.did = itemObject.did;
        _BBItem.soldIds = itemObject.soldTokenIds;
    }
    return _BBItem;
};

export const updateBBStatus = (token: string, BBId: number, status: 'online' | 'offline') =>
    new Promise((resolve: (value: boolean) => void, reject: (value: boolean) => void) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/updateBlindboxStatusById`;
        const reqBody = {
            token: token,
            blindBoxId: BBId,
            status: status,
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
                if (data.status === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(false);
            });
    });

// Profile Page
export const getMyNFTItemList = async (
    fetchParams: string,
    ELA2USD: number,
    likeList: Array<String>,
    nTabId: number,
    walletAddress: string,
    token: string,
) => {
    const fetchUrl =
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/${fetchMyNFTAPIs[nTabId]}`;
    const resMyNFTList = await fetch(fetchUrl, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers},
        body: fetchParams,
    });
    const jsonMyNFTList = await resMyNFTList.json();
    const totalCount: number = jsonMyNFTList.data.total;
    const arrMyNFTList = jsonMyNFTList.data ? jsonMyNFTList.data.data : [];
    const _arrMyNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrMyNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrMyNFTList[i];
        if (itemObject.holder === addressZero) continue;
        const _myNFT: TypeProduct = { ...blankMyNFTItem };
        _myNFT.types = [];
        if (nTabId === 0 || nTabId === 1 || nTabId === 2) {
            _myNFT.tokenId = itemObject.tokenId;
            _myNFT.name = itemObject.name;
            _myNFT.image = itemObject.thumbnail ? getImageFromAsset(itemObject.thumbnail) : '';
            _myNFT.price_ela = itemObject.order?.orderPrice ? itemObject.order?.orderPrice / 1e18: 0;
            _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
            _myNFT.author = reduceHexAddress(itemObject.royaltyOwner, 4);
            _myNFT.likes = itemObject.likes;
            _myNFT.views = itemObject.views;

            if( itemObject.royaltyOwner === walletAddress ) {
                _myNFT.types.push(enumMyNFTType.Created);
            }
            if(itemObject.order) {
                _myNFT.type = itemObject.order.orderType === 1 ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
            }

        } else if (nTabId === 5 || nTabId === 4) {
            _myNFT.tokenId = itemObject.tokenId;
            _myNFT.name = itemObject.token.name;
            _myNFT.image = itemObject.token.thumbnail ? getImageFromAsset(itemObject.token.thumbnail) : '';
            _myNFT.price_ela = itemObject.order?.orderPrice ? itemObject.order?.orderPrice / 1e18: 0;
            _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
            _myNFT.author = reduceHexAddress(itemObject.token.royaltyOwner, 4);
            _myNFT.likes = itemObject.token.likes;
            _myNFT.views = itemObject.token.views;

            if( itemObject.token.royaltyOwner === walletAddress ) {
                _myNFT.types.push(enumMyNFTType.Created);
            }

            if(itemObject.order) {
                _myNFT.type = itemObject.order.orderType === 1 ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
            }

        } else {
            _myNFT.tokenId = itemObject.tokenId;
            _myNFT.name = itemObject.token.name;
            _myNFT.image = itemObject.token.thumbnail ? getImageFromAsset(itemObject.token.thumbnail) : '';
            _myNFT.price_ela = itemObject.orderPrice  / 1e18;
            _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
            _myNFT.author = reduceHexAddress(itemObject.token.royaltyOwner, 4);
            _myNFT.likes = itemObject.token.likes;
            _myNFT.views = itemObject.token.views;

            if( itemObject.token.royaltyOwner === walletAddress ) {
                _myNFT.types.push(enumMyNFTType.Created);
            }

            _myNFT.type = itemObject.orderType === 1 ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
        }

        _myNFT.status = itemObject.status;
        _myNFT.isLike =
            nTabId === 5
                ? true
                : likeList.includes(itemObject.tokenId)
        _arrMyNFTList.push(_myNFT);
    }
    return { total: totalCount, data: _arrMyNFTList };
};

export const getMyTotalEarned = async (address: string) => {
    try {
        const resTotalEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/api/v1/getEarnedByAddress?address=${address}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const jsonTotalEarnedResult = await resTotalEarnedResult.json();
        if (jsonTotalEarnedResult && jsonTotalEarnedResult.data)
            return parseFloat(String(jsonTotalEarnedResult.data / 1e18)).toFixed(2);
        return '0';
    } catch (error) {
        return '0';
    }
};

export const getMyTodayEarned = async (address: string) => {
    try {
        const resTodayEarnedResult = await fetch(
            `${process.env.REACT_APP_SERVICE_URL}/api/v1/getTodayEarnedByAddress?address=${address}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );
        const jsonTodayEarnedResult = await resTodayEarnedResult.json();
        if (jsonTodayEarnedResult && jsonTodayEarnedResult.data)
            return parseFloat(String(jsonTodayEarnedResult.data / 1e18)).toFixed(2);
        return '0';
    } catch (error) {
        return '0';
    }
};

export const getMyEarnedList = async (address: string) => {
    const resEarnedList = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/api/v1/getEarnedListByAddress?address=${address}`,
        FETCH_CONFIG_JSON,
    );
    const jsonEarnedList = await resEarnedList.json();
    const arrEarnedList = jsonEarnedList === undefined ? [] : jsonEarnedList.data;

    const _myEarningList: Array<TypeYourEarning> = [];
    for (let i = 0; i < arrEarnedList.length; i++) {
        const itemObject: TypeYourEarningFetch = arrEarnedList[i];
        const _myEarning: TypeYourEarning = { ...blankMyEarning };

        let earn = 0, badge = '';
        if(itemObject.royaltyOwner === address) {
            badge = 'Badge';
            if(itemObject.sellerAddr === address) {
                earn = itemObject.price;
            } else {
                earn = itemObject.royaltyFee;
            }
        } else {
            badge = 'Royalties'
            earn = itemObject.price - itemObject.royaltyFee - itemObject.platformFee;
        }

        // _earning.tokenId = itemObject.tokenId;
        _myEarning.title = itemObject.token.name;
        _myEarning.avatar = getImageFromAsset(itemObject.token.data.thumbnail);
        _myEarning.price = earn / 1e18;
        const timestamp = getTime(itemObject.updateTime);
        _myEarning.time = timestamp.date + ' ' + timestamp.time;
        _myEarning.badge = badge === 'Badge' ? enumBadgeType.Sale : enumBadgeType.Royalties;
        _myEarningList.push(_myEarning);
    }
    return _myEarningList;
};

// MyNFT Page
export const getMyNFTItem = async (
    tokenId: string | undefined,
) => {
    const resMyNFTItem = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/api/v1/getTokenOrderByTokenId?tokenId=${tokenId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonMyNFTItem = await resMyNFTItem.json();
    const itemObject: TypeProductFetch = jsonMyNFTItem.data;
    const _MyNFTItem: TypeProduct = { ...blankNFTItem };

    if (itemObject !== undefined) {
        _MyNFTItem.tokenId = itemObject.tokenId;
        _MyNFTItem.name = itemObject.name;
        _MyNFTItem.image = getImageFromAsset(itemObject.data.image);
        _MyNFTItem.description = itemObject.description;
        _MyNFTItem.author = itemObject.creator.name
            ? itemObject.creator.name
            : reduceHexAddress(itemObject.royaltyOwner, 4);
        _MyNFTItem.authorDescription = itemObject.creator.description || ' ';
        _MyNFTItem.authorImg = itemObject.authorAvatar ? getImageFromAsset(itemObject.authorAvatar) : 'default';
        _MyNFTItem.authorAddress = itemObject.royaltyOwner;
        _MyNFTItem.holderName =
            itemObject.tokenOwner === itemObject.royaltyOwner
                ? _MyNFTItem.author
                : itemObject.holderName
                ? itemObject.holderName
                : reduceHexAddress(itemObject.tokenOwner, 4);
        _MyNFTItem.holder = itemObject.tokenOwner;
        _MyNFTItem.royaltyOwner = itemObject.royaltyOwner;
        _MyNFTItem.tokenIdHex = itemObject.tokenIdHex;
        _MyNFTItem.royalties = itemObject.royaltyFee / 1e4;
        _MyNFTItem.category = itemObject.category;
        _MyNFTItem.timestamp = parseInt(itemObject.createTime) * 1000;
        const createTime = getTime(itemObject.createTime);
        _MyNFTItem.createTime = createTime.date + ' ' + createTime.time;

        if(itemObject.order) {
            _MyNFTItem.orderId = itemObject.order.orderId.toString();
            _MyNFTItem.status = itemObject.order.orderState.toString();
            _MyNFTItem.isExpired = Math.round(new Date().getTime() / 1000) > itemObject.order.endTime;
            _MyNFTItem.isBlindbox = itemObject.order.isBlindBox;
            _MyNFTItem.price_ela = itemObject.order.price / 1e18;

            if(itemObject.order.bids > 0) {
                _MyNFTItem.status = 'HAS BIDS'
            }

            if (itemObject.order.endTime) {
                const endTime = getTime(itemObject.endTime);
                _MyNFTItem.endTime = endTime.date + ' ' + endTime.time;
            } else {
                _MyNFTItem.endTime = '0';
            }
        }
    }
    return _MyNFTItem;
};

// BB creation
export const getBBCandiatesList = async (address: string, keyword: string, token: string) => {
    const resBBCandidateList = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/getUserCandidateTokens?address=${address}&keyword=${keyword}`,
        {
            headers: {Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers}
        }
    );
    const jsonBBCandidateList = await resBBCandidateList.json();
    return jsonBBCandidateList.status === 200 ? jsonBBCandidateList.data : []
};

export const getBBCandiates = (arrBBCandidateList: Array<any>, selectedTokenIds: Array<string>) => {
    const _BBCandidateList: Array<TypeBlindBoxSelectItem> = [];
    const _itemCheckedList: Array<boolean> = [];
    let _allChecked: boolean = false;
    let _indeterminateChecked: boolean = false;
    for (let i = 0; i < arrBBCandidateList.length; i++) {
        const itemObject: TypeProductFetch = arrBBCandidateList[i];
        if (itemObject.status === 'DELETED') continue;
        const _BBCandidate: TypeBlindBoxSelectItem = { ...blankBBCandidate };
        _BBCandidate.id = i + 1;
        _BBCandidate.tokenId = itemObject.tokenId;
        _BBCandidate.nftIdentity = itemObject.tokenIdHex;
        _BBCandidate.projectTitle = itemObject.name;
        _BBCandidate.projectType = itemObject.category;
        _BBCandidate.url = getImageFromAsset(itemObject.thumbnail);
        _BBCandidateList.push(_BBCandidate);
        _itemCheckedList.push(selectedTokenIds.includes(_BBCandidate.tokenId));
    }
    if (selectedTokenIds.length === _BBCandidateList.length) _allChecked = true;
    else if (selectedTokenIds.length > 0) _indeterminateChecked = true;

    return {
        candidates: _BBCandidateList,
        allChecked: _allChecked,
        itemChecked: _itemCheckedList,
        indeterminateChecked: _indeterminateChecked,
    };
};

// edit profile
export const uploadUserProfile = (
    _token: string,
    _address: string,
    _did: string,
    _name: string | null,
    _description: string | null,
    _urlAvatar: string,
    _urlCoverImage: string,
    _signature: string,
) =>
    new Promise((resolve, reject) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/updateUserProfile`;
        const reqBody = {
            address: _address,
            did: _address,
            name: _name,
            description: _description,
            avatar: _urlAvatar,
            coverImage: _urlCoverImage,
            signature: _signature,
        };
        fetch(reqUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${_token}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    resolve(data.data.access_token);
                } else {
                    reject(data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

// admin NFT
export const getAdminSearchParams = (
    status?: TypeSelectItem,
    saleType?: TypeSelectItem,
    pageNum?: number,
    pageSize?: number,
) => {
    let searchParams = ``;

    if (pageNum === undefined) searchParams += `pageNum=1`;
    else searchParams += `pageNum=${pageNum}`;

    if (pageSize === undefined) searchParams += `&pageSize=100`;
    else searchParams += `&pageSize=${pageSize}`;

    if (status !== undefined) {
        searchParams += status.value === 'online' ? '&status=online' : '&status=removed';
    }

    if (saleType !== undefined) {
        searchParams += `&filter_status=${saleType.value === 'Buy now' ? 'BUY NOW' : 'ON AUCTION'}`;
    }

    return searchParams;
};

export const getAdminNFTItemList = async (keyWord: string, fetchParams: string) => {
    let url = `${process.env.REACT_APP_SERVICE_URL}/admin/api/v1/listMarketTokens?${fetchParams}`;
    if (keyWord !== '') url += `&keyword=${keyWord}`;

    console.log('URL:', url);
    const resAdminNFTList = await fetch(url, FETCH_CONFIG_JSON);
    const jsonAdminNFTList = await resAdminNFTList.json();
    const totalCount = jsonAdminNFTList.data === undefined ? 0 : jsonAdminNFTList.data.total;
    const arrAdminNFTList = jsonAdminNFTList.data === undefined ? [] : jsonAdminNFTList.data.result;
    const _arrAdminNFTList: Array<AdminNFTItemType> = [];
    console.log('result count:', arrAdminNFTList.length);
    for (let i = 0; i < arrAdminNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrAdminNFTList[i];
        // if (keyWord === '' && itemObject.status !== 'DELETED') continue;
        // else if (keyWord !== '' && itemObject.status === 'DELETED') continue;
        const _AdminNFT: AdminNFTItemType = { ...blankAdminNFTItem };
        _AdminNFT.id = i + 1;
        _AdminNFT.tokenId = itemObject.tokenId;
        _AdminNFT.token_id = itemObject.tokenIdHex;
        _AdminNFT.nft_title = itemObject.name;
        _AdminNFT.nft_image = getImageFromAsset(itemObject.asset);
        _AdminNFT.selling_price = itemObject.price / 1e18;
        _AdminNFT.nft_creator = itemObject.royaltyOwner;
        _AdminNFT.nft_owner = itemObject.holder;
        _AdminNFT.orderId = itemObject.orderId;
        _AdminNFT.sale_type = itemObject.endTime === '0' ? enumBadgeType.BuyNow : enumBadgeType.OnAuction;
        _AdminNFT.likes = itemObject.likes;
        _AdminNFT.views = itemObject.views;
        _AdminNFT.status = itemObject.status === 'DELETED' ? 'Removed' : 'Online';
        const createdTime = getTime(itemObject.createTime);
        _AdminNFT.created_date = createdTime.date + ' ' + createdTime.time;
        if (itemObject.marketTime === undefined) _AdminNFT.listed_date = '';
        else {
            const listedTime = itemObject.marketTime
                ? getTime(itemObject.marketTime.toString())
                : { date: '', time: '' };
            _AdminNFT.listed_date = listedTime.date + ' ' + listedTime.time;
        }
        _arrAdminNFTList.push(_AdminNFT);
    }
    console.log('filtered count:', _arrAdminNFTList.length);
    return { totalCount: totalCount, arrAdminNFTList: _arrAdminNFTList };
};

export const getAdminUserList = async (keyWord: string, fetchParams: string, role: number) => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/listaddress?${fetchParams}`;
    if (keyWord !== '') url += `&keyword=${keyWord}`;
    url += `&type=${role}`;

    console.log('URL:', url);
    const resAdminUserList = await fetch(url, FETCH_CONFIG_JSON);
    const jsonAdminUserList = await resAdminUserList.json();
    const totalCount = jsonAdminUserList.total;
    const arrAdminUserList = jsonAdminUserList.data === undefined ? [] : jsonAdminUserList.data;

    console.log('result count:', arrAdminUserList.length);

    if (
        totalCount === 1 &&
        arrAdminUserList.length === 1 &&
        arrAdminUserList[0].address === keyWord &&
        parseInt(arrAdminUserList[0].role) === role
    )
        return { result: 1, totalCount: 0, data: [] };

    const _arrAdminUserList: Array<AdminUsersItemType> = [];
    for (let i = 0; i < arrAdminUserList.length; i++) {
        const itemObject: AdminUsersItemFetchType = arrAdminUserList[i];
        // if (role === 0 && parseInt(itemObject.role) !== 0) continue;
        // else if (role === 1) {
        //     if (keyWord === '' && parseInt(itemObject.role) !== 1) continue;
        //     else if (keyWord !== '') {
        //         if (parseInt(itemObject.role) === 1 && itemObject.address === keyWord)
        //             return { result: 1, totalCount: 0, data: [] };
        //         else if (parseInt(itemObject.role) !== 2) continue;
        //     }
        // } else if (role === 3) {
        //     if (keyWord === '' && parseInt(itemObject.role) !== 3) continue;
        //     else if (keyWord !== '') {
        //         if (parseInt(itemObject.role) === 3 && itemObject.address === keyWord)
        //             return { result: 1, totalCount: 0, data: [] };
        //         else if (parseInt(itemObject.role) !== 2) continue;
        //     }
        // }
        const _AdminUser: AdminUsersItemType = { ...blankAdminUserItem };
        _AdminUser.id = i + 1;
        _AdminUser.address = itemObject.address;
        _AdminUser.username = itemObject.name;
        _AdminUser.avatar = getImageFromAsset(itemObject.avatar);
        if (role === 0) _AdminUser.status = 0;
        else if (role === 1) {
            if (parseInt(itemObject.role) === 2) _AdminUser.status = 0;
            else if (parseInt(itemObject.role) === 1) _AdminUser.status = 1;
        } else if (role === 3) {
            if (parseInt(itemObject.role) === 2) _AdminUser.status = 0;
            else if (parseInt(itemObject.role) === 3) _AdminUser.status = 1;
        }
        _AdminUser.remarks = role !== 3 ? '' : itemObject.remarks;
        _arrAdminUserList.push(_AdminUser);
    }
    console.log('filtered count:', _arrAdminUserList.length);

    return { result: 0, totalCount: totalCount, data: _arrAdminUserList };
};

export const updateUserRole = (_token: string, _address: string, _role: number, _remarks: string) =>
    new Promise((resolve: (value: boolean) => void, reject: (value: string) => void) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/updateRole`;
        const reqBody = {
            token: _token,
            address: _address,
            userRole: _role.toString(),
            remarks: _remarks,
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
                if (data.status === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

export const getAdminBannerList = async (pageNum: number, pageSize: number) => {
    let url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/listBanner?pageNum=${pageNum}&pageSize=${pageSize}`;

    console.log('URL:', url);
    const resAdminBannerList = await fetch(url, FETCH_CONFIG_JSON);
    const jsonAdminBannerList = await resAdminBannerList.json();
    const totalCount = jsonAdminBannerList.total;
    const arrAdminBannerList = jsonAdminBannerList.data === undefined ? [] : jsonAdminBannerList.data;

    const _arrAdminBannerList: Array<AdminBannersItemType> = [];
    for (let i = 0; i < arrAdminBannerList.length; i++) {
        const itemObject: AdminBannersItemFetchType = arrAdminBannerList[i];
        const _AdminBanner: AdminBannersItemType = { ...blankAdminBannerItem };
        _AdminBanner.id = itemObject._id;
        _AdminBanner.banner_id = i + 1;
        _AdminBanner.image =
            itemObject.image.split(':').length === 3 ? getImageFromAsset(itemObject.image) : itemObject.image;
        _AdminBanner.url =
            itemObject.image.split(':').length === 3 ? getImageFromAsset(itemObject.image) : itemObject.image;
        _AdminBanner.sort = itemObject.sort;
        _AdminBanner.location =
            itemObject.location === '1' ? 'home' : itemObject.location === '2' ? 'explore' : 'blindbox';
        _AdminBanner.status = itemObject.status === 0 ? 'offline' : 'online';
        const createdTime = itemObject.createTime ? getTime(itemObject.createTime) : { date: '', time: '' };
        _AdminBanner.created = createdTime.date + ' ' + createdTime.time;
        _arrAdminBannerList.push(_AdminBanner);
    }
    console.log('result count:', _arrAdminBannerList.length);
    return { totalCount: totalCount, data: _arrAdminBannerList };
};

export const addAdminBanner = (token: string, image: string, location: number, status: number, sort: number) =>
    new Promise((resolve: (value: number) => void, reject: (value: string) => void) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/createBanner`;
        const reqBody = {
            token: token,
            image: image,
            location: location.toString(),
            status: status.toString(),
            sort: sort.toString(),
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
                resolve(data.code);
            })
            .catch((error) => {
                reject(error);
            });
    });

export const updateAdminBanner = (
    token: string,
    id: number,
    image: string,
    location: number,
    status: number,
    sort: number,
) =>
    new Promise((resolve: (value: number) => void, reject: (value: string) => void) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/updateBanner`;
        const reqBody = {
            token: token,
            id: id.toString(),
            image: image,
            location: location.toString(),
            status: status.toString(),
            sort: sort.toString(),
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
                resolve(data.code);
            })
            .catch((error) => {
                reject(error);
            });
    });

export const deleteAdminBanner = (token: string, id: number) =>
    new Promise((resolve: (value: boolean) => void, reject: (value: string) => void) => {
        const reqUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/deleteBanner`;
        const reqBody = {
            token: token,
            id: id.toString(),
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
                if (data.status === 200) {
                    resolve(true);
                } else {
                    reject('error');
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
