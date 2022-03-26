import React from 'react';
import { useDialogContext } from 'src/context/DialogContext';
import MintNFTDlgContainer from 'src/components/TransactionDialogs/MintNFT';
import CreateBlindBoxDlgContainer from '../TransactionDialogs/CreateBlindBox';
import ManageProfileDlgContainer from '../ManageProfile';
import AllBIdsDlgContainer from './AllBids';
import NoBidsDlgContainer from './NoBids';
import AllTransactionsDlgContainer from 'src/components/TransactionDialogs/AllTransactions';
import ErrorMessageDlgContainer from './Others/ErrorMessage';
import WaitingConfirmDlgContainer from './Others/WaitingConfirm';

export interface ComponentProps {}

const TransactionDlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [dialogState, setDialogState] = useDialogContext();
    return (
        <>
            <MintNFTDlgContainer />
            <CreateBlindBoxDlgContainer />
            <ManageProfileDlgContainer />
            <ErrorMessageDlgContainer />
            <WaitingConfirmDlgContainer />
            <AllTransactionsDlgContainer />
            <AllBIdsDlgContainer />
            <NoBidsDlgContainer />
        </>
    );
};

export default TransactionDlgContainer;
