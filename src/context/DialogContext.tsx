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
    buyNowOrderId: number;
    buyNowTxHash: string;
    buyNowTxFee: number;
    // accept bid
    acceptBidDlgOpened: boolean;
    acceptBidDlgStep: number;
    // place bid
    placeBidDlgOpened: boolean;
    placeBidDlgStep: number;
    placeBidName: string;
    placeBidOrderId: number;
    placeBidAmount: number;
    placeBidExpire: TypeSelectItem;
    placeBidTxHash: string;
    placeBidTxFee: number;
    // update bid
    // cancel bid
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
    buyNowOrderId: 0,
    buyNowTxFee: 0,
    // accept bid
    acceptBidDlgOpened: false,
    acceptBidDlgStep: 0,
    // place bid
    placeBidDlgOpened: false,
    placeBidDlgStep: 0,
    placeBidName: '',
    placeBidAmount: 0,
    placeBidExpire: { label: '', value: '' },
    placeBidTxHash: '',
    placeBidTxFee: 0,
    placeBidOrderId: 0,
    // update bid
    // cancel bid
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
