import React, { createContext, useState, useContext } from 'react';
import { TypeSelectItem } from 'src/types/select-types';


interface State {
    // mint nft
    createNFTDlgOpened: boolean;
    createNFTDlgStep: number;
    mintNFTCategory: TypeSelectItem;
    mintNFTTitle: string;
    mintNFTAuthor: string;
    mintNFTIntroduction: string;
    mintNFTFile?: File;
    mintNFTTokenId: string;
    mintNFTTokenUri: string;
    mintNFTDidUri: string;
    mintNFTTxHash: string;
    mintNFTTXFee: number;
    // create order for sale/auction

    // buy now
    buyNowDlgOpened: boolean;
    buyNowDlgStep: number;
    buyNowName: string;
    buyNowPrice: number;
    buyNowOrderId: number;
    buyNowSeller: string;
    buyNowRoyaltyOwner: string;
    buyNowRoyalty: number;
    buyNowTxHash: string;
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
    // all transactions
    allTxDlgOpened: boolean;
    // all bids
    allBidDlgOpened: boolean;
}

const defaultState: State = {
    // mint nft
    createNFTDlgOpened: false,
    createNFTDlgStep: 0,
    mintNFTCategory: {label: "", value: ""},
    mintNFTTitle: "",
    mintNFTAuthor: "",
    mintNFTIntroduction: "",
    mintNFTTokenId: "",
    mintNFTTokenUri: "",
    mintNFTDidUri: "",
    mintNFTTxHash: "",
    mintNFTTXFee: 0,
    //
    // buy now
    buyNowDlgOpened: false,
    buyNowDlgStep: 0,
    buyNowName: "",
    buyNowPrice: 0,
    buyNowSeller: "",
    buyNowRoyaltyOwner: "",
    buyNowRoyalty: 0,
    buyNowTxHash: "",
    buyNowOrderId: 0,
    // accept bid
    acceptBidDlgOpened: false,
    acceptBidDlgStep: 0,
    // place bid
    placeBidDlgOpened: false,
    placeBidDlgStep: 0,
    placeBidName: "",
    placeBidAmount: 0,
    placeBidExpire: {label: "", value: ""},
    placeBidTxHash: "",
    placeBidTxFee: 0,
    placeBidOrderId: 0,
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
