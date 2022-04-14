import React from 'react';
import { Stack, Box, Grid, Button, Typography } from '@mui/material';
import ClaimBox from '../ClaimBox';
import { Icon } from '@iconify/react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { BecomeDAOBtn } from './styles';

const GovernanceReward: React.FC = (): JSX.Element => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box borderRadius={3} paddingX={{ xs: 4, md: 8 }} paddingY={{ xs: 4, md: 7 }} sx={{ background: '#185BFF' }}>
            <Grid container columns={10} columnSpacing={8} rowGap={2.5}>
                <Grid item xs={10} md={6}>
                    <Stack
                        direction={{ xs: 'row', md: 'column' }}
                        alignItems={{ xs: 'center', md: 'flex-start' }}
                        spacing={{ xs: 0.5, md: 0 }}
                    >
                        <Icon icon="clarity:settings-line" fontSize={matchDownMd ? 26 : 42} color="white" />
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography fontSize={{ xs: 20, md: 40 }} fontWeight={500} color="white">
                                Governance Rewards
                            </Typography>
                            <Icon
                                icon="ph:question"
                                fontSize={18}
                                color="white"
                                style={{ marginTop: matchDownMd ? 2 : 14 }}
                            />
                            <BecomeDAOBtn>Become DAO</BecomeDAOBtn>
                        </Stack>
                    </Stack>
                    <Typography fontSize={16} fontWeight={500} color="white" marginTop={1}>
                        Those who participate in the governance of the platform or contribute to its construction will
                        receive an additional number of tokens on the following basis:
                    </Typography>
                    <Typography fontSize={16} fontWeight={500} color="white" marginTop={2}>
                        Tokens to be Received = [(#Td/TTVd) X NFT Transaction Volume X 0.1]
                    </Typography>
                </Grid>
                <Grid item xs={10} md={4}>
                    <Typography fontSize={20} fontWeight={500} color="#1890FF">
                        ME{' '}
                        <Typography fontSize={20} fontWeight={500} color="white" display="inline">
                            to be claimed
                        </Typography>
                    </Typography>
                    <ClaimBox sx={{ marginTop: 1.5 }} />
                    <Typography fontSize={14} fontWeight={500} color="white" lineHeight={1.2} marginTop={2.5}>
                        Users can claim rewards every day, or accumulate a one-time claim. Rewards never disappear or
                        expire.
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" marginTop={2}>
                        <Typography fontSize={14} fontWeight={500} color="white">
                            The most recent receipt received:
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
