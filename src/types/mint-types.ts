import { TypeSelectItem } from "./select-types";

export type TypeMintInputForm = {
    name: string;
    description: string;
    author: string;
    category: TypeSelectItem;
    file: File;
}

export type TypeIpfsUpload = {
    path: string;
    cid: string;
    size: number;
    type: string;
}

export type TypeSaleInputForm = {
    saleType: 'buynow' | 'auction';
    price: string;
    royalty: string;
    minPirce: string;
    saleEnds: TypeSelectItem;
}
