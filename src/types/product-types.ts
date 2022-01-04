export enum enumBlindBoxNFTType {
    ComingSoon = 'Coming Soon',
    SaleEnds = 'Sale Ends',
    SaleEnded = 'Sale Ended',
}

export enum enumSingleNFTType {
    BuyNow = 'Buy Now',
    OnAuction = 'On Auction',
}

export enum enumMyNFTType {
    BuyNow = 'Buy Now',
    OnAuction = 'On Auction',
    Created = 'Created',
    Sold = 'Sold',
    Acquired = 'Acquired',
}

export enum enumBadgeType {
    ComingSoon = 'Coming Soon',
    SaleEnds = 'Sale Ends',
    SaleEnded = 'Sale Ended',
    BuyNow = 'Buy Now',
    OnAuction = 'On Auction',
    ReservePriceNotMet = 'Reserve Price Not Met',
    Museum = 'Museum',
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
    price: number;
    likes: number;
    type: enumBlindBoxNFTType | enumSingleNFTType;
    saleTime?: string;
};

export type TypeSingleNFTTransaction = {
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
