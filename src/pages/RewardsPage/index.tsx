import React from 'react';
import { Box, Stack, Grid, Typography } from '@mui/material';
import Container from 'src/components/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ClaimBox from 'src/components/Rewards/ClaimBox';
import { Icon } from '@iconify/react';

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
                                    style={{ marginLeft: matchDownSm ? -4 : -12, marginBottom: matchDownSm ? 12 : 28 }}
                                />
                            </Stack>
                            <Stack marginLeft={1} marginTop={{ xs: 2, md: 0 }}>
                                <Typography fontSize={{ xs: 16, sm: 36 }} fontWeight={600} color="white">
                                    The total supply of mining pool
                                </Typography>
                                <Typography fontSize={{ xs: 16, sm: 36 }} fontWeight={400} color="white">
                                    1,000,000,000
                                </Typography>
                                <Typography
                                    fontSize={{ xs: 16, sm: 36 }}
                                    fontWeight={600}
                                    color="white"
                                    marginTop={{ xs: 2, sm: 5 }}
                                >
                                    Unlocked 20%
                                </Typography>
                                <Typography fontSize={{ xs: 16, sm: 36 }} fontWeight={400} color="white">
                                    50,000,000
                                </Typography>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>
            </Box>
            <Container sx={{ marginTop: 12 }}>
                <Stack spacing={14}>
                    <Grid
                        container
                        columns={10}
                        paddingX={8}
                        paddingY={7}
                        borderRadius={3}
                        columnSpacing={8}
                        sx={{ background: '#E8F4FF' }}
                    >
                        <Grid item xs={6}>
                            <img src="/assets/images/rewards/transaction-reward.png" width={32} height={32} alt="" />
                            <Stack direction="row" alignItems="flex-end">
                                <Typography fontSize={40} fontWeight={500} color="#1890FF">
                                    Transaction reward
                                </Typography>
                                <Icon icon="ph:question" fontSize={18} color="#1890FF" style={{ marginBottom: 14 }} />
                            </Stack>
                            <Typography fontSize={16} fontWeight={500} color="#1890FF">
                                After self-trading NFT and the transaction is completed, you can get the number of
                                tokens of [(number of tokens released on the day/total transaction volume of the
                                day)*corresponding to NFT transaction volume*05]
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography fontSize={20} fontWeight={500} color="#1890FF">
                                MET{' '}
                                <Typography fontSize={20} fontWeight={500} color="black" display="inline">
                                    to be claimed
                                </Typography>
                            </Typography>
                            <ClaimBox sx={{ marginTop: 1.5 }} />
                            <Typography fontSize={14} fontWeight={500} color="#1890FF" marginTop={2.5}>
                                You can claim rewards every day, or accumulate a one-time claim, your rewards will not
                                disappear.
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" marginTop={2}>
                                <Typography fontSize={14} fontWeight={500} color="#1890FF">
                                    The most recent receipt:
                                </Typography>
                                <Typography fontSize={14} fontWeight={500} color="#1890FF">
                                    --
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" marginTop={0.5}>
                                <Typography fontSize={14} fontWeight={500} color="#1890FF">
                                    Received so far:
                                </Typography>
                                <Typography fontSize={14} fontWeight={500} color="#1890FF">
                                    --
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Stack>
    );
};

export default RewardsPage;
