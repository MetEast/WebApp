import React, { createContext, useState, useContext } from 'react';
import { TypeSelectItem } from 'src/types/select-types';

interface State {
    // mint nft
    createNFTDlgOpened: boolean;
    createNFTDlgStep: number;
    mintCategory: TypeSelectItem;
    mintTitle: string;
    mintAuthor: string;
    mintIntroduction: string;
    mintFile?: File;
    mintRoyalties: number;
    mintTokenId: string;
    mintTokenUri: string;
    mintDidUri: string;
    mintTxHash: string;
    mintTXFee: number;
    mintProgress: number;
    // create order for sale/auction
    sellSaleType: 'buynow' | 'auction';
    sellSaleEnds: TypeSelectItem;
    sellPrice: number;
    sellMinPrice: number;
    sellTxHash: string;
    sellTxFee: number;
    // buy now
    buyNowDlgOpened: boolean;
    buyNowDlgStep: number;
    buyNowName: string;
    buyNowPrice: number;
    buyNowOrderId: string;
    buyNowTxHash: string;
    buyNowTxFee: number;
    // change price
    changePriceDlgOpened: boolean;
    changePriceDlgStep: number;
    changePriceCurPrice: number;
    changePriceOrderId: string;
    changePriceTxHash: string;
    changePriceTxFee: number;
    // cancel sale
    cancelSaleDlgOpened: boolean;
    cancelSaleDlgStep: number;
    cancelSaleOrderId: string;
    cancelSaleTxHash: string;
    cancelSaleTxFee: number;
    // accept bid
    acceptBidDlgOpened: boolean;
    acceptBidDlgStep: number;
    acceptBidName: string;
    acceptBidPrice: number;
    acceptBidOrderId: string;
    acceptBidTxFee: number;
    acceptBidTxHash: string;
    // place bid
    placeBidDlgOpened: boolean;
    placeBidDlgStep: number;
    placeBidName: string;
    placeBidOrderId: string;
    placeBidMinLimit: number;
    placeBidAmount: number;
    placeBidExpire: TypeSelectItem;
    placeBidTxHash: string;
    placeBidTxFee: number;
    // update bid
    updateBidDlgOpened: boolean;
    updateBidDlgStep: number;
    updateBidPrice: number;
    updateBidOrderId: string;
    updateBidTxFee: number;
    updateBidTxHash: string;
    // cancel bid
    cancelBidDlgOpened: boolean;
    cancelBidDlgStep: number;
    cancelBidOrderId: string;
    cancelBidTxHash: string;
    cancelBidTxFee: number;
    // create blind box
    createBlindBoxDlgOpened: boolean;
    createBlindBoxDlgStep: number;
    crtBlindTitle: string;
    crtBlindDescription: string;
    crtBlindAuthorDescription: string;
    crtBlindImage?: File;
    crtBlindTokenIds: string;
    crtBlindStatus: 'offline' | 'online';
    crtBlindQuantity: number;
    crtBlindPrice: number;
    crtBlindSaleBegin: string;
    crtBlindSaleEnd: string;
    crtBlindLikes: number;
    crtBlindViews: number;
    crtBlindPurchases: number;
    crtBlindSort: TypeSelectItem;
    crtBlindTxFee: number;
    crtBlindTxHash: string;
    // buy blind box
    buyBlindBoxDlgOpened: boolean;
    buyBlindBoxDlgStep: number;
    buyBlindName: string;
    buyBlindPriceEla: number;
    buyBlindPriceUsd: number;
    buyBlindAmount: number;
    buyBlindTxFee: number;
    buyBlindTxHash: string;
    buyBlindCreator: string;
    // error msg
    errorMessageDlgOpened: boolean;
    // all transactions
    allTxDlgOpened: boolean;
    // all bids
    allBidDlgOpened: boolean;
}

