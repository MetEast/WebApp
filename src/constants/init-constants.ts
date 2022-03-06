import {
    TypeProduct,
    TypeNFTTransaction,
    TypeBlindBoxSelectItem,
    TypeSingleNFTBid,
    TypeNFTHisotry,
    TypeYourEarning,
    enumBlindBoxNFTType,
    enumSingleNFTType,
    enumMyNFTType,
    enumTransactionType,
    enumBadgeType,
} from 'src/types/product-types';

export const blankNFTItem: TypeProduct = {
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
    type: enumSingleNFTType.BuyNow,
    isLike: false,
};

export const blankMyNFTItem: TypeProduct = {
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

export const blankNFTTxs: TypeNFTTransaction = {
    type: enumTransactionType.Bid,
    user: '',
    price: 0,
    time: '',
    txHash: '',
};

export const blankNFTBid: TypeSingleNFTBid = { user: '', price: 0, time: '', orderId: '' };

export const blankMyEarning: TypeYourEarning = {
    avatar: '',
    title: '',
    time: '',
    price: 0,
    badge: enumBadgeType.Other,
};

export const blankMyNFTHistory: TypeNFTHisotry = {
    type: '',
    user: '',
    price: 0,
    time: '',
    saleType: enumTransactionType.ForSale,
    txHash: '',
};

export const blankBBItem: TypeProduct = {
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
    type: enumBlindBoxNFTType.ComingSoon,
    isLike: false,
    sold: 0,
    instock: 0,
};

export const blankBBCandidate: TypeBlindBoxSelectItem = {
    id: 0,
    tokenId: '',
    nftIdentity: '',
    projectTitle: '',
    projectType: '',
    url: '',
};
