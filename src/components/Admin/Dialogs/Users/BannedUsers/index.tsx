import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { AdminUsersItemType } from 'src/types/admin-table-data-types';
import { Icon } from '@iconify/react';
import { reduceHexAddress } from 'src/services/common';
import { updateUserRole } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';
import { enumMetEastContractType } from 'src/types/contract-types';
import { enumAuthType } from 'src/types/auth-types';

export interface ComponentProps {
    user2Edit: AdminUsersItemType;
    handleUserUpdate: (value: AdminUsersItemType) => void;
    onClose: () => void;
}

const BannedUsers: React.FC<ComponentProps> = ({ user2Edit, onClose, handleUserUpdate }): JSX.Element => {
    const [signInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === enumAuthType.ElastosEssentials
            ? (walletConnectProvider as any)
            : (library?.provider as any),
    );
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const [remarks, setRemarks] = useState<string>(user2Edit.remarks);

    const handleUpdateUserRole = (methodName: string, state: boolean) => {
        if (!remarks) {
            enqueueSnackbar('Remarks must be set!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        } else if (dialogState.adminUserBannedTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }

        let role = -1;
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
        setDialogState(updatedState);

        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: enumMetEastContractType.METEAST,
            method: methodName,
            price: '0',
            address: user2Edit.address,
            approved: state,
        })
            .then((txHash: string) => {
                console.log(txHash);
                if (!unmounted) setDialogState({ ...updatedState, progressBar: 40 });
                return callContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: enumMetEastContractType.METEAST_MARKET,
                    method: methodName,
                    price: '0',
                    address: user2Edit.address,
                    approved: state,
                });
            })
            .then((txHash: string) => {
                console.log(txHash);
                if (!unmounted) setDialogState({ ...updatedState, progressBar: 70 });
                role = user2Edit.status === 0 ? 3 : 2;
                return updateUserRole(signInDlgState.token, user2Edit.address, role, remarks);
            })
            .then((success: boolean) => {
                if (success) {
                    enqueueSnackbar(`${user2Edit.status === 0 ? 'Ban user' : 'Unban user'} succeed!`, {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    if (!unmounted) {
                        setDialogState({
                            ...updatedState,
                            waitingConfirmDlgOpened: false,
                            progressBar: 100,
                        });
                    }
                    const updatedUserInfo: AdminUsersItemType = {
                        ...user2Edit,
                        status: role === 2 ? 0 : 1,
                        remarks: remarks,
                    };
                    handleUserUpdate(updatedUserInfo);
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Cancel sale error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                        progressBar: 0,
                    });
                }
            })
            .finally(() => {
                setOnProgress(false);
                onClose();
            });
        return () => {
            unmounted = true;
        };
    };

    return (
        <Stack spacing={3} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>{user2Edit.status === 0 ? 'Ban User' : 'Unban User'}</DialogTitleTypo>
            </Stack>
            <Box borderRadius={'50%'} width={80} height={80} overflow="hidden" alignSelf="center">
                {user2Edit.avatar === '' ? (
                    <Icon icon="ph:user" fontSize={80} color="#1890FF" />
                ) : (
                    <img src={user2Edit.avatar} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
                )}
            </Box>
            <CustomTextField
                title="USEN NICKNAME"
                placeholder="JOHN"
                inputValue={
                    user2Edit.username.length > 10 ? reduceHexAddress(user2Edit.username, 4) : user2Edit.username
                }
                disabled
            />
            <CustomTextField
                title="USER ADDRESS"
                placeholder="0xcd681b9edcb...4e4ad5e58688168500c346"
                inputValue={reduceHexAddress(user2Edit.address, 15)}
                disabled
            />
            <CustomTextField
                title="REMARKS"
                placeholder="Enter remarks"
                inputValue={remarks}
                multiline
                rows={3}
                changeHandler={(value: string) => setRemarks(value)}
            />
            <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="primary" fullWidth onClick={onClose}>
                    close
                </PrimaryButton>
                <PrimaryButton
                    btn_color="pink"
                    fullWidth
                    disabled={onProgress}
                    onClick={() => handleUpdateUserRole('setBlacklist', user2Edit.status === 0 ? true : false)}
                >
                    confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BannedUsers;
