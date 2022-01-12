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
    id: string;
    image: string;
    name: string;
    price_ela: number;
    price_usd: number;
    likes: number;
    views: number;
    sold?: number;
    instock?: number;
    author: string;
    type: enumBlindBoxNFTType | enumSingleNFTType | enumMyNFTType;
    saleTime?: string;
};

export type TypeNFTTransaction = {
    type: enumTransactionType;
    user: string;
    price: number;
    time: string;
};

export type TypeSingleNFTBid = {
    user: string;
    price: number;
    time: string;
};

// ---
export type TypeNewProduct = {
    blockNumber: number;
    createTime: string;
    description: string;
    holder: string;
    royalties: string;
    kind: string;
    name: string;
    asset: string;
    tokenId: string;
    tokenIdHex: string;
    size: number;
};

export type TypeNewTransaction = {
    blockNumber: number;
    timestamp: string;
    from: string;
    price: string;
    event: string;
};

export type TypeProductPrice = {
    onlyDate: string;
    price: number;
    tokenId: string;
};

export type TypeChartAxis = {
    x: string;
    y: number;
}