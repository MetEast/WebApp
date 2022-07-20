import { AdminNFTItemType, AdminUsersItemType, AdminBannersItemType } from 'src/types/admin-table-data-types';
import { UserInfoType, UserTokenType } from 'src/types/auth-types';
import { TypeContractMethodPram } from 'src/types/mint-types';
import { TypeNotification } from 'src/types/notification-types';
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
import { TypeMiningReward } from 'src/types/contract-types';

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
    bids: 0,
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
    type: enumMyNFTType.BuyNow,
    isLike: false,
    bids: 0,
};

export const blankNFTTxs: TypeNFTTransaction = {
    type: enumTransactionType.SoldTo,
    user: '',
    price: 0,
    time: '',
    txHash: '',
    saleType: enumTransactionType.ForSale,
};

export const blankNFTBid: TypeSingleNFTBid = { user: '', address: '', price: 0, time: '', orderId: '' };

export const blankMyEarning: TypeYourEarning = {
    avatar: '',
    title: '',
    time: '',
    price: 0,
    badges: [],
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
    bids: 0,
};

export const blankBBCandidate: TypeBlindBoxSelectItem = {
    id: 0,
    tokenId: '',
    nftIdentity: '',
    projectTitle: '',
    projectType: '',
    url: '',
};

export const blankAdminNFTItem: AdminNFTItemType = {
    id: 0,
    tokenId: '',
    token_id: '',
    nft_title: '',
    nft_image: '',
    selling_price: 0,
    nft_owner: '',
    nft_creator: '',
    orderId: '',
    created_date: '',
    listed_date: '',
    likes: 0,
    views: 0,
    sale_type: enumBadgeType.BuyNow,
    status: 'Online',
};

export const blankAdminUserItem: AdminUsersItemType = {
    id: 0,
    address: '',
    username: '',
    avatar: '',
    status: 0,
    remarks: '',
};

export const blankAdminBannerItem: AdminBannersItemType = {
    id: 0, // required
    banner_id: 0,
    image: '',
    url: '',
    sort: 0,
    location: '',
    status: '',
    created: '',
};

export const blankContractMethodParam: TypeContractMethodPram = {
    contractType: 1,
    callType: 1,
    method: '',
    price: '0',
    tokenId: '',
    tokenIds: [],
    tokenUri: '',
    royaltyFee: 0,
    orderId: '',
    orderIds: [],
    didUri: '',
    _price: '0',
    _prices: [],
    quoteToken: '',
    quoteTokens: [],
    isBlindBox: false,
    endTime: '',
    operator: '',
    approved: false,
    address: '',
};

export const blankNotification: TypeNotification = {
    _id: '',
    title: '',
    content: '',
    date: '',
    type: 0,
    params: { tokenName: '' },
};

export const blankUserToken: UserTokenType = {
    address: '',
    did: '',
    name: '',
    description: '',
    avatar: '',
    coverImage: '',
    role: '',
    exp: 0,
    iat: 0,
};

export const blankUserInfo: UserInfoType = {
    address: '',
    did: { did: '', description: '', name: '' },
    remarks: '',
    role: 2,
    _id: '',
};

export const blankMiningReward: TypeMiningReward = {
    lastReceipt: 0,
    availableToken: 0,
    availablePrice: 0,
    receivedReward: 0,
};
