import React, { createContext, useState, useContext } from 'react';
import { TypeSelectItem } from 'src/types/select-types';


interface State {
    createNFTDlgOpened: boolean;
    createNFTDlgStep: number;
    category: TypeSelectItem;
    title: string;
    author: string;
    introduction: string;
    file?: File;
}

const defaultState: State = {
    createNFTDlgOpened: false,
    createNFTDlgStep: 0,
    category: {label: "", value: ""},
    title: "",
    author: "",
    introduction: ""
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
