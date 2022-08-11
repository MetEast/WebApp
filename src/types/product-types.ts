export enum enumBlindBoxNFTType {
    ComingSoon = 'BlindBoxNFT - Coming Soon',
    SaleEnds = 'BlindBoxNFT - Sale Ends',
    SaleEnded = 'BlindBoxNFT - Sale Ended',
    SoldOut = 'BlindBoxNFT - Sold Out',
}

export enum enumSingleNFTType {
    NotOnSale = 'SingleNFT - Not on Sale',
    BuyNow = 'SingleNFT - Buy Now',
    OnAuction = 'SingleNFT - On Auction',
}

export enum enumMyNFTType {
    BuyNow = 'MyNFT - Buy Now',
    OnAuction = 'MyNFT - On Auction',
    Created = 'MyNFT - Created',
    Sold = 'MyNFT - Sold',
    Purchased = 'MyNFT - Purchased',
    InBindBox = 'MyNFT - In BlindBox',
}

export enum enumBadgeType {
    ComingSoon = 'Coming Soon',
    SaleEnds = 'Sale Ends',
    SaleEnded = 'Sale Ended',
    SoldOut = 'Sold Out',
    BuyNow = 'Buy Now',
    ForSale = 'For Sale',
    OnAuction = 'On Auction',
    Purchased = 'Purchased',
    ReservePriceNotMet = 'Reserve Price Not Met',
    Original = 'Original',
    Museum = 'Museum',
    Arts = 'Arts',
    Sports = 'Sports',
    Dimension = 'Dimension',
    Pets = 'Pets',
    Recreation = 'Recreation',
    Star = 'Star',
    Other = 'Other',
    Created = 'Created',
    Sold = 'Sold',
    Sale = 'Sale',
    Royalties = 'Royalties',
    InBlindBox = 'In Mystery Box',
}

export enum enumTransactionType {
    CreatedBy = 'Created By',
    Bid = 'Bid',
    ForSale = 'For Sale',
    OnAuction = 'On Auction',
    SoldTo = 'Sold To',
    // ChangeOrder = 'Change Order',
    // CancelOrder = 'Cancel Order',
    // Transfer = 'Transfer'
    SettleBidOrder = 'SettleBidOrder',
    PriceChanged = 'Price Changed',
    SaleCanceled = 'Sale Canceled',
}

export type TypeProduct = {
    tokenId: string;
    name: string;
    author: string; // creator
    authorDescription: string;
    authorImg: string;
    authorAddress: string;
    description: string;
    image: string;
    price_ela: number;
    price_usd: number;
    likes: number;
    views: number;
    tokenIdHex: string;
    royalties: number;
    createTime: string;
    holder: string; // owner
    holderName: string;
    type: enumBlindBoxNFTType | enumSingleNFTType | enumMyNFTType;
    types?: Array<enumMyNFTType>;
    isLike: boolean;
    endTime?: string;
    sold?: number;
    instock?: number;
    orderId?: string;
    blockNumber?: number;
    tokenIndex?: string;
    quantity?: number;
    royaltyOwner?: string;
    timestamp?: number;
    endTimestamp?: number;
    thumbnail?: string;
    asset?: string;
    kind?: string;
    size?: string;
    category?: string;
    status?: string;
    isExpired?: boolean;
    state?: string;
    maxPurchases?: number;
    maxQuantity?: number;
    did?: string;
    isBlindbox?: boolean;
    soldIds?: string[];

    bids: number;
    buyer?: string;
    txHash?: string;
};

export type TypeNFTTransaction = {
    type: enumTransactionType;
    user: string;
    price: number;
    time: string;
    txHash: string;
    saleType: enumTransactionType;
};

export type TypeNFTHisotry = {
    type: string;
    price: number;
    user: string;
    time: string;
    saleType: enumTransactionType;
    txHash: string;
};

export type TypeSingleNFTBid = {
    user: string;
    price: number;
    time: string;
    orderId: string;
    address: string;
};

export type TypeYourEarning = {
    // tokenId: string;
    avatar: string;
    title: string;
    time: string;
    price: number;
    badges: enumBadgeType[];
};

export type TypeBlindBoxSelectItem = {
    id: number;
    tokenId: string;
    nftIdentity: string;
    projectTitle: string;
    projectType: string;
    url: string;
};

export type TypeBlindBoxCandidate = {
    tokenId: string;
    orderId: string;
    asset: string;
    name: string;
    creator: string;
    creatorAddress: string;
};

