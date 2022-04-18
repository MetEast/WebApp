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
import { TypeMiningReward } from 'src/types/product-types';

const RewardsPage: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const [signInDlgState, setSignInDlgState] = useSignInContext();
    const [dialogState, setDialogState] = useDialogContext();
    const { enqueueSnackbar } = useSnackbar();
    const walletConnectProvider: WalletConnectProvider = isInAppBrowser()
        ? window.elastos.getWeb3Provider()
        : essentialsConnector.getWalletConnectProvider();
    const { library } = useWeb3React<Web3Provider>();
    const walletConnectWeb3 = new Web3(
        signInDlgState.loginType === '1' ? (walletConnectProvider as any) : (library?.provider as any),
    );
    const [creatorRewards, setCreatorRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [buyerRewards, setBuyerRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [stakerRewards, setStakerRewards] = useState<TypeMiningReward>(blankMiningReward);

    useEffect(() => {
        let unmounted = false;
        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 1, // token
            callType: 2,
            method: 'balanceOf',
            price: '0',
        })
            .then((balance: string) => {
                console.log(balance, '----------')
                if (!unmounted) {
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.meTokenBalance = parseFloat((parseFloat(balance) / 1e18).toFixed(2));
                        return _state;
                    });
                }
                return callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 3, // staking
                    callType: 2,
                    method: 'isStakeholder',
                    price: '0',
                });
            })
            .then((isStakeHolder: string) => {
                if (!unmounted) {
                    setSignInDlgState((prevState: SignInState) => {
                        const _state = { ...prevState };
                        _state.isStakeHolder = Boolean(isStakeHolder);
                        return _state;
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
        return () => {
            unmounted = true;
        };
    }, [dialogState.becomeDAODlgOpened, dialogState.removeDAODlgOpened]);

    useEffect(() => {
        let unmounted = false;
        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 4,
            callType: 2,
            method: 'getTotalRewardAsBuyer',
        })
            .then((_receivedReward: string) => {
                if (!unmounted) {
                    setBuyerRewards((prevState: TypeMiningReward) => {
                        const _state = { ...prevState };
                        _state.receivedReward = parseFloat(parseFloat(_receivedReward).toFixed(2));
                        return _state;
                    });
                }
                return callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 4,
                    callType: 2,
                    method: 'getTotalRewardAsBuyer',
                });
            })
            .then((_availableReward: string) => {
                if (!unmounted) {
                    setBuyerRewards((prevState: TypeMiningReward) => {
                        const _state = { ...prevState };
                        _state.availableToken = parseFloat(parseFloat(_availableReward).toFixed(2));
                        return _state;
                    });
                }
                return callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 4,
                    callType: 2,
                    method: 'getTotalRewardAsBuyer',
                });
            })
            .then((_receivedReward: string) => {
                if (!unmounted) {
                    setCreatorRewards((prevState: TypeMiningReward) => {
                        const _state = { ...prevState };
                        _state.receivedReward = parseFloat(parseFloat(_receivedReward).toFixed(2));
                        return _state;
                    });
                }
                return callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 4,
                    callType: 2,
                    method: 'getTotalRewardAsBuyer',
                });
            })
            .then((_availableReward: string) => {
                if (!unmounted) {
                    setCreatorRewards((prevState: TypeMiningReward) => {
                        const _state = { ...prevState };
                        _state.availableToken = parseFloat(parseFloat(_availableReward).toFixed(2));
                        return _state;
                    });
                }
                return callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 4,
                    callType: 2,
                    method: 'getTotalRewardAsBuyer',
                });
            })
            .then((_receivedReward: string) => {
                if (!unmounted) {
                    setStakerRewards((prevState: TypeMiningReward) => {
                        const _state = { ...prevState };
                        _state.receivedReward = parseFloat(parseFloat(_receivedReward).toFixed(2));
                        return _state;
                    });
                }
                return callTokenomicsContractMethod(walletConnectWeb3, {
                    ...blankContractMethodParam,
                    contractType: 4,
                    callType: 2,
                    method: 'getTotalRewardAsBuyer',
                });
            })
            .then((_availableReward: string) => {
                if (!unmounted) {
                    setStakerRewards((prevState: TypeMiningReward) => {
                        const _state = { ...prevState };
                        _state.availableToken = parseFloat(parseFloat(_availableReward).toFixed(2));
                        return _state;
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
        return () => {
            unmounted = true;
        };
    }, []);

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

        const methodName = rewardType === 1 ? 'withdrawBuyerReward' : (rewardType === 2 ? 'withdrawCreatorReward' : 'withdrawStakerReward')
        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 4,
            callType: 1,
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
                <img src="/assets/images/rewards/banner.png" width="100%" height="100%" alt="" />
                <Box position="absolute" sx={{ inset: 0 }}>
                    <Container sx={{ height: '100%' }}>
                        <Stack height="100%" justifyContent="center" alignItems="flex-start">
                            <Stack direction="row" alignItems="flex-end">
                                <img
                                    src="/assets/images/rewards/met-erc20-token-label.png"
                                    width={matchDownSm ? '70%' : '100%'}
                                    alt=""
                                />
                                <img
                                    src="/assets/images/rewards/help.png"
                                    width={matchDownSm ? 12 : 28}
                                    alt=""
                                    style={{
                                        marginLeft: matchDownSm ? -4 : -12,
                                        marginBottom: matchDownSm ? 12 : 28,
                                    }}
                                />
                            </Stack>
                            <Stack marginLeft={1} marginTop={{ xs: 2, md: 0 }}>
                                <Typography fontSize={{ xs: 16, sm: 36 }} fontWeight={600} color="white">
                                    Mining Pool Total Supply:
                                </Typography>
                                <Typography fontSize={{ xs: 16, sm: 36 }} fontWeight={400} color="white">
                                    250,000,000 ME
                                </Typography>
                                <Typography
                                    fontSize={{ xs: 16, sm: 36 }}
                                    fontWeight={600}
                                    color="white"
                                    marginTop={{ xs: 2, sm: 5 }}
                                >
                                    20% Unlocked:
                                </Typography>
                                <Typography fontSize={{ xs: 16, sm: 36 }} fontWeight={400} color="white">
                                    50,000,000 ME
                                </Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
            </Box>
            <Container sx={{ marginTop: 12 }}>
                <Stack spacing={14}>
                    <TransactionReward rewards={buyerRewards} withdrawReward={withdrawReward} />
                    <GovernanceReward rewards={stakerRewards} withdrawReward={withdrawReward} />
                    <Royalties rewards={creatorRewards} withdrawReward={withdrawReward} />
                </Stack>
            </Container>
        </Stack>
    );
};

export default RewardsPage;
