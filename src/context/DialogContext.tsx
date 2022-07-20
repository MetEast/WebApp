import React, { createContext, useState, useContext } from 'react';
import { blankNFTTxs } from 'src/constants/init-constants';
import { TypeNFTTransaction } from 'src/types/product-types';
// import { TypeYourEarning } from 'src/types/product-types';
import { TypeSelectItem } from 'src/types/select-types';

interface DlgState {
    // profile
    manageProfileDlgOpened: boolean;
    editProfileDlgOpened: boolean;
    earningDlgOpened: boolean;
    // earningList: TypeYourEarning[];
    // confirm transaction
    waitingConfirmDlgOpened: boolean;
    waitingConfirmDlgTimer: ReturnType<typeof setTimeout> | null;
    loadingDlgOpened: boolean;
    // error msg
    errorMessageDlgOpened: boolean;
    // all transactions
    allTxDlgOpened: boolean;
    allTxNFTCreation: TypeNFTTransaction;
    // all bids
    allBidDlgOpened: boolean;
    receivedBidDlgOpened: boolean;
    noBidDlgOpened: boolean;
    // progres bar
    progressBar: number;
    // mint nft
    createNFTDlgOpened: boolean;
    createNFTDlgStep: number;
    mintCategory: TypeSelectItem;
    mintTitle: string;
    mintIntroduction: string;
    mintFile: File;
    mintRoyalties: number;
    mintTokenId: string;
    mintTokenUri: string;
    // mintDidUri: string;
    mintTxHash: string;
    mintTxFee: number;
    // burn nft
    burnNFTDlgOpened: boolean;
    burnTxFee: number;
    burnTokenId: string;
    // create order for sale/auction
    sellSaleType: 'buynow' | 'auction';
    sellSaleEnds: number;
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
    placeBidLastBid: number;
    placeBidAmount: number;
    // placeBidExpire: TypeSelectItem;
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
    crtBlindImage: File;
    crtBlindTokenIds: string;
    crtBlindTokenNames: string;
    // crtBlindStatus: 'offline' | 'online';
    crtBlindQuantity: number;
    crtBlindPrice: number;
    crtBlindSaleBegin: string;
    crtBlindSaleEnd: string;
    crtBlindPurchases: number;
    crtBlindTxFee: number;
    crtBlindTxHash: string;
    // buy blind box
    buyBlindBoxDlgOpened: boolean;
    buyBlindBoxDlgStep: number;
    buyBlindBoxId: string;
    buyBlindName: string;
    buyBlindPriceEla: number;
    buyBlindPriceUsd: number;
    buyBlindAmount: number;
    buyBlindOrderIds: string[];
    buyBlindTokenIds: string[];
    buyBlindCreators: string[];
    buyBlindImages: string[];
    buyBlindNames: string[];
    buyBlindTxFee: number;
    buyBlindTxHash: string;
    buyBlindMaxPurchases: number;
    buyBlindInstock: number;
    // admin
    adminTakedownTxFee: number;
    adminUserBannedTxFee: number;
    adminUserModeratorTxFee: number;
    // rewards
    becomeDAODlgOpened: boolean;
    becomeDAOTxFee: number;
    removeDAODlgOpened: boolean;
    removeDAOTxFee: number;
    withdrawRewardTxFee: number;
}

export const defaultDlgState: DlgState = {
    // profile
    manageProfileDlgOpened: false,
    editProfileDlgOpened: false,
    earningDlgOpened: false,
    // confirm transaction
    waitingConfirmDlgOpened: false,
    waitingConfirmDlgTimer: null,
    loadingDlgOpened: false,
    // error msg
    errorMessageDlgOpened: false,
    // all transactions
    allTxDlgOpened: false,
    allTxNFTCreation: blankNFTTxs,
    // all bids
    allBidDlgOpened: false,
    receivedBidDlgOpened: false,
    noBidDlgOpened: false,
    // progress bar
    progressBar: 0,
    // mint nft
    createNFTDlgOpened: false,
    createNFTDlgStep: 0,
    mintTitle: '',
    mintCategory: { label: '', value: '' },
    mintIntroduction: '',
    mintFile: new File([''], ''),
    mintRoyalties: -1,
    mintTokenId: '',
    mintTokenUri: '',
    // mintDidUri: '',
    mintTxHash: '',
    mintTxFee: 0,
    // burn nft
    burnNFTDlgOpened: false,
    burnTxFee: 0,
    burnTokenId: '',
    // create order for sale/auction
    sellSaleType: 'buynow',
    sellSaleEnds: 0,
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
    placeBidLastBid: -1,
    placeBidAmount: 0,
    // placeBidExpire: { label: '', value: '' },
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
    crtBlindImage: new File([''], ''),
    crtBlindTokenIds: '',
    crtBlindTokenNames: '',
    // crtBlindStatus: 'offline',
    crtBlindQuantity: 0,
    crtBlindPrice: 0,
    crtBlindSaleBegin: '',
    crtBlindSaleEnd: '',
    crtBlindPurchases: 0,
    crtBlindTxFee: 0,
    crtBlindTxHash: '',
    // buy blind box
    buyBlindBoxDlgOpened: false,
    buyBlindBoxDlgStep: 0,
    buyBlindBoxId: '',
    buyBlindName: '',
    buyBlindPriceEla: 0,
    buyBlindPriceUsd: 0,
    buyBlindAmount: 0,
    buyBlindOrderIds: [],
    buyBlindTokenIds: [],
    buyBlindImages: [],
    buyBlindNames: [],
    buyBlindTxFee: 0,
    buyBlindTxHash: '',
    buyBlindCreators: [],
    buyBlindMaxPurchases: 0,
    buyBlindInstock: 0,
    // admin
    adminTakedownTxFee: 0,
    adminUserBannedTxFee: 0,
    adminUserModeratorTxFee: 0,
    // rewards
    becomeDAODlgOpened: false,
    becomeDAOTxFee: 0,
    removeDAODlgOpened: false,
    removeDAOTxFee: 0,
    withdrawRewardTxFee: 0,
};

type ContextType<TValue> = [TValue, (newValue: TValue) => void];

const defaultContextValue: ContextType<DlgState> = [defaultDlgState, () => {}];

export const DialogContext = createContext(defaultContextValue);

export const DialogContextProvider: React.FC = ({ children, ...props }) => {
    const [contextState, setContextState] = useState<DlgState>(defaultDlgState);

    const ctxValue: ContextType<DlgState> = [
        contextState,
        (value: DlgState) => {
            setContextState(value);
        },
    ];

    return <DialogContext.Provider value={ctxValue}>{children}</DialogContext.Provider>;
};

export const useDialogContext = () => useContext(DialogContext);
