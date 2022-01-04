import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface ComponentProps {}

const PriceHistoryView: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={22} fontWeight={700}>
                    Price History
                </Typography>
            </Stack>
        </Box>
    );
};

export default PriceHistoryView;
