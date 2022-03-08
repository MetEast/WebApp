import {
    TypeProduct,
    enumSingleNFTType,
    TypeProductFetch,
    TypeFavouritesFetch,
    TypeBlindListLikes,
    TypeNFTTransaction,
    TypeNFTTransactionFetch,
    TypeSingleNFTBid,
    TypeSingleNFTBidFetch,
    enumTransactionType,
    enumBlindBoxNFTType,
} from 'src/types/product-types';
import { getImageFromAsset, reduceHexAddress, getTime, getUTCTime } from 'src/services/common';
import { blankNFTItem, blankNFTTxs, blankNFTBid, blankBBItem } from 'src/constants/init-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import jwt from 'jsonwebtoken';

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
export const getSearchParams = (
    keyWord: string,
    sortBy: TypeSelectItem | undefined,
    filterRange: TypeFilterRange,
    filters: Array<enumFilterOption>,
) => {
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

// Blind Box Page
export const getBBItemList = async (fetchParams: string, ELA2USD: number, loginState: boolean, did: string) => {
    const resBBList = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/SearchBlindBox?${fetchParams}`,
        FETCH_CONFIG_JSON,
    );
    const jsonBBList = await resBBList.json();
    const arrBBList = jsonBBList.data === undefined ? [] : jsonBBList.data.result;

    let _arrBBList: Array<TypeProduct> = [];
    for (let i = 0; i < arrBBList.length; i++) {
        const itemObject: TypeProductFetch = arrBBList[i];
        let _BBItem: TypeProduct = { ...blankBBItem };
        _BBItem.tokenId = itemObject.blindBoxIndex.toString();
        _BBItem.name = itemObject.name;
        _BBItem.image = getImageFromAsset(itemObject.asset);
        _BBItem.price_ela = parseInt(itemObject.blindPrice);
        _BBItem.price_usd = _BBItem.price_ela * ELA2USD;
        // blindboxItem.author = itemObject.authorName || ' ';
        let curTimestamp = new Date().getTime() / 1000;
        _BBItem.type =
            itemObject.instock === itemObject.sold
                ? enumBlindBoxNFTType.SoldOut
                : parseInt(itemObject.saleBegin) > curTimestamp
                ? enumBlindBoxNFTType.ComingSoon
                : parseInt(itemObject.saleEnd) >= curTimestamp
                ? enumBlindBoxNFTType.SaleEnds
                : enumBlindBoxNFTType.SaleEnded;
        _BBItem.likes = itemObject.likes;
        _BBItem.views = itemObject.views;
        _BBItem.author = itemObject.createdName === '' ? reduceHexAddress(itemObject.createdAddress, 4) : itemObject.createdName;
        _BBItem.royaltyOwner = itemObject.createdAddress;
        _BBItem.isLike = loginState
            ? itemObject.list_likes.findIndex((value: TypeBlindListLikes) => value.did === `did:elastos:${did}`) === -1
                ? false
                : true
            : false;
        _BBItem.sold = itemObject.sold || 0;
        _BBItem.instock = itemObject.instock || 0;
        if (itemObject.saleEnd) {
            const endTime = getTime(itemObject.saleEnd); // no proper value
            _BBItem.endTime = endTime.date + ' ' + endTime.time;
        } else {
            _BBItem.endTime = '';
        }
        _arrBBList.push(_BBItem);
    }
    return _arrBBList;
};

// SingleNFTFixedPrice & SingleNFTAuction
export const getNFTItem = async (
    tokenId: string | undefined,
    ELA2USD: number,
    likeList: Array<TypeFavouritesFetch>,
) => {
    const resNFTItem = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${tokenId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTItem = await resNFTItem.json();
    const itemObject: TypeProductFetch = jsonNFTItem.data;
    const _NFTItem: TypeProduct = { ...blankNFTItem };
    if (itemObject !== undefined) {
        _NFTItem.tokenId = itemObject.tokenId;
        _NFTItem.name = itemObject.name;
        _NFTItem.image = getImageFromAsset(itemObject.asset);
        _NFTItem.price_ela = itemObject.price / 1e18;
        _NFTItem.price_usd = _NFTItem.price_ela * ELA2USD;
        _NFTItem.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
        _NFTItem.likes = itemObject.likes;
        _NFTItem.views = itemObject.views;
        _NFTItem.isLike =
            likeList.findIndex((value: TypeFavouritesFetch) => value.tokenId === itemObject.tokenId) === -1
                ? false
                : true;
        _NFTItem.description = itemObject.description;
        _NFTItem.author =
            itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
        _NFTItem.authorDescription = itemObject.authorDescription || ' ';
        _NFTItem.authorImg = _NFTItem.image; // -- no proper value
        _NFTItem.authorAddress = itemObject.royaltyOwner;
        _NFTItem.holder = itemObject.holder;
        _NFTItem.holderName = itemObject.holderName === '' ? itemObject.authorName : itemObject.holderName;
        _NFTItem.orderId = itemObject.orderId;
        _NFTItem.tokenIdHex = itemObject.tokenIdHex;
        _NFTItem.royalties = parseInt(itemObject.royalties) / 1e4;
        _NFTItem.category = itemObject.category;
        const createTime = getUTCTime(itemObject.createTime);
        _NFTItem.createTime = createTime.date + '' + createTime.time;
        _NFTItem.status = itemObject.status;
        if (itemObject.endTime) {
            const endTime = getTime(itemObject.endTime); // no proper value
            _NFTItem.endTime = endTime.date + ' ' + endTime.time;
        } else {
            _NFTItem.endTime = ' ';
        }
        _NFTItem.isExpired = Math.round(new Date().getTime() / 1000) > parseInt(itemObject.endTime);
        _NFTItem.isBlindbox = itemObject.isBlindbox;
    }
    return _NFTItem;
};

export const getNFTLatestTxs = async (tokenId: string | undefined, pageNum: number, pageSize: number) => {
    const resNFTTxs = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${tokenId}&pageNum=${pageNum}&$pageSize=${pageSize}&timeOrder=-1`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTTxs = await resNFTTxs.json();
    const arrNFTTxs = jsonNFTTxs.data;

    let _NFTTxList: Array<TypeNFTTransaction> = [];
    for (let i = 0; i < arrNFTTxs.length; i++) {
        const itemObject: TypeNFTTransactionFetch = arrNFTTxs[i];
        if (itemObject.event === 'Transfer') continue;
        const _NFTTx: TypeNFTTransaction = { ...blankNFTTxs };
        switch (itemObject.event) {
            case 'Mint':
                _NFTTx.type = enumTransactionType.CreatedBy;
                _NFTTx.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                break;
            case 'CreateOrderForSale':
                _NFTTx.type = enumTransactionType.ForSale;
                _NFTTx.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                break;
            case 'CreateOrderForAuction':
                _NFTTx.type = enumTransactionType.OnAuction;
                _NFTTx.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                break;
            case 'BidOrder':
                _NFTTx.type = enumTransactionType.Bid;
                _NFTTx.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                break;
            case 'ChangeOrderPrice':
                _NFTTx.type = enumTransactionType.PriceChanged;
                _NFTTx.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                break;
            case 'CancelOrder':
                _NFTTx.type = enumTransactionType.SaleCanceled;
                _NFTTx.user = itemObject.fromName === '' ? reduceHexAddress(itemObject.from, 4) : itemObject.fromName;
                break;
            case 'BuyOrder':
                _NFTTx.type = enumTransactionType.SoldTo;
                _NFTTx.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                break;
            // case 'Transfer':
            //     _NFTTx.type = enumTransactionType.Transfer;
            //     break;
            case 'SettleBidOrder':
                _NFTTx.type = enumTransactionType.SettleBidOrder;
                _NFTTx.user = itemObject.toName === '' ? reduceHexAddress(itemObject.to, 4) : itemObject.toName;
                break;
        }
        _NFTTx.price = parseInt(itemObject.price) / 1e18;
        _NFTTx.txHash = itemObject.tHash;
        const timestamp = getTime(itemObject.timestamp.toString());
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
) => {
    const resNFTBids = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getLatestBids?tokenId=${tokenId}&address=${userAddress}&pageNum=${pageNum}&$pageSize=${pageSize}&timeOrder=-1`,
        FETCH_CONFIG_JSON,
    );
    const jsonNFTBids = await resNFTBids.json();
    const arrNFTBids = jsonNFTBids.data;

    let _otherNFTBidList: Array<TypeSingleNFTBid> = [];
    if (arrNFTBids !== undefined && arrNFTBids.others !== undefined) {
        for (let i = 0; i < arrNFTBids.others.length; i++) {
            const itemObject: TypeSingleNFTBidFetch = arrNFTBids.others[i];
            const _otherNFTBid: TypeSingleNFTBid = { ...blankNFTBid };
            _otherNFTBid.user =
                itemObject.buyerName === '' ? reduceHexAddress(itemObject.buyerAddr, 4) : itemObject.buyerName;
            _otherNFTBid.price = parseFloat(itemObject.price) / 1e18;
            _otherNFTBid.orderId = itemObject.orderId;
            const timestamp = getTime(itemObject.timestamp);
            _otherNFTBid.time = timestamp.date + ' ' + timestamp.time;
            _otherNFTBidList.push(_otherNFTBid);
        }
    }

    let _myNFTBidList: Array<TypeSingleNFTBid> = [];
    if (arrNFTBids !== undefined && arrNFTBids.yours !== undefined) {
        for (let i = 0; i < arrNFTBids.yours.length; i++) {
            const itemObject: TypeSingleNFTBidFetch = arrNFTBids.yours[i];
            const _myNFTBid: TypeSingleNFTBid = { ...blankNFTBid };
            _myNFTBid.user =
                itemObject.buyerName === '' ? reduceHexAddress(itemObject.buyerAddr, 4) : itemObject.buyerName;
            _myNFTBid.price = parseFloat(itemObject.price) / 1e18;
            _myNFTBid.orderId = itemObject.orderId;
            const timestamp = getTime(itemObject.timestamp);
            _myNFTBid.time = timestamp.date + ' ' + timestamp.time;
            _myNFTBidList.push(_myNFTBid);
        }
    }
    return { mine: _myNFTBidList, others: _otherNFTBidList };
};

// MyNFT Created

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
        if (dataTotalEarnedResult && dataTotalEarnedResult.data)
            return parseFloat(dataTotalEarnedResult.data).toFixed(2);
        return '0';
    } catch (error) {
        return '0';
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
        if (dataTodayEarnedResult && dataTodayEarnedResult.data)
            return parseFloat(dataTodayEarnedResult.data).toFixed(2);
        return '0';
    } catch (error) {
        return '0';
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
        const jsonProfile = {
            did: did,
            name: name,
            description: description,
            avatar: _urlAvatar,
            coverImage: _urlCoverImage,
        };
        const signedProfile = jwt.sign(jsonProfile, 'config.Auth.jwtSecret', { expiresIn: 60 * 60 * 24 * 7 });
        const reqBody = {
            token: token,
            profile: signedProfile,
        };
        // const reqBody = {
        //     token: token,
        //     did: did,
        //     name: name,
        //     description: description,
        //     avatar: _urlAvatar,
        //     coverImage: _urlCoverImage,
        // };
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
