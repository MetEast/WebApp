import React from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import ClaimBox from '../ClaimBox';
import { Icon } from '@iconify/react';

const TransactionReward: React.FC = (): JSX.Element => {
    return (
        <Box borderRadius={3} paddingX={8} paddingY={7} sx={{ background: '#E8F4FF' }}>
            <Grid container columns={10} columnSpacing={8}>
                <Grid item xs={6}>
                    <img src="/assets/images/rewards/transaction-reward-icon.svg" width={42} height={42} alt="" />
                    <Stack direction="row" alignItems="flex-end">
                        <Typography fontSize={40} fontWeight={500} color="#1890FF">
                            Transaction reward
                        </Typography>
                        <Icon icon="ph:question" fontSize={18} color="#1890FF" style={{ marginBottom: 14 }} />
                    </Stack>
                    <Typography fontSize={16} fontWeight={500} color="#1890FF">
                        After self-trading NFT and the transaction is completed, you can get the number of tokens of
                        [(number of tokens released on the day/total transaction volume of the day)*corresponding to NFT
                        transaction volume*05]
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
        </Box>
    );
};

export default TransactionReward;
