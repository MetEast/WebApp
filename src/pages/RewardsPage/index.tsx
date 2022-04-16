import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import Container from 'src/components/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TransactionReward from 'src/components/Rewards/TransactionReward';
import GovernanceReward from 'src/components/Rewards/GovernanceReward';
import Royalties from 'src/components/Rewards/Royalties';

const RewardsPage: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

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
                    <TransactionReward />
                    <GovernanceReward />
                    <Royalties />
                </Stack>
            </Container>
        </Stack>
    );
};

export default RewardsPage;
