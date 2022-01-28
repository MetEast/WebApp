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
    price: number;
    royalty: string;
    minPirce: number;
    saleEnds: TypeSelectItem;
}

export type TypeMintReceipt = {
    blockHash?: string;
    blockNumber?: number;
    contractAddress?: string;
    cumulativeGasUsed: number;
    from: string;
    gasUsed: number;
    to: string;
    transactionHash: string;
    transactionIndex?: number;
    logsBloom?: string;
    status?: boolean;
    events?: any;
}

export type TypeSaleReceipt = {
    blockHash: string;
    blockNumber: number;
    contractAddress: string;
    cumulativeGasUsed: number;
    from: string;
    gasUsed: number;
    to: string;
    transactionHash: string;
    transactionIndex: number;
    logsBloom?: string;
    status: boolean;
    events?: any;
}

export type TypeIpfsUploadInfo = {
    tokenId: string;
    tokenUri: string;
    didUri: string;
}