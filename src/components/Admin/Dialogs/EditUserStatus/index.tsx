import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { DialogTitleTypo } from 'src/components/ModalDialog/styles';
import { PrimaryButton } from 'src/components/Buttons/styles';
import CustomTextField from 'src/components/TextField';
import { AdminUsersItemType } from 'src/types/admin-table-data-types';
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
import { Icon } from '@iconify/react';

export interface ComponentProps {
    user2Edit: AdminUsersItemType;
    handleUserUpdate: (value: AdminUsersItemType) => void;
    onClose: () => void;
}

const EditUserStatus: React.FC<ComponentProps> = ({ user2Edit, handleUserUpdate, onClose }): JSX.Element => {
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
        user2Edit.status === 0
            ? 'admin'
            : user2Edit.status === 1
            ? 'moderator'
            : user2Edit.status === 2
            ? 'user'
            : 'ban',
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
        if (dialogState.adminUserBannedTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        let role = -1;
        setOnProgress(true);

        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.waitingConfirmDlgTimer = setTimeout(() => {
            setDialogState({
                ...defaultDlgState,
                errorMessageDlgOpened: true,
            });
        }, 120000);
        setDialogState(updatedState);

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
                role = userStatus === 'admin' ? 1 : userStatus === 'user' ? 2 : 3;
                return updateUserRole(signInDlgState.token, user2Edit.address, role, remarks);
            })
            .then((success: boolean) => {
                if (success) {
                    enqueueSnackbar(`${methodName} succeed!`, {
                        variant: 'success',
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    });
                    setDialogState({
                        ...dialogState,
                        waitingConfirmDlgOpened: false,
                    });
                    const updatedUserInfo: AdminUsersItemType = {
                        ...user2Edit,
                        status: Math.abs(role - 1),
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
                setDialogState({
                    ...dialogState,
                    waitingConfirmDlgOpened: false,
                    errorMessageDlgOpened: true,
                });
            })
            .finally(() => {
                setOnProgress(false);
                onClose();
            });
    };

    return (
        <Stack spacing={3} width={340}>
            <Stack alignItems="center">
                <DialogTitleTypo>Edit User Status</DialogTitleTypo>
            </Stack>
            <Box borderRadius={'50%'} width={80} height={80} overflow="hidden" alignSelf="center">
                {user2Edit.avatar === '' ? (
                    <Icon icon="ph:user" fontSize={80} color="#1890FF" />
                ) : (
                    <img src={user2Edit.avatar} width="100%" height="100%" style={{ objectFit: 'cover' }} alt="" />
                )}
            </Box>
            <CustomTextField title="USEN NICKNAME" inputValue={user2Edit.username} disabled />
            <CustomTextField title="USER ADDRESS" inputValue={user2Edit.address} disabled />
            {/* <Stack spacing={0.5}>
                <Typography fontSize={12} fontWeight={700}>
                    STATUS
                </Typography>
                <Stack direction="row" spacing={1}>
                    <PrimaryButton
                        size="small"
                        fullWidth
                        btn_color={userStatus === 'user' ? 'primary' : 'secondary'}
                        onClick={() => setUserStatus('user')}
                    >
                        user
                    </PrimaryButton>
                    <PrimaryButton
                        size="small"
                        fullWidth
                        btn_color={userStatus === 'admin' ? 'primary' : 'secondary'}
                        onClick={() => setUserStatus('admin')}
                    >
                        admin
                    </PrimaryButton>
                    <PrimaryButton
                        size="small"
                        fullWidth
                        btn_color={userStatus === 'ban' ? 'primary' : 'secondary'}
                        onClick={() => setUserStatus('ban')}
                    >
                        ban
                    </PrimaryButton>
                </Stack>
            </Stack> */}
            <CustomTextField
                title="REMARKS"
                placeholder="Enter remarks"
                multiline
                rows={3}
                inputValue={remarks}
                changeHandler={(value: string) => setRemarks(value)}
            />
            {/* <Stack direction="row" spacing={2}>
                <PrimaryButton btn_color="secondary" fullWidth onClick={onClose}>
                    close
                </PrimaryButton>
                <PrimaryButton btn_color="pink" fullWidth disabled={onProgress} onClick={handleUpdateUserRole}>
                    Confirm
                </PrimaryButton>
            </Stack> */}
            <Stack spacing={2}>
                {type === 0 && (
                    <PrimaryButton
                        btn_color="pink"
                        fullWidth
                        disabled={onProgress}
                        onClick={() => handleUpdateUserRole('setBlacklist', true)}
                    >
                        ban general user
                    </PrimaryButton>
                )}
                {type === 1 && (
                    <PrimaryButton
                        btn_color="secondary"
                        fullWidth
                        disabled={onProgress}
                        onClick={() => handleUpdateUserRole('setBlacklist', false)}
                    >
                        unban general user
                    </PrimaryButton>
                )}
                {type === 2 && (
                    <>
                        <PrimaryButton
                            btn_color="green"
                            fullWidth
                            disabled={onProgress}
                            onClick={() => handleUpdateUserRole('addManager', false)}
                        >
                            add admin
                        </PrimaryButton>
                        <PrimaryButton
                            btn_color="pink"
                            fullWidth
                            disabled={onProgress}
                            onClick={() => handleUpdateUserRole('setBlacklist', true)}
                        >
                            ban general user
                        </PrimaryButton>
                    </>
                )}
                {type === 3 && (
                    <PrimaryButton
                        btn_color="pink"
                        fullWidth
                        disabled={onProgress}
                        onClick={() => handleUpdateUserRole('removeManager', false)}
                    >
                        remove admin
                    </PrimaryButton>
                )}
            </Stack>
        </Stack>
    );
};

export default EditUserStatus;
