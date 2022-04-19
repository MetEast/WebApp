import React, { useState } from 'react';
import ModalDialog from 'src/components/ModalDialog';
import RemoveDAO from './RemoveDAO';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callTokenomicsContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { METEAST_STAKING_TOKEN_CONTRACT_ADDRESS } from 'src/contracts/METokenStaking';

export interface ComponentProps {}

const RemoveDAODlgContainer: React.FC<ComponentProps> = (): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );
    
    const handleWithdraw = () => {
        if (dialogState.removeDAOTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        setOnProgress(true);
        let unmounted = false;
        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.progressBar = 30;
        updatedState.waitingConfirmDlgTimer = setTimeout(() => {
            setDialogState({
                ...defaultDlgState,
                errorMessageDlgOpened: true,
            });
        }, 120000);
        if (!unmounted) setDialogState(updatedState);

        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 3, // staking
            callType: 2,
            method: 'isStakeholder',
            price: '0',
        })
            .then((result: string) => {
                if (Boolean(result) === false) {
                    enqueueSnackbar('You are not a stakeholder.', {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    if (!unmounted) {
                        setDialogState({
                            ...updatedState,
                            removeDAODlgOpened: false,
                            waitingConfirmDlgOpened: false,
                            progressBar: 0,
                        });
                    }
                    return;
                }
                if (!unmounted) setDialogState({ ...updatedState, progressBar: 70 });
                callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 3, // staking
                    callType: 1,
                    method: 'withdraw',
                    price: '0',
                }).then((txHash: string) => {
                    enqueueSnackbar('Lock up succeed!', {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    if (!unmounted) {
                        setDialogState({
                            ...updatedState,
                            removeDAODlgOpened: false,
                            waitingConfirmDlgOpened: false,
                            progressBar: 100,
                        });
                    }
                });
            })
            .catch((error) => {
                enqueueSnackbar(`Lock up error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        removeDAODlgOpened: false,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                        progressBar: 0,
                    });
                }
            })
            .finally(() => {
                setOnProgress(false);
            });
        return () => {
            unmounted = true;
        };
    };

    return (
        <ModalDialog
            open={dialogState.removeDAODlgOpened}
            onClose={() => {
                setDialogState({ ...dialogState, removeDAODlgOpened: false, progressBar: 0 });
            }}
        >
            <RemoveDAO
                onClose={() => {
                    setDialogState({ ...dialogState, removeDAODlgOpened: false });
                }}
            />
        </ModalDialog>
    );
};

export default RemoveDAODlgContainer;
