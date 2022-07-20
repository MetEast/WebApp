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
import { contractConfig } from 'src/config';

export interface ComponentProps {
    onClose: () => void;
}

const BecomeDAO: React.FC<ComponentProps> = ({ onClose }): JSX.Element => {
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

    const handleStake = () => {
        if (!(dialogState.becomeDAOTxFee <= signInDlgState.walletBalance && signInDlgState.meTokenBalance >= 10000)) {
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
        updatedState.progressBar = 10;
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
                if (parseInt(result)) {
                    enqueueSnackbar('Can not stake more than once.', {
                        variant: 'error',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    if (!unmounted) {
                        setDialogState({
                            ...updatedState,
                            becomeDAODlgOpened: false,
                            waitingConfirmDlgOpened: false,
                            progressBar: 0,
                        });
                    }
                    return;
                }
                if (!unmounted) setDialogState({ ...updatedState, progressBar: 30 });
                callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: enumMETokenContractType.MET_BASE,
                    callType: enumCallMethodType.CALL,
                    method: 'allowance',
                    price: '0',
                    address: contractConfig.MET_STAKING_CONTRACT,
                })
                    .then((allowance: string) => {
                        if (!unmounted) setDialogState({ ...updatedState, progressBar: 50 });
                        if (parseInt(allowance) / 1e18 < 10000) {
                            return callTokenomicsContractMethod(walletConnectWeb3, {
                                ...blankContractMethodParam,
                                contractType: enumMETokenContractType.MET_BASE,
                                callType: enumCallMethodType.SEND,
                                method: 'approve',
                                price: '0',
                                address: contractConfig.MET_STAKING_CONTRACT,
                                _price: BigInt(10000 * 1e18).toString(),
                            });
                        }
                        return 'pass';
                    })
                    .then((result: string) => {
                        if (!unmounted) setDialogState({ ...updatedState, progressBar: 70 });
                        return callTokenomicsContractMethod(walletConnectWeb3, {
                            ...blankContractMethodParam,
                            contractType: enumMETokenContractType.MET_STAKING, // staking
                            callType: enumCallMethodType.SEND,
                            method: 'stake',
                            price: '0',
                            _price: BigInt(10000 * 1e18).toString(),
                        });
                    })
                    .then(() => {
                        enqueueSnackbar('Lock up succeed!', {
                            variant: 'success',
                            anchorOrigin: { horizontal: 'right', vertical: 'top' },
                        });
                        if (!unmounted) {
                            setDialogState({
                                ...updatedState,
                                becomeDAODlgOpened: false,
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
                        becomeDAODlgOpened: false,
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
                <DialogTitleTypo>Become DAO</DialogTitleTypo>
                <Typography fontSize={15} fontWeight={400} color="black" textAlign="center">
                    Locking-up 10,000{' '}
                    <Typography fontSize={15} fontWeight={500} color="#1890FF" display="inline">
                        ME
                    </Typography>
                    , you can get 10% rewards when you trade NFTs.
                </Typography>
            </Stack>
            <Stack spacing={0.5}>
                <Typography fontSize={12} fontWeight={700} color="black">
                    Amount of{' '}
                    <Typography fontSize={12} fontWeight={700} color="#1890FF" display="inline">
                        ME
                    </Typography>{' '}
                    to lock-up.
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
                    <PrimaryButton fullWidth disabled={onProgress} onClick={handleStake}>
                        Lock-up
                    </PrimaryButton>
                </Stack>
                <WarningTypo width={240}>
                    In case of payment problems, please contact the official customer service
                </WarningTypo>
            </Stack>
        </Stack>
    );
};

export default BecomeDAO;
