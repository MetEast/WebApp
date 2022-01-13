import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

const MenuBar: React.FC = (): JSX.Element => {
    return (
        <Stack>
            <Typography fontSize={32} fontWeight={900} color="white" sx={{ textTransform: 'uppercase' }}>
                Meteast
            </Typography>
        </Stack>
    );
};

export default MenuBar;
