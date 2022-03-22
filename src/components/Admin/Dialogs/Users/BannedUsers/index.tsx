import React, { useState, useEffect } from 'react';
import { Stack, Box } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { AdminUsersItemType } from 'src/types/admin-table-data-types';
import { Icon } from '@iconify/react';
import { reduceHexAddress } from 'src/services/common';
import { updateUserRole } from 'src/services/fetch';
import { useSignInContext } from 'src/context/SignInContext';
import { useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';

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
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );
    const [onProgress, setOnProgress] = useState<boolean>(false);
    const [userStatus, setUserStatus] = useState<'user' | 'admin' | 'ban' | 'moderator'>(
        user2Edit.status === 0 ? 'admin' : (user2Edit.status === 1 ? 'moderator' : (user2Edit.status === 2 ? 'user' : 'ban')),
    );
    const [remarks, setRemarks] = useState<string>(user2Edit.remarks);
    const [type, setType] = useState<number>(-1);

    useEffect(() => {
        if (signInDlgState.userRole === 0) {
            // contract deployer
            if (user2Edit.status === 1) setType(3);
            else if (user2Edit.status === 2) setType(2);
            else if (user2Edit.status === 3) setType(1);
        } else {
            // admin
            if (user2Edit.status === 2) setType(0);
            else if (user2Edit.status === 3) setType(1);
        }
    }, [signInDlgState.userRole]);

    const handleUpdateUserRole = (methodName: string, state: boolean) => {
        if (dialogState.cancelSaleTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        let role = -1;
        setOnProgress(true);
        setDialogState({ ...dialogState, waitingConfirmDlgOpened: true });
        const timer = setTimeout(() => {
            setDialogState({ ...dialogState, errorMessageDlgOpened: true, waitingConfirmDlgOpened: false });
        }, 120000);
        callContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 1,
            method: methodName,
            price: '0',
            address: user2Edit.address,
            approved: state,
        })
            .then((txHash: string) => {
                console.log(txHash);
                return callContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 2,
                    method: methodName,
                    price: '0',
                    address: user2Edit.address,
                    approved: state,
                });
            })
            .then((txHash: string) => {
                console.log(txHash);
                role = user2Edit.status === 0 ? 1 : 2;
                return updateUserRole(signInDlgState.token, user2Edit.address, role, '');
            })
            .then((success: boolean) => {
                if (success) {
                    enqueueSnackbar(`${user2Edit.status === 0 ? 'Add Moderator' : 'Remove Moderator'} succeed!`, {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    setDialogState({
                        ...dialogState,
                        waitingConfirmDlgOpened: false,
                    });
                    const updatedUserInfo: AdminUsersItemType = {
                        ...user2Edit,
                        status: role === 1 ? 1 : 0,
                        remarks: '',
                    };
                    handleUserUpdate(updatedUserInfo);
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Cancel sale error: ${error}!`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                setDialogState({
                    ...dialogState,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                setOnProgress(false);
                clearTimeout(timer);
                onClose();
            });
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
            <CustomTextField title="USEN NICKNAME" placeholder="JOHN" disabled />
            <CustomTextField title="USER ADDRESS" placeholder="0xcd681b9edcb...4e4ad5e58688168500c346" disabled />
            <CustomTextField title="REMARKS" placeholder="Enter remarks" multiline rows={3} />
            <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="primary" fullWidth onClick={onClose}>
                    close
                </PrimaryButton>
                <PrimaryButton btn_color="pink" fullWidth>
                    confirm
                </PrimaryButton>
            </Stack>
        </Stack>
    );
};

export default BannedUsers;
