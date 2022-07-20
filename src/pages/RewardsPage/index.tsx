import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Container from 'src/components/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TransactionReward from 'src/components/Rewards/TransactionReward';
import GovernanceReward from 'src/components/Rewards/GovernanceReward';
import Royalties from 'src/components/Rewards/Royalties';
import { SignInState, useSignInContext } from 'src/context/SignInContext';
import { defaultDlgState, useDialogContext } from 'src/context/DialogContext';
import { useSnackbar } from 'notistack';
import Web3 from 'web3';
import { essentialsConnector } from 'src/components/ConnectWallet/EssentialsConnectivity';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { isInAppBrowser } from 'src/services/wallet';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { callTokenomicsContractMethod } from 'src/components/ContractMethod';
import { blankContractMethodParam, blankMiningReward } from 'src/constants/init-constants';
import { enumCallMethodType, enumMETokenContractType, TypeMiningReward } from 'src/types/contract-types';
import { Icon } from '@iconify/react';
import { enumAuthType } from 'src/types/auth-types';

const RewardsPage: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const [signInDlgState, setSignInDlgState] = useSignInContext();
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
    const [creatorRewards, setCreatorRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [buyerRewards, setBuyerRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [stakerRewards, setStakerRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        let unmounted = false;
        if (
            signInDlgState.loginType === enumAuthType.ElastosEssentials ||
            (library && signInDlgState.loginType === enumAuthType.MetaMask)
        ) {
            callTokenomicsContractMethod(walletConnectWeb3, {
                ...blankContractMethodParam,
                contractType: enumMETokenContractType.MET_BASE,
                callType: enumCallMethodType.CALL,
                method: 'balanceOf',
            })
                .then((balance: string) => {
                    if (!unmounted) {
                        setSignInDlgState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.meTokenBalance = parseFloat((parseInt(balance) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                    return callTokenomicsContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMETokenContractType.MET_STAKING,
                        callType: enumCallMethodType.CALL,
                        method: 'stakedAmount',
                    });
                })
                .then((stakedAmount: string) => {
                    if (!unmounted) {
                        setSignInDlgState((prevState: SignInState) => {
                            const _state = { ...prevState };
                            _state.isStakeHolder =
                                parseFloat((parseInt(stakedAmount) / 1e18).toFixed(2)) >= 10000 ? true : false;
                            return _state;
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        library,
        signInDlgState.loginType,
        signInDlgState.walletAccounts,
        dialogState.becomeDAODlgOpened,
        dialogState.removeDAODlgOpened,
    ]);

    useEffect(() => {
        let unmounted = false;
        if (
            signInDlgState.loginType === enumAuthType.ElastosEssentials ||
            (library && signInDlgState.loginType === enumAuthType.MetaMask)
        ) {
            callTokenomicsContractMethod(walletConnectWeb3, {
                ...blankContractMethodParam,
                contractType: enumMETokenContractType.MET_MINING_REWARD,
                callType: enumCallMethodType.CALL,
                method: 'getReceivedRewardAsBuyer',
            })
                .then((_receivedReward: string) => {
                    if (!unmounted) {
                        setBuyerRewards((prevState: TypeMiningReward) => {
                            const _state = { ...prevState };
                            _state.receivedReward = parseFloat((parseInt(_receivedReward) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                    return callTokenomicsContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMETokenContractType.MET_MINING_REWARD,
                        callType: enumCallMethodType.CALL,
                        method: 'getAvailableRewardAsBuyer',
                    });
                })
                .then((_availableReward: string) => {
                    if (!unmounted) {
                        setBuyerRewards((prevState: TypeMiningReward) => {
                            const _state = { ...prevState };
                            _state.availableToken = parseFloat((parseInt(_availableReward) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                    return callTokenomicsContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMETokenContractType.MET_MINING_REWARD,
                        callType: enumCallMethodType.CALL,
                        method: 'getReceivedRewardAsCreator',
                    });
                })
                .then((_receivedReward: string) => {
                    if (!unmounted) {
                        setCreatorRewards((prevState: TypeMiningReward) => {
                            const _state = { ...prevState };
                            _state.receivedReward = parseFloat((parseInt(_receivedReward) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                    return callTokenomicsContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMETokenContractType.MET_MINING_REWARD,
                        callType: enumCallMethodType.CALL,
                        method: 'getAvailableRewardAsCreator',
                    });
                })
                .then((_availableReward: string) => {
                    if (!unmounted) {
                        setCreatorRewards((prevState: TypeMiningReward) => {
                            const _state = { ...prevState };
                            _state.availableToken = parseFloat((parseInt(_availableReward) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                    return callTokenomicsContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMETokenContractType.MET_MINING_REWARD,
                        callType: enumCallMethodType.CALL,
                        method: 'getReceivedRewardAsStaker',
                    });
                })
                .then((_receivedReward: string) => {
                    if (!unmounted) {
                        setStakerRewards((prevState: TypeMiningReward) => {
                            const _state = { ...prevState };
                            _state.receivedReward = parseFloat((parseInt(_receivedReward) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                    return callTokenomicsContractMethod(walletConnectWeb3, {
                        ...blankContractMethodParam,
                        contractType: enumMETokenContractType.MET_MINING_REWARD,
                        callType: enumCallMethodType.CALL,
                        method: 'getAvailableRewardAsStaker',
                    });
                })
                .then((_availableReward: string) => {
                    if (!unmounted) {
                        setStakerRewards((prevState: TypeMiningReward) => {
                            const _state = { ...prevState };
                            _state.availableToken = parseFloat((parseInt(_availableReward) / 1e18).toFixed(2));
                            return _state;
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [library, signInDlgState.loginType, signInDlgState.walletAccounts, reload]);

    const withdrawReward = (rewardType: number) => {
        if (dialogState.withdrawRewardTxFee > signInDlgState.walletBalance) {
            enqueueSnackbar('Insufficient balance!', {
                variant: 'error',
                anchorOrigin: { horizontal: 'right', vertical: 'top' },
            });
            return;
        }
        let unmounted = false;
        const updatedState = { ...dialogState };
        updatedState.waitingConfirmDlgOpened = true;
        updatedState.waitingConfirmDlgTimer = setTimeout(() => {
            setDialogState({
                ...defaultDlgState,
                errorMessageDlgOpened: true,
            });
        }, 120000);
        if (!unmounted) setDialogState(updatedState);

        const methodName =
            rewardType === 1
                ? 'withdrawBuyerReward'
                : rewardType === 2
                ? 'withdrawCreatorReward'
                : 'withdrawStakerReward';
        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: enumMETokenContractType.MET_MINING_REWARD,
            callType: enumCallMethodType.SEND,
            method: methodName,
        })
            .then((txHash: string) => {
                enqueueSnackbar('Withdraw succeed!', {
                    variant: 'success',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        waitingConfirmDlgOpened: false,
                    });
                    setReload(!reload);
                }
            })
            .catch((error) => {
                enqueueSnackbar(`Withdraw error.`, {
                    variant: 'error',
                    anchorOrigin: { horizontal: 'right', vertical: 'top' },
                });
                if (!unmounted) {
                    setDialogState({
                        ...updatedState,
                        waitingConfirmDlgOpened: false,
                        errorMessageDlgOpened: true,
                    });
                }
            });
        return () => {
            unmounted = true;
        };
    };

    return (
        <Stack>
            <Box position="relative">
                <img src="/assets/images/rewards/banner.jpg" width="100%" height="100%" alt="" />
                <Box position="absolute" sx={{ inset: 0 }} display="none">
                    <Container sx={{ height: '100%', overflow: 'visible' }}>
                        <Stack height="100%" justifyContent="center" alignItems="flex-start">
                            <Stack direction="row" alignItems="flex-end">
                                <Typography
                                    component="div"
                                    fontSize={{ xs: 32, sm: 48, md: 62 }}
                                    fontWeight={600}
                                    lineHeight={1}
                                    color="#1890FF"
                                >
                                    ME ERC20{` `}
                                    <Typography
                                        fontSize={{ xs: 32, sm: 48, md: 62 }}
                                        fontWeight={600}
                                        lineHeight={1}
                                        color="#4BBFE0"
                                        display="inline"
                                    >
                                        Token
                                    </Typography>
                                </Typography>
                                <Icon
                                    icon="ph:question"
                                    fontSize={matchDownSm ? 16 : matchDownMd ? 24 : 28}
                                    color="#4BBFE0"
                                    style={{
                                        marginBottom: matchDownSm ? 4 : 6,
                                        marginLeft: matchDownSm ? 6 : 12,
                                    }}
                                />
                            </Stack>
                            <Stack marginLeft={0} marginTop={{ xs: 1.5, sm: 3, md: 4.5 }}>
                                <Typography fontSize={{ xs: 16, sm: 24, md: 36 }} fontWeight={600} color="#757575">
                                    Mining Pool Total Supply:
                                </Typography>
                                <Typography fontSize={{ xs: 16, sm: 24, md: 36 }} fontWeight={600} color="black">
                                    250,000,000 ME
                                </Typography>
                                <Typography
                                    fontSize={{ xs: 16, sm: 24, md: 36 }}
                                    fontWeight={600}
                                    color="#757575"
                                    marginTop={{ xs: 1, md: 3.5 }}
                                >
                                    20% Unlocked:
                                </Typography>
                                <Typography fontSize={{ xs: 16, sm: 24, md: 36 }} fontWeight={600} color="black">
                                    50,000,000 ME
                                </Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
            </Box>
            <Container sx={{ marginTop: { xs: 4, sm: 8, md: 14 } }}>
                <Stack spacing={{ xs: 4, sm: 8, md: 14 }}>
                    <TransactionReward rewards={buyerRewards} withdrawReward={withdrawReward} />
                    <GovernanceReward rewards={stakerRewards} withdrawReward={withdrawReward} />
                    <Royalties rewards={creatorRewards} withdrawReward={withdrawReward} />
                </Stack>
            </Container>
        </Stack>
    );
};

export default RewardsPage;
