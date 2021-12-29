export enum enmSaleStatus {
    ComingSoon = 'ComingSoon',
    SaleEnds = 'SaleEnds',
    SaleEnded = 'SaleEnded',
}

export type TypeProduct = {
    id: string;
    image: string;
    name: string;
    price: number;
    likes: number;
    saleStatus: enmSaleStatus;
};
