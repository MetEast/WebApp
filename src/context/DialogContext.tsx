import React, { useReducer, createContext, useMemo, useContext } from 'react';

export enum ActionType {
    SET_CREATE_NFT_DLG_OPEN = 'SET_CREATE_NFT_DLG_OPEN',
}

export type Actions = { type: ActionType.SET_CREATE_NFT_DLG_OPEN; value: boolean };

export interface State {
    createNFTDlgOpened: boolean;
}

const defaultState: State = {
    createNFTDlgOpened: false,
};

export interface ContextType extends State {
    actions: {
        setCreateNFTDlgOpen: (value: boolean) => void;
    };
}

function noop() {
    return;
}

const defaultContextValue: ContextType = {
    ...defaultState,
    actions: {
        setCreateNFTDlgOpen: noop,
    },
};

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case ActionType.SET_CREATE_NFT_DLG_OPEN:
            return {
                ...state,
                createNFTDlgOpened: action.value,
            };
        default:
            return state;
    }
};

export const DialogContext = createContext<ContextType>(defaultContextValue);

export const DialogContextProvider: React.FC = ({ children, ...props }) => {
    const [state, dispatch] = useReducer(reducer, defaultState);

    const actions: ContextType['actions'] = useMemo(
        () => ({
            setCreateNFTDlgOpen: (value: boolean) => dispatch({ type: ActionType.SET_CREATE_NFT_DLG_OPEN, value }),
        }),
        [],
    );

    return <DialogContext.Provider value={{ ...state, actions }}>{children}</DialogContext.Provider>;
};

export const useDialogContext = () => useContext(DialogContext);
