import React, {useState, useEffect} from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Container from 'src/components/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TransactionReward from 'src/components/Rewards/TransactionReward';
import GovernanceReward from 'src/components/Rewards/GovernanceReward';
import Royalties from 'src/components/Rewards/Royalties';
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
import { blankContractMethodParam, blankMiningReward } from 'src/constants/init-constants';
import { TypeMiningReward } from 'src/types/product-types';

const RewardsPage: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));
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
    const [creatorRewards, setCreatorRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [buyerRewards, setBuyerRewards] = useState<TypeMiningReward>(blankMiningReward);
    const [stakerRewards, setStakerRewards] = useState<TypeMiningReward>(blankMiningReward);

    useEffect(() => {
        let unmounted = false;
        callTokenomicsContractMethod(walletConnectWeb3, {
            ...blankContractMethodParam,
            contractType: 1,
            callType: 2,
            method: 'getTotalRewardAsBuyer',
        }).then((_lastReward: string) => {
            // if (!unmounted) setLastRewards(_lastReward);
            return callTokenomicsContractMethod(walletConnectWeb3, {
                ...blankContractMethodParam,
                contractType: 1,
                callType: 2,
                method: 'getTotalRewardAsBuyer',
            });
        }).then((_receivedReward: string) => {
            // if (!unmounted) setReceivedRewards(_receivedReward);
        });
        return () => {
            unmounted = true;
        };
    }, []);

    const withdrawReward = (rewardType: number) => {

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