// ---
export type TypeProductFetch = {
    blockNumber: number;
    tokenIndex: string;
    tokenId: string;
    quantity: number;
    royalties: string;
    royaltyOwner: string;
    holder: string;
    holderName: string;
    createTime: string;
    marketTime: number;
    endTime: string;
    tokenIdHex: string;
    type: string;
    name: string;
    description: string;
    thumbnail: string;
    asset: string;
    kind: string;
    size: string;
    adult: boolean;
    price: number;
    views: number;
    likes: number;
    status: string;
    authorName: string;
    authorDescription: string;
    authorAvatar: string;
    instock: number;
    sold: number;
    orderId: string;
    category: string;
    //
    _id: string;
    address: string;
    blindBoxIndex: number;
    blindPrice: string;
    maxPurchase: string;
    maxQuantity: string;
    maxViews: string;
    saleBegin: string;
    saleEnd: string;
    sort: string;
    state: string;
    list_likes: Array<TypeBlindListLikes>;
    list_views: Array<TypeBlindListLikes>;
    did: string;
    soldTokenIds: string[];
    tokenIds: string[];
    createdName: string;
    createdAddress: string;
    createdDescription: string;
    createdAvatar: string;
    isBlindBox: boolean;

    orderState: number;
    orderType: number;
    seller: string;
    tokenOwner: string;
    royaltyFee: number;
    tokenMinter: string;
    updateTime: number;
    orderPrice: number;
    buyer: string;

    creator: {
        did: string;
        description: string;
        name: string;
    };
    data: {
        image: string;
        kind: string;
        size: number;
        thumbnail: string;
    };

    order: {
        orderId: number;
        createTime: number;
        endTime: number;
        isBlindBox: boolean;
        orderPrice: number;
        orderState: number;
        orderType: number;
        seller: string;
        buyer: string;
        price: number;
        bids: number;
        buyerAddr: string;
    };

    token: {
        category: string;
        createTime: number;
        description: string;
        name: string;
        royaltyFee: number;
        royaltyOwner: string;
        thumbnail: string;
        likes: number;
        views: number;
    };

    tokenEvent: {
        transactionHash: string;
    };
};

export type TypeProductFetch2 = {
    orderId: number;
    createTime: number;
    orderPrice: number;
    seller: string;
    tokenId: string;
    orderType: number;
    token: Token;
    endTime: number;
};

export type Token = {
    category: string;
    createTime: number;
    description: string;
    name: string;
    royaltyFee: number;
    royaltyOwner: string;
    thumbnail: string;
    views: number;
    likes: number;
    authorName: string;
};

export type TypeFavouritesFetch = {
    tokenId: string;
};

export type TypeBlindListLikes = {
    did: string;
    isTokenId: number;
    tokenId: number;
};

export type TypeLikesFetchItem = {
    tokenId: string;
    likes: number;
};

export type TypeViewsFetchItem = {
    tokenId: string;
    views: number;
};

export type TypeVeiwsLikesFetch = {
    likes: Array<TypeLikesFetchItem>;
    views: Array<TypeViewsFetchItem>;
};

export enum OrderEventType {
    OrderForAuction,
    OrderBid,
    OrderForSale,
    OrderFilled,
    OrderCancelled,
    OrderPriceChanged,
    OrderTakenDown,
}

export type TypeNFTTransactionFetch = {
    blockNumber: number;
    from: string;
    fromName: string;
    to: string;
    toName: string;
    price: string;
    gasFee: number;
    name: string;
    asset: string;
    timestamp: number;
    tokenId: string;
    txHash: string;
    txIndex: number;
    value: number;
    event: string;
    royalties: string;
    royaltyFee: string;
    royaltyOwner: string;
    tHash: string;

    orderType: number;
    orderState: number;

    sellerAddr: string;
    sellerInfo: {
        did: string;
        description: string;
        name: string;
    };
    buyerAddr: string;
    buyerInfo: {
        did: string;
        description: string;
        name: string;
    };

    events: Array<TransferEvent>;
};

export type TransferEvent = {
    blockNumber: number;
    transactionHash: string;
    seller: string;
    buyer: string;
    orderId: number;
    tokenId: string;
    quoteToken: string;
    minPrice: number;
    price: number;
    oldPrice: number;
    newPrice: number;
    endTime: number;
    royaltyOwner: string;
    royaltyFee: number;
    platformAddress: string;
    platformFee: number;
    eventType: number;
    gasFee: number;
    timestamp: number;
};

export type TypeSingleNFTBidFetch = {
    orderId: string;
    event: string;
    blockNumber: string;
    tHash: string;
    tIndex: number;
    blockHash: string;
    logIndex: number;
    removed: boolean;
    id: string;
    sellerAddr: string;
    buyerAddr: string;
    buyerName: string;
    sellerName: string;
    royaltyFee: string;
    tokenId: string;
    price: string;
    timestamp: string;
    gasFee: number;
    buyer: string;
};

export type TypePriceHistoryFetch = {
    updateTime: string;
    price: number;
    tokenId: string;
    name: string;
};

export type TypeYourEarningFetch = {
    Badge: string;
    iEarned: number;
    name: string;
    tokenId: string;
    thumbnail: string;
    updateTime: string;

    filled: number;
    platformFee: number;
    price: number;
    sellerAddr: string;
    royaltyOwner: string;
    royaltyFee: number;
    token: { name: string; data: { thumbnail: string } };
};

export type TypeChartAxis = {
    x: number;
    y: number;
    username: string;
};