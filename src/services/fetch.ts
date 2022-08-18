import {
    enumBadgeType,
    enumBlindBoxNFTType,
    enumMyNFTType,
    enumSingleNFTType,
    enumTransactionType,
    TypeBlindBoxSelectItem,
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
    blankMyNFTItem,
    blankNFTBid,
    blankNFTItem,
    blankNFTTxs,
    blankNotification,
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
import { VerifiablePresentation } from '@elastosfoundation/did-js-sdk/typings';
import { addressZero } from './wallet';
import { apiConfig, polrConfig, serverConfig } from 'src/config';
import { enumAuthType } from 'src/types/auth-types';

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

export const login = (authType: string, address: string, presentation?: VerifiablePresentation) =>
    new Promise((resolve: (value: string) => void, reject: (value: string) => void) => {
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/login`;
        const reqBody =
            authType === enumAuthType.ElastosEssentials
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

// export const getUserRole = async (address: string) => {
//     const resUserRole = await fetch(
//         `${serverConfig.assistServiceUrl}/meteast/api/v1/getDidByAddress?address=${address}`,
//         FETCH_CONFIG_JSON,
//     );
//     const jsonUserRole = await resUserRole.json();
//     const dataUserRole: UserInfoType = jsonUserRole.data ? jsonUserRole.data : blankUserInfo;
//     return dataUserRole.role;
// };

export const getNotificationList = async (token: string) => {
    const resNotificationList = await fetch(`${serverConfig.metServiceUrl}/api/v1/getNotifications`, {
        headers: { Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers },
    });
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
            return `Your <b>${params.tokenName}</b> project has been sold to <b>${params.buyer}</b> for <b>${
                params.price ? params.price / 1e18 : 0
            } ELA</b>`;
        case 2:
            return `You have received <b>${
                params.royaltyFee ? params.royaltyFee / 1e18 : 0
            } ELA</b> in Roylties from the sale of the <b>${params.tokenName}</b> project.`;
    }
};

export const markNotificationsAsRead = (token: string, ids: string) =>
    new Promise((resolve: (value: boolean) => void, reject: (value: boolean) => void) => {
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/readNotifications`;
        fetch(reqUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
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

export const removeNotifications = async (token: string, id: string) => {
    const resRead = await fetch(`${serverConfig.metServiceUrl}/api/v1/removeNotification?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const jsonRead = await resRead.json();
    return jsonRead.status === 200;
};

export const getShorternUrl = async (url: string) => {
    if (!(polrConfig.polrServerUrl && polrConfig.polrAPIKey)) return '';
    try {
        const resShorternUrl = await fetch(
            `${polrConfig.polrServerUrl}/api/v2/action/shorten?key=${polrConfig.polrAPIKey}&url=${url}&is_secret=false`,
        );
        return resShorternUrl.text();
    } catch (error) {
        return '';
    }
};

export const getELA2USD = async () => {
    try {
        const resElaUsdRate = await fetch(apiConfig.feedsELA2USDTUrl, FETCH_CONFIG_JSON);
        const dataElaUsdRate = await resElaUsdRate.json();
        if (dataElaUsdRate) return parseFloat(dataElaUsdRate.ELA);
        return 0;
    } catch (error) {
        return 0;
    }
};

export const checkTokenLike = async (id: string, address: string) => {
    const resCheckLike = await fetch(`${serverConfig.metServiceUrl}/api/v1/checkTokenLike?address=${address}&id=${id}`);
    const jsonCheckLike = await resCheckLike.json();
    return jsonCheckLike.data ? jsonCheckLike.data : false;
};

export const checkBlindBoxLike = async (id: string, address: string) => {
    const resCheckLike = await fetch(
        `${serverConfig.metServiceUrl}/api/v1/checkBlindBoxLike?address=${address}&id=${id}`,
    );
    const jsonCheckLike = await resCheckLike.json();
    return jsonCheckLike.data ? jsonCheckLike.data : false;
};

export const getMyFavouritesNFT = async (loginState: boolean, token: string) => {
    if (loginState) {
        try {
            const resFavouriteList = await fetch(`${serverConfig.metServiceUrl}/api/v1/getFavoritesCollectible`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers },
            });
            const dataFavouriteList = await resFavouriteList.json();
            const arrFavouriteList: Array<string> = [];
            dataFavouriteList.data.map((item: { tokenId: string }) => {
                arrFavouriteList.push(item.tokenId);
                return arrFavouriteList;
            });
            return arrFavouriteList;
        } catch (error) {
            return [];
        }
    } else return [];
};

export const getMyFavouritesBB = async (loginState: boolean, token: string): Promise<string[]> => {
    if (loginState) {
        try {
            const resFavouriteList = await fetch(`${serverConfig.metServiceUrl}/api/v1/getFavoritesBlindBox`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers },
            });
            const dataFavouriteList = await resFavouriteList.json();
            let arrFavouriteList: Array<string> = [];
            dataFavouriteList.data.map((item: { blindBoxIndex: string }) => {
                arrFavouriteList.push(item.blindBoxIndex);
                return arrFavouriteList;
            });
            return arrFavouriteList;
        } catch (error) {
            return [];
        }
    } else return [];
};

export const getPageBannerList = async (location: number) => {
    const resPageBannerList = await fetch(
        `${serverConfig.metServiceUrl}/api/v1/listBanner?location=${location}`,
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
export const getNFTItemList = async (
    body: {
        pageSize: number;
        pageNum: number;
        orderType?: string;
        filterStatus?: string;
        minPrice?: number;
        maxPrice?: number;
        category?: string;
    },
    ELA2USD: number | undefined,
    likeList: Array<string> | undefined,
) => {
    const resNFTList = await fetch(`${serverConfig.metServiceUrl}/api/v1/listMarketTokens`, {
        method: 'POST',
        ...FETCH_CONFIG_JSON,
        body: JSON.stringify(body),
    });
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
        _NFT.author = itemObject.token.authorName
            ? itemObject.token.authorName
            : reduceHexAddress(itemObject.token.royaltyOwner, 4);
        _NFT.type = itemObject.orderType === 1 ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
        _NFT.likes = itemObject.token.likes ? itemObject.token.likes : 0;
        _NFT.views = itemObject.token.views ? itemObject.token.views : 0;
        const endTime: number = itemObject.endTime ? itemObject.endTime : 0;
        _NFT.isExpired = itemObject.orderType === 2 && Math.round(new Date().getTime() / 1000) > endTime;
        _NFT.isLike = likeList ? likeList.includes(itemObject.tokenId) : false;
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
        minPrice = filterRange.min;
    }
    if (filterRange.max !== undefined) {
        maxPrice = filterRange.max;
    }
    if (filters.length !== 0) {
        filters.forEach((item) => {
            if (item === 0) filterStatus = 'ON AUCTION';
            else if (item === 1) filterStatus = 'BUY NOW';
        });
    }

    return {
        pageNum,
        pageSize,
        keyword: keyWord,
        orderType,
        filterStatus,
        minPrice,
        maxPrice,
        category: category?.value,
    };
};

// Mystery Box Page
export const getBBItemList = async (body: string, ELA2USD: number, list_likes: string[]) => {
    const curTimestamp = new Date().getTime() / 1000;
    const resBBList = await fetch(`${serverConfig.metServiceUrl}/api/v1/listMarketBlindBoxes`, {
        method: 'POST',
        ...FETCH_CONFIG_JSON,
        body: body,
    });
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
        _BBItem.author = itemObject.createdName ? itemObject.createdName : reduceHexAddress(itemObject.seller, 4);
        _BBItem.royaltyOwner = itemObject.seller;
        _BBItem.isLike = list_likes.includes(itemObject._id);
        _BBItem.sold = itemObject.soldTokenIds?.length || 0;
        _BBItem.instock = itemObject.tokenIds?.length || 0;
        if (itemObject.saleBegin) {
            const saleBegin = getTime(itemObject.saleBegin);
            _BBItem.endTime = `${saleBegin.date} ${saleBegin.time}`;
        } else _BBItem.endTime = '';
        _arrBBList.push(_BBItem);
    }
    return { total: totalCount, data: _arrBBList };
};

// SingleNFTFixedPrice & SingleNFTAuction
export const getNFTItem = async (tokenId: string | undefined, ELA2USD: number) => {
    const resNFTItem = await fetch(
        `${serverConfig.metServiceUrl}/api/v1/getMarketTokenByTokenId?tokenId=${tokenId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTItem = await resNFTItem.json();
    const itemObject: TypeProductFetch = jsonNFTItem.data;

    const resNFTItem2 = await fetch(
        `${serverConfig.assistServiceUrl}/api/v1/getCollectibleByTokenId?tokenId=${tokenId}`,
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
        _NFTItem.type = enumSingleNFTType.NotOnSale;
        _NFTItem.status = '0';
        if (itemObject.order) {
            if (itemObject.order.orderType === 1 && itemObject.order.orderState === 1) {
                _NFTItem.type = enumSingleNFTType.BuyNow;
                _NFTItem.status = '1';
            } else if (itemObject.order.orderType === 2 && itemObject.order.orderState === 1) {
                _NFTItem.type = enumSingleNFTType.OnAuction;
                _NFTItem.status = '2';
            }
        }
        _NFTItem.likes = itemObject.likes ? itemObject.likes : 0;
        _NFTItem.views = itemObject.views ? itemObject.views : 0;
        _NFTItem.description = itemObject.description;
        _NFTItem.author = itemObject2.creator?.name || reduceHexAddress(itemObject2.royaltyOwner, 4);
        _NFTItem.authorDescription = itemObject2.creator?.description || '';
        _NFTItem.authorImg = itemObject.authorAvatar ? getImageFromAsset(itemObject.authorAvatar) : 'default';
        _NFTItem.authorAddress = itemObject.royaltyOwner;
        _NFTItem.holder = itemObject2.tokenOwner;
        _NFTItem.holderName =
            _NFTItem.holder === _NFTItem.authorAddress
                ? _NFTItem.author
                : itemObject.holderName
                ? itemObject.holderName
                : reduceHexAddress(_NFTItem.holder, 4);
        _NFTItem.orderId = itemObject.order.orderId + '';
        _NFTItem.tokenIdHex = itemObject2.tokenIdHex;
        _NFTItem.royalties = itemObject.royaltyFee / 1e4;
        _NFTItem.category = itemObject.category;
        _NFTItem.timestamp = parseInt(itemObject.createTime) * 1000;
        const createTime = getTime(itemObject.createTime);
        _NFTItem.createTime = `${createTime.date} ${createTime.time}`;
        _NFTItem.endTimestamp = itemObject.order.endTime ? itemObject.order.endTime * 1000 : 0;
        if (itemObject.order.endTime) {
            const endTime = getTime(itemObject.order.endTime.toString());
            _NFTItem.endTime = `${endTime.date} ${endTime.time}`;
        } else _NFTItem.endTime = ' ';
        _NFTItem.isExpired = new Date().getTime() > _NFTItem.endTimestamp;
        _NFTItem.isBlindbox = itemObject.order?.isBlindBox;
    }
    return _NFTItem;
};

// BB sold product
export const getNFTItems = async (tokenIds: string | undefined) => {
    const resNFTItems = await fetch(`${serverConfig.metServiceUrl}/api/v1/getTokenByIds`, {
        method: 'POST',
        ...FETCH_CONFIG_JSON,
        body: JSON.stringify(tokenIds?.split(',')),
    });
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

// export const getNFTLatestTxs = async (
//     tokenId: string | undefined,
//     address: string,
//     pageNum: number,
//     pageSize: number,
//     sortBy?: string,
// ) => {
//     let fetchUrl = `${serverConfig.assistServiceUrl}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${tokenId}&pageNum=${pageNum}&pageSize=${pageSize}`;
//     switch (sortBy) {
//         case 'low_to_high':
//             fetchUrl += `&orderType=price_l_to_h`;
//             break;
//         case 'high_to_low':
//             fetchUrl += `&orderType=price_h_to_l`;
//             break;
//         case 'most_recent':
//             fetchUrl += `&orderType=mostrecent`;
//             break;
//         case 'oldest':
//             fetchUrl += `&orderType=oldest`;
//             break;
//         default:
//             fetchUrl += `&orderType=mostrecent`;
//             break;
//     }
//     const resNFTTxs = await fetch(fetchUrl, FETCH_CONFIG_JSON);
//     const jsonNFTTxs = await resNFTTxs.json();
//     const arrNFTTxs = jsonNFTTxs.data;

//     const _NFTTxList: Array<TypeNFTTransaction> = [];
//     const _NFTTxHistoryList: Array<TypeNFTHisotry> = [];
//     for (let i = 0; i < arrNFTTxs.length; i++) {
//         const itemObject: TypeNFTTransactionFetch = arrNFTTxs[i];
//         if (itemObject.event === 'Transfer') continue;
//         const _NFTTx: TypeNFTTransaction = { ...blankNFTTxs };
//         switch (itemObject.event) {
//             case 'Mint':
//                 _NFTTx.type = enumTransactionType.CreatedBy;
//                 _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
//                 break;
//             case 'CreateOrderForSale':
//                 _NFTTx.type = enumTransactionType.ForSale;
//                 _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
//                 break;
//             case 'CreateOrderForAuction':
//                 _NFTTx.type = enumTransactionType.OnAuction;
//                 _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
//                 break;
//             case 'BidOrder':
//                 _NFTTx.type = enumTransactionType.Bid;
//                 _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
//                 break;
//             case 'ChangeOrderPrice':
//                 _NFTTx.type = enumTransactionType.PriceChanged;
//                 _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
//                 break;
//             case 'CancelOrder':
//                 _NFTTx.type = enumTransactionType.SaleCanceled;
//                 _NFTTx.user = itemObject.fromName ? itemObject.fromName : reduceHexAddress(itemObject.from, 4);
//                 break;
//             case 'BuyOrder':
//                 _NFTTx.type = enumTransactionType.SoldTo;
//                 _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
//                 break;
//             // case 'Transfer':
//             //     _NFTTx.type = enumTransactionType.Transfer;
//             //     break;
//             case 'SettleBidOrder':
//                 _NFTTx.type = enumTransactionType.SettleBidOrder;
//                 _NFTTx.user = itemObject.toName ? itemObject.toName : reduceHexAddress(itemObject.to, 4);
//                 break;
//         }
//         _NFTTx.price = parseInt(itemObject.price) / 1e18;
//         _NFTTx.txHash = itemObject.tHash;
//         const timestamp = getTime(itemObject.timestamp.toString());
//         _NFTTx.time = timestamp.date + ' ' + timestamp.time;
//         _NFTTxList.push(_NFTTx);
//         // for my nft history
//         if (address !== '' && (itemObject.event === 'Mint' || itemObject.event === 'BuyOrder')) {
//             const _NFTTxHistory: TypeNFTHisotry = { ...blankMyNFTHistory };
//             _NFTTxHistory.type =
//                 itemObject.event === 'Mint' ? 'Created' : itemObject.to === address ? 'Bought From' : 'Sold To';
//             _NFTTxHistory.price = parseInt(itemObject.price) / 1e18;
//             _NFTTxHistory.user =
//                 _NFTTxHistory.type === 'Bought From'
//                     ? itemObject.fromName
//                         ? itemObject.fromName
//                         : reduceHexAddress(itemObject.from, 4)
//                     : itemObject.toName
//                     ? itemObject.toName
//                     : reduceHexAddress(itemObject.to, 4);
//             const prodTransTimestamp = getTime(itemObject.timestamp.toString());
//             _NFTTxHistory.time = prodTransTimestamp.date + ' ' + prodTransTimestamp.time;
//             if (itemObject.event === 'BuyOrder')
//                 _NFTTxHistory.saleType =
//                     arrNFTTxs[i + 1].event === 'CreateOrderForSale'
//                         ? enumTransactionType.ForSale
//                         : enumTransactionType.OnAuction;
//             _NFTTxHistory.txHash = itemObject.tHash;
//             _NFTTxHistoryList.push(_NFTTxHistory);
//         }
//     }
//     return { txs: _NFTTxList, history: _NFTTxHistoryList };
// };

export const getNFTLatestTxs = async (tokenId: string | undefined) => {
    let fetchUrl = `${serverConfig.assistServiceUrl}/api/v1/getTransHistoryByTokenId?tokenId=${tokenId}`;

    const resNFTTxs = await fetch(fetchUrl, FETCH_CONFIG_JSON);
    const jsonNFTTxs = await resNFTTxs.json();
    const arrNFTTxs = jsonNFTTxs.data;

    const _NFTTxList: Array<TypeNFTTransaction> = [];
    for (let i = 0; i < arrNFTTxs.length; i++) {
        const itemObject: TypeNFTTransactionFetch = arrNFTTxs[i];
        const events = itemObject.events;
        const events2 = events.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        for (let j = 0; j < events2.length; j++) {
            const _NFTTx: TypeNFTTransaction = { ...blankNFTTxs };
            const event = events2[j];
            if (event.eventType === 0 || event.eventType === 2) {
                _NFTTx.type = itemObject.orderType === 1 ? enumTransactionType.ForSale : enumTransactionType.OnAuction;
                _NFTTx.user = itemObject.sellerInfo?.name
                    ? itemObject.sellerInfo.name
                    : reduceHexAddress(itemObject.sellerAddr, 4);
            } else if (event.eventType === 1) {
                _NFTTx.type = enumTransactionType.Bid;
                _NFTTx.user = reduceHexAddress(itemObject.events[j].buyer, 4);
            } else if (event.eventType === 3) {
                _NFTTx.type =
                    itemObject.orderType === 1 ? enumTransactionType.SoldTo : enumTransactionType.SettleBidOrder;
                _NFTTx.user = reduceHexAddress(event.buyer, 4);
            } else if (event.eventType === 4) {
                _NFTTx.type = enumTransactionType.SaleCanceled;
                _NFTTx.user = itemObject.sellerInfo?.name
                    ? itemObject.sellerInfo.name
                    : reduceHexAddress(itemObject.sellerAddr, 4);
            } else if (event.eventType === 5) {
                _NFTTx.type = enumTransactionType.PriceChanged;
                _NFTTx.user = itemObject.sellerInfo?.name
                    ? itemObject.sellerInfo.name
                    : reduceHexAddress(itemObject.sellerAddr, 4);
            } else if (event.eventType === 6) {
                _NFTTx.type = enumTransactionType.SaleCanceled;
                _NFTTx.user = itemObject.sellerInfo?.name
                    ? itemObject.sellerInfo.name
                    : reduceHexAddress(itemObject.sellerAddr, 4);
            }

            _NFTTx.saleType = itemObject.orderType === 1 ? enumTransactionType.ForSale : enumTransactionType.OnAuction;
            _NFTTx.price = (event.price ? event.price : event.newPrice ? event.newPrice : event.minPrice) / 1e18;
            _NFTTx.txHash = event.transactionHash;
            const timestamp = getTime(event.timestamp.toString());
            _NFTTx.time = timestamp.date + ' ' + timestamp.time;
            _NFTTxList.push(_NFTTx);
        }
    }
    return _NFTTxList;
};

export const getNFTLatestBids = async (
    tokenId: string | undefined,
    userAddress: string,
    pageNum: number,
    pageSize: number,
) => {
    const fetchUrl = `${serverConfig.assistServiceUrl}/api/v1/getLatestBids`;
    const body = { tokenId, pageNum, pageSize };
    const resNFTBids = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
            ...FETCH_CONFIG_JSON.headers,
        },
        body: JSON.stringify(body),
    });
    const jsonNFTBids = await resNFTBids.json();
    const arrNFTBids = jsonNFTBids.data;

    const _NFTBidList: Array<TypeSingleNFTBid> = [];
    const _myNFTBidList: Array<TypeSingleNFTBid> = [];
    if (arrNFTBids && arrNFTBids.data) {
        for (let i = 0; i < arrNFTBids.data.length; i++) {
            const itemObject: TypeSingleNFTBidFetch = arrNFTBids.data[i];
            const _NFTBid: TypeSingleNFTBid = { ...blankNFTBid };
            _NFTBid.user = itemObject.buyerName ? itemObject.buyerName : reduceHexAddress(itemObject.buyer, 4);
            _NFTBid.address = itemObject.buyer;
            _NFTBid.price = parseFloat(itemObject.price) / 1e18;
            _NFTBid.orderId = itemObject.orderId;
            const timestamp = getTime(itemObject.timestamp);
            _NFTBid.time = `${timestamp.date} ${timestamp.time}`;
            if (userAddress && _myNFTBidList.length === 0 && userAddress === _NFTBid.address)
                _myNFTBidList.push(_NFTBid);
            _NFTBidList.push(_NFTBid);
        }
    }
    return { mine: _myNFTBidList, all: _NFTBidList };
};

// BlindBoxProduct Page
export const getBBItem = async (blindBoxId: string | undefined, ELA2USD: number) => {
    const resBBItem = await fetch(
        `${serverConfig.metServiceUrl}/api/v1/getBlindBoxById?id=${blindBoxId}`,
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
        _BBItem.likes = itemObject.likes ? itemObject.likes : 0;
        _BBItem.views = itemObject.views ? itemObject.views : 0;
        _BBItem.author = itemObject.createdName ? itemObject.createdName : reduceHexAddress(itemObject.seller, 4);
        _BBItem.royaltyOwner = itemObject.seller;
        _BBItem.authorDescription = itemObject.createdDescription ? itemObject.createdDescription : '';
        _BBItem.authorImg = itemObject.createdAvatar ? getImageFromAsset(itemObject.createdAvatar) : 'default';
        _BBItem.description = itemObject.description;
        _BBItem.instock = itemObject.tokenIds.length || 0;
        _BBItem.sold = itemObject.soldTokenIds?.length || 0;
        if (itemObject.saleBegin) {
            const saleBegin = getTime(itemObject.saleBegin);
            _BBItem.endTime = `${saleBegin.date} ${saleBegin.time}`;
        } else _BBItem.endTime = '';
        _BBItem.maxPurchases = parseInt(itemObject.maxPurchase);
        _BBItem.maxQuantity = parseInt(itemObject.maxQuantity);
        _BBItem.soldIds = itemObject.soldTokenIds;
    }
    return _BBItem;
};

// Profile Page
export const getMyNFTItemList = async (
    fetchParams: string,
    ELA2USD: number,
    likeList: Array<String>,
    nTabId: number,
    walletAddress: string,
    token: string,
) => {
    const fetchUrl = `${serverConfig.metServiceUrl}/api/v1/${fetchMyNFTAPIs[nTabId]}`;
    const resMyNFTList = await fetch(fetchUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers },
        body: fetchParams,
    });
    const jsonMyNFTList = await resMyNFTList.json();
    const totalCount: number = jsonMyNFTList.data.total;
    let hideCount: number = 0;
    const arrMyNFTList = jsonMyNFTList.data ? jsonMyNFTList.data.data : [];
    const _arrMyNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrMyNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrMyNFTList[i];
        const _myNFT: TypeProduct = { ...blankMyNFTItem };
        _myNFT.types = [];
        if (nTabId === 0 || nTabId === 1 || nTabId === 2) {
            _myNFT.tokenId = itemObject.tokenId;
            _myNFT.name = itemObject.name;
            _myNFT.image = itemObject.thumbnail ? getImageFromAsset(itemObject.thumbnail) : '';
            _myNFT.price_ela = itemObject.order?.orderPrice ? itemObject.order?.orderPrice / 1e18 : 0;
            _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
            _myNFT.author = reduceHexAddress(itemObject.royaltyOwner, 4);
            _myNFT.likes = itemObject.likes ? itemObject.likes : 0;
            _myNFT.views = itemObject.views ? itemObject.views : 0;
            _myNFT.royaltyOwner = itemObject.royaltyOwner;
            _myNFT.holder = itemObject.order
                ? itemObject.order.orderState === 2
                    ? itemObject.order.buyer
                    : itemObject.order.seller
                : _myNFT.royaltyOwner;
            _myNFT.endTime = itemObject.order?.endTime ? itemObject.order?.endTime.toString() : '0';
            if (itemObject.order) {
                if (itemObject.order.orderType === 1 && itemObject.order.orderState === 1)
                    _myNFT.status = '1'; // buynow
                else if (itemObject.order.orderType === 2 && itemObject.order.orderState === 1)
                    _myNFT.status = '2'; // auction
                else _myNFT.status = '0';
            } else _myNFT.status = '0';
            _myNFT.isBlindbox = itemObject.order?.isBlindBox && _myNFT.status === '1';
        } else if (nTabId === 3) {
            _myNFT.tokenId = itemObject.tokenId;
            _myNFT.name = itemObject.token.name;
            _myNFT.image = itemObject.token.thumbnail ? getImageFromAsset(itemObject.token.thumbnail) : '';
            _myNFT.price_ela = itemObject.orderPrice / 1e18;
            _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
            _myNFT.author = reduceHexAddress(itemObject.token.royaltyOwner, 4);
            _myNFT.likes = itemObject.likes ? itemObject.likes : 0;
            _myNFT.views = itemObject.views ? itemObject.views : 0;
            _myNFT.royaltyOwner = itemObject.token.royaltyOwner;
            _myNFT.holder = itemObject.orderState === 2 ? itemObject.buyer : itemObject.seller;
            _myNFT.endTime = itemObject.endTime ? itemObject.endTime.toString() : '0';
            if (itemObject.order.orderType === 1 && itemObject.order.orderState === 1) _myNFT.status = '1'; // buynow
            else if (itemObject.order.orderType === 2 && itemObject.order.orderState === 1)
                _myNFT.status = '2'; // auction
            else _myNFT.status = '0';
            _myNFT.isBlindbox = itemObject.isBlindBox && _myNFT.status === '1';
        } else {
            _myNFT.tokenId = itemObject.tokenId;
            _myNFT.name = itemObject.token.name;
            _myNFT.image = itemObject.token.thumbnail ? getImageFromAsset(itemObject.token.thumbnail) : '';
            _myNFT.price_ela = itemObject.order?.orderPrice ? itemObject.order?.orderPrice / 1e18 : 0;
            _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
            _myNFT.author = reduceHexAddress(itemObject.token.royaltyOwner, 4);
            _myNFT.likes = itemObject.likes ? itemObject.likes : 0;
            _myNFT.views = itemObject.views ? itemObject.views : 0;
            _myNFT.royaltyOwner = itemObject.token.royaltyOwner;
            _myNFT.holder = itemObject.order
                ? itemObject.order.orderState === 2
                    ? itemObject.order.buyer
                    : itemObject.order.seller
                : _myNFT.royaltyOwner;
            _myNFT.endTime = itemObject.order?.endTime ? itemObject.order?.endTime.toString() : '0';
            if (itemObject.order) {
                if (itemObject.order.orderType === 1 && itemObject.order.orderState === 1)
                    _myNFT.status = '1'; // buynow
                else if (itemObject.order.orderType === 2 && itemObject.order.orderState === 1)
                    _myNFT.status = '2'; // auction
                else _myNFT.status = '0';
            } else _myNFT.status = '0';
            _myNFT.isBlindbox = itemObject.order?.isBlindBox && _myNFT.status === '1';
        }
        // NFT label
        if (nTabId === 0 || nTabId === 5) {
            _myNFT.types.push(_myNFT.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased);
            if (_myNFT.holder === walletAddress) {
                if (_myNFT.status === '1') _myNFT.types.push(enumMyNFTType.BuyNow);
                else if (_myNFT.status === '2') _myNFT.types.push(enumMyNFTType.OnAuction);
            } else {
                _myNFT.types.push(enumMyNFTType.Sold);
            }
        } else if (nTabId === 1) {
            _myNFT.types.push(_myNFT.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased);
            if (_myNFT.status === '1') _myNFT.types.push(enumMyNFTType.BuyNow);
            else if (_myNFT.status === '2') _myNFT.types.push(enumMyNFTType.OnAuction);
        } else if (nTabId === 2) {
            if (_myNFT.holder === walletAddress) {
                _myNFT.types.push(enumMyNFTType.Created);
                if (_myNFT.status === '1') _myNFT.types.push(enumMyNFTType.BuyNow);
                else if (_myNFT.status === '2') _myNFT.types.push(enumMyNFTType.OnAuction);
            } else {
                if (_myNFT.status === '0') {
                    _myNFT.types.push(enumMyNFTType.Created);
                    _myNFT.types.push(enumMyNFTType.Sold);
                } else {
                    _myNFT.types.push(enumMyNFTType.Sold);
                    if (_myNFT.status === '1') _myNFT.types.push(enumMyNFTType.BuyNow);
                    else if (_myNFT.status === '2') _myNFT.types.push(enumMyNFTType.OnAuction);
                }
            }
        } else if (nTabId === 3) {
            _myNFT.types.push(_myNFT.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased);
            if (_myNFT.status === '1') _myNFT.types.push(enumMyNFTType.BuyNow);
            else if (_myNFT.status === '2') _myNFT.types.push(enumMyNFTType.OnAuction);
        } else if (nTabId === 4) {
            _myNFT.types.push(enumMyNFTType.Sold);
            if (_myNFT.status === '1') _myNFT.types.push(enumMyNFTType.BuyNow);
            else if (_myNFT.status === '2') _myNFT.types.push(enumMyNFTType.OnAuction);
        }
        // set type to navigate to detail page
        if (_myNFT.holder !== walletAddress) {
            _myNFT.type = enumMyNFTType.Sold;
            _myNFT.price_ela = 0;
            _myNFT.price_usd = 0;
        } else {
            if (_myNFT.isBlindbox) {
                _myNFT.type = enumMyNFTType.BuyNow;
                _myNFT.types = [enumMyNFTType.InBindBox];
            } else {
                if (_myNFT.status === '0') {
                    _myNFT.type =
                        _myNFT.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased;
                    _myNFT.price_ela = 0;
                    _myNFT.price_usd = 0;
                } else if (_myNFT.status === '1') _myNFT.type = enumMyNFTType.BuyNow;
                else _myNFT.type = enumMyNFTType.OnAuction;
            }
        }
        _myNFT.isLike = nTabId === 5 ? true : likeList.includes(itemObject.tokenId);
        // Hide unnecessary NFTs (1. deleted NFTs, 2. regained NFTs on sold tab)
        if (itemObject.holder === addressZero || (nTabId === 4 && _myNFT.holder === walletAddress)) {
            hideCount++;
            continue;
        }
        _arrMyNFTList.push(_myNFT);
    }
    return { total: totalCount - hideCount, data: _arrMyNFTList };
};

export const getMyTotalEarned = async (address: string) => {
    try {
        const resTotalEarnedResult = await fetch(
            `${serverConfig.assistServiceUrl}/api/v1/getEarnedByAddress?address=${address}`,
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
            `${serverConfig.assistServiceUrl}/api/v1/getTodayEarnedByAddress?address=${address}`,
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
        `${serverConfig.assistServiceUrl}/api/v1/getEarnedListByAddress?address=${address}`,
        FETCH_CONFIG_JSON,
    );
    const jsonEarnedList = await resEarnedList.json();
    const arrEarnedList = jsonEarnedList === undefined ? [] : jsonEarnedList.data;

    const _myEarningList: Array<TypeYourEarning> = [];
    for (let i = 0; i < arrEarnedList.length; i++) {
        const itemObject: TypeYourEarningFetch = arrEarnedList[i];
        const _myEarning: TypeYourEarning = { ...blankMyEarning };

        let earn = 0;
        const badges: enumBadgeType[] = [];
        if (itemObject.royaltyOwner === address) {
            badges.push(enumBadgeType.Royalties);
            if (itemObject.sellerAddr === address) {
                badges.push(enumBadgeType.Sale);
                earn = itemObject.filled - itemObject.platformFee;
            } else {
                earn = itemObject.royaltyFee;
            }
        } else {
            badges.push(enumBadgeType.Sale);
            earn = itemObject.filled - itemObject.royaltyFee - itemObject.platformFee;
        }

        // _earning.tokenId = itemObject.tokenId;
        _myEarning.title = itemObject.token.name;
        _myEarning.avatar = getImageFromAsset(itemObject.token.data.thumbnail);
        _myEarning.price = earn / 1e18;
        const timestamp = getTime(itemObject.updateTime);
        _myEarning.time = timestamp.date + ' ' + timestamp.time;
        _myEarning.badges = badges;
        _myEarningList.push(_myEarning);
    }
    return _myEarningList;
};

// MyNFT Page
export const getMyNFTItem = async (tokenId: string | undefined) => {
    const resMyNFTItem = await fetch(
        `${serverConfig.assistServiceUrl}/api/v1/getTokenOrderByTokenId?tokenId=${tokenId}`,
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
        _MyNFTItem.authorImg = itemObject.authorAvatar ? getImageFromAsset(itemObject.authorAvatar) : 'default'; // no author avatar
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
        _MyNFTItem.txHash = itemObject.tokenEvent?.transactionHash ? itemObject.tokenEvent?.transactionHash : '';

        if (itemObject.order) {
            _MyNFTItem.orderId = itemObject.order.orderId.toString();
            if (itemObject.order.orderType === 1 && itemObject.order.orderState === 1)
                _MyNFTItem.status = '1'; // buynow
            else if (itemObject.order.orderType === 2 && itemObject.order.orderState === 1)
                _MyNFTItem.status = '2'; // auction
            else _MyNFTItem.status = '0';
            _MyNFTItem.isBlindbox = itemObject.order.isBlindBox && _MyNFTItem.status === '1';
            _MyNFTItem.price_ela = _MyNFTItem.status === '0' ? 0 : itemObject.order.price / 1e18;
            if (itemObject.order.endTime) {
                const endTime = getTime(itemObject.order.endTime.toString());
                _MyNFTItem.endTime = endTime.date + ' ' + endTime.time;
            } else _MyNFTItem.endTime = '0';
            _MyNFTItem.isExpired = Math.round(new Date().getTime() / 1000) > itemObject.order.endTime;
            _MyNFTItem.bids = itemObject.order.bids;
            if (itemObject.order.bids > 0) {
                if (itemObject.order.orderState === 2) {
                    _MyNFTItem.buyer = itemObject.order.buyerAddr;
                }
            }
        } else _MyNFTItem.status = '0';
    }
    return _MyNFTItem;
};

// BB creation
export const getBBCandiatesList = async (address: string, keyword: string, token: string) => {
    const resBBCandidateList = await fetch(
        `${serverConfig.metServiceUrl}/api/v1/getUserCandidateTokens?address=${address}&keyword=${keyword}`,
        {
            headers: { Authorization: `Bearer ${token}`, ...FETCH_CONFIG_JSON.headers },
        },
    );
    const jsonBBCandidateList = await resBBCandidateList.json();
    return jsonBBCandidateList.status === 200 ? jsonBBCandidateList.data : [];
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
        _BBCandidate.nftIdentity = '0x' + BigInt(itemObject.tokenId).toString(16);
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
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/updateUserProfile`;
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
                Authorization: `Bearer ${_token}`,
            },
            body: JSON.stringify(reqBody),
        })
            .then((response) => response.json())
            .then((data) => {
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
    let url = `${serverConfig.assistServiceUrl}/admin/api/v1/listMarketTokens?${fetchParams}`;
    if (keyWord !== '') url += `&keyword=${keyWord}`;
    const resAdminNFTList = await fetch(url, FETCH_CONFIG_JSON);
    const jsonAdminNFTList = await resAdminNFTList.json();
    const totalCount = jsonAdminNFTList.data === undefined ? 0 : jsonAdminNFTList.data.total;
    const arrAdminNFTList = jsonAdminNFTList.data === undefined ? [] : jsonAdminNFTList.data.result;
    const _arrAdminNFTList: Array<AdminNFTItemType> = [];
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
    return { totalCount: totalCount, arrAdminNFTList: _arrAdminNFTList };
};

export const getAdminUserList = async (keyWord: string, fetchParams: string, role: number, token: string) => {
    let url = `${serverConfig.metServiceUrl}/api/v1/admin/listAddress?${fetchParams}`;
    if (keyWord !== '') url += `&keyword=${keyWord}`;
    url += `&type=${role}`;
    const resAdminUserList = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const jsonAdminUserList = await resAdminUserList.json();
    const totalCount = jsonAdminUserList.data.total;
    const arrAdminUserList = jsonAdminUserList.data.data === undefined ? [] : jsonAdminUserList.data.data;
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

    return { result: 0, totalCount: totalCount, data: _arrAdminUserList };
};

export const updateUserRole = (_token: string, _address: string, _role: number, _remarks: string) =>
    new Promise((resolve: (value: boolean) => void, reject: (value: string) => void) => {
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/admin/updateRole`;
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

export const getAdminBannerList = async (pageNum: number, pageSize: number, token: string) => {
    let url = `${serverConfig.metServiceUrl}/api/v1/admin/listBanner?pageNum=${pageNum}&pageSize=${pageSize}`;

    const resAdminBannerList = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const jsonAdminBannerList = await resAdminBannerList.json();
    const totalCount = jsonAdminBannerList.data.total;
    const arrAdminBannerList = jsonAdminBannerList.data.data === undefined ? [] : jsonAdminBannerList.data.data;

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
    return { totalCount: totalCount, data: _arrAdminBannerList };
};

export const addAdminBanner = (token: string, image: string, location: number, status: number, sort: number) =>
    new Promise((resolve: (value: number) => void, reject: (value: string) => void) => {
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/admin/createBanner`;
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
                Authorization: `Bearer ${token}`,
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
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/admin/updateBanner`;
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
                Authorization: `Bearer ${token}`,
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
        const reqUrl = `${serverConfig.metServiceUrl}/api/v1/admin/deleteBanner`;
        const reqBody = {
            token: token,
            id: id.toString(),
        };
        fetch(reqUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
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
