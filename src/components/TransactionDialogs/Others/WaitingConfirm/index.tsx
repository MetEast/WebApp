import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { DialogTitleTypo } from '../../styles';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';

export interface ComponentProps {}

const WaitingConfirm: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack spacing={5} width={340}>
            <Stack alignItems="center" spacing={3}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                        }}
                        size={40}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                            color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                            animationDuration: '550ms',
                            position: 'absolute',
                            left: 0,
                            [`& .${circularProgressClasses.circle}`]: {
                                strokeLinecap: 'round',
                            },
                        }}
                        size={40}
                        thickness={4}
                    />
                </Box>
                <DialogTitleTypo>Waiting For confirmation...</DialogTitleTypo>
                <Typography fontSize={16} fontWeight={400} textAlign="center">
                    Please confirm this transaction with your wallet to continue.
                </Typography>
            </Stack>
        </Stack>
    );
};

export default WaitingConfirm;
