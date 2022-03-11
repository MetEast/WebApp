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
    TypeYourEarning,
    TypeYourEarningFetch,
    TypeNFTHisotry,
    TypeBlindBoxSelectItem,
    enumTransactionType,
    enumBlindBoxNFTType,
    enumMyNFTType,
    enumBadgeType,
} from 'src/types/product-types';
import { getImageFromAsset, reduceHexAddress, getTime, getUTCTime } from 'src/services/common';
import {
    blankNFTItem,
    blankNFTTxs,
    blankNFTBid,
    blankBBItem,
    blankMyNFTItem,
    blankMyEarning,
    blankMyNFTHistory,
    blankBBCandidate,
} from 'src/constants/init-constants';
import { TypeSelectItem } from 'src/types/select-types';
import { enumFilterOption, TypeFilterRange } from 'src/types/filter-types';
import jwt from 'jsonwebtoken';

const fetchMyNFTAPIs = [
    'getAllCollectibleByAddress',
    'getOwnCollectible',
    'getSelfCreateNotSoldCollectible',
    'getForSaleCollectible',
    'getSoldCollectibles',
    'getFavoritesCollectible',
];

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

    const _arrNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrNFTList[i];
        const _NFT: TypeProduct = { ...blankNFTItem };
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
    category: TypeSelectItem | undefined,
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
    if (category !== undefined) {
        searchParams += `&category=${category.value}`;
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

    const _arrBBList: Array<TypeProduct> = [];
    for (let i = 0; i < arrBBList.length; i++) {
        const itemObject: TypeProductFetch = arrBBList[i];
        const _BBItem: TypeProduct = { ...blankBBItem };
        _BBItem.tokenId = itemObject.blindBoxIndex.toString();
        _BBItem.name = itemObject.name;
        _BBItem.image = getImageFromAsset(itemObject.asset);
        _BBItem.price_ela = parseInt(itemObject.blindPrice);
        _BBItem.price_usd = _BBItem.price_ela * ELA2USD;
        // blindboxItem.author = itemObject.authorName || ' ';
        const curTimestamp = new Date().getTime() / 1000;
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
        _BBItem.author =
            itemObject.createdName === '' ? reduceHexAddress(itemObject.createdAddress, 4) : itemObject.createdName;
        _BBItem.royaltyOwner = itemObject.createdAddress;
        _BBItem.isLike = loginState
            ? itemObject.list_likes.findIndex((value: TypeBlindListLikes) => value.did === did) === -1
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
        _NFTItem.authorImg = itemObject.authorAvatar === null ? 'default' : getImageFromAsset(itemObject.authorAvatar);
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

// const getLatestTransaction = async () => {
//     const resLatestTransaction = await fetch(
//         `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getTranDetailsByTokenId?tokenId=${params.id}&timeOrder=-1&pageNum=1&$pageSize=5`,
//         FETCH_CONFIG_JSON
//     );
//     const dataLatestTransaction = await resLatestTransaction.json();
//     const arrLatestTransaction = dataLatestTransaction.data;

//     let _prodTransHistory: Array<TypeNFTHisotry> = [];
//     for (let i = 0; i < arrLatestTransaction.length; i++) {
//         let itemObject: TypeNFTTransactionFetch = arrLatestTransaction[i];
//         if (itemObject.event !== 'Mint') continue;
//         let _prodTrans: TypeNFTHisotry = { ...blankMyNFTHistory };
//         _prodTrans.type = 'Created';
//         _prodTrans.price = parseInt(itemObject.price) / 1e18;
//         _prodTrans.user = reduceHexAddress(itemObject.from === burnAddress ? itemObject.to : itemObject.from, 4); // no proper data
//         let timestamp = getTime(itemObject.timestamp.toString());
//         _prodTrans.time = timestamp.date + ' ' + timestamp.time;
//         _prodTrans.txHash = itemObject.tHash;
//         _prodTransHistory.push(_prodTrans);
//     }
//     setProdTransHistory(_prodTransHistory);
// };

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
        // for my nft history
        if (address !== '' && (itemObject.event === 'Mint' || itemObject.event === 'BuyOrder')) {
            const _NFTTxHistory: TypeNFTHisotry = { ...blankMyNFTHistory };
            _NFTTxHistory.type =
                itemObject.event === 'Mint' ? 'Created' : itemObject.to === address ? 'Bought From' : 'Sold To';
            _NFTTxHistory.price = parseInt(itemObject.price) / 1e18;
            _NFTTxHistory.user =
                _NFTTxHistory.type === 'Bought From'
                    ? itemObject.fromName === ''
                        ? reduceHexAddress(itemObject.from, 4)
                        : itemObject.fromName
                    : itemObject.toName === ''
                    ? reduceHexAddress(itemObject.to, 4)
                    : itemObject.toName;
            const prodTransTimestamp = getTime(itemObject.timestamp.toString());
            _NFTTxHistory.time = prodTransTimestamp.date + ' ' + prodTransTimestamp.time;
            if (itemObject.event === 'BuyOrder')
                _NFTTxHistory.saleType =
                    arrNFTTxs[i + 2].event === 'CreateOrderForSale'
                        ? enumTransactionType.ForSale
                        : enumTransactionType.OnAuction;
            _NFTTxHistory.txHash = itemObject.tHash;
            _NFTTxHistoryList.push(_NFTTxHistory);
        }
    }
    return { txs: _NFTTxList, history: _NFTTxHistoryList };
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
            _otherNFTBid.user =
                itemObject.buyerName === '' ? reduceHexAddress(itemObject.buyerAddr, 4) : itemObject.buyerName;
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

// BlindBoxProduct Page
export const getBBItem = async (blindBoxId: string | undefined, ELA2USD: number, userDid: string) => {
    const resBBItem = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/getBlindboxById?blindBoxId=${blindBoxId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonBBItem = await resBBItem.json();
    const itemObject: TypeProductFetch = jsonBBItem.data.result;
    const _BBItem: TypeProduct = { ...blankBBItem };

    if (itemObject !== undefined) {
        _BBItem.tokenId = itemObject.blindBoxIndex.toString();
        _BBItem.name = itemObject.name;
        _BBItem.image = getImageFromAsset(itemObject.asset);
        _BBItem.price_ela = parseInt(itemObject.blindPrice);
        _BBItem.price_usd = _BBItem.price_ela * ELA2USD;
        const curTimestamp = new Date().getTime() / 1000;
        _BBItem.type =
            curTimestamp < parseInt(itemObject.saleBegin)
                ? enumBlindBoxNFTType.ComingSoon
                : curTimestamp <= parseInt(itemObject.saleEnd)
                ? enumBlindBoxNFTType.SaleEnds
                : enumBlindBoxNFTType.SaleEnded;
        _BBItem.likes = itemObject.likes;
        _BBItem.views = itemObject.views;
        _BBItem.author = itemObject.createdName;
        _BBItem.royaltyOwner = itemObject.createdAddress;
        _BBItem.authorDescription = itemObject.createdDescription;
        _BBItem.authorImg = itemObject.createdAvatar === null ? 'default' : getImageFromAsset(itemObject.createdAvatar);
        _BBItem.isLike =
            itemObject.list_likes.findIndex((value: TypeBlindListLikes) => value.did === userDid) === -1 ? false : true;
        _BBItem.description = itemObject.description;
        _BBItem.instock = itemObject.instock || 0;
        _BBItem.sold = itemObject.sold || 0;
        if (itemObject.saleEnd) {
            const endTime = getTime(itemObject.saleEnd);
            _BBItem.endTime = endTime.date + ' ' + endTime.time;
        } else {
            _BBItem.endTime = '';
        }
        _BBItem.state = itemObject.state;
        _BBItem.maxPurchases = parseInt(itemObject.maxPurchases);
        _BBItem.maxQuantity = parseInt(itemObject.maxQuantity);
        _BBItem.did = itemObject.did;
    }
    return _BBItem;
};

// Profile Page
export const getMyNFTItemList = async (
    fetchParams: string,
    ELA2USD: number,
    likeList: Array<TypeFavouritesFetch>,
    nTabId: number,
    walletAddress: string,
    userDid: string,
) => {
    const fetchUrl =
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/${fetchMyNFTAPIs[nTabId]}?` +
        (nTabId === 5 ? `did=${userDid}` : `selfAddr=${walletAddress}`) +
        `&${fetchParams}`;
    const resMyNFTList = await fetch(fetchUrl, FETCH_CONFIG_JSON);
    const jsonMyNFTList = await resMyNFTList.json();
    const arrMyNFTList = jsonMyNFTList.data === undefined ? [] : jsonMyNFTList.data.result;

    const _arrMyNFTList: Array<TypeProduct> = [];
    for (let i = 0; i < arrMyNFTList.length; i++) {
        const itemObject: TypeProductFetch = arrMyNFTList[i];
        const _myNFT: TypeProduct = { ...blankMyNFTItem };
        _myNFT.tokenId = itemObject.tokenId;
        _myNFT.name = itemObject.name;
        _myNFT.image = getImageFromAsset(itemObject.asset);
        _myNFT.price_ela = itemObject.status === 'NEW' ? 0 : itemObject.price / 1e18;
        _myNFT.price_usd = _myNFT.price_ela * ELA2USD;
        _myNFT.author =
            itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
        _myNFT.types = [];
        if (nTabId === 0 || nTabId === 5) {
            // all & liked
            _myNFT.types.push(
                itemObject.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased,
            );
            if (itemObject.holder === walletAddress) {
                // owned
                if (itemObject.status !== 'NEW')
                    _myNFT.types.push(itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction);
            } else {
                // not owned
                _myNFT.types.push(enumMyNFTType.Sold);
            }
        } else if (nTabId === 1) {
            // owned
            _myNFT.type = itemObject.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased;
            _myNFT.types.push(
                itemObject.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased,
            );
            if (itemObject.status !== 'NEW')
                _myNFT.types.push(itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction);
        } else if (nTabId === 2) {
            // created
            _myNFT.type = enumMyNFTType.Created;
            if (itemObject.holder === walletAddress) {
                // owned
                _myNFT.types.push(enumMyNFTType.Created);
                if (itemObject.status !== 'NEW')
                    _myNFT.types.push(itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction);
            } else {
                // not owned
                if (itemObject.status === 'NEW') {
                    _myNFT.types.push(enumMyNFTType.Created);
                    _myNFT.types.push(enumMyNFTType.Sold);
                } else {
                    _myNFT.types.push(enumMyNFTType.Sold);
                    _myNFT.types.push(itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction);
                }
            }
        } else if (nTabId === 3) {
            // for sale
            _myNFT.type = itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction;
            _myNFT.types.push(
                itemObject.royaltyOwner === walletAddress ? enumMyNFTType.Created : enumMyNFTType.Purchased,
            );
            _myNFT.types.push(itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction);
        } else if (nTabId === 4) {
            _myNFT.type = enumMyNFTType.Sold;
            _myNFT.types.push(enumMyNFTType.Sold);
            if (itemObject.status !== 'NEW')
                _myNFT.types.push(itemObject.endTime === '0' ? enumMyNFTType.BuyNow : enumMyNFTType.OnAuction);
        }
        _myNFT.likes = itemObject.likes;
        _myNFT.status = itemObject.status;
        _myNFT.isLike =
            nTabId === 5
                ? true
                : likeList.findIndex((value: TypeFavouritesFetch) => value.tokenId === itemObject.tokenId) === -1
                ? false
                : true;
        _arrMyNFTList.push(_myNFT);
    }
    return _arrMyNFTList;
};

export const getMyTotalEarned = async (address: string) => {
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
        const jsonTotalEarnedResult = await resTotalEarnedResult.json();
        if (jsonTotalEarnedResult && jsonTotalEarnedResult.data)
            return parseFloat(jsonTotalEarnedResult.data).toFixed(2);
        return '0';
    } catch (error) {
        return '0';
    }
};

export const getMyTodayEarned = async (address: string) => {
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
        const jsonTodayEarnedResult = await resTodayEarnedResult.json();
        if (jsonTodayEarnedResult && jsonTodayEarnedResult.data)
            return parseFloat(jsonTodayEarnedResult.data).toFixed(2);
        return '0';
    } catch (error) {
        return '0';
    }
};

export const getMyEarnedList = async (address: string) => {
    const resEarnedList = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getEarnedListByAddress?address=${address}`,
        FETCH_CONFIG_JSON,
    );
    const jsonEarnedList = await resEarnedList.json();
    const arrEarnedList = jsonEarnedList === undefined ? [] : jsonEarnedList.data;

    const _myEarningList: Array<TypeYourEarning> = [];
    for (let i = 0; i < arrEarnedList.length; i++) {
        const itemObject: TypeYourEarningFetch = arrEarnedList[i];
        const _myEarning: TypeYourEarning = { ...blankMyEarning };
        // _earning.tokenId = itemObject.tokenId;
        _myEarning.title = itemObject.name;
        _myEarning.avatar = getImageFromAsset(itemObject.thumbnail);
        _myEarning.price = itemObject.iEarned / 1e18;
        const timestamp = getTime(itemObject.updateTime);
        _myEarning.time = timestamp.date + ' ' + timestamp.time;
        _myEarning.badge = itemObject.Badge === 'Badge' ? enumBadgeType.Sale : enumBadgeType.Royalties;
        _myEarningList.push(_myEarning);
    }
    return _myEarningList;
};

// MyNFT Page
export const getMyNFTItem = async (
    tokenId: string | undefined,
    ELA2USD: number,
    likeList: Array<TypeFavouritesFetch>,
) => {
    const resMyNFTItem = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getCollectibleByTokenId?tokenId=${tokenId}`,
        FETCH_CONFIG_JSON,
    );
    const jsonMyNFTItem = await resMyNFTItem.json();
    const itemObject: TypeProductFetch = jsonMyNFTItem.data;
    const _MyNFTItem: TypeProduct = { ...blankNFTItem };

    if (itemObject !== undefined) {
        _MyNFTItem.tokenId = itemObject.tokenId;
        _MyNFTItem.name = itemObject.name;
        _MyNFTItem.image = getImageFromAsset(itemObject.asset);
        _MyNFTItem.price_ela = itemObject.price / 1e18;
        _MyNFTItem.price_usd = _MyNFTItem.price_ela * ELA2USD;
        _MyNFTItem.type = itemObject.endTime === '0' ? enumSingleNFTType.BuyNow : enumSingleNFTType.OnAuction;
        _MyNFTItem.likes = itemObject.likes;
        _MyNFTItem.views = itemObject.views;
        _MyNFTItem.isLike =
            likeList.findIndex((value: TypeFavouritesFetch) => value.tokenId === itemObject.tokenId) === -1
                ? false
                : true;
        _MyNFTItem.description = itemObject.description;
        _MyNFTItem.author =
            itemObject.authorName === '' ? reduceHexAddress(itemObject.royaltyOwner, 4) : itemObject.authorName;
        _MyNFTItem.authorDescription = itemObject.authorDescription || ' ';
        _MyNFTItem.authorImg =
            itemObject.authorAvatar === null ? 'default' : getImageFromAsset(itemObject.authorAvatar);
        _MyNFTItem.authorAddress = itemObject.royaltyOwner;
        _MyNFTItem.holderName =
            itemObject.holderName === '' || itemObject.holder === itemObject.royaltyOwner
                ? itemObject.authorName
                : itemObject.holderName;
        _MyNFTItem.holder = itemObject.holder;
        _MyNFTItem.tokenIdHex = itemObject.tokenIdHex;
        _MyNFTItem.royalties = parseInt(itemObject.royalties) / 1e4;
        _MyNFTItem.category = itemObject.category;
        const createTime = getUTCTime(itemObject.createTime);
        _MyNFTItem.createTime = createTime.date + '' + createTime.time;
        _MyNFTItem.holder = itemObject.holder;
        _MyNFTItem.orderId = itemObject.orderId;
        _MyNFTItem.status = itemObject.status;
    }
    return _MyNFTItem;
};

// BB creation
export const getBBCandiates = async (address: string, keyword: string, selectedTokenIds: Array<string>) => {
    const resBBCandidateList = await fetch(
        `${process.env.REACT_APP_SERVICE_URL}/sticker/api/v1/getBlindboxCandidate?address=${address}&keyword=${keyword}`,
        FETCH_CONFIG_JSON,
    );
    const jsonBBCandidateList = await resBBCandidateList.json();
    const arrBBCandidateList = jsonBBCandidateList.data === undefined ? [] : jsonBBCandidateList.data.result;

    const _BBCandidateList: Array<TypeBlindBoxSelectItem> = [];
    const _itemCheckedList: Array<boolean> = [];
    let _allChecked: boolean = false;
    let _indeterminateChecked: boolean = false;
    for (let i = 0; i < arrBBCandidateList.length; i++) {
        const itemObject: TypeProductFetch = arrBBCandidateList[i];
        const _BBCandidate: TypeBlindBoxSelectItem = { ...blankBBCandidate };
        _BBCandidate.id = i + 1;
        _BBCandidate.tokenId = itemObject.tokenId;
        _BBCandidate.nftIdentity = itemObject.tokenIdHex;
        _BBCandidate.projectTitle = itemObject.name;
        _BBCandidate.projectType = itemObject.category;
        _BBCandidate.url = getImageFromAsset(itemObject.asset);
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
            signedProfile: signedProfile,
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
