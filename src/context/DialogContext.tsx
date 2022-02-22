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
    // all transactions
    allTxDlgOpened: boolean;
    // all bids
    allBidDlgOpened: boolean;
    // buy blind box
    buyBlindBoxDlgOpened: boolean;
    buyBlindBoxDlgStep: number;
    buyBlindBoxName: string;
    buyBlindBoxPriceEla: number;
    buyBlindBoxPriceUsd: number;
    buyBlindBoxAmount: number;
    buyBlindBoxTxFee: number;
    buyBlindBoxTxHash: string;
    buyBlindBoxCreator: string;
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
    // all transactions
    allTxDlgOpened: false,
    // all bids
    allBidDlgOpened: false,
    // buy blind box
    buyBlindBoxDlgOpened: false,
    buyBlindBoxDlgStep: 0,
    buyBlindBoxName: '',
    buyBlindBoxPriceEla: 0,
    buyBlindBoxPriceUsd: 0, 
    buyBlindBoxAmount: 0, 
    buyBlindBoxTxFee: 0, 
    buyBlindBoxTxHash: '',
    buyBlindBoxCreator: ''
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
