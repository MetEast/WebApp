import React from 'react';
import { Stack, Box, Grid, Typography } from '@mui/material';
import ClaimBox from '../ClaimBox';
import { Icon } from '@iconify/react';

const GovernanceReward: React.FC = (): JSX.Element => {
    return (
        <Box borderRadius={3} paddingX={8} paddingY={7} sx={{ background: '#185BFF' }}>
            <Grid container columns={10} columnSpacing={8}>
                <Grid item xs={6}>
                    <Icon icon="clarity:settings-line" fontSize={44} color="white" />
                    <Stack direction="row" alignItems="center">
                        <Typography fontSize={40} fontWeight={500} color="white">
                            Governance Rewards
                        </Typography>
                        <Icon icon="ph:question" fontSize={18} color="white" style={{ marginTop: 14 }} />
                        <Typography
                            fontSize={16}
                            fontWeight={700}
                            color="white"
                            padding="6px 13px"
                            marginLeft={2.5}
                            borderRadius={4}
                            sx={{ background: '#FFFFFF33' }}
                        >
                            Become DAO
                        </Typography>
                    </Stack>
                    <Typography fontSize={16} fontWeight={500} color="white">
                        Those who participate in the governance of the platform or share in the construction of the
                        platform will get an additional number of tokens of [(number of tokens released on the day /
                        total transaction volume of the day * corresponding to NFT transaction volume * 0.1].
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography fontSize={20} fontWeight={500} color="#1890FF">
                        MET{' '}
                        <Typography fontSize={20} fontWeight={500} color="white" display="inline">
                            to be claimed
                        </Typography>
                    </Typography>
                    <ClaimBox sx={{ marginTop: 1.5 }} />
                    <Typography fontSize={14} fontWeight={500} color="white" marginTop={2.5}>
                        You can claim rewards every day, or accumulate a one-time claim, your rewards will not
                        disappear.
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" marginTop={2}>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            The most recent receipt:
                        </Typography>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            --
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" marginTop={0.5}>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            Received so far:
                        </Typography>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            --
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" marginTop={0.5}>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            Lock up:
                        </Typography>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            --
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GovernanceReward;
