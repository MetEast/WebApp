import React, { useState, useEffect } from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import ClaimBox from '../ClaimBox';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callContractMethod, callTokenomicsContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam } from 'src/constants/init-constants';

const TransactionReward: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
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
    const [totalRewards, setTotalRewards] = useState<string>('0');
    useEffect(() => {
        let unmounted = false;
        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 1,
            callType: 2,
            method: "getTotalRewardAsBuyer",
        }).then((result: string) => {
            alert(result)
           if(!unmounted) setTotalRewards(result); 
        });
        return () => {
            unmounted = true;
        };
    }, []);

    // const handleUpdateUserRole = (methodName: string) => {
    //     if (dialogState.adminUserModeratorTxFee > signInDlgState.walletBalance) {
    //         enqueueSnackbar('Insufficient balance!', {
    //             variant: 'error',
    //             anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //         });
    //         return;
    //     }
    //     let role = -1;
    //     setOnProgress(true);
    //     let unmounted = false;

    //     const updatedState = { ...dialogState };
    //     updatedState.waitingConfirmDlgOpened = true;
    //     updatedState.progressBar = 10;
    //     updatedState.waitingConfirmDlgTimer = setTimeout(() => {
    //         setDialogState({
    //             ...defaultDlgState,
    //             errorMessageDlgOpened: true,
    //         });
    //     }, 120000);
    //     if (!unmounted) setDialogState(updatedState);

    //     callContractMethod(walletConnectWeb3, {
    //         ...blankContractMethodParam,
    //         contractType: 1,
    //         method: methodName,
    //         price: '0',
    //         address: user2Edit.address,
    //     })
    //         .then((txHash: string) => {
    //             if (!unmounted) setDialogState({ ...updatedState, progressBar: 40 });
    //             return callContractMethod(walletConnectWeb3, {
    //                 ...blankContractMethodParam,
    //                 contractType: 2,
    //                 method: methodName,
    //                 price: '0',
    //                 address: user2Edit.address,
    //             });
    //         })
    //         .then((txHash: string) => {
    //             console.log(txHash);
    //             if (!unmounted) setDialogState({ ...updatedState, progressBar: 70 });
    //             role = user2Edit.status === 0 ? 1 : 2;
    //             return updateUserRole(signInDlgState.token, user2Edit.address, role, '');
    //         })
    //         .then((success: boolean) => {
    //             if (success) {
    //                 enqueueSnackbar(`${user2Edit.status === 0 ? 'Add Moderator' : 'Remove Moderator'} succeed!`, {
    //                     variant: 'success',
    //                     anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //                 });
    //                 if (!unmounted) {
    //                     setDialogState({
    //                         ...updatedState,
    //                         waitingConfirmDlgOpened: false,
    //                         progressBar: 100,
    //                     });
    //                 }
    //                 const updatedUserInfo: AdminUsersItemType = {
    //                     ...user2Edit,
    //                     status: role === 1 ? 1 : 0,
    //                     remarks: '',
    //                 };
    //                 handleUserUpdate(updatedUserInfo);
    //             }
    //         })
    //         .catch((error) => {
    //             enqueueSnackbar(`Cancel sale error.`, {
    //                 variant: 'error',
    //                 anchorOrigin: { horizontal: 'right', vertical: 'top' },
    //             });
    //             if (!unmounted) {
    //                 setDialogState({
    //                     ...updatedState,
    //                     waitingConfirmDlgOpened: false,
    //                     errorMessageDlgOpened: true,
    //                     progressBar: 0,
    //                 });
    //             }
    //         })
    //         .finally(() => {
    //             setOnProgress(false);
    //             onClose();
    //         });
    //     return () => {
    //         unmounted = true;
    //     };
    // };
    
    return (
        <Box borderRadius={3} paddingX={{ xs: 4, md: 8 }} paddingY={{ xs: 4, md: 7 }} sx={{ background: '#E8F4FF' }}>
            <Grid container columns={10} columnSpacing={8} rowGap={2.5}>
                <Grid item xs={10} md={6}>
                    <Stack
                        direction={{ xs: 'row', md: 'column' }}
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        spacing={{ xs: 0.5, md: 0 }}
                    >
                        <img
                            src="/assets/images/rewards/transaction-reward-icon.svg"
                            width={matchDownMd ? 26 : 42}
                            height={matchDownMd ? 26 : 42}
                            alt=""
                        />
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography fontSize={{ xs: 20, md: 40 }} fontWeight={500} color="#1890FF">
                                Transaction reward
                            </Typography>
                            <Icon
                                icon="ph:question"
                                fontSize={18}
                                color="#1890FF"
                                style={{ marginTop: matchDownMd ? 2 : 14 }}
                            />
                        </Stack>
                    </Stack>
                    <Typography fontSize={{ xs: 12, md: 16 }} fontWeight={500} color="#1890FF" marginTop={1}>
                        After completing an NFT transaction, users are eligible to receive ME tokens on the following
                        basis:
                    </Typography>
                    <Typography fontSize={{ xs: 12, md: 16 }} fontWeight={500} color="#1890FF" marginTop={2}>
                        Tokens to be Received = [(#Td/TTVd) X (NFT Transaction Volume) X (0.5)]
                    </Typography>
                </Grid>
                <Grid item xs={10} md={4}>
                    <Typography fontSize={{ xs: 15, md: 20 }} fontWeight={500} color="#1890FF">
                        ME{' '}
                        <Typography fontSize={{ xs: 15, md: 20 }} fontWeight={500} color="black" display="inline">
                            to be claimed
                        </Typography>
                    </Typography>
                    <ClaimBox sx={{ marginTop: 1.5 }} />
                    <Typography
                        fontSize={{ xs: 12, md: 14 }}
                        fontWeight={500}
                        color="#1890FF"
                        lineHeight={1.2}
                        marginTop={2.5}
                    >
                        Users can claim rewards every day, or accumulate a one-time claim. Rewards never disappear or
                        expire.
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" marginTop={2}>
                        <Typography fontSize={{ xs: 12, md: 14 }} fontWeight={500} color="#1890FF">
                            The most recent receipt received:
                        </Typography>
                        <Typography fontSize={{ xs: 12, md: 14 }} fontWeight={500} color="#1890FF">
                            --
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" marginTop={0.5}>
                        <Typography fontSize={{ xs: 12, md: 14 }} fontWeight={500} color="#1890FF">
                            Received so far:
                        </Typography>
                        <Typography fontSize={{ xs: 12, md: 14 }} fontWeight={500} color="#1890FF">
                            {totalRewards}
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransactionReward;
