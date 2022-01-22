export enum enumBlindBoxNFTType {
    ComingSoon = 'BlindBoxNFT - Coming Soon',
    SaleEnds = 'BlindBoxNFT - Sale Ends',
    SaleEnded = 'BlindBoxNFT - Sale Ended',
}

export enum enumSingleNFTType {
    BuyNow = 'SingleNFT - Buy Now',
    OnAuction = 'SingleNFT - On Auction',
}

export enum enumMyNFTType {
    BuyNow = 'MyNFT - Buy Now',
    OnAuction = 'MyNFT - On Auction',
    Created = 'MyNFT - Created',
    Sold = 'MyNFT - Sold',
    // Acquired = 'MyNFT - Acquired',
}

export enum enumBadgeType {
    ComingSoon = 'Coming Soon',
    SaleEnds = 'Sale Ends',
    SaleEnded = 'Sale Ended',
    BuyNow = 'Buy Now',
    ForSale = 'For Sale',
    OnAuction = 'On Auction',
    ReservePriceNotMet = 'Reserve Price Not Met',
    Museum = 'Museum',
    Created = 'Created',
    Sold = 'Sold',
}

export enum enumTransactionType {
    Bid = 'Bid',
    OnAuction = 'On Auction',
    SoldTo = 'Sold To',
    ForSale = 'For Sale',
    CreatedBy = 'Created By',
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
    isLike: boolean;

    
    blockNumber?: number;
    tokenIndex?: string;
    quantity?: number;
    royaltyOwner?: string;
    updateTime?: string;
    thumbnail?: string;
    asset?: string;
    kind?: string;
    size?: string;
    adult?: boolean;
    status?: string;

    
    sold?: number;
    instock?: number;
    saleTime?: string;
};

export type TypeNFTTransaction = {
    type: enumTransactionType;
    user: string;
    price: number;
    time: string;
    txHash: string;
};

export type TypeSingleNFTBid = {
    user: string;
    price: number;
    time: string;
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
    createTime: string;
    updateTime: string;
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
};

export type TypeNFTTransactionFetch = {
    blockNumber: number;
    from: string;
    to: string;
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
    // price: string;
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
    royaltyFee: string;
    tokenId: string;
    price: string;
    timestamp: string;
    gasFee: number;
}

export type TypeProductPrice = {
    onlyDate: string;
    price: number;
    tokenId: string;
};

export type TypeChartAxis = {
    x: string;
    y: number;
}