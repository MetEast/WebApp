import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { DialogTitleTypo } from '../../../styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import WarningTypo from '../../../components/WarningTypo';
import CustomTextField from 'src/components/TextField';
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
import { enumCallMethodType, enumMETokenContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {
    onClose: () => void;
}

const RemoveDAO: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === enumAuthType.ElastosEssentials
            ? (walletConnectProvider as any)
            : (library?.provider as any),
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
            contractType: enumMETokenContractType.MET_STAKING,
            callType: enumCallMethodType.CALL,
            method: 'stakedAmount',
            price: '0',
        })
            .then((result: string) => {
                if (parseFloat((parseInt(result) / 1e18).toFixed(2)) < 10000) {
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
                    contractType: enumMETokenContractType.MET_STAKING,
                    callType: enumCallMethodType.SEND,
                    method: 'withdraw',
                    price: '0',
                }).then(() => {
                    enqueueSnackbar('Withdraw succeed!', {
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
                enqueueSnackbar(`Withdraw error.`, {
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
        <Stack spacing={5} width={420}>
            <Stack alignItems="center" spacing={1}>
                <DialogTitleTypo>Remove DAO</DialogTitleTypo>
                <Typography fontSize={15} fontWeight={400} color="black" textAlign="center">
                    By removing your locked 10,000{' '}
                    <Typography fontSize={15} fontWeight={500} color="#1890FF" display="inline">
                        ME
                    </Typography>
                    , you will no longer be able to receive DAO related rewards.
                </Typography>
            </Stack>
            <Stack spacing={0.5}>
                <Typography fontSize={12} fontWeight={700} color="black">
                    Amount of{' '}
                    <Typography fontSize={12} fontWeight={700} color="#1890FF" display="inline">
                        ME
                    </Typography>{' '}
                    to remove.
                </Typography>
                <CustomTextField number={true} inputValue={'10,000'} disabled />
            </Stack>
            <Stack alignItems="center" spacing={1}>
                <Typography fontSize={14} fontWeight={600}>
                    Available: {`${signInDlgState.meTokenBalance} `}
                    <Typography fontSize={14} fontWeight={600} color="#1890FF" display="inline">
                        ME
                    </Typography>
                </Typography>
                <Stack direction="row" width="100%" spacing={2}>
                    <PrimaryButton fullWidth btn_color="secondary" onClick={onClose}>
                        Close
                    </PrimaryButton>
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleWithdraw}>
                        Remove
                    </PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default RemoveDAO;
