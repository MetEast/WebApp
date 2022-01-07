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


export type TypeNewProduct = {
    blockNumber: number;
    createTime: string;
    description: string;
    did: {
        version: string;
        did: string;
    }
    didUri: string;
    holder: string;
    kind: string;
    name: string;
    thumbnail: string;
    tokenIndex: string;
    size: number;
};