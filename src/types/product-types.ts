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
    description?: string;
    author: string;
    image: string;
    price_ela: number;
    price_usd: number;
    likes: number;
    views?: number;
    


    blockNumber?: number;
    tokenIndex?: string;
    quantity?: number;
    royalties?: string;
    royaltyOwner?: string;
    holder?: string;
    createTime?: string;
    updateTime?: string;
    tokenIdHex?: string;
    // type?: string;
    thumbnail?: string;
    asset?: string;
    kind?: string;
    size?: string;
    adult?: boolean;
    status?: string;

    
    sold?: number;
    instock?: number;
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