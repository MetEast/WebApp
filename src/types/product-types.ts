export enum enmSaleStatus {
    ComingSoon = 'Coming Soon',
    SaleEnds = 'Sale Ends',
    SaleEnded = 'Sale Ended',
}

export enum enumSingleNFTType {
    BuyNow = 'Buy Now',
    OnAuction = 'On Auction',
}

export type TypeProduct = {
    id: string;
    image: string;
    name: string;
    price: number;
    likes: number;
    type: enmSaleStatus | enumSingleNFTType;
    saleTime?: string;
};
