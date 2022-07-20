import { enumCallMethodType, enumMetEastContractType, enumMETokenContractType } from './contract-types';
import { TypeSelectItem } from './select-types';

export type TypeMintInputForm = {
    name: string;
    description: string;
    author: string;
    category: TypeSelectItem;
    file: File;
};

export type TypeIpfsUpload = {
    path: string;
    cid: string;
    size: number;
    type: string;
};

export type TypeSaleInputForm = {
    saleType: 'buynow' | 'auction';
    price: number;
    royalty: string;
    minPirce: number;
    saleEnds: TypeSelectItem;
};

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
};

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
};

export type TypeIpfsUploadInfo = {
    tokenId: string;
    tokenUri: string;
    didUri: string;
};

export type TypeContractMethodPram = {
    contractType: enumMetEastContractType | enumMETokenContractType;
    callType: enumCallMethodType;
    method: string;
    price: string;
    tokenId: string;
    tokenIds: string[];
    tokenUri: string;
    royaltyFee: number;
    orderId: string;
    orderIds: string[];
    didUri: string;
    _price: string;
    _prices: string[];
    quoteToken: string;
    quoteTokens: string[];
    isBlindBox: boolean;
    endTime: string;
    operator: string;
    approved: boolean;
    address: string;
};