const defaultState: State = {
    // mint nft
    createNFTDlgOpened: false,
    createNFTDlgStep: 0,
    mintTitle: '',
    mintCategory: { label: '', value: '' },
    mintIntroduction: '',
    mintAuthor: '',
    mintRoyalties: 0,
    mintTokenId: '',
    mintTokenUri: '',
    mintDidUri: '',
    mintTxHash: '',
    mintTXFee: 0,
    mintProgress: 0,
    // create order for sale/auction
    sellSaleType: 'buynow',
    sellSaleEnds: { label: '', value: '' },
    sellPrice: 0,
    sellMinPrice: 0,
    sellTxHash: '',
    sellTxFee: 0,
    // buy now
    buyNowDlgOpened: false,
    buyNowDlgStep: 0,
    buyNowName: '',
    buyNowPrice: 0,
    buyNowTxHash: '',
    buyNowOrderId: '',
    buyNowTxFee: 0,
    // change price
    changePriceDlgOpened: false,
    changePriceDlgStep: 0,
    changePriceCurPrice: 0,
    changePriceOrderId: '',
    changePriceTxHash: '',
    changePriceTxFee: 0,
    // cancel sale
    cancelSaleDlgOpened: false,
    cancelSaleDlgStep: 0,
    cancelSaleOrderId: '',
    cancelSaleTxHash: '',
    cancelSaleTxFee: 0,
    // accept bid
    acceptBidDlgOpened: false,
    acceptBidDlgStep: 0,
    acceptBidName: '',
    acceptBidPrice: 0,
    acceptBidOrderId: '',
    acceptBidTxFee: 0,
    acceptBidTxHash: '',
    // place bid
    placeBidDlgOpened: false,
    placeBidDlgStep: 0,
    placeBidName: '',
    placeBidMinLimit: 0,
    placeBidAmount: 0,
    placeBidExpire: { label: '', value: '' },
    placeBidTxHash: '',
    placeBidTxFee: 0,
    placeBidOrderId: '',
    // update bid
    updateBidDlgOpened: false,
    updateBidDlgStep: 0,
    updateBidPrice: 0,
    updateBidOrderId: '',
    updateBidTxFee: 0,
    updateBidTxHash: '',
    // cancel bid
    cancelBidDlgOpened: false,
    cancelBidDlgStep: 0,
    cancelBidOrderId: '',
    cancelBidTxHash: '',
    cancelBidTxFee: 0,
    // create blind box
    createBlindBoxDlgOpened: false,
    createBlindBoxDlgStep: 0,
    crtBlindTitle: '',
    crtBlindDescription: '',
    crtBlindAuthorDescription: '',
    crtBlindTokenIds: '',
    crtBlindStatus: 'offline',
    crtBlindQuantity: 0,
    crtBlindPrice: 0,
    crtBlindSaleBegin: '',
    crtBlindSaleEnd: '',
    crtBlindLikes: 0,
    crtBlindViews: 0,
    crtBlindPurchases: 0,
    crtBlindSort: { label: '', value: '' },
    crtBlindTxFee: 0,
    crtBlindTxHash: '',
    // buy blind box
    buyBlindBoxDlgOpened: false,
    buyBlindBoxDlgStep: 0,
    buyBlindName: '',
    buyBlindPriceEla: 0,
    buyBlindPriceUsd: 0,
    buyBlindAmount: 0,
    buyBlindTxFee: 0,
    buyBlindTxHash: '',
    buyBlindCreator: '',
    // error msg
    errorMessageDlgOpened: false,
    // all transactions
    allTxDlgOpened: false,
    // all bids
    allBidDlgOpened: false,
};

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<State> = [defaultState, () => {}];

export const DialogContext = createContext(defaultContextValue);

export const DialogContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<State>(defaultState);

    const ctxValue: ContextType<State> = [
        contextState,
        (value: State) => {
            setContextState(value);
        },
    ];

    return <DialogContext.Provider value={ctxValue}>{children}</DialogContext.Provider>;
};

export const useDialogContext = () => useContext(DialogContext);
