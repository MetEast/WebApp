import React, { createContext, useState, useContext } from 'react';
import { TypeSelectItem } from 'src/types/select-types';


interface State {
    // mint nft
    createNFTDlgOpened: boolean;
    createNFTDlgStep: number;
    category: TypeSelectItem;
    title: string;
    author: string;
    introduction: string;
    file?: File;
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
}

const defaultState: State = {
    // mint nft
    createNFTDlgOpened: false,
    createNFTDlgStep: 0,
    category: {label: "", value: ""},
    title: "",
    author: "",
    introduction: "",
    //
    // buy now
    buyNowDlgOpened: false,
    buyNowDlgStep: 0,
    buyNowName: '',
    buyNowPrice: 0,
    buyNowSeller: '',
    buyNowRoyaltyOwner: '',
    buyNowRoyalty: 0,
    buyNowTxHash: '',
    buyNowOrderId: 0,
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
