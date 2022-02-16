import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

interface ComponentProps {}

const FilterCard: React.FC<ComponentProps> = (): JSX.Element => {
    return (
        <Stack>
            <Typography fontSize={32} fontWeight={700} sx={{ textTransform: 'none' }}>
                Filters
            </Typography>
        </Stack>
    );
};

export default FilterCard;
